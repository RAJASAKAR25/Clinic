const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ServiceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    longDescription: {
      type: String,
      trim: true,
      default: '',
    },
    icon: {
      type: String,
      trim: true,
      default: 'sparkles',
    },
    color: {
      type: String,
      trim: true,
      default: 'blue',
    },
    duration: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    benefits: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ServiceSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Service', ServiceSchema);
