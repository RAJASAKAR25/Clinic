/**
 * api/index.js — Vercel Serverless Function Entry Point
 *
 * This file wraps the Express backend so Vercel can run it as a
 * serverless function. All /api/* requests are routed here via vercel.json.
 *
 * The backend module is loaded from ../backend so we don't duplicate code.
 */

// Load env from backend directory
require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });

// Import the Express app (backend/index.js exports `app`)
const app = require('../backend/index');

// Vercel requires the serverless function to export a handler
module.exports = app;
