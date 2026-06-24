'use client';

import { useActionState } from 'react';
import { submitContact, type FormState } from '@/lib/actions/forms';
import { errorClass, fieldClass, labelClass } from './styles';

const initialState: FormState = { ok: false, message: '' };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState);

  if (state.ok) {
    return (
      <p role="status" aria-live="polite" className="rounded-tp-md border border-tp-gold/40 bg-tp-surface p-6 text-tp-white">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Full name
        </label>
        <input id="contact-name" name="name" type="text" required className={fieldClass} />
        {state.fieldErrors?.name && <p className={errorClass}>{state.fieldErrors.name}</p>}
      </div>
      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email address
        </label>
        <input id="contact-email" name="email" type="email" required className={fieldClass} />
        {state.fieldErrors?.email && <p className={errorClass}>{state.fieldErrors.email}</p>}
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea id="contact-message" name="message" rows={5} required className={fieldClass} />
        {state.fieldErrors?.message && <p className={errorClass}>{state.fieldErrors.message}</p>}
      </div>

      {state.message && (
        <p role="alert" className="text-sm text-tp-error">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black transition-colors hover:bg-tp-gold-dk disabled:opacity-50"
      >
        {pending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
