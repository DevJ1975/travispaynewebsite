import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { ProductionsExplorer } from '@/components/productions/ProductionsExplorer';

export const metadata: Metadata = {
  title: 'Productions',
  description:
    'Choreography, direction, and production across tours, film, television, and live events.',
};

export default function ProductionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Productions"
        title="A Career in Moments"
        subtitle="Choreography, direction, and production across tours, film, television, and live events."
      />
      <Section className="pb-32">
        <ProductionsExplorer />
      </Section>
    </>
  );
}
