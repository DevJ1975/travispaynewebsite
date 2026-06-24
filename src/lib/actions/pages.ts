'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Data } from '@measured/puck';
import { getSessionUser, isEditor } from '@/lib/auth/session';
import { getPageByIdAdmin } from '@/lib/queries/pages';
import { emptyPuckData } from '@/lib/puck/empty';
import { RESERVED_SLUGS } from '@/lib/types/page';

// Page-builder write actions (doc 06 §6). Gated to editor/admin; deletes are admin-only.

export type NewPageState = { error?: string };

// Strip undefined (Firestore rejects it) from a Puck tree before persisting.
function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function firestore() {
  const { adminDb } = await import('@/lib/firebase/admin');
  const { FieldValue } = await import('firebase-admin/firestore');
  return { adminDb, FieldValue };
}

export async function createPage(_prev: NewPageState, formData: FormData): Promise<NewPageState> {
  const user = await getSessionUser();
  if (!user || !isEditor(user)) return { error: 'You are not authorized to do that.' };
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return { error: 'Firebase is not configured yet, so pages cannot be created.' };
  }

  const title = String(formData.get('title') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim().toLowerCase();
  if (title.length < 2) return { error: 'Enter a page title.' };
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: 'Slug: lowercase letters, numbers, and hyphens only.' };
  }
  if (RESERVED_SLUGS.includes(slug)) return { error: `"${slug}" is a reserved route.` };

  let id: string;
  try {
    const { adminDb, FieldValue } = await firestore();
    const existing = await adminDb.collection('pages').where('slug', '==', slug).limit(1).get();
    if (!existing.empty) return { error: 'That slug is already in use.' };

    const empty = emptyPuckData();
    const ref = await adminDb.collection('pages').add({
      slug,
      title,
      status: 'draft',
      draftData: empty,
      publishedData: empty,
      showInNav: false,
      navOrder: 0,
      createdBy: user.uid,
      updatedBy: user.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    id = ref.id;
  } catch (error) {
    console.error('[createPage] failed', error);
    return { error: 'Could not create the page.' };
  }

  redirect(`/admin/pages/${id}/edit`);
}

export async function savePageDraft(
  id: string,
  data: Data,
): Promise<{ ok: boolean; message: string }> {
  const user = await getSessionUser();
  if (!user || !isEditor(user)) return { ok: false, message: 'Not authorized.' };
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return { ok: false, message: 'Firebase is not configured — cannot save.' };
  }
  try {
    const { adminDb, FieldValue } = await firestore();
    await adminDb
      .collection('pages')
      .doc(id)
      .set({ draftData: clean(data), updatedBy: user.uid, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return { ok: true, message: 'Draft saved.' };
  } catch (error) {
    console.error('[savePageDraft] failed', error);
    return { ok: false, message: 'Save failed.' };
  }
}

export async function publishPage(
  id: string,
  slug: string,
  data: Data,
): Promise<{ ok: boolean; message: string }> {
  const user = await getSessionUser();
  if (!user || !isEditor(user)) return { ok: false, message: 'Not authorized.' };
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return { ok: false, message: 'Firebase is not configured — cannot publish.' };
  }
  try {
    const { adminDb, FieldValue } = await firestore();
    const cleaned = clean(data);
    const ref = adminDb.collection('pages').doc(id);
    await ref.set(
      {
        draftData: cleaned,
        publishedData: cleaned,
        status: 'published',
        publishedBy: user.uid,
        publishedAt: FieldValue.serverTimestamp(),
        updatedBy: user.uid,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    await ref.collection('revisions').add({
      data: cleaned,
      publishedBy: user.uid,
      publishedAt: FieldValue.serverTimestamp(),
    });
    revalidatePath(`/${slug}`);
    return { ok: true, message: `Published at /${slug}` };
  } catch (error) {
    console.error('[publishPage] failed', error);
    return { ok: false, message: 'Publish failed.' };
  }
}

export async function deletePage(id: string): Promise<void> {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') return;
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return;
  try {
    const page = await getPageByIdAdmin(id);
    const { adminDb } = await import('@/lib/firebase/admin');
    await adminDb.collection('pages').doc(id).delete();
    revalidatePath('/admin/pages');
    if (page) revalidatePath(`/${page.slug}`);
  } catch (error) {
    console.error('[deletePage] failed', error);
  }
}
