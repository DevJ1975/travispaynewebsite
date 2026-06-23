import Link from 'next/link';
import { bgClass, type BackgroundVariant } from '@/lib/puck/tokens';

export interface HeroBlockProps {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundVariant?: BackgroundVariant;
}

export function HeroBlock({
  eyebrow,
  headline = 'Headline',
  subheadline,
  ctaLabel,
  ctaHref = '#',
  backgroundVariant = 'black',
}: HeroBlockProps) {
  return (
    <section className={`${bgClass[backgroundVariant]} px-6 py-32 md:px-16`}>
      <div className="mx-auto max-w-site">
        {eyebrow && <p className="text-overline uppercase text-tp-gold">{eyebrow}</p>}
        <h1 className="mt-4 max-w-content font-display text-display-xl font-light leading-tight">
          {headline}
        </h1>
        {subheadline && <p className="mt-5 max-w-prose text-lg text-tp-gray">{subheadline}</p>}
        {ctaLabel && (
          <Link
            href={ctaHref}
            className="mt-8 inline-flex h-11 items-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black transition-colors hover:bg-tp-gold-dk"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
