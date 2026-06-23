# Travis Payne Website — Rebuild Plan & Roadmap

**Goal:** Recreate **travispayne.com** (currently a Duda no-code site) as a modern,
fast, premium **React** application backed by a **Google (Firebase / Google Cloud)**
backend — and make it materially better: cinematic design, a real blog, a real
store, gated masterclasses, booking, and an admin/CMS.

This plan was produced by a **team of three specialist agents** (their definitions
live in `.claude/agents/` so they can be re-invoked throughout the build):

| Agent | File | Owns | Output doc |
|---|---|---|---|
| 🧑‍💻 Web Developer | `.claude/agents/web-developer.md` | React/Next.js architecture, build, migration | `02-frontend-architecture.md` |
| 🎨 UI/UX Designer | `.claude/agents/ui-ux-designer.md` | Brand, design system, motion, wireframes | `03-uiux-design-system.md` |
| 🛠️ Back-End Engineer | `.claude/agents/backend-engineer.md` | Firebase/GCP, data models, store, blog, auth | `04-backend-google-cloud.md` |

Read order: **01** (what exists) → **03** (how it should look) → **04** (the data &
services) → **02** (how it's built) → **05** (lead review — conflicts resolved &
canonical decisions, **authoritative** where docs disagree) → **06** (Wix/Duda-style
visual page builder) → back here for the **roadmap**.

> **`docs/05-plan-review-and-decisions.md`** is the orchestration layer over the three
> specialist docs: it reconciles the seams between them (token names, collection names,
> email provider, API surface, deploy model) and records the canonical decisions.

---

## 1. Target architecture at a glance

```
                ┌─────────────────────────────────────────────┐
   Visitors ──► │  Next.js 15 (App Router, TS, Tailwind, FM)    │
                │  SSR/SSG on Firebase App Hosting + Cloud CDN  │
                └───────────────┬──────────────┬───────────────┘
                                │ client SDK   │ server (admin SDK / Server Actions)
                                ▼              ▼
            ┌───────────────────────────────────────────────────────┐
            │  GOOGLE BACKEND (Firebase + Google Cloud)              │
            │  • Firebase Auth (email + Google; role claims)         │
            │  • Cloud Firestore (content, store, users, bookings)   │
            │  • Cloud Storage (images, video, downloads)            │
            │  • Cloud Functions (payments, email, webhooks, admin)  │
            │  • GA4 + Tag Manager • Secret Manager • Scheduler      │
            └───────────────┬───────────────────────┬───────────────┘
                            │ payments (no native    │ video streaming
                            ▼ Google option)         ▼ (gated masterclasses)
                    Stripe + Google Pay        Mux / YouTube-unlisted / Storage
```

**Why React → Next.js:** the site is a marketing + **blog** + **store** property
where SEO, social previews, and fast first paint matter. Next.js (App Router) gives
SSR/SSG/ISR, image optimization, and a route-based structure, and deploys on
**Firebase App Hosting** so the whole stack stays "all-Google." Full rationale in `02`.

---

## 2. Information architecture (new site)

`/` Home · `/about` · `/team` · `/partners` · `/productions` (+ `/[slug]`) ·
`/store` (+ `/[product]`, `/cart`, `/checkout`) · `/blog` (+ `/[slug]`) ·
`/masterclasses` (+ `/[slug]`) · `/contact` · `/book` · `/admin` (gated).
Plus 301 redirects from all legacy Duda URLs (see `01` + `02`).

---

## 3. The Google backend — what it supports (summary)

Detailed schemas, security rules, and cost in `04-backend-google-cloud.md`.

- **Blog** — Firestore `blogPosts` + Cloud Storage media; authored in a custom
  `/admin` panel; SSG/ISR rendered for SEO.
- **Store** — Firestore `products`/`orders`/`carts`; **Stripe** (via Cloud
  Functions) for payments with **Google Pay** as a wallet; inventory, digital &
  physical goods, order emails.
