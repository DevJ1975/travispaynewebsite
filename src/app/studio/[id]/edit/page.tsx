'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { loadPage, newPage, persistPage, useBuilder } from '@/lib/builder/store';
import { getDraftCloud, isAllowed, saveDraftCloud } from '@/lib/builder/firestore';
import { useStudioAuth } from '@/lib/builder/useStudioAuth';
import { Toolbar } from '@/components/builder/Toolbar';
import { FreeformCanvas } from '@/components/builder/FreeformCanvas';
import { Inspector } from '@/components/builder/Inspector';

export default function StudioEditPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const user = useStudioAuth();

  const setPage = useBuilder((s) => s.setPage);
  const preview = useBuilder((s) => s.preview);
  const page = useBuilder((s) => s.page);
  const selectedId = useBuilder((s) => s.selectedId);
  const device = useBuilder((s) => s.device);
  const remove = useBuilder((s) => s.remove);
  const updateGeo = useBuilder((s) => s.updateGeo);

  // Load the page: prefer the cloud copy when signed in, else localStorage, else new.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      let loaded = loadPage(id);
      if (user && isAllowed(user.email)) {
        try {
          const cloud = await getDraftCloud(id);
          if (cloud) loaded = cloud;
        } catch {
          // cloud optional
        }
      }
      if (cancelled) return;
      if (loaded) setPage(loaded);
      else {
        const p = { ...newPage(), id };
        setPage(p);
        persistPage(p);
      }
      useBuilder.temporal.getState().clear();
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id, setPage, user]);

  // Debounced autosave to localStorage (+ cloud when signed in).
  useEffect(() => {
    const t = window.setTimeout(() => {
      persistPage(page);
      if (user && isAllowed(user.email)) {
        void saveDraftCloud(page).catch(() => {});
      }
    }, 700);
    return () => window.clearTimeout(t);
  }, [page, user]);

  // Keyboard: delete + arrow-nudge the selected element.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (preview || !selectedId) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        remove(selectedId);
        return;
      }
      const g = useBuilder.getState().page.elements.find((el) => el.id === selectedId)?.geo[device];
      if (!g) return;
      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updateGeo(selectedId, { x: g.x - step });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updateGeo(selectedId, { x: g.x + step });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        updateGeo(selectedId, { y: g.y - step });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        updateGeo(selectedId, { y: g.y + step });
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview, selectedId, device, remove, updateGeo]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-neutral-100">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <FreeformCanvas />
        {!preview && <Inspector />}
      </div>
    </div>
  );
}
