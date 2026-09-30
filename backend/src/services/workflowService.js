import AuditLog from '../models/AuditLog.js';
import Document from '../models/Document.js';
import Dataset from '../models/Dataset.js';
import Media from '../models/Media.js';
import Story from '../models/Story.js';
import GeneratedContent from '../models/GeneratedContent.js';

// Valid transitions mapping
const VALID_TRANSITIONS = {
  Draft: ['In review'],
  'In review': ['Published', 'Rejected', 'Draft'],
  Published: ['Draft'],
  Rejected: ['Draft'],
};

// Map targetType to Mongoose model
const MODEL_MAP = {
  Document,
  Dataset,
  Media,
  Story,
  GeneratedContent,
};

/**
 * The ONLY service function authorized to transition an item's status.
 * Automatically validates transition rules and records an immutable audit log entry.
 */
export async function transitionStatus({
  targetType,
  targetId,
  newStatus,
  user,
  comment = '',
}) {
  const Model = MODEL_MAP[targetType];
  if (!Model) {
    throw new Error(`Invalid target type: ${targetType}`);
  }

  const item = await Model.findById(targetId);
  if (!item) {
    throw new Error(`${targetType} with ID ${targetId} not found.`);
  }

  const currentStatus = item.status || 'Draft';

  // Role permissions check
  if (['Published', 'Rejected'].includes(newStatus)) {
    if (!['editor', 'admin'].includes(user.role)) {
      throw new Error(`Only Editors and Admins can transition items to '${newStatus}'.`);
    }
  }

  if (newStatus === 'Rejected' && (!comment || comment.trim().length === 0)) {
    throw new Error('A review comment is required when rejecting an item.');
  }

  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Illegal transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowed.join(', ') || 'None'}`
    );
  }

  // Perform status update
  item.status = newStatus;
  if (comment) {
    item.reviewComment = comment;
  }
  if (newStatus === 'Published') {
    item.publishedAt = new Date();
  }
  await item.save();

  // If Dataset, also sync parent Document status if applicable
  if (targetType === 'Dataset' && item.documentId) {
    await Document.findByIdAndUpdate(item.documentId, {
      status: newStatus,
      reviewComment: comment,
    });
  }

  // Create immutable Audit Log
  const auditEntry = await AuditLog.create({
    userId: user._id,
    userName: user.name,
    userRole: user.role,
    action: 'STATUS_CHANGE',
    targetType,
    targetId: item._id.toString(),
    targetTitle: item.title || item.channel || `${targetType} Item`,
    oldStatus: currentStatus,
    newStatus,
    comment,
    details: {
      performedBy: user.email,
      timestamp: new Date().toISOString(),
    },
  });

  return {
    item,
    auditEntry,
  };
}
