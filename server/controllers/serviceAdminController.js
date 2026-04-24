const Service = require('../models/Service');

const validateServicePayload = (payload) => {
  const errors = [];

  if (!payload.title || String(payload.title).trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  if (!payload.slug || String(payload.slug).trim().length < 3) {
    errors.push('Slug must be at least 3 characters');
  }
  if (!payload.description || String(payload.description).trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }
  if (!payload.price || String(payload.price).trim().length < 3) {
    errors.push('Price is required');
  }

  return errors;
};

const createAdminService = async (req, res, next) => {
  try {
    const errors = validateServicePayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const service = await Service.create({
      title:           String(req.body.title).trim(),
      slug:            String(req.body.slug).trim().toLowerCase(),
      description:     String(req.body.description).trim(),
      longDescription: String(req.body.longDescription || '').trim(),
      icon:            String(req.body.icon || 'sparkles').trim(),
      color:           String(req.body.color || 'blue').trim(),
      duration:        String(req.body.duration || '').trim(),
      price:           String(req.body.price).trim(),
      benefits:        Array.isArray(req.body.benefits) ? req.body.benefits : [],
    });

    res.status(201).json({ success: true, data: service, message: 'Service created successfully' });
  } catch (error) {
    next(error);
  }
};

const getAdminServices = async (_req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 }).lean();
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

const getAdminServiceById = async (req, res, next) => {
  try {
    const service = await Service.findOne({ id: req.params.id }).lean();
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

const updateAdminService = async (req, res, next) => {
  try {
    const errors = validateServicePayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const service = await Service.findOneAndUpdate(
      { id: req.params.id },
      {
        title:           String(req.body.title).trim(),
        slug:            String(req.body.slug).trim().toLowerCase(),
        description:     String(req.body.description).trim(),
        longDescription: String(req.body.longDescription || '').trim(),
        icon:            String(req.body.icon || 'sparkles').trim(),
        color:           String(req.body.color || 'blue').trim(),
        duration:        String(req.body.duration || '').trim(),
        price:           String(req.body.price).trim(),
        benefits:        Array.isArray(req.body.benefits) ? req.body.benefits : [],
      },
      { new: true, runValidators: true }
    ).lean();

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, data: service, message: 'Service updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteAdminService = async (req, res, next) => {
  try {
    const service = await Service.findOneAndDelete({ id: req.params.id }).lean();
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully', data: service });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAdminService,
  getAdminServices,
  getAdminServiceById,
  updateAdminService,
  deleteAdminService,
};
