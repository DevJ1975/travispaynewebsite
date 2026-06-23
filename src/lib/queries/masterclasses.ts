import type { ClassLevel, Enrollment, Lesson, Masterclass } from '@/lib/types/masterclass';
import { SAMPLE_MASTERCLASSES } from '@/content/sample-masterclasses';

// Server-only masterclass reads via firebase-admin, with seed-catalog fallback.

type DocData = Record<string, unknown>;

function firebaseConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
}

async function getDb() {
  const { adminDb } = await import('@/lib/firebase/admin');
  return adminDb;
}

function mapLesson(id: string, data: DocData): Lesson {
  return {
    id,
    title: String(data.title ?? 'Untitled'),
    order: Number(data.order ?? 0),
    durationSeconds: Number(data.durationSeconds ?? 0),
    description: data.description ? String(data.description) : undefined,
    muxPlaybackId: data.muxPlaybackId ? String(data.muxPlaybackId) : undefined,
  };
}

function mapClass(id: string, data: DocData, lessons: Lesson[]): Masterclass {
  return {
    id,
    slug: String(data.slug ?? id),
    title: String(data.title ?? 'Untitled'),
    instructors: Array.isArray(data.instructors) ? (data.instructors as string[]) : [],
    description: String(data.description ?? ''),
    coverImageUrl: data.coverImageUrl ? String(data.coverImageUrl) : undefined,
    previewPlaybackId: data.previewPlaybackId ? String(data.previewPlaybackId) : undefined,
    durationMinutes: Number(data.durationMinutes ?? 0),
    level: (data.level as ClassLevel) ?? 'beginner',
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    price: Number(data.price ?? 0),
    status: (data.status as Masterclass['status']) ?? 'draft',
    lessons,
  };
}

async function loadLessons(classId: string): Promise<Lesson[]> {
  const db = await getDb();
  const snapshot = await db
    .collection('masterclasses')
    .doc(classId)
    .collection('lessons')
    .orderBy('order')
    .get();
  return snapshot.docs.map((doc) => mapLesson(doc.id, doc.data()));
}

export async function getPublishedMasterclasses(): Promise<Masterclass[]> {
  if (!firebaseConfigured()) {
    return SAMPLE_MASTERCLASSES.filter((c) => c.status === 'published').map((c) => ({
      ...c,
      lessons: [],
    }));
  }
  try {
    const db = await getDb();
    const snapshot = await db.collection('masterclasses').where('status', '==', 'published').get();
    return snapshot.docs.map((doc) => mapClass(doc.id, doc.data(), []));
  } catch (error) {
    console.error('[getPublishedMasterclasses] failed', error);
    return [];
  }
}

export async function getMasterclassBySlug(slug: string): Promise<Masterclass | null> {
  if (!firebaseConfigured()) {
    return SAMPLE_MASTERCLASSES.find((c) => c.slug === slug) ?? null;
  }
  try {
    const db = await getDb();
    const snapshot = await db.collection('masterclasses').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const lessons = await loadLessons(doc.id);
    return mapClass(doc.id, doc.data(), lessons);
  } catch (error) {
    console.error('[getMasterclassBySlug] failed', error);
    return null;
  }
}

export async function getMasterclassById(id: string): Promise<Masterclass | null> {
  if (!firebaseConfigured()) {
    return SAMPLE_MASTERCLASSES.find((c) => c.id === id) ?? null;
  }
  try {
    const db = await getDb();
    const doc = await db.collection('masterclasses').doc(id).get();
    if (!doc.exists) return null;
    const lessons = await loadLessons(doc.id);
    return mapClass(doc.id, (doc.data() ?? {}) as DocData, lessons);
  } catch (error) {
    console.error('[getMasterclassById] failed', error);
    return null;
  }
}

export async function getEnrollment(uid: string, classId: string): Promise<Enrollment | null> {
  if (!firebaseConfigured()) return null;
  try {
    const db = await getDb();
    const doc = await db.collection('enrollments').doc(`${uid}_${classId}`).get();
    if (!doc.exists) return null;
    const data = (doc.data() ?? {}) as DocData;
    return {
      id: doc.id,
      uid: String(data.uid ?? uid),
      masterclassId: String(data.masterclassId ?? classId),
      status: (data.status as Enrollment['status']) ?? 'revoked',
    };
  } catch (error) {
    console.error('[getEnrollment] failed', error);
    return null;
  }
}
