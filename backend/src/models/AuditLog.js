import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
      default: 'System',
    },
    userRole: {
      type: String,
      default: 'system',
    },
    action: {
      type: String,
      required: true,
      enum: [
        'CREATE',
        'STATUS_CHANGE',
        'CONTENT_GENERATE',
        'CONTENT_APPROVE',
        'DELETE',
        'USER_ROLE_CHANGE',
        'USER_ACCOUNT_APPROVED',
        'USER_ACCOUNT_REJECTED',
        'UPLOAD',
      ],
    },
    targetType: {
      type: String,
      required: true,
      enum: ['Document', 'Dataset', 'Media', 'Story', 'GeneratedContent', 'User'],
    },
    targetId: {
      type: String,
      required: true,
    },
    targetTitle: {
      type: String,
      default: '',
    },
    oldStatus: {
      type: String,
      default: '',
    },
    newStatus: {
      type: String,
      default: '',
    },
    comment: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('AuditLog', AuditLogSchema);
