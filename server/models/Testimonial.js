const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const TestimonialSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

TestimonialSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
