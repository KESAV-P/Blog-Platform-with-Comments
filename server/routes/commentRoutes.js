import express from 'express';
import {
  updateComment,
  deleteComment,
  toggleCommentLike,
} from '../controllers/commentController.js';
import { protect, checkOwnership } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/:id', protect, checkOwnership('Comment'), updateComment);
router.delete('/:id', protect, checkOwnership('Comment'), deleteComment);
router.post('/:id/like', protect, toggleCommentLike);

export default router;
