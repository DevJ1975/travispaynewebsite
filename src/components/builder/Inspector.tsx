'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useBuilder } from '@/lib/builder/store';
import { FONT_OPTIONS } from '@/lib/builder/types';
import { MediaPicker } from './MediaPicker';

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex items-center justify-between py-1">
      <span className="text-xs text-neutral-600">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="h-7 w-7 rounded border border-neutral-300"
          style={{ background: value ?? 'transparent' }}
          aria-label={`${label} color`}
        />
        {open && (
          <div className="absolute right-0 top-9 z-50 rounded-lg border border-neutral-200 bg-white p-2 shadow-xl">
            <HexColorPicker color={value ?? '#000000'} onChange={onChange} />
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
              className="mt-2 w-full rounded border border-neutral-300 py-1 text-xs text-neutral-600"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value?: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <label className="flex items-center justify-between py-1 text-xs text-neutral-600">
      {label}
      <input
        type="number"
        step={step}
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 rounded border border-neutral-300 px-2 py-1 text-right text-neutral-800"
      />
    </label>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b border-neutral-200 px-4 py-3">
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">{title}</p>
    {children}
  </div>
);

export function Inspector() {
  const page = useBuilder((s) => s.page);
  const device = useBuilder((s) => s.device);
  const selectedId = useBuilder((s) => s.selectedId);
  const updateGeo = useBuilder((s) => s.updateGeo);
  const updateStyle = useBuilder((s) => s.updateStyle);
  const updateProps = useBuilder((s) => s.updateProps);
  const remove = useBuilder((s) => s.remove);
  const bringForward = useBuilder((s) => s.bringForward);
  const sendBackward = useBuilder((s) => s.sendBackward);

  const [mediaOpen, setMediaOpen] = useState(false);

  const el = page.elements.find((e) => e.id === selectedId);

  if (!el) {
    return (
      <aside className="w-72 shrink-0 overflow-auto border-l border-neutral-200 bg-white">
        <div className="p-6 text-sm text-neutral-500">
          Select an element to edit it, or add one from the toolbar.
        </div>
      </aside>
    );
  }

  const g = el.geo[device];
  const isText = el.type === 'heading' || el.type === 'text' || el.type === 'button';

  return (
    <aside className="w-72 shrink-0 overflow-auto border-l border-neutral-200 bg-white">
      <div className="px-4 py-3 text-sm font-semibold capitalize text-neutral-800">{el.type}</div>

      {(isText || el.type === 'image') && (
        <Section title="Content">
          {isText && (
            <textarea
              value={el.props.text ?? ''}
              onChange={(e) => updateProps(el.id, { text: e.target.value })}
              rows={3}
              className="w-full rounded border border-neutral-300 p-2 text-sm text-neutral-800"
            />
          )}
          {el.type === 'button' && (
            <input
              value={el.props.href ?? ''}
              onChange={(e) => updateProps(el.id, { href: e.target.value })}
              placeholder="Link URL"
              className="mt-2 w-full rounded border border-neutral-300 px-2 py-1 text-sm text-neutral-800"
            />
          )}
          {el.type === 'image' && (
            <>
              <button
                type="button"
                onClick={() => setMediaOpen(true)}
                className="mb-2 w-full rounded bg-neutral-800 px-2 py-1.5 text-sm font-medium text-white"
              >
                Upload / choose image
              </button>
              <input
                value={el.props.src ?? ''}
                onChange={(e) => updateProps(el.id, { src: e.target.value })}
                placeholder="…or paste an image URL"
                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm text-neutral-800"
              />
              <input
                value={el.props.alt ?? ''}
                onChange={(e) => updateProps(el.id, { alt: e.target.value })}
                placeholder="Alt text (for accessibility)"
                className="mt-2 w-full rounded border border-neutral-300 px-2 py-1 text-sm text-neutral-800"
              />
            </>
          )}
        </Section>
      )}

      {isText && (
        <Section title="Text">
          <ColorField label="Color" value={el.style.color} onChange={(v) => updateStyle(el.id, { color: v })} />
          <label className="flex items-center justify-between py-1 text-xs text-neutral-600">
            Font
            <select
              value={el.style.fontFamily ?? 'body'}
              onChange={(e) => updateStyle(el.id, { fontFamily: e.target.value })}
              className="w-36 rounded border border-neutral-300 px-1 py-1 text-neutral-800"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <NumberField label="Size" value={el.style.fontSize} onChange={(v) => updateStyle(el.id, { fontSize: v })} />
          <NumberField
            label="Weight"
            step={100}
            value={el.style.fontWeight}
            onChange={(v) => updateStyle(el.id, { fontWeight: v })}
          />
          <div className="flex items-center justify-between py-1 text-xs text-neutral-600">
            Align
            <div className="flex gap-1">
              {(['left', 'center', 'right'] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => updateStyle(el.id, { textAlign: a })}
                  className={`rounded border px-2 py-1 ${el.style.textAlign === a ? 'border-blue-500 text-blue-600' : 'border-neutral-300 text-neutral-600'}`}
                >
                  {a[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section title="Box">
        <ColorField
          label="Background"
          value={el.style.background}
          onChange={(v) => updateStyle(el.id, { background: v })}
        />
        <NumberField label="Corner radius" value={el.style.radius} onChange={(v) => updateStyle(el.id, { radius: v })} />
        <NumberField
          label="Opacity %"
          value={Math.round((el.style.opacity ?? 1) * 100)}
          onChange={(v) => updateStyle(el.id, { opacity: Math.max(0, Math.min(100, v)) / 100 })}
        />
      </Section>

      <Section title={`Position — ${device}`}>
        <NumberField label="X" value={g.x} onChange={(v) => updateGeo(el.id, { x: v })} />
        <NumberField label="Y" value={g.y} onChange={(v) => updateGeo(el.id, { y: v })} />
        <NumberField label="Width" value={g.w} onChange={(v) => updateGeo(el.id, { w: v })} />
        <NumberField label="Height" value={g.h} onChange={(v) => updateGeo(el.id, { h: v })} />
        <NumberField label="Rotation" value={g.rotation} onChange={(v) => updateGeo(el.id, { rotation: v })} />
        <label className="flex items-center justify-between py-1 text-xs text-neutral-600">
          Hidden on {device}
          <input
            type="checkbox"
            checked={g.hidden}
            onChange={(e) => updateGeo(el.id, { hidden: e.target.checked })}
          />
        </label>
      </Section>

      <Section title="Arrange">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => bringForward(el.id)}
            className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-700"
          >
            Bring forward
          </button>
          <button
            type="button"
            onClick={() => sendBackward(el.id)}
            className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-700"
          >
            Send backward
          </button>
          <button
            type="button"
            onClick={() => remove(el.id)}
            className="rounded border border-red-300 px-2 py-1 text-xs text-red-600"
          >
            Delete
          </button>
        </div>
      </Section>

      {mediaOpen && (
        <MediaPicker
          onClose={() => setMediaOpen(false)}
          onSelect={(url) => updateProps(el.id, { src: url })}
        />
      )}
    </aside>
  );
}
