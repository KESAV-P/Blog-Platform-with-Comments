import asyncHandler from 'express-async-handler';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Get all comments for a post (nested tree format)
// @route   GET /api/posts/:postId/comments
// @access  Public
export const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Fetch all comments for the post
  const comments = await Comment.find({ post: postId })
    .populate('author', 'username avatar')
    .sort({ createdAt: 1 }); // chronological

  // Construct a comment tree map
  const commentMap = {};
  comments.forEach((comment) => {
    const commentJson = comment.toJSON();
    commentJson.replies = [];
    commentMap[commentJson._id.toString()] = commentJson;
  });

  const commentTree = [];
  comments.forEach((comment) => {
    const commentJson = commentMap[comment._id.toString()];
    if (commentJson.parentComment) {
      const parent = commentMap[commentJson.parentComment.toString()];
      if (parent) {
        parent.replies.push(commentJson);
      } else {
        // If parent comment was deleted but child exists
        commentTree.push(commentJson);
      }
    } else {
      commentTree.push(commentJson);
    }
  });

  res.json(commentTree);
});

// @desc    Add a comment to a post (or reply to a comment)
// @route   POST /api/posts/:postId/comments
// @access  Private
export const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content, parentComment } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // If it's a reply, verify parent comment exists
  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (!parent) {
      res.status(404);
      throw new Error('Parent comment not found');
    }
  }

  const comment = await Comment.create({
    content,
    author: req.user._id,
    post: postId,
    parentComment: parentComment || null,
  });

  // Populate author details to return to the client
  const populatedComment = await Comment.findById(comment._id).populate(
    'author',
    'username avatar'
  );

  res.status(201).json(populatedComment);
});

// @desc    Edit a comment
// @route   PUT /api/comments/:id
// @access  Private (Author or Admin only)
export const updateComment = asyncHandler(async (req, res) => {
  const comment = req.resource; // Loaded by checkOwnership middleware
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  comment.content = content;
  comment.isEdited = true;

  const updatedComment = await comment.save();
  const populatedComment = await Comment.findById(updatedComment._id).populate(
    'author',
    'username avatar'
  );

  res.json(populatedComment);
});

// @desc    Delete a comment (recursively deletes direct replies)
// @route   DELETE /api/comments/:id
// @access  Private (Author or Admin only)
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = req.resource; // Loaded by checkOwnership middleware

  // Delete all direct replies to this comment
  await Comment.deleteMany({ parentComment: comment._id });

  // Delete the comment itself
  await comment.deleteOne();

  res.json({ message: 'Comment and its replies deleted successfully' });
});

// @desc    Toggle like on a comment
// @route   POST /api/comments/:id/like
// @access  Private
export const toggleCommentLike = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const userId = req.user._id.toString();
  const likedIndex = comment.likes.indexOf(userId);

  if (likedIndex > -1) {
    // Already liked, unlike
    comment.likes.splice(likedIndex, 1);
  } else {
    // Like it
    comment.likes.push(userId);
  }

  await comment.save();
  res.json({ likes: comment.likes });
});
