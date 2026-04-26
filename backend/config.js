/**
 * backend/config.js — Single source of truth for all backend configuration.
 *
 * Every value is read from environment variables.
 * Edit backend/.env to change anything — no code changes needed.
 */

require('dotenv').config();                               // base values
require('dotenv').config({ path: '.env.local', override: true }); // local overrides

const config = {
  // ── Server ──────────────────────────────────────────────────────────────────
  port:    parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // ── Database ───────────────────────────────────────────────────────────────
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clinic',
  },

  // ── CORS ────────────────────────────────────────────────────────────────────
  // Comma-separated list of allowed frontend origins
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean)
      .concat(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
      .concat(
        // Always allow localhost dev/preview ports when no env var is set
        process.env.ALLOWED_ORIGINS
          ? []
          : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173']
      ),
  },

  // ── JWT ─────────────────────────────────────────────────────────────────────
  jwt: {
    secret:    process.env.JWT_SECRET    || 'fallback_dev_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },

  // ── Admin Credentials ───────────────────────────────────────────────────────
  admin: {
    username:     process.env.ADMIN_USERNAME     || 'admin',
    // Plain-text password — used only in development when no hash is provided
    password:     process.env.ADMIN_PASSWORD     || 'admin123',
    // bcrypt hash — takes precedence over plain-text password if set
    passwordHash: process.env.ADMIN_PASSWORD_HASH || null,
  },

  // ── Clinic Info (used by server-side logic / emails if added later) ─────────
  clinic: {
    name:  process.env.CLINIC_NAME  || 'Shekar’s Dental Clinic',
    phone: process.env.CLINIC_PHONE || '+91 7842299457',
    email: process.env.CLINIC_EMAIL || 'Cox_408@yahoo.co.in',
  },
};

module.exports = config;
