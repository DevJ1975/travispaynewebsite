import type { Variants } from 'framer-motion';

// Motion language from doc 03 §5. Cubic-bezier tuples are typed so they satisfy
// framer-motion's Easing type.
const cinematic: [number, number, number, number] = [0.76, 0, 0.24, 1];
const smooth: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: cinematic } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: smooth } },
};

// Reduced-motion fallback: opacity only, no translate (doc 03 §9).
export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};
