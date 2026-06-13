# AGENTS.md - Library DOX

## Purpose

- Own shared business logic, integrations, server/client helpers, domain
  engines, schemas, and utility modules.

## Ownership

- Applies to `src/lib/`.
- Route handlers are owned by `src/app/`; database access by `src/db/`;
  workspace packages by `packages/`.

## Local Contracts

- Keep server-only and client-safe utilities separated.
- Integration modules must treat downstream systems as fallible and classify
  deployment/env gates separately from code defects.
- Do not add Firebase dependencies or new imports from legacy Firebase shims.
- Do not expose secrets in logs, errors, client responses, or generated docs.

## Work Guidance

- Prefer schema validation for external input and integration payloads.
- Keep domain engines testable without route-level side effects.
- Use existing singleton/lazy patterns where already established.

## Verification

- Run `pnpm typecheck`, `pnpm lint`, `pnpm check:no-firebase`, and
  `pnpm build` for library changes.
- Run targeted tests or scripts for changed domains when available.

## Child DOX Index

- No child AGENTS.md files are currently defined under `src/lib/`.
