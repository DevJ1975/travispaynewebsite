'use client';

import { useActionState } from 'react';
import { createPage, type NewPageState } from '@/lib/actions/pages';
import { errorClass, labelClass } from '@/components/forms/styles';

const initialState: NewPageState = {};
const inputClass =
  'min-h-[44px] rounded-tp-md border border-tp-border bg-tp-subtle px-3 text-sm text-tp-white placeholder:text-tp-muted focus:border-tp-gold';

export function NewPageForm() {
  const [state, action, pending] = useActionState(createPage, initialState);

  return (
    <form action={action} className="flex flex-wrap items-end gap-4">
      <div>
        <label htmlFor="np-title" className={labelClass}>
          Title
        </label>
        <input id="np-title" name="title" className={inputClass} />
      </div>
      <div>
        <label htmlFor="np-slug" className={labelClass}>
          Slug
        </label>
        <input id="np-slug" name="slug" placeholder="my-page" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black disabled:opacity-50"
      >
        {pending ? 'Creating…' : 'Create'}
      </button>
      {state.error && <p className={`${errorClass} w-full`}>{state.error}</p>}
    </form>
  );
}
