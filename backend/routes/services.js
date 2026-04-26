const express = require('express');
const router  = express.Router();
const { getServices, getService } = require('../controllers/serviceController');

// GET /api/services        — all services
router.get('/', getServices);

// GET /api/services/:slug  — single service by slug
router.get('/:slug', getService);

module.exports = router;
