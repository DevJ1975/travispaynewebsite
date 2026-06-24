'use client';

import { useActionState } from 'react';
import { submitBooking, type FormState } from '@/lib/actions/forms';
import { errorClass, fieldClass, labelClass } from './styles';

const initialState: FormState = { ok: false, message: '' };

const PROJECT_TYPES = ['Concert / Tour', 'Film / TV', 'Live Event', 'Brand', 'Other'];
const BUDGETS = ['Under $50k', '$50k–$150k', '$150k–$500k', '$500k+', 'Not sure yet'];

export function BookingForm() {
  const [state, action, pending] = useActionState(submitBooking, initialState);

  if (state.ok) {
    return (
      <p role="status" aria-live="polite" className="rounded-tp-md border border-tp-gold/40 bg-tp-surface p-6 text-tp-white">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-name" className={labelClass}>
            Full name
          </label>
          <input id="booking-name" name="name" type="text" required className={fieldClass} />
          {state.fieldErrors?.name && <p className={errorClass}>{state.fieldErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="booking-email" className={labelClass}>
            Email address
          </label>
          <input id="booking-email" name="email" type="email" required className={fieldClass} />
          {state.fieldErrors?.email && <p className={errorClass}>{state.fieldErrors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="booking-org" className={labelClass}>
          Company / Organization
        </label>
        <input id="booking-org" name="organization" type="text" className={fieldClass} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-type" className={labelClass}>
            Project type
          </label>
          <select id="booking-type" name="projectType" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select…
            </option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {state.fieldErrors?.projectType && (
            <p className={errorClass}>{state.fieldErrors.projectType}</p>
          )}
        </div>
        <div>
          <label htmlFor="booking-budget" className={labelClass}>
            Budget range
          </label>
          <select id="booking-budget" name="budget" defaultValue="" className={fieldClass}>
            <option value="">Select…</option>
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="booking-timeline" className={labelClass}>
          Estimated date / timeline
        </label>
        <input id="booking-timeline" name="timeline" type="text" className={fieldClass} />
      </div>

      <div>
        <label htmlFor="booking-message" className={labelClass}>
          Project description
        </label>
        <textarea id="booking-message" name="message" rows={5} required className={fieldClass} />
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
        {pending ? 'Sending…' : 'Submit Inquiry'}
      </button>
    </form>
  );
}
