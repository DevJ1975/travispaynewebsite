'use client';

import { useState } from 'react';
import { ProductionCard } from '@/components/cards/ProductionCard';
import { PRODUCTIONS, PRODUCTION_CATEGORIES } from '@/content/productions';
import { cn } from '@/lib/utils/cn';

/** Productions index with category filter tabs (doc 03 §8.5). */
export function ProductionsExplorer() {
  const [category, setCategory] = useState<string>('All');
  const list =
    category === 'All' ? PRODUCTIONS : PRODUCTIONS.filter((p) => p.category === category);

  return (
    <div>
      <div role="tablist" aria-label="Filter productions" className="mb-10 flex flex-wrap gap-3">
        {PRODUCTION_CATEGORIES.map((option) => {
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
          {list.map((production) => (
            <ProductionCard key={production.slug} production={production} />
          ))}
        </div>
      ) : (
        <p className="text-tp-gray">More work in this category is coming soon.</p>
      )}
    </div>
  );
}
