'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSessionUser, isEditor } from '@/lib/auth/session';

// Blog CMS write actions (doc 04 §Admin). Gated by editor/admin claims; deletes are
// admin-only (matches the Firestore rules). Persists to `blogPosts` via firebase-admin.

export type PostFormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
  postId?: string;
};

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title is required.'),
  slug: z
    .string()
    .min(2, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and hyphens.'),
  excerpt: z.string().min(10, 'Add a short excerpt.'),
  bodyMdx: z.string().min(1, 'Body is required.'),
  category: z.string().min(1, 'Pick a category.'),
  tags: z.string().optional(),
  coverImageUrl: z.string().url('Enter a valid URL.').optional().or(z.literal('')),
  status: z.enum(['draft', 'published']),
});

async function firestore() {
  const { adminDb } = await import('@/lib/firebase/admin');
  const { FieldValue } = await import('firebase-admin/firestore');
  return { adminDb, FieldValue };
}

export async function savePost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  const user = await getSessionUser();
  if (!user || !isEditor(user)) {
    return { ok: false, message: 'You are not authorized to do that.' };
  }
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return { ok: false, message: 'Firebase is not configured yet, so posts cannot be saved.' };
  }

  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: 'Please correct the highlighted fields.', fieldErrors };
  }

  const { id, title, slug, excerpt, bodyMdx, category, tags, coverImageUrl, status } = parsed.data;

  try {
    const { adminDb, FieldValue } = await firestore();
    const doc: Record<string, unknown> = {
      title,
      slug,
      excerpt,
      bodyMdx,
      categories: [category],
      tags: tags ? tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
      status,
      authorName: user.email ?? 'Travis Payne Productions',
      authorUid: user.uid,
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (coverImageUrl) doc.coverImageUrl = coverImageUrl;
    if (status === 'published') doc.publishedAt = FieldValue.serverTimestamp();

    let postId = id;
    if (id) {
      await adminDb.collection('blogPosts').doc(id).set(doc, { merge: true });
    } else {
      const ref = await adminDb
        .collection('blogPosts')
        .add({ ...doc, createdAt: FieldValue.serverTimestamp() });
      postId = ref.id;
    }

    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    return {
      ok: true,
      message: status === 'published' ? 'Published.' : 'Saved as draft.',
      postId,
    };
  } catch (error) {
    console.error('[savePost] failed', error);
    return { ok: false, message: 'Save failed. Please try again.' };
  }
}

export async function deletePost(id: string): Promise<void> {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') return;
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return;
  try {
    const { adminDb } = await import('@/lib/firebase/admin');
    await adminDb.collection('blogPosts').doc(id).delete();
    revalidatePath('/blog');
  } catch (error) {
    console.error('[deletePost] failed', error);
  }
}
