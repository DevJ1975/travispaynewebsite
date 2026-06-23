import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

// Tailwind v3.4 (doc 05 §C9/D2). Color tokens resolve to the CSS custom properties
// declared in src/app/globals.css — the single source of truth for hex values.
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        // Canonical tp-* names (doc 03), sourced from CSS vars.
        'tp-black': 'var(--tp-black)',
        'tp-surface': 'var(--tp-surface)',
        'tp-elevated': 'var(--tp-elevated)',
        'tp-subtle': 'var(--tp-subtle)',
        'tp-gold': 'var(--tp-gold)',
        'tp-gold-lt': 'var(--tp-gold-lt)',
        'tp-gold-dk': 'var(--tp-gold-dk)',
        'tp-jade': 'var(--tp-jade)',
        'tp-jade-dk': 'var(--tp-jade-dk)',
        'tp-white': 'var(--tp-white)',
        'tp-gray': 'var(--tp-gray)',
        'tp-muted': 'var(--tp-muted)',
        'tp-border': 'var(--tp-border)',
        'tp-error': 'var(--tp-error)',
        'tp-success': 'var(--tp-success)',
        // Semantic aliases (so doc 02's intent also resolves).
        primary: 'var(--tp-gold)',
        surface: 'var(--tp-surface)',
        text: {
          primary: 'var(--tp-white)',
          secondary: 'var(--tp-gray)',
          inverse: 'var(--tp-black)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['5.625rem', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
        'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['3.375rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.625rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        overline: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],
      },
      maxWidth: {
        site: '1440px',
        content: '1200px',
        prose: '720px',
        narrow: '560px',
      },
      borderRadius: {
        'tp-sm': '2px',
        'tp-md': '4px',
        'tp-lg': '8px',
        'tp-xl': '16px',
        'tp-full': '9999px',
      },
      boxShadow: {
        'tp-sm': '0 1px 3px rgba(0,0,0,0.5)',
        'tp-md': '0 4px 16px rgba(0,0,0,0.6)',
        'tp-lg': '0 12px 40px rgba(0,0,0,0.7)',
        'glow-gold': '0 0 24px rgba(200,169,110,0.25)',
        'glow-jade': '0 0 16px rgba(45,212,191,0.3)',
      },
      zIndex: {
        below: '-1',
        base: '0',
        raised: '10',
        dropdown: '100',
        sticky: '200',
        overlay: '500',
        modal: '700',
        toast: '900',
        cursor: '1000',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [typography],
} satisfies Config;
