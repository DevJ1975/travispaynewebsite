'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deletePage, loadAllPages, newPage, persistPage } from '@/lib/builder/store';
import { signOutStudio } from '@/lib/builder/firestore';
import { useStudioAuth } from '@/lib/builder/useStudioAuth';
import { StudioAuthGate } from '@/components/builder/StudioAuthGate';
import type { SitePage } from '@/lib/builder/types';

function StudioListInner() {
  const router = useRouter();
  const user = useStudioAuth();
  const [pages, setPages] = useState<SitePage[]>([]);

  useEffect(() => {
    setPages(loadAllPages());
  }, []);

  function create() {
    const p = newPage();
    persistPage(p);
    router.push(`/studio/${p.id}/edit`);
  }

  function remove(id: string) {
    deletePage(id);
    setPages(loadAllPages());
  }

  return (
    <div className="mx-auto max-w-content px-6 pb-32 pt-40 md:px-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-overline uppercase text-tp-gold">Studio</p>
          <h1 className="mt-2 font-display text-display-md font-light text-tp-white">
            Freeform Page Builder
          </h1>
        </div>
        <button
          type="button"
          onClick={create}
          className="inline-flex h-11 items-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black"
        >
          New page
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-tp-muted">
        {user?.email && <span>Signed in as {user.email}</span>}
        <button type="button" onClick={() => void signOutStudio()} className="text-tp-gold hover:underline">
          Sign out
        </button>
      </div>

      <p className="mt-4 max-w-prose text-sm text-tp-muted">
        Drag elements anywhere, resize and layer them, and design each device separately. Your work
        autosaves to this browser and syncs to the cloud; use <strong>Publish</strong> in the editor
        to put a page live.
      </p>

      <div className="mt-10">
        {pages.length === 0 ? (
          <p className="text-tp-gray">No pages yet — click “New page” to start designing.</p>
        ) : (
          <ul className="divide-y divide-tp-border border-y border-tp-border">
            {pages.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-display text-xl text-tp-white">{p.title || 'Untitled page'}</p>
                  <p className="text-xs uppercase tracking-wider text-tp-muted">
                    {p.elements.length} element{p.elements.length === 1 ? '' : 's'} ·{' '}
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link href={`/studio/${p.id}/edit`} className="text-sm text-tp-gold hover:underline">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="text-sm text-tp-error hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function StudioListPage() {
  return (
    <StudioAuthGate>
      <StudioListInner />
    </StudioAuthGate>
  );
}
