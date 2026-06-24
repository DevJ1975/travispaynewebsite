import Link from 'next/link';
import type { Production } from '@/content/productions';

/** Portfolio card (doc 03 §7.4). Gradient block stands in for cover art until assets land. */
export function ProductionCard({ production }: { production: Production }) {
  return (
    <Link
      href={`/productions/${production.slug}`}
      className="group block overflow-hidden rounded-tp-lg border border-tp-border bg-tp-surface transition-colors hover:border-tp-gold/50"
    >
      <div
        aria-hidden
        className="aspect-[16/9] w-full bg-gradient-to-br from-tp-elevated via-tp-surface to-tp-black transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <div className="p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-tp-gold">
          {production.category}
        </p>
        <h3 className="mt-2 font-display text-2xl text-tp-white">{production.title}</h3>
        <p className="mt-2 text-sm text-tp-gray">
          {production.year} · {production.client} · {production.role}
        </p>
      </div>
    </Link>
  );
}
