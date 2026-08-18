# Know Your Right

A clean, no-nonsense reference app where any Nigerian can look up what the law
actually says — the **Constitution**, **traffic fines**, and **what their state
can and can't do** — and connect to a **real lawyer** when they need one.

> Not an AI chatbot, not a legal-advice generator, not a forum. A trustworthy
> reference tool with a clear escape hatch to a human professional.

Built with **React + Vite + Tailwind**, shipped as an installable **PWA** that
works offline once loaded.

---

## Quick start

Requires Node 18+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # serve the built app
```

> On Windows PowerShell, if `npm` is blocked by execution policy, use `npm.cmd`.

---

## What's inside (MVP)

- **Search-first home** — one search bar, instant local filtering, top category tiles.
- **Constitution & Rights** — Chapter IV fundamental rights in plain language,
  with a **"show original wording"** toggle, plus practical guides ("If you are
  arrested", "If you are stopped while driving").
- **Traffic Laws & Fines** — searchable, filterable, sortable table of FRSC
  offences, fines and penalty points.
- **Federal & State Powers** — who controls the police, land, tenancy, okada bans, etc.
- **Save / bookmark** — kept locally on the device (works offline).
- **Hire a Lawyer** — persistent in the bottom nav. A short structured form
  (issue → state → description) → a shortlist of vetted lawyers → connect via
  **call or WhatsApp**. No chatbot, no forced payment.
- **Trust & freshness** — a plain disclaimer near legal content and a
  **"last verified"** date on every entry (flagged stale after 6 months).

---

## Design direction

Superclean and document-like, not "techy". Black ink on warm off-white paper,
one restrained **deep-green** accent, two typefaces (**Lora** for authoritative
headings, **Inter** for body), simple line icons only. Generous white space,
large tap targets, visible focus rings, reduced-motion support.

---

## Project layout

```
src/
  main.jsx                 # entry (HashRouter -> works on any static host)
  App.jsx                  # routes
  index.css                # Tailwind layers + component classes
  components/
    Layout.jsx             # top bar + persistent bottom nav (Hire is prominent)
    Brand.jsx, Icon.jsx    # wordmark + line-icon mapper (lucide-react)
    SearchBar.jsx, EntryListItem.jsx
    BookmarkButton.jsx, Disclaimer.jsx, LastVerified.jsx
  views/
    Home.jsx, SearchResults.jsx, Category.jsx, Entry.jsx
    TrafficFines.jsx, Bookmarks.jsx
    HireStart.jsx, HireMatches.jsx
    About.jsx, NotFound.jsx
  data/
    categories.js          # top-level topics (some "coming soon")
    constitution.js        # Chapter IV rights + practical guides
    traffic.js             # FRSC offences / fines / points
    powers.js              # federal vs state powers
    lawyers.js             # SAMPLE lawyer directory (placeholder data)
    meta.js                # disclaimer, privacy, states, issue types
    index.js               # combined entries + local ranked search
  lib/
    bookmarks.js           # localStorage store (useSyncExternalStore)
    format.js, labels.js
public/                    # icon.svg, icon-maskable.svg, favicon.svg
```

---

## Content & verification

Content is written from official sources: the **1999 Constitution (as amended)**,
**FRSC** road-traffic penalties, and the **Legislative Lists** in the
Constitution. Because the law changes:

- every entry carries a `lastVerified` date and a `source`;
- anything older than ~6 months is flagged **"Needs re-check"** in the UI;
- **traffic fines are shown as a guide** with a visible "confirm with FRSC" note.

> ⚠️ The lawyer directory in `src/data/lawyers.js` is **sample/placeholder data**
> for the MVP (fictional names, placeholder phone numbers). Replace it with
> manually vetted lawyers (bar/licence checked) before going live.

This is **general legal information, not legal advice.**

---

## Admin console & CMS

Open **`/admin`** (linked from the About page, or go to `…/#/admin`).

- **Dashboard** — counts of content, lawyers awaiting review, new cases, open chats.
- **Content** — add / edit / delete Constitution, powers and traffic entries; edits show live in the app; "Reset" restores the built-in defaults.
- **Lawyers** — approve / suspend, edit, add or remove directory entries (only *approved* lawyers appear to users).
- **Cases** — every Hire-a-Lawyer request lands here with a status workflow (new → reviewing → matched → closed) and an internal note.
- **Support** — reply to user conversations in a live chat; mark resolved / reopen.

> **Demo mode:** with no backend connected, any email/password signs you in as
> admin and all data is stored in this browser (open the app in one tab and
> `/admin` in another to see live support replies). This is for exploration only.

## Backend (Supabase) — optional, plug-and-play

The app + CMS run browser-local until you connect Supabase; then they use a real
multi-user backend with server-enforced admin access (RLS) and realtime chat.

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query →** paste [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. In **Auth → Providers**, enable **Anonymous sign-ins** (so support chat works for guests).
4. **Project Settings → API** → copy the **Project URL** and **anon public** key.
5. Set env vars (`.env.local` locally; Vercel/host env for prod):
   ```
   VITE_SUPABASE_URL=https://<ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key>
   ```
6. Sign up once, then make yourself admin:
   ```sql
   update public.profiles set is_admin = true where email = 'you@example.com';
   ```

## Roadmap (summary)

- **Phase 1 (MVP, done here):** Constitution, Traffic, Federal/State powers,
  search, bookmarks, static Hire-a-Lawyer flow, disclaimer + verified dates.
- **Phase 2:** Tenancy, Employment, Consumer rights, Business/CAC; lawyer
  self-onboarding + approval; ratings/reviews; push notifications.
- **Phase 3:** state-by-state content, in-app escrow payments, human-reviewed
  FAQ, multi-language (Hausa, Yoruba, Igbo, Pidgin).

