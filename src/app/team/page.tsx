import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Stagger, StaggerItem } from '@/components/ui/Reveal';
import { TeamCard } from '@/components/cards/TeamCard';
import { LEADERSHIP } from '@/content/team';

export const metadata: Metadata = {
  title: 'Team',
  description: 'The people behind the productions at Travis Payne Productions.',
};

export default function TeamPage() {
  return (
    <>
      <PageHeader eyebrow="The Team" title="The People Behind the Productions" />
      <Section className="pb-32">
        <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {LEADERSHIP.map((member) => (
            <StaggerItem key={member.name}>
              <TeamCard member={member} />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </>
  );
}
