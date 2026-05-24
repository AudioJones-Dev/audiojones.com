# AGENTS.md — Agent contract for AudioJones.com

This file is the durable contract for any AI coding agent (Claude Code, GitHub
Copilot, Codex, Cursor, etc.) operating in this repository. Read it before
making any change.

The companion file [`CLAUDE.md`](./CLAUDE.md) carries Claude-specific notes;
it inherits everything below.

---

## 1. What this repo is

`audiojones.com` is the public marketing site for **AJ Digital LLC** —
content, SEO/AEO, the Applied Intelligence diagnostic, lead capture, and
booking. It is **not** an admin/portal monolith.

Stack (canonical — see [`docs/DECISIONS.md`](./docs/DECISIONS.md) and
[`docs/architecture/stack-decision.md`](./docs/architecture/stack-decision.md)):

```
Cloudflare → Vercel + Next.js 16 (App Router, React 19)
             → Sanity CMS
             → NeonDB (Postgres) — leads + structured data
             → Resend — transactional email
             → n8n — optional automation
             → Supabase — only when auth/storage/realtime is genuinely required
             → Whop — product licensing/checkout
             → Stripe — payments
             → ImageKit — media CDN
```

**Firebase is intentionally excluded.** `pnpm check:no-firebase` enforces this.

Some legacy `/portal/*` and `/api/admin/*` routes exist from a previous
Firebase era; they are being phased out. New work targets the marketing
surface and Applied Intelligence flows.

---

## 2. Hard rules

1. **Do not reintroduce Firebase.** No `firebase`, `firebase-admin`,
   `FIREBASE_*`, or `NEXT_PUBLIC_FIREBASE_*` imports or env keys. The
   `check:no-firebase` script will fail CI.
2. **Do not commit secrets.** Real credentials never land in
   `.env.example`, docs, scripts, or code. Use Vercel / Doppler / 1Password.
3. **Do not delete documentation files** without an explicit instruction.
   Supersede with a one-line redirect stub instead.
4. **Do not rename routes** without a redirect plan and explicit approval.
5. **Do not alter `package.json` `dependencies` or `scripts`** as part of
   unrelated work.
6. **Do not touch `pnpm-lock.yaml`** unless the task is a dependency change.
7. **Branch before committing.** Never push directly to `main`.
8. **Validate before reporting done.** `pnpm typecheck` and `pnpm build` must
   pass for any change that touches code or config.

---

## 3. Canonical paths

| Concern              | Source of truth                                             |
| -------------------- | ----------------------------------------------------------- |
| Product brief        | [`docs/PRD.md`](./docs/PRD.md)                              |
| Design system        | [`docs/DESIGN.md`](./docs/DESIGN.md)                        |
| Roadmap              | [`docs/ROADMAP.md`](./docs/ROADMAP.md)                      |
| Security posture     | [`docs/SECURITY.md`](./docs/SECURITY.md)                    |
| Deployment / env     | [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)                |
| Decision log         | [`docs/DECISIONS.md`](./docs/DECISIONS.md)                  |
| Changelog            | [`docs/CHANGELOG.md`](./docs/CHANGELOG.md)                  |
| Env template         | [`.env.example`](./.env.example)                            |
| Env validation       | `packages/config/env.schema.ts`                             |
| Stack decision       | [`docs/architecture/stack-decision.md`](./docs/architecture/stack-decision.md) |
| Marketing IA         | [`docs/archive/MARKETING-IA.md`](./docs/archive/MARKETING-IA.md) |
| Nav config           | `src/config/nav.ts`                                         |
| Lead intake          | `src/app/api/applied-intelligence/leads/route.ts`           |
| Lead persistence     | `src/db/leads.ts`, `db/migrations/`                         |

Older root-level docs (`AUDIOJONES_DESIGN.md`, `DEPLOYMENT.md`,
`VERCEL_ENV_SETUP.md`, `secrets.md`, `docs/design.md`,
`docs/VERCEL_ENV_SOP.md`, `docs/env.example`, `docs/env/env-template.md`)
are now redirect stubs pointing at the canonical files above.

---

## 4. Workflow expectations

### Before changing code

1. Skim [`docs/PRD.md`](./docs/PRD.md), [`docs/DESIGN.md`](./docs/DESIGN.md),
   and the relevant architecture doc.
