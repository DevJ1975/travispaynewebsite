'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from 'zustand';
import { persistPage, useBuilder } from '@/lib/builder/store';
import { isAllowed, publishCloud, saveDraftCloud, signOutStudio } from '@/lib/builder/firestore';
import { useStudioAuth } from '@/lib/builder/useStudioAuth';
import { SignInModal } from './SignInModal';
import { DEVICES, DEVICE_LABEL, type ElementType, type SitePage } from '@/lib/builder/types';

const ADD: { type: ElementType; label: string }[] = [
  { type: 'heading', label: 'Heading' },
  { type: 'text', label: 'Text' },
  { type: 'button', label: 'Button' },
  { type: 'image', label: 'Image' },
  { type: 'box', label: 'Box' },
  { type: 'divider', label: 'Divider' },
];

export function Toolbar() {
  const page = useBuilder((s) => s.page);
  const device = useBuilder((s) => s.device);
  const preview = useBuilder((s) => s.preview);
  const setDevice = useBuilder((s) => s.setDevice);
  const setTitle = useBuilder((s) => s.setTitle);
  const setSlug = useBuilder((s) => s.setSlug);
  const addElement = useBuilder((s) => s.addElement);
  const togglePreview = useBuilder((s) => s.togglePreview);

  const canUndo = useStore(useBuilder.temporal, (s) => s.pastStates.length > 0);
  const canRedo = useStore(useBuilder.temporal, (s) => s.futureStates.length > 0);

  const user = useStudioAuth();
  const [addOpen, setAddOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [wantPublish, setWantPublish] = useState(false);
  const [msg, setMsg] = useState('');

  async function save() {
    const current = useBuilder.getState().page;
    persistPage(current);
    setMsg('Saved');
    if (user && isAllowed(user.email)) {
      try {
        await saveDraftCloud(current);
        setMsg('Saved to cloud');
      } catch {
        setMsg('Saved locally (cloud sync unavailable)');
      }
    }
    window.setTimeout(() => setMsg(''), 1800);
  }

  async function doPublish(current: SitePage) {
    setMsg('Publishing…');
    try {
      persistPage(current);
      await publishCloud(current);
      setMsg(`Published → /${current.slug}`);
    } catch {
      setMsg('Publish failed — enable Firestore in the console, then retry.');
    }
    window.setTimeout(() => setMsg(''), 4000);
  }

  function publish() {
    const current = useBuilder.getState().page;
    if (!current.slug || !/^[a-z0-9-]+$/.test(current.slug)) {
      setMsg('Set a URL slug (lowercase letters, numbers, hyphens) to publish.');
      window.setTimeout(() => setMsg(''), 3000);
      return;
    }
    if (!user || !isAllowed(user.email)) {
      setWantPublish(true);
      setSignInOpen(true);
      return;
    }
    void doPublish(current);
  }

  return (
    <header className="flex flex-wrap items-center gap-2 border-b border-neutral-200 bg-white px-4 py-2">
      <Link href="/studio" className="text-sm font-semibold text-neutral-700 hover:text-neutral-900">
        ← Studio
      </Link>
      <input
        value={page.title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-40 rounded border border-transparent px-2 py-1 text-sm text-neutral-800 hover:border-neutral-300 focus:border-neutral-300"
        aria-label="Page title"
      />
      <div className="flex items-center text-xs text-neutral-400">
        /
        <input
          value={page.slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="url-slug"
          className="w-28 rounded border border-neutral-200 px-2 py-1 text-neutral-700"
          aria-label="URL slug"
        />
      </div>

      <div className="ml-1 flex rounded-md border border-neutral-300 p-0.5">
        {DEVICES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDevice(d)}
            className={`rounded px-2 py-1 text-xs ${device === d ? 'bg-neutral-800 text-white' : 'text-neutral-600'}`}
          >
            {DEVICE_LABEL[d]}
          </button>
        ))}
      </div>

      <div className="flex gap-1">
        <button
          type="button"
          disabled={!canUndo}
          onClick={() => useBuilder.temporal.getState().undo()}
          className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-700 disabled:opacity-40"
        >
          Undo
        </button>
        <button
          type="button"
          disabled={!canRedo}
          onClick={() => useBuilder.temporal.getState().redo()}
          className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-700 disabled:opacity-40"
        >
          Redo
        </button>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setAddOpen((o) => !o)}
          className="rounded bg-neutral-800 px-3 py-1 text-xs font-medium text-white"
        >
          + Add
        </button>
        {addOpen && (
          <div className="absolute left-0 top-9 z-50 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-xl">
            {ADD.map((a) => (
              <button
                key={a.type}
                type="button"
                onClick={() => {
                  addElement(a.type);
                  setAddOpen(false);
                }}
                className="block w-full px-3 py-1.5 text-left text-sm text-neutral-700 hover:bg-neutral-100"
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {msg && <span className="text-xs text-neutral-500">{msg}</span>}
        {user ? (
          <button
            type="button"
            onClick={() => void signOutStudio()}
            className="text-xs text-neutral-500 hover:text-neutral-800"
            title={user.email ?? undefined}
          >
            Sign out
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSignInOpen(true)}
            className="text-xs text-neutral-500 hover:text-neutral-800"
          >
            Sign in
          </button>
        )}
        <button
          type="button"
          onClick={togglePreview}
          className="rounded border border-neutral-300 px-3 py-1 text-xs text-neutral-700"
        >
          {preview ? 'Exit preview' : 'Preview'}
        </button>
        <button
          type="button"
          onClick={() => void save()}
          className="rounded border border-neutral-300 px-3 py-1 text-xs text-neutral-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={publish}
          className="rounded bg-tp-gold px-3 py-1 text-xs font-semibold text-tp-black"
        >
          Publish
        </button>
      </div>

      {signInOpen && (
        <SignInModal
          onClose={() => {
            setSignInOpen(false);
            setWantPublish(false);
          }}
          onSuccess={() => {
            setSignInOpen(false);
            if (wantPublish) {
              setWantPublish(false);
              void doPublish(useBuilder.getState().page);
            }
          }}
        />
      )}
    </header>
  );
}
