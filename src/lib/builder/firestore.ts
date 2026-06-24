import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import type { SitePage } from './types';

// Cloud persistence for the freeform builder. Drafts live in `studioPages` (owner-only);
// the published version is mirrored to `publishedPages/{slug}` which is public-read and
// served (SSR) by the catch-all via the Firestore REST API. All calls throw on failure;
// callers handle it (e.g. when Firestore isn't enabled yet or the user isn't signed in).

// Editors allowed into the Studio builder. The list is public (it gates the client UI; cloud
// writes are also enforced by Firestore/Storage rules), so we bake the owner's emails as an
// env-overridable default — mirroring the baked Firebase web config — so the gate is enforced
// in every environment without env wiring. An empty list would make isAllowed() pass everyone,
// so we never return empty.
const DEFAULT_EDITOR_EMAILS = ['travis@travispayne.com', 'jamil@trainovations.com'];

export function editorEmails(): string[] {
  const list = (process.env.NEXT_PUBLIC_EDITOR_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.length ? list : DEFAULT_EDITOR_EMAILS;
}

/** True when the signed-in email is on the editor allowlist (always non-empty — see above). */
export function isAllowed(email: string | null | undefined): boolean {
  return Boolean(email) && editorEmails().includes(email!.toLowerCase());
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
