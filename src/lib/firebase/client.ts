import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Browser/client Firebase SDK singleton for project `travis-payne`. The web config is
// public (it ships to the browser by design); env vars override these baked-in defaults
// so the same build connects in every environment. Server data goes through firebase-admin.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyBpUbdxwuFiSAP65QAJhNPTI-a9-30iQM8',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'travis-payne.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'travis-payne',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'travis-payne.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '209328218644',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:209328218644:web:133d521787666fe7c6fd01',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-K2EJE6W7YY',
};

export const firebaseApp: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// GA4 — browser-only, lazy, and feature-detected so SSR/build stay clean.
export async function initFirebaseAnalytics() {
  if (typeof window === 'undefined') return null;
  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    if (await isSupported()) return getAnalytics(firebaseApp);
  } catch {
    // analytics is optional; ignore if unsupported/blocked
  }
  return null;
}
