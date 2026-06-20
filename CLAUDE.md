# CLAUDE.md — Claude Code memory for AudioJones.com

This file is loaded automatically by Claude Code at the start of every
session in this repo. It inherits the full agent contract in
[`AGENTS.md`](./AGENTS.md) — read that first.

The notes below are Claude-specific and should stay short.

---

## Project shape

- Next.js 16 (App Router, React 19, TypeScript strict).
- pnpm workspace; `packageManager` is pinned — use `pnpm`, not `npm`.
- Source: `src/`. Workspace packages: `packages/*` (build with
  `pnpm packages:build`). `next build` already chains this for you.
- The `functions/` directory is legacy Firebase tooling and is excluded
  from the TypeScript program (`tsconfig.json`). Don't add to it.
- The `tests/`, `test/`, and root-level `test-*.js` files are integration
  scripts; there is no Vitest/Jest suite yet.

## Stack guardrail

`pnpm check:no-firebase` is the bright line: any reintroduction of
Firebase imports, packages, or env keys fails CI. If a task seems to
require Firebase, escalate before writing code.

## Validation contract

Before declaring any code change complete, run:

```bash
pnpm typecheck
pnpm lint
pnpm check:no-firebase
pnpm build
```

`pnpm build` is the most expensive step but the most authoritative
locally — it runs `pnpm packages:build && next build`.

## Reading order for new tasks

1. [`docs/PRD.md`](./docs/PRD.md) — what the site is for.
2. [`docs/design/DESIGN.md`](./docs/design/DESIGN.md) — visual + voice contract.
3. [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — env + Vercel rules.
4. [`docs/SECURITY.md`](./docs/SECURITY.md) — what must never leak.
5. [`docs/DECISIONS.md`](./docs/DECISIONS.md) — why the stack looks like this.

## Things to avoid

- Mass refactors of unrelated files.
- Adding speculative abstractions ("might be useful later").
- Comments that paraphrase the code or reference the current task.
- Re-formatting files you didn't otherwise edit.
- New top-level Markdown reports (`PHASE_X_COMPLETE.md`,
  `*_HARDENING_*.md`); the repo root has too many already. Add to
  [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) instead.

## Things to prefer

- Small, reviewable diffs.
- Editing existing files.
- Reading neighboring code before introducing patterns.
- Asking when a directive looks like it would conflict with
  [`AGENTS.md`](./AGENTS.md).
