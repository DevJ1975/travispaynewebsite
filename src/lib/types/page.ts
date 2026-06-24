import type { Data } from '@measured/puck';

// A visually-edited marketing page (doc 06 §4). `draftData`/`publishedData` hold the
// Puck content tree; only `published` pages are served by the catch-all route.
export interface PageDoc {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published';
  draftData: Data;
  publishedData: Data;
  seoTitle?: string;
  seoDescription?: string;
  showInNav?: boolean;
  navOrder?: number;
  updatedAt?: string;
}

// Slugs owned by code-driven routes — the page builder cannot claim these (doc 06 §5).
export const RESERVED_SLUGS = [
  'about',
  'admin',
  'api',
  'blog',
  'book',
  'cart',
  'checkout',
  'contact',
  'hiras',
  'masterclasses',
  'partners',
  'productions',
  'robots.txt',
  'sitemap.xml',
  'store',
  'team',
];
