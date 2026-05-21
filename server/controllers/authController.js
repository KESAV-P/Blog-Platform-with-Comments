import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  // Check if user exists by email or username
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error('Email is already registered');
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    res.status(400);
    throw new Error('Username is already taken');
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Get user with password selected for verification
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // If username changes, verify it's unique
    if (req.body.username && req.body.username !== user.username) {
      const usernameExists = await User.findOne({ username: req.body.username });
      if (usernameExists) {
        res.status(400);
        throw new Error('Username is already taken');
      }
      user.username = req.body.username;
    }

    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

    // Check if files are uploaded via Multer
    if (req.file) {
      user.avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      token: generateToken(updatedUser._id),
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        role: updatedUser.role,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
