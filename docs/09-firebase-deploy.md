# 09 — Firebase connection & deployment (project `travis-payne`)

## 1. Connection — DONE in code
The public web config for **`travis-payne`** is baked into `src/lib/firebase/client.ts`
(env vars override it), and GA4 initializes client-side via `FirebaseAnalytics`. No further
code is needed to connect. To point a build at a different project, set the
`NEXT_PUBLIC_FIREBASE_*` vars (see `.env.example`).

## 2. One-time Firebase console setup (owner)
In the [Firebase console](https://console.firebase.google.com/project/travis-payne):
1. **Authentication → Sign-in method →** enable **Email/Password**. Add the owner's user
   (Users → Add user) and add that email to `NEXT_PUBLIC_EDITOR_EMAILS`.
2. **Firestore Database →** create database (production mode).
3. **Storage →** enable (for media uploads).
4. **Upgrade to the Blaze plan** (required for App Hosting / Cloud Functions).
5. Deploy rules (from this repo): `firebase deploy --only firestore:rules,storage` (see §4 for auth).

## 3. Deploy the site — use **Firebase App Hosting** (SSR), not classic Hosting
This is a server-rendered Next.js app (Server Actions, middleware, dynamic routes), so classic
static Hosting won't work. `apphosting.yaml` is already configured.

**Recommended — console (no secrets in chat):**
1. Firebase console → **App Hosting → Get started**.
2. **Connect this GitHub repo** and the branch you want to serve.
3. App Hosting builds on every push and gives you a live URL. Set env/secrets there (see §5).

**Alternative — CLI (needs a token):**
```bash
npm i -g firebase-tools
firebase login                      # interactive (do this on your machine), or:
# CI/headless: set FIREBASE_TOKEN, then run with --token "$FIREBASE_TOKEN"
firebase use travis-payne
firebase deploy --only firestore:rules,storage
firebase apphosting:backends:create   # first time; then deploys follow GitHub
```
> I can run the deploy from here **only** if you add a `FIREBASE_TOKEN` (or service-account
> JSON) as an **environment secret** — never paste secrets into chat.

## 4. Auth for CLI deploys
- Interactive: `firebase login` on your own machine.
- Headless/me: add **`FIREBASE_TOKEN`** as a session/environment secret.

## 5. Secrets for server-side features
Server features (SSR of editor-built pages, `__session` admin cookie, Stripe webhook) need a
service account. Add **`FIREBASE_SERVICE_ACCOUNT_JSON`** as an App Hosting secret
(`firebase apphosting:secrets:set`), plus `STRIPE_*` / `MUX_*` as needed (see `.env.example`).
Recommend enabling **App Check** before launch.

## 6. Note
The app already auto-deploys on **Vercel** (preview per PR). App Hosting runs it on Google
instead of / in addition to Vercel — your choice of primary host.
