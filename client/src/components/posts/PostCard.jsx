import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, MessageSquare, Heart } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { formatDate, estimateReadTime } from '../../utils/helpers';

const PostCard = ({ post, variant = 'grid' }) => {
  const { title, slug, excerpt, coverImage, author, category, createdAt, views, likes = [], commentsCount = 0 } = post;
  
  const readTime = estimateReadTime(post.content);

  const categoryColors = {
    Tech: 'text-amber bg-amber/10 border-amber/35',
    Lifestyle: 'text-pink-400 bg-pink-500/10 border-pink-500/25',
    Travel: 'text-blue-400 bg-blue-500/10 border-blue-500/25',
    Food: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    Science: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
    Other: 'text-neutral-400 bg-neutral-500/10 border-neutral-500/25',
  };

  const badgeColor = categoryColors[category] || categoryColors.Other;

  // Placeholder cover image if none is uploaded
  const displayImage = coverImage || `https://images.unsplash.com/photo-1546074177-ffedd79d494d?q=80&w=600&auto=format&fit=crop`;

  if (variant === 'featured') {
    return (
      <div className="group overflow-hidden rounded border border-neutral-900 bg-bg-card shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Cover Image */}
          <Link to={`/blog/${slug}`} className="lg:col-span-7 block relative aspect-video overflow-hidden">
            <img
              src={displayImage}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </Link>

          {/* Details */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className={`inline-block text-xs uppercase tracking-widest font-semibold px-2 py-0.5 rounded border ${badgeColor}`}>
                  {category}
                </span>
              </div>
              <Link to={`/blog/${slug}`}>
                <h3 className="text-2xl sm:text-3xl font-display font-bold leading-tight hover:text-amber transition-colors line-clamp-3">
                  {title}
                </h3>
              </Link>
              <p className="text-cream-muted text-sm font-serif leading-relaxed line-clamp-4">
                {excerpt}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-950 flex items-center justify-between">
              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar src={author?.avatar} name={author?.username} size="sm" />
                <div>
                  <span className="block text-sm font-medium text-cream-light">{author?.username}</span>
                  <span className="block text-xs text-cream-muted">{formatDate(createdAt)}</span>
                </div>
              </div>
              
              {/* Meta Stats */}
              <div className="flex items-center gap-4 text-xs text-cream-muted">
                <span className="flex items-center gap-1"><Eye size={14} />{views}</span>
                <span className="flex items-center gap-1"><Heart size={14} />{likes.length}</span>
                <span className="flex items-center gap-1"><MessageSquare size={14} />{commentsCount}</span>
                <span className="hidden sm:inline">&bull; {readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded border border-neutral-900 bg-bg-card shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in h-full">
      {/* Cover Image */}
      <Link to={`/blog/${slug}`} className="block relative aspect-video overflow-hidden shrink-0">
        <img
          src={displayImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
        />
        <span className={`absolute top-3 left-3 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border backdrop-blur-md ${badgeColor}`}>
          {category}
        </span>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div className="space-y-2.5">
          <Link to={`/blog/${slug}`}>
            <h3 className="text-xl font-display font-bold leading-snug hover:text-amber transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="text-cream-muted text-sm font-serif leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-neutral-900 flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            <Avatar src={author?.avatar} name={author?.username} size="xs" />
            <div className="leading-tight">
              <span className="block text-xs font-medium text-cream-light">{author?.username}</span>
              <span className="block text-[10px] text-cream-muted">{formatDate(createdAt)}</span>
            </div>
          </div>

          {/* Meta Stats */}
          <div className="flex items-center gap-3 text-[11px] text-cream-muted">
            <span className="flex items-center gap-0.5"><Eye size={12} />{views}</span>
            <span className="flex items-center gap-0.5"><Heart size={12} />{likes.length}</span>
            <span className="flex items-center gap-0.5"><MessageSquare size={12} />{commentsCount}</span>
            <span>{readTime}m</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
