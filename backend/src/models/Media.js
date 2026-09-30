import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      default: '',
    },
    credit: {
      type: String,
      default: 'National Centre for Polar and Ocean Research (NCPOR) / MoES',
    },
    type: {
      type: String,
      enum: ['photo', 'video'],
      default: 'photo',
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
    year: {
      type: Number,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['Draft', 'In review', 'Published', 'Rejected'],
      default: 'Published',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Media', MediaSchema);
