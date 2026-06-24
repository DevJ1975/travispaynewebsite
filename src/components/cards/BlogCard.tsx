import Link from 'next/link';
import type { BlogPost } from '@/lib/types/blog';
import { formatDate, readingMinutes } from '@/lib/blog/utils';
import { cn } from '@/lib/utils/cn';

/** Blog card (doc 03 §7.8). `featured` renders a wide horizontal layout. */
export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group block overflow-hidden rounded-tp-lg border border-tp-border bg-tp-surface transition-colors hover:border-tp-gold/50',
        featured && 'md:grid md:grid-cols-2',
      )}
    >
      <div
        aria-hidden
        className={cn(
          'w-full bg-gradient-to-br from-tp-elevated via-tp-surface to-tp-black',
          featured ? 'aspect-[16/10] md:h-full' : 'aspect-[16/9]',
        )}
      />
      <div className="p-6">
        {post.categories[0] && (
          <span className="font-mono text-xs uppercase tracking-widest text-tp-gold">
            {post.categories[0]}
          </span>
        )}
        <h3 className={cn('mt-2 font-display text-tp-white', featured ? 'text-display-sm' : 'text-2xl')}>
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-tp-gray">{post.excerpt}</p>
        <p className="mt-4 font-mono text-xs text-tp-muted">
          {formatDate(post.publishedAt)} · {readingMinutes(post.bodyMdx)} min read · {post.authorName}
        </p>
      </div>
    </Link>
  );
}
