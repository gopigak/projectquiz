const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const mockDb = require('../data/mockDb');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey123!@#');
      
      console.log(`[Middleware] Validating token for user ID: ${decoded.id}`);

      if (!getIsConnected()) {
        const user = mockDb.users.find((u) => u._id === decoded.id);
        if (!user) {
          console.warn(`[Middleware] Authentication failed: User ID ${decoded.id} not found in mock database`);
          return res.status(401).json({ message: 'User not found in mock database' });
        }
        // Exclude password field for request safety
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.warn(`[Middleware] Authentication failed: User ID ${decoded.id} not found in MongoDB`);
        return res.status(401).json({ message: 'User not found with this token' });
      }
      next();
    } catch (error) {
      console.error('[Middleware] JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    console.warn('[Middleware] Authentication failed: Token missing in Authorization header');
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Administrator privileges required' });
  }
};

module.exports = { protect, adminOnly };
