'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/store/cart';

export default function CheckoutSuccessPage() {
  const clear = useCart((state) => state.clear);
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-narrow px-6 pb-32 pt-40 text-center">
      <p className="text-overline uppercase text-tp-gold">Thank you</p>
      <h1 className="mt-4 font-display text-display-md font-light text-tp-white">Order confirmed</h1>
      <p className="mt-5 text-tp-gray">
        A confirmation email is on its way. We appreciate your support.
      </p>
      <Link
        href="/store"
        className="mt-8 inline-flex h-11 items-center rounded-tp-md border border-tp-gold px-6 text-tp-gold transition-colors hover:bg-tp-gold hover:text-tp-black"
      >
        Continue shopping
      </Link>
    </div>
  );
}
