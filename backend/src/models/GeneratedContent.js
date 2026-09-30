import mongoose from 'mongoose';

const GeneratedContentSchema = new mongoose.Schema(
  {
    sourceItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    channel: {
      type: String,
      enum: ['website', 'press release', 'X', 'LinkedIn', 'Instagram'],
      required: true,
    },
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en',
    },
    text: {
      type: String,
      required: true,
    },
    editedText: {
      type: String,
      default: '',
    },
    hashtags: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['Draft', 'In review', 'Published', 'Rejected'],
      default: 'Draft',
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewComment: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('GeneratedContent', GeneratedContentSchema);
