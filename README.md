# Agent Benchmark Echo

Agent Benchmark Echo is a Next.js testbed for turning agent evaluation into a browsable, runnable, and auditable website.

The repository currently combines:

- a standalone Phaser-based live office scene under `/live`
- product-style run and report pages under Next.js
- demo benchmark data and serverless API routes
- a future Supabase-backed persistence path

## Current Status

- Implemented: Next.js App Router shell
- Implemented: `/live` as the primary entry point
- Implemented: imported Star-Office frontend running as a standalone static sub-app
- Implemented: `/landing`, `/runs`, `/runs/[id]`, and `/reports/[id]`
- Implemented: modal-based navigation inside the live scene
- Implemented: shared demo data for domains, fixtures, test cases, and run records
- Implemented: `GET /api/test-cases`, `GET /api/agent-access`, `GET /api/roadmap`, `GET /api/fixtures`, `GET /api/runs`, `GET /api/runs/:id`, and `POST /api/runs`
- Implemented: `zh` / `en` / `ja` language switching across live modals, runs, and reports
- Implemented: Supabase environment variable template and runtime config placeholders
- Not implemented yet: real persistence, actual executors, file uploads, authentication, and production-grade scoring pipelines

## Routes

- `/`
  - redirects to `/live`
- `/live`
  - fullscreen host for the imported original Phaser office UI
- `/landing`
  - product overview page used as a modal destination from live
- `/runs`
  - run list and minimal run creation UI
- `/runs/[id]`
  - run detail view
- `/reports/[id]`
  - standalone evaluation report

## Architecture

The repo currently has four main layers:

1. `app/`
   Next.js routes, pages, and API handlers.
2. `public/live-office/`
   Imported live scene app and its static Phaser assets.
3. `lib/`
   Shared types, demo benchmark data, localization helpers, environment access, and persistence config.
4. `public/office-ui/`
   Shared fonts and memo textures used by the Next.js product pages.

Useful docs:

- English: [docs/project-structure.en.md](./docs/project-structure.en.md)
- Chinese: [docs/project-structure.zh-CN.md](./docs/project-structure.zh-CN.md)

## How `/live` Works

`/live` is no longer a React reimplementation of the office scene.

It is a thin Next.js host that loads:

- [app/live/page.tsx](./app/live/page.tsx)
- [components/live/live-office-frame.tsx](./components/live/live-office-frame.tsx)
- [public/live-office/index.html](./public/live-office/index.html)

The imported page runs the original Phaser UI directly, with local asset paths and split static runtime files:

- [public/live-office/live-office.css](./public/live-office/live-office.css)
- [public/live-office/live-office-mocks.js](./public/live-office/live-office-mocks.js)
- [public/live-office/live-office-i18n.js](./public/live-office/live-office-i18n.js)
- [public/live-office/live-office-modal.js](./public/live-office/live-office-modal.js)
- [public/live-office/live-office-room-actions.js](./public/live-office/live-office-room-actions.js)
- [public/live-office/live-office-runtime.js](./public/live-office/live-office-runtime.js)
- [live-office-src/live-office-mocks.ts](./live-office-src/live-office-mocks.ts)
- [live-office-src/live-office-i18n.ts](./live-office-src/live-office-i18n.ts)
- [live-office-src/live-office-modal.ts](./live-office-src/live-office-modal.ts)
- [live-office-src/live-office-room-actions.ts](./live-office-src/live-office-room-actions.ts)
- [live-office-src/live-office-runtime.ts](./live-office-src/live-office-runtime.ts)

This keeps the scene behavior intact while moving most styling and the safer non-Phaser operational code out of the HTML shell.
The TypeScript files under `live-office-src/` are now the authoring sources; the browser still consumes compiled JS from `public/live-office/`.

The live scene also acts as the top-level navigation surface:

- Home opens `/landing?embed=1`
- Run List opens `/runs?embed=1`
- Start Test opens `/runs?embed=1`
- View Report opens `/reports/run-demo-001?embed=1`

## Demo Data Model

The current prototype revolves around:

### `TestCase`

```ts
type TestCase = {
  id: string;
  domain: 'file-io' | 'web-ui' | 'security' | 'mcp-skill';
  title: string;
  objective: string;
  difficulty: 'easy' | 'medium' | 'hard';
  inputSchema: Record<string, unknown>;
  expectedSignals: string[];
  scoringRubric: {
    name: string;
    weight: number;
  }[];
  fixtureIds: string[];
};
```

### `RunRecord`

```ts
type RunRecord = {
  id: string;
  testCaseId: string;
  status: 'queued' | 'running' | 'passed' | 'failed';
  startedAt?: string;
  finishedAt?: string;
  score?: number;
  agentOutput?: string;
  evaluatorNotes?: string[];
  input?: Record<string, unknown>;
};
```

Shared demo content lives in [lib/site-data.ts](./lib/site-data.ts), including:

- roadmap content
- fixture metadata
- test case definitions
- sample run records
- localization helpers for `zh`, `en`, and `ja`

## API Surface

Current routes:

- `GET /api/test-cases`
- `GET /api/agent-access`
- `GET /api/roadmap`
- `GET /api/fixtures`
- `GET /api/runs`
- `POST /api/runs`
- `GET /api/runs/:id`

These routes are still backed by in-memory demo data.

## Persistence Plan

The intended production direction is Supabase.

Recommended split:

- Supabase Postgres
  - `runs`
  - `test_cases`
  - `fixtures` metadata
  - scoring results
  - audit records
- Supabase Storage
  - uploaded files
  - generated reports
  - screenshots
  - fixture bundles
- Vercel
  - frontend
  - serverless API routes
  - orchestration entry points

Reserved config files:

- [.env.example](./.env.example)
- [lib/env.ts](./lib/env.ts)
- [lib/supabase-config.ts](./lib/supabase-config.ts)

## Environment Variables

Copy `.env.example` to `.env.local` for local work.

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

Recommended:

- `SUPABASE_JWT_SECRET`
- `SUPABASE_STORAGE_BUCKET_UPLOADS`
- `SUPABASE_STORAGE_BUCKET_REPORTS`
- `SUPABASE_STORAGE_BUCKET_FIXTURES`
- `APP_BASE_URL`
- `ENABLE_SUPABASE_PERSISTENCE`

Current switch behavior:

- `ENABLE_SUPABASE_PERSISTENCE=false`
  - keep using the in-memory prototype
- `ENABLE_SUPABASE_PERSISTENCE=true`
  - require the core Supabase variables and prepare the app for a real persistence layer

## Local Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run build:live-office
npm run typecheck
npm run build
```

## Near-Term Next Steps

- replace in-memory runs with Supabase-backed records
- connect live scene actions to real benchmark runtime data
- add upload and execution endpoints
- replace placeholder scoring with real evaluation artifacts
- unify the remaining live-scene explanatory text with the site language system
