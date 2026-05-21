import express from 'express';
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  togglePostLike,
  getUserPosts,
} from '../controllers/postController.js';
import {
  getPostComments,
  createComment,
} from '../controllers/commentController.js';
import { protect, checkOwnership, optionalProtect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', protect, upload.single('coverImage'), createPost);
router.get('/user/:userId', optionalProtect, getUserPosts);
router.get('/:slug', getPostBySlug);
router.put('/:id', protect, checkOwnership('Post'), upload.single('coverImage'), updatePost);
router.delete('/:id', protect, checkOwnership('Post'), deletePost);
router.post('/:id/like', protect, togglePostLike);

// Comment routes nested under posts
router.get('/:postId/comments', getPostComments);
router.post('/:postId/comments', protect, createComment);

export default router;
