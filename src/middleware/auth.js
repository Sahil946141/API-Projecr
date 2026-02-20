const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { unauthorized, forbidden } = require('../utils/errors');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(unauthorized());
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.userId)
      .then((user) => {
        if (!user) return next(unauthorized());
        req.user = user;
        next();
      })
      .catch(() => next(unauthorized()));
  } catch {
    next(unauthorized());
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return next(unauthorized());
    if (req.user.role !== role) {
      return next(forbidden(`Role '${role}' required`));
    }
    next();
  };
}

module.exports = { authMiddleware, requireRole };
