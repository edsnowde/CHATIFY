// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get the token from the "Authorization" header
  // Expected format: "Bearer <token>"
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Split the header to get the token part
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // Save userId for later use in routes
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
