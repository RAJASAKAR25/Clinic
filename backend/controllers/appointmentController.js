const { v4: uuidv4 } = require('uuid');
const Appointment = require('../models/Appointment');

const buildTimeSlots = (startHour, startMinute, endHour, endMinute) => {
  const slots = [];
  let currentMinutes = startHour * 60 + startMinute;
  const lastMinutes = endHour * 60 + endMinute;

  while (currentMinutes <= lastMinutes) {
    const hours24 = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    slots.push(`${hours12}:${String(minutes).padStart(2, '0')} ${period}`);
    currentMinutes += 30;
  }

  return slots;
};

const WEEKDAY_TIME_SLOTS = buildTimeSlots(9, 0, 21, 0);
const SUNDAY_TIME_SLOTS = buildTimeSlots(9, 0, 13, 30);

const parseTimeSlotToMinutes = (slot = '') => {
  const [timePart, period] = String(slot).split(' ');
  if (!timePart || !period) return null;

  const [rawHour, rawMinute] = timePart.split(':');
  const hour = Number(rawHour);
  const minute = Number(rawMinute);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;

  let hours24 = hour % 12;
  if (period.toUpperCase() === 'PM') {
    hours24 += 12;
  }

  return (hours24 * 60) + minute;
};

const toLocalDateKey = (value = new Date()) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * POST /api/appointments
 * Creates and stores a new appointment booking.
 */
const createAppointment = async (req, res, next) => {
  try {
    const { name, phone, email, date, time, service, message } = req.body;
    const normalizedDate = String(date).trim();
    const normalizedTime = String(time).trim();

    // Reject past dates
    const appointmentDate = new Date(`${normalizedDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date cannot be in the past',
      });
    }

    const dayOfWeek = appointmentDate.getDay();
    const allowedSlots = dayOfWeek === 0 ? SUNDAY_TIME_SLOTS : WEEKDAY_TIME_SLOTS;

    if (!allowedSlots.includes(normalizedTime)) {
      return res.status(400).json({
        success: false,
        message: dayOfWeek === 0
          ? 'Sunday appointments are available from 9:00 AM to 1:30 PM.'
          : 'Appointments are available from 9:00 AM to 8:30 PM Monday through Saturday.',
      });
    }

    if (toLocalDateKey(appointmentDate) === toLocalDateKey(new Date())) {
      const slotMinutes = parseTimeSlotToMinutes(normalizedTime);
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      if (slotMinutes === null || slotMinutes <= nowMinutes) {
        return res.status(400).json({
          success: false,
          message: 'Please choose a future time slot for today.',
        });
      }
    }

    const existingAppointment = await Appointment.findOne({
      date: normalizedDate,
      time: normalizedTime,
      status: { $ne: 'cancelled' },
    }).lean();

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please choose another time.',
      });
    }

    const appointment = {
      id: uuidv4(),
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim().toLowerCase() || null,
      date: normalizedDate,
      time: normalizedTime,
      service,
      message: message?.trim() || null,
      status: 'pending', // pending | confirmed | cancelled | completed
      createdAt: new Date().toISOString(),
    };

    await Appointment.create(appointment);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! We will contact you shortly to confirm.',
      data: {
        id: appointment.id,
        name: appointment.name,
        date: appointment.date,
        time: appointment.time,
        service: appointment.service,
        status: appointment.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/appointments/:id
 * Returns limited public details for an appointment (for confirmation display).
 */
const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({ id: req.params.id }).lean();

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Return only non-sensitive fields to the public
    const { id, name, date, time, service, status } = appointment;
    res.json({ success: true, data: { id, name, date, time, service, status } });
  } catch (error) {
    next(error);
  }
};

module.exports = { createAppointment, getAppointment };
