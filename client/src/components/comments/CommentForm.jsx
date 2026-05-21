import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../utils/axios';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const CommentForm = ({
  postId,
  parentCommentId = null,
  initialContent = '',
  onSubmitSuccess,
  onCancel,
  isEdit = false,
  commentId = null,
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      let response;
      if (isEdit && commentId) {
        response = await api.put(`/comments/${commentId}`, { content });
        toast.success('Comment updated');
      } else {
        response = await api.post(`/posts/${postId}/comments`, {
          content,
          parentComment: parentCommentId,
        });
        toast.success(parentCommentId ? 'Reply posted' : 'Comment posted');
      }

      setContent('');
      if (onSubmitSuccess) onSubmitSuccess(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-neutral-900/30 border border-neutral-850 p-4 rounded text-center my-4">
        <p className="text-cream-muted text-sm">
          Please{' '}
          <a href="/login" className="text-amber hover:underline">
            sign in
          </a>{' '}
          to join the conversation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 my-4">
      <textarea
        rows={isEdit || parentCommentId ? 2 : 3}
        placeholder={parentCommentId ? 'Write a reply...' : 'Add to the discussion...'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={1000}
        disabled={loading}
        className="w-full bg-bg-input text-cream border border-neutral-850 focus:border-amber focus:ring-1 focus:ring-amber/30 rounded p-3 text-sm outline-none transition-all duration-200 resize-none"
      />
      <div className="flex justify-end gap-2 text-xs">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!content.trim()}
          loading={loading}
        >
          {isEdit ? 'Save Changes' : parentCommentId ? 'Reply' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
