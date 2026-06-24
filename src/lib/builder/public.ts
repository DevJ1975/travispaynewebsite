import type { SitePage } from './types';

// Server-side read of a published page via the Firestore REST API. Works with the public
// web config (no service account) because `publishedPages` is public-read in the rules.
const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'travis-payne';
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyBpUbdxwuFiSAP65QAJhNPTI-a9-30iQM8';

export async function getPublishedSitePage(slug: string): Promise<SitePage | null> {
  if (!slug || slug.includes('/')) return null;
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/publishedPages/${encodeURIComponent(
    slug,
  )}?key=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { fields?: { json?: { stringValue?: string } } };
    const json = data.fields?.json?.stringValue;
    if (!json) return null;
    return JSON.parse(json) as SitePage;
  } catch {
    return null;
  }
}
