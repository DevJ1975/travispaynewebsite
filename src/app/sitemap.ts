import type { MetadataRoute } from 'next';
import { PRODUCTIONS } from '@/content/productions';
import { getPublishedPosts } from '@/lib/queries/blog';
import { getActiveProducts } from '@/lib/queries/store';
import { SITE } from '@/lib/site';

export const revalidate = 3600;

const STATIC_PATHS = [
  '',
  '/about',
  '/productions',
  '/team',
  '/partners',
  '/masterclasses',
  '/blog',
  '/store',
  '/contact',
  '/book',
  '/hiras',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
  }));

  const productionEntries = PRODUCTIONS.map((production) => ({
    url: `${SITE.url}/productions/${production.slug}`,
    lastModified: now,
  }));

  const posts = await getPublishedPosts();
  const postEntries = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
  }));

  const products = await getActiveProducts();
  const productEntries = products.map((product) => ({
    url: `${SITE.url}/store/${product.slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...productionEntries, ...productEntries, ...postEntries];
}
