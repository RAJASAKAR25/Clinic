/**
 * Full JSON → MongoDB seed script
 * Run: npm run migrate:json-to-mongo
 *
 * Imports all local data/**.json files into MongoDB.
 * Safe to run multiple times (clears each collection first).
 */
require('dotenv').config();

const fs        = require('fs');
const path      = require('path');
const mongoose  = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Appointment = require('../models/Appointment');
const Message     = require('../models/Message');
const Service     = require('../models/Service');
const Faq         = require('../models/Faq');
const Testimonial = require('../models/Testimonial');
const Bill        = require('../models/Bill');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clinic';

const readJson = (filename) => {
  const filePath = path.join(__dirname, '..', 'data', filename);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  try { return JSON.parse(raw) || []; } catch { return []; }
};

const normalizeDate = (value) => {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

/** Ensure every document has a string UUID id */
const withId = (item) => ({ ...item, id: item.id ? String(item.id) : uuidv4() });

const run = async () => {
  console.log('[migrate] Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI);
  console.log('[migrate] Connected.\n');

  // ── Appointments ──────────────────────────────────────────────────────────────
  const appointments = readJson('appointments.json').map((item) => ({
    ...withId(item),
    createdAt: normalizeDate(item.createdAt),
    updatedAt: normalizeDate(item.updatedAt || item.createdAt),
  }));
  await Appointment.deleteMany({});
  if (appointments.length) await Appointment.insertMany(appointments, { ordered: false });
  console.log(`[migrate] appointments : ${appointments.length} imported`);

  // ── Messages ──────────────────────────────────────────────────────────────────
  const messages = readJson('messages.json').map((item) => ({
    ...withId(item),
    createdAt: normalizeDate(item.createdAt),
    updatedAt: normalizeDate(item.updatedAt || item.createdAt),
  }));
  await Message.deleteMany({});
  if (messages.length) await Message.insertMany(messages, { ordered: false });
  console.log(`[migrate] messages     : ${messages.length} imported`);

  // ── Services ──────────────────────────────────────────────────────────────────
  const services = readJson('services.json').map((item) => ({
    ...withId(item),
    createdAt: normalizeDate(item.createdAt),
    updatedAt: normalizeDate(item.updatedAt || item.createdAt),
  }));
  await Service.deleteMany({});
  if (services.length) await Service.insertMany(services, { ordered: false });
  console.log(`[migrate] services     : ${services.length} imported`);

  // ── FAQs ──────────────────────────────────────────────────────────────────────
  const faqs = readJson('faqs.json').map((item) => ({
    ...withId(item),
    createdAt: normalizeDate(item.createdAt),
    updatedAt: normalizeDate(item.updatedAt || item.createdAt),
  }));
  await Faq.deleteMany({});
  if (faqs.length) await Faq.insertMany(faqs, { ordered: false });
  console.log(`[migrate] faqs         : ${faqs.length} imported`);

  // ── Testimonials ──────────────────────────────────────────────────────────────
  const testimonials = readJson('testimonials.json').map((item) => ({
    ...withId(item),
    createdAt: normalizeDate(item.createdAt),
    updatedAt: normalizeDate(item.updatedAt || item.createdAt),
  }));
  await Testimonial.deleteMany({});
  if (testimonials.length) await Testimonial.insertMany(testimonials, { ordered: false });
  console.log(`[migrate] testimonials : ${testimonials.length} imported`);

  // ── Bills ─────────────────────────────────────────────────────────────────────
  const bills = readJson('bills.json').map((item) => ({
    ...withId(item),
    createdAt: normalizeDate(item.createdAt),
    updatedAt: normalizeDate(item.updatedAt || item.createdAt),
  }));
  await Bill.deleteMany({});
  if (bills.length) await Bill.insertMany(bills, { ordered: false });
  console.log(`[migrate] bills        : ${bills.length} imported`);

  console.log('\n[migrate] ✅  All collections seeded successfully.\n');
  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('[migrate] ❌  Migration failed:', error.message);
  await mongoose.connection.close();
  process.exit(1);
});
