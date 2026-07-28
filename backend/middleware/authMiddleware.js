import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { inMemoryStore } from '../config/inMemoryStore.js';

const getStore = (req) => req?.app?.locals?.inMemoryStore || inMemoryStore;
const isDbConnected = () => mongoose.connection.readyState === 1;

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET || 'scholarship_portal_super_secret_jwt_key_2026';
      const decoded = jwt.verify(token, jwtSecret);

      // Support Mongoose or in-memory fallback user object
      if (!isDbConnected()) {
        const store = getStore(req);
        const foundUser = store.users.find(
          (u) => u._id.toString() === decoded.id
        );
        if (foundUser) {
          req.user = foundUser;
          return next();
        }
      }

      try {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          const store = getStore(req);
          const foundUser = store.users.find(
            (u) => u._id.toString() === decoded.id
          );
          if (foundUser) {
            req.user = foundUser;
            return next();
          }
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        next();
      } catch (dbErr) {
        const store = getStore(req);
        const foundUser = store.users.find(
          (u) => u._id.toString() === decoded.id
        );
        if (foundUser) {
          req.user = foundUser;
          return next();
        }
        return res.status(401).json({ message: 'Not authorized, user lookup failed' });
      }
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin authorization required' });
  }
};

