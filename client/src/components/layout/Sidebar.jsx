import React, { useState } from 'react';
import { Search, Tag, BookOpen } from 'lucide-react';
import Button from '../ui/Button';

const Sidebar = ({
  onSearch,
  onCategorySelect,
  onTagSelect,
  selectedCategory = '',
  selectedTag = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Tech', 'Lifestyle', 'Travel', 'Food', 'Science', 'Other'];
  
  const popularTags = [
    'react',
    'javascript',
    'webdev',
    'tutorial',
    'database',
    'design',
    'productivity',
    'ai',
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (onSearch) onSearch('');
  };

  return (
    <aside className="w-full lg:w-80 space-y-6 shrink-0">
      {/* Search Widget */}
      <div className="bg-bg-card border border-neutral-900 rounded p-5">
        <h4 className="text-base font-display font-semibold text-cream-light mb-3 flex items-center gap-2">
          <Search size={16} className="text-amber" /> Search
        </h4>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Type and hit Enter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-input text-cream border border-neutral-800 focus:border-amber focus:ring-1 focus:ring-amber/30 rounded pl-4 pr-10 py-2 text-sm outline-none transition-all duration-200"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-muted hover:text-amber transition-colors cursor-pointer"
          >
            <Search size={16} />
          </button>
        </form>
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="text-xs text-amber hover:underline mt-2 flex justify-end w-full"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Categories Widget */}
      <div className="bg-bg-card border border-neutral-900 rounded p-5">
        <h4 className="text-base font-display font-semibold text-cream-light mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-amber" /> Categories
        </h4>
        <div className="flex flex-col space-y-1.5">
          <button
            onClick={() => onCategorySelect && onCategorySelect('')}
            className={`text-left text-sm py-1.5 px-2.5 rounded transition-colors ${
              !selectedCategory
                ? 'bg-neutral-800 text-amber font-medium'
                : 'text-cream-muted hover:bg-neutral-900 hover:text-cream-light'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect && onCategorySelect(cat)}
              className={`text-left text-sm py-1.5 px-2.5 rounded transition-colors ${
                selectedCategory === cat
                  ? 'bg-neutral-800 text-amber font-medium'
                  : 'text-cream-muted hover:bg-neutral-900 hover:text-cream-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Tags Widget */}
      <div className="bg-bg-card border border-neutral-900 rounded p-5">
        <h4 className="text-base font-display font-semibold text-cream-light mb-3 flex items-center gap-2">
          <Tag size={16} className="text-amber" /> Popular Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagSelect && onTagSelect(selectedTag === tag ? '' : tag)}
              className={`text-xs px-2.5 py-1.5 rounded transition-all border ${
                selectedTag === tag
                  ? 'bg-amber text-bg-dark border-transparent font-medium'
                  : 'bg-neutral-900 text-cream-muted border-neutral-800 hover:border-neutral-700 hover:text-cream-light'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
