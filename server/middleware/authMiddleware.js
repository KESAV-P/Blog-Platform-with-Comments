import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// Protect routes - Verify token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'blogsphere_super_secret_jwt_key_2026_x93f');

      // Get user from database (exclude password) and attach to request
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

// Admin check
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

// Resource ownership check
export const checkOwnership = (modelName) => asyncHandler(async (req, res, next) => {
  const resourceId = req.params.id;
  let model;

  if (modelName === 'Post') {
    model = Post;
  } else if (modelName === 'Comment') {
    model = Comment;
  } else {
    res.status(500);
    throw new Error('Server configured with invalid ownership model check');
  }

  const resource = await model.findById(resourceId);

  if (!resource) {
    res.status(404);
    throw new Error(`${modelName} not found`);
  }

  // Admin role overrides ownership check
  if (req.user.role === 'admin') {
    req.resource = resource;
    return next();
  }

  // User must own the resource
  const authorId = resource.author ? resource.author.toString() : null;
  if (authorId !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You do not have permission to modify this resource');
  }

  req.resource = resource; // Attach resource for controller use
  next();
});

// Optional protect middleware - parse token if exists, but do not block
export const optionalProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'blogsphere_super_secret_jwt_key_2026_x93f');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Proceed without user
      console.warn('Optional auth failed:', error.message);
    }
  }

  next();
});

