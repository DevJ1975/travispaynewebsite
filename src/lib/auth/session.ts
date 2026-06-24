import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Reads the `__session` cookie (set on login) and verifies it with firebase-admin.
// Custom claims `admin` / `editor` drive role gating (doc 05 §2, C11).

export interface SessionUser {
  uid: string;
  email?: string;
  role: 'admin' | 'editor' | 'customer' | null;
}

function firebaseConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!firebaseConfigured()) return null;

  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;
  if (!session) return null;

  try {
    const { adminAuth } = await import('@/lib/firebase/admin');
    const decoded = await adminAuth.verifySessionCookie(session, true);
    const role: SessionUser['role'] = decoded.admin
      ? 'admin'
      : decoded.editor
        ? 'editor'
        : 'customer';
    return { uid: decoded.uid, email: decoded.email, role };
  } catch {
    return null;
  }
}

export function isEditor(user: SessionUser | null): boolean {
  return user?.role === 'admin' || user?.role === 'editor';
}

/** Gate for admin pages: redirects to the login screen unless editor/admin. */
export async function requireEditor(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || !isEditor(user)) {
    redirect('/admin/login');
  }
  return user;
}
