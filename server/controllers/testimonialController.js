const Testimonial = require('../models/Testimonial');

const validateTestimonialPayload = (payload) => {
  const errors = [];

  if (!payload.name || String(payload.name).trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!payload.text || String(payload.text).trim().length < 10) {
    errors.push('Testimonial text must be at least 10 characters');
  }
  if (!payload.location || String(payload.location).trim().length < 2) {
    errors.push('Location is required');
  }

  const rating = Number(payload.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.push('Rating must be an integer between 1 and 5');
  }

  return errors;
};

const createAdminTestimonial = async (req, res, next) => {
  try {
    const errors = validateTestimonialPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const testimonial = await Testimonial.create({
      name:     String(req.body.name).trim(),
      text:     String(req.body.text).trim(),
      location: String(req.body.location).trim(),
      rating:   Number(req.body.rating),
    });

    res.status(201).json({ success: true, data: testimonial, message: 'Testimonial created successfully' });
  } catch (error) {
    next(error);
  }
};

const getAdminTestimonials = async (_req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: 1 }).lean();
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

const getAdminTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findOne({ id: req.params.id }).lean();
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

const updateAdminTestimonial = async (req, res, next) => {
  try {
    const errors = validateTestimonialPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const testimonial = await Testimonial.findOneAndUpdate(
      { id: req.params.id },
      {
        name:     String(req.body.name).trim(),
        text:     String(req.body.text).trim(),
        location: String(req.body.location).trim(),
        rating:   Number(req.body.rating),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.json({ success: true, data: testimonial, message: 'Testimonial updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteAdminTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findOneAndDelete({ id: req.params.id }).lean();
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, message: 'Testimonial deleted successfully', data: testimonial });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAdminTestimonial,
  getAdminTestimonials,
  getAdminTestimonialById,
  updateAdminTestimonial,
  deleteAdminTestimonial,
};
