# AGENTS.md - Env DOX

## Purpose

- Own env templates and env-related documentation inside `env/`.

## Ownership

- Applies to `env/`.
- Root `.env*` files and Vercel/Doppler setup remain governed by root
  AGENTS.md and `docs/DEPLOYMENT.md`.

## Local Contracts

- Templates may contain key names and placeholders only. Never add real
  secrets, tokens, client data, webhook secrets, or account identifiers.
- Do not add Firebase env keys.
- Secret placement work requires explicit user approval and must use the
  approved target system, not committed files.

## Work Guidance

- Keep env examples aligned with `packages/config/env.schema.ts` and
  `.env.example`.
- When removing or renaming an env key, update docs and validation together.

## Verification

- Run `pnpm typecheck` or env validation when schema-facing env changes are
  made.
- Run `pnpm check:no-firebase` when env templates change.

## Child DOX Index

- No child AGENTS.md files are currently defined under `env/`.
