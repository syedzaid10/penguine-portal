import express from 'express';
import multer from 'multer';
import path from 'path';
import Media from '../models/Media.js';
import AuditLog from '../models/AuditLog.js';
import { protect } from '../middleware/auth.js';
import { transitionStatus } from '../services/workflowService.js';
import { uploadsDir } from '../config/paths.js';

const router = express.Router();
const upload = multer({ dest: uploadsDir });

// @route   GET /api/media
// @desc    Get polar media (photos and videos) with station, year, type filters
router.get('/', async (req, res) => {
  try {
    const { station, type, year, status } = req.query;
    const filter = {};

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

    const items = await Media.find(filter).sort({ year: -1, createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/media/:id
// @desc    Get media item detail
router.get('/:id', async (req, res) => {
  try {
    const item = await Media.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/media
// @desc    Upload media item
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const { title, caption, credit, type, station, year, tags, externalUrl } = req.body;

    if (!title || !year) {
      return res.status(400).json({ success: false, message: 'Title and year are required.' });
    }

    let fileUrl = externalUrl || '';
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    if (!fileUrl) {
      return res.status(400).json({ success: false, message: 'A media file or external URL is required.' });
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const media = await Media.create({
      title,
      caption: caption || '',
      credit: credit || 'NCPOR / MoES',
      type: type || 'photo',
      station: station || 'Maitri',
      year: Number(year),
      fileUrl,
      thumbnailUrl: fileUrl,
      tags: parsedTags,
      status: 'Draft',
      createdBy: req.user._id,
    });

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'UPLOAD',
      targetType: 'Media',
      targetId: media._id.toString(),
      targetTitle: media.title,
      newStatus: 'Draft',
    });

    res.status(201).json({ success: true, data: media });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/media/:id/transition
// @desc    Strict workflow status transition
router.post('/:id/transition', protect, async (req, res) => {
  try {
    const { newStatus, comment } = req.body;
    const result = await transitionStatus({
      targetType: 'Media',
      targetId: req.params.id,
      newStatus,
      user: req.user,
      comment,
    });

    res.json({ success: true, data: result.item, auditEntry: result.auditEntry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
