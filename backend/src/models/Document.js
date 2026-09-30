import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['report', 'publication', 'dataset'],
      required: true,
    },
    station: {
      type: String,
      enum: [
        'Dakshin Gangotri',
        'Maitri',
        'Bharati',
        'Himadri',
        'IndARC',
        'Southern Ocean',
        'All Stations',
        'Other'
      ],
      default: 'Maitri',
    },
    topicTags: [
      {
        type: String,
        trim: true,
      },
    ],
    year: {
      type: Number,
      required: true,
    },
    fileUrl: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    fileSize: {
      type: String,
      default: '',
    },
    extractedText: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Draft', 'In review', 'Published', 'Rejected'],
      default: 'Draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      default: 'NCPOR Scientific Team',
    },
    reviewComment: {
      type: String,
      default: '',
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB text index for instant sub-second multi-field keyword search
DocumentSchema.index({
  title: 'text',
  summary: 'text',
  topicTags: 'text',
  extractedText: 'text',
});

export default mongoose.model('Document', DocumentSchema);
