import mongoose from 'mongoose';

const DatasetSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      unique: true,
    },
    instrument: {
      type: String,
      default: 'Automated Sensor Suite',
    },
    dateRange: {
      start: { type: Date },
      end: { type: Date },
    },
    units: {
      type: String,
      default: 'SI Standard',
    },
    licence: {
      type: String,
      default: 'Open Government Data (OGD) India / CC-BY 4.0',
    },
    columnHeaders: [
      {
        type: String,
      },
    ],
    previewRows: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    chartConfig: {
      xAxis: { type: String, default: 'timestamp' },
      yAxis: [{ type: String }],
      type: { type: String, default: 'line' },
      unitLabel: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Dataset', DatasetSchema);
