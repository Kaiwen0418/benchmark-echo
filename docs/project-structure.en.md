# Project Structure

## One-line Summary

The repository currently has four layers:

1. `app/`: the Next.js routing layer for pages and API routes.
2. `components/`: reusable UI components, currently centered on the Phaser canvas bridge.
3. `lib/`: shared types, demo data, environment helpers, and persistence configuration.
4. `public/star-office/`: authorized pixel assets and Phaser runtime resources.

This is not just a static site and not just a game scene either. It is:

- Next.js for the app shell, routes, and APIs
- Phaser for the `/live` pixel office scene
- Shared data for domains, test cases, fixtures, and demo runs
- A future Supabase-backed persistence layer

## Page Responsibilities

### `/`

- Role: landing page
- Purpose: explain the product, benchmark scope, and navigation entry points
- Tech: React client component with theme and language switching

### `/live`

- Role: original-first pixel office scene
- Purpose: render the Phaser office map, surface current zone state, and expose actions to start tests and open reports
- Tech:
  - Next.js page shell
  - `components/live/phaser-office-canvas.tsx` for Phaser mounting
  - `public/star-office/*` for assets

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
  - original-first live scene wrapper
- `app/runs/page.tsx`
  - run list and create form
- `app/runs/[id]/page.tsx`
  - run detail
- `app/reports/[id]/page.tsx`
  - report detail
- `app/api/*`
  - serverless API routes
- `app/globals.css`
  - global styles for landing, runs, reports, and live scene wrappers

### `components/`

- `components/live/phaser-office-canvas.tsx`
  - Phaser bridge component
  - loads spritesheets, creates animations, and renders the office scene
  - React passes state in; Phaser controls scene behavior

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
- `phaser.min.js`
  - local Phaser runtime
- `office_bg_small.webp`
  - office background
- `star-idle-v5.png`
  - main idle spritesheet
- `star-working-spritesheet-grid.webp`
  - working animation spritesheet
- `serverroom-spritesheet.webp`
  - server room animation
- `coffee-machine-v3-grid.webp`
  - coffee machine animation
- `error-bug-spritesheet-grid.webp`
  - bug animation
- `sync-animation-v3-grid.webp`
  - sync animation
- `memo-bg.webp`
  - memo panel background

### `scripts/`

- `scripts/split-spritesheet.sh`
  - helper script for extracting frames from spritesheets

## How Data Flows Today

The current flow is:

1. `lib/site-data.ts` defines demo benchmark data.
2. `app/api/*` exposes that data through API routes.
3. Pages read from APIs or shared demo data.
4. `/live` maps runtime state into the Phaser scene.
5. `/reports/[id]` turns one run into a standalone report view.

There is no real database yet, so `runs` are still an in-memory prototype.

## Why The Repo Feels Like Two Frontends

Because it intentionally has two UI modes:

1. Standard product pages
   - landing
   - runs
   - reports

2. Phaser scene UI
   - live

That split is intentional, not accidental. `/live` prioritizes scene fidelity, while the other pages prioritize product clarity.

## Most Reasonable Next Steps

### Scene Layer

- move more original scene UI into Phaser
- reduce reliance on React DOM wrappers for `/live`

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
5. `components/live/phaser-office-canvas.tsx`
6. `lib/site-data.ts`
7. `app/api/runs/route.ts`
