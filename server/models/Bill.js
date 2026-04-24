const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const TreatmentItemSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true, trim: true },
    toothNo: { type: String, trim: true, default: '' },
    amount: { type: Number, default: 0 },
  },
  { _id: false }
);

const BillSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    billNo: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    treatments: {
      type: [TreatmentItemSchema],
      default: [],
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    amountInWords: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

BillSchema.index({ createdAt: -1 });
BillSchema.index({ date: -1 });

module.exports = mongoose.model('Bill', BillSchema);
