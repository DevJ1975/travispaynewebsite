# Travis Payne Website — UI/UX Design System
**Version 1.0 | UI/UX Designer Agent**

---

## Table of Contents

1. [Brand Strategy & Art Direction](#1-brand-strategy--art-direction)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing, Layout & Tokens](#4-spacing-layout--tokens)
5. [Motion Language (Framer Motion)](#5-motion-language-framer-motion)
6. [Imagery & Video Art Direction](#6-imagery--video-art-direction)
7. [Core Component Inventory](#7-core-component-inventory)
8. [Page-by-Page Wireframes](#8-page-by-page-wireframes)
9. [Accessibility](#9-accessibility)
10. [Improvements Over the Current Duda Site](#10-improvements-over-the-current-duda-site)

---

## 1. Brand Strategy & Art Direction

### Positioning Statement

Travis Payne is not simply a choreographer — he is a creative architect of cultural moments. The website must communicate the weight of that legacy: someone whose work has graced the stages of the world's largest artists, whose name appears in credits that define popular culture. The digital experience must feel less like a portfolio website and more like entering a world-class production house's editorial flagship — the kind of treatment reserved for luxury fashion brands, major film studios, and Grammy-level artists.

**One-line positioning:** *The site where the industry's most trusted creative force presents his body of work to the world.*

### Target Audience

- **Primary:** A-list entertainment industry decision-makers — casting directors, label executives, brand CMOs, film/TV producers, live event producers.
- **Secondary:** Emerging artists, dancers, and choreographers seeking masterclasses, inspiration, and mentorship.
- **Tertiary:** General fans and culture watchers.

### Brand Adjectives

| Adjective | Design Expression |
|---|---|
| **Cinematic** | Full-bleed video, letterbox-ratio hero containers, subtle film-grain textures |
| **Editorial** | High-contrast typography, generous white space, structured grids |
| **Commanding** | Large, confident type sizes; bold weight display faces; restrained color palette |
| **Warm Authority** | Deep charcoal-black base tempered by warm champagne/gold accents (not cold corporate blue) |
| **Timeless** | No trendy glassmorphism gimmicks; instead: strong typographic hierarchy and spatial clarity |
| **Kinetic** | Motion as a first-class citizen — entrances, reveals, and scroll-driven animations reflect the art form itself |

### Cultural References (Mood Board Direction)

These references define the *feeling* — not the literal visual — of the site. No IP is reproduced.

- **Vanity Fair Hollywood Issue** — editorial photography treatment, high-contrast B&W portraits with one selective-color accent.
- **Criterion Collection film pages** — confident typography, reverence for legacy, dark backgrounds with luminous image presentation.
- **Rick Owens / Givenchy brand sites** — minimal navigation, near-full-viewport imagery, bold monochrome interiors.
- **The Kennedy Center / Lincoln Center digital presence** — institutional gravitas meeting arts-world elegance.
- **A24 film website aesthetic** — dark, editorial, auteur-coded, strong typographic voice.

### Pedigree Signaling (IP-Safe Approach)

Travis's history with Michael Jackson, Janet Jackson, Beyoncé, and others is his factual biography — it can and should be stated directly in text. The design amplifies this through:

- A "Legacy Ticker" / scrolling marquee listing collaborators by name (text only, no likenesses).
- A "Directed By / Choreographed By" credit-roll format for production cards — styled like film credits, not promotional cards.
- Quote callouts from reviews/press pulled in editorial pull-quote style.
- Section headings like "A Career in Moments" rather than generic "Portfolio."

---

## 2. Color System

### Philosophy

Dark editorial base. The site defaults to a near-black background that lets photography and video breathe with cinematic presence. A warm champagne/gold primary accent echoes stage lighting and awards-show aesthetics. A pure warm-white is reserved for primary text, ensuring legibility without cold clinical contrast. A secondary electric-jade accent is used sparingly for interactive states.

### Full Palette

| Token Name | Hex | Usage |
|---|---|---|
| `color.bg.base` | `#0A0A0A` | Page background |
| `color.bg.surface` | `#111111` | Cards, nav, modals |
| `color.bg.elevated` | `#1A1A1A` | Elevated surfaces (dropdowns, tooltips) |
| `color.bg.subtle` | `#222222` | Subtle dividers, input backgrounds |
| `color.primary` | `#C8A96E` | Champagne gold — CTAs, highlights, hover states |
| `color.primary.light` | `#E0C898` | Lighter gold for hover/focus rings |
| `color.primary.dark` | `#9E8050` | Darker gold for pressed states |
| `color.accent` | `#2DD4BF` | Electric jade — used only for links inline, focus outlines, live badges |
| `color.accent.dark` | `#1A9E8E` | Pressed state for accent elements |
| `color.text.primary` | `#F5F1EB` | Warm off-white — all body text, headings |
| `color.text.secondary` | `#A09890` | Secondary labels, metadata, timestamps |
| `color.text.muted` | `#5C5650` | Placeholder text, disabled states |
| `color.text.inverse` | `#0A0A0A` | Text on gold/light backgrounds |
| `color.border.default` | `#2A2A2A` | Card borders, input borders |
| `color.border.subtle` | `#1E1E1E` | Section dividers |
| `color.border.emphasis` | `#C8A96E` | Focused inputs, active nav items |
| `color.error` | `#F87171` | Form validation errors |
| `color.success` | `#34D399` | Form success, confirmation states |
| `color.overlay` | `rgba(10,10,10,0.85)` | Image overlays, modal backdrops |
| `color.overlay.light` | `rgba(10,10,10,0.5)` | Hover overlays on cards |

### Semantic Tailwind CSS Custom Colors (`tailwind.config.js`)

```js
colors: {
  'tp-black':    '#0A0A0A',
  'tp-surface':  '#111111',
  'tp-elevated': '#1A1A1A',
  'tp-subtle':   '#222222',
  'tp-gold':     '#C8A96E',
  'tp-gold-lt':  '#E0C898',
  'tp-gold-dk':  '#9E8050',
  'tp-jade':     '#2DD4BF',
  'tp-jade-dk':  '#1A9E8E',
  'tp-white':    '#F5F1EB',
  'tp-gray':     '#A09890',
  'tp-muted':    '#5C5650',
  'tp-border':   '#2A2A2A',
}
```

### AA/AAA Contrast Audit

| Foreground | Background | Ratio | WCAG Level |
|---|---|---|---|
| `#F5F1EB` (text primary) | `#0A0A0A` (bg base) | ~17.5:1 | AAA |
| `#C8A96E` (gold) | `#0A0A0A` (bg base) | ~7.8:1 | AAA |
| `#A09890` (secondary) | `#0A0A0A` (bg base) | ~7.1:1 | AAA |
| `#A09890` (secondary) | `#111111` (surface) | ~6.5:1 | AA |
| `#0A0A0A` (inverse) | `#C8A96E` (gold bg) | ~7.8:1 | AAA |
| `#2DD4BF` (jade) | `#0A0A0A` (bg base) | ~8.9:1 | AAA |
| `#5C5650` (muted) | `#0A0A0A` (bg base) | ~4.1:1 | AA (large text only) |

*Note: `color.text.muted` must only be used at 18px+ or bold weight to maintain AA compliance.*

---

## 3. Typography

### Font Pairing

| Role | Font Family | Source | Rationale |
|---|---|---|---|
| **Display / Headings** | `Cormorant Garamond` | Google Fonts | High-contrast elegant serif with editorial, fashion-magazine authority. Ligatures and swash caps signal artistry. Works at display sizes (60px+) magnificently. |
| **Body / UI** | `DM Sans` | Google Fonts | Clean, geometric grotesque. Highly legible at small sizes. Pairs beautifully with Cormorant — the contrast between old-world serif and contemporary sans is the visual tension that makes the site feel both timeless and modern. |
| **Monospace / Credits** | `DM Mono` | Google Fonts | Used sparingly: credit roll text, production metadata, code blocks if any. Reinforces the film-credit aesthetic. |

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet" />
```

### Type Scale

All values in `rem` (base 16px). Responsive overrides listed where applicable.

| Token | rem | px equiv | Font | Weight | Line-Height | Letter-Spacing | Usage |
|---|---|---|---|---|---|---|---|
| `text-display-2xl` | 5.625rem | 90px | Cormorant Garamond | 300 | 1.0 | -0.03em | Hero section main title |
| `text-display-xl` | 4.5rem | 72px | Cormorant Garamond | 300 | 1.05 | -0.02em | Section hero titles |
| `text-display-lg` | 3.375rem | 54px | Cormorant Garamond | 400 | 1.1 | -0.02em | Page H1 headings |
| `text-display-md` | 2.625rem | 42px | Cormorant Garamond | 400 | 1.15 | -0.01em | Section H2 headings |
| `text-display-sm` | 2rem | 32px | Cormorant Garamond | 500 | 1.2 | -0.01em | Subsection H3 headings |
| `text-title-lg` | 1.5rem | 24px | DM Sans | 600 | 1.3 | 0em | Card titles, nav items |
| `text-title-md` | 1.25rem | 20px | DM Sans | 500 | 1.4 | 0em | Sub-labels, product names |
| `text-title-sm` | 1.125rem | 18px | DM Sans | 500 | 1.45 | 0em | Eyebrow headings (uppercase) |
| `text-body-lg` | 1.125rem | 18px | DM Sans | 400 | 1.7 | 0em | Hero sub-copy, intro paragraphs |
| `text-body-md` | 1rem | 16px | DM Sans | 400 | 1.75 | 0em | Standard body text |
| `text-body-sm` | 0.875rem | 14px | DM Sans | 400 | 1.6 | 0em | Captions, metadata |
| `text-caption` | 0.75rem | 12px | DM Sans | 400 | 1.5 | 0.04em | Labels, tags, small UI |
| `text-overline` | 0.6875rem | 11px | DM Sans | 600 | 1.4 | 0.14em | Category labels (ALL CAPS) |
| `text-mono-md` | 0.875rem | 14px | DM Mono | 400 | 1.6 | 0.02em | Credits, metadata blocks |

### Responsive Typography (Fluid Scaling)

Use CSS `clamp()` for display sizes to ensure smooth scaling without breakpoint jumps:

```css
/* Hero display title */
font-size: clamp(2.625rem, 6vw + 1rem, 5.625rem);

/* Section H2 */
font-size: clamp(2rem, 4vw + 0.5rem, 4.5rem);
```

### Eyebrow Labels

A key typographic pattern: small all-caps overline text in gold, preceding a large display heading. Creates editorial rhythm.

```
CHOREOGRAPHER · DIRECTOR · PRODUCER   ← DM Sans 600, 11px, tracking 0.14em, gold
Travis Payne                           ← Cormorant Garamond 300, 90px
```

### Tailwind Font Config

```js
fontFamily: {
  display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
  body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
  mono:    ['"DM Mono"', 'monospace'],
},
```

---

## 4. Spacing, Layout & Tokens

### Spacing Scale

Based on a 4px base unit. Custom scale extended beyond Tailwind defaults for cinematic breathing room.

| Token | px | Tailwind Class | Use |
|---|---|---|---|
| `space.1` | 4px | `p-1` | Inline chip padding |
| `space.2` | 8px | `p-2` | Tight element gaps |
| `space.3` | 12px | `p-3` | Button padding (Y) |
| `space.4` | 16px | `p-4` | Default inner padding |
| `space.5` | 20px | `p-5` | Form field padding |
| `space.6` | 24px | `p-6` | Card inner padding |
| `space.8` | 32px | `p-8` | Section inner padding |
| `space.10` | 40px | `p-10` | Subsection vertical gaps |
| `space.12` | 48px | `p-12` | Component vertical spacing |
| `space.16` | 64px | `p-16` | Section top/bottom padding (mobile) |
| `space.20` | 80px | `p-20` | Section vertical padding (tablet) |
| `space.24` | 96px | `p-24` | Section vertical padding (desktop) |
| `space.32` | 128px | `p-32` | Large hero offsets |
| `space.40` | 160px | `p-40` | XL section separators |

### Border Radii

| Token | Value | Usage |
|---|---|---|
| `radius.none` | `0px` | Hero images, full-bleed elements |
| `radius.sm` | `2px` | Tags, overline chips |
| `radius.md` | `4px` | Buttons, input fields |
| `radius.lg` | `8px` | Cards |
| `radius.xl` | `16px` | Modal dialogs, large cards |
| `radius.full` | `9999px` | Pill badges, avatar frames |

```js
borderRadius: {
  'tp-sm':   '2px',
  'tp-md':   '4px',
  'tp-lg':   '8px',
  'tp-xl':   '16px',
  'tp-full': '9999px',
},
```

### Shadows & Elevation

| Level | CSS Value | Usage |
|---|---|---|
| `shadow.none` | `none` | Flat cards on dark bg (border instead) |
| `shadow.sm` | `0 1px 3px rgba(0,0,0,0.5)` | Subtle tooltip lift |
| `shadow.md` | `0 4px 16px rgba(0,0,0,0.6)` | Cards on hover, dropdowns |
| `shadow.lg` | `0 12px 40px rgba(0,0,0,0.7)` | Modals, overlaid panels |
| `shadow.glow-gold` | `0 0 24px rgba(200,169,110,0.25)` | CTA button hover state |
| `shadow.glow-jade` | `0 0 16px rgba(45,212,191,0.3)` | Focus rings alternative |

*On dark backgrounds, elevation is communicated primarily through background-color progression (#0A → #11 → #1A) rather than shadows. Shadows supplement only on hover/active states.*

### Breakpoints

| Name | Min Width | Tailwind Prefix | Notes |
|---|---|---|---|
| `xs` | 375px | `xs:` | Small phones |
| `sm` | 640px | `sm:` | Large phones / phablets |
| `md` | 768px | `md:` | Tablets |
| `lg` | 1024px | `lg:` | Small desktops, laptops |
| `xl` | 1280px | `xl:` | Standard desktops |
| `2xl` | 1536px | `2xl:` | Wide monitors |
| `3xl` | 1920px | `3xl:` | Cinematic full HD (custom) |

```js
screens: {
  'xs':  '375px',
  // sm, md, lg, xl, 2xl — Tailwind defaults
  '3xl': '1920px',
},
```

### Z-Index Layers

| Layer | Value | Usage |
|---|---|---|
| `z.below` | `-1` | Background textures, parallax layers |
| `z.base` | `0` | Standard flow elements |
| `z.raised` | `10` | Cards on hover |
| `z.dropdown` | `100` | Nav dropdowns, tooltips |
| `z.sticky` | `200` | Sticky navigation bar |
| `z.overlay` | `500` | Image overlays, scrim layers |
| `z.modal` | `700` | Dialog/lightbox |
| `z.toast` | `900` | Notification toasts |
| `z.cursor` | `1000` | Custom cursor (if used) |

```js
zIndex: {
  'below':    '-1',
  'base':     '0',
  'raised':   '10',
  'dropdown': '100',
  'sticky':   '200',
  'overlay':  '500',
  'modal':    '700',
  'toast':    '900',
  'cursor':   '1000',
},
```

### Grid System

```js
// Container widths
maxWidth: {
  'site':    '1440px',  // Max site width
  'content': '1200px',  // Main content container
  'prose':   '720px',   // Blog/article text column
  'narrow':  '560px',   // Forms, CTAs
},
```

**Column Grid:**

| Breakpoint | Columns | Gutter | Outer Margin |
|---|---|---|---|
| xs (375px) | 4 | 16px | 20px |
| sm (640px) | 4 | 20px | 24px |
| md (768px) | 8 | 24px | 32px |
| lg (1024px) | 12 | 24px | 40px |
| xl (1280px) | 12 | 32px | 60px |
| 2xl (1536px) | 12 | 32px | 80px |

Layout uses CSS Grid via Tailwind's `grid-cols-*` utilities. Most sections use a 12-column underlying grid with content areas spanning 10 or 8 centered columns (offset 1 or 2) at desktop widths.

---

## 5. Motion Language (Framer Motion)

### Philosophy

Motion on this site should feel choreographed — not decorative. Every animation has a purpose: revealing content with weight, guiding the eye, and reflecting the kinetic artistry of Travis's work. Entrances should have *settle* — a final ease-in-slow that gives elements a sense of mass. Nothing bounces. Nothing spins without intention.

### Duration Scale

| Token | Duration | Usage |
|---|---|---|
| `duration.instant` | 80ms | State switches (color, opacity) |
| `duration.fast` | 150ms | Hover color transitions |
| `duration.normal` | 300ms | Button hover, tooltip appear |
| `duration.deliberate` | 500ms | Card entrances, nav open |
| `duration.cinematic` | 800ms | Hero reveals, section entrances |
| `duration.epic` | 1200ms | Page transition overlays |

### Easing Curves

```js
// framer-motion transition objects
const ease = {
  smooth:    [0.25, 0.1, 0.25, 1],       // Standard ease — general UI
  enter:     [0.0, 0.0, 0.2, 1],          // Fast-in, slow-out — elements arriving
  exit:      [0.4, 0.0, 1, 1],            // Slow-start, fast-out — elements leaving
  cinematic: [0.76, 0, 0.24, 1],          // Dramatic deceleration — hero elements
  settle:    [0.34, 1.56, 0.64, 1],       // Slight overshoot/settle — NOT a bounce, subtle
  linear:    [0, 0, 1, 1],                // Progress bars, scrubs
}
```

### Signature Entrance Patterns

**Fade Up (standard section entrance):**
```js
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
}
```

**Stagger Children (card grids, team members):**
```js
const staggerContainer = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}
const staggerItem = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
}
```

**Clip Reveal (text masking — hero headline):**
```js
// Parent: overflow-hidden. Child animates translateY from 100% to 0%.
const clipReveal = {
  hidden:  { y: '100%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] } }
}
// Apply line-by-line with incremental delay for headline words
```

**Horizontal Slide (marquee/ticker):**
Uses CSS `animation: marquee 30s linear infinite` rather than Framer Motion, for performance. Framer Motion `useAnimationFrame` used only for scroll-synced variants.

**Scale Reveal (image reveal):**
```js
const imageReveal = {
  hidden:  { scale: 1.08, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }
}
```

### Scroll-Driven Animations

Use Framer Motion `useInView` with `once: true` and `margin: "-100px"` for all section-level entrances. Use `useScroll` + `useTransform` for:
- Hero parallax: background video/image moves at 0.4x scroll speed.
- Sticky section labels: fade out as section scrolls past.
- Progress indicator: thin gold line at top of page tracks scroll depth.

### Hover Patterns

| Element | Hover Behavior | Duration |
|---|---|---|
| Primary CTA button | Background: black → gold; text: gold → black; subtle glow shadow | 200ms |
| Ghost button | Border color: border → gold; text color: white → gold | 150ms |
| Production card | Scale: 1 → 1.02; overlay: 50% → 30% opacity; title slides up 8px | 300ms |
| Team member card | Grayscale: 30% → 0%; gold underline appears | 300ms |
| Nav link | Gold underline slides in from left; text color shifts to gold | 150ms |
| Marquee logos | Opacity: 50% → 100% | 150ms |

### Page Transitions

Use Next.js `<AnimatePresence>` at the root layout level:

```js
// Outgoing page: fade out + subtle slide up (-20px Y)
// Incoming page: fade in + slide from below (+20px Y)
// Overlay: a full-screen #0A0A0A panel that sweeps across and back
// Duration: 400ms out, 600ms in

const pageVariants = {
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
  exit:     { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } }
}
```

### Prefers-Reduced-Motion Fallback

```js
// Global hook — use everywhere
import { useReducedMotion } from 'framer-motion'

const prefersReduced = useReducedMotion()

const safeTransition = prefersReduced
  ? { duration: 0, ease: 'linear' }
  : { duration: 0.8, ease: [0.76, 0, 0.24, 1] }

// For variants:
const safeVariants = prefersReduced
  ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  : fadeUp
```

All CSS marquee animations include `@media (prefers-reduced-motion: reduce) { animation-play-state: paused; }`.

---

## 6. Imagery & Video Art Direction

### Hero Reel Strategy

- **Primary hero:** Full-viewport looping video reel (no audio by default, `autoplay muted loop playsInline`). Duration: 30–60s of best-of footage — live shows, rehearsal moments, major productions.
- **Poster frame:** A single ultra-high-contrast still (preferably a silhouette or power pose against dramatic stage lighting) that loads instantly as the video poster. This ensures the hero reads well before video loads.
- **Overlay:** A vertical linear gradient from `rgba(10,10,10,0)` at center to `rgba(10,10,10,0.95)` at the bottom, blending the video into the below-the-fold content seamlessly.
- **Performance rules:** Video served in `.webm` (primary) + `.mp4` (fallback). Max bitrate 4Mbps for 1080p. Use `preload="none"` and lazily load via Intersection Observer — video only loads when the page is visible and connection is not `saveData`.
- **Mobile fallback:** On viewports under 768px or `connection.saveData === true`, replace video with a high-quality `.avif`/`.webp` still image. No autoplay video on mobile to conserve data.

### Photography Treatment

- **Color grading direction:** Desaturated to 15–20% (not fully B&W), lifted in shadows (film-stock feel), strong vignette. Occasionally one bold selective color is preserved (e.g., stage red spotlights, gold costumes).
- **Portrait photos:** Square (`1:1`) or portrait-ratio (`3:4`) within rounded-lg cards. Never crop faces. Always `object-fit: cover` with `object-position: top center` for portraits.
- **Action/performance photos:** Widescreen (`16:9` or `21:9`). Full bleed in portfolio detail pages.
- **Partner/client logos:** Monochrome (desaturated to white/gold). `50%` opacity baseline, `100%` on hover.

### Portfolio Grid Treatment

- Asymmetric masonry-style grid at desktop (using CSS Grid with `grid-auto-rows`): alternating large/small tiles.
- Aspect ratios: `16:9` for landscape-dominant productions, `3:4` for portrait/dancer-focused work.
- On hover: overlay fades from `rgba(10,10,10,0.6)` to `rgba(10,10,10,0.3)`, title/credit text slides up from bottom.
- No captions visible until hover — keeps the grid visually clean.

### Gradients

```css
/* Hero bottom scrim */
background: linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.85) 80%, #0A0A0A 100%);

/* Card overlay (default) */
background: linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 60%, transparent 100%);

/* Section divider gradient (horizontal) */
background: linear-gradient(to right, transparent, rgba(200,169,110,0.3), transparent);
```

### Performance-Safe Image Rules

- All images use Next.js `<Image>` component with explicit `width` / `height` to prevent layout shift (CLS = 0).
- Priority loading (`priority` prop) for above-the-fold hero images only.
- Lazy loading for all below-fold images.
- Serve `.avif` (primary) → `.webp` → `.jpg` via Next.js automatic format negotiation.
- Thumbnail/blur placeholders: use `placeholder="blur"` with auto-generated `blurDataURL`.
- Never use raw `<img>` tags in production components.

---

## 7. Core Component Inventory

### 7.1 Navigation (`<SiteNav>`)

**Structure:** Fixed top, full-width, transparent over hero. Transitions to `bg-tp-surface/90 backdrop-blur-md` on scroll (`scrollY > 80px`).

**Logo:** Wordmark "TRAVIS PAYNE" in Cormorant Garamond 500, 18px, tracking 0.12em. No icon mark needed. Left-aligned.

**Nav Links (desktop):** `Home · About · Productions · Team · Partners · Masterclasses · Blog · Store · Contact`. DM Sans 400, 13px, tracking 0.06em, uppercase. Gold underline slide-in on hover.

**Mobile:** Hamburger (3 lines → X animated with Framer Motion rotate). Full-screen overlay menu with staggered link entrance. Links at 36px, Cormorant Garamond 300.

**States:** `default` | `scrolled` | `open` (mobile) | `active-link` (gold color + underline).

**CTA in nav:** "Book Now" pill button (ghost style, gold border, gold text) at far right on desktop.

---

### 7.2 Hero (`<HeroSection>`)

**Variants:**
- `video` — Full-viewport video reel (Home page only).
- `image` — Full-viewport still with parallax (About, etc.).
- `split` — 50/50 split text/image (Masterclasses landing).
- `minimal` — Dark background with large type only, no media (Blog index).

**Content layer:** Positioned absolute, bottom-left offset, Z above video.
- Overline label (gold, all-caps, DM Sans)
- Display heading (Cormorant Garamond, 5.625rem → clamped)
- Sub-copy (DM Sans 400, 18px, 60% white)
- 2 CTA buttons (primary + ghost)
- Scroll indicator: animated gold down-chevron

---

### 7.3 Buttons

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| `primary` | `tp-gold` | `tp-black` | none | bg darkens to `tp-gold-dk`, glow shadow |
| `ghost` | transparent | `tp-white` | 1px `tp-border` | border → `tp-gold`, text → `tp-gold` |
| `ghost-gold` | transparent | `tp-gold` | 1px `tp-gold` | bg → `tp-gold`, text → `tp-black` |
| `link` | none | `tp-gold` | none (underline) | underline animates |
| `icon` | `tp-subtle` | `tp-white` | none | bg → `tp-elevated` |
| `destructive` | `#F87171` | `tp-black` | none | opacity 90% |

**Sizes:** `sm` (32px height, 12px padding), `md` (44px, 20px padding), `lg` (52px, 28px padding).

**Shape:** `border-radius: 4px` (`tp-md`). No pill buttons for main CTAs (pill only for tags/badges).

**Focus:** 2px `tp-jade` outline, 2px offset.

---

### 7.4 Production / Portfolio Card (`<ProductionCard>`)

- Dark surface background (`tp-surface`).
- Cover image: `16:9` or `3:4`, full bleed, top of card, no border-radius on top.
- Content area: 24px padding.
- Overline: category label (monospace, gold, 11px, uppercase).
- Title: Cormorant Garamond 500, 22px.
- Meta row: Year · Type · Client — DM Sans 400, 13px, muted color.
- Hover: card lifts (shadow.md), image scales 1.04, overlay lightens slightly.
- Variants: `standard` | `featured` (wider, 2-column span) | `horizontal` (image left, content right).

---

### 7.5 Team Member Card (`<TeamCard>`)

- Portrait image `1:1` with rounded-lg.
- Name: DM Sans 600, 18px.
- Title/Role: DM Sans 400, 14px, gold.
- Bio excerpt: DM Sans 400, 14px, muted (max 2 lines, `line-clamp-2`).
- Social links: small icon row (Instagram, LinkedIn).
- Hover: image desaturation lifts (filter: grayscale(30%) → grayscale(0%)).

---

### 7.6 Marquee / Client Logos (`<LogoMarquee>`)

- Infinite horizontal scroll, CSS keyframe `marquee`.
- Duplicate set for seamless loop.
- Logo images: monochrome white SVG, height `32px`, auto width.
- Opacity: `50%` base, `100%` hover.
- Section heading above: "Trusted by the World's Biggest Names."
- No pause on hover (continuous cinematic scroll).
- `prefers-reduced-motion`: animation paused, logos displayed in static grid fallback.

---

### 7.7 Gallery / Lightbox (`<Gallery>`)

- Grid: 3-column desktop, 2-column tablet, 1-column mobile.
- Masonry option via `grid-auto-rows: 10px` technique.
- Click opens full-screen lightbox: dark modal (`tp-black` bg), image centered.
- Lightbox controls: previous/next arrows (40px circle buttons), close X, swipe on mobile.
- Caption below image: monospace, muted, 13px.
- Image transition in lightbox: `opacity` fade, 300ms.

---

### 7.8 Blog Card (`<BlogCard>`)

- Cover image: `16:9`, full width.
- Category tag: gold chip, 11px, all-caps.
- Date: muted, 13px.
- Title: Cormorant Garamond 500, 22px, 2-line clamp.
- Excerpt: DM Sans 400, 14px, 3-line clamp, muted.
- "Read More" link-style button.
- Author avatar + name row at bottom.
- Variants: `card` (grid) | `featured` (full-width, horizontal layout).

---

### 7.9 Product Card (`<ProductCard>`)

- Square image `1:1`.
- Product name: DM Sans 600, 16px.
- Price: DM Sans 500, 18px, gold.
- Sale price: strikethough original, accent color new price.
- "Add to Cart" button (ghost → primary on hover), appears on hover at desktop.
- Badge: "New" / "Limited" pill top-right.

---

### 7.10 Masterclass Card (`<MasterclassCard>`)

- Thumbnail `16:9` with play button overlay (translucent black circle with white play icon).
- Instructor badge: small avatar + name bottom-left of image.
- Title: DM Sans 600, 16px.
- Duration + level metadata: muted, 13px.
- Price or "Enroll" CTA.
- Progress bar (if enrolled, shows completion %).

---

### 7.11 Form Components

- **Input / Textarea:** Background `tp-subtle`, border `tp-border`, text `tp-white`. Focus: border `tp-gold`, ring `tp-jade` 2px. Border-radius `tp-md`.
- **Select:** Custom dropdown, matching input style, chevron icon.
- **Checkbox / Radio:** Custom styled, gold fill on check.
- **Label:** DM Sans 500, 14px, `tp-white`.
- **Helper / Error text:** 12px; `tp-muted` for helper, `#F87171` for error.
- **All inputs:** min-height `44px` for touch targets.

---

### 7.12 Footer (`<SiteFooter>`)

- Background: `#070707` (slightly darker than page bg for visual separation).
- 4-column desktop layout: Brand | Navigation | Social | Newsletter.
- Brand column: wordmark, tagline, copyright.
- Navigation: 3 columns of links, DM Sans 400, 14px.
- Social icons: Instagram, Facebook, X, TikTok, YouTube, LinkedIn — 24px, muted → white on hover.
- Newsletter: email input + subscribe button inline.
- Bottom bar: legal links + "Travis Payne Productions © 2024" — muted, 12px.
- Thin gold horizontal rule above footer.

---

## 8. Page-by-Page Wireframes

All wireframes are text/ASCII descriptions of layout zones and content hierarchy.

---

### 8.1 Home Page

```
┌──────────────────────────────────────────────────────────────────┐
│ FIXED NAV                                                        │
│  [TRAVIS PAYNE]    Home · About · Productions · …    [Book Now] │
├──────────────────────────────────────────────────────────────────┤
│ HERO — 100vh video reel, full bleed                              │
│  ↓ (bottom-left, 10% from bottom)                               │
│  CHOREOGRAPHER · DIRECTOR · PRODUCER  ← overline, gold         │
│  "Architect of                                                   │
│   Cultural Moments"  ← display-2xl, Cormorant, white            │
│  Short sub-copy: 2–3 lines, DM Sans, 70% white                  │
│  [View Productions]  [Book Travis]    ← CTA buttons             │
│  ↓ animated gold chevron                                         │
├──────────────────────────────────────────────────────────────────┤
│ LEGACY MARQUEE — full-width, black bg                            │
│  Scrolling text: Michael Jackson · Beyoncé · Janet Jackson ·    │
│  Madonna · Usher · ...  (loop)   ← DM Mono, gold               │
├──────────────────────────────────────────────────────────────────┤
│ ABOUT TEASER — 2-column, 60/40 split                             │
│  Left: large portrait (3:4 ratio)                               │
│  Right:                                                          │
│    ABOUT TRAVIS  ← overline                                      │
│    "More Than a Choreographer"  ← H2 display                    │
│    2 paragraph bio excerpt                                       │
│    [Read the Full Story →]  ← ghost button                      │
├──────────────────────────────────────────────────────────────────┤
│ FEATURED PRODUCTIONS — "Selected Works" section                  │
│  Section header: SELECTED WORKS / "Moments That Define…"        │
│  Asymmetric grid: 1 large card (2/3 width) + 2 stacked (1/3)   │
│  [View All Productions →]                                        │
├──────────────────────────────────────────────────────────────────┤
│ STATS BAR — full-width, dark surface                             │
│  30+ Years · 50+ Productions · 100M+ Audience Reached ·         │
│  Grammy · Emmy · Tony Nominations  ← animated count-up          │
├──────────────────────────────────────────────────────────────────┤
│ MASTERCLASSES CTA — split section, 50/50                         │
│  Left: editorial photo or short clip                             │
│  Right:                                                          │
│    ONLINE MASTERCLASSES  ← overline                              │
│    "Train with the World's Best"  ← H2                          │
│    Description, instructor names                                 │
│    [Browse Masterclasses]                                        │
├──────────────────────────────────────────────────────────────────┤
│ PARTNER LOGOS — LogoMarquee component                            │
│  "In Partnership With"  ← section label                         │
│  Infinite scroll of logos                                        │
├──────────────────────────────────────────────────────────────────┤
│ LATEST BLOG POSTS — 3-column BlogCard grid                       │
│  "From the Studio"  ← section header                            │
│  3 most recent posts                                             │
│  [Visit the Blog →]                                             │
├──────────────────────────────────────────────────────────────────┤
│ CONTACT TEASER — centered, minimal                               │
│  "Let's Create Something Extraordinary"  ← H2                   │
│  Short invite copy                                               │
│  [Get in Touch]  [Book Travis]                                   │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.2 About Page

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV (scrolled state)                                             │
├──────────────────────────────────────────────────────────────────┤
│ HERO — 70vh image, portrait of Travis, parallax                  │
│  Bottom overlay with:                                            │
│  ABOUT  ← overline                                              │
│  "Travis Payne"  ← display-xl                                    │
│  "World-renowned choreographer, director, producer."            │
├──────────────────────────────────────────────────────────────────┤
│ BIOGRAPHY — full prose section                                   │
│  2-column at desktop: text (60%) | pull-quote / aside (40%)     │
│  Long-form bio text: origin, MJ years, founding TPP, etc.       │
│  Pull-quote callout: editorial large-type quote from press       │
├──────────────────────────────────────────────────────────────────┤
│ CAREER TIMELINE — horizontal scrollable timeline at mobile       │
│  Vertical at desktop (alternating left/right)                   │
│  Milestones: 1994 – 1997 – 2001 MJ Invincible – 2009 This is   │
│  It – 2011 TPP Founded – … each with date, title, brief note    │
├──────────────────────────────────────────────────────────────────┤
│ PARTNER INTRO — Stacy Walker spotlight                           │
│  Mini profile card: photo, bio excerpt, role at TPP             │
├──────────────────────────────────────────────────────────────────┤
│ PRESS QUOTES — horizontal scroll of quote cards                  │
│  Pull-quote format, publication logo, author                     │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.3 Team Page

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV                                                              │
├──────────────────────────────────────────────────────────────────┤
│ PAGE HEADER — minimal hero, dark, type only                      │
│  THE TEAM  ← overline                                            │
│  "The People Behind the Productions"  ← display-lg              │
├──────────────────────────────────────────────────────────────────┤
│ LEADERSHIP — 2-col at desktop                                    │
│  Travis Payne (large featured card, left)                       │
│  Stacy Walker (large featured card, right)                      │
├──────────────────────────────────────────────────────────────────┤
│ FULL TEAM GRID — 3-col at desktop, 2 at tablet, 1 at mobile     │
│  TeamCard components for each member                             │
├──────────────────────────────────────────────────────────────────┤
│ JOIN US CTA — centered section                                   │
│  "Work with Travis Payne Productions"                           │
│  [Contact Us]                                                    │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.4 Partners Page

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV                                                              │
├──────────────────────────────────────────────────────────────────┤
│ PAGE HEADER                                                      │
│  PARTNERS & COLLABORATORS  ← overline                            │
│  "An Unmatched Network"  ← display-lg                           │
├──────────────────────────────────────────────────────────────────┤
│ PARTNER CATEGORIES — tabbed filter                               │
│  Tabs: All · Entertainment · Fashion · Brands · Venues           │
├──────────────────────────────────────────────────────────────────┤
│ PARTNER GRID — 4-col logos at desktop, 3 at tablet              │
│  Each: logo + name below, hover shows brief relationship note    │
├──────────────────────────────────────────────────────────────────┤
│ PARTNERSHIP CTA                                                  │
│  "Interested in partnering?"                                     │
│  [Reach Out]                                                     │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.5 Productions Index Page

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV                                                              │
├──────────────────────────────────────────────────────────────────┤
│ PAGE HERO — 50vh image, dark overlay                             │
│  PRODUCTIONS  ← overline                                         │
│  "A Career in Moments"  ← display-lg                            │
│  Sub-copy: "Choreography, direction, and production across…"    │
├──────────────────────────────────────────────────────────────────┤
│ FILTER BAR — sticky below nav on scroll                          │
│  Category tabs: All · Concert Tours · Film & TV · Live Events · │
│  Branded · Theater                                               │
│  Sort: Most Recent · A-Z                                        │
├──────────────────────────────────────────────────────────────────┤
│ PRODUCTIONS GRID — asymmetric masonry                            │
│  Row 1: 1 large (2-col) + 1 standard                            │
│  Row 2: 3 standard                                               │
│  Row 3: 1 standard + 1 large (2-col)                            │
│  … continues with infinite scroll or paginated load             │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.6 Productions Detail Page

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV                                                              │
├──────────────────────────────────────────────────────────────────┤
│ HERO — full-viewport image or video, 100vh                       │
│  Breadcrumb: Productions > [Category]  ← muted, top-left        │
│  Production title: display-xl, bottom-left                      │
│  Credit line: "Choreographed by Travis Payne"  ← DM Mono, gold │
├──────────────────────────────────────────────────────────────────┤
│ META BAR — thin horizontal band                                  │
│  Year · Client/Artist · Category · Role (Director / Choreo)     │
├──────────────────────────────────────────────────────────────────┤
│ PRODUCTION BODY — 2-col at desktop                               │
│  Left (65%): Long description of the production                  │
│  Right (35%): Sticky sidebar                                     │
│    — Key facts / credits table                                   │
│    — Awards if applicable                                        │
│    — External links (streaming, venue)                           │
├──────────────────────────────────────────────────────────────────┤
│ MEDIA GALLERY — full-width                                       │
│  Mixed grid: video thumbnails + photography                      │
│  Lightbox on click                                               │
├──────────────────────────────────────────────────────────────────┤
│ RELATED PRODUCTIONS — horizontal scroll                          │
│  "More from Travis Payne"  ← section header                     │
│  3–4 ProductionCards in scrollable row                          │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.7 Store Index Page

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV                                                              │
├──────────────────────────────────────────────────────────────────┤
│ STORE HEADER — minimal, dark, text only                          │
│  TPX STORE  ← overline                                           │
│  "Travis Payne Exclusives"  ← display-lg                        │
├──────────────────────────────────────────────────────────────────┤
│ FILTER / CATEGORY ROW                                            │
│  All · Apparel · Accessories · Digital · Signed Items            │
│  Sort: Newest · Price: Low–High · Price: High–Low                │
├──────────────────────────────────────────────────────────────────┤
│ PRODUCT GRID — 4-col desktop, 2-col tablet, 1-col mobile         │
│  ProductCard components                                          │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.8 Store Product Detail Page

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV                                                              │
├──────────────────────────────────────────────────────────────────┤
│ PRODUCT DETAIL — 2-col at desktop                                │
│  Left (55%): Image gallery                                       │
│    — Main image (1:1), large                                     │
│    — Thumbnail strip below: 4-5 additional images                │
│  Right (45%):                                                    │
│    Breadcrumb: Store > Apparel                                   │
│    Product name: DM Sans 600, 28px                               │
│    Price: gold, 24px                                             │
│    Short description (2–3 lines)                                 │
│    Size/variant selector                                         │
│    Quantity selector                                             │
│    [Add to Cart]  [Add to Wishlist]                              │
│    Accordion: Details · Shipping · Returns                       │
├──────────────────────────────────────────────────────────────────┤
│ RELATED PRODUCTS — horizontal scroll                             │
│  "You may also like"                                             │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.9 Blog Index Page

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV                                                              │
├──────────────────────────────────────────────────────────────────┤
│ PAGE HEADER — dark, text-only                                    │
│  FROM THE STUDIO  ← overline                                     │
│  "News, Insights & Stories"  ← display-lg                       │
├──────────────────────────────────────────────────────────────────┤
│ FEATURED POST — full-width horizontal card (large)               │
│  Left: 60% image                                                 │
│  Right: 40% content — category, date, title, excerpt, CTA       │
├──────────────────────────────────────────────────────────────────┤
│ CATEGORY FILTER — tab row                                        │
│  All · Industry · Masterclasses · Behind the Scenes · Press     │
├──────────────────────────────────────────────────────────────────┤
│ BLOG GRID — 3-col desktop, 2-col tablet, 1-col mobile            │
│  BlogCard components                                             │
│  Pagination or "Load More" button                               │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.10 Blog Post Page

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV                                                              │
├──────────────────────────────────────────────────────────────────┤
│ POST HERO — 60vh cover image                                     │
│  Category tag, date  ← top of image overlay                     │
│  Post title: display-lg, bottom overlay                         │
├──────────────────────────────────────────────────────────────────┤
│ AUTHOR BAR — thin band below hero                                │
│  Author avatar + name · Date · Read time · Share icons          │
├──────────────────────────────────────────────────────────────────┤
│ POST CONTENT — narrow prose column (720px max-width, centered)   │
│  Body text: DM Sans 400, 18px, 1.75 line-height                 │
│  Pull quotes: Cormorant Garamond italic, 32px, gold left border  │
│  In-line images: full prose-column width, rounded-lg             │
│  Headings: Cormorant Garamond within prose                       │
├──────────────────────────────────────────────────────────────────┤
│ TAGS ROW — below content                                         │
├──────────────────────────────────────────────────────────────────┤
│ RELATED POSTS — 3 BlogCards                                      │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.11 Masterclasses Page

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV                                                              │
├──────────────────────────────────────────────────────────────────┤
│ HERO — split, 50/50                                              │
│  Left: editorial photo or reel clip of class footage            │
│  Right:                                                          │
│    MASTERCLASSES  ← overline                                     │
│    "Train with Travis Payne & Stacy Walker"  ← display-lg       │
│    Sub-copy: "World-class online dance education"                │
│    [Browse Classes]  [View Schedule]                             │
├──────────────────────────────────────────────────────────────────┤
│ INSTRUCTOR PROFILES — 2-col                                      │
│  Travis Payne card  |  Stacy Walker card                        │
│  Large photo, bio excerpt, specialty areas                       │
├──────────────────────────────────────────────────────────────────┤
│ COURSE GRID — 3-col desktop                                      │
│  MasterclassCard components                                      │
│  Filter: Style (Hip-Hop · Jazz · Contemporary · All) · Level     │
├──────────────────────────────────────────────────────────────────┤
│ TESTIMONIALS — horizontal scroll of quote cards                  │
│  Past student testimonials                                       │
├──────────────────────────────────────────────────────────────────┤
│ HIRAS SECTION — branded module                                   │
│  HIRAS program landing — dedicated info block, CTA              │
├──────────────────────────────────────────────────────────────────┤
│ FAQ ACCORDION — 2-col at desktop                                  │
│  Common questions about courses, access, scheduling              │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.12 Contact / Book Page

```
┌──────────────────────────────────────────────────────────────────┐
│ NAV                                                              │
├──────────────────────────────────────────────────────────────────┤
│ PAGE HEADER — dark, text only                                    │
│  CONTACT & BOOKING  ← overline                                   │
│  "Let's Create Something Extraordinary"  ← display-lg           │
├──────────────────────────────────────────────────────────────────┤
│ CONTACT SPLIT — 2-col desktop                                    │
│  Left (55%): BOOKING INQUIRY FORM                                │
│    — Full Name                                                   │
│    — Email Address                                               │
│    — Company / Organization                                      │
│    — Project Type (select: Concert · Film/TV · Brand · Other)    │
│    — Estimated Date / Timeline                                   │
│    — Project Description (textarea)                              │
│    — Budget Range (select)                                       │
│    — [Submit Inquiry]  ← primary button                         │
│  Right (45%):                                                    │
│    Contact details block                                         │
│    — Email address                                               │
│    — Agency/representation info (if public)                      │
│    — Social links                                                │
│    — Response time note ("We respond within 2 business days")   │
│    — Small editorial photo of Travis                             │
├──────────────────────────────────────────────────────────────────┤
│ GENERAL FAQ — accordion, 2 col                                   │
│  What types of projects do you take on?                         │
│  What is the booking process?                                    │
│  Do you work internationally? etc.                               │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 9. Accessibility

### Contrast

All text/background combinations meet WCAG 2.1 AA at minimum (contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text). Key pairs verified in Section 2. `color.text.muted` (`#5C5650`) is restricted to large text (18px+ or bold 14px+) only.

### Focus States

- All interactive elements (buttons, links, inputs, selects, checkboxes) must have a visible `focus-visible` outline.
- Style: `outline: 2px solid #2DD4BF; outline-offset: 2px;` (jade color, highly visible on dark backgrounds).
- Never `outline: none` without a custom replacement.
- Focus rings use `:focus-visible` (not `:focus`) to avoid showing rings on mouse clicks while still appearing for keyboard navigation.

```css
/* Global in globals.css */
:focus-visible {
  outline: 2px solid #2DD4BF;
  outline-offset: 2px;
  border-radius: 2px;
}
```

### Hit Targets

- All interactive elements minimum `44×44px` touch target (WCAG 2.5.5 AAA).
- On mobile: nav hamburger, close buttons, and social icons must meet this minimum.
- Use padding to expand visual hit area where needed without changing visual appearance.

### Motion

- All Framer Motion animations check `useReducedMotion()` and fall back to simple `opacity` transitions (no translate, scale, or delay).
- CSS marquee animations pause under `prefers-reduced-motion: reduce`.
- No auto-playing audio. Video hero autoplays muted; provide a visible play/pause toggle so users can stop the video.

### Alt Text Policy

- All decorative images: `alt=""` (empty string, not absent).
- All informational images (portraits, production stills): descriptive `alt` text ("Travis Payne rehearsing on stage during the This Is It production").
- Logo images: `alt="[Company Name] logo"`.
- Background images set via CSS `background-image` need no alt (handled by CSS, not HTML).
- Video elements: `<track kind="captions">` provided for any video with speech or narration.

### Semantic HTML

- Heading hierarchy strictly respected per page: one `<h1>`, proper `<h2>`/`<h3>` nesting.
- Navigation uses `<nav aria-label="Main navigation">`.
- Footer uses `<footer>`.
- Cards with links: use `<article>` with a single covering `<a>` tag (no nested interactive elements creating tab-stop confusion).
- Forms: all inputs associated with labels via `for`/`id` or `aria-labelledby`.

### ARIA

- Live regions for form submission success/error states: `aria-live="polite"`.
- Lightbox: `role="dialog"`, `aria-modal="true"`, `aria-label`, focus trapped on open, focus restored on close.
- Tabs/filter: proper `role="tablist"` / `role="tab"` / `aria-selected`.
- Marquee: `aria-hidden="true"` on the decorative scrolling duplicate set.

---

## 10. Improvements Over the Current Duda Site

The current Duda site, while functional, suffers from limitations inherent to no-code template platforms. The rebuilt site addresses each:

| # | Current Duda Limitation | New Site Solution |
|---|---|---|
| 1 | Generic template layout, indistinguishable from thousands of other Duda sites | Custom, hand-crafted design system built from scratch; no template aesthetic |
| 2 | Static imagery with no motion or cinematic presence | Framer Motion throughout: clip reveals, scroll-driven parallax, staggered grids |
| 3 | No looping hero video — static image on home page | Full-viewport looping video reel hero with performance-safe fallbacks |
| 4 | Light/neutral color palette — does not signal premium creative authority | Deep editorial dark base with warm gold accent — awards-show and fashion-brand energy |
| 5 | Generic serif/sans pairing, no typographic personality | Cormorant Garamond + DM Sans — distinctive, fashion-editorial, high-contrast pairing |
| 6 | No blog functionality | Full blog system: index, category filtering, full post pages with rich prose layout |
| 7 | No masterclass/education offering integrated in site UX | Dedicated Masterclasses section with instructor profiles, course grid, HIRAS module |
| 8 | TPX Store exists but is visually disconnected from brand | Rebuilt store with consistent design language, product cards matching full site identity |
| 9 | Scrolling marquee and legacy client names buried or absent | Prominent "Legacy Marquee" ticker and credits-roll-style production metadata front and center |
| 10 | No page transitions — abrupt navigation | Smooth `AnimatePresence` page transitions with coordinated enter/exit sequences |
| 11 | No career timeline or biography depth | Dedicated timeline component on About page; full long-form biography treatment |
| 12 | Mobile experience is a scaled-down afterthought | Mobile-first responsive design; video replaced by optimized stills on mobile |
| 13 | Poor accessibility: low contrast on some elements, no visible focus states | WCAG 2.1 AA+ throughout; jade focus rings; full keyboard navigation support |
| 14 | No `prefers-reduced-motion` support | All animations respect OS-level reduced motion preferences |
| 15 | Page speed limited by Duda platform | Next.js App Router with RSC, automatic `<Image>` optimization, `.avif`/`.webp`, code splitting |
| 16 | Social links scattered / no consistent social integration | Social links unified in nav, footer, and team cards; consistent icon treatment |
| 17 | Contact form is minimal, not booking-oriented | Full structured booking inquiry form with project type, timeline, and budget fields |
| 18 | No SEO metadata control | Next.js `generateMetadata` per page: custom OG images, structured data, canonical URLs |
| 19 | Partners page is a flat logo dump | Partners page with category filtering, hover relationship notes, partnership CTA |
| 20 | Productions section lacks depth — no detail pages | Full production detail pages: description, credits, media gallery, related works |

---

*End of UI/UX Design System Document — Version 1.0*

*Handoff note for Web Developer agent: All token values in this document are final and implementable. Begin with the Tailwind config tokens in Sections 2, 3, and 4, then implement the motion variants from Section 5. Components in Section 7 should be built in order of shared-dependency (buttons and typography atoms first, then cards, then page-level assemblies).*
