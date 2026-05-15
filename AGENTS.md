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
| Marketing IA         | [`MARKETING-IA.md`](./MARKETING-IA.md)                      |
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

### Commit & branch hygiene

- One concern per branch. Branch names: `chore/...`, `feat/...`,
  `fix/...`, `docs/...`, `security/...`.
- Commit messages describe the *why*, not the *what*.
- Open a draft PR and let CI run before requesting review.

---

## 5. Tone for AI-authored content

Match the brand voice documented in [`docs/DESIGN.md`](./docs/DESIGN.md):
**signal over noise**. Marketing copy is direct, founder-led, technical, and
free of generic AI-agency clichés ("unlock", "harness", "supercharge",
"revolutionize", emoji decoration). Code comments stay short and load-bearing.

---

## 6. When in doubt

Stop and ask. A clarifying question is cheaper than a wrong-direction PR.
