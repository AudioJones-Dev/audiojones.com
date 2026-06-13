# AGENTS.md - Packages DOX

## Purpose

- Own workspace packages and shared package contracts.

## Ownership

- Applies to `packages/`, currently including `packages/config/` and
  `packages/adapters/whop/`.
- Application usage remains owned by `src/` and app subtrees.

## Local Contracts

- Do not change package dependencies, scripts, or `pnpm-lock.yaml` unless the
  task is explicitly a dependency or package change.
- Package APIs should stay small, typed, and stable for their consumers.
- Env schema changes in `packages/config/` must stay aligned with env docs and
  examples.

## Work Guidance

- Prefer local package patterns over new abstractions.
- Avoid coupling adapters to page-level UI or route-specific assumptions.

## Verification

- Run `pnpm packages:build` for package changes.
- Run root gates for package changes that affect the app:
  `pnpm typecheck`, `pnpm lint`, `pnpm check:no-firebase`, and `pnpm build`.

## Child DOX Index

- No child AGENTS.md files are currently defined under `packages/`.
