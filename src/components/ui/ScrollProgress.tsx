'use client';

import { useEffect, useState } from 'react';

/** Thin gold scroll-progress line fixed to the top of the viewport (doc 03 §5). */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-cursor h-0.5 origin-left bg-tp-gold/80"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
