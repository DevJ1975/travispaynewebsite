# 01 — Current Site Audit (travispayne.com)

> Snapshot of the existing **Duda**-hosted site, reconstructed from public pages,
> search results, Wikipedia, and social profiles. Items marked _(reconstructed)_
> should be verified against the live site / client before the content freeze.

## 1. What it is
The current site is a **Duda** (no-code website builder) site for **Travis Payne**,
a world-renowned choreographer, director, and producer, and his company
**Travis Payne Productions (TPP)**, founded **2011** (filmed, live & branded
entertainment). Frequent creative partner: **Stacy Walker**. Represented by **UTA**.

## 2. Sitemap (current Duda pages)

| Page | Current URL | Purpose | New route (target) |
|---|---|---|---|
| Home | `/` | Hero, intro, highlights | `/` |
| About | `/read-more` ("ABOUT TRAVIS PAYNE") | Full bio | `/about` |
| Team | `/teams` | Roster (roles: Co-Director/Choreographer/Producer; Producer/Developer) | `/team` |
| Partners | `/partners` | Brand & creative partners | `/partners` |
| Productions | `/category/dance-entertainment` | Portfolio of work | `/productions` (+ `/productions/[slug]`) |
| Store | `/store` ("TPX Store" — *Travis Payne Experience*) | Merch / products | `/store` (+ `/store/[product]`) |
| HIRAS | `/hiras---landing-page` | Campaign/landing page _(reconstructed)_ | `/hiras` or campaign route |
| Contact | `/contact` | Contact form & details | `/contact` + `/book` |

**301 redirects** from every old URL to the new route are required to preserve SEO
(see `02-frontend-architecture.md`).

## 3. Biography / key facts (for the About page)

- Began dancing at **age 7 in Atlanta**.
- **1990** — joined **Janet Jackson's *Rhythm Nation 1814* World Tour**.
- **1992** — began a ~**20-year** collaboration & friendship with **Michael Jackson**
  (dancer in *Remember The Time*).
- **2009** — **Associate Director & Choreographer** of Michael Jackson's
  ***This Is It*** tour; **Associate Producer** of the *This Is It* documentary,
  which grossed **$261.3M** worldwide — the **highest-grossing concert documentary
  of all time (Guinness)**.
- Also worked on **Dancing With the Stars**, the **American Music Awards**, the
  **Global Michael Jackson Memorial Simulcast**, and **both Cirque du Soleil MJ
  productions**.
- **Awards:** 3 × American Choreography Awards; 3 × MTV Video Music Awards
  (incl. *Scream*); MTV nomination for Mya's *My Love is Like…Wo*.

### Client roster (partial)
Beyoncé · Usher · Sting · TLC · Madonna · Mariah Carey · Lenny Kravitz · Diana Ross ·
Brandy · Quincy Jones · Mick Jagger · Paula Abdul · Ricky Martin · Miley Cyrus ·
En Vogue · Shanice · Tamia · Smokey Robinson · Patti LaBelle · Gladys Knight ·
Dionne Warwick.

## 4. Contact & social

- **Phone:** (323) 665-6680
- **Email:** travis@travispayne.com
- **Agency:** United Talent Agency (UTA)
- **Social:** Facebook `@TRAVISPAYNEOFFICIAL` · Instagram `@travispayne1` ·
  X/Twitter `@ItsTravisPayne` · TikTok `@travispayneproductions` ·
  YouTube `@TravisPayne1` · LinkedIn (Travis Payne).

## 5. Known offerings to feature
- **Online dance Masterclasses** — Travis Payne & Stacy Walker (video coaching).
- **TPX Store** — merchandise / the "Travis Payne Experience."
- **Booking** for choreography / direction / production & branded entertainment.

## 6. Weaknesses of the current Duda site (why rebuild)
- Generic no-code template look; doesn't reflect an A-list / cinematic pedigree.
- Limited control over performance, SEO, structured data, and Core Web Vitals.
- Blog and store are constrained by Duda's built-in modules; hard to extend
  (memberships, gated masterclass video, booking, email automation).
- Vendor lock-in; no real codebase, version control, or CI/CD.
- Limited media art-direction (hero reels, lightbox galleries, motion).

## 7. Assets to gather before build (content checklist)
- [ ] High-res photography & logo files (SVG preferred).
- [ ] Show reel / hero video (with poster frames) and per-production clips.
- [ ] Final bio copy + team bios + headshots + roles.
- [ ] Partner logos (with usage permission).
- [ ] Production case studies (title, year, role, credits, media).
- [ ] Store product catalog (SKUs, prices, images, variants, shipping).
- [ ] Masterclass curriculum + video files + pricing.
- [ ] Legal: privacy policy, terms, store/returns policy, image rights.

> Verification of the live Duda pages was limited by bot-blocking (HTTP 403). Confirm
> _(reconstructed)_ items and exact copy/media with the client during content freeze.
