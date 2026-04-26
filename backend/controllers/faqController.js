const Faq = require('../models/Faq');

const validateFaqPayload = (payload) => {
  const errors = [];
  if (!payload.question || String(payload.question).trim().length < 5) {
    errors.push('Question must be at least 5 characters');
  }
  if (!payload.answer || String(payload.answer).trim().length < 10) {
    errors.push('Answer must be at least 10 characters');
  }
  return errors;
};

const createAdminFaq = async (req, res, next) => {
  try {
    const errors = validateFaqPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const faq = await Faq.create({
      question: String(req.body.question).trim(),
      answer:   String(req.body.answer).trim(),
    });

    res.status(201).json({ success: true, data: faq, message: 'FAQ created successfully' });
  } catch (error) {
    next(error);
  }
};

const getAdminFaqs = async (_req, res, next) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: 1 }).lean();
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    next(error);
  }
};

const getAdminFaqById = async (req, res, next) => {
  try {
    const faq = await Faq.findOne({ id: req.params.id }).lean();
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};

const updateAdminFaq = async (req, res, next) => {
  try {
    const errors = validateFaqPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const faq = await Faq.findOneAndUpdate(
      { id: req.params.id },
      {
        question: String(req.body.question).trim(),
        answer:   String(req.body.answer).trim(),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    res.json({ success: true, data: faq, message: 'FAQ updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteAdminFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findOneAndDelete({ id: req.params.id }).lean();
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({ success: true, message: 'FAQ deleted successfully', data: faq });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAdminFaq,
  getAdminFaqs,
  getAdminFaqById,
  updateAdminFaq,
  deleteAdminFaq,
};
