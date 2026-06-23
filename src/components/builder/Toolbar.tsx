'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from 'zustand';
import { persistPage, useBuilder } from '@/lib/builder/store';
import { DEVICES, DEVICE_LABEL, type ElementType } from '@/lib/builder/types';

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
  const addElement = useBuilder((s) => s.addElement);
  const togglePreview = useBuilder((s) => s.togglePreview);

  const canUndo = useStore(useBuilder.temporal, (s) => s.pastStates.length > 0);
  const canRedo = useStore(useBuilder.temporal, (s) => s.futureStates.length > 0);

  const [addOpen, setAddOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  function save() {
    persistPage(useBuilder.getState().page);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  return (
    <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-2">
      <Link href="/studio" className="text-sm font-semibold text-neutral-700 hover:text-neutral-900">
        ← Studio
      </Link>
      <input
        value={page.title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-48 rounded border border-transparent px-2 py-1 text-sm text-neutral-800 hover:border-neutral-300 focus:border-neutral-300"
      />

      {/* device switch */}
      <div className="ml-2 flex rounded-md border border-neutral-300 p-0.5">
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

      {/* undo / redo */}
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

      {/* add */}
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
        {saved && <span className="text-xs text-green-600">Saved</span>}
        <button
          type="button"
          onClick={togglePreview}
          className="rounded border border-neutral-300 px-3 py-1 text-xs text-neutral-700"
        >
          {preview ? 'Exit preview' : 'Preview'}
        </button>
        <button
          type="button"
          onClick={save}
          className="rounded bg-neutral-800 px-3 py-1 text-xs font-medium text-white"
        >
          Save
        </button>
      </div>
    </header>
  );
}
