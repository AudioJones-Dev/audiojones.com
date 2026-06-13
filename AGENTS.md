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
| Design system        | [`docs/design/DESIGN.md`](./docs/design/DESIGN.md)          |
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
`VERCEL_ENV_SETUP.md`, `secrets.md`, `docs/DESIGN.md`,
`docs/VERCEL_ENV_SOP.md`, `docs/env.example`, `docs/env/env-template.md`)
are now redirect stubs pointing at the canonical files above.

---

## 4. Workflow expectations

### Before changing code

1. Skim [`docs/PRD.md`](./docs/PRD.md), [`docs/design/DESIGN.md`](./docs/design/DESIGN.md),
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

Match the brand voice documented in [`docs/design/DESIGN.md`](./docs/design/DESIGN.md):
**signal over noise**. Marketing copy is direct, founder-led, technical, and
free of generic AI-agency clichés ("unlock", "harness", "supercharge",
"revolutionize", emoji decoration). Code comments stay short and load-bearing.

---

## 7. When in doubt

Stop and ask. A clarifying question is cheaper than a wrong-direction PR.

---

## 8. DOX framework

DOX is the AGENTS.md hierarchy for this repo. These files are binding work
contracts for their subtrees. Agents must follow the nearest applicable
AGENTS.md plus every parent AGENTS.md above it for any edit.

### 8.1 Core contract

- Work products, source materials, instructions, records, assets, and durable
  docs must stay understandable from the nearest applicable AGENTS.md plus all
  parent AGENTS.md files.
- A child AGENTS.md may make local rules more specific, but it may not weaken
  this root contract or the DOX rules in this section.
- Broad rules belong here. Concrete local workflow, ownership, and verification
  belong in the closest child AGENTS.md.
- Do not rely on memory for DOX. Re-read the applicable AGENTS.md chain in the
  current session before editing.

### 8.2 Read before editing

1. Read this root AGENTS.md.
2. Identify every file or folder you expect to touch.
3. Walk from the repository root to each target path.
4. Read every AGENTS.md found along each route.
5. If a parent AGENTS.md lists a child AGENTS.md whose scope contains the path,
   read that child and continue from there.
6. Use the nearest AGENTS.md as the local contract and parent docs for
   repo-wide rules.
7. If docs conflict, the closer doc controls local work details, but no child
   doc may weaken DOX.

### 8.3 Update after editing

Every meaningful change requires a DOX pass before the task is done.

Update the closest owning AGENTS.md when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or artifacts
- user preferences about behavior, communication, process, organization, or
  quality
- AGENTS.md creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child
index changes. Update child docs when parent changes alter local rules. Remove
stale or contradictory text immediately. Small edits that do not change
behavior or contracts may leave docs unchanged, but the DOX pass still must
happen.

### 8.4 Hierarchy

- Root AGENTS.md is the DOX rail: project-wide instructions, global
  preferences, durable workflow rules, and the top-level Child DOX Index.
- Child AGENTS.md files own domain-specific instructions and their own Child
  DOX Index.
- Each parent explains what its direct children cover and what stays owned by
  the parent.
- The closer a doc is to the work, the more specific and practical it must be.

### 8.5 Child doc shape

Create a child AGENTS.md when a folder becomes a durable boundary with its own
purpose, rules, responsibilities, workflow, materials, or quality standards.
Use this default section order:

1. Purpose
2. Ownership
3. Local Contracts
4. Work Guidance
5. Verification
6. Child DOX Index

Work Guidance must reflect current project standards or user instructions. If
there are no specific local standards yet, leave it empty. Verification must
reflect an existing check. If no verification framework exists yet, leave it
empty and update it when one exists.

### 8.6 Style

- Keep docs concise, current, and operational.
- Document stable contracts, not diary entries.
- Put broad rules in parent docs and concrete details in child docs.
- Prefer direct bullets with explicit names.
- Do not duplicate rules across many files unless each scope needs a local
  version.
- Delete stale notes instead of explaining history.
- Trim obvious statements, repeated rules, misplaced detail, and warnings for
  risks that no longer exist.

### 8.7 Closeout

1. Re-check changed paths against the DOX chain.
2. Update nearest owning docs and any affected parents or children.
3. Refresh every affected Child DOX Index.
4. Remove stale or contradictory text.
5. Run existing verification when relevant.
6. Report any docs intentionally left unchanged and why.

### 8.8 User preferences

When the user requests a durable behavior change, record it here or in the
relevant child AGENTS.md as part of the DOX pass.

### 8.9 Child DOX Index

Read the direct child AGENTS.md for the subtree you will touch:

- [`.github/AGENTS.md`](./.github/AGENTS.md) - GitHub workflows, CI, prompts,
  and repository automation metadata.
- [`.specify/AGENTS.md`](./.specify/AGENTS.md) - Specify plans, specs, tasks,
  templates, memory, and generated planning artifacts.
- [`apps/AGENTS.md`](./apps/AGENTS.md) - app workspaces that are not the public
  marketing surface.
- [`audits/AGENTS.md`](./audits/AGENTS.md) - audit records, generated site
  inventories, scorecards, raw captures, and fix roadmaps.
- [`data/AGENTS.md`](./data/AGENTS.md) - structured catalog data and other
  durable data files.
- [`db/AGENTS.md`](./db/AGENTS.md) - SQL migrations and database schema history.
- [`docs/AGENTS.md`](./docs/AGENTS.md) - canonical documentation, architecture,
  design, deployment, specs, and archive stubs.
- [`env/AGENTS.md`](./env/AGENTS.md) - env templates and env documentation
  inside the env subtree.
- [`packages/AGENTS.md`](./packages/AGENTS.md) - workspace packages and shared
  package contracts.
- [`public/AGENTS.md`](./public/AGENTS.md) - static public files, media, fonts,
  manifests, and asset maps.
- [`repos/AGENTS.md`](./repos/AGENTS.md) - nested or linked external repos.
- [`scripts/AGENTS.md`](./scripts/AGENTS.md) - operational scripts, setup
  scripts, codemods, release checks, and infrastructure helpers.
- [`skills/AGENTS.md`](./skills/AGENTS.md) - repo-local AI skills and reusable
  task instructions.
- [`specs/AGENTS.md`](./specs/AGENTS.md) - Git Spec-ready specs, plans,
  research, tasks, contracts, and quickstarts.
- [`src/AGENTS.md`](./src/AGENTS.md) - Next.js source code, routes, components,
  config, content, data access, and integrations.
- [`test/AGENTS.md`](./test/AGENTS.md) - repository tests and test fixtures.
- [`tools/AGENTS.md`](./tools/AGENTS.md) - repo/admin tooling and local helper
  commands.

Runtime/build/cache folders such as `.codex`, `.next`, `.vercel`,
`node_modules`, `.cleanup-quarantine-*`, and package `dist/` folders are not
indexed as durable DOX subtrees.
