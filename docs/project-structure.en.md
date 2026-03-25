# Project Structure

## One-line Summary

The repository currently has four layers:

1. `app/`: the Next.js routing layer for pages and API routes.
2. `public/live-office/`: the imported standalone live scene frontend.
3. `lib/`: shared types, demo data, environment helpers, and persistence configuration.
4. `public/office-ui/`: shared fonts and memo textures used by the Next.js pages.

This is not just a static site and not just a game scene either. It is:

- Next.js for the app shell, routes, and APIs
- `/live` embeds the original Phaser webpage directly
- Shared data for domains, test cases, fixtures, and demo runs
- A future Supabase-backed persistence layer

## Page Responsibilities

### `/`

- Role: redirect entry
- Purpose: send the root route to `/live`
- Tech: Next.js server redirect

### `/live`

- Role: standalone live office entry
- Purpose: load the imported original Phaser webpage directly instead of reimplementing the scene in React
- Tech:
  - a minimal Next.js shell
  - `components/live/live-office-frame.tsx` as the iframe wrapper
  - `public/live-office/index.html` as the real scene app
  - `public/live-office/live-office.css` for the extracted scene stylesheet
  - `live-office-src/*.ts` as the TypeScript authoring source
  - `public/live-office/live-office-mocks.js` as the compiled mock layer
  - `public/live-office/live-office-i18n.js` as the compiled language/UI helper layer
  - `public/live-office/live-office-modal.js` as the compiled modal helper layer
  - `public/live-office/live-office-room-actions.js` as the compiled room generation/loading helper layer
  - `public/live-office/live-office-runtime.js` as the compiled scene runtime
  - `public/live-office/static/*` for scene assets

### `/landing`

- Role: product overview page
- Purpose: explain the benchmark surface from inside the live modal system
- Tech: React client component with `zh` / `en` / `ja` language switching

### `/runs`

- Role: run list and minimal run creation page
- Purpose: inspect demo runs and create in-memory prototype runs

### `/runs/[id]`

- Role: run detail page
- Purpose: inspect input, output, status, notes, and linked fixtures for one run

### `/reports/[id]`

- Role: standalone evaluation report page
- Purpose: preserve one run as a full report artifact instead of mixing it into the live scene

## Directory Breakdown

### `app/`

- `app/page.tsx`
  - root redirect to `/live`
- `app/live/page.tsx`
  - live route entry
- `components/live/live-office-frame.tsx`
  - iframe wrapper for the standalone scene app
- `app/landing/page.tsx`
  - overview page used by the live modal
- `app/runs/page.tsx`
  - run list and create form
- `app/runs/[id]/page.tsx`
  - run detail
- `app/reports/[id]/page.tsx`
  - report detail
- `app/api/*`
  - serverless API routes
- `app/globals.css`
  - global styles for landing, runs, reports, and the `/live` host shell

### `public/live-office/`

- `public/live-office/index.html`
  - imported scene HTML shell
  - now mostly structural markup plus script/style references
- `public/live-office/live-office.css`
  - extracted scene stylesheet
- `public/live-office/live-office-mocks.js`
  - compiled mock fetch layer and demo scene state bootstrapping
- `public/live-office/live-office-i18n.js`
  - compiled shared localization and UI text helpers
- `public/live-office/live-office-modal.js`
  - compiled modal open/close helpers for the embedded app pages
- `public/live-office/live-office-room-actions.js`
  - compiled room loading, saved-home, and background generation helpers
- `public/live-office/live-office-runtime.js`
  - compiled scene logic and Phaser integration
- `public/live-office/static/*`
  - scene buttons, backgrounds, spritesheets, fonts, and Phaser vendor bundle

### `live-office-src/`

- `live-office-src/live-office-mocks.ts`
  - TypeScript authoring source for the live mock layer
- `live-office-src/live-office-i18n.ts`
  - TypeScript authoring source for localization and shared UI text updates
- `live-office-src/live-office-modal.ts`
  - TypeScript authoring source for modal navigation helpers
- `live-office-src/live-office-room-actions.ts`
  - TypeScript authoring source for room loading, saved-home, and generation flows
- `live-office-src/live-office-runtime.ts`
  - TypeScript authoring source for the remaining live runtime and Phaser scene
- compiled via `npm run build:live-office`

### `lib/`

- `lib/benchmark-types.ts`
  - core types for domains, test cases, fixtures, and run records
- `lib/site-data.ts`
  - current demo data hub
  - includes modules, roadmap, fixtures, test cases, and demo run records
- `lib/env.ts`
  - environment variable access
- `lib/supabase-config.ts`
  - persistence mode summary for future Supabase integration

### `public/office-ui/`

- shared ArkPixel webfonts for product pages
- memo texture used by the embedded Next.js pages

## How Data Flows Today

The current flow is:

1. `lib/site-data.ts` defines demo benchmark data.
2. `app/api/*` exposes that data through API routes.
3. Pages read from APIs or shared demo data.
4. `/live` directly loads the imported original frontend.
5. `/reports/[id]` turns one run into a standalone report view.

There is no real database yet, so `runs` are still an in-memory prototype.

## Why The Repo Feels Like Two Frontends

Because it intentionally has two UI modes:

1. Standard product pages
   - landing
   - runs
   - reports

2. Original Phaser scene UI
   - live

That split is intentional, not accidental. `/live` prioritizes imported scene fidelity, while the other pages prioritize product clarity.

## Most Reasonable Next Steps

### Scene Layer

- continue trimming compatibility patches inside the imported page
- gradually replace mocked endpoints with your own runtime data

### Persistence Layer

- replace in-memory runs with Supabase-backed storage
- keep `site-data` as a demo or fixture fallback

### Report Layer

- attach real scoring details to `/reports/[id]`
- stop deriving rubric numbers from demo placeholders

## Suggested Reading Order

If you are new to the repo, read in this order:

1. `README.md`
2. `docs/project-structure.en.md`
3. `app/page.tsx`
4. `app/live/page.tsx`
5. `components/live/live-office-frame.tsx`
6. `public/live-office/index.html`
7. `live-office-src/live-office-runtime.ts`
8. `lib/site-data.ts`
9. `app/api/runs/route.ts`
