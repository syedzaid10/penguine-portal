import express from 'express';
import Document from '../models/Document.js';
import GeneratedContent from '../models/GeneratedContent.js';
import AuditLog from '../models/AuditLog.js';
import { protect, requireRole } from '../middleware/auth.js';
import { generateContentStudioOutputs } from '../services/aiService.js';
import { transitionStatus } from '../services/workflowService.js';

const router = express.Router();

// @route   POST /api/content-studio/generate
// @desc    Generate multi-channel content (website, press release, X, LinkedIn, Instagram) in EN & HI
router.post('/generate', protect, requireRole('editor', 'admin', 'scientist'), async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, message: 'Source itemId is required.' });
    }

    const document = await Document.findById(itemId);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Source document not found.' });
    }

    const generated = await generateContentStudioOutputs(document);

    // Audit the AI generation event
    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'CONTENT_GENERATE',
      targetType: 'Document',
      targetId: document._id.toString(),
      targetTitle: document.title,
      details: {
        channels: ['website', 'press release', 'X', 'LinkedIn', 'Instagram'],
        languages: ['en', 'hi'],
      },
    });

    res.json({
      success: true,
      data: generated,
      sourceDocument: {
        id: document._id,
        title: document.title,
        station: document.station,
        year: document.year,
        topicTags: document.topicTags,
      },
    });
  } catch (err) {
    console.error('Content studio generation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/content-studio/save
// @desc    Save an edited channel draft to GeneratedContent
router.post('/save', protect, requireRole('editor', 'admin', 'scientist'), async (req, res) => {
  try {
    const { sourceItemId, channel, language, text, hashtags, status = 'Draft' } = req.body;

    if (!sourceItemId || !channel || !text) {
      return res.status(400).json({
        success: false,
        message: 'sourceItemId, channel, and text are required.',
      });
    }

    const item = await GeneratedContent.create({
      sourceItem: sourceItemId,
      channel,
      language: language || 'en',
      text,
      editedText: text,
      hashtags: hashtags || [],
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Generated content saved as Draft.',
      data: item,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/content-studio/item/:itemId
// @desc    Get all generated items for a specific document
router.get('/item/:itemId', protect, async (req, res) => {
  try {
    const items = await GeneratedContent.find({ sourceItem: req.params.itemId })
      .populate('reviewedBy', 'name email')
      .sort({ generatedAt: -1 });

    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/content-studio/:id/transition
// @desc    Transition status of generated content
router.post('/:id/transition', protect, async (req, res) => {
  try {
    const { newStatus, comment } = req.body;
    const result = await transitionStatus({
      targetType: 'GeneratedContent',
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
