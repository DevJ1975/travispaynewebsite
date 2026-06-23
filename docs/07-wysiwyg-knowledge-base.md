# 07 — WYSIWYG Website-Builder Knowledge Base

> Compiled June 2026 from web research (Wix, Squarespace, Webflow help centers + expert
> sources) plus product knowledge of Duda, Framer, WordPress/Elementor, GoDaddy, Carrd, and
> Google Sites. Original synthesis — no vendor copy reproduced; verify version-specific
> details against current vendor docs. This doc informs our own builder (`/studio`).

## 1. What we already have (and the gaps)
**Shipped — freeform builder (`/studio`):** drag-anywhere canvas (select/drag/8-way resize/
layer/rotate-by-number), elements (heading, text, button, image, box, divider), **per-device
layouts** (desktop/tablet/mobile edited separately), **total-freedom styling** (any color/
font/size via inspector + color pickers), **undo/redo** (zundo), **autosave**, **preview**,
**localStorage + cloud draft sync**, **publish** to Firestore, and **public SSR rendering**
via the catch-all `[...slug]` (Firestore REST → per-device responsive CSS). Auth via Firebase
client sign-in + editor allowlist.

**Also present (now superseded):** an earlier **block-based** builder (Puck) at `/admin/pages`
— retained but no longer the public render path; slated for removal.

**Gaps vs. mature builders:** snapping/alignment guides, drag-to-rotate handle, multi-select,
a media/asset **upload library** (today images are by URL), templates/starter gallery,
synced reusable sections (global header/footer components), in-canvas image crop, scheduled
publish, version-history **restore UI**, richer elements (gallery/lightbox, video embed, form
builder, tabs/accordion, map), and animations/scroll interactions.

## 2. The three editor models (where ours sits)
| Model | Exemplar | How layout works | Trade-off |
|---|---|---|---|
| **Freeform / absolute** | **Wix (Classic Editor)**, Carrd | Elements pinned at x/y; nothing reflows | Max freedom; mobile needs a separate hand-tuned layout |
| **Grid canvas** | **Squarespace Fluid Engine** (24-col), Duda | Drag onto a snapping grid; blocks can overlap | Freeform feel with guardrails; still grid-bound |
| **Real box model** | **Webflow**, Framer, Editor X/Wix Studio | True HTML/CSS (flex/grid, breakpoints) | Most powerful + responsive; steep learning curve |

**Ours = freeform/absolute with per-device layouts** (closest to Wix Classic), chosen for
maximum owner freedom. We mitigate the model's classic weaknesses (mobile desync, data loss)
with **autosave + cloud sync** and **per-device editing built in from day one**.

## 3. Core feature catalog
| Feature | What it is | Strong examples |
|---|---|---|
| Drag-and-drop placement | Move elements freely / onto a grid | Wix, Squarespace, Webflow |
| Snapping & alignment guides | Smart lines while dragging | Wix, Webflow, Framer |
| Inline text editing | Type directly on the canvas | All |
| Inspector/property panel | Per-element settings sidebar | Webflow, Wix Studio, Framer |
| Add-section / element panel | Library of elements & prebuilt sections | All |
| Templates & themes | Designed starting points | Squarespace, Wix, Webflow |
| Global style tokens | Site-wide colors/fonts (change once) | Squarespace Site Styles, Webflow Variables, Wix Themes |
| Media/asset library + upload | Store/upload images & video, stock | Wix (Media Manager + Unsplash), Squarespace (Unsplash/Getty) |
| Image crop/edit | In-editor crop/adjust | Wix Photo Studio, Squarespace |
| Page manager | Create/duplicate/delete/reorder/home | All |
| Navigation/menu builder | Build the site menu, dropdowns | All |
| Header/footer/global regions | Edit once, applies site-wide | All (Webflow/Wix linked components) |
| Responsive / per-device | Separate or cascading device layouts | Wix (separate mobile), Webflow/Studio (breakpoint cascade) |
| Undo/redo | Step back/forward | All |
| Autosave | Saves without a button | Wix, Webflow (Squarespace lacks it) |
| Draft vs publish + preview | Stage then go live | All |
| Version history / restore | Roll back to a past version | Wix, Webflow (Squarespace lacks it) |
| Per-page SEO | Title/description/OG/slug/noindex | All |
| Forms / blog / store | Built-in modules | Wix, Squarespace, Webflow |
| Reusable blocks / components | Save & reuse; linked = global edits | Webflow (Components), Wix Studio (Global Sections) |
| Custom code embed | Inject HTML/CSS/JS (often tier-gated) | All (paid tiers) |
| Animations / interactions | Entrance/scroll/hover effects | Webflow (best), Wix, Squarespace (presets) |

## 4. Onboarding & UX patterns for non-technical users
- **Start from something**, not a blank page: templates and AI first-run wizards
  (Squarespace **Blueprint AI**, Wix **AI/Vibe/Harmony**, Webflow **AI Site Builder**).
- **"You can't break it":** autosave, generous undo, and **version restore** reduce fear.
- **Curated choices over raw inputs:** presets (colors/fonts/spacing) keep output tidy.
- **Direct manipulation:** click-to-edit, drag handles, contextual panels; minimal jargon.
- **Clear publish flow:** obvious draft→preview→publish with a visible live URL.
- **Empty states & inline tips** guide the first actions.

