import type { BlogPost, PostStatus } from '@/lib/types/blog';
import { SAMPLE_POSTS } from '@/content/sample-posts';

// Server-only blog reads via firebase-admin (doc 05 §2). When Firebase is not
// configured (local dev / preview before projects exist), public reads fall back
// to seed content so the site still renders; admin reads return empty.

type DocData = Record<string, unknown>;

function firebaseConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
}

async function getDb() {
  const { adminDb } = await import('@/lib/firebase/admin');
  return adminDb;
}

function toIso(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: unknown }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return null;
}

function mapPost(id: string, data: DocData): BlogPost {
  return {
    id,
    slug: String(data.slug ?? id),
    title: String(data.title ?? 'Untitled'),
    excerpt: String(data.excerpt ?? ''),
    bodyMdx: String(data.bodyMdx ?? ''),
    status: (data.status as PostStatus) ?? 'draft',
    publishedAt: toIso(data.publishedAt),
    authorName: String(data.authorName ?? 'Travis Payne Productions'),
    authorUid: data.authorUid ? String(data.authorUid) : undefined,
    coverImageUrl: data.coverImageUrl ? String(data.coverImageUrl) : undefined,
    coverImageAlt: data.coverImageAlt ? String(data.coverImageAlt) : undefined,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    categories: Array.isArray(data.categories) ? (data.categories as string[]) : [],
    featured: Boolean(data.featured),
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    seoDescription: data.seoDescription ? String(data.seoDescription) : undefined,
    createdAt: toIso(data.createdAt) ?? undefined,
    updatedAt: toIso(data.updatedAt) ?? undefined,
  };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (!firebaseConfigured()) {
    return SAMPLE_POSTS.filter((post) => post.status === 'published');
  }
  try {
    const db = await getDb();
    const snapshot = await db
      .collection('blogPosts')
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .get();
    return snapshot.docs.map((doc) => mapPost(doc.id, doc.data()));
  } catch (error) {
    console.error('[getPublishedPosts] failed', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!firebaseConfigured()) {
    return SAMPLE_POSTS.find((post) => post.slug === slug && post.status === 'published') ?? null;
  }
  try {
    const db = await getDb();
    const snapshot = await db.collection('blogPosts').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) return null;
    const post = mapPost(snapshot.docs[0].id, snapshot.docs[0].data());
    return post.status === 'published' ? post : null;
  } catch (error) {
    console.error('[getPostBySlug] failed', error);
    return null;
  }
}

export async function getRecentPosts(count = 3): Promise<BlogPost[]> {
  return (await getPublishedPosts()).slice(0, count);
}

/** Admin: all posts including drafts (requires Firebase). */
export async function getAllPostsAdmin(): Promise<BlogPost[]> {
  if (!firebaseConfigured()) return [];
  try {
    const db = await getDb();
    const snapshot = await db.collection('blogPosts').orderBy('updatedAt', 'desc').get();
    return snapshot.docs.map((doc) => mapPost(doc.id, doc.data()));
  } catch (error) {
    console.error('[getAllPostsAdmin] failed', error);
    return [];
  }
}

export async function getPostByIdAdmin(id: string): Promise<BlogPost | null> {
  if (!firebaseConfigured()) return null;
  try {
    const db = await getDb();
    const doc = await db.collection('blogPosts').doc(id).get();
    if (!doc.exists) return null;
    return mapPost(doc.id, (doc.data() ?? {}) as DocData);
  } catch (error) {
    console.error('[getPostByIdAdmin] failed', error);
    return null;
  }
}
