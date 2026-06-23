'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Puck, type Data } from '@measured/puck';
import '@measured/puck/puck.css';
import { puckConfig } from '@/lib/puck/puck.config';
import { publishPage, savePageDraft } from '@/lib/actions/pages';

export function PageEditor({
  pageId,
  slug,
  initialData,
}: {
  pageId: string;
  slug: string;
  initialData: Data;
}) {
  const router = useRouter();
  const [data, setData] = useState<Data>(initialData);
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  function saveDraft() {
    setMessage('');
    startTransition(async () => {
      const result = await savePageDraft(pageId, data);
      setMessage(result.message);
    });
  }

  function publish() {
    setMessage('');
    startTransition(async () => {
      const result = await publishPage(pageId, slug, data);
      setMessage(result.message);
      if (result.ok) router.refresh();
    });
  }

  return (
    <div className="h-[calc(100vh-7rem)]">
      <Puck
        config={puckConfig}
        data={initialData}
        onChange={setData}
        overrides={{
          headerActions: () => (
            <div className="flex items-center gap-3">
              {message && <span className="text-sm text-neutral-600">{message}</span>}
              <a
                href={`/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-neutral-700 underline"
              >
                View
              </a>
              <button
                type="button"
                onClick={saveDraft}
                disabled={pending}
                className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-50"
              >
                Save draft
              </button>
              <button
                type="button"
                onClick={publish}
                disabled={pending}
                className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
              >
                Publish
              </button>
            </div>
          ),
        }}
      />
    </div>
  );
}
