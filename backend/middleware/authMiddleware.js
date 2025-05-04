import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/config.js';
import logger from '../utils/logger.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if authorization header is present and has the Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Get user from the token and add to request object (without password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      next();
    } catch (error) {
      logger.error(`Authentication error: ${error.message}`);
      res.status(401);
      throw new Error('Not authorized, invalid token');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
};

// Middleware to check if user is an admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

// Middleware to check if user is an analyst
export const analyst = (req, res, next) => {
  if (req.user && (req.user.role === 'analyst' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an analyst');
  }
};