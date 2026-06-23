import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Server-only Firebase Admin singleton, used in RSC and Server Actions (doc 05 §2).
// On Firebase App Hosting / GCP the SDK uses Application Default Credentials; for
// other environments set FIREBASE_SERVICE_ACCOUNT_JSON.
function createAdminApp(): App {
  if (getApps().length) {
    return getApp();
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  return initializeApp({
    credential: serviceAccountJson ? cert(JSON.parse(serviceAccountJson)) : undefined,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const adminApp = createAdminApp();
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export const adminStorage = getStorage(adminApp);
