import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/ComingSoon';

export const metadata: Metadata = {
  title: 'Masterclasses',
  description: 'World-class online dance education with Travis Payne and Stacy Walker.',
};

export default function MasterclassesPage() {
  return (
    <ComingSoon
      eyebrow="Masterclasses"
      title="Train with Travis Payne & Stacy Walker"
      subtitle="World-class online dance education."
      note="Gated video masterclasses arrive in a later phase. Join the newsletter to be first in line."
    />
  );
}
