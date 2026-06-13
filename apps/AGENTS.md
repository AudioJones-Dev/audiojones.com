# AGENTS.md - Apps DOX

## Purpose

- Own app workspaces under `apps/` that are separate from the public
  AudioJones.com marketing surface.

## Ownership

- Applies to `apps/`, currently including `apps/client-portal/`.
- The root repo remains a marketing and lead-capture site. Do not expand this
  area into the primary admin/portal monolith.

## Local Contracts

- App work here must not deepen legacy `/portal/*` or `/api/admin/*` surfaces
  in `src/` unless the task explicitly scopes that migration.
- New app responsibilities need a spec or PRD before implementation.
- Shared code imported from `src/` or `packages/` must follow those subtrees'
  AGENTS.md contracts.

## Work Guidance

- Keep app code isolated from public-site routing unless the integration point
  is explicitly defined.
- Prefer extracting shared contracts to `packages/` only when the dependency is
  real and stable.

## Verification

- Run the root code gates when app work touches TypeScript or build inputs:
  `pnpm typecheck`, `pnpm lint`, `pnpm check:no-firebase`, and `pnpm build`.

## Child DOX Index

- No child AGENTS.md files are currently defined under `apps/`.
