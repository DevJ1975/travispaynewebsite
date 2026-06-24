import Link from 'next/link';
import { bgClass, type BackgroundVariant } from '@/lib/puck/tokens';

export interface CTABlockProps {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundVariant?: BackgroundVariant;
}

export function CTABlock({
  heading = 'Heading',
  subheading,
  ctaLabel,
  ctaHref = '#',
  backgroundVariant = 'black',
}: CTABlockProps) {
  return (
    <section className={`${bgClass[backgroundVariant]} px-6 py-24 text-center md:px-16`}>
      <div className="mx-auto max-w-content">
        <h2 className="font-display text-display-md font-light">{heading}</h2>
        {subheading && <p className="mx-auto mt-4 max-w-narrow text-tp-gray">{subheading}</p>}
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
