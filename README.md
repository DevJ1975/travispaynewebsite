# Travis Payne — Website Rebuild

Rebuild of **travispayne.com** (currently on Duda) as a modern **React / Next.js**
site backed by a **Google (Firebase / Google Cloud)** backend — with a cinematic
design refresh, a real blog, a store, gated masterclasses, and booking.

> **Status:** Planning. This repo currently contains the rebuild **plan** produced
> by three specialist agents. No application code has been scaffolded yet — Phase 0
> begins after the plan is approved.

## 📋 The plan (`docs/`)
| Doc | Contents |
|---|---|
| [`docs/00-overview-and-roadmap.md`](docs/00-overview-and-roadmap.md) | Master plan, architecture diagram, phased roadmap, decisions |
| [`docs/01-site-audit.md`](docs/01-site-audit.md) | Audit of the current Duda site: sitemap, bio facts, assets to gather |
| [`docs/02-frontend-architecture.md`](docs/02-frontend-architecture.md) | React/Next.js stack, structure, routing, migration (Web Developer agent) |
| [`docs/03-uiux-design-system.md`](docs/03-uiux-design-system.md) | Brand, design tokens, motion, wireframes (UI/UX agent) |
| [`docs/04-backend-google-cloud.md`](docs/04-backend-google-cloud.md) | Firebase/GCP, data models, store, blog, auth, cost (Back-End agent) |
| [`docs/05-plan-review-and-decisions.md`](docs/05-plan-review-and-decisions.md) | **Lead reconciliation** — cross-doc conflicts resolved, canonical decisions (authoritative) |

## 🤖 Specialist agents (`.claude/agents/`)
Reusable Claude Code subagents created for this project:
- **web-developer** — front-end architecture & build
- **ui-ux-designer** — brand & design system
- **backend-engineer** — Google Cloud / Firebase backend

Invoke one with, e.g., *"Use the web-developer agent to scaffold Phase 0."*

## 🛠️ Intended stack
**Front end:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion
**Backend:** Firebase Auth · Cloud Firestore · Cloud Storage · Cloud Functions ·
Firebase App Hosting · GA4 — with **Stripe + Google Pay** for payments.

## Next step
Review `docs/00-overview-and-roadmap.md`, confirm the open decisions, then begin
**Phase 0 — Foundations**.
