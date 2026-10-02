import express from 'express';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    List all users (Admin only)
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PATCH /api/users/:id/role
// @desc    Change user role (Admin only)
router.patch('/:id/role', protect, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;

    if (!['public', 'scientist', 'editor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'USER_ROLE_CHANGE',
      targetType: 'User',
      targetId: user._id.toString(),
      targetTitle: user.name,
      comment: `Changed role from ${oldRole} to ${role}`,
    });

    res.json({
      success: true,
      message: `User role changed to '${role}'.`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PATCH /api/users/:id/status
// @desc    Approve or reject a pending user account (Admin only)
router.patch('/:id/status', protect, requireRole('admin'), async (req, res) => {
  try {
    const { status, role } = req.body;

    if (!['active', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status specified.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const oldStatus = user.status || 'pending';
    user.status = status;

    if (role && ['public', 'scientist', 'editor', 'admin'].includes(role)) {
      user.role = role;
    }

    if (status === 'active') {
      user.approvedAt = new Date();
      user.approvedBy = req.user._id;
    }

    await user.save();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: status === 'active' ? 'USER_ACCOUNT_APPROVED' : 'USER_ACCOUNT_REJECTED',
      targetType: 'User',
      targetId: user._id.toString(),
      targetTitle: user.name,
      comment: `Changed status from ${oldStatus} to ${status} (Role: ${user.role})`,
    });

    res.json({
      success: true,
      message: `User account is now '${status}'.`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        approvedAt: user.approvedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
