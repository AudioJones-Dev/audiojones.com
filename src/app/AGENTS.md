# AGENTS.md - App Router DOX

## Purpose

- Own Next.js App Router pages, layouts, route handlers, metadata, robots,
  sitemap, and API surfaces.

## Ownership

- Applies to `src/app/`.
- Shared UI is owned by `src/components/`; shared logic by `src/lib/`; database
  access by `src/db/`.

## Local Contracts

- Do not rename public routes without a redirect plan and explicit approval.
- New work targets public marketing and Applied Intelligence flows, not legacy
  portal/admin expansion.
- Lead-intake routes must validate input, protect against obvious abuse, and
  persist durable lead data before optional webhooks or notifications.
- Smoke-test failures caused by missing deployment env vars should be reported
  as deployment gates, not hidden in code.

## Work Guidance

- Read the route, schema, env usage, persistence call, and downstream consumer
  before changing funnels or integrations.
- Keep page copy aligned with `docs/design/DESIGN.md` and avoid generic
  AI-agency language.
- Keep server-only code out of client components.

## Verification

- Run `pnpm typecheck`, `pnpm lint`, `pnpm check:no-firebase`, and
  `pnpm build` for route/page/API changes.
- Run a local or preview smoke test for changed public routes when practical.

## Child DOX Index

- No child AGENTS.md files are currently defined under `src/app/`.
