import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/ComingSoon';

export const metadata: Metadata = {
  title: 'HIRAS',
  description: 'The HIRAS program.',
};

export default function HirasPage() {
  return (
    <ComingSoon
      eyebrow="HIRAS"
      title="The HIRAS Program"
      note="Details on the HIRAS program are coming soon. Reach out for more information."
    />
  );
}
