'use server';

import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/auth/session';
import { getEnrollment, getMasterclassById } from '@/lib/queries/masterclasses';
import type { Masterclass } from '@/lib/types/masterclass';
import { SITE } from '@/lib/site';

// Masterclass enrollment + gated Mux playback (doc 04 §Masterclasses, doc 05 C6).

function firebaseConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
}

async function userHasAccess(uid: string | undefined, cls: Masterclass): Promise<boolean> {
  if (!uid) return false;
  if (cls.price === 0) return true;
  if (!firebaseConfigured()) return false;
  const enrollment = await getEnrollment(uid, cls.id);
  return enrollment?.status === 'active';
}

// Signs a short-lived Mux playback JWT when signing keys are configured.
async function signMuxToken(playbackId: string): Promise<string | undefined> {
  const keyId = process.env.MUX_SIGNING_KEY_ID;
  const privateKeyBase64 = process.env.MUX_SIGNING_PRIVATE_KEY;
  if (!keyId || !privateKeyBase64) return undefined;
  try {
    const { SignJWT, importPKCS8 } = await import('jose');
    const pem = Buffer.from(privateKeyBase64, 'base64').toString('utf8');
    const key = await importPKCS8(pem, 'RS256');
    return await new SignJWT({})
      .setProtectedHeader({ alg: 'RS256', kid: keyId })
      .setSubject(playbackId)
      .setAudience('v')
      .setExpirationTime('1h')
      .sign(key);
  } catch (error) {
    console.error('[signMuxToken] failed', error);
    return undefined;
  }
}

export async function getMuxPlaybackToken(
  classId: string,
  lessonId: string,
): Promise<{ playbackId?: string; token?: string; error?: string }> {
  const cls = await getMasterclassById(classId);
  if (!cls) return { error: 'Class not found.' };

  const lesson = cls.lessons.find((item) => item.id === lessonId);
  if (!lesson?.muxPlaybackId) return { error: 'This lesson video is not available yet.' };

  const user = await getSessionUser();
  if (!(await userHasAccess(user?.uid, cls))) {
    return { error: 'You do not have access to this lesson.' };
  }

  const token = await signMuxToken(lesson.muxPlaybackId);
  return { playbackId: lesson.muxPlaybackId, token };
}

export async function enrollInMasterclass(
  classId: string,
): Promise<{ ok: boolean; message: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, message: 'Please sign in to enroll.' };

  const cls = await getMasterclassById(classId);
  if (!cls) return { ok: false, message: 'Class not found.' };
  if (cls.price > 0) return { ok: false, message: 'This class requires purchase.' };
  if (!firebaseConfigured()) {
    return { ok: false, message: 'Enrollment requires Firebase to be configured.' };
  }

  try {
    const { adminDb } = await import('@/lib/firebase/admin');
    const { FieldValue } = await import('firebase-admin/firestore');
    await adminDb
      .collection('enrollments')
      .doc(`${user.uid}_${classId}`)
      .set(
        { uid: user.uid, masterclassId: classId, status: 'active', enrolledAt: FieldValue.serverTimestamp() },
        { merge: true },
      );
    revalidatePath(`/masterclasses/${cls.slug}`);
    return { ok: true, message: 'Enrolled. Enjoy the class.' };
  } catch (error) {
    console.error('[enrollInMasterclass] failed', error);
    return { ok: false, message: 'Could not enroll. Please try again.' };
  }
}

export async function createMasterclassCheckout(
  classId: string,
): Promise<{ url?: string; error?: string }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: 'Checkout is not configured yet.' };
  }

  const cls = await getMasterclassById(classId);
  if (!cls || cls.price <= 0) return { error: 'This class is not available for purchase.' };

  const user = await getSessionUser();
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: cls.price,
            product_data: { name: `Masterclass: ${cls.title}` },
          },
        },
      ],
      metadata: { classId, uid: user?.uid ?? '' },
      success_url: `${SITE.url}/masterclasses/${cls.slug}?enrolled=1`,
      cancel_url: `${SITE.url}/masterclasses/${cls.slug}`,
    });
    return { url: session.url ?? undefined };
  } catch (error) {
    console.error('[createMasterclassCheckout] failed', error);
    return { error: 'Could not start checkout. Please try again.' };
  }
}
