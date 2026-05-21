import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);

// Simple token logout route
router.post('/logout', protect, (req, res) => {
  res.status(200).json({ message: 'Successfully logged out' });
});

export default router;
