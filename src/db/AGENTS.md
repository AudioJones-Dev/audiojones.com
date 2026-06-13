# AGENTS.md - Source database DOX

## Purpose

- Own TypeScript database access and persistence helpers.

## Ownership

- Applies to `src/db/`.
- SQL schema history is owned by `db/AGENTS.md`.

## Local Contracts

- NeonDB is the canonical database for leads and structured marketing data.
- Persistence functions for lead flows must fail clearly and avoid silent data
  loss.
- Do not log secrets, connection strings, raw tokens, or private client data.

## Work Guidance

- Keep SQL access typed and close to the domain it serves.
- Pair schema-dependent changes with migration review.

## Verification

- Run `pnpm typecheck` and `pnpm build` for database access changes.
- Run targeted route or script checks when persistence behavior changes.

## Child DOX Index

- No child AGENTS.md files are currently defined under `src/db/`.
