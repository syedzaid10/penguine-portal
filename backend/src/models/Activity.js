import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String, // e.g. '1981-12-06' or '2024-03-15'
      required: true,
    },
    category: {
      type: String,
      enum: ['expedition', 'event', 'announcement'],
      default: 'expedition',
    },
    station: {
      type: String,
      default: 'Antarctica',
    },
    linkedDocuments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],
    linkedMedia: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
      },
    ],
    status: {
      type: String,
      enum: ['Draft', 'In review', 'Published', 'Rejected'],
      default: 'Published',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Activity', ActivitySchema);
