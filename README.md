# MindLine — Mental Health Awareness & Helpline Directory

An empathetic, privacy-first, offline-first web app for crisis support. Built from the PRD using a MERN stack with a fully functional bundled-data fallback.

## What's built

| PRD module | Status | Where |
| :--- | :--- | :--- |
| 1. Emergency helpline directory | ✅ | `src/pages/Helplines.jsx` — client-side search, region/language/category/24-7 filters, `tel:` / `sms:` / WhatsApp / web actions, bundled verified dataset (India, US, UK, Global) |
| 2. Calming & grounding toolkit | ✅ | `src/pages/Toolkit.jsx` — box breathing (4-4-4-4), 4-7-8 breathing, phase-driven visual pacer, sound + haptic feedback, 5-4-3-2-1 checklist, persistent floating panic button with one-tap crisis lines |
| 3. Clinical self-assessments | ✅ | `src/pages/Screeners.jsx` — full PHQ-9 and GAD-7, standard scoring/severity bands, no answer persistence, disclaimers, and Q9 risk escalation banner with direct helpline links |
| 4. Mood tracker & journal | ✅ | `src/pages/Mood.jsx` — 5-point index, activity tags, optional notes, 7/14/30-day SVG trend chart, entries stored **only** in `localStorage`, deletable |
| 5. Awareness library | ✅ | `src/pages/Library.jsx` + `Article.jsx` — 6 bite-sized guides, category filter, local bookmarks, offline reading |
| Accessibility (WCAG-minded) | ✅ | High-contrast mode, larger text, reduced-motion toggle, visible focus rings, skip link, ARIA labels/roles, min 16px body text, 320px–1920px responsive |
| Offline-first / PWA | ✅ | Bundled JSON dataset + service worker app-shell cache + installable manifest |
| Express REST API | ✅ | `GET /api/helplines`, `/api/helplines/:id`, `/api/articles`, `/api/articles/:id`, `/api/health` — filtering, rate limiting, validation, DB-or-bundled fallback |
| MongoDB / Mongoose | ✅ | `Helpline.js` and `Article.js` schemas exactly per PRD, optional seed script |

## Project layout

```
mental-health-app/
├── shared/data/            # one dataset for client + server
│   ├── helplines.json
│   ├── articles.json
│   └── screeners.json
├── server/                 # Express API
│   └── src/{config,models,data,controllers,routes,seed}
├── client/                 # React + Vite PWA
│   └── src/{components,pages,context,lib,data}
└── package.json            # root scripts
```

## Run it

Requires Node 18+ (tested on Node 26).

```powershell
cd D:\mental-health-app
npm.cmd run install:all
npm.cmd run dev             # API on :5000, client on :5173
```

Open `http://localhost:5173`.

The API works with **no configuration** — it serves the bundled dataset. To use MongoDB Atlas:

```powershell
Copy-Item server\.env.example server\.env
# edit MONGODB_URI
npm.cmd run seed
```

To use a different API URL from the client, copy `client\.env.example` to `client\.env`.

## Production / offline check

```powershell
npm.cmd run build
npm.cmd --prefix client run preview
```

The service worker registers in production builds. Load the preview once, reload, then go offline — the app shell, assets, data, grounding tools, mood history, and bookmarks all remain available.

## Deploy to Cloudflare Pages (Wrangler)

`wrangler.toml` at the project root configures a Cloudflare Pages project named `mindline` with `client/dist` as the build output.

The root `package.json` uses npm workspaces (`client`, `server`), so a single `npm ci` at the repository root installs **all** dependencies, including Vite. This is what Cloudflare Pages runs before `npm run build`.

```powershell
npm install
npx wrangler login
npm.cmd run deploy          # builds, then deploys client/dist
```

Use `npm.cmd run deploy:direct` to redeploy an existing build without rebuilding.

The Express API is not part of this Pages deployment. The client is fully functional without it because all helpline, article and screener data is bundled and all mood/bookmark data stays on the device. To expose the API publicly, deploy it separately (for example as a Cloudflare Worker or a Node host) and set `VITE_API_URL` before building.

## Safety note

The self-assessments and articles are screening/education tools, not diagnoses. PHQ-9 item 9 endorsed at any frequency shows a support banner; "Nearly every day" shows the high-priority escalation with Tele MANAS 14416 and KIRAN 1800-599-0019.
