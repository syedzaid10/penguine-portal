import mongoose from 'mongoose';

const ChunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    chunkIndex: {
      type: Number,
      default: 0,
    },
    text: {
      type: String,
      required: true,
    },
    embedding: [
      {
        type: Number,
      },
    ],
    metadata: {
      title: { type: String, default: '' },
      station: { type: String, default: '' },
      year: { type: Number },
      type: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Chunk', ChunkSchema);
