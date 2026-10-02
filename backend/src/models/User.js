import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['public', 'scientist', 'editor', 'admin'],
    default: 'public',
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected'],
    default: 'active',
  },
  requestedRole: {
    type: String,
    enum: ['public', 'scientist', 'editor', 'admin', ''],
    default: '',
  },
  department: {
    type: String,
    default: 'National Centre for Polar and Ocean Research (NCPOR)',
  },
  avatar: {
    type: String,
    default: '',
  },
  approvedAt: {
    type: Date,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

export default mongoose.model('User', UserSchema);
