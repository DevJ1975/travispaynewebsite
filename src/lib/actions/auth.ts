'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Session-cookie auth (doc 02 §4.5, doc 05 §3.3). The client signs in with the
// Firebase client SDK, then posts its ID token here to mint an httpOnly session
// cookie that RSC / middleware can read.

const SESSION_COOKIE = '__session';
const EXPIRES_IN_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function createSessionCookie(idToken: string): Promise<{ ok: boolean; message?: string }> {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return { ok: false, message: 'Auth backend is not configured yet.' };
  }
  try {
    const { adminAuth } = await import('@/lib/firebase/admin');
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: EXPIRES_IN_MS });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: EXPIRES_IN_MS / 1000,
    });
    return { ok: true };
  } catch (error) {
    console.error('[createSessionCookie] failed', error);
    return { ok: false, message: 'Could not create a session.' };
  }
}

export async function signOutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/admin/login');
}
