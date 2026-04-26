const jwt    = require('jsonwebtoken');
const config = require('../config');

/**
 * JWT Bearer token authentication middleware.
 * Protects admin-only routes.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authorization token required.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.admin = decoded; // { username, role, iat, exp }
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid authentication token.';
    return res.status(401).json({ success: false, message });
  }
};

module.exports = { authenticate };
