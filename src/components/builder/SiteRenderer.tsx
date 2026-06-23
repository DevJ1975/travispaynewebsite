import { DEVICE_WIDTH, type Device, type Geometry, type SitePage } from '@/lib/builder/types';
import { ElementView } from './ElementView';

// Renders a published freeform page with per-device geometry via a generated stylesheet
// (inline styles can't express media queries). Mobile is the base; tablet/desktop are
// min-width overrides — so each device shows exactly the layout the owner designed.
const ORDER: Device[] = ['mobile', 'tablet', 'desktop'];
const MIN_WIDTH: Record<Device, number> = { mobile: 0, tablet: 768, desktop: 1200 };

function geoRule(g: Geometry, z: number, opacity: number): string {
  if (g.hidden) return 'display:none;';
  return `display:block;left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;transform:rotate(${g.rotation}deg);opacity:${opacity};z-index:${z};`;
}

function buildCss(page: SitePage, cls: string): string {
  return ORDER.map((device) => {
    const container = `.${cls}{position:relative;margin:0 auto;width:${DEVICE_WIDTH[device]}px;min-height:${page.canvasHeight[device]}px;}`;
    const els = page.elements
      .map(
        (el, i) =>
          `.${cls}>.${cls}-${el.id}{position:absolute;${geoRule(el.geo[device], i, el.style.opacity ?? 1)}}`,
      )
      .join('');
    return device === 'mobile'
      ? container + els
      : `@media(min-width:${MIN_WIDTH[device]}px){${container}${els}}`;
  }).join('');
}

export function SiteRenderer({ page }: { page: SitePage }) {
  const cls = `pg-${page.id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <div style={{ width: '100%', overflowX: 'hidden', background: '#ffffff' }}>
      <style dangerouslySetInnerHTML={{ __html: buildCss(page, cls) }} />
      <div className={cls}>
        {page.elements.map((el) => (
          <div key={el.id} className={`${cls}-${el.id}`}>
            <ElementView element={el} live />
          </div>
        ))}
      </div>
    </div>
  );
}
