import mongoose from 'mongoose';
import slugify from 'slugify';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a post title'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide content for the post'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length <= 5;
        },
        message: 'A post can have at most 5 tags',
      },
    },
    category: {
      type: String,
      enum: {
        values: ['Tech', 'Lifestyle', 'Travel', 'Food', 'Science', 'Other'],
        message: 'Please select a valid category',
      },
      required: [true, 'Please select a category'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for comments
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

// Virtual for comments count
postSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true,
});

// Helper function to strip HTML tags for excerpt
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

// Generate slug and excerpt before saving
postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.isModified('content')) {
    const plainText = stripHtml(this.content);
    this.excerpt = plainText.length > 280 ? `${plainText.substring(0, 280)}...` : plainText;
  }

  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;
