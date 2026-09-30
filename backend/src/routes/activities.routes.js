import express from 'express';
import Activity from '../models/Activity.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/activities
// @desc    Get all activities (expedition timeline, events, milestones)
router.get('/', async (req, res) => {
  try {
    const { category, station } = req.query;
    const filter = { status: 'Published' };

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (station && station !== 'all') {
      filter.station = station;
    }

    const activities = await Activity.find(filter)
      .populate('linkedDocuments', 'title year type station')
      .populate('linkedMedia', 'title fileUrl type caption')
      .sort({ date: 1 });

    res.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/activities
// @desc    Create new activity (Editor/Admin)
router.post('/', protect, requireRole('editor', 'admin'), async (req, res) => {
  try {
    const { title, description, date, category, station, linkedDocuments, linkedMedia } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ success: false, message: 'Title, description, and date are required.' });
    }

    const activity = await Activity.create({
      title,
      description,
      date,
      category: category || 'expedition',
      station: station || 'Antarctica',
      linkedDocuments: linkedDocuments || [],
      linkedMedia: linkedMedia || [],
      status: 'Published',
    });

    res.status(201).json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
