import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import type { SitePage } from './types';

// Cloud persistence for the freeform builder. Drafts live in `studioPages` (owner-only);
// the published version is mirrored to `publishedPages/{slug}` which is public-read and
// served (SSR) by the catch-all via the Firestore REST API. All calls throw on failure;
// callers handle it (e.g. when Firestore isn't enabled yet or the user isn't signed in).

export function editorEmails(): string[] {
  return (process.env.NEXT_PUBLIC_EDITOR_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** With no allowlist configured, any signed-in user is allowed (tighten in the console/rules). */
export function isAllowed(email: string | null | undefined): boolean {
  const list = editorEmails();
  if (list.length === 0) return true;
  return Boolean(email) && list.includes(email!.toLowerCase());
}

export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutStudio(): Promise<void> {
  await signOut(auth);
}

export async function saveDraftCloud(page: SitePage): Promise<void> {
  await setDoc(
    doc(db, 'studioPages', page.id),
    { slug: page.slug, title: page.title, updatedAt: Date.now(), draftJson: JSON.stringify(page) },
    { merge: true },
  );
}

export async function getDraftCloud(id: string): Promise<SitePage | null> {
  const snap = await getDoc(doc(db, 'studioPages', id));
  if (!snap.exists()) return null;
  const json = snap.data().draftJson as string | undefined;
  return json ? (JSON.parse(json) as SitePage) : null;
}

export async function listDraftsCloud(): Promise<SitePage[]> {
  const snap = await getDocs(collection(db, 'studioPages'));
  return snap.docs
    .map((d) => {
      try {
        return JSON.parse((d.data().draftJson as string) ?? 'null') as SitePage | null;
      } catch {
        return null;
      }
    })
    .filter((p): p is SitePage => Boolean(p && p.id));
}

export async function deleteDraftCloud(id: string): Promise<void> {
  await deleteDoc(doc(db, 'studioPages', id));
}

export async function publishCloud(page: SitePage): Promise<void> {
  // Public, SSR-readable copy keyed by slug.
  await setDoc(doc(db, 'publishedPages', page.slug), {
    json: JSON.stringify(page),
    title: page.title,
    updatedAt: Date.now(),
  });
  // Mark the draft as published.
  await setDoc(
    doc(db, 'studioPages', page.id),
    { status: 'published', slug: page.slug, title: page.title, updatedAt: Date.now(), draftJson: JSON.stringify(page) },
    { merge: true },
  );
}
