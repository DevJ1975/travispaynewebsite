'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { cartSubtotal, useCart } from '@/lib/store/cart';
import { formatPrice } from '@/lib/store/format';
import { createCheckoutSession } from '@/lib/actions/checkout';

export function CartView() {
  const items = useCart((state) => state.items);
  const remove = useCart((state) => state.remove);
  const setQuantity = useCart((state) => state.setQuantity);

  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <p className="text-tp-gray">Loading your cart…</p>;

  if (items.length === 0) {
    return (
      <div>
        <p className="text-tp-gray">Your cart is empty.</p>
        <Link href="/store" className="mt-4 inline-block text-tp-gold hover:underline">
          Continue shopping →
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  function checkout() {
    setError('');
    startTransition(async () => {
      const result = await createCheckoutSession(
        items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      );
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      setError(result.error ?? 'Could not start checkout.');
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <ul className="divide-y divide-tp-border border-y border-tp-border">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 py-5">
            <div
              aria-hidden
              className="h-20 w-20 flex-shrink-0 rounded-tp-md bg-gradient-to-br from-tp-elevated to-tp-black"
            />
            <div className="flex-1">
              <p className="font-display text-lg text-tp-white">{item.name}</p>
              <p className="text-sm text-tp-gray">{formatPrice(item.unitPrice)}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center rounded-tp-md border border-tp-border">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    className="h-9 w-9 text-tp-white"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm text-tp-white">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    className="h-9 w-9 text-tp-white"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.productId)}
                  className="text-sm text-tp-muted hover:text-tp-error"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="text-tp-white">{formatPrice(item.unitPrice * item.quantity)}</p>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-tp-lg border border-tp-border bg-tp-surface p-6">
        <div className="flex items-center justify-between border-b border-tp-border pb-4">
          <span className="text-tp-gray">Subtotal</span>
          <span className="text-tp-white">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-3 text-xs text-tp-muted">Taxes and shipping calculated at checkout.</p>
        <button
          type="button"
          onClick={checkout}
          disabled={pending}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black disabled:opacity-50"
        >
          {pending ? 'Starting checkout…' : 'Checkout'}
        </button>
        {error && (
          <p role="alert" className="mt-3 text-sm text-tp-error">
            {error}
          </p>
        )}
      </aside>
    </div>
  );
}
