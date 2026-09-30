import express from 'express';
import Story from '../models/Story.js';
import { protect, requireRole } from '../middleware/auth.js';
import { transitionStatus } from '../services/workflowService.js';

const router = express.Router();

// @route   GET /api/stories
// @desc    Get published news, press releases, and editorial stories
router.get('/', async (req, res) => {
  try {
    const { language, featured, status } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    } else if (!status) {
      filter.status = 'Published';
    }

    if (language) {
      filter.language = language;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    const stories = await Story.find(filter).sort({ publishedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/stories/:id
// @desc    Get single story detail
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    res.json({ success: true, data: story });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/stories
// @desc    Create story (Editor/Admin)
router.post('/', protect, requireRole('editor', 'admin'), async (req, res) => {
  try {
    const { title, summary, body, coverImage, language, category, featured } = req.body;

    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Title and body are required.' });
    }

    const story = await Story.create({
      title,
      summary: summary || '',
      body,
      coverImage: coverImage || '',
      language: language || 'en',
      category: category || 'Press Release',
      featured: featured === true,
      status: 'Published',
      author: req.user.name,
      publishedAt: new Date(),
    });

    res.status(201).json({ success: true, data: story });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/stories/:id/transition
// @desc    Workflow status transition
router.post('/:id/transition', protect, async (req, res) => {
  try {
    const { newStatus, comment } = req.body;
    const result = await transitionStatus({
      targetType: 'Story',
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
