const { v4: uuidv4 } = require('uuid');
const Message = require('../models/Message');

/**
 * POST /api/contact
 * Saves an inbound contact message.
 */
const createMessage = async (req, res, next) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    const contactMessage = {
      id:        uuidv4(),
      name:      name.trim(),
      phone:     phone?.trim() || null,
      email:     email.trim().toLowerCase(),
      subject:   subject?.trim() || 'General Enquiry',
      message:   message.trim(),
      read:      false,
      createdAt: new Date().toISOString(),
    };

    await Message.create(contactMessage);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent! We will get back to you within 24 hours.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMessage };
