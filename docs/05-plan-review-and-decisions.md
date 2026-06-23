# 05 — Plan Review, Conflict Resolution & Canonical Decisions

> **Role of this document:** The three specialist docs (`02` front-end, `03` UI/UX,
> `04` backend) were authored **independently and in parallel**. This is the lead
> review that reads them against each other, resolves the seams, and establishes a
> **single source of truth**. **Where any doc conflicts with this one, this document
> wins.** Implementers should read `05` alongside each spec.

## 0. Stack confirmation (React)

The site is **React**. The recommended framework is **Next.js 15 (App Router) on
React 19** — Next.js *is* React, plus server rendering so the blog/store are
SEO-indexable. A plain client-only React SPA (Vite) is technically possible but
sacrifices SEO/social-preview on dynamic content; **not recommended** (see Open
Decision D1).

---

## 1. Cross-document conflicts found & resolutions

Severity: 🔴 will break the build / mislead implementers · 🟠 inconsistency to settle · 🟡 minor/cosmetic.

| # | Sev | Conflict | Source of truth (resolution) |
|---|---|---|---|
| C1 | 🔴 | **Blog collection name.** `02` queries `.collection('posts')`; `04` defines `blogPosts`. | **`blogPosts`** (per `04`). `02` corrected. |
| C2 | 🔴 | **Design-token naming.** `02` assumes generic CSS vars `--color-brand-primary`, Tailwind `brand.primary`/`surface`/`text.*`. `03` ships hardcoded `tp-gold`, `tp-surface`, `tp-white`… and all components reference `tp-*`. Two incompatible systems. | **`tp-*` names from `03` are canonical** (components depend on them). Define each as a CSS custom property (`--tp-gold:#C8A96E`…) in `globals.css`; Tailwind theme maps both the `tp-*` names **and** semantic aliases (`primary`, `surface`, `text`) to those vars. Merged config in §3.2. |
| C3 | 🔴 | **Email provider.** `02` uses **Resend** (`RESEND_API_KEY`, `/api/contact`). `04` uses **SendGrid** via Firebase **Trigger Email** extension + `mail/{doc}` collection. | **Trigger Email extension** is canonical; SMTP provider **SendGrid** (Resend acceptable as a drop-in SMTP). Front end does **not** call an email API directly — it writes Firestore; the extension sends. Drop `RESEND_API_KEY` unless chosen as SMTP. |
| C4 | 🟠 | **Form submission flow.** `02`: Server Action → `/api/contact` → email. `04`: client reCAPTCHA → callable Fn → Firestore → Trigger Email. | **Canonical:** client gets reCAPTCHA token → **Next.js Server Action** (`submitContact`/`submitBooking`) verifies reCAPTCHA server-side → writes `bookings` + `mail` docs → returns result. No separate callable for V1. App Check stays on client SDK paths. |
| C5 | 🔴 | **Doc cross-references in `02`** point to `docs/03-backend-schema.md` and `docs/04-design-tokens.md` (wrong numbers/names). | Actual: backend = **`04-backend-google-cloud.md`**, UI/UX = **`03-uiux-design-system.md`**. `02` corrected. |
| C6 | 🟠 | **Enrollment doc ID.** `04` schema says auto-`{enrollmentId}` + index `uid,status`, but its rules/flow use composite `{uid}_{classId}`. | **Canonical doc ID = `{uid}_{classId}`** (also store `uid`, `masterclassId` fields). Makes `exists()` checks O(1) in rules; gated video still goes through the `getMuxPlaybackToken` callable. |
| C7 | 🟠 | **API route names.** `02`: `/api/contact`, `/api/book`. `04`: `/api/submit-booking`, `/api/subscribe`, `/api/checkout`. | Canonical list in §3.3. Forms use Server Actions; only Stripe webhook + revalidate are Route Handlers. |
| C8 | 🔴 | **`next/image` domains.** `02` allowlists only `firebasestorage.googleapis.com`, but `productions.videoUrl`=YouTube (thumbnails `i.ytimg.com`) and masterclasses=Mux (`image.mux.com`). | Allowlist **`firebasestorage.googleapis.com`, `image.mux.com`, `i.ytimg.com`, `img.youtube.com`** (§3.5). |
| C9 | 🟠 | **Tailwind version.** `02` says Tailwind **4.x**; `03` delivers **v3-style** `tailwind.config.js` (`theme.extend`, `screens`). v4 is CSS-first (`@theme`) and would require rewriting all tokens. | **Use Tailwind v3.4 for V1** (matches delivered tokens + `@tailwindcss/typography` maturity). Revisit v4 post-launch. (Open Decision D2.) |
| C10 | 🟠 | **Deploy/branch model.** `02`: push to `main` → prod. `04`: push to `main` → **staging**, tag `v*` → prod. Repo currently has no `main`. | **Canonical:** PR → App Hosting **preview** channel; merge to `main` → **staging**; git tag `v*.*.*` → **production** promote. §3.6. |
| C11 | 🟡 | **Role `"public"` as a custom claim** (`04`). Unauthed users carry no token/claims. | Roles are **`customer` / `editor` / `admin`**; "public" = absence of auth (no claim). |
| C12 | 🟡 | **Hero copy differs.** `03` "Architect of Cultural Moments" vs `04` `heroHeadline` "Movement Is the Message". | Both are placeholders. Final copy lives in **`siteSettings/homepage`** and is a content decision; pick during content freeze. |
| C13 | 🟡 | **Video strategy spread across docs** (Storage hero reel / YouTube portfolio / Mux masterclasses). | Intentional and kept — stated explicitly in §3.4 so it's not mistaken for a conflict. |

---

## 2. Canonical decisions (the single source of truth)

| Topic | Decision |
|---|---|
| Framework | Next.js 15 App Router, React 19, TypeScript strict |
| Styling | **Tailwind v3.4** + `@tailwindcss/typography`; tokens from `03` |
| Tokens | `tp-*` names canonical, exposed as CSS vars, semantic aliases layered on |
| Animation | Framer Motion 11; `useReducedMotion` everywhere |
| Data (server) | `firebase-admin` in RSC / Server Actions |
| Data (client) | client SDK for Auth + realtime only; TanStack Query where needed |
| Forms | Server Actions + zod, server-side reCAPTCHA Enterprise verify |
| Email | Firebase Trigger Email extension → SendGrid |
| Payments | Stripe Checkout (Google Pay auto-enabled) via callable `createCheckoutSession` + `stripeWebhook` |
| Masterclass video | **Mux** signed playback via `getMuxPlaybackToken` |
| Portfolio video | YouTube embeds |
| Hero reel | Cloud Storage (webm+mp4), lazy-loaded, poster frame |
| CMS | Firestore + custom `/admin` (Tiptap → Markdown in `blogPosts.bodyMdx`) |
| Hosting | Firebase App Hosting (SSR on Cloud Run) |
| Auth roles | `customer` / `editor` / `admin` (+ unauthenticated) |
| Visual editor | **Puck** (block-based, Wix/Duda-style); page layouts as JSON in Firestore `pages` (doc 06) |

---

## 3. Canonical reference appendix

### 3.1 Firestore collections (authoritative names)
`blogPosts` · `products` (+ `/variants`) · `orders` · `carts` · `customers` (+ `/addresses`) ·
`team` · `partners` · `productions` · `masterclasses` (+ `/lessons`) · `enrollments` ·
`bookings` · `newsletterSubscribers` · `siteSettings` · `masterclassSeries` ·
`pages` (+ `/revisions`, visual page builder — doc 06) · `mail` (Trigger Email).

> `02`'s query functions in `src/lib/queries/*` must use these exact names. The `02`
> example previously read `posts` — corrected to `blogPosts`.

### 3.2 Token integration (merged Tailwind config)
```ts
// tailwind.config.ts  (Tailwind v3.4)
import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: { xs: '375px', sm:'640px', md:'768px', lg:'1024px', xl:'1280px', '2xl':'1536px', '3xl':'1920px' },
    extend: {
      colors: {
        // canonical tp-* (from doc 03), sourced from CSS vars in globals.css
        'tp-black':'var(--tp-black)', 'tp-surface':'var(--tp-surface)', 'tp-elevated':'var(--tp-elevated)',
        'tp-subtle':'var(--tp-subtle)', 'tp-gold':'var(--tp-gold)', 'tp-gold-lt':'var(--tp-gold-lt)',
        'tp-gold-dk':'var(--tp-gold-dk)', 'tp-jade':'var(--tp-jade)', 'tp-white':'var(--tp-white)',
        'tp-gray':'var(--tp-gray)', 'tp-muted':'var(--tp-muted)', 'tp-border':'var(--tp-border)',
        // semantic aliases (so doc 02's intent also resolves)
        primary:'var(--tp-gold)', surface:'var(--tp-surface)',
        text: { primary:'var(--tp-white)', secondary:'var(--tp-gray)', inverse:'var(--tp-black)' },
      },
      fontFamily: {
        display:['"Cormorant Garamond"','Georgia','serif'],
        body:['"DM Sans"','system-ui','sans-serif'],
        mono:['"DM Mono"','monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
```
`globals.css` holds the hex source of truth (`:root { --tp-gold:#C8A96E; … }`) — the
only place hex values live.

