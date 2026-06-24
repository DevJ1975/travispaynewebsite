import { create } from 'zustand';
import { temporal } from 'zundo';
import {
  type BuilderElement,
  type Device,
  type ElementType,
  type ElementProps,
  type ElementStyle,
  type Geometry,
  type GeometryByDevice,
  type SitePage,
} from './types';

// ── ids ──────────────────────────────────────────────────────────────────────
let counter = 0;
function nid(prefix = 'el'): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}

// ── element factory ──────────────────────────────────────────────────────────
function geoAll(g: Partial<Geometry>): GeometryByDevice {
  const base: Geometry = { x: 80, y: 80, w: 240, h: 80, rotation: 0, hidden: false, ...g };
  return { desktop: { ...base }, tablet: { ...base }, mobile: { ...base } };
}

const TEMPLATES: Record<
  ElementType,
  { geo: Partial<Geometry>; style: ElementStyle; props: ElementProps }
> = {
  heading: {
    geo: { w: 460, h: 72 },
    style: { fontSize: 44, fontFamily: 'display', fontWeight: 300, color: '#0a0a0a' },
    props: { text: 'Your headline' },
  },
  text: {
    geo: { w: 340, h: 72 },
    style: { fontSize: 16, fontFamily: 'body', color: '#333333' },
    props: { text: 'Your paragraph text. Edit it in the right-hand panel.' },
  },
  button: {
    geo: { w: 180, h: 48 },
    style: {
      fontSize: 16,
      fontFamily: 'body',
      fontWeight: 500,
      color: '#0a0a0a',
      background: '#c8a96e',
      radius: 4,
      textAlign: 'center',
    },
    props: { text: 'Button', href: '#' },
  },
  image: { geo: { w: 340, h: 230 }, style: { radius: 8 }, props: { alt: '' } },
  box: { geo: { w: 320, h: 200 }, style: { background: '#111111', radius: 8 }, props: {} },
  divider: { geo: { w: 340, h: 2 }, style: { borderColor: '#c8a96e' }, props: {} },
};

export function createElement(type: ElementType): BuilderElement {
  const t = TEMPLATES[type];
  return { id: nid(type), type, geo: geoAll(t.geo), style: { ...t.style }, props: { ...t.props } };
}

export function newPage(): SitePage {
  return {
    id: nid('page'),
    title: 'Untitled page',
    slug: '',
    canvasHeight: { desktop: 900, tablet: 1100, mobile: 1500 },
    elements: [],
    updatedAt: Date.now(),
  };
}

// ── localStorage persistence (V1; Firestore wiring is the next increment) ──────
const KEY = 'tp-studio-pages';
export function loadAllPages(): SitePage[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? '[]') as SitePage[];
  } catch {
    return [];
  }
}
export function loadPage(id: string): SitePage | null {
  return loadAllPages().find((p) => p.id === id) ?? null;
}
export function persistPage(page: SitePage): void {
  if (typeof window === 'undefined') return;
  const all = loadAllPages().filter((p) => p.id !== page.id);
  all.push(page);
  window.localStorage.setItem(KEY, JSON.stringify(all));
}
export function deletePage(id: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(loadAllPages().filter((p) => p.id !== id)));
}

// ── store ────────────────────────────────────────────────────────────────────
interface BuilderState {
  page: SitePage;
  device: Device;
  selectedId: string | null;
  preview: boolean;
  setPage: (page: SitePage) => void;
  setTitle: (title: string) => void;
  setSlug: (slug: string) => void;
  setDevice: (device: Device) => void;
  select: (id: string | null) => void;
  togglePreview: () => void;
  addElement: (type: ElementType) => void;
  updateGeo: (id: string, partial: Partial<Geometry>) => void;
  updateStyle: (id: string, partial: ElementStyle) => void;
  updateProps: (id: string, partial: ElementProps) => void;
  remove: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
}

function mutateElement(
  page: SitePage,
  id: string,
  fn: (el: BuilderElement) => BuilderElement,
): SitePage {
  return {
    ...page,
    updatedAt: Date.now(),
    elements: page.elements.map((el) => (el.id === id ? fn(el) : el)),
  };
}

export const useBuilder = create<BuilderState>()(
  temporal(
    (set, get) => ({
      page: newPage(),
      device: 'desktop',
      selectedId: null,
      preview: false,

      setPage: (page) => set({ page, selectedId: null }),
      setTitle: (title) => set((s) => ({ page: { ...s.page, title, updatedAt: Date.now() } })),
      setSlug: (slug) =>
        set((s) => ({ page: { ...s.page, slug: slug.toLowerCase().trim(), updatedAt: Date.now() } })),
      setDevice: (device) => set({ device }),
      select: (selectedId) => set({ selectedId }),
      togglePreview: () => set((s) => ({ preview: !s.preview, selectedId: null })),

      addElement: (type) => {
        const el = createElement(type);
        set((s) => ({ page: { ...s.page, updatedAt: Date.now(), elements: [...s.page.elements, el] }, selectedId: el.id }));
      },

      updateGeo: (id, partial) => {
        const { device } = get();
        set((s) => ({
          page: mutateElement(s.page, id, (el) => ({
            ...el,
            geo: { ...el.geo, [device]: { ...el.geo[device], ...partial } },
          })),
        }));
      },

      updateStyle: (id, partial) =>
        set((s) => ({
          page: mutateElement(s.page, id, (el) => ({ ...el, style: { ...el.style, ...partial } })),
        })),

      updateProps: (id, partial) =>
        set((s) => ({
          page: mutateElement(s.page, id, (el) => ({ ...el, props: { ...el.props, ...partial } })),
        })),

      remove: (id) =>
        set((s) => ({
          page: { ...s.page, updatedAt: Date.now(), elements: s.page.elements.filter((el) => el.id !== id) },
          selectedId: s.selectedId === id ? null : s.selectedId,
        })),

      bringForward: (id) =>
        set((s) => {
          const els = [...s.page.elements];
          const i = els.findIndex((el) => el.id === id);
          if (i < 0 || i === els.length - 1) return {};
          [els[i], els[i + 1]] = [els[i + 1], els[i]];
          return { page: { ...s.page, updatedAt: Date.now(), elements: els } };
        }),

      sendBackward: (id) =>
        set((s) => {
          const els = [...s.page.elements];
          const i = els.findIndex((el) => el.id === id);
          if (i <= 0) return {};
          [els[i], els[i - 1]] = [els[i - 1], els[i]];
          return { page: { ...s.page, updatedAt: Date.now(), elements: els } };
        }),
    }),
    // Only page changes belong in undo history (not device/selection/preview).
    { partialize: (state) => ({ page: state.page }), limit: 100 },
  ),
);