- **Auth & roles** — Firebase Auth (email + Google sign-in), custom claims for
  `customer` / `editor` / `admin`.
- **Media** — Cloud Storage with the image-resize extension; video via Mux or
  unlisted YouTube for adaptive streaming.
- **Email** — Firebase "Trigger Email" extension (SendGrid/SMTP) for order
  confirmations, contact replies, newsletter.
- **Analytics/SEO** — GA4 + Google Tag Manager, sitemap/robots, structured data.
- **Visual page builder** — the owner edits marketing pages like Wix/Duda via a
  block-based editor (Puck); page layouts are stored as JSON in Firestore `pages`
  with draft/publish + version history. See `06-visual-editor-cms.md`.

### Things you haven't thought of (high-value adds)
1. **Gated online Masterclasses (mini-LMS)** — Travis & Stacy's existing offering,
   sold as one-off purchases or a **membership/subscription**, with entitlement
   checks and signed video URLs. (Likely the biggest revenue lever.)
2. **Booking & availability** — `/book` form + **Google Calendar API** integration
   so inquiries map to real availability; routes to UTA/management.
3. **Email automation & newsletter** — capture + drip (welcome, launches, tour news).
4. **Press / EPK kit** — downloadable bios, headshots, logos, fact sheet for media.
5. **Memberships / fan club** — premium content, early ticket/merch access.
6. **Gift cards & discount codes** for the store and masterclasses.
7. **Multi-language (i18n)** — international fan base; start with copy structure ready.
8. **Admin analytics dashboard** — sales, enrollments, traffic in one `/admin` view.
9. **Accessibility & performance as a feature** — WCAG 2.2 AA, Core Web Vitals ≥95.
10. **Affiliate / brand-deal landing pages** (e.g., the existing HIRAS campaign).

---

## 4. Phased roadmap

| Phase | Scope | Key outputs | Rough effort |
|---|---|---|---|
| **0 — Foundations** | Repo scaffold, Next.js + TS + Tailwind, design tokens, Firebase projects (dev/staging/prod), CI/CD | Running skeleton, deploy pipeline | 3–5 days |
| **1 — Marketing site** | Home, About, Team, Partners, Productions (index + detail), Contact | Content-complete public site, redirects, SEO | 1.5–2.5 wks |
| **2 — Blog + CMS** | `blogPosts` model, `/admin` editor, blog index/post, RSS/sitemap | Self-serve publishing | 1–1.5 wks |
| **2.5 — Visual Page Builder** | Puck block editor, `pages` collection (draft/publish + revisions), `/admin/pages`, `[[...slug]]` render route, media picker, nav editor | Owner edits & publishes marketing pages with no code (Wix/Duda-style) | ~2–2.5 wks (~12 dev-days) |
| **3 — Store** | Products/cart/checkout, Stripe + Google Pay, order emails, admin orders | Working e-commerce | 2–3 wks |
| **4 — Masterclasses + Booking** | Gated video, enrollments/entitlements, `/book` + Calendar, newsletter | Revenue features | 2–3 wks |
| **5 — Polish & launch** | A11y/perf pass, analytics, content freeze, DNS cutover, monitoring | Production launch | 1 wk |

> Phases 1–2 can launch first (replace Duda quickly), with store/masterclasses
> following — de-risking the cutover.

---

## 5. Decisions to confirm with the client
1. **Framework:** Next.js (recommended) vs. a Vite SPA. _(See `02` for tradeoffs.)_
2. **CMS:** custom Firestore `/admin` (recommended) vs. Google Sheets vs. headless.
3. **Payments:** Stripe + Google Pay (recommended; Google has no native checkout).
4. **Masterclass video host:** Mux (best UX) vs. unlisted YouTube (free) vs. Storage.
5. **Brand direction:** confirm the dark cinematic editorial direction in `03`.
6. **Domain/DNS** access for cutover, and who owns the Duda content export.

See each specialist doc for the buildable detail. Next step after sign-off: **Phase 0**.
