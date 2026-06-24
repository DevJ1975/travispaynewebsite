'use client';

import { useState } from 'react';
import type { Faq } from '@/content/faqs';

/** Accessible FAQ accordion (doc 03 §8.12). */
export function Accordion({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-tp-border border-y border-tp-border">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-display text-xl text-tp-white">{item.q}</span>
                <span aria-hidden className="text-2xl text-tp-gold">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            {isOpen && <p className="pb-5 text-tp-gray">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
