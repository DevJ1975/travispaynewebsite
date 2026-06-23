'use client';

import { useActionState } from 'react';
import { subscribeNewsletter, type FormState } from '@/lib/actions/forms';

const initialState: FormState = { ok: false, message: '' };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, initialState);

  return (
    <div className="mt-4">
      {state.ok ? (
        <p role="status" aria-live="polite" className="text-sm text-tp-success">
          {state.message}
        </p>
      ) : (
        <form action={action} className="flex gap-2" aria-label="Newsletter signup">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="Email address"
            className="min-h-[44px] flex-1 rounded-tp-md border border-tp-border bg-tp-subtle px-3 text-sm text-tp-white placeholder:text-tp-muted focus:border-tp-gold"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-tp-md bg-tp-gold px-4 text-sm font-medium text-tp-black disabled:opacity-50"
          >
            {pending ? '…' : 'Join'}
          </button>
        </form>
      )}
      {!state.ok && state.message && (
        <p role="alert" className="mt-2 text-xs text-tp-error">
          {state.message}
        </p>
      )}
    </div>
  );
}
