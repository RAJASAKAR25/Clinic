const express     = require('express');
const router      = express.Router();
const Testimonial = require('../models/Testimonial');

// GET /api/testimonials — public list of all testimonials
router.get('/', async (_req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: 1 }).lean();
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
