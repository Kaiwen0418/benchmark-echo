# Project Structure

## One-line Summary

The repository currently has four layers:

1. `app/`: the Next.js routing layer for pages and API routes.
2. `public/star-office-original/`: the imported standalone Star-Office frontend.
3. `lib/`: shared types, demo data, environment helpers, and persistence configuration.
4. `public/star-office/`: authorized pixel assets and the earlier manual Phaser calibration resources.

This is not just a static site and not just a game scene either. It is:

- Next.js for the app shell, routes, and APIs
- `/live` embeds the original Phaser webpage directly
- Shared data for domains, test cases, fixtures, and demo runs
- A future Supabase-backed persistence layer

## Page Responsibilities

### `/`

- Role: landing page
- Purpose: explain the product, benchmark scope, and navigation entry points
- Tech: React client component with theme and language switching

### `/live`

- Role: standalone Star-Office entry
- Purpose: load the imported original Phaser webpage directly instead of reimplementing the scene in React
- Tech:
  - a minimal Next.js shell
  - `public/star-office-original/index.html` as the real scene app
  - `public/star-office-original/static/*` for original assets
  - in-page fetch mocks instead of the original Flask backend

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
  - landing page
- `app/live/page.tsx`
  - fullscreen iframe wrapper
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

### `public/star-office-original/`

- `public/star-office-original/index.html`
  - imported original frontend page
  - asset paths rewritten to local site paths
  - minimal fetch mocks added so it can run without the original Flask service
- `public/star-office-original/static/*`
  - original buttons, guest animations, backgrounds, spritesheets, fonts, and Phaser vendor bundle

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

### `public/star-office/`

- authorized pixel assets
- now mainly a source asset bucket plus earlier calibration work
- the active `/live` route no longer renders this through the React Phaser bridge

### `scripts/`

- `scripts/split-spritesheet.sh`
  - helper script for extracting frames from spritesheets

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
5. `public/star-office-original/index.html`
6. `lib/site-data.ts`
7. `app/api/runs/route.ts`
