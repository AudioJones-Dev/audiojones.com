# AGENTS.md - Source DOX

## Purpose

- Own Next.js application source: App Router routes, components, config,
  content, data access, hooks, libraries, and types.

## Ownership

- Applies to `src/`.
- SQL migrations are owned by `db/AGENTS.md`; public assets are owned by
  `public/AGENTS.md`.

## Local Contracts

- This source tree serves the public AudioJones.com marketing, SEO/AEO,
  diagnostic, lead-capture, and booking surface.
- Legacy `/portal/*` and `/api/admin/*` code is a phase-out queue. Do not deepen
  it unless the task explicitly scopes that work.
- Do not add Firebase imports, packages, env keys, or new Firebase-dependent
  paths.
- Lead capture and funnels must persist critical lead data before best-effort
  downstream integrations.

## Work Guidance

- Read `docs/PRD.md`, `docs/design/DESIGN.md`, and relevant architecture docs
  before meaningful source changes.
- Match existing patterns in nearby files before introducing helpers.
- Keep UI, integration, and route changes scoped to the stated behavior.

## Verification

- Run the root source gates for code changes:
  `pnpm typecheck`, `pnpm lint`, `pnpm check:no-firebase`, and `pnpm build`.
- Add or run targeted tests when changing shared logic or bug-prone workflows.

## Child DOX Index

- [`app/AGENTS.md`](./app/AGENTS.md) - App Router pages, layouts, route
  handlers, metadata, robots, sitemap, and API surfaces.
- [`components/AGENTS.md`](./components/AGENTS.md) - React UI components,
  shared primitives, page sections, and brand implementation.
- [`config/AGENTS.md`](./config/AGENTS.md) - navigation, modules, links, EPM,
  automation mappings, and artist-hub config.
- [`db/AGENTS.md`](./db/AGENTS.md) - TypeScript database access and persistence
  helpers.
- [`lib/AGENTS.md`](./lib/AGENTS.md) - shared business logic, integrations,
  server/client helpers, and domain engines.
