# Travis Payne — Website Editor: Owner's Manual

A plain-language guide to designing and publishing your own pages with the built-in
**Studio** editor. No coding needed. Keep this handy or share it with your team.

---

## 1. What this is
Studio is a **drag-and-drop website editor** (like Wix). You place text, images, buttons,
and shapes anywhere on the page, style them however you like, design separate looks for
phone and computer, and **publish** them to your live site.

## 2. What you need
- The **editor address**: `https://travispayne.com/studio` (or your preview link ending in `/studio`).
- A **sign-in** (email + password). **You must log in to open the editor** — your developer
  creates your login in Firebase and gives it to you. (Only approved editor emails can sign in.)

## 3. Log in and open the editor
1. Go to **`/studio`** — you'll be sent to the **sign-in** page (`/studio/login`).
2. Enter your **email and password** and click **Sign in**.
3. You'll land on the **Studio** page list. Click **New page** (or **Edit** on an existing one).
4. The editor opens full-screen. (To leave, use **Sign out** on the Studio page.)

## 4. The editor at a glance
- **Top bar (toolbar):** page title, the page's **URL slug**, device buttons
  (Desktop / Tablet / Mobile), **Undo/Redo**, **+ Add**, **Sign out**, **Preview**, **Save**,
  **Publish**.
- **Middle (canvas):** your page. A faint grid helps you line things up.
- **Right (inspector):** settings for whatever you've selected (text, color, size, position…).

## 5. Add something
Click **+ Add**, then choose:
- **Heading** – big title text
- **Text** – a paragraph
- **Button** – a clickable button (you set where it links)
- **Image** – a picture (**upload your own** from your computer, or paste a web address)
- **Box** – a colored rectangle (great for backgrounds/dividers)
- **Divider** – a thin line
The item appears on the canvas — now move and style it.

## 6. Move, resize, layer
- **Move:** click an item and **drag** it anywhere.
- **Resize:** click it, then drag the little **square handles** on its edges/corners.
- **Nudge:** select it and tap the **arrow keys** (hold **Shift** to move further).
- **Delete:** select it and press **Delete** (or use **Delete** in the right panel).
- **Layering:** in the right panel under **Arrange**, use **Bring forward / Send backward**
  to control what sits on top.
- **Rotate:** set the **Rotation** number in the right panel (under Position).

## 7. Edit the words and pictures
With an item selected, use the right panel's **Content** section:
- **Text/Heading/Button:** type your words in the box.
- **Button:** also set the **Link URL** (where it goes when clicked).
- **Image:** click **Upload / choose image** to open the **media library** — drag a picture
  in (or click **Choose a file**) to upload it from your computer, or click any image you've
  already uploaded to reuse it. You can also paste an **Image URL** instead. Always add
  **Alt text** (a short description — it helps accessibility and Google).
  *(Uploading needs you to be signed in; your developer enables Cloud Storage once — see
  troubleshooting below.)*

## 8. Style it (any color, font, size)
In the right panel:
- **Color** and **Background** – click the swatch to pick any color.
- **Font** – choose a font; **Size**, **Weight** (boldness), and **Align** (left/center/right).
- **Corner radius** – round the corners; **Opacity** – make it see-through.
You have full freedom here — tip: stick to two or three colors and one or two fonts for a
polished, on-brand look.

## 9. Design for phone and tablet
This is important. Use the **Desktop / Tablet / Mobile** buttons in the top bar to switch
views. **Each device has its own layout** — moving or resizing on Mobile does **not** change
Desktop. So:
1. Design **Desktop** first.
2. Switch to **Mobile**, then tidy up positions/sizes for the smaller screen.
3. Check **Tablet** too.
You can also tick **"Hidden on Mobile"** (right panel) to hide an item on a specific device.

## 10. Pages and their web address
- The **page title** (top bar) is just for you.
- The **URL slug** (the `/your-slug` box) is the page's web address, e.g. typing `press`
  publishes to `travispayne.com/press`.
- Slugs use **lowercase letters, numbers, and hyphens** only (no spaces).
- Some addresses are reserved by the main site (home, about, productions, team, partners,
  blog, store, masterclasses, contact, book) — pick a different slug for your custom pages.
- Manage pages from the **/studio** list: **New page**, **Edit**, **Delete**.

## 11. Saving, undo, preview
- **Autosave:** your work saves automatically as you go (to this browser, and to the cloud
  once you're signed in).
- **Save:** click it anytime to save immediately.
- **Undo / Redo:** in the top bar (or Ctrl/Cmd-Z style via the buttons).
- **Preview:** hides the editing tools so you see the page as visitors will. Click **Exit
  preview** to return.

## 12. Publish (put it online)
1. Set the **URL slug** in the top bar.
2. Click **Publish** (you're already signed in from opening the editor).
3. You'll see **"Published → /your-slug"** — your page is now live at
   `travispayne.com/your-slug`. Re-publish anytime you make changes.

## 13. Tips for a great page
- **Less is more** — generous spacing reads as premium.
- **Two or three colors, one or two fonts.** Use the gold (#C8A96E) sparingly for emphasis.
- **Always add Alt text** to images.
- **Check Mobile** before publishing — most visitors are on phones.
- **Preview** before you publish.

## 14. Troubleshooting
- **"Publish failed — enable Firestore…":** the database isn't turned on yet. Ask your
  developer to complete the one-time Firebase setup (see `docs/09-firebase-deploy.md`).
- **Can't sign in / "not an editor":** confirm Email/Password sign-in is enabled and your
  account exists in Firebase, that your email is on the editor allowlist, and double-check the
  password. The login page is at **`/studio/login`**.
- **"Could not load your media" / upload fails:** make sure you're **signed in**, and ask your
  developer to enable **Cloud Storage** and deploy the storage rules (one-time, see
  `docs/09-firebase-deploy.md`). Images must be under **10 MB**.
- **My page isn't at the address I expected:** make sure you set the **slug** and clicked
  **Publish**, and that the slug isn't a reserved one (section 10).
- **I lost changes:** changes autosave to your browser; if you switch devices, sign in so
  your work syncs to the cloud.

## 15. Quick glossary
- **Element** – anything you place (text, image, button, box…).
- **Canvas** – the page area you design on.
- **Inspector / panel** – the right-side settings.
- **Slug** – the page's web address piece (`/press`).
- **Draft vs Published** – your private working copy vs the live version visitors see.
- **Breakpoint / device** – Desktop, Tablet, or Mobile layout.

---

*Questions or a feature you want? Tell your developer — the editor is built to grow
(coming next: snapping guides, drag-to-rotate, and a templates gallery).*
