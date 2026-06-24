import type { CSSProperties } from 'react';
import { fontCss, type BuilderElement } from '@/lib/builder/types';

// Renders an element's inner content (the positioning wrapper is supplied by the
// canvas/renderer). Shared by the editor canvas and the public page renderer.
export function ElementView({ element, live = false }: { element: BuilderElement; live?: boolean }) {
  const { type, style, props } = element;

  const text: CSSProperties = {
    color: style.color,
    fontFamily: fontCss(style.fontFamily),
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    textAlign: style.textAlign,
    padding: style.padding,
    lineHeight: 1.25,
    margin: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  };

  switch (type) {
    case 'heading':
      return <h2 style={text}>{props.text}</h2>;
    case 'text':
      return <p style={{ ...text, lineHeight: 1.6 }}>{props.text}</p>;
    case 'button': {
      const btn: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: style.background,
        color: style.color,
        fontFamily: fontCss(style.fontFamily),
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        borderRadius: style.radius,
      };
      return live && props.href ? (
        <a href={props.href} style={btn}>
          {props.text}
        </a>
      ) : (
        <span style={btn}>{props.text}</span>
      );
    }
    case 'image':
      return props.src ? (
        // eslint-disable-next-line @next/next/no-img-element -- editor supplies arbitrary URLs
        <img
          src={props.src}
          alt={props.alt ?? ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: style.radius }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: style.radius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'repeating-conic-gradient(#e5e5e5 0% 25%, #f5f5f5 0% 50%) 50% / 24px 24px',
            color: '#888',
            fontSize: 13,
          }}
        >
          Image
        </div>
      );
    case 'box':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: style.background,
            borderRadius: style.radius,
            border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor}` : undefined,
          }}
        />
      );
    case 'divider':
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '100%', borderTop: `2px solid ${style.borderColor ?? '#c8a96e'}` }} />
        </div>
      );
    default:
      return null;
  }
}
