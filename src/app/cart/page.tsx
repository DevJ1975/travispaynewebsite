import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { CartView } from '@/components/store/CartView';

export const metadata: Metadata = { title: 'Cart' };

export default function CartPage() {
  return (
    <>
      <PageHeader eyebrow="Cart" title="Your Cart" />
      <Section className="pb-32">
        <CartView />
      </Section>
    </>
  );
}
