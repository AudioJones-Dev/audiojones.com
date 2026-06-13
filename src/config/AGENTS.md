# AGENTS.md - Source config DOX

## Purpose

- Own typed source configuration for navigation, modules, links, EPM,
  automation mappings, and artist-hub data.

## Ownership

- Applies to `src/config/`.
- Env schema is owned by `packages/config/` under `packages/AGENTS.md`.

## Local Contracts

- Config changes can alter visible routes, CTAs, and integrations. Treat them
  as behavior changes, not inert data edits.
- Public-copy, route, or CTA changes require explicit task scope.
- Do not store secrets or private account data in source config.

## Work Guidance

- Keep config values typed and easy for consuming components/routes to validate.
- Update docs or specs when config changes alter durable IA or workflows.

## Verification

- Run `pnpm typecheck` and `pnpm build` for source config changes.

## Child DOX Index

- No child AGENTS.md files are currently defined under `src/config/`.
