import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Render } from '@measured/puck/rsc';
import { puckConfig } from '@/lib/puck/puck.config';
import { getPublishedPageBySlug } from '@/lib/queries/pages';

// Catch-all for editor-built pages. More-specific file routes (blog, store, admin,
// etc.) always win; this only handles slugs with no code route (doc 06 §5).
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug.join('/'));
  if (!page) return {};
  return { title: page.seoTitle || page.title, description: page.seoDescription };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug.join('/'));
  if (!page) notFound();

  return <Render config={puckConfig} data={page.publishedData} />;
}
