import type { Data } from '@measured/puck';
import type { PageDoc } from '@/lib/types/page';
import { emptyPuckData } from '@/lib/puck/empty';
import { SAMPLE_PAGES } from '@/content/sample-pages';

// Server-only reads for the page builder, with seed fallback when Firebase is absent.

type DocData = Record<string, unknown>;

function firebaseConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
}

async function getDb() {
  const { adminDb } = await import('@/lib/firebase/admin');
  return adminDb;
}

function toIso(value: unknown): string | undefined {
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: unknown }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return typeof value === 'string' ? value : undefined;
}

function mapPage(id: string, data: DocData): PageDoc {
  return {
    id,
    slug: String(data.slug ?? id),
    title: String(data.title ?? 'Untitled'),
    status: (data.status as PageDoc['status']) ?? 'draft',
    draftData: (data.draftData as Data) ?? emptyPuckData(),
    publishedData: (data.publishedData as Data) ?? emptyPuckData(),
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    seoDescription: data.seoDescription ? String(data.seoDescription) : undefined,
    showInNav: Boolean(data.showInNav),
    navOrder: Number(data.navOrder ?? 0),
    updatedAt: toIso(data.updatedAt),
  };
}

export async function getPublishedPageBySlug(slug: string): Promise<PageDoc | null> {
  if (!firebaseConfigured()) {
    return SAMPLE_PAGES.find((p) => p.slug === slug && p.status === 'published') ?? null;
  }
  try {
    const db = await getDb();
    const snapshot = await db
      .collection('pages')
      .where('slug', '==', slug)
      .where('status', '==', 'published')
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return mapPage(snapshot.docs[0].id, snapshot.docs[0].data());
  } catch (error) {
    console.error('[getPublishedPageBySlug] failed', error);
    return null;
  }
}

export async function getPublishedPages(): Promise<PageDoc[]> {
  if (!firebaseConfigured()) {
    return SAMPLE_PAGES.filter((p) => p.status === 'published');
  }
  try {
    const db = await getDb();
    const snapshot = await db.collection('pages').where('status', '==', 'published').get();
    return snapshot.docs.map((doc) => mapPage(doc.id, doc.data()));
  } catch (error) {
    console.error('[getPublishedPages] failed', error);
    return [];
  }
}

export async function getAllPagesAdmin(): Promise<PageDoc[]> {
  if (!firebaseConfigured()) return SAMPLE_PAGES;
  try {
    const db = await getDb();
    const snapshot = await db.collection('pages').orderBy('updatedAt', 'desc').get();
    return snapshot.docs.map((doc) => mapPage(doc.id, doc.data()));
  } catch (error) {
    console.error('[getAllPagesAdmin] failed', error);
    return [];
  }
}

export async function getPageByIdAdmin(id: string): Promise<PageDoc | null> {
  if (!firebaseConfigured()) {
    return SAMPLE_PAGES.find((p) => p.id === id) ?? null;
  }
  try {
    const db = await getDb();
    const doc = await db.collection('pages').doc(id).get();
    if (!doc.exists) return null;
    return mapPage(doc.id, (doc.data() ?? {}) as DocData);
  } catch (error) {
    console.error('[getPageByIdAdmin] failed', error);
    return null;
  }
}
