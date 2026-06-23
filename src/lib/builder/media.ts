import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase/client';

// Cloud Storage media library for the freeform builder. Uploads land under `studio/uploads/`
// (public-read, signed-in write per storage.rules) so published pages can display them.
// All calls throw on failure; callers handle it (e.g. when Storage isn't enabled yet or the
// user isn't signed in). Reusable later for other image fields (blog/products).

export const STUDIO_MEDIA_PREFIX = 'studio/uploads';

/** ~10 MB cap keeps pages fast and stays well under Storage defaults. */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export type MediaItem = { url: string; path: string; name: string };

/** Slugify a filename so the storage path stays clean and predictable. */
function safeName(name: string): string {
  const dot = name.lastIndexOf('.');
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  const ext = (dot > 0 ? name.slice(dot + 1) : '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const stem = base || 'image';
  return ext ? `${stem}.${ext}` : stem;
}

/** Validate then upload an image; returns its public download URL. */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file (PNG, JPG, GIF, WebP, SVG).');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image is too large — please use one under 10 MB.');
  }
  const path = `${STUDIO_MEDIA_PREFIX}/${Date.now()}-${safeName(file.name)}`;
  const objectRef = ref(storage, path);
  await uploadBytes(objectRef, file, { contentType: file.type });
  return getDownloadURL(objectRef);
}

/** List previously uploaded images, newest first (path is timestamp-prefixed). */
export async function listImages(): Promise<MediaItem[]> {
  const res = await listAll(ref(storage, STUDIO_MEDIA_PREFIX));
  const items = await Promise.all(
    res.items.map(async (item) => ({
      url: await getDownloadURL(item),
      path: item.fullPath,
      name: item.name,
    })),
  );
  return items.sort((a, b) => b.path.localeCompare(a.path));
}

/** Remove an uploaded image by its storage path. */
export async function deleteImage(path: string): Promise<void> {
  await deleteObject(ref(storage, path));
}
