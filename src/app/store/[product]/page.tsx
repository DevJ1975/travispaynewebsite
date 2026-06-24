import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Markdown } from '@/components/blog/Markdown';
import { AddToCart } from '@/components/store/AddToCart';
import { getActiveProducts, getProductBySlug } from '@/lib/queries/store';
import { formatPrice } from '@/lib/store/format';

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((product) => ({ product: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>;
}): Promise<Metadata> {
  const { product: slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product: slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== 'active') notFound();

  return (
    <Section className="pb-32 pt-40">
      <p className="font-mono text-sm text-tp-gray">
        <Link href="/store" className="hover:text-tp-gold">
          Store
        </Link>{' '}
        / {product.name}
      </p>

      <div className="mt-6 grid gap-12 lg:grid-cols-2">
        <div
          aria-hidden
          className="aspect-square w-full rounded-tp-lg bg-gradient-to-br from-tp-elevated via-tp-surface to-tp-black"
        />
        <div>
          <h1 className="font-display text-display-md font-light text-tp-white">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl text-tp-gold">{formatPrice(product.price, product.currency)}</span>
            {product.compareAtPrice && (
              <span className="text-tp-muted line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
            )}
          </div>
          <div className="mt-6">
            <Markdown>{product.description}</Markdown>
          </div>
          <div className="mt-8">
            <AddToCart product={product} />
          </div>
          {product.type === 'physical' && (
            <p className="mt-4 text-xs text-tp-muted">
              {product.inventory > 0 ? `${product.inventory} in stock` : 'Made to order'}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
