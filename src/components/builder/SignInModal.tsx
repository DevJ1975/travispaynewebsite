'use client';

import { type FormEvent, useState } from 'react';
import { isAllowed, signIn } from '@/lib/builder/firestore';

export function SignInModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError('');
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '');
    try {
      await signIn(email, String(form.get('password') ?? ''));
      if (!isAllowed(email)) {
        setError('This account is not on the editor allowlist.');
        setPending(false);
        return;
      }
      onSuccess();
    } catch {
      setError('Sign-in failed. Check your email/password, or enable Email/Password auth in Firebase.');
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-neutral-800">Sign in to publish</h2>
        <p className="mt-1 text-sm text-neutral-500">Use your Firebase editor account.</p>
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="mt-4 w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="mt-2 w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border border-neutral-300 px-3 py-2 text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-neutral-800 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}
