import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Document from '../models/Document.js';
import Dataset from '../models/Dataset.js';
import Chunk from '../models/Chunk.js';
import AuditLog from '../models/AuditLog.js';
import { protect } from '../middleware/auth.js';
import { parseCSV, splitTextIntoChunks } from '../services/textExtractor.js';
import { getEmbedding } from '../services/aiService.js';
import { transitionStatus } from '../services/workflowService.js';
import { uploadsDir } from '../config/paths.js';

const router = express.Router();

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// @route   GET /api/datasets
// @desc    List all datasets with populated document metadata
router.get('/', async (req, res) => {
  try {
    const { station, status } = req.query;
    const docFilter = { type: 'dataset' };

    if (status && status !== 'all') {
      docFilter.status = status;
    } else if (!status) {
      docFilter.status = 'Published';
    }

    if (station && station !== 'all') {
      docFilter.station = station;
    }

    const docs = await Document.find(docFilter).sort({ createdAt: -1 }).lean();
    const docIds = docs.map((d) => d._id);

    const datasets = await Dataset.find({ documentId: { $in: docIds } }).lean();
    const datasetMap = new Map();
    datasets.forEach((ds) => datasetMap.set(ds.documentId.toString(), ds));

    const combined = docs.map((doc) => {
      const extra = datasetMap.get(doc._id.toString()) || {};
      return {
        ...doc,
        datasetDetails: extra,
      };
    });

    res.json({
      success: true,
      count: combined.length,
      data: combined,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/datasets/:id
// @desc    Get detailed dataset with preview rows and chart configuration
router.get('/:id', async (req, res) => {
  try {
    let dataset = await Dataset.findById(req.params.id).populate('documentId');

    // Also allow finding by parent documentId
    if (!dataset) {
      dataset = await Dataset.findOne({ documentId: req.params.id }).populate('documentId');
    }

    if (!dataset) {
      return res.status(404).json({ success: false, message: 'Dataset not found' });
    }

    res.json({
      success: true,
      data: dataset,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/datasets
// @desc    Upload CSV, parse preview rows and metadata, save as Draft dataset
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const {
      title,
      summary,
      station,
      topicTags,
      year,
      instrument,
      units,
      licence,
      dateStart,
      dateEnd,
    } = req.body;

    if (!title || !summary || !year) {
      return res.status(400).json({
        success: false,
        message: 'Title, summary, and year are required.',
      });
    }

    let columnHeaders = [];
    let previewRows = [];
    let totalRows = 0;
    let fileUrl = '';
    let fileName = '';
    let fileSize = '';
    let extractedText = '';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = `${(req.file.size / 1024).toFixed(1)} KB`;

      const csvContent = fs.readFileSync(req.file.path, 'utf-8');
      const parsed = parseCSV(csvContent, 50);
      columnHeaders = parsed.columnHeaders;
      previewRows = parsed.previewRows;
      totalRows = parsed.totalRows;

      extractedText = `Dataset: ${title}\nColumns: ${columnHeaders.join(', ')}\nSample Count: ${totalRows}\nUnits: ${units || 'Standard'}\n` +
        JSON.stringify(previewRows.slice(0, 5));
    }

    const parsedTags = Array.isArray(topicTags)
      ? topicTags
      : typeof topicTags === 'string'
      ? topicTags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Polar Telemetry', 'Dataset'];

    // 1. Create Document base
    const document = await Document.create({
      title,
      summary,
      type: 'dataset',
      station: station || 'Maitri',
      topicTags: parsedTags,
      year: Number(year),
      fileUrl,
      fileName,
      fileSize,
      extractedText,
      status: 'Draft',
      createdBy: req.user._id,
    });

    // Determine auto-chart configuration based on headers
    let chartConfig = {
      xAxis: columnHeaders[0] || 'time',
      yAxis: columnHeaders.slice(1, 3),
      type: 'line',
      unitLabel: units || '',
    };

    // 2. Create Dataset record
    const dataset = await Dataset.create({
      documentId: document._id,
      instrument: instrument || 'Automated Station Monitor',
      units: units || 'SI Standard',
      licence: licence || 'Open Government Data (OGD) India / CC-BY 4.0',
      dateRange: {
        start: dateStart ? new Date(dateStart) : new Date(`${year}-01-01`),
        end: dateEnd ? new Date(dateEnd) : new Date(`${year}-12-31`),
      },
      columnHeaders,
      previewRows,
      chartConfig,
    });

    // 3. Chunk and embed metadata for RAG
    const textToChunk = `${title}. Summary: ${summary}. Instrument: ${instrument}. Station: ${station}. Units: ${units}. Parameters measured: ${columnHeaders.join(', ')}.`;
    const chunks = splitTextIntoChunks(textToChunk, 250, 30);

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await getEmbedding(chunks[i].text);
      await Chunk.create({
        documentId: document._id,
        chunkIndex: i,
        text: chunks[i].text,
        embedding,
        metadata: {
          title: document.title,
          station: document.station,
          year: document.year,
          type: 'dataset',
        },
      });
    }

    // 4. Audit Log
    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'UPLOAD',
      targetType: 'Dataset',
      targetId: dataset._id.toString(),
      targetTitle: document.title,
      newStatus: 'Draft',
      details: {
        totalRows,
        columnCount: columnHeaders.length,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Dataset uploaded and preview generated as Draft.',
      data: {
        ...document.toObject(),
        datasetDetails: dataset,
      },
    });
  } catch (err) {
    console.error('Error creating dataset:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/datasets/:id/transition
// @desc    Strict workflow status transition
router.post('/:id/transition', protect, async (req, res) => {
  try {
    const { newStatus, comment } = req.body;
    const result = await transitionStatus({
      targetType: 'Dataset',
      targetId: req.params.id,
      newStatus,
      user: req.user,
      comment,
    });

    res.json({
      success: true,
      message: `Dataset status transitioned to '${newStatus}'.`,
      data: result.item,
      auditEntry: result.auditEntry,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
