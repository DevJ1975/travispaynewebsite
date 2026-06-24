import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteRenderer } from '@/components/builder/SiteRenderer';
import { getPublishedSitePage } from '@/lib/builder/public';

// Serves pages published from the freeform builder (/studio). Single-segment slugs only;
// more-specific code routes (blog, store, admin, …) always win. SSR via Firestore REST.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug.length !== 1) return {};
  const page = await getPublishedSitePage(slug[0]);
  return page ? { title: page.title } : {};
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (slug.length !== 1) notFound();
  const page = await getPublishedSitePage(slug[0]);
  if (!page) notFound();
  return <SiteRenderer page={page} />;
}
