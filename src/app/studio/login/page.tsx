'use client';

import { type FormEvent, Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { isAllowed, signIn, signOutStudio } from '@/lib/builder/firestore';
import { useStudioAuthState } from '@/lib/builder/useStudioAuth';
import { fieldClass, labelClass } from '@/components/forms/styles';

function safeNext(raw: string | null): string {
  // Only allow internal paths (block open redirects like //evil.com).
  if (raw && raw.startsWith('/') && !raw.startsWith('//')) return raw;
  return '/studio';
}

function StudioLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get('next'));
  const { user, ready } = useStudioAuthState();

  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  // Already signed in as an editor → go straight to where you were headed.
  useEffect(() => {
    if (ready && user && isAllowed(user.email)) {
      router.replace(next);
    }
  }, [ready, user, next, router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    try {
      await signIn(email, password);
      if (!isAllowed(email)) {
        await signOutStudio();
        setError('This account is not an editor on this site.');
        setPending(false);
        return;
      }
      router.replace(next);
    } catch {
      setError('Sign-in failed. Check your email and password, or ask your developer to enable Email/Password sign-in in Firebase.');
      setPending(false);
    }
  }

  // Signed in, but not on the allowlist: offer a way out rather than a dead form.
  if (ready && user && !isAllowed(user.email)) {
    return (
      <div className="mx-auto max-w-narrow px-6 pb-32 pt-24">
        <p className="text-overline uppercase text-tp-gold">Studio</p>
        <h1 className="mt-2 font-display text-display-md font-light text-tp-white">Not an editor</h1>
        <p className="mt-4 text-sm text-tp-muted">
          You&rsquo;re signed in as <span className="text-tp-white">{user.email}</span>, but that
          account isn&rsquo;t allowed to edit this site. Sign out and use an editor account.
        </p>
        <button
          type="button"
          onClick={() => void signOutStudio()}
          className="mt-6 inline-flex h-11 items-center rounded-tp-md border border-tp-border px-6 font-medium text-tp-white"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-narrow px-6 pb-32 pt-24">
      <p className="text-overline uppercase text-tp-gold">Studio</p>
      <h1 className="mt-2 font-display text-display-md font-light text-tp-white">Sign in to edit</h1>
      <p className="mt-3 max-w-prose text-sm text-tp-muted">
        Use the editor email and password set up for you in Firebase. Signing in lets you open the
        page builder, save to the cloud, and publish.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="username" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={fieldClass}
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-tp-error">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black disabled:opacity-50"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-8 text-xs text-tp-muted">
        Don&rsquo;t have an account yet? Your developer creates editor logins in Firebase — see{' '}
        <Link href="/studio" className="text-tp-gold hover:underline">
          Studio
        </Link>{' '}
        and <code>docs/09-firebase-deploy.md</code>.
      </p>
    </div>
  );
}

export default function StudioLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-tp-black">
          <p className="text-sm text-tp-muted">Loading…</p>
        </div>
      }
    >
      <StudioLoginForm />
    </Suspense>
  );
}
