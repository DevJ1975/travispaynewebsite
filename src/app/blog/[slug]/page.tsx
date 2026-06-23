import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Markdown } from '@/components/blog/Markdown';
import { BlogCard } from '@/components/cards/BlogCard';
import { getPostBySlug, getPublishedPosts } from '@/lib/queries/blog';
import { formatDate, readingMinutes } from '@/lib/blog/utils';
import { SITE } from '@/lib/site';

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    openGraph: { type: 'article', title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = (await getPublishedPosts()).filter((item) => item.id !== post.id).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt ?? undefined,
    author: { '@type': 'Person', name: post.authorName },
    url: `${SITE.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="px-6 pt-40 md:px-16">
        <div className="mx-auto max-w-prose">
          {post.categories[0] && (
            <p className="font-mono text-xs uppercase tracking-widest text-tp-gold">
              {post.categories[0]}
            </p>
          )}
          <h1 className="mt-3 font-display text-display-lg font-light leading-tight text-tp-white">
            {post.title}
          </h1>
          <p className="mt-4 font-mono text-sm text-tp-muted">
            {formatDate(post.publishedAt)} · {readingMinutes(post.bodyMdx)} min read ·{' '}
            {post.authorName}
          </p>
        </div>
      </header>

      <div className="px-6 md:px-0">
        <div
          aria-hidden
          className="mx-auto mt-10 aspect-[21/9] max-w-prose rounded-tp-lg bg-gradient-to-br from-tp-elevated via-tp-surface to-tp-black"
        />
      </div>

      <article className="px-6 py-16 md:px-0">
        <div className="mx-auto max-w-prose">
          <Markdown>{post.bodyMdx}</Markdown>
          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-tp-full border border-tp-border px-3 py-1 text-xs text-tp-gray"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <Section className="pb-32">
          <h2 className="mb-8 font-display text-display-sm text-tp-white">Related posts</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <BlogCard key={item.id} post={item} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
