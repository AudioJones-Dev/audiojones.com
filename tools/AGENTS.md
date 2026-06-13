# AGENTS.md - Tools DOX

## Purpose

- Own repo/admin tooling and local helper commands under `tools/`.

## Ownership

- Applies to `tools/`.
- Operational scripts under `scripts/` are owned by `scripts/AGENTS.md`.

## Local Contracts

- Admin or claim-granting tools require explicit operator approval before use
  against real accounts.
- Tools must not print, commit, or persist secrets.
- Do not make destructive repo operations the default behavior.

## Work Guidance

- Prefer explicit subcommands and dry-run/status modes for repo tools.
- Keep account, client, and auth assumptions visible in help text or docs.

## Verification

- Run tools against a fixture, dry-run mode, or safe local target when
  available.
- Run `pnpm typecheck` for TypeScript tool changes.

## Child DOX Index

- No child AGENTS.md files are currently defined under `tools/`.
