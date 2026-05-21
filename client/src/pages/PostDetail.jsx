import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Eye, Heart, MessageSquare, Edit3, Trash2, Calendar, Clock, ChevronLeft } from 'lucide-react';
import DOMPurify from 'dompurify';
import PageWrapper from '../components/layout/PageWrapper';
import CommentSection from '../components/comments/CommentSection';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import api from '../utils/axios';
import useAuth from '../hooks/useAuth';
import { formatDate, estimateReadTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/posts/${slug}`);
        setPost(response.data);
        setLikes(response.data.likes || []);
      } catch (error) {
        toast.error('Failed to load post');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [slug, navigate]);

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </PageWrapper>
    );
  }

  if (!post) return null;

  const isAuthor = user && post.author?._id === user._id;
  const isAdmin = user && user.role === 'admin';
  const hasLiked = user && likes.includes(user._id);
  const readTime = estimateReadTime(post.content);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    try {
      const response = await api.post(`/posts/${post._id}/like`);
      setLikes(response.data.likes);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle like');
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success('Post deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeleteLoading(false);
    }
  };

  const categoryColors = {
    Tech: 'text-amber bg-amber/10 border-amber/35',
    Lifestyle: 'text-pink-400 bg-pink-500/10 border-pink-500/25',
    Travel: 'text-blue-400 bg-blue-500/10 border-blue-500/25',
    Food: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    Science: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
    Other: 'text-neutral-400 bg-neutral-500/10 border-neutral-500/25',
  };

  const badgeColor = categoryColors[post.category] || categoryColors.Other;

  return (
    <PageWrapper className="max-w-4xl">
      {/* Back link */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm text-cream-muted hover:text-amber mb-6 transition-colors font-medium"
      >
        <ChevronLeft size={16} /> Back to archive
      </Link>

      <article className="space-y-6">
        {/* Category & Status */}
        <div className="flex items-center gap-2">
          <span className={`text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded border ${badgeColor}`}>
            {post.category}
          </span>
          {post.status === 'draft' && (
            <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-cream-muted">
              Draft
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-cream-light leading-[1.15]">
          {post.title}
        </h1>

        {/* Post Metadata & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-neutral-900 py-4 my-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream-muted">
            {/* Author */}
            <Link to={`/profile/${post.author?.username}`} className="flex items-center gap-2 text-cream hover:text-amber transition-colors">
              <Avatar src={post.author?.avatar} name={post.author?.username} size="sm" />
              <span className="font-medium">{post.author?.username}</span>
            </Link>

            <span className="flex items-center gap-1.5"><Calendar size={15} />{formatDate(post.createdAt, false)}</span>
            <span className="flex items-center gap-1.5"><Clock size={15} />{readTime} min read</span>
            <span className="flex items-center gap-1.5"><Eye size={15} />{post.views} views</span>
          </div>

          {/* Edit/Delete actions */}
          {(isAuthor || isAdmin) && (
            <div className="flex items-center gap-3">
              <Link to={`/edit-post/${post._id}`}>
                <Button variant="secondary" size="sm" className="flex items-center gap-1 text-xs">
                  <Edit3 size={13} /> Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmOpen(true)}
                className="flex items-center gap-1 text-xs border-red-900/50 hover:bg-red-950/20 text-red-400"
              >
                <Trash2 size={13} /> Delete
              </Button>
            </div>
          )}
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="w-full aspect-video rounded overflow-hidden border border-neutral-900 shadow-md">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <div
          className="tiptap prose prose-invert max-w-none pt-4"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content),
          }}
        />

        {/* Like section */}
        <div className="flex items-center justify-between border-t border-neutral-900 pt-6 mt-8">
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${tag}`}
                className="text-xs text-cream-muted hover:text-amber bg-neutral-900/50 border border-neutral-850 px-2.5 py-1 rounded transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-semibold transition-all cursor-pointer ${
              hasLiked
                ? 'bg-amber/10 border-amber text-amber'
                : 'bg-neutral-900 border-neutral-800 text-cream-muted hover:text-cream-light hover:border-neutral-700'
            }`}
          >
            <Heart size={16} className={hasLiked ? 'fill-amber text-amber' : ''} />
            <span>{likes.length} Likes</span>
          </button>
        </div>

        {/* Author details card */}
        <div className="bg-[#141414] border border-neutral-900 p-6 rounded-lg my-12 flex gap-4 items-start">
          <Avatar src={post.author?.avatar} name={post.author?.username} size="lg" />
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-amber font-semibold">Written By</span>
            <Link to={`/profile/${post.author?.username}`}>
              <h4 className="text-xl font-display font-bold text-cream-light hover:text-amber transition-colors">
                {post.author?.username}
              </h4>
            </Link>
            <p className="text-cream-muted text-sm leading-relaxed font-serif pt-1">
              {post.author?.bio || 'This author has not written a biography yet.'}
            </p>
          </div>
        </div>

        {/* Discussion / Comments section */}
        <CommentSection postId={post._id} />
      </article>

      {/* Delete Confirmation prompt */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action will permanently remove the article and all of its comments."
        loading={deleteLoading}
      />
    </PageWrapper>
  );
};

export default PostDetail;
