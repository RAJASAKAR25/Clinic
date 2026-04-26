const express = require('express');
const router  = express.Router();
const { createMessage } = require('../controllers/contactController');
const { contactValidation } = require('../middleware/validation');

// POST /api/contact  — submit a contact message
router.post('/', contactValidation, createMessage);

module.exports = router;
