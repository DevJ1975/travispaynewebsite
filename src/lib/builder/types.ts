// Data model for the freeform (Wix-style) page builder. Geometry is stored per device
// so desktop/tablet/mobile can be positioned independently ("edit each device separately").

export type Device = 'desktop' | 'tablet' | 'mobile';
export const DEVICES: Device[] = ['desktop', 'tablet', 'mobile'];
export const DEVICE_WIDTH: Record<Device, number> = { desktop: 1200, tablet: 768, mobile: 390 };
export const DEVICE_LABEL: Record<Device, string> = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

export type ElementType = 'heading' | 'text' | 'button' | 'image' | 'box' | 'divider';

export interface Geometry {
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  hidden: boolean;
}
export type GeometryByDevice = Record<Device, Geometry>;

export interface ElementStyle {
  color?: string;
  background?: string;
  fontSize?: number;
  fontFamily?: string; // 'display' | 'body' | 'mono' | 'sans' | 'serif'
  fontWeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  radius?: number;
  borderWidth?: number;
  borderColor?: string;
  opacity?: number;
  padding?: number;
}

export interface ElementProps {
  text?: string;
  href?: string;
  src?: string;
  alt?: string;
}

export interface BuilderElement {
  id: string;
  type: ElementType;
  geo: GeometryByDevice;
  style: ElementStyle;
  props: ElementProps;
}

export interface SitePage {
  id: string;
  title: string;
  slug: string;
  canvasHeight: Record<Device, number>;
  elements: BuilderElement[];
  updatedAt: number;
}

export const FONT_OPTIONS: { label: string; value: string; css: string }[] = [
  { label: 'Display (Cormorant)', value: 'display', css: 'var(--font-display), Georgia, serif' },
  { label: 'Body (DM Sans)', value: 'body', css: 'var(--font-body), system-ui, sans-serif' },
  { label: 'Mono (DM Mono)', value: 'mono', css: 'var(--font-mono), monospace' },
  { label: 'System Sans', value: 'sans', css: 'system-ui, sans-serif' },
  { label: 'Serif', value: 'serif', css: 'Georgia, serif' },
];

export function fontCss(value?: string): string {
  return FONT_OPTIONS.find((f) => f.value === value)?.css ?? FONT_OPTIONS[1].css;
}
