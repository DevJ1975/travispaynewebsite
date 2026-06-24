'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, reducedFade, staggerContainer, staggerItem } from '@/lib/motion/variants';

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/** Fade-up on scroll into view (doc 03 §5). Honors prefers-reduced-motion. */
export function Reveal({ children, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={reduce ? reducedFade : fadeUp}
    >
      {children}
    </motion.div>
  );
}

/** Staggered container — pair with <StaggerItem> children for grids. */
export function Stagger({ children, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={reduce ? reducedFade : staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={reduce ? reducedFade : staggerItem}>
      {children}
    </motion.div>
  );
}
