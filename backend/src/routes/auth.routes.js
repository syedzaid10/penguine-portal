import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'polar_portal_secret_key_prod_2026', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        status: 'pending',
        message: `Your account registration as ${user.role.toUpperCase()} is currently pending verification and approval by an administrator. Please check back soon or contact NCPOR/MoES administration.`,
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        status: 'rejected',
        message: 'Your institutional account registration request was not approved. Please contact NCPOR administration.',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user (public accounts active immediately; scientist/editor require admin approval)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'public', department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    // Protect against registering as admin directly
    const assignedRole = ['public', 'scientist', 'editor'].includes(role) ? role : 'public';
    const isInstantActivation = assignedRole === 'public';
    const status = isInstantActivation ? 'active' : 'pending';

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: assignedRole,
      requestedRole: assignedRole,
      status,
      department: department || (isInstantActivation ? 'Public Scholar / Guest' : 'National Centre for Polar and Ocean Research (NCPOR)'),
    });

    if (isInstantActivation) {
      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        requiresApproval: false,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          department: user.department,
        },
        message: 'Account created successfully! Welcome to Penguine Polar Portal.',
      });
    }

    // Institutional roles require admin approval
    return res.status(201).json({
      success: true,
      requiresApproval: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
      },
      message: `Registration submitted! Because you applied for the ${assignedRole.toUpperCase()} role, your institutional credentials must be reviewed and approved by an MoES/NCPOR administrator before you can sign in.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// @route   GET /api/auth/demo-users
// @desc    Retrieve demo user tokens for quick 1-click role switching during presentation
router.get('/demo-users', async (req, res) => {
  try {
    const users = await User.find({
      email: {
        $in: [
          'admin@penguine.gov.in',
          'editor@penguine.gov.in',
          'scientist@penguine.gov.in',
          'visitor@penguine.gov.in',
          'admin@polarportal.gov.in',
          'editor@polarportal.gov.in',
          'scientist@polarportal.gov.in',
          'visitor@polarportal.gov.in',
        ],
      },
    });

    const demoAccounts = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      token: generateToken(u._id),
      department: u.department,
    }));

    res.json({
      success: true,
      demoAccounts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
