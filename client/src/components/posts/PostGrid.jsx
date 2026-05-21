import React from 'react';
import PostCard from './PostCard';
import EmptyState from '../ui/EmptyState';

const PostGrid = ({ posts = [], showFeatured = false }) => {
  if (posts.length === 0) {
    return <EmptyState title="No posts to display" message="Create your first post now or filter by another category." />;
  }

  const featuredPost = showFeatured ? posts[0] : null;
  const gridPosts = showFeatured ? posts.slice(1) : posts;

  return (
    <div className="space-y-8">
      {/* Prominent Featured Post */}
      {featuredPost && (
        <div className="mb-8">
          <PostCard post={featuredPost} variant="featured" />
        </div>
      )}

      {/* Grid of remaining posts */}
      {gridPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridPosts.map((post) => (
            <div key={post._id}>
              <PostCard post={post} variant="grid" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostGrid;
