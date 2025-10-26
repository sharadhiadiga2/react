const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token validation error:', err.message);
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ msg: 'Token has expired. Please login again.' });
    } else if (err.name === 'JsonWebTokenError') {
      res.status(401).json({ msg: 'Invalid token. Please login again.' });
    } else {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  }
};