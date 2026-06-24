'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/store/cart';
import type { Product } from '@/lib/types/store';

export function AddToCart({ product }: { product: Product }) {
  const add = useCart((state) => state.add);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function onAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      unitPrice: product.price,
      quantity,
      image: product.images[0],
      type: product.type,
    });
    setAdded(true);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center rounded-tp-md border border-tp-border">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="h-11 w-11 text-lg text-tp-white"
        >
          −
        </button>
        <span className="w-10 text-center text-tp-white">{quantity}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQuantity((q) => Math.min(99, q + 1))}
          className="h-11 w-11 text-lg text-tp-white"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-11 items-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black transition-colors hover:bg-tp-gold-dk"
      >
        Add to Cart
      </button>
      {added && (
        <Link href="/cart" role="status" className="text-sm text-tp-gold hover:underline">
          Added — view cart →
        </Link>
      )}
    </div>
  );
}
