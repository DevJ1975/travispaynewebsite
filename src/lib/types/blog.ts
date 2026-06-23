// Canonical blogPosts shape (doc 04 §3.1, doc 05 C1). Timestamps are normalized to
// ISO strings at the query boundary so values are safe to pass to Client Components.

export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyMdx: string;
  status: PostStatus;
  publishedAt: string | null;
  authorName: string;
  authorUid?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  tags: string[];
  categories: string[];
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const BLOG_CATEGORIES = [
  'All',
  'Industry',
  'Masterclasses',
  'Behind the Scenes',
  'Press',
] as const;
