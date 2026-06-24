import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';

/** Placeholder for sections that arrive in later phases — keeps every nav link live. */
export function ComingSoon({
  eyebrow,
  title,
  subtitle,
  note,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  note: string;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <Section className="pb-32">
        <div className="rounded-tp-lg border border-tp-border bg-tp-surface p-10">
          <p className="text-overline uppercase text-tp-gold">Coming soon</p>
          <p className="mt-3 max-w-prose text-tp-gray">{note}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex h-11 items-center rounded-tp-md border border-tp-gold px-6 text-tp-gold transition-colors hover:bg-tp-gold hover:text-tp-black"
          >
            Get in touch
          </Link>
        </div>
      </Section>
    </>
  );
}
