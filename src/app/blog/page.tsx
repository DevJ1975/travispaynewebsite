import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { BlogCard } from '@/components/cards/BlogCard';
import { BlogExplorer } from '@/components/blog/BlogExplorer';
import { getPublishedPosts } from '@/lib/queries/blog';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, insights, and stories from the studio.',
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const rest = featured ? posts.filter((post) => post.id !== featured.id) : posts;

  return (
    <>
      <PageHeader eyebrow="From the Studio" title="News, Insights & Stories" />

      {featured && (
        <Section className="pb-12">
          <BlogCard post={featured} featured />
        </Section>
      )}

      <Section className="pb-32">
        <BlogExplorer posts={rest} />
      </Section>
    </>
  );
}
