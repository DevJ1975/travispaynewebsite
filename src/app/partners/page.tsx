import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { LogoMarquee } from '@/components/marketing/LogoMarquee';
import { ALL_PARTNERS, PARTNER_GROUPS } from '@/content/partners';

export const metadata: Metadata = {
  title: 'Partners',
  description: 'An unmatched network of artists, brands, and collaborators.',
};

export default function PartnersPage() {
  return (
    <>
      <PageHeader eyebrow="Partners & Collaborators" title="An Unmatched Network" />
      <LogoMarquee items={ALL_PARTNERS} />
      <Section className="space-y-16 py-20 pb-32">
        {PARTNER_GROUPS.map((group) => (
          <Reveal key={group.category}>
            <h2 className="text-overline uppercase text-tp-gold">{group.category}</h2>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
              {group.names.map((name) => (
                <li
                  key={name}
                  className="border-b border-tp-border pb-3 font-display text-xl text-tp-white"
                >
                  {name}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </Section>
    </>
  );
}