### 3.3 API surface (canonical)
| Mechanism | Name | Purpose |
|---|---|---|
| Server Action | `submitContact` | reCAPTCHA verify → `bookings`(source=contact) + `mail` |
| Server Action | `submitBooking` | reCAPTCHA verify → `bookings`(source=booking) + `mail` |
| Server Action | `subscribeNewsletter` | reCAPTCHA verify → `newsletterSubscribers` upsert |
| Server Action | `createSessionCookie` | exchange ID token → `__session` cookie |
| Route Handler | `POST /api/webhooks/stripe` | Stripe events (raw body) |
| Route Handler | `POST /api/revalidate` | on-demand ISR (secret) |
| Callable Fn | `createCheckoutSession`, `stripeWebhook`, `getMuxPlaybackToken`, `getAvailability` | see `04` §Seams |

### 3.4 Video strategy (three lanes, by design)
- **Hero reel** → Cloud Storage (`.webm`+`.mp4`), poster frame, Intersection-Observer lazy load, image fallback on mobile/`saveData`.
- **Portfolio clips** (`productions.videoUrl`) → YouTube embeds (`i.ytimg.com`/`img.youtube.com` thumbnails).
- **Gated masterclasses** → **Mux** adaptive HLS with short-lived signed JWT from `getMuxPlaybackToken`.

### 3.5 `next/image` remote patterns
`firebasestorage.googleapis.com` · `image.mux.com` · `i.ytimg.com` · `img.youtube.com`.

### 3.6 Environments & deploy
| Trigger | Target |
|---|---|
| Pull request | App Hosting **preview** channel (`pr-<n>`) |
| Merge → `main` | **staging** (`travispayne-staging`) |
| Tag `v*.*.*` | **production** (`travispayne-prod`) promote |
Local dev = Firebase Emulator Suite. Three Firebase projects: `-dev` / `-staging` / `-prod`.

---

## 4. Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| Duda has no structured export | Manual content re-entry | Build `/admin` early (Phase 2 partially in Phase 1); assign a content editor |
| Mux is the main variable cost & only non-Google core dep | Cost / vendor | Price memberships to cover Mux; YouTube-unlisted as fallback (D3) |
| SEO loss at DNS cutover | Traffic drop | 301s in middleware **before** cutover; submit sitemap to Search Console; keep Duda 14 days |
| Secrets in client bundle | Security | Only `NEXT_PUBLIC_*` client-side; all secrets in Secret Manager |
| reCAPTCHA/App Check misconfig blocks forms | Lost leads | Stage with enforcement off; enable after verifying scores |
| Tailwind v4 churn if adopted now | Rework | Pin v3.4 for V1 (C9) |
| Firestore rules query-in-rules for enrollment | Perf/cost | Composite `{uid}_{classId}` ID + `exists()` (C6) |

## 5. Critical path / build order
`globals.css` tokens + `tailwind.config.ts` (C2) → UI atoms (Button, type) → layout
(Header/Footer/nav) → `firebase/admin` + `firebase/client` singletons → typed
`queries/*` (C1 names) → marketing pages (Phase 1) → `/admin` shell + auth → blog
(Phase 2) → store + Stripe (Phase 3) → masterclasses/Mux + enrollments (Phase 4).
Tokens and the Firebase singletons are the two upstream dependencies almost
everything else needs — do them first in Phase 0.

## 6. Phase 0 — Definition of Done
- [ ] Next.js 15 + TS strict + Tailwind v3.4 app boots; `@tailwindcss/typography` on
- [ ] `globals.css` token vars + merged `tailwind.config.ts` (C2) committed
- [ ] `firebase/admin.ts` + `firebase/client.ts` singletons; `.env.example` matches §3 + `04` seams
- [ ] `middleware.ts`: legacy 301s (C5 targets) + `/admin` guard
- [ ] Header/Footer/root layout render with tokens; fonts via `next/font`
- [ ] CI (lint+type+test+build) green on PR; App Hosting preview deploy works
- [ ] Three Firebase projects created; Secret Manager wired in `apphosting.yaml`

---

## 7. Open decisions for the client (with recommendation)
| # | Decision | Recommendation |
|---|---|---|
| D1 | Next.js (SSR) vs plain React SPA | **Next.js** — SEO for blog/store |
| D2 | Tailwind v3.4 vs v4 | **v3.4** for V1 |
| D3 | Masterclass video host: Mux vs unlisted YouTube vs Storage | **Mux** (best UX); YouTube if budget-first |
| D4 | Email SMTP provider behind Trigger Email | **SendGrid** (Resend acceptable) |
| D5 | Membership/subscription for masterclasses | **Yes, fast-follow** — recurring revenue |
| D6 | Repo base branch / PR (repo was empty) | ✅ Done — `main` initialized, draft PR #1 open |
| D7 | Visual editor: block-based vs pixel-freeform | **Block-based via Puck** — protects the design, no SaaS cost (see `06`) |

*Prepared as the orchestration/reconciliation layer over docs 02–04.*
