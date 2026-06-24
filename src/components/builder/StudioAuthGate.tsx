'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAllowed } from '@/lib/builder/firestore';
import { useStudioAuthState } from '@/lib/builder/useStudioAuth';

/**
 * Client-side access gate for the Studio editor. Renders its children only for a signed-in
 * editor on the allowlist; otherwise redirects to /studio/login (preserving where you were
 * headed via ?next). Studio uses Firebase client auth (no session cookie), so this guard lives
 * in the browser — cloud reads/writes and publishing stay enforced by Firestore/Storage rules.
 */
export function StudioAuthGate({ children }: { children: React.ReactNode }) {
  const { user, ready } = useStudioAuthState();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = Boolean(user && isAllowed(user.email));

  useEffect(() => {
    if (ready && !allowed) {
      router.replace(`/studio/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [ready, allowed, pathname, router]);

  if (!ready || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-tp-black">
        <p className="text-sm text-tp-muted">{ready ? 'Redirecting to sign in…' : 'Checking sign-in…'}</p>
      </div>
    );
  }

  return <>{children}</>;
}
