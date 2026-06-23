'use server';

import { z } from 'zod';
import { verifyRecaptcha } from '@/lib/recaptcha';

// Server Actions for the marketing forms (doc 05 §3.3). Each validates with zod,
// verifies reCAPTCHA, then writes to Firestore via firebase-admin + queues a
// `mail/{id}` doc for the Trigger Email extension (doc 05 C3). When Firebase is
// not configured (local dev), submissions are logged so the UX still works.

export type FormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Please add a little more detail.'),
  token: z.string().optional(),
});

const bookingSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  organization: z.string().optional(),
  projectType: z.string().min(1, 'Please select a project type.'),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, 'Please describe your project.'),
  token: z.string().optional(),
});

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  token: z.string().optional(),
});

const NOTIFY = process.env.NOTIFICATION_EMAIL ?? 'travis@travispayne.com';

function firebaseConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
}

function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

async function firestore() {
  const { adminDb } = await import('@/lib/firebase/admin');
  const { FieldValue } = await import('firebase-admin/firestore');
  return { adminDb, FieldValue };
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: 'Please correct the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };
  }
  const { token, ...data } = parsed.data;
  if (!(await verifyRecaptcha(token))) {
    return { ok: false, message: 'Verification failed. Please try again.' };
  }

  try {
    if (firebaseConfigured()) {
      const { adminDb, FieldValue } = await firestore();
      await adminDb.collection('bookings').add({
        ...data,
        source: 'contact',
        status: 'new',
        createdAt: FieldValue.serverTimestamp(),
      });
      await adminDb.collection('mail').add({
        to: NOTIFY,
        message: { subject: `New contact message from ${data.name}`, text: `${data.email}\n\n${data.message}` },
      });
    } else {
      console.info('[submitContact] Firebase not configured — logging only:', data.email);
    }
  } catch (error) {
    console.error('[submitContact] failed', error);
    return { ok: false, message: `Something went wrong. Please email us directly at ${NOTIFY}.` };
  }

  return { ok: true, message: 'Thank you — your message has been received. We respond within 2 business days.' };
}

export async function submitBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: 'Please correct the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };
  }
  const { token, ...data } = parsed.data;
  if (!(await verifyRecaptcha(token))) {
    return { ok: false, message: 'Verification failed. Please try again.' };
  }

  try {
    if (firebaseConfigured()) {
      const { adminDb, FieldValue } = await firestore();
      await adminDb.collection('bookings').add({
        ...data,
        source: 'booking',
        status: 'new',
        createdAt: FieldValue.serverTimestamp(),
      });
      await adminDb.collection('mail').add({
        to: NOTIFY,
        message: {
          subject: `New booking inquiry from ${data.name}`,
          text: `${data.email}\nOrganization: ${data.organization ?? '—'}\nProject: ${data.projectType}\nTimeline: ${data.timeline ?? '—'}\nBudget: ${data.budget ?? '—'}\n\n${data.message}`,
        },
      });
    } else {
      console.info('[submitBooking] Firebase not configured — logging only:', data.email);
    }
  } catch (error) {
    console.error('[submitBooking] failed', error);
    return { ok: false, message: `Something went wrong. Please email us directly at ${NOTIFY}.` };
  }

  return { ok: true, message: 'Thank you — your inquiry has been received. We respond within 2 business days.' };
}

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: 'Please enter a valid email address.', fieldErrors: toFieldErrors(parsed.error) };
  }
  const { token, email } = parsed.data;
  if (!(await verifyRecaptcha(token))) {
    return { ok: false, message: 'Verification failed. Please try again.' };
  }

  try {
    if (firebaseConfigured()) {
      const { adminDb, FieldValue } = await firestore();
      const id = email.toLowerCase();
      await adminDb
        .collection('newsletterSubscribers')
        .doc(id)
        .set({ email: id, status: 'subscribed', createdAt: FieldValue.serverTimestamp() }, { merge: true });
    } else {
      console.info('[subscribeNewsletter] Firebase not configured — logging only:', email);
    }
  } catch (error) {
    console.error('[subscribeNewsletter] failed', error);
    return { ok: false, message: 'Something went wrong. Please try again.' };
  }

  return { ok: true, message: 'You are on the list. Welcome.' };
}
