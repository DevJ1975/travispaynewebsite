import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/ComingSoon';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, insights, and stories from the studio.',
};

export default function BlogPage() {
  return (
    <ComingSoon
      eyebrow="From the Studio"
      title="News, Insights & Stories"
      note="The blog launches in Phase 2 with a full publishing workflow. Check back soon."
    />
  );
}
