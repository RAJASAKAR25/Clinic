const { body, validationResult } = require('express-validator');

/**
 * Run after validation chain to collect errors and return 400 if any exist.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── Appointment Validation ────────────────────────────────────────────────────
const appointmentValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number'),

  body('email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Enter a valid email address')
    .normalizeEmail()
    .isLength({ max: 200 }),

  body('date')
    .notEmpty().withMessage('Preferred date is required')
    .isISO8601().withMessage('Invalid date format (expected YYYY-MM-DD)'),

  body('time')
    .trim()
    .notEmpty().withMessage('Preferred time is required')
    .isLength({ max: 20 }).withMessage('Invalid time value'),

  body('service')
    .trim()
    .notEmpty().withMessage('Please select a service')
    .isLength({ max: 100 }).withMessage('Invalid service selection'),

  body('message')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Message must be under 500 characters')
    .escape(),

  handleValidationErrors,
];

// ── Contact Form Validation ───────────────────────────────────────────────────
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Enter a valid email address')
    .normalizeEmail()
    .isLength({ max: 200 }),

  body('subject')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('Subject must be under 200 characters')
    .escape(),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Message must be 10–1000 characters')
    .escape(),

  handleValidationErrors,
];

// ── Admin Login Validation ────────────────────────────────────────────────────
const adminLoginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ max: 50 })
    .escape(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ max: 100 }),

  handleValidationErrors,
];

module.exports = { appointmentValidation, contactValidation, adminLoginValidation };
