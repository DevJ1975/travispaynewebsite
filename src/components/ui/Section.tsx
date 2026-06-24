import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/** Standard section wrapper: horizontal gutters + centered max-width content. */
export function Section({
  children,
  className,
  id,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
}) {
  return (
    <section id={id} aria-label={ariaLabel} className={cn('px-6 md:px-16', className)}>
      <div className="mx-auto max-w-site">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-overline uppercase text-tp-gold">{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 font-display text-display-md font-light text-tp-white">{title}</h2>
    </div>
  );
}