## 5. Best practices we should bake in
- **Version safety:** autosave + revisions + restore (Squarespace's #1 complaint is *no*
  autosave/history → lost work). *We have autosave; add restore UI next.*
- **Accessibility:** prompt for **alt text**, keep heading order sane, check contrast, ensure
  keyboard focus. Builders ship inaccessible sites easily — nudge the owner.
- **Performance:** optimize/resize images, lazy-load, avoid script bloat (Core Web Vitals).
- **Mobile-first reality:** most traffic is mobile — make device editing easy and obvious.
- **SEO:** per-page title/description/OG, sitemap, clean slugs.
- **Brand protection (optional):** offer token presets even within "total freedom."

## 6. Block-based vs. freeform — and our decision
- **Block/section** (Squarespace, our old Puck): hard to make ugly, fastest for non-designers,
  protects a bespoke design — but less freedom.
- **Freeform/absolute** (Wix Classic, **ours**): total creative control; the owner can place
  anything anywhere — at the cost of needing to mind mobile layouts and visual consistency.
- **Decision (owner's call, doc 05 D7 reversed):** **freeform with total freedom**, with
  per-device editing built in and optional brand presets to help stay on-brand.

## 7. Capability matrix (✓ full · ◐ partial · — none)
| Feature | Wix | Squarespace | Webflow | Duda | Framer | **Ours (/studio)** |
|---|---|---|---|---|---|---|
| Freeform placement | ✓ | ◐ (grid) | ◐ (box) | ◐ | ✓ | **✓** |
| Per-device layouts | ✓ | ✓ | ✓ | ✓ | ✓ | **✓** |
| Snapping guides | ✓ | ◐ | ✓ | ✓ | ✓ | **— (next)** |
| Undo/redo | ✓ | ◐ | ✓ | ✓ | ✓ | **✓** |
| Autosave | ✓ | — | ✓ | ✓ | ✓ | **✓** |
| Version restore | ✓ | — | ✓ | ✓ | ✓ | **◐ (revisions; UI next)** |
| Global styles/tokens | ✓ | ✓ | ✓ | ✓ | ✓ | **◐ (presets)** |
| Media upload library | ✓ | ✓ | ✓ | ✓ | ✓ | **— (URL only; next)** |
| Templates gallery | ✓ | ✓ | ✓ | ✓ | ✓ | **— (next)** |
| Reusable/global components | ◐/✓(Studio) | ◐ (copies) | ✓ | ✓ | ✓ | **— (next)** |
| Per-page SEO | ✓ | ✓ | ✓ | ✓ | ✓ | **◐ (title; expand)** |
| Animations/interactions | ✓ | ◐ | ✓ | ◐ | ✓ | **— (next)** |
| Publish to live URL | ✓ | ✓ | ✓ | ✓ | ✓ | **✓** |
| Self-hosted / no SaaS fee | — | — | — | — | — | **✓ (Firebase)** |

## 8. Pitfalls to avoid
- **No autosave/history** → lost work (Squarespace). *Avoided.*
- **Desktop↔mobile desync** (Wix) → broken phone layouts. *Mitigated by first-class per-device editing; add a "copy desktop→mobile" helper.*
- **Freeform chaos** → misaligned, off-brand pages. *Add snapping + optional presets.*
- **Template/vendor lock-in.** *Avoided — data is plain JSON in your Firebase.*
- **Accessibility regressions** from absolute layouts. *Nudge alt text / contrast; keep DOM order sane.*

## 9. Mapping to our stack (Next.js 15 + Firebase)
| Capability | Status | Notes |
|---|---|---|
| Freeform canvas, per-device, undo/redo | **Built** | `src/lib/builder/*`, `src/components/builder/*` |
| Cloud persistence + publish | **Built** | client SDK → `studioPages`/`publishedPages` |
| Public SSR render | **Built** | Firestore REST → `SiteRenderer` (no service account needed) |
| Snapping/guides + drag-rotate + multi-select | **Next** | add `react-moveable` + `selecto` (already planned) |
| Media library (upload) | **Next** | Cloud Storage + Resize Images extension; custom picker |
| Templates & reusable sections | **Next** | seed templates; "save section" → reuse |
| Version-history restore UI | **Next** | revisions exist; add a restore panel |
| Animations/interactions | **Later** | Framer Motion presets per element |
| AI "describe-to-build" | **Optional** | Claude prompt → starter layout JSON |

## 10. Recommended V1 feature set (MoSCoW)
- **Must (done):** freeform canvas, per-device, style freedom, undo/redo, autosave, publish, public render.
- **Should (next):** snapping guides, drag-rotate, media upload library, alt-text/SEO prompts, version-restore UI.
- **Could:** templates gallery, reusable/global sections, animations, scheduled publish, multi-select.
- **Won't (now):** real-time multiplayer editing, full CSS box-model editor, app marketplace.

## 11. Glossary (for the owner manual)
**Element** (an item you place) · **Canvas** (the page area) · **Inspector** (settings panel) ·
**Slug** (the page's URL piece) · **Draft / Published** (working copy vs. live) ·
**Breakpoint / device** (Desktop/Tablet/Mobile) · **Token/preset** (a saved brand color/font) ·
**Component / section** (a reusable block).

---
*Sources: official help centers (Wix, Squarespace, Webflow) + expert write-ups, June 2026.
Some help pages block automated fetching; specifics were drawn from search summaries and
corroborating third-party sources and are paraphrased in original wording.*
