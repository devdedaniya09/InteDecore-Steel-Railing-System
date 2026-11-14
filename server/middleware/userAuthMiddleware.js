const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided.' });
  }

  const actualToken = token.split(' ')[1]; // Extract token from 'Bearer <token>'

  jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    req.user = decoded; // Add user info from token to the request object
    next();
  });
};

module.exports = { verifyToken };
