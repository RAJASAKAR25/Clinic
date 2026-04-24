const express = require('express');
const router  = express.Router();
const { createAppointment, getAppointment } = require('../controllers/appointmentController');
const { appointmentValidation } = require('../middleware/validation');

// POST /api/appointments  — book an appointment
router.post('/', appointmentValidation, createAppointment);

// GET  /api/appointments/:id — retrieve confirmation details
router.get('/:id', getAppointment);

module.exports = router;
