import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, Edit3, Trash2, Plus, FileText, BarChart3, ShieldAlert } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import PageWrapper from '../components/layout/PageWrapper';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import api from '../utils/axios';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const fetchUserPosts = async () => {
    try {
      const response = await api.get(`/posts/user/${user._id}`);
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard posts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const handleDeleteTrigger = (post) => {
    setPostToDelete(post);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/posts/${postToDelete._id}`);
      toast.success('Post deleted successfully');
      setPosts(posts.filter((p) => p._id !== postToDelete._id));
      setDeleteConfirmOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeleteLoading(false);
      setPostToDelete(null);
    }
  };

  // Aggregated Stats
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
  const draftsCount = posts.filter((post) => post.status === 'draft').count || posts.filter((post) => post.status === 'draft').length;
  const publishedCount = posts.length - draftsCount;

  return (
    <PageWrapper>
      {/* Header section */}
      <section className="mb-8 border-b border-cream-border/20 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-cream-light mb-1">
            Author Console
          </h1>
          <p className="text-cream-muted text-sm font-serif">
            Monitor publications, edit drafts, and analyze statistics.
          </p>
        </div>

        <div>
          <Link to="/create-post">
            <Button className="flex items-center gap-2 text-sm">
              <Plus size={16} /> New Article
            </Button>
          </Link>
        </div>
      </section>

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="space-y-8">
          {/* Summary Stats Widgets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bg-card border border-neutral-900 rounded p-5 flex flex-col justify-between h-28">
              <span className="text-xs text-cream-muted font-medium uppercase tracking-wider">Total Articles</span>
              <span className="text-3xl font-display font-extrabold text-cream-light mt-2">{posts.length}</span>
            </div>

            <div className="bg-bg-card border border-neutral-900 rounded p-5 flex flex-col justify-between h-28">
              <span className="text-xs text-cream-muted font-medium uppercase tracking-wider">Total Reads</span>
              <span className="text-3xl font-display font-extrabold text-cream-light mt-2 flex items-center gap-1">
                <Eye size={20} className="text-amber" /> {totalViews}
              </span>
            </div>

            <div className="bg-bg-card border border-neutral-900 rounded p-5 flex flex-col justify-between h-28">
              <span className="text-xs text-cream-muted font-medium uppercase tracking-wider">Accumulated Likes</span>
              <span className="text-3xl font-display font-extrabold text-cream-light mt-2 flex items-center gap-1">
                <Heart size={20} className="text-amber" /> {totalLikes}
              </span>
            </div>

            <div className="bg-bg-card border border-neutral-900 rounded p-5 flex flex-col justify-between h-28">
              <span className="text-xs text-cream-muted font-medium uppercase tracking-wider">Drafts Pending</span>
              <span className="text-3xl font-display font-extrabold text-amber mt-2">{draftsCount}</span>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-cream-light border-b border-neutral-900 pb-2">
              Manage Articles
            </h2>

            {posts.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Write your first article"
                message="Your dashboard is currently empty. Put your thoughts on paper and publish them for the world."
                action={
                  <Link to="/create-post">
                    <Button size="sm">Create Article</Button>
                  </Link>
                }
              />
            ) : (
              <div className="overflow-x-auto border border-neutral-900 rounded bg-[#131313]/50">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#1a1a1a]/60 text-cream-muted text-xs uppercase tracking-wider border-b border-neutral-900">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-center">Reads</th>
                      <th className="py-3 px-4 text-center">Likes</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {posts.map((post) => (
                      <tr key={post._id} className="hover:bg-neutral-900/30 transition-colors">
                        <td className="py-4 px-4 font-semibold text-cream-light max-w-xs truncate">
                          {post.status === 'published' ? (
                            <Link to={`/blog/${post.slug}`} className="hover:underline hover:text-amber transition-colors">
                              {post.title}
                            </Link>
                          ) : (
                            <span className="text-neutral-400">{post.title}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-cream-muted">{post.category}</td>
                        <td className="py-4 px-4 text-cream-muted text-xs">{formatDate(post.createdAt, false)}</td>
                        <td className="py-4 px-4 text-center text-cream-muted font-mono">{post.views}</td>
                        <td className="py-4 px-4 text-center text-cream-muted font-mono">{post.likes?.length || 0}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                              post.status === 'published'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-amber/10 border-amber/30 text-amber'
                            }`}
                          >
                            {post.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/edit-post/${post._id}`}>
                              <button
                                className="p-1.5 text-cream-muted hover:text-amber hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                                title="Edit Post"
                              >
                                <Edit3 size={15} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteTrigger(post)}
                              className="p-1.5 text-cream-muted hover:text-red-400 hover:bg-neutral-850 rounded transition-colors cursor-pointer"
                              title="Delete Post"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation popup */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Article"
        message={`Are you sure you want to delete the post "${postToDelete?.title}"? All comments associated with it will also be deleted.`}
        loading={deleteLoading}
      />
    </PageWrapper>
  );
};

export default Dashboard;
