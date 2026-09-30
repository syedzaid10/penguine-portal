import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      default: '',
    },
    body: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en',
    },
    status: {
      type: String,
      enum: ['Draft', 'In review', 'Published', 'Rejected'],
      default: 'Published',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    author: {
      type: String,
      default: 'Polar Editorial Desk',
    },
    category: {
      type: String,
      default: 'Research Update',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Story', StorySchema);
