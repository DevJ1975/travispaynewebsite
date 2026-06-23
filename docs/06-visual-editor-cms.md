# 06 — Visual Page Builder (CMS for Non-Technical Editors)

> **Status:** Canonical spec. Aligns with and extends docs 02–05. Where this doc conflicts with `05`, `05` wins on stack/token decisions; this doc wins on page-builder specifics.
>
> **Audience:** Web developer implementing the editor, editor/admin users of the resulting tool, and the Back-End agent (new Firestore collection + rules required).

---

## Table of Contents

1. [Approach Decision: Block-Based vs. Freeform Canvas](#1-approach-decision-block-based-vs-freeform-canvas)
2. [Editor Library Evaluation](#2-editor-library-evaluation)
3. [Block Library: Design-System Sections as Puck Blocks](#3-block-library-design-system-sections-as-puck-blocks)
4. [Firestore Data Model](#4-firestore-data-model)
5. [Rendering Integration: The Catch-All Route](#5-rendering-integration-the-catch-all-route)
6. [Editing UX and Workflow](#6-editing-ux-and-workflow)
7. [Design Guardrails: Token-Based Field Constraints](#7-design-guardrails-token-based-field-constraints)
8. [Firestore Security Rules](#8-firestore-security-rules)
9. [Roadmap Impact: Phase 2.5 — Visual Page Builder](#9-roadmap-impact-phase-25--visual-page-builder)
10. [Cost and Dependency Notes](#10-cost-and-dependency-notes)
11. [Integration Seams Summary](#11-integration-seams-summary)

---

## 1. Approach Decision: Block-Based vs. Freeform Canvas

### Recommendation: Block/Section-Based Visual Editor

This site uses a **block-based (section-based) editor model** — the same architecture that powers Wix, Squarespace, and Duda under the hood. The owner selects from a curated library of pre-built sections (Hero, Marquee, Stats, etc.), reorders them via drag-and-drop, and edits content (text, images, toggles) in a side-panel. They do not move individual elements freely around a canvas.

This is the right choice for Travis Payne for three reasons:

1. **Design protection.** The bespoke `tp-*` token system, Cormorant Garamond/DM Sans type hierarchy, cinematic spacing, and Framer Motion animations are encoded in the React components. An editor can choose which sections appear and what content fills them, but cannot override padding to 3px or set the headline color to bright green. The brand stays on-brand automatically.
2. **Reduced cognitive load.** A drag-and-drop section palette is immediately learnable. A pixel-freeform canvas requires design training to use well.
3. **Developer maintainability.** New sections are added by registering a typed block in one config file. The component code is the same code that renders the public site — no parallel template system.

### Freeform Canvas Tradeoff

A true freeform canvas (Framer Sites, Webflow, early Wix) lets editors position any element at any pixel coordinate. This gives maximum design freedom but makes it trivially easy to produce ugly, off-brand, inaccessible output. It also requires a separate rendering engine divorced from the existing React component tree. Given that the existing design system is already built and premium, protecting it outweighs the marginal flexibility gain.

**Decision: block-based, with Puck as the implementation library. Do not implement freeform canvas.**

---

## 2. Editor Library Evaluation

| Library | Model | License / Cost | React-native | Firestore fit | Verdict |
|---|---|---|---|---|---|
| **Puck (`@measured/puck`)** | Block-based, self-hosted, you register your own React components; drag-drop, side-panel field editors, undo/redo, plugin API | MIT, free, no SaaS | Yes — Puck renders your existing React components directly | Excellent — save/load arbitrary JSON; integrates with any data layer | **RECOMMENDED** |
| **Builder.io** | Block-based + freeform hybrid; managed SaaS visual editor with React SDK (`@builder.io/react`) | Free tier limited; paid plans start ~$19/mo, scale to $299+/mo for team features; data stored on Builder's CDN | Yes — renders React components registered in Builder's SDK | Possible but awkward — content lives in Builder's cloud, not Firestore; Firebase becomes secondary | Suitable if SaaS overhead is acceptable and a managed CDN is preferred; adds external dependency and monthly cost |
| **Plasmic** | Drag-and-drop page builder; React code-gen or component slots; managed SaaS | Free tier; Team plan $49/mo+; Enterprise custom | Yes — Plasmic Studio + React SDK; can integrate custom components | Content on Plasmic's servers; Firestore is data source for dynamic content only | More powerful freeform design than Puck; good choice if editorial art direction is frequently changing and a designer runs the editor; adds SaaS dependency |
| **TinaCMS** | Git-backed content editing; inline editing on page; fields in sidebar; Markdown/MDX or JSON | Open-source; Tina Cloud (hosted backend) free to limited, $29/mo+; or self-host | Yes | Content stored in Git, not Firestore — two data layers to maintain; conflicts with existing Firestore architecture | Rejected for marketing pages. Already partially in use for blog (Tiptap → `bodyMdx` in `blogPosts`); keep it there. Do not extend to page builder. |
| **GrapesJS** | Raw HTML/CSS drag-drop canvas; outputs HTML string | MIT, free | No — outputs raw HTML, not React; breaks component abstractions and design tokens entirely | No path to typed Firestore JSON without custom serializer | **Rejected.** Produces raw HTML that bypasses the design system. Breaking change to the entire architecture. |

### When to pick a SaaS alternative instead of Puck

Choose **Builder.io** if: the client's team includes a dedicated marketing/design professional who needs genuine freeform layout control, the site is expected to have 50+ marketing pages with highly varied layouts, and the $99–$299/mo cost is acceptable versus the developer time to maintain a self-hosted solution.

Choose **Plasmic** if: the same conditions as Builder.io apply and the team wants a more sophisticated visual design workflow (Plasmic's editor is closer to Figma than Puck's is).

For Travis Payne's use case — a small team managing a handful of marketing pages on top of an already-premium bespoke design — **Puck is the correct choice**. No SaaS cost. No external content CDN. All data stays in Firebase. The React components are identical between the editor and the public site.

---

## 3. Block Library: Design-System Sections as Puck Blocks

### Mapping Existing Components to Blocks

Every existing section component from `doc 03` becomes a Puck block. Editors see block names in a palette; selecting one inserts the component with default prop values that can then be edited.

| Block Name (Puck palette) | Maps to component | Editable fields |
|---|---|---|
| `Hero` | `HeroSection` | headline, subheadline, ctaLabel, ctaHref, backgroundVariant, showReel (bool) |
| `LegacyMarquee` | `LegacyMarquee` | collaboratorNames (array of strings), speed (preset: slow/normal/fast) |
| `AboutTeaser` | `AboutTeaser` | heading, body (rich text), imageUrl, imageAlt, ctaLabel, ctaHref, layout (image-left/image-right) |
| `FeaturedProductions` | `FeaturedProductions` | heading, productionIds (multi-select from Firestore), ctaLabel, ctaHref |
| `StatsBar` | `StatsBar` | stats (array: {value, label}), backgroundVariant |
| `MasterclassCTA` | `MasterclassCTA` | heading, subheading, ctaLabel, ctaHref, backgroundVariant |
| `LogoMarquee` | `LogoMarquee` | logos (array: {imageUrl, alt, href?}), speed |
| `BlogTeaser` | `BlogTeaser` | heading, postCount (1–6), ctaLabel, ctaHref |
| `ContactTeaser` | `ContactTeaser` | heading, body, ctaLabel, ctaHref |
| `RichText` | (generic) | body (Tiptap/ProseMirror rich text → HTML string), alignment (left/center) |
| `ImageGallery` | (generic) | images (array: {url, alt, caption?}), columns (2/3/4), aspectRatio (preset) |
| `CTASection` | (generic) | heading, subheading, ctaLabel, ctaHref, backgroundVariant, size (normal/large) |
| `EmbedVideo` | (generic) | youtubeUrl or storageUrl, caption, aspectRatio (16:9/4:3/1:1) |
| `Spacer` | (generic) | size (xs/sm/md/lg/xl — maps to spacing tokens) |
| `Divider` | (generic) | style (solid/dashed/ornamental), color (preset from tp-border/tp-gold) |

### Representative Puck `Config` Code Sample

The following registers four blocks — Hero, FeaturedProductions, RichText, and ImageGallery — with typed field definitions. All other blocks follow the same pattern.

```typescript
// src/lib/puck/puck.config.tsx
import type { Config } from "@measured/puck";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProductions } from "@/components/home/FeaturedProductions";
import { RichTextBlock } from "@/components/blocks/RichTextBlock";
import { ImageGalleryBlock } from "@/components/blocks/ImageGalleryBlock";

// Shared token presets — editors never enter raw CSS values
const BG_VARIANTS = [
  { label: "Black (tp-black)", value: "black" },
  { label: "Surface (tp-surface)", value: "surface" },
  { label: "Elevated (tp-elevated)", value: "elevated" },
  { label: "Gold accent (tp-gold)", value: "gold" },
] as const;

const SPACING_PRESETS = [
  { label: "None", value: "none" },
  { label: "Small (32px)", value: "sm" },
  { label: "Medium (64px)", value: "md" },
  { label: "Large (96px)", value: "lg" },
  { label: "XL (128px)", value: "xl" },
] as const;

export type BackgroundVariant = (typeof BG_VARIANTS)[number]["value"];
export type SpacingPreset = (typeof SPACING_PRESETS)[number]["value"];

export const puckConfig: Config = {
  components: {

    Hero: {
      label: "Hero Section",
      fields: {
        headline: { type: "text", label: "Headline" },
        subheadline: { type: "text", label: "Sub-headline" },
        ctaLabel: { type: "text", label: "CTA Button Label" },
        ctaHref: { type: "text", label: "CTA URL" },
        backgroundVariant: {
          type: "select",
          label: "Background",
          options: BG_VARIANTS,
        },
        showReel: { type: "radio", label: "Show hero video reel", options: [
          { label: "Yes", value: true },
          { label: "No (poster only)", value: false },
        ]},
      },
      defaultProps: {
        headline: "Architect of Cultural Moments",
        subheadline: "",
        ctaLabel: "View Productions",
        ctaHref: "/productions",
        backgroundVariant: "black",
        showReel: true,
      },
      render: ({ headline, subheadline, ctaLabel, ctaHref, backgroundVariant, showReel }) => (
        <HeroSection
          headline={headline}
          subheadline={subheadline}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
          backgroundVariant={backgroundVariant}
          showReel={showReel}
        />
      ),
    },

    FeaturedProductions: {
      label: "Featured Productions",
      fields: {
        heading: { type: "text", label: "Section Heading" },
        // productionIds: populated via a custom Puck field that queries Firestore
        // (custom field type — see §6 for the media/content picker pattern)
        productionIds: {
          type: "array",
          label: "Production IDs",
          arrayFields: {
            id: { type: "text", label: "Production Document ID" },
          },
        },
        ctaLabel: { type: "text", label: "CTA Label" },
        ctaHref: { type: "text", label: "CTA URL" },
        backgroundVariant: {
          type: "select",
          label: "Background",
          options: BG_VARIANTS,
        },
      },
      defaultProps: {
        heading: "Selected Works",
        productionIds: [],
        ctaLabel: "View All Productions",
        ctaHref: "/productions",
        backgroundVariant: "black",
      },
      render: (props) => <FeaturedProductions {...props} />,
    },

    RichText: {
      label: "Rich Text",
      fields: {
        body: { type: "textarea", label: "Content (HTML)" },
        alignment: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Centered", value: "center" },
          ],
        },
        spacingTop: { type: "select", label: "Top Spacing", options: SPACING_PRESETS },
        spacingBottom: { type: "select", label: "Bottom Spacing", options: SPACING_PRESETS },
        backgroundVariant: {
          type: "select",
          label: "Background",
          options: BG_VARIANTS,
        },
      },
      defaultProps: {
        body: "<p>Edit your content here.</p>",
        alignment: "left",
        spacingTop: "md",
        spacingBottom: "md",
        backgroundVariant: "surface",
      },
      render: (props) => <RichTextBlock {...props} />,
    },

    ImageGallery: {
      label: "Image Gallery",
      fields: {
        images: {
          type: "array",
          label: "Images",
          arrayFields: {
            url: { type: "text", label: "Image URL (Cloud Storage)" },
            alt: { type: "text", label: "Alt text" },
            caption: { type: "text", label: "Caption (optional)" },
          },
        },
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
          ],
        },
        aspectRatio: {
          type: "select",
          label: "Aspect Ratio",
          options: [
            { label: "16:9 (video)", value: "16/9" },
            { label: "4:3 (classic)", value: "4/3" },
            { label: "1:1 (square)", value: "1/1" },
            { label: "3:4 (portrait)", value: "3/4" },
          ],
        },
        spacingTop: { type: "select", label: "Top Spacing", options: SPACING_PRESETS },
        spacingBottom: { type: "select", label: "Bottom Spacing", options: SPACING_PRESETS },
      },
      defaultProps: {
        images: [],
        columns: "3",
        aspectRatio: "16/9",
        spacingTop: "md",
        spacingBottom: "md",
      },
      render: (props) => <ImageGalleryBlock {...props} />,
    },

  },
};
```

**New files to create:**
- `src/lib/puck/puck.config.tsx` — the Config above (expands to all blocks)
- `src/components/blocks/RichTextBlock.tsx` — renders sanitized HTML in `@tailwindcss/typography` prose styles
- `src/components/blocks/ImageGalleryBlock.tsx` — responsive grid using `next/image`
- `src/components/blocks/CTASectionBlock.tsx`
- `src/components/blocks/EmbedVideoBlock.tsx`
- `src/components/blocks/SpacerBlock.tsx`
- `src/components/blocks/DividerBlock.tsx`

All existing home-page section components (`HeroSection`, `FeaturedProductions`, etc.) receive their props interface additions (e.g. `backgroundVariant`) without changing their visual output when given default values. This is backward-compatible.

---

## 4. Firestore Data Model

### New collection: `pages`

This collection is separate from all existing collections listed in `doc 05 §3.1`. It stores only editable marketing pages — not blog posts, products, or other typed content.

#### `pages/{pageId}` — field table

| Field | Type | Description |
|---|---|---|
| `pageId` | string | Auto-generated Firestore document ID |
| `slug` | string | URL path segment(s), e.g. `"about-us"`, `"hiras"`, `""` (homepage). Unique; enforced at write time by admin UI + Firestore rule. |
| `title` | string | Page title shown in browser tab and admin list |
| `seo.metaTitle` | string | `<title>` override; defaults to `title` if empty |
| `seo.metaDescription` | string | `<meta name="description">` |
| `seo.ogImageUrl` | string | Open Graph image URL (Cloud Storage) |
| `seo.noIndex` | boolean | If true, adds `<meta name="robots" content="noindex">` |
| `status` | `"draft"` \| `"published"` | Only `"published"` docs are served by the catch-all route |
| `draftData` | object | The Puck content tree JSON; updated on every Save Draft action |
| `publishedData` | object | Snapshot of `draftData` at last Publish action; what the public sees |
| `isHomepage` | boolean | If true, this page serves `/` (only one may be true at a time) |
| `showInNav` | boolean | Whether to include in the generated navigation menu |
| `navOrder` | number | Sort order among nav items (lower = earlier) |
| `navLabel` | string | Label shown in nav; defaults to `title` |
| `scheduledPublishAt` | Timestamp \| null | If set, Cloud Scheduler publishes at this time |
| `createdBy` | string | Firebase Auth UID |
| `createdAt` | Timestamp | |
| `updatedBy` | string | Firebase Auth UID of last editor |
| `updatedAt` | Timestamp | |
| `publishedBy` | string \| null | Firebase Auth UID who last published |
| `publishedAt` | Timestamp \| null | |

#### Example `pages/{pageId}` document (JSON)

```json
{
  "slug": "hiras",
  "title": "HIRAS",
  "seo": {
    "metaTitle": "HIRAS — Travis Payne Productions",
    "metaDescription": "Hip-Hop Is Real Art School — online masterclass series by Travis Payne.",
    "ogImageUrl": "https://firebasestorage.googleapis.com/v0/b/travispayne-prod.appspot.com/o/pages%2Fhiras-og.jpg?alt=media",
    "noIndex": false
  },
  "status": "published",
  "draftData": {
    "content": {
      "zones": {
        "default-zone": [
          {
            "type": "Hero",
            "props": {
              "headline": "Hip-Hop Is Real Art School",
              "subheadline": "A masterclass series by Travis Payne",
              "ctaLabel": "Enroll Now",
              "ctaHref": "/masterclasses/hiras",
              "backgroundVariant": "black",
              "showReel": false
            }
          },
          {
            "type": "RichText",
            "props": {
              "body": "<p>HIRAS is Travis Payne's flagship online education program...</p>",
              "alignment": "left",
              "spacingTop": "lg",
              "spacingBottom": "lg",
              "backgroundVariant": "surface"
            }
          }
        ]
      }
    }
  },
  "publishedData": { /* same structure, snapshot at publish time */ },
  "isHomepage": false,
  "showInNav": true,
  "navOrder": 5,
  "navLabel": "HIRAS",
  "scheduledPublishAt": null,
  "createdBy": "uid_travis_123",
  "createdAt": "2026-03-01T10:00:00Z",
  "updatedBy": "uid_editor_456",
  "updatedAt": "2026-06-20T14:30:00Z",
  "publishedBy": "uid_travis_123",
  "publishedAt": "2026-06-20T15:00:00Z"
}
```

### Subcollection: `pages/{pageId}/revisions/{revisionId}`

Stores a snapshot on every Publish action, enabling version history and rollback.

| Field | Type | Description |
|---|---|---|
| `revisionId` | string | Auto-generated |
| `data` | object | Copy of `publishedData` at this revision |
| `publishedBy` | string | UID |
| `publishedAt` | Timestamp | |
| `label` | string | Optional human-readable label, e.g. `"June launch version"` |

Rollback flow: Admin selects a revision in `/admin/pages/[id]/edit` → `draftData` is overwritten with `revision.data` → editor reviews → publishes normally.

### Navigation document: `siteSettings/navigation`

Reuses the existing `siteSettings` collection (already canonical in `doc 05 §3.1`). A new document `navigation` (or extend the existing `homepage` document) stores the nav menu.

```json
{
  "items": [
    { "label": "Home", "href": "/", "order": 0 },
    { "label": "About", "href": "/about", "order": 1 },
    { "label": "Productions", "href": "/productions", "order": 2 },
    { "label": "Masterclasses", "href": "/masterclasses", "order": 3 },
    { "label": "HIRAS", "href": "/hiras", "order": 4 },
    { "label": "Blog", "href": "/blog", "order": 5 },
    { "label": "Store", "href": "/store", "order": 6 },
    { "label": "Contact", "href": "/contact", "order": 7 }
  ],
  "updatedAt": "2026-06-20T15:00:00Z",
  "updatedBy": "uid_travis_123"
}
```

The nav items for `showInNav: true` pages in `pages/` are merged into this list automatically at publish time (via a Cloud Function or the `/api/revalidate` handler). Code-driven routes (blog, store, etc.) appear as static entries that editors can reorder but not delete.

---

## 5. Rendering Integration: The Catch-All Route

### Route file

```
src/app/[[...slug]]/page.tsx
```

This optional catch-all handles zero or more path segments. It attempts to match the request to a published page in the `pages` Firestore collection before falling through to a 404.

### Route precedence (critical)

Next.js App Router resolves routes by specificity. **More-specific file-system routes always win over a catch-all.** The following routes are code-driven and are never intercepted by `[[...slug]]`:

| Reserved route (code-driven) | File path |
|---|---|
| `/` (if no homepage page doc exists) | `src/app/page.tsx` |
| `/blog` and `/blog/[slug]` | `src/app/blog/` |
| `/store` and `/store/[slug]` | `src/app/store/` |
| `/masterclasses` and `/masterclasses/[slug]` | `src/app/masterclasses/` |
| `/admin` and all subroutes | `src/app/admin/` |
| `/cart` | `src/app/cart/` |
| `/checkout` | `src/app/checkout/` |
| `/contact` | `src/app/contact/` |
| `/book` | `src/app/book/` |
| `/api/*` | `src/app/api/` |

**The catch-all `[[...slug]]` only activates when no more-specific file-system route matches.** Editors cannot create a page with slug `blog`, `store`, `admin`, `cart`, `checkout`, `contact`, or `book` — the admin UI rejects reserved slugs at creation time with a validation error.

If a page has `isHomepage: true` in Firestore, the catch-all handles slug `""` (empty array) and the existing `src/app/page.tsx` is replaced by this dynamic document. Both can coexist: if no homepage page doc exists, `page.tsx` renders; if one does, the catch-all wins because it matches an empty slug before Next.js would normally fall back to `page.tsx`. In practice, once the page builder is live, the static `page.tsx` should be removed or converted to a thin wrapper that defers to the catch-all.

### `src/app/[[...slug]]/page.tsx`

```typescript
import { notFound } from "next/navigation";
import { Render } from "@measured/puck/rsc";
import { puckConfig } from "@/lib/puck/puck.config";
import { adminDb } from "@/lib/firebase/admin";
import type { Metadata } from "next";

interface Props {
  params: { slug?: string[] };
}

async function getPublishedPage(slug: string) {
  const snap = await adminDb
    .collection("pages")
    .where("slug", "==", slug)
    .where("status", "==", "published")
    .limit(1)
    .get();

  if (snap.empty) return null;
  return snap.docs[0].data();
}

// ISR: revalidate every 60 seconds as baseline; on-demand revalidate on publish
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug?.join("/") ?? "";
  const page = await getPublishedPage(slug);
  if (!page) return {};
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    openGraph: page.seo?.ogImageUrl
      ? { images: [{ url: page.seo.ogImageUrl }] }
      : undefined,
    robots: page.seo?.noIndex ? { index: false } : undefined,
  };
}

export default async function DynamicPage({ params }: Props) {
  const slug = params.slug?.join("/") ?? "";
  const page = await getPublishedPage(slug);
  if (!page) notFound();

  return (
    <Render config={puckConfig} data={page.publishedData} />
  );
}
```

### On-demand revalidation on publish

When the editor clicks Publish, the Server Action:
1. Writes `publishedData` and sets `status: "published"` in Firestore.
2. Calls `POST /api/revalidate` with `{ path: "/" + page.slug, secret: REVALIDATE_SECRET }`.
3. The route handler calls `revalidatePath("/" + slug)`, which purges the Next.js ISR cache and serves fresh HTML on the next request.

This is the same `/api/revalidate` endpoint defined in `doc 05 §3.3` — no new infrastructure needed.

---

## 6. Editing UX and Workflow

### Admin pages list: `/admin/pages`

This is a new admin sub-route added to the existing `/admin` section (auth-guarded by the existing middleware and `admin/layout.tsx`).

Features:
- Table of all pages: title, slug, status (Draft/Published), last updated, last updated by.
- Create new page button: opens a modal asking for title and slug (slug auto-generated from title, editable, reserved-slug validation).
- Per-row actions: Edit, Duplicate, Set as Homepage, Toggle Show in Nav, Delete (soft delete with confirmation).
- Drag-to-reorder nav items directly in the list view (updates `navOrder`).

New file: `src/app/admin/pages/page.tsx`

### Editor route: `/admin/pages/[id]/edit`

New file: `src/app/admin/pages/[id]/edit/page.tsx`

This is a **Client Component** (`'use client'`) that mounts the Puck editor. It loads `draftData` from Firestore via the Firebase client SDK on initial render, then uses Puck's `<Puck>` component:

```typescript
// src/app/admin/pages/[id]/edit/page.tsx
"use client";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/lib/puck/puck.config";
import { usePageEditor } from "@/hooks/usePageEditor";

export default function PageEditorRoute({ params }: { params: { id: string } }) {
  const { initialData, onPublish, onSaveDraft, isSaving, isPublishing } =
    usePageEditor(params.id);

  if (!initialData) return <EditorSkeleton />;

  return (
    <Puck
      config={puckConfig}
      data={initialData}
      onPublish={onPublish}
      // Custom header buttons wired to onSaveDraft and onPublish
      headerTitle="Page Editor"
      overrides={{
        headerActions: () => (
          <EditorHeaderActions
            onSaveDraft={onSaveDraft}
            onPublish={onPublish}
            isSaving={isSaving}
            isPublishing={isPublishing}
          />
        ),
      }}
    />
  );
}
```

Puck provides drag-drop reorder of blocks, field side-panels, and native undo/redo out of the box.

### Cloud Storage Media Picker

The Puck field type for image URLs uses a **custom Puck field** (Puck's `custom` field type) that renders a button opening a modal `MediaPickerModal`. The modal:
1. Lists files in the editor's Cloud Storage folder (`/pages/` and `/assets/`), fetched via a Server Action that calls `adminStorage.bucket().getFiles()`.
2. Lets the editor upload a new file (drag-and-drop or file picker), which uploads directly to Cloud Storage via the Firebase client SDK using the `uploadBytesResumable` API.
3. On upload, the Resize Images extension creates optimized thumbnails automatically.
4. On selection, the modal closes and writes the public download URL back into the Puck field.

New files:
- `src/components/admin/MediaPickerModal.tsx`
- `src/lib/actions/media.ts` (Server Action: `listMediaFiles(prefix: string)`)

### Publish Workflow

```
Editor opens /admin/pages/[id]/edit
        |
        v
Puck loads draftData from Firestore
        |
        |-- (drag blocks, edit fields) --> auto-save to draftData every 30s
        |
        v
[Save Draft] button
  --> writes draftData to pages/{id}
  --> status stays "draft"
  --> toast: "Draft saved"
        |
[Preview] button
  --> opens /preview/{id}?token={PREVIEW_TOKEN} in a new tab
  --> a tokenized Next.js draft route reads draftData (not publishedData)
  --> shows exactly what the page will look like
        |
[Publish] button
  --> writes publishedData = current draftData
  --> sets status = "published", publishedAt, publishedBy
  --> creates pages/{id}/revisions/{auto-id} snapshot
  --> calls POST /api/revalidate?path=/{slug}
  --> toast: "Published at travispayne.com/{slug}"
```

### Scheduled Publish

Editors set `scheduledPublishAt` on a page. A Cloud Scheduler job (`scheduledPublishPages`) runs every 15 minutes, queries `pages` where `scheduledPublishAt <= now()` and `status == "draft"`, copies `draftData` to `publishedData`, sets `status: "published"`, and calls `/api/revalidate`. This reuses Cloud Scheduler infrastructure already in `doc 04 §10`.

---

## 7. Design Guardrails: Token-Based Field Constraints

The design system stays on-brand because **editors never input raw CSS values**. Every visual choice in the Puck field definitions is a `select` or `radio` with a fixed option list drawn from the `tp-*` token set.

### How this is enforced

| Editor wants to change... | Field type | Options (what editor sees) |
|---|---|---|
| Background color of a section | `select` | Black, Surface, Elevated, Gold accent |
| Spacing above/below a block | `select` | None, Small (32px), Medium (64px), Large (96px), XL (128px) |
| Text alignment | `radio` | Left, Centered |
| Marquee speed | `select` | Slow, Normal, Fast |
| Image aspect ratio | `select` | 16:9, 4:3, 1:1, 3:4 |
| Gallery columns | `select` | 2, 3, 4 |
| Divider style | `select` | Solid, Dashed, Ornamental (tp-gold) |
| Divider color | `select` | Border (tp-border), Gold (tp-gold) |
| Font family | N/A — not exposed | Font is determined by component; editors cannot change fonts |
| Font size | N/A — not exposed | Type hierarchy is determined by component |
| Custom color hex | N/A — not exposed | Raw hex inputs do not exist in the field spec |

The components themselves map the string preset values to CSS classes:

```typescript
// src/components/blocks/RichTextBlock.tsx
const bgMap: Record<BackgroundVariant, string> = {
  black:    "bg-tp-black",
  surface:  "bg-tp-surface",
  elevated: "bg-tp-elevated",
  gold:     "bg-tp-gold text-tp-black",
};

const spacingMap: Record<SpacingPreset, string> = {
  none: "py-0",
  sm:   "py-8",
  md:   "py-16",
  lg:   "py-24",
  xl:   "py-32",
};
```

Because Tailwind's JIT compiler sees these class strings at build time (they are static strings, not interpolated), they are included in the production CSS. The components apply pre-composed Tailwind classes; the JSON stored in Firestore never contains raw CSS.

---

## 8. Firestore Security Rules

Add the following to `firestore.rules`, alongside the existing rules from `doc 04 §4`:

```javascript
// firestore.rules (additions for the pages collection)

match /pages/{pageId} {
  // Public: anyone can read a published page (used by the catch-all RSC)
  allow read: if resource.data.status == "published";

  // Authenticated editors and admins can read drafts
  allow read: if request.auth != null
    && request.auth.token.role in ["editor", "admin"];

  // Create and update: editor or admin only
  allow create, update: if request.auth != null
    && request.auth.token.role in ["editor", "admin"]
    && validatePage(request.resource.data);

  // Delete: admin only
  allow delete: if request.auth != null
    && request.auth.token.role == "admin";

  match /revisions/{revisionId} {
    // Revisions are immutable snapshots — read by editor/admin, write on publish only
    allow read: if request.auth != null
      && request.auth.token.role in ["editor", "admin"];
    allow create: if request.auth != null
      && request.auth.token.role in ["editor", "admin"];
    // No update or delete — revisions are append-only
    allow update, delete: if false;
  }
}

// Validation function for page documents
function validatePage(data) {
  return data.keys().hasAll(["slug", "title", "status", "draftData"])
    && data.status in ["draft", "published"]
    && data.slug is string
    && data.slug.size() > 0
    // Prevent editors from creating reserved slugs
    && !(data.slug in ["blog", "store", "masterclasses", "admin",
                        "cart", "checkout", "contact", "book", "api"]);
}

match /siteSettings/navigation {
  // Public read (Header component reads nav on every SSG page)
  allow read: if true;
  // Write: editor or admin only
  allow write: if request.auth != null
    && request.auth.token.role in ["editor", "admin"];
}
```

---

## 9. Roadmap Impact: Phase 2.5 — Visual Page Builder

This is a new phase inserted between Phase 2 (Blog) and Phase 3 (Store) in the roadmap from `doc 02 §9`. It depends on:

- **Phase 0 complete:** design tokens in `globals.css`, Firebase singletons, admin auth guard.
- **Phase 1 complete:** all marketing section components (`HeroSection`, `FeaturedProductions`, etc.) must exist as standalone, prop-driven React components before they can be registered as Puck blocks.
- **Phase 2 partially complete:** the `/admin` shell and Firestore write patterns must exist. The Tiptap editor used in Phase 2 (blog) informs the RichText block implementation.

### Phase 2.5 Task Breakdown

| Task | Effort | Notes |
|---|---|---|
| Install and configure `@measured/puck` | 0.25 d | `npm install @measured/puck`; add CSS import |
| Write `puck.config.tsx`: register all section components as blocks with fields | 2 d | One block per component; typed field definitions; all token presets |
| Build generic blocks (RichText, ImageGallery, CTASection, EmbedVideo, Spacer, Divider) | 1.5 d | New presentational components, prop-driven |
| Firestore data model: `pages` collection + `revisions` subcollection | 0.5 d | Types in `src/types/page.ts`; query in `src/lib/queries/pages.ts` |
| Firestore security rules update | 0.25 d | See §8 |
| Catch-all route `src/app/[[...slug]]/page.tsx` | 0.5 d | ISR + `generateMetadata` |
| `/api/revalidate` integration on publish | 0.25 d | Already exists; add slug param support |
| Admin page list `/admin/pages` | 1 d | CRUD UI, reorder, set-homepage toggle |
| Puck editor page `/admin/pages/[id]/edit` | 1.5 d | Mount Puck, wire save/publish, undo/redo |
| `usePageEditor` hook (load/save draft/publish + Firestore writes) | 0.5 d | |
| Draft preview route `/preview/[id]` with preview token | 0.5 d | Reads `draftData`, auth-gated |
| Cloud Storage media picker modal | 1 d | Custom Puck field; upload + browse |
| Revisions UI (version history + rollback in editor) | 0.5 d | |
| Scheduled publish: Cloud Scheduler + Cloud Function `scheduledPublishPages` | 0.5 d | |
| Navigation editor (reorder nav items from pages list) | 0.5 d | Updates `siteSettings/navigation` |
| E2E Playwright tests: create page, edit, publish, verify on public site | 1 d | |
| **Total** | **~12 developer-days (~2.5 weeks)** | One mid-level frontend developer |

### Updated roadmap (phase sequence)

```
Phase 0  (~1 week)   Scaffold + infra
Phase 1  (~2 weeks)  Marketing pages (DNS cutover)
Phase 2  (~1.5 wks)  Blog
Phase 2.5 (~2.5 wks) Visual Page Builder  ← new
Phase 3  (~2.5 wks)  Store
Phase 4  (~2.5 wks)  Masterclasses
Phase 5  (ongoing)   Polish
```

---

## 10. Cost and Dependency Notes

| Choice | Monthly cost | Notes |
|---|---|---|
| **Puck (`@measured/puck`)** | **$0** | MIT open-source; self-hosted; no external API; data stays in Firebase |
| Builder.io | $19–$299+/mo (team features) | Hosted SaaS; content stored on Builder CDN; React SDK available |
| Plasmic | $49/mo+ (Team) | Hosted SaaS; more design freedom than Puck; content on Plasmic servers |
| TinaCMS Cloud | $29/mo+ | Git-backed; incompatible with Firestore-first architecture |
| New Firebase read/write cost (Puck) | Minimal | A page load = one Firestore read; editor saves = one write. Well within Blaze free tier thresholds at this scale. |
| Cloud Scheduler (scheduled publish) | Negligible | Existing infrastructure; one additional job |
| Cloud Storage (editor image uploads) | Per-byte storage + egress | Same billing as existing media uploads; Resize Images extension already in place |

Puck adds zero SaaS cost and zero new infrastructure. If the client later decides they need the freeform layout power of Builder.io or Plasmic, the migration path is to swap the rendering layer (`<Render>`) while keeping the Firestore data model and `/api/revalidate` mechanism identical.

---

## 11. Integration Seams Summary

The following are the explicit boundaries between this feature and the rest of the system:

| Seam | Description | Owned by |
|---|---|---|
| **New Firestore collection `pages`** | Stores all editable marketing page content as Puck JSON trees. Reserved names blocked at rules and UI layer. | Back-End agent: add to `doc 04` collection list; define security rules. Front-End: types in `src/types/page.ts`, queries in `src/lib/queries/pages.ts`. |
| **Catch-all route `src/app/[[...slug]]/page.tsx`** | Reads `pages/{pageId}.publishedData` from Firestore via `firebase-admin`; renders with Puck `<Render>`; ISR with 60s baseline. Must not shadow reserved code-driven routes (specificity enforced by file-system). | Web Developer (front-end). |
| **`POST /api/revalidate` on publish** | Already exists from `doc 05 §3.3`. Extended to accept a `path` parameter. Called by the publish Server Action after writing `publishedData`. Purges the Next.js ISR cache so the public site reflects the new content within seconds. | Exists; extend to support per-path revalidation. |
| **Cloud Storage media picker** | The Puck custom image field opens a modal that lists and uploads to Cloud Storage. Uses the same bucket and Resize Images extension already in place. Upload uses Firebase client SDK `uploadBytesResumable`; listing uses a Server Action calling `adminStorage`. | Web Developer; integrates with existing Cloud Storage setup from `doc 04`. |
| **`siteSettings/navigation` document** | Updated on publish when `showInNav` pages change. Header component reads this document server-side on each ISR page render (or from ISR cache). | Reuses existing `siteSettings` collection; new document `navigation`. |
| **Puck `Config` and design-system components** | The block library (`puck.config.tsx`) imports and wraps the existing section components from `src/components/`. Components must be pure (prop-driven, no internal Firestore fetches in the rendered path) so Puck can pass props from the stored JSON. Where a component currently fetches its own data (e.g. `FeaturedProductions`), it receives resolved data as a prop; the catch-all route (or a Server Action called at render time) supplies it. | Web Developer; coordinate with UI/UX agent if new token presets are needed. |
| **`pages/{pageId}/revisions/{revisionId}` subcollection** | Written on every publish action. Revision rollback copies a revision's `data` field back to `draftData`. Security rules: append-only (no update/delete). | Back-End agent: rules. Front-End: UI in editor, write action. |

---

*This document is additive over docs 02–05. The canonical stack (`doc 05`) is unchanged: Next.js 15 App Router, React 19, TypeScript strict, Tailwind v3.4, Framer Motion, Firebase App Hosting. Puck is an MIT-licensed npm package within this stack, not an external platform.*
