'use client';

import { type FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSessionCookie } from '@/lib/actions/auth';
import { fieldClass, labelClass } from '@/components/forms/styles';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase/client');
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken(true);
      const result = await createSessionCookie(idToken);
      if (!result.ok) {
        setError(result.message ?? 'Sign-in failed.');
        setPending(false);
        return;
      }
      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-narrow px-6 pb-32 pt-16">
      <h1 className="font-display text-display-md font-light text-tp-white">Admin sign in</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input id="email" name="email" type="email" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input id="password" name="password" type="password" required className={fieldClass} />
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
      <p className="mt-6 text-xs text-tp-muted">
        Requires a Firebase project with an admin/editor user (see docs/04).
      </p>
    </div>
  );
}
