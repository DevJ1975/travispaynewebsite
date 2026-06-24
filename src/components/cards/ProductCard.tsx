import Link from 'next/link';
import type { Product } from '@/lib/types/store';
import { formatPrice } from '@/lib/store/format';

/** Product card (doc 03 §7.9). Square placeholder until product imagery lands. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/store/${product.slug}`}
      className="group block overflow-hidden rounded-tp-lg border border-tp-border bg-tp-surface transition-colors hover:border-tp-gold/50"
    >
      <div
        aria-hidden
        className="aspect-square w-full bg-gradient-to-br from-tp-elevated via-tp-surface to-tp-black transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <div className="p-5">
        <h3 className="font-display text-xl text-tp-white">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-tp-gold">{formatPrice(product.price, product.currency)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-tp-muted line-through">
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
