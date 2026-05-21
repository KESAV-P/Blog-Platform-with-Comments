import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Sidebar from '../components/layout/Sidebar';
import PostGrid from '../components/posts/PostGrid';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const currentPage = parseInt(searchParams.get('page'), 10) || 1;
  const currentCategory = searchParams.get('category') || '';
  const currentTag = searchParams.get('tag') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchFilteredPosts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/posts', {
          params: {
            page: currentPage,
            limit: 6,
            category: currentCategory,
            tag: currentTag,
            search: currentSearch,
            sort: currentSort,
          },
        });
        setPosts(response.data.posts);
        setTotalPages(response.data.pages);
        setTotalPosts(response.data.total);
      } catch (error) {
        toast.error('Failed to load posts');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredPosts();
  }, [currentPage, currentCategory, currentTag, currentSearch, currentSort]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 on filter changes
    if (key !== 'page') {
      params.set('page', '1');
    }
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateParam('page', newPage.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeFilters = currentCategory || currentTag || currentSearch;

  return (
    <PageWrapper>
      {/* Blog header */}
      <section className="mb-10 border-b border-cream-border/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-cream-light mb-1">
            {activeFilters ? 'Filter Results' : 'The Archive'}
          </h1>
          <p className="text-cream-muted text-sm font-serif">
            {activeFilters
              ? `Showing posts match your criteria (${totalPosts} found)`
              : `Browse all articles chronologically`
            }
          </p>
        </div>

        {/* Sorting toolbar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-cream-muted font-medium uppercase tracking-wider">Sort by</span>
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-bg-card border border-neutral-800 text-cream text-xs px-3 py-2 rounded focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Posts Feed */}
        <div className="flex-grow space-y-8 lg:max-w-[70%]">
          {loading ? (
            <Spinner size="lg" />
          ) : (
            <>
              <PostGrid posts={posts} />

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-neutral-900 pt-6 mt-8">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 text-xs uppercase"
                  >
                    <ArrowLeft size={14} /> Prev
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded text-xs font-semibold transition-all ${
                            currentPage === pageNum
                              ? 'bg-amber text-bg-dark font-bold'
                              : 'text-cream-muted hover:bg-neutral-900 hover:text-cream-light'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-xs uppercase"
                  >
                    Next <ArrowRight size={14} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar Filtering */}
        <Sidebar
          onSearch={(val) => updateParam('search', val)}
          onCategorySelect={(val) => updateParam('category', val)}
          onTagSelect={(val) => updateParam('tag', val)}
          selectedCategory={currentCategory}
          selectedTag={currentTag}
        />
      </div>
    </PageWrapper>
  );
};

export default Blog;
