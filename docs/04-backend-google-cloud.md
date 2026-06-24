# 04 — Back-End Architecture: Google Firebase + Google Cloud

**Project:** Travis Payne Productions website rebuild  
**Stack target:** Next.js (App Router) front end · Firebase Blaze plan · Google Cloud services  
**Audience:** Web Developer Agent and any engineer implementing the system

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Auth & Roles](#2-auth--roles)
3. [Firestore Data Models](#3-firestore-data-models)
4. [Security Rules](#4-security-rules)
5. [Store / E-Commerce (Stripe + Google Pay)](#5-store--e-commerce)
6. [Blog & CMS Strategy](#6-blog--cms-strategy)
7. [Masterclasses: Gated Video Content](#7-masterclasses-gated-video-content)
8. [Email & Notifications](#8-email--notifications)
9. [Forms & Spam Protection](#9-forms--spam-protection)
10. [Search, Analytics, SEO & Scheduling](#10-search-analytics-seo--scheduling)
11. [CI/CD, Environments & Backups](#11-cicd-environments--backups)
12. [Monthly Cost Estimate](#12-monthly-cost-estimate)
13. [Features the Client Hasn't Thought Of](#13-features-the-client-hasnt-thought-of)

---

## 1. Architecture Overview

### Text Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          CLIENTS (Browser / Mobile)                             │
│            React / Next.js App Router (static + SSR pages)                     │
└────────────────────────┬──────────────────────────────────────────────┬─────────┘
                         │ HTTPS                                         │ HTTPS
              ┌──────────▼──────────┐                        ┌──────────▼──────────┐
              │  Firebase App       │                        │  Cloud CDN           │
              │  Hosting (SSR)      │                        │  (static assets,     │
              │  Edge-cached ISR    │                        │   Cloud Storage imgs)│
              └──────────┬──────────┘                        └─────────────────────┘
                         │
          ┌──────────────┼───────────────────────────────────────────┐
          │              │                                           │
  ┌───────▼──────┐ ┌─────▼──────────────┐              ┌────────────▼────────────┐
  │ Firebase Auth│ │   Cloud Firestore   │              │  Cloud Storage (GCS)    │
  │ (email/pw,   │ │   (primary DB)      │              │  • media uploads        │
  │  Google SSO) │ │   • real-time reads │              │  • video source files   │
  └───────┬──────┘ │   • security rules  │              │  • image originals      │
          │        └─────┬──────────────-┘              │  • digital downloads    │
          │              │                              └────────────┬────────────┘
          │              │                                           │
          │     ┌────────▼───────────────────────────────┐          │
          │     │        Cloud Functions (2nd Gen)         │          │
          │     │  • Stripe checkout / webhooks            │          │
          │     │  • Trigger Email (order confirm, etc.)   │          │
          │     │  • Image resize on GCS upload            │          │
          │     │  • Enrollment + claim sync               │          │
          │     │  • Calendar availability checks          │          │
          │     │  • Sitemap generation (scheduled)        │          │
          │     │  • reCAPTCHA verification                │          │
          │     └────────┬────────────────────────────────┘          │
          │              │                                           │
          │     ┌────────▼────────────────────────────────────────┐  │
          │     │         Google Cloud Supporting Services         │  │
          │     │  • Secret Manager (API keys, Stripe secrets)     │  │
          │     │  • Cloud Scheduler (sitemap, digest emails)      │  │
          │     │  • Cloud Armor (WAF, DDoS — optional)            │  │
          │     │  • reCAPTCHA Enterprise                          │  │
          │     │  • Google Calendar API (booking availability)    │  │
          │     │  • Google Analytics 4 + Tag Manager              │  │
          │     │  • Mux (video transcoding / HLS) — see §7       │  │
          │     └─────────────────────────────────────────────────┘  │
          │                                                           │
          └───────────────── Firebase App Check ──────────────────────┘
```

### Request Flow Patterns

#### Public read (blog post, product listing)
```
Browser → Next.js ISR page (revalidate: 60s)
        → Firebase SDK (client-side) OR getServerSideProps (server-side)
        → Firestore (published docs only, security rule: status == "published")
        → Page rendered, cached at Cloud CDN edge
```

#### Authenticated action (add to cart, enroll in masterclass)
```
Browser → Firebase Auth (idToken in Authorization header or session cookie)
        → Next.js API Route OR direct Firestore write
        → Security rules verify uid + custom claim
        → Firestore write committed
        → Cloud Function trigger (if needed — e.g., send email)
```

#### Payment / checkout
```
Browser → POST /api/checkout (Next.js Route Handler)
        → Cloud Function: createCheckoutSession
          • validates cart items against Firestore products
          • calls Stripe API (key from Secret Manager)
          • returns Stripe Checkout Session URL
        → Browser redirects to Stripe-hosted checkout
        → Stripe webhook → Cloud Function: stripeWebhook
          • verifies webhook signature
          • writes order to Firestore orders collection
          • decrements inventory in products doc
          • triggers email confirmation
```

#### Admin write (publish blog post, add product)
```
Admin browser → /admin (Next.js route, SSR guard)
             → Firebase Auth check: custom claim role == "admin" | "editor"
             → Direct Firestore write (security rules enforce claim)
             → Cloud Function trigger: onBlogPostWrite → regenerate sitemap
```

---

## 2. Auth & Roles

### Providers

| Provider | Use Case |
|---|---|
| Email / Password | Customer accounts, admin panel login |
| Google Sign-In (OAuth) | Frictionless customer login |
| Anonymous (optional) | Guest cart before account creation |

### Custom Claims (set by Cloud Function on user creation or admin grant)

```json
{
  "role": "admin" | "editor" | "customer" | "public"
}
```

| Role | Capabilities |
|---|---|
| `public` | Read published content, no writes |
| `customer` | Authenticated; read own orders/enrollments, write cart/contact forms |
| `editor` | Blog + media CRUD, no user/order management |
| `admin` | Full Firestore access; manage users, orders, products, settings |

### Enforcement Points

1. **Firestore Security Rules** (primary enforcement — see §4)
2. **Next.js middleware** (`middleware.ts`): guards `/admin/*` and `/account/*` routes, reads Firebase session cookie
3. **Cloud Functions**: re-verify idToken on every callable function; never trust client-passed uid

### Claim-setting Cloud Function

```typescript
// functions/src/auth/onUserCreate.ts
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  await admin.auth().setCustomUserClaims(user.uid, { role: "customer" });
  await admin.firestore().collection("customers").doc(user.uid).set({
    email: user.email,
    displayName: user.displayName ?? "",
    role: "customer",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
```

### Environment Variables (Web Developer reference)

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

All secrets (Stripe keys, SendGrid API key, reCAPTCHA secret) are stored in **Google Secret Manager** and accessed only by Cloud Functions — never exposed to the client bundle.

---

## 3. Firestore Data Models

All collections live in the default Firestore database. Field types: `str` = string, `ts` = Timestamp, `bool` = boolean, `num` = number, `arr` = array, `map` = map/object, `ref` = DocumentReference.

---

### 3.1 `blogPosts`

**Path:** `blogPosts/{postId}`

| Field | Type | Example |
|---|---|---|
| `title` | str | `"The Art of the Rehearsal Room"` |
| `slug` | str | `"art-of-rehearsal-room"` |
| `status` | str | `"published"` / `"draft"` / `"scheduled"` |
| `publishedAt` | ts | `2025-09-01T10:00:00Z` |
| `scheduledAt` | ts | (optional, used by Cloud Scheduler) |
| `authorUid` | str | `"uid_abc123"` |
| `authorName` | str | `"Travis Payne"` |
| `excerpt` | str | `"A short teaser..."` |
| `bodyMdx` | str | Full MDX / Markdown body |
| `coverImageUrl` | str | GCS public URL |
| `coverImageAlt` | str | `"Travis rehearsing on stage"` |
| `tags` | arr\[str\] | `["dance", "behind-the-scenes"]` |
| `categories` | arr\[str\] | `["Blog", "Industry"]` |
| `seoTitle` | str | (optional override) |
| `seoDescription` | str | (optional override) |
| `readTimeMinutes` | num | `5` |
| `featured` | bool | `true` |
| `updatedAt` | ts | auto |

**Indexes needed:**
- `status ASC, publishedAt DESC` (public listing)
- `status ASC, tags ARRAY_CONTAINS, publishedAt DESC` (tag filter)
- `featured ASC, status ASC, publishedAt DESC` (featured feed)

---

### 3.2 `products`

**Path:** `products/{productId}`

| Field | Type | Example |
|---|---|---|
| `name` | str | `"TPX Rehearsal Tee"` |
| `slug` | str | `"tpx-rehearsal-tee"` |
| `description` | str | Markdown |
| `price` | num | `3500` (cents — always store in cents) |
| `compareAtPrice` | num | `4500` (original/sale) |
| `currency` | str | `"usd"` |
| `type` | str | `"physical"` / `"digital"` / `"masterclass"` |
| `status` | str | `"active"` / `"draft"` / `"archived"` |
| `images` | arr\[str\] | GCS URLs |
| `stripePriceId` | str | `"price_1OAbc..."` |
| `stripeProductId` | str | `"prod_1OAbc..."` |
| `inventory` | num | `42` (-1 = unlimited/digital) |
| `sku` | str | `"TPX-TEE-BLK-M"` |
| `weight` | num | (grams, for shipping calc) |
| `digitalFileUrl` | str | GCS signed URL path (digital only) |
| `tags` | arr\[str\] | `["apparel", "new"]` |
| `category` | str | `"apparel"` |
| `featured` | bool | `false` |
| `createdAt` | ts | |
| `updatedAt` | ts | |

**Subcollection:** `products/{productId}/variants/{variantId}`

| Field | Type | Example |
|---|---|---|
| `label` | str | `"Black / Medium"` |
| `sku` | str | `"TPX-TEE-BLK-M"` |
| `price` | num | `3500` |
| `inventory` | num | `12` |
| `attributes` | map | `{color: "Black", size: "M"}` |

---

### 3.3 `orders`

**Path:** `orders/{orderId}`

| Field | Type | Example |
|---|---|---|
| `uid` | str | Firebase uid (null if guest) |
| `email` | str | `"customer@example.com"` |
| `status` | str | `"pending"` / `"paid"` / `"fulfilled"` / `"refunded"` |
| `stripePaymentIntentId` | str | `"pi_3OAbc..."` |
| `stripeSessionId` | str | |
| `lineItems` | arr\[map\] | See below |
| `subtotal` | num | cents |
| `tax` | num | cents |
| `shipping` | num | cents |
| `total` | num | cents |
| `currency` | str | `"usd"` |
| `shippingAddress` | map | `{name, line1, city, state, zip, country}` |
| `fulfillmentMethod` | str | `"ship"` / `"digital"` / `"none"` |
| `trackingNumber` | str | (set on fulfillment) |
| `notes` | str | |
| `createdAt` | ts | |
| `updatedAt` | ts | |

**lineItems array element:**
```json
{
  "productId": "prod_abc",
  "variantId": "var_xyz",
  "name": "TPX Rehearsal Tee — Black/M",
  "sku": "TPX-TEE-BLK-M",
  "quantity": 2,
  "unitPrice": 3500,
  "type": "physical"
}
```

---

### 3.4 `carts`

**Path:** `carts/{uid}` (or `carts/{sessionId}` for guests)

| Field | Type | Example |
|---|---|---|
| `uid` | str | Firebase uid or null |
| `sessionId` | str | anonymous session id |
| `items` | arr\[map\] | `[{productId, variantId, quantity, price, name, imageUrl}]` |
| `updatedAt` | ts | |
| `expiresAt` | ts | 30 days from last update |

> Cart lives entirely client-side in localStorage for guests and syncs to Firestore on login. A Cloud Scheduler job prunes expired guest carts weekly.

---

### 3.5 `customers`

**Path:** `customers/{uid}`

| Field | Type | Example |
|---|---|---|
| `email` | str | |
| `displayName` | str | |
| `phone` | str | |
| `role` | str | `"customer"` |
| `stripeCustomerId` | str | `"cus_abc..."` |
| `newsletterOptIn` | bool | `true` |
| `createdAt` | ts | |
| `updatedAt` | ts | |
| `lastLoginAt` | ts | |

**Subcollection:** `customers/{uid}/addresses/{addressId}` — saved shipping addresses.

---

### 3.6 `team`

**Path:** `team/{memberId}`

| Field | Type | Example |
|---|---|---|
| `name` | str | `"Stacy Walker"` |
| `title` | str | `"Co-Founder / Partner"` |
| `bio` | str | Markdown |
| `photoUrl` | str | GCS URL |
| `photoAlt` | str | |
| `order` | num | `1` (display sort) |
| `featured` | bool | `true` |
| `socialLinks` | map | `{instagram: "...", twitter: "..."}` |
| `status` | str | `"active"` / `"inactive"` |

---

### 3.7 `partners`

**Path:** `partners/{partnerId}`

| Field | Type | Example |
|---|---|---|
| `name` | str | `"Live Nation"` |
| `logoUrl` | str | GCS URL |
| `logoAlt` | str | |
| `websiteUrl` | str | |
| `category` | str | `"Entertainment"` / `"Brand"` |
| `order` | num | `1` |
| `status` | str | `"active"` |
| `featured` | bool | `true` |

---

### 3.8 `productions`

**Path:** `productions/{productionId}`

| Field | Type | Example |
|---|---|---|
| `title` | str | `"Michael Jackson's This Is It"` |
| `slug` | str | `"michael-jackson-this-is-it"` |
| `type` | str | `"film"` / `"tour"` / `"tv"` / `"stage"` / `"music-video"` |
| `client` | str | `"Sony Music"` |
| `role` | str | `"Choreographer / Associate Director"` |
| `year` | num | `2009` |
| `description` | str | Markdown |
| `coverImageUrl` | str | GCS URL |
| `gallery` | arr\[str\] | GCS URLs |
| `videoUrl` | str | YouTube embed URL |
| `featured` | bool | `true` |
| `tags` | arr\[str\] | `["film", "michael-jackson"]` |
| `status` | str | `"published"` / `"draft"` |
| `order` | num | sort weight |
| `createdAt` | ts | |

**Indexes:** `status ASC, featured DESC, year DESC` · `type ASC, status ASC, year DESC`

---

### 3.9 `masterclasses`

**Path:** `masterclasses/{classId}`

| Field | Type | Example |
|---|---|---|
| `title` | str | `"Foundation of Groove — Module 1"` |
| `slug` | str | `"foundation-of-groove-module-1"` |
| `instructors` | arr\[str\] | `["Travis Payne", "Stacy Walker"]` |
| `description` | str | Markdown |
| `coverImageUrl` | str | GCS URL |
| `previewVideoUrl` | str | Mux playback URL (public teaser) |
| `durationMinutes` | num | `45` |
| `level` | str | `"beginner"` / `"intermediate"` / `"advanced"` |
| `tags` | arr\[str\] | `["hip-hop", "groove"]` |
| `price` | num | cents (0 = free with subscription) |
| `stripePriceId` | str | |
| `status` | str | `"published"` / `"draft"` |
| `productId` | str | ref to products doc (if sold standalone) |
| `seriesId` | str | ref to masterclassSeries (optional) |
| `order` | num | sort within series |
| `createdAt` | ts | |

**Subcollection:** `masterclasses/{classId}/lessons/{lessonId}`

| Field | Type | Example |
|---|---|---|
| `title` | str | `"Breaking Down the 8-Count"` |
| `order` | num | `1` |
| `muxAssetId` | str | Mux asset ID |
| `muxPlaybackId` | str | Mux playback ID |
| `durationSeconds` | num | `720` |
| `description` | str | |
| `resources` | arr\[map\] | `[{label: "PDF Guide", url: "..."}]` |

---

### 3.10 `enrollments`

**Path:** `enrollments/{enrollmentId}`

| Field | Type | Example |
|---|---|---|
| `uid` | str | Firebase uid |
| `masterclassId` | str | |
| `orderId` | str | ref to orders doc |
| `status` | str | `"active"` / `"revoked"` |
| `enrolledAt` | ts | |
| `expiresAt` | ts | null = lifetime |
| `progress` | map | `{lessonId: {completedAt: ts, watchedSeconds: 300}}` |
| `certificateUrl` | str | GCS URL (if completion cert issued) |

**Composite index:** `uid ASC, status ASC` · `masterclassId ASC, uid ASC`

---

### 3.11 `bookings` (Inquiries)

**Path:** `bookings/{bookingId}`

| Field | Type | Example |
|---|---|---|
| `name` | str | `"Maria Garcia"` |
| `email` | str | |
| `phone` | str | |
| `company` | str | |
| `eventType` | str | `"corporate"` / `"music-video"` / `"masterclass-private"` |
| `eventDate` | ts | |
| `eventLocation` | str | |
| `budget` | str | `"$10,000–$25,000"` |
| `message` | str | |
| `status` | str | `"new"` / `"in-review"` / `"accepted"` / `"declined"` |
| `assignedTo` | str | uid of team member |
| `recaptchaToken` | str | (cleared after verification) |
| `source` | str | `"contact-form"` / `"booking-page"` |
| `createdAt` | ts | |
| `updatedAt` | ts | |

---

### 3.12 `newsletterSubscribers`

**Path:** `newsletterSubscribers/{email_hash}`  
(Use SHA-256 hash of lowercased email as document ID to prevent duplicates without exposing PII in IDs)

| Field | Type | Example |
|---|---|---|
| `email` | str | `"fan@example.com"` |
| `firstName` | str | |
| `status` | str | `"subscribed"` / `"unsubscribed"` / `"bounced"` |
| `source` | str | `"footer-form"` / `"checkout"` / `"masterclass"` |
| `tags` | arr\[str\] | `["store-customer", "masterclass-student"]` |
| `subscribedAt` | ts | |
| `unsubscribedAt` | ts | |

---

### 3.13 `siteSettings` (CMS / Config)

**Path:** `siteSettings/{key}` (small set of well-known doc IDs)

**`siteSettings/global`**

| Field | Type | Example |
|---|---|---|
| `siteName` | str | `"Travis Payne Productions"` |
| `tagline` | str | `"Choreographer. Director. Producer."` |
| `email` | str | `"travis@travispayne.com"` |
| `phone` | str | `"(323) 665-6680"` |
| `socialLinks` | map | `{instagram, twitter, youtube, imdb}` |
| `hirasCtaEnabled` | bool | `true` |
| `maintenanceMode` | bool | `false` |
| `analyticsEnabled` | bool | `true` |

**`siteSettings/homepage`**

| Field | Type | Example |
|---|---|---|
| `heroHeadline` | str | `"Movement Is the Message"` |
| `heroSubheadline` | str | |
| `heroVideoUrl` | str | |
| `heroCtaLabel` | str | `"Explore Productions"` |
| `heroCtaUrl` | str | `"/productions"` |
| `featuredProductionIds` | arr\[str\] | |
| `featuredBlogPostIds` | arr\[str\] | |

**`siteSettings/storeConfig`**

| Field | Type | Example |
|---|---|---|
| `shippingZones` | arr\[map\] | `[{label: "USA", rate: 800}]` |
| `taxEnabled` | bool | `true` |
| `taxMode` | str | `"stripe-tax"` |
| `freeShippingThreshold` | num | `10000` (cents) |
| `storeOpen` | bool | `true` |

---

### 3.14 `masterclassSeries` (optional grouping)

**Path:** `masterclassSeries/{seriesId}`

| Field | Type | Example |
|---|---|---|
| `title` | str | `"Urban Foundations"` |
| `slug` | str | `"urban-foundations"` |
| `description` | str | |
| `coverImageUrl` | str | |
| `price` | num | bundle price in cents |
| `stripePriceId` | str | |
| `status` | str | `"published"` |

---

### 3.15 `pages` (visual page builder)

Marketing pages edited via the Wix/Duda-style block editor are stored here as
serialized **Puck** content trees, with `draftData` and `publishedData` kept
separate, plus nav metadata (`slug`, `isHomepage`, `showInNav`, `navOrder`) and a
`pages/{pageId}/revisions/{revisionId}` subcollection for version history / rollback.
**Full schema, security rules, render route, and editor workflow are specified in
`docs/06-visual-editor-cms.md`.** Published pages are public-read; writes are
restricted to `editor` / `admin`.

---

## 4. Security Rules

### Posture

- **Public read:** any document where `status == "published"` in public collections
- **Authenticated read:** users can only read documents where `uid == request.auth.uid`
- **Editor write:** blog posts, productions, team, partners, masterclasses, media
- **Admin write:** everything including orders, customers, settings, products
- **No direct writes** to orders, enrollments — those are written only by Cloud Functions (service account)

### Representative `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── Helper functions ───────────────────────────────────────────
    function isSignedIn() {
      return request.auth != null;
    }
    function isOwner(uid) {
      return isSignedIn() && request.auth.uid == uid;
    }
    function hasRole(role) {
      return isSignedIn() && request.auth.token.role == role;
    }
    function isEditorOrAdmin() {
      return hasRole('editor') || hasRole('admin');
    }
    function isAdmin() {
      return hasRole('admin');
    }
    function isPublished(data) {
      return data.status == 'published';
    }

    // ── Blog Posts ────────────────────────────────────────────────
    match /blogPosts/{postId} {
      allow read: if isPublished(resource.data) || isEditorOrAdmin();
      allow create, update: if isEditorOrAdmin();
      allow delete: if isAdmin();
    }

    // ── Productions (portfolio) ──────────────────────────────────
    match /productions/{productionId} {
      allow read: if isPublished(resource.data) || isEditorOrAdmin();
      allow write: if isEditorOrAdmin();
    }

    // ── Products ─────────────────────────────────────────────────
    match /products/{productId} {
      allow read: if resource.data.status == 'active' || isAdmin();
      allow write: if isAdmin();

      match /variants/{variantId} {
        allow read: if get(/databases/$(database)/documents/products/$(productId)).data.status == 'active' || isAdmin();
        allow write: if isAdmin();
      }
    }

    // ── Orders ─── written only by Cloud Functions (service account)
    match /orders/{orderId} {
      allow read: if isOwner(resource.data.uid) || isAdmin();
      allow create, update: if false; // Cloud Function only
      allow delete: if false;
    }

    // ── Carts ─────────────────────────────────────────────────────
    match /carts/{cartId} {
      allow read, write: if isOwner(cartId) ||
        (request.auth == null && cartId == request.resource.data.sessionId);
    }

    // ── Customers ─────────────────────────────────────────────────
    match /customers/{uid} {
      allow read, update: if isOwner(uid) || isAdmin();
      allow create: if isOwner(uid);
      allow delete: if isAdmin();

      match /addresses/{addressId} {
        allow read, write: if isOwner(uid) || isAdmin();
      }
    }

    // ── Enrollments ── written only by Cloud Functions
    match /enrollments/{enrollmentId} {
      allow read: if isOwner(resource.data.uid) || isAdmin();
      allow write: if false; // Cloud Function only
    }

    // ── Masterclasses ─────────────────────────────────────────────
    match /masterclasses/{classId} {
      allow read: if isPublished(resource.data) || isEditorOrAdmin();
      allow write: if isEditorOrAdmin();

      match /lessons/{lessonId} {
        // Lesson body only readable if user has active enrollment
        allow read: if isEditorOrAdmin() ||
          (isSignedIn() && exists(/databases/$(database)/documents/enrollments/$(request.auth.uid + '_' + classId)));
        allow write: if isEditorOrAdmin();
      }
    }

    // ── Bookings ─────────────────────────────────────────────────
    match /bookings/{bookingId} {
      allow create: if true; // public form submission
      allow read, update: if isAdmin();
      allow delete: if isAdmin();
    }

    // ── Newsletter ────────────────────────────────────────────────
    match /newsletterSubscribers/{docId} {
      allow create: if true; // public opt-in
      allow read, update, delete: if isAdmin();
    }

    // ── Team / Partners ───────────────────────────────────────────
    match /team/{memberId} {
      allow read: if resource.data.status == 'active' || isEditorOrAdmin();
      allow write: if isEditorOrAdmin();
    }
    match /partners/{partnerId} {
      allow read: if resource.data.status == 'active' || isEditorOrAdmin();
      allow write: if isEditorOrAdmin();
    }

    // ── Site Settings ─────────────────────────────────────────────
    match /siteSettings/{key} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // ── Masterclass Series ────────────────────────────────────────
    match /masterclassSeries/{seriesId} {
      allow read: if isPublished(resource.data) || isEditorOrAdmin();
      allow write: if isEditorOrAdmin();
    }
  }
}
```

> **Note on enrollment path used in rules:** The lesson read check above uses a simplified composite ID pattern (`uid_classId`). In production, query the `enrollments` collection with a proper index instead, or use a callable Cloud Function to issue a short-lived signed URL for the video — this avoids the Firestore query inside security rules.

---

## 5. Store / E-Commerce

### Cart Flow

```
1. User browses products (Firestore, public read)
2. Add to cart → localStorage (guest) OR carts/{uid} (authed)
3. On checkout button: merge localStorage cart into Firestore carts/{uid}
4. POST /api/checkout (Next.js Route Handler)
```

### Checkout via Stripe

**Option A — Firebase Extension (recommended for speed):**  
Use the **"Run Payments with Stripe"** Firebase Extension (`stripe/firestore-stripe-payments`). It listens to a `customers/{uid}/checkout_sessions` subcollection; the client writes a checkout session doc; the extension calls Stripe and writes back the session URL.

**Option B — Custom Cloud Function (more control):**

```typescript
// functions/src/store/createCheckoutSession.ts
export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Login required");

  const { cartItems, successUrl, cancelUrl } = data;

  // Validate cart items against live Firestore product prices
  const lineItems = await validateAndBuildLineItems(cartItems);

  const stripe = new Stripe(await getSecret("STRIPE_SECRET_KEY"), { apiVersion: "2024-04-10" });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "google_pay", "apple_pay", "link"],
    line_items: lineItems,
    customer_email: context.auth.token.email,
    metadata: { uid: context.auth.uid },
    success_url: successUrl,
    cancel_url: cancelUrl,
    shipping_address_collection: { allowed_countries: ["US", "CA", "GB"] },
    automatic_tax: { enabled: true }, // Stripe Tax
    allow_promotion_codes: true,
  });

  return { url: session.url };
});
```

**Google Pay** is automatically enabled in Stripe Checkout as a payment method type — no extra integration needed. It appears on supported Android/Chrome browsers.

### Stripe Webhook (order fulfillment)

```typescript
// functions/src/store/stripeWebhook.ts
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"]!;
  const webhookSecret = await getSecret("STRIPE_WEBHOOK_SECRET");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    res.status(400).send("Webhook signature verification failed");
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    await fulfillOrder(session); // writes to Firestore orders, decrements inventory
  }

  if (event.type === "charge.dispute.created") {
    await flagOrder(event.data.object); // alert admin
  }

  res.status(200).send("OK");
});
```

### Inventory Management

- Physical products: `inventory` field on product/variant doc; Cloud Function decrements atomically using `FieldValue.increment(-qty)` after successful payment.
- Inventory goes below zero: flag doc with `inventoryAlert: true`; Cloud Scheduler job checks nightly and emails admin.
- Digital products: `inventory: -1` (unlimited); delivery is a GCS signed URL generated by Cloud Function and emailed.

### Tax & Shipping

- **Tax:** Enable **Stripe Tax** (automatic US sales tax, VAT globally). Set `automatic_tax.enabled: true` in checkout. No extra backend code needed.
- **Shipping:** Define shipping rates in Stripe Dashboard or use `shipping_options` in the session. Store zone config in `siteSettings/storeConfig`.

### Stripe Environment Variables (Cloud Functions, via Secret Manager)

```
STRIPE_SECRET_KEY         (sk_live_... / sk_test_...)
STRIPE_WEBHOOK_SECRET     (whsec_...)
STRIPE_PUBLISHABLE_KEY    (pk_live_... exposed to client via NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
```

---

## 6. Blog & CMS Strategy

### Options Evaluated

| Option | Pros | Cons |
|---|---|---|
| **Firestore + custom /admin panel** | No extra service, unified auth, real-time, free | Custom build time (~2–3 days) |
| Google Sheets as CMS | Zero-code content editing | No media handling, no drafts, fragile API |
| Headless CMS (Contentful, Sanity) | Rich editing experience | Extra cost, extra service, non-Google |

### Recommendation: Firestore + `/admin` Panel in Next.js

Build a `/admin` sub-application within the same Next.js project, protected by Firebase Auth (admin/editor claim required). Use a rich text editor (Tiptap or Lexical, both MIT-licensed) that serializes to Markdown stored in Firestore `blogPosts.bodyMdx`. This keeps all data in Firebase, uses the same auth system, and avoids paying for a third-party CMS.

**Admin panel pages:**
- `/admin/blog` — list, create, edit, publish/schedule posts
- `/admin/store` — product catalog, orders, inventory
- `/admin/masterclasses` — class + lesson management
- `/admin/productions` — portfolio CRUD
- `/admin/team` — team member management
- `/admin/partners` — partner logo management
- `/admin/settings` — site config / siteSettings docs
- `/admin/bookings` — inquiry queue
- `/admin/subscribers` — newsletter list + export

### Media Uploads (Images)

Use **Firebase Storage** with the **"Resize Images"** Firebase Extension:

```
Cloud Storage trigger: onFinalize
Input path:  /uploads/raw/{filename}
Output paths: /uploads/thumb/{filename}   (400×400)
               /uploads/medium/{filename}  (800×800)
               /uploads/large/{filename}   (1200×1200)
```

Admin panel uploads via the Firebase Storage SDK directly from the browser; receives the resized URL for storage in Firestore.

**Client SDK call:**
```typescript
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storageRef = ref(storage, `uploads/raw/${Date.now()}-${file.name}`);
await uploadBytes(storageRef, file, { contentType: file.type });
// Extension auto-resizes; poll or use Realtime DB for completion signal
```

### Blog Post Rendering

Render `bodyMdx` server-side in Next.js using `next-mdx-remote` or a simple `marked`/`remark` pipeline. Apply Tailwind Typography (`@tailwindcss/typography`) for styled prose output.

---

## 7. Masterclasses: Gated Video Content

### Video Storage & Streaming

**Do NOT store full video directly in Cloud Storage for streaming.** GCS serves raw bytes; it has no adaptive bitrate streaming (HLS/DASH), no thumbnail generation, and poor global performance for large files.

**Recommended: Mux** (non-Google, but the industry standard for creator video)

| Concern | Mux Answer |
|---|---|
| Adaptive streaming | Yes — HLS + DASH auto-generated |
| Signed playback URLs | Yes — per-token JWT signed URLs |
| Global CDN | Yes |
| Cost | ~$0.015/min stored + $0.00850/GB delivered |
| Firebase integration | Via Cloud Function (Mux API calls) |

**Alternative (free, but less control):** Upload to unlisted YouTube, embed with `<iframe>`. Loses gating ability unless using YouTube Data API v3 with unlisted links, which is fragile.

**Mux-as-a-service integration pattern:**

```typescript
// functions/src/masterclasses/getMuxSignedUrl.ts
export const getMuxPlaybackToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Login required");

  const { lessonId } = data;
  const uid = context.auth.uid;

  // 1. Look up lesson to get masterclassId
  const lessonDoc = await getLessonDoc(lessonId);
  const classId = lessonDoc.masterclassId;

  // 2. Check enrollment
  const enrollment = await getEnrollment(uid, classId);
  if (!enrollment || enrollment.status !== "active") {
    throw new functions.https.HttpsError("permission-denied", "No active enrollment");
  }

  // 3. Check custom claim (belt-and-suspenders)
  const userRecord = await admin.auth().getUser(uid);
  // optionally verify enrolledClasses claim includes classId

  // 4. Issue Mux signed JWT (short-lived, 6 hours)
  const muxJwt = signMuxToken(lessonDoc.muxPlaybackId, {
    expiration: "6h",
    keyId: await getSecret("MUX_SIGNING_KEY_ID"),
    privateKey: await getSecret("MUX_SIGNING_PRIVATE_KEY"),
  });

  return { token: muxJwt, playbackId: lessonDoc.muxPlaybackId };
});
```

Front end uses `@mux/mux-player-react` with the signed token.

### Enrollment Flow

```
Purchase masterclass → Stripe webhook → Cloud Function: onOrderFulfilled
  → writes enrollments/{uid}_{classId} doc
  → sets custom claim: enrolledClasses: [classId, ...]
  → sends welcome email via Trigger Email extension
```

### GCS Signed URLs (for digital downloads / PDF resources)

```typescript
import { Storage } from "@google-cloud/storage";
const storage = new Storage();

const [url] = await storage
  .bucket("travispayne-private")
  .file(`masterclass-resources/${lessonId}/guide.pdf`)
  .getSignedUrl({
    action: "read",
    expires: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
  });
```

---

## 8. Email & Notifications

### Firebase "Trigger Email" Extension

Install the **Trigger Email from Firestore** extension (powered by SendGrid or any SMTP provider):

- Extension listens to `mail/{docId}` collection
- Cloud Functions write to `mail` to queue emails
- Extension sends via configured SMTP/SendGrid

**Configuration env vars (set in Firebase Extension config):**
```
SMTP_HOST           smtp.sendgrid.net
SMTP_USER           apikey
SMTP_PASSWORD       <SendGrid API key — from Secret Manager>
DEFAULT_FROM        "Travis Payne Productions <noreply@travispayne.com>"
DEFAULT_REPLY_TO    travis@travispayne.com
```

> **Non-Google dependency note:** Google has no built-in transactional email service. **SendGrid** (now owned by Twilio) is the most popular option and has a Firebase-native extension. Mailgun and Postmark are solid alternatives. Budget: SendGrid free tier handles 100 emails/day; Essentials plan is ~$20/month for 50k/month.

### Email Trigger Pattern

```typescript
// From any Cloud Function:
async function sendOrderConfirmation(order: Order) {
  await admin.firestore().collection("mail").add({
    to: order.email,
    template: {
      name: "order-confirmation",
      data: {
        customerName: order.shippingAddress.name,
        orderNumber: order.id,
        lineItems: order.lineItems,
        total: formatCents(order.total),
        trackingUrl: null,
      },
    },
  });
}
```

### Email Use Cases & Triggers

| Trigger | Email Sent | Cloud Function |
|---|---|---|
| Order paid (`checkout.session.completed`) | Order confirmation | `stripeWebhook` |
| Enrollment created | Masterclass welcome + access link | `onEnrollmentCreate` |
| Booking inquiry submitted | Admin alert + auto-reply to user | `onBookingCreate` |
| Newsletter signup | Welcome email | `onSubscriberCreate` |
| Order shipped (admin updates `trackingNumber`) | Shipping notification | `onOrderUpdate` |
| Weekly digest (Cloud Scheduler) | "What's new" newsletter | `sendWeeklyDigest` |
| Password reset | Firebase Auth built-in | (native) |

---

## 9. Forms & Spam Protection

### reCAPTCHA Enterprise + Firebase App Check

```
Contact / Booking form submission:
  1. Client calls grecaptcha.enterprise.execute(siteKey, {action: "submit_booking"})
  2. Receives token
  3. Sends token + form data to Next.js Route Handler /api/submit-booking
  4. Route Handler calls Cloud Function verifyAndSaveBooking (callable)
  5. Cloud Function: calls reCAPTCHA Enterprise API with token + expected action
  6. Checks score >= 0.5
  7. Saves to Firestore bookings collection
  8. Queues email notification
```

**reCAPTCHA Enterprise setup:**
- Enable in Google Cloud Console → Security → reCAPTCHA Enterprise
- Add site key to client (`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`)
- Store API key in Secret Manager (`RECAPTCHA_API_KEY`)

**Firebase App Check** additionally protects Firestore/Storage/Functions from unauthorized API access:
- Register Next.js app with App Check → use reCAPTCHA v3 provider
- Enable enforcement in Firebase Console after testing
- SDK init:

```typescript
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
  isTokenAutoRefreshEnabled: true,
});
```

### Newsletter Subscribe

```
Form → POST /api/subscribe (Next.js Route Handler)
      → reCAPTCHA verify
      → Check if email hash already exists in newsletterSubscribers
      → Upsert doc (idempotent)
      → Queue welcome email
      → Return 200 OK
```

---

## 10. Search, Analytics, SEO & Scheduling

### Search

Firestore has limited full-text search. Options:

| Option | Recommendation |
|---|---|
| **Algolia** (non-Google) | Best UX, easy Firebase integration, free tier sufficient |
| **Typesense** (self-hosted) | Open-source alternative, deploy on Cloud Run |
| Simple Firestore query | Works for category/tag filtering; not full-text |

**Recommended approach for V1:** Firestore array-contains + range queries cover tag/category filtering (blog, store). For site-wide search, add Algolia in V2 — the Firebase Extension "Search with Algolia" syncs Firestore collections automatically.

### Google Analytics 4 + Tag Manager

```typescript
// app/layout.tsx (Next.js App Router)
import { GoogleTagManager } from "@next/third-parties/google";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
        {children}
      </body>
    </html>
  );
}
```

- GA4 property connected via GTM
- Custom events: `view_masterclass`, `add_to_cart`, `begin_checkout`, `purchase`, `booking_inquiry_submitted`
- GA4 Audiences → remarketing (optional Google Ads integration)

### SEO

**Sitemap:** Cloud Scheduler triggers a Cloud Function daily that queries Firestore for all published blog posts, productions, and products, then writes `sitemap.xml` to Cloud Storage with a public URL. Alternatively, generate dynamically via Next.js `app/sitemap.ts` (recommended for < 5,000 URLs):

```typescript
// app/sitemap.ts
import { collection, getDocs, query, where } from "firebase/firestore";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedBlogPosts(); // server-side Firestore call
  return [
    { url: "https://travispayne.com", lastModified: new Date() },
    { url: "https://travispayne.com/productions", lastModified: new Date() },
    ...posts.map(p => ({
      url: `https://travispayne.com/blog/${p.slug}`,
      lastModified: p.updatedAt.toDate(),
    })),
  ];
}
```

**Structured Data (JSON-LD):** Serve from component level for productions (CreativeWork), blog posts (Article), products (Product), and person pages (Person). Data pulled from Firestore doc fields at render time.

**robots.txt:** Static file in `/public/robots.txt`.

### Google Calendar API (Booking Availability)

Connect Travis's Google Calendar to the booking form to show available dates:

```typescript
// functions/src/bookings/getAvailability.ts
import { google } from "googleapis";

export const getAvailability = functions.https.onCall(async (data, _context) => {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    keyFile: undefined, // use Application Default Credentials (service account)
  });

  const calendar = google.calendar({ version: "v3", auth: await auth.getClient() });

  const { data: freeBusy } = await calendar.freebusy.query({
    requestBody: {
      timeMin: data.startDate,
      timeMax: data.endDate,
      items: [{ id: await getSecret("GOOGLE_CALENDAR_ID") }],
    },
  });

  return { busySlots: freeBusy.calendars };
});
```

Front-end date picker disables busy dates in real time.

---

## 11. CI/CD, Environments & Backups

### Three Firebase Projects

| Environment | Firebase Project | Deployment Trigger |
|---|---|---|
| `dev` | `travispayne-dev` | Local `firebase emulators:start` |
| `staging` | `travispayne-staging` | Push to `main` branch |
| `production` | `travispayne-prod` | Push tag `v*.*.*` OR manual |

### Firebase App Hosting (Recommended)

Firebase App Hosting (GA 2024) natively builds and hosts Next.js App Router apps with SSR support, ISR, and Edge functions — no Vercel needed:

```yaml
# apphosting.yaml
runConfig:
  minInstances: 0
  maxInstances: 10
  concurrency: 80
  cpu: 1
  memoryMiB: 512
env:
  - variable: NODE_ENV
    value: production
  - variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
    value: travispayne-prod
  - variable: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    secret: STRIPE_PUBLISHABLE_KEY  # from Secret Manager
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY_STAGING }}
      - run: npx firebase deploy --project travispayne-staging --only firestore:rules,firestore:indexes,functions,hosting
```

### Secret Manager

All secrets stored in Cloud Secret Manager and accessed by Cloud Functions:

```typescript
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();

async function getSecret(name: string): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: `projects/${process.env.GCLOUD_PROJECT}/secrets/${name}/versions/latest`,
  });
  return version.payload!.data!.toString();
}
```

### Firestore Backups

- Enable **Firestore managed exports** via Cloud Scheduler daily:

```bash
gcloud firestore export gs://travispayne-backups/$(date +%Y-%m-%d)
```

- Cloud Scheduler job: `0 3 * * *` (3 AM UTC daily)
- Retain 30 days; GCS lifecycle rule auto-deletes older backups
- Backups stored in a separate GCS bucket (`travispayne-backups`) with Uniform Bucket-Level Access

### Firebase Emulators (local dev)

```bash
firebase emulators:start --import=./emulator-data --export-on-exit
```

Emulators: Auth, Firestore, Functions, Storage, Hosting, Pub/Sub.

---

## 12. Monthly Cost Estimate

All estimates based on **Firebase Blaze (pay-as-you-go)** plan. Firebase has generous free tiers that count even on Blaze.

### Low Traffic (~1,000 MAU, ~500 pageviews/day)

| Service | Usage Est. | Monthly Cost |
|---|---|---|
| Firebase App Hosting | ~50GB bandwidth, 500k requests | ~$5 |
| Cloud Firestore | ~100k reads, 20k writes, 1GB stored | Free tier covers it → ~$0 |
| Cloud Storage | ~5GB stored, ~10GB egress | ~$1 |
| Cloud Functions | ~100k invocations, ~200 CPU-sec | Free tier → ~$0 |
| Firebase Auth | <10k MAU | Free → $0 |
| Mux video (est. 100 stream-hours) | 100 min stored + 50GB delivered | ~$8 |
| SendGrid (email) | <3k emails/month | Free tier → $0 |
| reCAPTCHA Enterprise | <10k assessments/month | Free → $0 |
| Secret Manager | <10k accesses | ~$0.03 |
| Cloud Scheduler | 5 jobs | Free tier → $0 |
| Algolia (optional search) | Free tier (10k searches) | $0 |
| **Estimated Total** | | **~$15–$20/month** |

### Medium Traffic (~10,000 MAU, ~5,000 pageviews/day, active store)

| Service | Usage Est. | Monthly Cost |
|---|---|---|
| Firebase App Hosting | ~500GB bandwidth, 5M requests | ~$50 |
| Cloud Firestore | ~1M reads, 200k writes, 10GB stored | ~$5 |
| Cloud Storage | ~50GB stored, ~100GB egress | ~$12 |
| Cloud Functions | ~1M invocations, 5,000 CPU-sec | ~$5 |
| Firebase Auth | <50k MAU | Free → $0 |
| Mux video (est. 1,000 stream-hours) | 500 min stored + 500GB delivered | ~$50 |
| SendGrid Essentials | ~20k emails/month | ~$20 |
| reCAPTCHA Enterprise | ~100k assessments | ~$1 |
| Secret Manager | ~100k accesses | ~$0.30 |
| Stripe fees | 2.9% + $0.30/transaction (external) | Varies |
| Algolia Build plan | 100k searches | ~$50 |
| **Estimated Total** | | **~$195–$250/month** |

> Stripe fees (2.9% + $0.30/transaction) are the biggest variable cost at scale. On $10,000/month GMV: ~$320/month in Stripe fees.

### Scaling Notes

- Firestore scales automatically; costs grow linearly with reads/writes.
- Firebase App Hosting auto-scales instances; set `maxInstances: 20` on Cloud Functions to control cost ceiling.
- Mux is the second-largest cost driver if masterclass streaming is popular. Consider Mux pricing carefully before offering unlimited streaming subscriptions — factor into membership pricing.

---

## 13. Features the Client Hasn't Thought Of

Prioritized by value and implementation effort:

### Priority 1 — High Value, Feasible Early

1. **Booking availability calendar** — Embed a Google Calendar-connected date picker on the Contact/Booking page. Clients see real-time availability and request specific dates. Reduces back-and-forth email. *(See §10 Google Calendar API)*

2. **Press / EPK (Electronic Press Kit)** — A `/press` page with downloadable high-res photos, bio PDFs, production credits, and a logos-for-press package. Content managed in `/admin`. Press kits can be gated (require email capture) to build the newsletter list.

3. **Email automation sequences** — After masterclass enrollment: Day 1 welcome, Day 3 "how's your practice going?", Day 7 next-module reminder. After store purchase: Day 5 product satisfaction follow-up. Implemented via Cloud Scheduler + Firestore `scheduledEmails` collection.

4. **Masterclass progress tracking + certificate of completion** — Lesson completion tracked in `enrollments.progress`. On 100% completion, Cloud Function auto-generates a PDF certificate (using Puppeteer on Cloud Run) and emails it. Shareable on LinkedIn. High perceived value.

### Priority 2 — Medium Term

5. **Membership / subscription model** — Monthly or annual subscription for "all-access" masterclass library. Stripe Subscriptions API, synced to Firebase via webhook. Sets `subscription: active` custom claim. Recurring revenue for Travis.

6. **Gift cards** — Stripe Gift Cards (beta) or a simple promo code system. Useful for holiday sales and corporate gifting (entertainment companies buy dance training for staff).

7. **Affiliate / referral program** — Give dance teachers or influencers a unique code; track conversions in Firestore `referrals` collection; pay commissions manually or via Stripe Transfer. Expands reach into dance education communities.

8. **Admin analytics dashboard** — `/admin/analytics` pulling from Firestore aggregated data: revenue by period, top products, masterclass completion rates, new subscriber trends. Use Google Charts or Recharts. Gives Travis real business intelligence without logging into multiple dashboards.

9. **Multi-language support (i18n)** — Travis is a global figure. Next.js `next-intl` library + translation strings in `siteSettings/i18n/{locale}` docs. Spanish and Japanese would serve key markets given the Michael Jackson / entertainment industry connections.

### Priority 3 — Longer Term

10. **Live virtual masterclass / workshop events** — Zoom or Google Meet integration for live sessions; ticketed via the store; auto-send join link to attendees. Cloud Function generates Meet link via Google Meet API on purchase.

11. **Community forum / student lounge** — Post-masterclass engagement. Firebase Realtime Database or Firestore for threaded discussions within each masterclass. Boosts retention and justifies subscription pricing.

12. **Physical class / workshop locator** — If Travis teaches in-person workshops, a searchable map (`/workshops`) with date/location data in Firestore `workshops` collection. Google Maps JavaScript API embed.

13. **HIRAS platform integration** — HIRAS is already referenced in the sitemap. Treat it as a separate product line: dedicated landing page, separate enrollment flow, potentially a separate Firebase project or sub-application. Build as a Firestore collection `hiras` with its own products and enrollments.

14. **Loyalty / points program** — Award points for purchases, masterclass completion, social shares. Points tracked in `customers.loyaltyPoints`. Redeem for store discounts. Increases LTV and repeat purchase rate.

15. **AI-powered content assistant (admin)** — In the `/admin/blog` editor, a "Draft with AI" button calls the Vertex AI Gemini API (Google Cloud, fully on-stack) to generate a blog post draft from a title prompt. Keeps content creation fast for a busy creator.

---

## Integration Seam Summary (Web Developer Reference)

### Firebase SDK init (`lib/firebase.ts`)

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "us-central1");

// Typed callable functions
export const createCheckoutSession = httpsCallable(functions, "createCheckoutSession");
export const getMuxPlaybackToken = httpsCallable(functions, "getMuxPlaybackToken");
export const getAvailability = httpsCallable(functions, "getAvailability");
export const verifyAndSaveBooking = httpsCallable(functions, "verifyAndSaveBooking");
```

### Key Env Vars (`.env.local` / Firebase App Hosting secrets)

```bash
# Firebase (public — safe in client bundle)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Stripe (publishable key is public; secret key is Secret Manager only)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# reCAPTCHA (site key is public)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=

# Mux (public playback domain, no secret)
NEXT_PUBLIC_MUX_ENV_KEY=

# Server-only (Next.js Route Handlers / Cloud Functions via Secret Manager)
# STRIPE_SECRET_KEY         — Secret Manager
# STRIPE_WEBHOOK_SECRET     — Secret Manager
# SENDGRID_API_KEY          — Secret Manager
# MUX_TOKEN_ID              — Secret Manager
# MUX_TOKEN_SECRET          — Secret Manager
# MUX_SIGNING_KEY_ID        — Secret Manager
# MUX_SIGNING_PRIVATE_KEY   — Secret Manager
# RECAPTCHA_API_KEY         — Secret Manager
# GOOGLE_CALENDAR_ID        — Secret Manager
```

### Cloud Function Endpoints

| Function name | Trigger type | Purpose |
|---|---|---|
| `createCheckoutSession` | HTTPS Callable | Validates cart, creates Stripe session |
| `stripeWebhook` | HTTPS Request | Handles all Stripe webhook events |
| `getMuxPlaybackToken` | HTTPS Callable | Issues signed Mux JWT for gated lessons |
| `verifyAndSaveBooking` | HTTPS Callable | reCAPTCHA verify + save booking inquiry |
| `getAvailability` | HTTPS Callable | Google Calendar free/busy query |
| `onUserCreate` | Auth trigger | Sets `customer` custom claim |
| `onOrderFulfilled` | Firestore trigger | Creates enrollment, sends email |
| `onBookingCreate` | Firestore trigger | Sends admin alert + user auto-reply |
| `onBlogPostWrite` | Firestore trigger | Regenerates sitemap |
| `generateSitemap` | Cloud Scheduler | Daily sitemap refresh |
| `pruneExpiredCarts` | Cloud Scheduler | Weekly guest cart cleanup |
| `sendWeeklyDigest` | Cloud Scheduler | Newsletter digest email |

---

*Document version: 1.0 — 2026-06-23*  
*Prepared for the Travis Payne Productions website rebuild project.*
