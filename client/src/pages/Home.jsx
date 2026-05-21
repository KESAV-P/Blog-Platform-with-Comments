import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Sidebar from '../components/layout/Sidebar';
import PostGrid from '../components/posts/PostGrid';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await api.get('/posts', {
          params: { page: 1, limit: 7, sort: 'newest' },
        });
        setPosts(response.data.posts);
      } catch (error) {
        toast.error('Failed to load recent posts');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  const handleSidebarSearch = (term) => {
    navigate(`/blog?search=${encodeURIComponent(term)}`);
  };

  const handleSidebarCategory = (cat) => {
    navigate(`/blog?category=${encodeURIComponent(cat)}`);
  };

  const handleSidebarTag = (tag) => {
    navigate(`/blog?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <PageWrapper>
      {/* Hero Header */}
      <section className="mb-12 border-b border-cream-border/20 pb-8 text-center sm:text-left">
        <h1 className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight text-cream-light leading-[1.1] mb-4">
          The <span className="text-amber">BlogSphere</span> Journal
        </h1>
        <p className="max-w-2xl text-cream-muted font-serif text-lg leading-relaxed mb-6">
          Thoughtful essays, code tutorials, and design insights curated for modern software artisans. Dive into deep-dives or write your own.
        </p>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Feed Content */}
        <div className="flex-grow space-y-8 lg:max-w-[70%]">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-6">
            <h2 className="text-2xl font-display font-bold text-cream-light">Recent Publications</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/blog')}
              className="text-xs uppercase tracking-wider text-amber font-semibold"
            >
              See all posts &rarr;
            </Button>
          </div>

          {loading ? (
            <Spinner size="lg" />
          ) : (
            <PostGrid posts={posts} showFeatured={posts.length > 0} />
          )}
        </div>

        {/* Sidebar Filtering */}
        <Sidebar
          onSearch={handleSidebarSearch}
          onCategorySelect={handleSidebarCategory}
          onTagSelect={handleSidebarTag}
        />
      </div>
    </PageWrapper>
  );
};

export default Home;
