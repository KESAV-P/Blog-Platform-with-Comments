import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Spinner from '../ui/Spinner';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch comments tree on load
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/posts/${postId}/comments`);
        setComments(response.data);
      } catch (error) {
        toast.error('Failed to load comments');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Insert a comment or reply in local tree state
  const handleCommentUpdateOrAdd = (updatedOrNewComment) => {
    // If it's a top-level comment
    if (!updatedOrNewComment.parentComment) {
      setComments((prev) => {
        // If it's an edit, replace it
        const exists = prev.some((c) => c._id === updatedOrNewComment._id);
        if (exists) {
          return prev.map((c) => (c._id === updatedOrNewComment._id ? { ...c, ...updatedOrNewComment } : c));
        }
        // If new, append
        return [...prev, updatedOrNewComment];
      });
      return;
    }

    // If it's a reply or edit of a reply
    const updateInTree = (list) => {
      return list.map((item) => {
        if (item._id === updatedOrNewComment.parentComment) {
          // Found parent, check if it's a new reply or editing an existing reply
          const replies = item.replies || [];
          const exists = replies.some((r) => r._id === updatedOrNewComment._id);
          let newReplies;
          if (exists) {
            newReplies = replies.map((r) =>
              r._id === updatedOrNewComment._id ? { ...r, ...updatedOrNewComment } : r
            );
          } else {
            newReplies = [...replies, updatedOrNewComment];
          }
          return { ...item, replies: newReplies };
        } else if (item.replies && item.replies.length > 0) {
          return { ...item, replies: updateInTree(item.replies) };
        }
        
        // If we are editing the comment itself deep in the tree
        if (item._id === updatedOrNewComment._id) {
          return { ...item, ...updatedOrNewComment };
        }

        return item;
      });
    };

    setComments((prev) => updateInTree(prev));
  };

  // Remove a deleted comment from local tree state
  const handleCommentDeleted = (commentId, parentCommentId) => {
    if (!parentCommentId) {
      // Remove top-level comment
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      return;
    }

    // Remove child reply
    const removeFromTree = (list) => {
      return list
        .filter((item) => item._id !== commentId)
        .map((item) => {
          if (item.replies && item.replies.length > 0) {
            return { ...item, replies: removeFromTree(item.replies) };
          }
          return item;
        });
    };

    setComments((prev) => removeFromTree(prev));
  };

  // Flatten comments array to count comments correctly (including replies)
  const countAllComments = (list) => {
    let count = list.length;
    list.forEach((c) => {
      if (c.replies && c.replies.length > 0) {
        count += countAllComments(c.replies);
      }
    });
    return count;
  };

  const totalComments = countAllComments(comments);

  return (
    <section className="mt-12 pt-8 border-t border-neutral-900">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="text-amber" size={20} />
        <h3 className="text-xl font-display font-bold text-cream-light">
          Discussion ({totalComments})
        </h3>
      </div>

      {/* Main Top-Level Comment Form */}
      <CommentForm postId={postId} onSubmitSuccess={handleCommentUpdateOrAdd} />

      {loading ? (
        <Spinner size="md" />
      ) : comments.length > 0 ? (
        <div className="space-y-4 divide-y divide-neutral-900/30">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
              onCommentUpdated={handleCommentUpdateOrAdd}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-cream-muted text-sm border border-dashed border-neutral-850/50 rounded-lg">
          No comments yet. Be the first to share your thoughts!
        </div>
      )}
    </section>
  );
};

export default CommentSection;
