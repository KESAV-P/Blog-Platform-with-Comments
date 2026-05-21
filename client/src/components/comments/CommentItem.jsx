import React, { useState } from 'react';
import { Heart, Reply, Edit2, Trash2, CornerDownRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import api from '../../utils/axios';
import Avatar from '../ui/Avatar';
import CommentForm from './CommentForm';
import ConfirmDialog from '../ui/ConfirmDialog';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CommentItem = ({
  comment,
  postId,
  onCommentUpdated,
  onCommentDeleted,
  depth = 0,
}) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [likes, setLikes] = useState(comment.likes || []);

  const isAuthor = user && comment.author?._id === user._id;
  const isAdmin = user && user.role === 'admin';
  const hasLiked = user && likes.includes(user._id);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like comments');
      return;
    }

    try {
      const response = await api.post(`/comments/${comment._id}/like`);
      setLikes(response.data.likes);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to like comment');
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/comments/${comment._id}`);
      toast.success('Comment deleted');
      setDeleteConfirmOpen(false);
      if (onCommentDeleted) onCommentDeleted(comment._id, comment.parentComment);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditSuccess = (updatedComment) => {
    setIsEditing(false);
    if (onCommentUpdated) onCommentUpdated(updatedComment);
  };

  const handleReplySuccess = (newReply) => {
    setIsReplying(false);
    // Notify parent to append reply
    if (onCommentUpdated) onCommentUpdated(newReply);
  };

  // Restrict recursive indentation visually on mobile
  const maxIndentationDepth = 3;
  const showIndentation = depth > 0 && depth <= maxIndentationDepth;

  return (
    <div className={`mt-4 ${showIndentation ? 'ml-4 sm:ml-8 pl-3 sm:pl-4 border-l border-neutral-850/60' : ''}`}>
      <div className="bg-bg-card/40 border border-neutral-900/50 rounded-lg p-4 hover:bg-bg-card/60 transition-all duration-200">
        {/* Author details */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar src={comment.author?.avatar} name={comment.author?.username} size="sm" />
            <div>
              <span className="block text-xs font-semibold text-cream-light flex items-center gap-1.5">
                {comment.author?.username || 'Deleted User'}
                {comment.author?.role === 'admin' && (
                  <span className="text-[9px] uppercase tracking-wider bg-amber/10 border border-amber/35 text-amber px-1 rounded">
                    Staff
                  </span>
                )}
              </span>
              <span className="block text-[10px] text-cream-muted">
                {formatDate(comment.createdAt)}
                {comment.isEdited && <span className="italic ml-1">(edited)</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <CommentForm
            postId={postId}
            commentId={comment._id}
            initialContent={comment.content}
            isEdit={true}
            onSubmitSuccess={handleEditSuccess}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p className="text-sm font-serif leading-relaxed text-cream-light whitespace-pre-wrap pl-1 mb-3">
            {comment.content}
          </p>
        )}

        {/* Actions bar */}
        {!isEditing && (
          <div className="flex items-center gap-4 text-xs text-cream-muted pt-1">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 hover:text-amber transition-colors cursor-pointer ${
                hasLiked ? 'text-amber font-semibold' : ''
              }`}
            >
              <Heart size={14} className={hasLiked ? 'fill-amber text-amber' : ''} />
              <span>{likes.length}</span>
            </button>

            {user && depth < 4 && (
              <button
                onClick={() => {
                  setIsReplying(!isReplying);
                  setIsEditing(false);
                }}
                className={`flex items-center gap-1 hover:text-amber transition-colors cursor-pointer ${
                  isReplying ? 'text-amber' : ''
                }`}
              >
                <Reply size={14} />
                <span>Reply</span>
              </button>
            )}

            {(isAuthor || isAdmin) && (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setIsReplying(false);
                  }}
                  className="flex items-center gap-1 hover:text-amber transition-colors cursor-pointer"
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="flex items-center gap-1 hover:text-red-400 transition-colors ml-auto text-red-500/80 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-3 pl-3 border-l border-amber/30">
            <CommentForm
              postId={postId}
              parentCommentId={comment._id}
              onSubmitSuccess={handleReplySuccess}
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}
      </div>

      {/* Recursive nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-1">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation popup */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? All of its direct replies will also be deleted."
        loading={deleteLoading}
      />
    </div>
  );
};

export default CommentItem;
