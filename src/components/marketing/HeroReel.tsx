'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// Full-bleed hero background. Lazily plays a looping reel when sources are provided
// (doc 03 §6); otherwise shows the cinematic gradient. Skips video for reduced-motion
// and Save-Data users. A bottom scrim blends into the page.
export function HeroReel({
  webmSrc,
  mp4Src,
  poster,
}: {
  webmSrc?: string;
  mp4Src?: string;
  poster?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const hasVideo = Boolean(webmSrc || mp4Src) && !reduce;

  useEffect(() => {
    if (!hasVideo) return;
    const element = ref.current;
    if (!element) return;

    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setActive(true);
        void element.play?.().catch(() => {});
        observer.disconnect();
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasVideo]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-tp-black">
      {hasVideo && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          className={`h-full w-full object-cover transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`}
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          {mp4Src && <source src={mp4Src} type="video/mp4" />}
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-tp-elevated/30 via-tp-black/60 to-tp-black" />
    </div>
  );
}
