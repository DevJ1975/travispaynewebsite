'use client';

import { type ChangeEvent, type DragEvent, useCallback, useEffect, useRef, useState } from 'react';
import { deleteImage, listImages, type MediaItem, uploadImage } from '@/lib/builder/media';
import { useStudioAuth } from '@/lib/builder/useStudioAuth';
import { SignInModal } from './SignInModal';

/**
 * Cloud Storage media library modal. Upload an image (or pick a previous upload) for an
 * image element; returns the public URL via `onSelect`. Requires sign-in to upload/manage;
 * degrades with a clear message when Storage isn't enabled yet.
 */
export function MediaPicker({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const user = useStudioAuth();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      setItems(await listImages());
    } catch {
      setError('Could not load your media. Make sure Cloud Storage is enabled in Firebase.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      await refresh();
      onSelect(url);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed. Check Storage is enabled and you are signed in.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    void handleFiles(e.target.files);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    void handleFiles(e.dataTransfer.files);
  }

  async function handleDelete(item: MediaItem) {
    setError('');
    try {
      await deleteImage(item.path);
      setItems((prev) => prev.filter((i) => i.path !== item.path));
    } catch {
      setError('Could not delete that image.');
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
          <h2 className="text-base font-semibold text-neutral-800">Media library</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100"
            aria-label="Close media library"
          >
            ✕
          </button>
        </div>

        {!user ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-neutral-600">Sign in to upload and manage images.</p>
            <button
              type="button"
              onClick={() => setShowSignIn(true)}
              className="mt-4 rounded bg-neutral-800 px-4 py-2 text-sm font-medium text-white"
            >
              Sign in
            </button>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="px-5 pt-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-neutral-300'
                }`}
              >
                <p className="text-sm text-neutral-600">
                  {uploading ? 'Uploading…' : 'Drag an image here, or'}
                </p>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => inputRef.current?.click()}
                  className="mt-2 rounded border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 disabled:opacity-50"
                >
                  Choose a file
                </button>
                <p className="mt-2 text-xs text-neutral-400">Images up to 10 MB</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={onInputChange}
                  className="hidden"
                />
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>

            <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
              {loading ? (
                <p className="text-sm text-neutral-500">Loading…</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-neutral-500">No uploads yet — add your first image above.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {items.map((item) => (
                    <div key={item.path} className="group relative overflow-hidden rounded border border-neutral-200">
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(item.url);
                          onClose();
                        }}
                        className="block aspect-square w-full"
                        title={item.name}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="absolute right-1 top-1 hidden rounded bg-black/60 px-1.5 py-0.5 text-xs text-white group-hover:block"
                        aria-label={`Delete ${item.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showSignIn && (
        <SignInModal onClose={() => setShowSignIn(false)} onSuccess={() => setShowSignIn(false)} />
      )}
    </div>
  );
}
