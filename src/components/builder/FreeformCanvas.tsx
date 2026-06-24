'use client';

import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { useBuilder } from '@/lib/builder/store';
import { DEVICE_WIDTH, type Geometry } from '@/lib/builder/types';
import { ElementView } from './ElementView';

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const;
type Dir = (typeof HANDLES)[number];

function handleStyle(dir: Dir): CSSProperties {
  const base: CSSProperties = {
    position: 'absolute',
    width: 10,
    height: 10,
    background: '#fff',
    border: '1px solid #2563eb',
    borderRadius: 2,
    zIndex: 1000,
  };
  const mid = 'calc(50% - 5px)';
  const pos: Record<Dir, CSSProperties> = {
    nw: { left: -5, top: -5, cursor: 'nwse-resize' },
    n: { left: mid, top: -5, cursor: 'ns-resize' },
    ne: { right: -5, top: -5, cursor: 'nesw-resize' },
    e: { right: -5, top: mid, cursor: 'ew-resize' },
    se: { right: -5, bottom: -5, cursor: 'nwse-resize' },
    s: { left: mid, bottom: -5, cursor: 'ns-resize' },
    sw: { left: -5, bottom: -5, cursor: 'nesw-resize' },
    w: { left: -5, top: mid, cursor: 'ew-resize' },
  };
  return { ...base, ...pos[dir] };
}

export function FreeformCanvas() {
  const page = useBuilder((s) => s.page);
  const device = useBuilder((s) => s.device);
  const selectedId = useBuilder((s) => s.selectedId);
  const preview = useBuilder((s) => s.preview);
  const select = useBuilder((s) => s.select);
  const updateGeo = useBuilder((s) => s.updateGeo);

  const width = DEVICE_WIDTH[device];
  const minHeight = page.canvasHeight[device];

  function startDrag(e: ReactPointerEvent, id: string, g: Geometry) {
    if (preview) return;
    e.stopPropagation();
    select(id);
    const sx = e.clientX;
    const sy = e.clientY;
    const move = (ev: PointerEvent) =>
      updateGeo(id, { x: Math.round(g.x + ev.clientX - sx), y: Math.round(g.y + ev.clientY - sy) });
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  function startResize(e: ReactPointerEvent, id: string, g: Geometry, dir: Dir) {
    e.stopPropagation();
    const sx = e.clientX;
    const sy = e.clientY;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      let { x, y, w, h } = g;
      if (dir.includes('e')) w = g.w + dx;
      if (dir.includes('s')) h = g.h + dy;
      if (dir.includes('w')) {
        w = g.w - dx;
        x = g.x + dx;
      }
      if (dir.includes('n')) {
        h = g.h - dy;
        y = g.y + dy;
      }
      if (w < 20) {
        if (dir.includes('w')) x = g.x + g.w - 20;
        w = 20;
      }
      if (h < 20) {
        if (dir.includes('n')) y = g.y + g.h - 20;
        h = 20;
      }
      updateGeo(id, { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  return (
    <div
      className="flex-1 overflow-auto bg-neutral-200 p-8"
      onPointerDown={() => {
        if (!preview) select(null);
      }}
    >
      <div
        className="relative mx-auto bg-white shadow-xl"
        style={{
          width,
          minHeight,
          backgroundImage: preview
            ? undefined
            : 'linear-gradient(#00000008 1px, transparent 1px), linear-gradient(90deg, #00000008 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {page.elements.map((el, index) => {
          const g = el.geo[device];
          if (g.hidden && preview) return null;
          const selected = !preview && el.id === selectedId;
          return (
            <div
              key={el.id}
              onPointerDown={(e) => startDrag(e, el.id, g)}
              style={{
                position: 'absolute',
                left: g.x,
                top: g.y,
                width: g.w,
                height: g.h,
                transform: `rotate(${g.rotation}deg)`,
                opacity: g.hidden ? 0.35 : el.style.opacity ?? 1,
                zIndex: index,
                cursor: preview ? 'default' : 'move',
                outline: selected ? '2px solid #2563eb' : 'none',
                outlineOffset: 0,
              }}
            >
              <ElementView element={el} live={preview} />
              {selected &&
                HANDLES.map((dir) => (
                  <span
                    key={dir}
                    onPointerDown={(e) => startResize(e, el.id, g, dir)}
                    style={handleStyle(dir)}
                  />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
