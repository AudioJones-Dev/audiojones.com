# AGENTS.md - Database DOX

## Purpose

- Own SQL migrations and durable database schema history.

## Ownership

- Applies to `db/`, especially `db/migrations/`.
- TypeScript database access lives in `src/db/` and is owned by
  `src/db/AGENTS.md`.

## Local Contracts

- NeonDB is the canonical lead and structured-data store for this site.
- Migrations must be append-only unless the user explicitly approves a schema
  rewrite or rollback.
- Do not add Firebase, Firestore, or Firebase env assumptions.
- Do not place real credentials, connection strings, or client data in SQL.

## Work Guidance

- Name migrations with a sortable prefix and descriptive purpose.
- Pair schema changes with the relevant TypeScript access-layer update and
  validation.

## Verification

- Run or dry-run migrations in an approved environment when available.
- For related TypeScript changes, run `pnpm typecheck` and `pnpm build`.

## Child DOX Index

- No child AGENTS.md files are currently defined under `db/`.
