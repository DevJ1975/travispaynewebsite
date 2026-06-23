'use client';

import { useState } from 'react';
import { BLOG_CATEGORIES, type BlogPost } from '@/lib/types/blog';
import { BlogCard } from '@/components/cards/BlogCard';
import { cn } from '@/lib/utils/cn';

/** Blog index grid with category filter tabs (doc 03 §8.9). */
export function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<string>('All');
  const list = category === 'All' ? posts : posts.filter((post) => post.categories.includes(category));

  return (
    <div>
      <div role="tablist" aria-label="Filter posts" className="mb-10 flex flex-wrap gap-3">
        {BLOG_CATEGORIES.map((option) => {
          const selected = category === option;
          return (
            <button
              key={option}
              role="tab"
              aria-selected={selected}
              onClick={() => setCategory(option)}
              className={cn(
                'rounded-tp-full border px-4 py-2 text-xs uppercase tracking-wider transition-colors',
                selected
                  ? 'border-tp-gold bg-tp-gold text-tp-black'
                  : 'border-tp-border text-tp-gray hover:border-tp-gold hover:text-tp-gold',
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {list.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-tp-gray">No posts in this category yet.</p>
      )}
    </div>
  );
}
