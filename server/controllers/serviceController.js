const Service = require('../models/Service');

/**
 * GET /api/services
 * Returns the full list of dental services.
 */
const getServices = async (_req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 }).lean();
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/services/:slug
 * Returns a single service by its URL slug.
 */
const getService = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug }).lean();

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

module.exports = { getServices, getService };
