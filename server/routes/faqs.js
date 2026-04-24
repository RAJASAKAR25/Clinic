const express = require('express');
const router  = express.Router();
const Faq     = require('../models/Faq');

// GET /api/faqs — public list of all FAQs
router.get('/', async (_req, res, next) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: 1 }).lean();
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
