'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

type StudioAuthState = { user: User | null; ready: boolean };

/**
 * Subscribes to the Firebase client auth state for the Studio editor. `ready` flips true once
 * Firebase has resolved the persisted session, so callers can avoid redirecting a returning
 * (still-loading) user to the login page on reload.
 */
export function useStudioAuthState(): StudioAuthState {
  const [state, setState] = useState<StudioAuthState>({ user: null, ready: false });
  useEffect(() => onAuthStateChanged(auth, (user) => setState({ user, ready: true })), []);
  return state;
}

/** Convenience hook for callers that only need the user (Toolbar, MediaPicker, edit page). */
export function useStudioAuth(): User | null {
  return useStudioAuthState().user;
}
