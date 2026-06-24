import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Accordion } from '@/components/marketing/Accordion';
import { TeamCard } from '@/components/cards/TeamCard';
import { MasterclassExplorer } from '@/components/masterclasses/MasterclassExplorer';
import { LEADERSHIP } from '@/content/team';
import { getPublishedMasterclasses } from '@/lib/queries/masterclasses';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Masterclasses',
  description: 'World-class online dance education with Travis Payne and Stacy Walker.',
};

const FAQS = [
  {
    q: 'How long do I have access?',
    a: 'Enrollment is lifetime — revisit your classes whenever you like.',
  },
  {
    q: 'What level are the classes for?',
    a: 'Classes are labeled beginner, intermediate, or advanced. Start with Foundation of Groove.',
  },
  {
    q: 'Do I need any equipment?',
    a: 'Just space to move and a device to watch on. Optional resources are linked per lesson.',
  },
];

export default async function MasterclassesPage() {
  const classes = await getPublishedMasterclasses();

  return (
    <>
      <PageHeader
        eyebrow="Masterclasses"
        title="Train with Travis Payne & Stacy Walker"
        subtitle="World-class online dance education."
      />

      <Section className="pb-16">
        <div className="grid gap-10 sm:grid-cols-2">
          {LEADERSHIP.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </Section>

      <Section className="pb-24">
        <MasterclassExplorer classes={classes} />
      </Section>

      <Section className="pb-32">
        <h2 className="mb-8 font-display text-display-sm text-tp-white">FAQ</h2>
        <Accordion items={FAQS} />
      </Section>
    </>
  );
}
