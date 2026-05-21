import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// @desc    Get all posts (with pagination, filters, and search)
// @route   GET /api/posts
// @access  Public
export const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = { status: 'published' }; // Only retrieve published posts publicly

  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.tag) {
    query.tags = req.query.tag;
  }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query.$or = [{ title: searchRegex }, { content: searchRegex }];
  }

  // Build sort options
  let sortOption = { createdAt: -1 }; // default: newest
  if (req.query.sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (req.query.sort === 'popular') {
    sortOption = { views: -1 };
  }

  const total = await Post.countDocuments(query);
  
  const posts = await Post.find(query)
    .populate('author', 'username avatar bio')
    .populate('commentsCount')
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  res.json({
    posts,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get single post by slug (increments view count)
// @route   GET /api/posts/:slug
// @access  Public
export const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
    .populate('author', 'username avatar bio')
    .populate('commentsCount');

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Increment views
  post.views += 1;
  await post.save();

  res.json(post);
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags, category, status } = req.body;

  if (!title || !content || !category) {
    res.status(400);
    throw new Error('Title, content, and category are required');
  }

  let coverImage = req.body.coverImage || '';

  // If a file upload is present
  if (req.file) {
    coverImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  // Parse tags if it's sent as a string (JSON or comma separated)
  let tagsArray = [];
  if (tags) {
    if (typeof tags === 'string') {
      try {
        tagsArray = JSON.parse(tags);
      } catch (e) {
        tagsArray = tags.split(',').map((t) => t.trim());
      }
    } else if (Array.isArray(tags)) {
      tagsArray = tags;
    }
  }

  const post = await Post.create({
    title,
    content,
    coverImage,
    tags: tagsArray,
    category,
    status: status || 'draft',
    author: req.user._id,
  });

  res.status(201).json(post);
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (Author or Admin only)
export const updatePost = asyncHandler(async (req, res) => {
  const post = req.resource; // Loaded by checkOwnership middleware

  const { title, content, tags, category, status } = req.body;

  post.title = title || post.title;
  post.content = content || post.content;
  post.category = category || post.category;
  post.status = status || post.status;

  if (req.body.coverImage !== undefined) {
    post.coverImage = req.body.coverImage;
  }

  if (req.file) {
    post.coverImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  if (tags) {
    if (typeof tags === 'string') {
      try {
        post.tags = JSON.parse(tags);
      } catch (e) {
        post.tags = tags.split(',').map((t) => t.trim());
      }
    } else if (Array.isArray(tags)) {
      post.tags = tags;
    }
  }

  const updatedPost = await post.save();
  res.json(updatedPost);
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Author or Admin only)
export const deletePost = asyncHandler(async (req, res) => {
  const post = req.resource; // Loaded by checkOwnership middleware

  // Delete all comments associated with this post
  await Comment.deleteMany({ post: post._id });

  await post.deleteOne();
  res.json({ message: 'Post and associated comments deleted successfully' });
});

// @desc    Toggle like on a post
// @route   POST /api/posts/:id/like
// @access  Private
export const togglePostLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const userId = req.user._id.toString();
  const likedIndex = post.likes.indexOf(userId);

  if (likedIndex > -1) {
    // Already liked, unlike it
    post.likes.splice(likedIndex, 1);
  } else {
    // Like it
    post.likes.push(userId);
  }

  await post.save();
  res.json({ likes: post.likes });
});

// @desc    Get all posts by a specific user
// @route   GET /api/posts/user/:userId
// @access  Public (Only draft status returned if user requests their own list)
export const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const isAuthor = req.user && req.user._id.toString() === userId;

  const query = { author: userId };
  
  // If not the author, show only published posts
  if (!isAuthor) {
    query.status = 'published';
  }

  const posts = await Post.find(query)
    .populate('author', 'username avatar')
    .populate('commentsCount')
    .sort({ createdAt: -1 });

  res.json(posts);
});
