/**
 * Shekar's Dental Clinic — Express API Server
 * Entry point: registers middleware, mounts routes, starts server
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const config = require('./config'); // centralised config — edit server/.env to change values
const connectDB = require('./db/connect');

const app = express();
const { port: PORT, nodeEnv: NODE_ENV } = config;

// ── Security Headers ──────────────────────────────────────────────────────────
app.use(
  helmet({
    // Relax CSP so the frontend dev server can communicate freely in development
    contentSecurityPolicy: NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false,
  })
);

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allowed origins are configured via ALLOWED_ORIGINS in server/.env
const allowedOrigins = config.cors.allowedOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no origin header) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Request blocked by CORS policy'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── General Middleware ────────────────────────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '10kb' }));       // Guard against large payloads
app.use(express.urlencoded({ extended: true }));

// Request logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/services',      require('./routes/services'));
app.use('/api/faqs',          require('./routes/faqs'));
app.use('/api/testimonials',  require('./routes/testimonials'));
app.use('/api/appointments',  require('./routes/appointments'));
app.use('/api/contact',       require('./routes/contact'));
app.use('/api/admin',         require('./routes/admin'));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', environment: NODE_ENV, timestamp: new Date().toISOString() });
});

// ── Serve React Frontend in Production ───────────────────────────────────────
if (NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(clientDist));
  // All non-API routes return the React app (enables client-side routing)
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ── Global Error Handler (must be last middleware) ────────────────────────────
app.use(require('./middleware/errorHandler'));

// ── Start Server ──────────────────────────────────────────────────────────────
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log('\n🦷  Shekar\'s Dental Clinic API');
    console.log(`    Mode : ${NODE_ENV}`);
    console.log(`    Port : ${PORT}`);
    console.log(`    URL  : http://localhost:${PORT}`);
    console.log(`    CORS : ${config.cors.allowedOrigins.join(', ')}\n`);
  });
};

startServer().catch((error) => {
  console.error('[startup] Failed to boot server:', error.message);
  process.exit(1);
});

module.exports = app;
