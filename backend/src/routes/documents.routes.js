import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Document from '../models/Document.js';
import Chunk from '../models/Chunk.js';
import AuditLog from '../models/AuditLog.js';
import { protect, requireRole } from '../middleware/auth.js';
import { extractTextFromPDF, splitTextIntoChunks } from '../services/textExtractor.js';
import { getEmbedding } from '../services/aiService.js';
import { transitionStatus } from '../services/workflowService.js';
import { uploadsDir } from '../config/paths.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '_')}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
});

// @route   GET /api/documents
// @desc    Get all documents with sub-second text search & facet filters
router.get('/', async (req, res) => {
  try {
    const { q, station, type, topic, year, status, mySubmissions } = req.query;
    const filter = {};

    // By default, public sees only Published
    if (status && status !== 'all') {
      filter.status = status;
    } else if (!status) {
      filter.status = 'Published';
    }

    if (station && station !== 'all') {
      filter.station = station;
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (year && year !== 'all') {
      filter.year = Number(year);
    }

    if (topic && topic !== 'all') {
      filter.topicTags = { $regex: new RegExp(topic, 'i') };
    }

    // Text search query
    if (q && q.trim()) {
      filter.$or = [
        { title: { $regex: q.trim(), $options: 'i' } },
        { summary: { $regex: q.trim(), $options: 'i' } },
        { topicTags: { $regex: q.trim(), $options: 'i' } },
        { extractedText: { $regex: q.trim(), $options: 'i' } },
        { station: { $regex: q.trim(), $options: 'i' } },
      ];
    }

    // If requesting my submissions (requires auth token header check optionally)
    if (mySubmissions && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET || 'polar_portal_secret_key_prod_2026';
        const decoded = (await import('jsonwebtoken')).default.verify(token, jwtSecret);
        filter.createdBy = decoded.id;
        delete filter.status; // allow scientists to view their Draft, In review, Rejected, etc.
      } catch (e) {
        // continue without mySubmissions filter
      }
    }

    const startTime = Date.now();
    const documents = await Document.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .lean();
    const queryDurationMs = Date.now() - startTime;

    res.json({
      success: true,
      count: documents.length,
      queryDurationMs,
      data: documents,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/documents/:id
// @desc    Get single document details
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate('createdBy', 'name email role');
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Also get total indexed chunks count
    const chunksCount = await Chunk.countDocuments({ documentId: document._id });

    res.json({
      success: true,
      data: document,
      chunksCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/documents
// @desc    Upload new document, extract text, auto-chunk, embed, save as Draft
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const { title, summary, type, station, topicTags, year, authorName, extractedTextInput } = req.body;

    if (!title || !summary || !type || !year) {
      return res.status(400).json({
        success: false,
        message: 'Title, summary, type, and year are required.',
      });
    }

    let fileUrl = '';
    let fileName = '';
    let fileSize = '';
    let extractedText = extractedTextInput || '';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;

      // If PDF, extract text
      if (req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf')) {
        try {
          const fileBuffer = fs.readFileSync(req.file.path);
          const pdfText = await extractTextFromPDF(fileBuffer);
          if (pdfText) {
            extractedText = (extractedText ? extractedText + '\n\n' : '') + pdfText;
          }
        } catch (pdfErr) {
          console.warn('PDF extraction warning:', pdfErr.message);
        }
      }
    }

    const parsedTags = Array.isArray(topicTags)
      ? topicTags
      : typeof topicTags === 'string'
      ? topicTags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const document = await Document.create({
      title,
      summary,
      type,
      station: station || 'Maitri',
      topicTags: parsedTags,
      year: Number(year),
      authorName: authorName || req.user.name,
      fileUrl,
      fileName,
      fileSize,
      extractedText,
      status: 'Draft',
      createdBy: req.user._id,
    });

    // Chunk text & create embeddings
    const textToChunk = (summary + '\n\n' + extractedText).trim();
    const chunks = splitTextIntoChunks(textToChunk, 280, 40);

    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const embedding = await getEmbedding(c.text);
      await Chunk.create({
        documentId: document._id,
        chunkIndex: i,
        text: c.text,
        embedding,
        metadata: {
          title: document.title,
          station: document.station,
          year: document.year,
          type: document.type,
        },
      });
    }

    // Record creation in AuditLog
    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'UPLOAD',
      targetType: 'Document',
      targetId: document._id.toString(),
      targetTitle: document.title,
      newStatus: 'Draft',
      details: {
        fileName,
        chunksCreated: chunks.length,
      },
    });

    res.status(201).json({
      success: true,
      message: `Document created as Draft with ${chunks.length} indexed chunks.`,
      data: document,
    });
  } catch (err) {
    console.error('Error creating document:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/documents/:id/transition
// @desc    Strict workflow status transition (Draft -> In review -> Published / Rejected)
router.post('/:id/transition', protect, async (req, res) => {
  try {
    const { newStatus, comment } = req.body;

    if (!newStatus) {
      return res.status(400).json({ success: false, message: 'newStatus is required.' });
    }

    const result = await transitionStatus({
      targetType: 'Document',
      targetId: req.params.id,
      newStatus,
      user: req.user,
      comment,
    });

    res.json({
      success: true,
      message: `Status updated to '${newStatus}' successfully.`,
      data: result.item,
      auditEntry: result.auditEntry,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/documents/:id
// @desc    Update document metadata
router.put('/:id', protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Only owner or editor/admin can update
    if (doc.createdBy.toString() !== req.user._id.toString() && !['editor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this document' });
    }

    const { title, summary, topicTags, station, year, authorName } = req.body;
    if (title) doc.title = title;
    if (summary) doc.summary = summary;
    if (station) doc.station = station;
    if (year) doc.year = Number(year);
    if (authorName) doc.authorName = authorName;
    if (topicTags) {
      doc.topicTags = Array.isArray(topicTags)
        ? topicTags
        : topicTags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    await doc.save();
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete document (Admin only)
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    await Chunk.deleteMany({ documentId: doc._id });
    await doc.deleteOne();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'DELETE',
      targetType: 'Document',
      targetId: req.params.id,
      targetTitle: doc.title,
      comment: 'Deleted by administrator',
    });

    res.json({ success: true, message: 'Document and indexed chunks deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
