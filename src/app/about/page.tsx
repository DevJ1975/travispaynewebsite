import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Timeline } from '@/components/marketing/Timeline';
import { PullQuote } from '@/components/marketing/PullQuote';
import { AWARDS, BIO, MILESTONES, PRESS_QUOTE } from '@/content/about';

export const metadata: Metadata = {
  title: 'About',
  description: 'Travis Payne — world-renowned choreographer, director, and producer.',
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Travis Payne"
        subtitle="World-renowned choreographer, director, and producer."
      />

      <Section className="pb-24">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <Reveal className="space-y-5">
            {BIO.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-lg leading-relaxed text-tp-gray">
                {paragraph}
              </p>
            ))}
          </Reveal>
          <Reveal className="space-y-8">
            <PullQuote cite={PRESS_QUOTE.cite}>{PRESS_QUOTE.quote}</PullQuote>
            <div>
              <h2 className="text-overline uppercase text-tp-gold">Recognition</h2>
              <ul className="mt-3 space-y-2 text-tp-gray">
                {AWARDS.map((award) => (
                  <li key={award}>{award}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="pb-32">
        <SectionHeading eyebrow="Career" title="A Career in Moments" className="mb-12" />
        <Reveal>
          <Timeline milestones={MILESTONES} />
        </Reveal>
      </Section>
    </>
  );
}
