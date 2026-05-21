import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Post from '../models/Post.js';

// @desc    Get public user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all published posts by a specific user
// @route   GET /api/users/:id/posts
// @access  Public
export const getUserPostsPublic = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.params.id, status: 'published' })
    .populate('author', 'username avatar')
    .populate('commentsCount')
    .sort({ createdAt: -1 });

  res.json(posts);
});
