import Link from 'next/link';
import type { Masterclass } from '@/lib/types/masterclass';
import { formatPrice } from '@/lib/store/format';

/** Masterclass card (doc 03 §7.10). */
export function MasterclassCard({ masterclass }: { masterclass: Masterclass }) {
  return (
    <Link
      href={`/masterclasses/${masterclass.slug}`}
      className="group block overflow-hidden rounded-tp-lg border border-tp-border bg-tp-surface transition-colors hover:border-tp-gold/50"
    >
      <div
        aria-hidden
        className="relative aspect-video w-full bg-gradient-to-br from-tp-elevated via-tp-surface to-tp-black transition-transform duration-300 group-hover:scale-[1.03]"
      >
        <span className="absolute left-3 top-3 rounded-tp-full bg-tp-black/70 px-2 py-1 text-[10px] uppercase tracking-wider text-tp-gold">
          {masterclass.level}
        </span>
      </div>
      <div className="p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-tp-gold">
          {masterclass.instructors.join(' · ')}
        </p>
        <h3 className="mt-2 font-display text-xl text-tp-white">{masterclass.title}</h3>
        <p className="mt-2 text-sm text-tp-gray">{masterclass.durationMinutes} min</p>
        <p className="mt-3 text-tp-white">
          {masterclass.price === 0 ? 'Free' : formatPrice(masterclass.price)}
        </p>
      </div>
    </Link>
  );
}
