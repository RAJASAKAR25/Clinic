/**
 * Global error handling middleware.
 * Must be registered as the LAST app.use() in index.js.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Internal server error';

  // Duplicate key errors from unique database indexes
  if (err?.code === 11000) {
    statusCode = 409;
    message =
      err?.keyPattern?.date && err?.keyPattern?.time
        ? 'This time slot is already booked. Please choose another time.'
        : 'A record with this value already exists.';
  }

  // CORS violations
  if (err.message === 'Request blocked by CORS policy') {
    statusCode = 403;
    message    = 'CORS policy violation';
  }

  // JSON payload too large
  if (err.type === 'entity.too.large') {
    statusCode = 413;
    message    = 'Request body too large (max 10 KB)';
  }

  // JSON syntax errors in request body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message    = 'Invalid JSON in request body';
  }

  // Log server errors
  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] Server Error:`, err.message);
    if (process.env.NODE_ENV === 'development') {
      console.error(err.stack);
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500 && { stack: err.stack }),
  });
};

module.exports = errorHandler;
