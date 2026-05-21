import express from 'express';
import { getUserProfile, getUserPostsPublic } from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', getUserProfile);
router.get('/:id/posts', getUserPostsPublic);

export default router;
