const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const FaqSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

FaqSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Faq', FaqSchema);
