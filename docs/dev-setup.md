# Local development setup

This file captures notes for getting the repo running on a developer
workstation. The CI / Vercel build is authoritative — but if you hit
something local-only, the recovery procedures below have already been
verified.

---

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm check:no-firebase
```

Required toolchain: Node 22+, pnpm 10.30.3 (pinned via `packageManager`),
git. Self-hosted fonts are included; no Google Fonts dependency.

---

## Known recoveries

### `Cannot find module '.../typescript/bin/tsc'` (Windows + pnpm)

**Symptom**

`pnpm typecheck`, `pnpm exec tsc`, or `node ./node_modules/.bin/tsc`
fail with:

```
Error: Cannot find module 'C:\dev\audiojones-clean\node_modules\typescript\bin\tsc'
    ...
    code: 'MODULE_NOT_FOUND',
    requireStack: []
```

**Insidious side effect**

`pnpm typecheck` and `pnpm lint` may report `exit 0` *despite* this
error, because the pipeline (`pnpm exec ... | tail`) returns `tail`'s
exit code, not the underlying failure. Real type or lint errors will
slip past local validation and only surface on Linux CI.

**Root cause**

pnpm's content-addressable store (`node_modules/.pnpm/typescript@5.9.3/...`)
contains the package metadata but the package files themselves
(including `bin/tsc`) are missing. Usually triggered by an interrupted
install, an external cleanup of `node_modules`, or hopping between
worktrees with overlapping pnpm state.

**Recovery**

```bash
pnpm install --force
```

This re-fetches the affected packages from the pnpm registry mirror and
restores the bin shims. Takes 1-2 minutes. Lockfile and `package.json`
are unchanged — the only artifact is a healthy `node_modules` tree.

**Verification**

After the recovery, prove typecheck actually runs (not just exits 0):

```bash
mkdir -p src/_scratch
echo 'const x: number = "should fail"; export { x };' > src/_scratch/proof.ts
pnpm typecheck   # MUST surface error TS2322; underlying exit must be 2
rm -rf src/_scratch
pnpm typecheck   # exit 0
```

If the deliberate type error doesn't fail the typecheck, the resolver
is still broken — repeat `pnpm install --force`, or escalate.

---

## CI is authoritative

Linux CI on every push runs the canonical pipeline. If your local checks
pass but CI fails, trust CI. If CI passes but local fails, the issue is
local-environmental.

---

## What this site is NOT

- Not a Firebase project. Removed in PR #33. The repo guard
  (`pnpm check:no-firebase`) fails CI if Firebase is reintroduced.
- Not a single-stack codebase yet — the `legacy marketing surface`
  (`/services`, `/blog`, etc.) is still live but de-listed from the
  primary nav. See `docs/design.md` for the canonical Applied
  Intelligence surface direction.
