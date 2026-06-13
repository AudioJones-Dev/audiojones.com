# AGENTS.md - Scripts DOX

## Purpose

- Own operational scripts, setup scripts, codemods, release checks, verification
  helpers, and infrastructure scripts.

## Ownership

- Applies to `scripts/`.
- Repo/admin helper tools in `tools/` are owned by `tools/AGENTS.md`.

## Local Contracts

- Scripts must not print, commit, or persist real secrets.
- Production, financial, credential, mass-edit, or destructive scripts require
  explicit operator approval before execution.
- Do not bypass `pnpm check:no-firebase` or other root validation gates.

## Work Guidance

- Prefer dry-run behavior for setup, sync, and cleanup scripts.
- Keep Windows and shell assumptions explicit.
- For codemods, scope matches narrowly and report files touched.

## Verification

- Run the changed script in dry-run or against a safe fixture when available.
- Run `pnpm typecheck` for TypeScript script changes when they participate in
  the project config.

## Child DOX Index

- No child AGENTS.md files are currently defined under `scripts/`.
