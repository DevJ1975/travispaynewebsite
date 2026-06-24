'use client';

import { useState } from 'react';
import { STORE_CATEGORIES, categoryLabel, type Product } from '@/lib/types/store';
import { ProductCard } from '@/components/cards/ProductCard';
import { cn } from '@/lib/utils/cn';

/** Store index grid with category filter tabs (doc 03 §8.7). */
export function StoreExplorer({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<string>('All');
  const list = category === 'All' ? products : products.filter((p) => p.category === category);

  return (
    <div>
      <div role="tablist" aria-label="Filter products" className="mb-10 flex flex-wrap gap-3">
        {STORE_CATEGORIES.map((option) => {
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
              {categoryLabel(option)}
            </button>
          );
        })}
      </div>

      {list.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-tp-gray">No products in this category yet.</p>
      )}
    </div>
  );
}
