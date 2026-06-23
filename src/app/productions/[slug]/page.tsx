import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { ProductionCard } from '@/components/cards/ProductionCard';
import { getProduction, PRODUCTIONS } from '@/content/productions';

export function generateStaticParams() {
  return PRODUCTIONS.map((production) => ({ slug: production.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const production = getProduction(slug);
  if (!production) return {};
  return { title: production.title, description: production.summary };
}

export default async function ProductionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const production = getProduction(slug);
  if (!production) notFound();

  const related = PRODUCTIONS.filter((item) => item.slug !== production.slug).slice(0, 3);

  return (
    <>
      <header className="px-6 pt-40 md:px-16">
        <div className="mx-auto max-w-site">
          <p className="font-mono text-sm text-tp-gray">
            <Link href="/productions" className="hover:text-tp-gold">
              Productions
            </Link>{' '}
            / {production.category}
          </p>
          <h1 className="mt-4 font-display text-display-xl font-light leading-tight text-tp-white">
            {production.title}
          </h1>
          <p className="mt-3 font-mono text-tp-gold">{production.role}</p>
        </div>
      </header>

      <div
        aria-hidden
        className="mx-6 mt-10 aspect-[21/9] rounded-tp-lg bg-gradient-to-br from-tp-elevated via-tp-surface to-tp-black md:mx-16"
      />

      <Section className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5">
            {production.description.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-lg leading-relaxed text-tp-gray">
                {paragraph}
              </p>
            ))}
          </div>
          <aside className="space-y-8">
            <div>
              <h2 className="text-overline uppercase text-tp-gold">Credits</h2>
              <dl className="mt-3 space-y-2">
                {production.credits.map((credit) => (
                  <div
                    key={credit.label}
                    className="flex justify-between gap-4 border-b border-tp-border pb-2 text-sm"
                  >
                    <dt className="text-tp-gray">{credit.label}</dt>
                    <dd className="text-right text-tp-white">{credit.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {production.awards && (
              <div>
                <h2 className="text-overline uppercase text-tp-gold">Awards</h2>
                <ul className="mt-3 space-y-2 text-sm text-tp-gray">
                  {production.awards.map((award) => (
                    <li key={award}>{award}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Section>

      <Section className="pb-32">
        <h2 className="mb-8 font-display text-display-sm text-tp-white">More from Travis Payne</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <ProductionCard key={item.slug} production={item} />
          ))}
        </div>
      </Section>
    </>
  );
}
