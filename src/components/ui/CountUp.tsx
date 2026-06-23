'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { formatStat, parseStatValue } from '@/lib/ui/countup';

// Counts up to the numeric part of a stat when it scrolls into view (doc 03 §8.1).
// Falls back to the static value under prefers-reduced-motion.
export function CountUp({ value, durationMs = 1200 }: { value: string; durationMs?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parseStatValue(value);
  // SSR / no-JS renders the real value; the client resets to 0 before animating.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!parsed || reduce) {
      setDisplay(value);
      return;
    }
    const element = ref.current;
    if (!element) return;

    setDisplay(formatStat(parsed, 0));
    let raf = 0;
    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(formatStat(parsed, parsed.value * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
          else setDisplay(value);
        };
        raf = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [parsed, reduce, value, durationMs]);

  return <span ref={ref}>{display}</span>;
}
