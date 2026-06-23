'use client';

import { useEffect, useState } from 'react';
import { cartCount, useCart } from '@/lib/store/cart';

/** Cart item-count badge for the nav. Renders only after mount to avoid hydration mismatch. */
export function CartCount() {
  const items = useCart((state) => state.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = mounted ? cartCount(items) : 0;
  if (!count) return null;

  return (
    <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-tp-full bg-tp-gold px-1 text-[10px] font-bold text-tp-black">
      {count}
    </span>
  );
}
