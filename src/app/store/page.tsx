import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/ComingSoon';

export const metadata: Metadata = {
  title: 'Store',
  description: 'Travis Payne Exclusives — the TPX Store.',
};

export default function StorePage() {
  return (
    <ComingSoon
      eyebrow="TPX Store"
      title="Travis Payne Exclusives"
      note="The store launches in Phase 3 with secure checkout and Google Pay. Check back soon."
    />
  );
}
