import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/audit-logs
// @desc    Get complete audit log trail (Admin only)
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const { action, targetType, userRole, q, limit = 100, page = 1 } = req.query;
    const filter = {};

    if (action && action !== 'all') {
      filter.action = action;
    }
    if (targetType && targetType !== 'all') {
      filter.targetType = targetType;
    }
    if (userRole && userRole !== 'all') {
      filter.userRole = userRole;
    }

    if (q && q.trim()) {
      filter.$or = [
        { userName: { $regex: q.trim(), $options: 'i' } },
        { targetTitle: { $regex: q.trim(), $options: 'i' } },
        { comment: { $regex: q.trim(), $options: 'i' } },
      ];
    }

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: logs,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
