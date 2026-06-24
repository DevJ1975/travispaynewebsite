import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { StoreExplorer } from '@/components/store/StoreExplorer';
import { getActiveProducts } from '@/lib/queries/store';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Store',
  description: 'Travis Payne Exclusives — the TPX Store.',
};

export default async function StorePage() {
  const products = await getActiveProducts();
  return (
    <>
      <PageHeader eyebrow="TPX Store" title="Travis Payne Exclusives" />
      <Section className="pb-32">
        <StoreExplorer products={products} />
      </Section>
    </>
  );
}
