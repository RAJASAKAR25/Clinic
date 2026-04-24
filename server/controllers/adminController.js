const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const config   = require('../config');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');

/**
 * POST /api/admin/login
 * Verifies admin credentials and returns a signed JWT.
 */
const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const adminUsername      = config.admin.username;
    const adminPasswordHash  = config.admin.passwordHash;
    const adminPasswordPlain = config.admin.password;

    let isValid = false;

    if (adminPasswordHash) {
      // Prefer bcrypt comparison when a hash is configured
      isValid = username === adminUsername && (await bcrypt.compare(password, adminPasswordHash));
    } else {
      // Plain-text fallback (development only — always use a hash in production)
      isValid = username === adminUsername && password === adminPasswordPlain;
    }

    if (!isValid) {
      // Constant-time-ish delay to blunt brute-force timing attacks
      await new Promise((resolve) => setTimeout(resolve, 600));
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { username, role: 'admin' },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({ success: true, token, expiresIn: '8h', message: 'Login successful' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/appointments
 * Returns all appointment records sorted newest-first.
 */
const getAppointments = async (_req, res, next) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/messages
 * Returns all contact messages sorted newest-first.
 */
const getMessages = async (_req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/messages/:id/read
 * Updates read/unread status of a single contact message.
 */
const updateMessageReadStatus = async (req, res, next) => {
  try {
    const { read } = req.body;

    if (typeof read !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Read must be true or false' });
    }

    const updated = await Message.findOneAndUpdate(
      { id: req.params.id },
      { read },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/appointments/:id/status
 * Updates the status of a single appointment.
 */
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${valid.join(', ')}` });
    }

    const updated = await Appointment.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminLogin,
  getAppointments,
  getMessages,
  updateAppointmentStatus,
  updateMessageReadStatus,
};
