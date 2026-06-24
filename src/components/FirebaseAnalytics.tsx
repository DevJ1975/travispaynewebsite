'use client';

import { useEffect } from 'react';
import { initFirebaseAnalytics } from '@/lib/firebase/client';

/** Initializes Firebase Analytics (GA4) on the client, when supported. */
export function FirebaseAnalytics() {
  useEffect(() => {
    void initFirebaseAnalytics();
  }, []);
  return null;
}
