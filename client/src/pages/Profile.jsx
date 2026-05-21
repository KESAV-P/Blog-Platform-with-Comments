import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Settings, User } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import PostGrid from '../components/posts/PostGrid';
import Spinner from '../components/ui/Spinner';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfileAndPosts = async () => {
      setLoading(true);
      try {
        // Fetch user data by username
        const userRes = await api.get(`/users/username/${username}`);
        setProfileUser(userRes.data);

        // Fetch user's posts (only published ones will return since this is a public endpoint)
        const postsRes = await api.get(`/posts/user/${userRes.data._id}`);
        // Filter published posts just to be safe
        const publishedPosts = postsRes.data.filter((p) => p.status === 'published');
        setPosts(publishedPosts);
      } catch (error) {
        toast.error('Failed to load author profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserProfileAndPosts();
    }
  }, [username]);

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </PageWrapper>
    );
  }

  if (!profileUser) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-display font-bold text-cream-light mb-2">Author Not Found</h2>
          <p className="text-cream-muted text-sm mb-6">The requested author profile does not exist.</p>
          <Link to="/">
            <Button size="sm">Go back home</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const isOwnProfile = currentUser && currentUser._id === profileUser._id;

  return (
    <PageWrapper>
      {/* Profile Header Card */}
      <div className="bg-[#141414] border border-neutral-900 rounded-lg p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        <Avatar src={profileUser.avatar} name={profileUser.username} size="xl" className="border-2 border-neutral-850 shrink-0" />
        
        <div className="flex-grow space-y-3 text-center sm:text-left z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-3xl font-display font-bold text-cream-light">
              {profileUser.username}
            </h1>
            <div className="flex items-center justify-center gap-2">
              {profileUser.role === 'admin' && (
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber/15 border border-amber/35 text-amber px-2.5 py-0.5 rounded">
                  Staff
                </span>
              )}
            </div>
          </div>

          <p className="text-cream-muted text-sm font-serif max-w-2xl leading-relaxed">
            {profileUser.bio || 'This author prefers to keep an air of mystery, choosing not to share a biography.'}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-cream-muted pt-2">
            <span className="flex items-center gap-1">
              <FileText size={14} className="text-amber" />
              <strong>{posts.length}</strong> Published Articles
            </span>
          </div>
        </div>

        {isOwnProfile && (
          <div className="shrink-0 z-10 mt-4 sm:mt-0">
            <Link to="/settings">
              <Button variant="secondary" size="sm" className="flex items-center gap-1.5 text-xs">
                <Settings size={14} /> Edit Profile
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Author Publications Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-cream-light border-b border-neutral-900 pb-3 flex items-center gap-2">
          Publications by {profileUser.username}
        </h2>

        <PostGrid posts={posts} />
      </section>
    </PageWrapper>
  );
};

export default Profile;
