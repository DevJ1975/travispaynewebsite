import type { ReactNode } from 'react';

/** Editorial pull-quote (doc 03 §8.2, §8.10). */
export function PullQuote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="border-l-2 border-tp-gold pl-6">
      <blockquote className="font-display text-display-sm font-light italic leading-tight text-tp-white">
        {children}
      </blockquote>
      {cite && <figcaption className="mt-3 font-mono text-sm text-tp-gray">— {cite}</figcaption>}
    </figure>
  );
}
