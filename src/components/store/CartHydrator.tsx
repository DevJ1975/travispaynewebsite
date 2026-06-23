'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/store/cart';

/** Rehydrates the persisted cart on the client (store uses skipHydration). */
export function CartHydrator() {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  return null;
}