2. Read the surrounding files; match the existing patterns.
3. If a change feels architectural, append a short entry to
   [`docs/DECISIONS.md`](./docs/DECISIONS.md) instead of guessing.

### While changing code

- Prefer editing existing files over creating new ones.
- Keep diffs minimal and scoped. Don't refactor for taste.
- Don't introduce new dependencies without explicit approval.
- Don't add comments that restate the code; add comments only when the
  *why* is non-obvious.

### Before committing

```bash
pnpm install            # if dependencies could have drifted
pnpm typecheck
pnpm lint
pnpm check:no-firebase
pnpm build
```

If any step fails, **fix the cause**, do not bypass it (no `--no-verify`,
no skipping the Firebase guard).

`pnpm validate` runs the same four-command contract sequentially and
writes a `validation-summary.json` artifact that mirrors what the
`PR Validation Summary` workflow posts on the PR. See
[`docs/ops/AUTOMATED_VALIDATION_REVIEW_LOOP.md`](./docs/ops/AUTOMATED_VALIDATION_REVIEW_LOOP.md).

### Commit & branch hygiene

- One concern per branch. Branch names: `chore/...`, `feat/...`,
  `fix/...`, `docs/...`, `security/...`.
- Commit messages describe the *why*, not the *what*.
- Open a draft PR and let CI run before requesting review.

---

## 5. Execution principles

These principles apply to every task. They are not aspirational — they are
the bar for "done".

### 5.1 Think before coding

- State the goal, the likely files, and the success criteria before
  writing code.
- Surface assumptions and tradeoffs. Name the ambiguity if there is any.
- Ask when ambiguity could cause rework. Don't silently pick between
  plausible interpretations of an underspecified request.

### 5.2 Simplicity first

- Implement the smallest change that satisfies the task.
- No speculative abstractions, config layers, feature flags, or
  "might be useful later" scaffolding.
- If the diff is growing past the task, stop and simplify before
  continuing.

### 5.3 Surgical changes

- Touch only files directly required by the task.
- Do not refactor adjacent code, rename for taste, or clean up
  unrelated dead code in the same diff.
- Do not redesign UI, copy, or routes unless the task explicitly asks
  for it.
- Every changed line must trace back to the stated goal.

### 5.4 Goal-driven execution

For every non-trivial task, hold these in your head (or in the PR
description):

- **Goal** — what behavior changes, in one sentence.
- **Files likely touched** — narrow set; deviations are a yellow flag.
- **Success criteria** — observable, not "looks right".
- **Validation** — the exact commands run (see §4) and what they
  returned.

For bug fixes: reproduce or precisely identify the failure first, fix
only the cause, then verify.

For funnels, lead capture, integrations (Sanity, Neon, Resend, Whop,
Stripe, ImageKit, n8n): **audit the existing wiring before changing
it.** Read the route, the schema, the env keys, and the downstream
consumer. Funnel regressions are expensive; mis-scoped edits there are
the most common cause.

### 5.5 Validation before handoff

- The §4 validation commands must pass locally before the PR is moved
  out of draft.
- **Distinguish code gates from deployment / env gates.** Typecheck,
  lint, `check:no-firebase`, and build are code gates — failing them
  blocks merge. Missing Vercel env vars, Sanity dataset config, or
  Stripe keys are deployment gates — surface them in the PR body as
  remaining manual QA, do not silently paper over them in code.
- A smoke-test failure caused by a missing env var is **not** a code
  defect; classify it correctly so the right person resolves it.

### 5.6 PR description expectations

Every PR body should include:

- **What changed** — bullet list, scoped to the diff.
- **What was intentionally not changed** — adjacent things you noticed
  but left alone. This is how we keep scope honest.
- **Validation results** — which §4 commands ran and their outcome.
- **Remaining gates** — deployment, env, or manual QA still required
  before the change is safe in production.

---

## 6. Tone for AI-authored content

Match the brand voice documented in [`docs/DESIGN.md`](./docs/DESIGN.md):
**signal over noise**. Marketing copy is direct, founder-led, technical, and
free of generic AI-agency clichés ("unlock", "harness", "supercharge",
"revolutionize", emoji decoration). Code comments stay short and load-bearing.

---

## 7. When in doubt

Stop and ask. A clarifying question is cheaper than a wrong-direction PR.
