const jwt = require('jsonwebtoken');

// Checks if token valid, if so, stores uID to req

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Split - ["Bearer", "eyJhbGciOi..."]
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Malformed token' });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = { userId: decoded.userId };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
