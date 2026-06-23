# Travis Payne — Website Rebuild

Rebuild of **travispayne.com** (currently on Duda) as a modern **React / Next.js**
site backed by a **Google (Firebase / Google Cloud)** backend — with a cinematic
design refresh, a real blog, a store, gated masterclasses, and booking.

> **Status:** **Phase 1 (Marketing pages) — complete.** Phases 0–1 are built and the
> full verification gate (lint · typecheck · test · build) is green: the public
> marketing site (Home, About, Productions + detail, Team, Partners, Contact, Book)
> renders on the design system with motion and working form Server Actions. The
> rebuild **plan** lives in `docs/`; see [`docs/05`](docs/05-plan-review-and-decisions.md) §6 for remaining infra items.

## 📋 The plan (`docs/`)
| Doc | Contents |
|---|---|
| [`docs/00-overview-and-roadmap.md`](docs/00-overview-and-roadmap.md) | Master plan, architecture diagram, phased roadmap, decisions |
| [`docs/01-site-audit.md`](docs/01-site-audit.md) | Audit of the current Duda site: sitemap, bio facts, assets to gather |
| [`docs/02-frontend-architecture.md`](docs/02-frontend-architecture.md) | React/Next.js stack, structure, routing, migration (Web Developer agent) |
| [`docs/03-uiux-design-system.md`](docs/03-uiux-design-system.md) | Brand, design tokens, motion, wireframes (UI/UX agent) |
| [`docs/04-backend-google-cloud.md`](docs/04-backend-google-cloud.md) | Firebase/GCP, data models, store, blog, auth, cost (Back-End agent) |
| [`docs/05-plan-review-and-decisions.md`](docs/05-plan-review-and-decisions.md) | **Lead reconciliation** — cross-doc conflicts resolved, canonical decisions (authoritative) |
| [`docs/06-visual-editor-cms.md`](docs/06-visual-editor-cms.md) | **Wix/Duda-style visual page builder** — block-based editor (Puck), `pages` model, publish workflow |

## 🤖 Specialist agents (`.claude/agents/`)
Reusable Claude Code subagents created for this project:
- **web-developer** — front-end architecture & build
- **ui-ux-designer** — brand & design system
- **backend-engineer** — Google Cloud / Firebase backend

Invoke one with, e.g., *"Use the web-developer agent to scaffold Phase 0."*

## 🛠️ Stack
**Front end:** Next.js 15 (App Router, React 19) · TypeScript (strict) · Tailwind v3.4 · Framer Motion
**Backend:** Firebase Auth · Cloud Firestore · Cloud Storage · Cloud Functions ·
Firebase App Hosting · GA4 — with **Stripe + Google Pay** for payments.

## 🚀 Local development
```bash
npm install            # install dependencies
cp .env.example .env.local   # then fill in your Firebase project values
npm run dev            # start the dev server at http://localhost:3000
```
Other scripts:
```bash
npm run lint           # ESLint (next/core-web-vitals)
npm run typecheck      # tsc --noEmit (strict)
npm run test           # Vitest unit tests
npm run build          # production build
npm run format         # Prettier
```
CI runs lint → typecheck → test → build on every PR (`.github/workflows/ci.yml`).

### Project layout (Phase 0)
```
src/
  app/            # App Router — root layout, home page, globals.css (design tokens)
  components/
    layout/       # SiteNav, SiteFooter
    ui/           # Button atom
  lib/
    firebase/     # client + admin SDK singletons
    utils/        # cn() class merge helper
  middleware.ts   # legacy 301 redirects + /admin auth guard
tailwind.config.ts # tp-* tokens, type scale, fonts via CSS vars
apphosting.yaml    # Firebase App Hosting + Secret Manager wiring
firebase.json      # Firestore/Storage rules + emulators
```

## Next step
Continue with **Phase 2 — Blog + CMS** (the `blogPosts` model, the `/admin` editor,
and the blog index/post pages) per `docs/00-overview-and-roadmap.md`, or stand up the
three Firebase projects to enable App Hosting preview deploys and live form/data
persistence.
