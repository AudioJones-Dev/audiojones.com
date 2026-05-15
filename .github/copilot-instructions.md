# Audio Jones Website — AI Development Guide

> This file is the GitHub Copilot / AI agent guide for **audiojones.com**.
> The durable contract is in [`AGENTS.md`](../AGENTS.md) at the repo
> root; Claude-specific notes are in [`CLAUDE.md`](../CLAUDE.md). Read
> those first.

## What this repo is

`audiojones.com` is the **public marketing site** for AJ Digital LLC —
content, SEO/AEO, the Applied Intelligence diagnostic, lead capture, and
booking. It is **not** an admin/portal application; the legacy
`/portal/*` and `/api/admin/*` surface is being phased out and should
not be deepened.

## Stack

```
Cloudflare → Vercel + Next.js 16 (App Router, React 19, TypeScript strict)
             → Sanity CMS
             → NeonDB (Postgres) — leads + structured data
             → Resend — transactional email
             → n8n — optional workflow automation
             → Supabase — only when auth/storage/realtime is needed
             → Whop / Stripe — licensing and payments
             → ImageKit — media CDN
```

**Firebase is intentionally excluded.** Do not reintroduce
`firebase`, `firebase-admin`, `FIREBASE_*`, or
`NEXT_PUBLIC_FIREBASE_*`. The `pnpm check:no-firebase` script fails CI
if you do. See [`docs/DECISIONS.md`](../docs/DECISIONS.md) and
[`docs/architecture/stack-decision.md`](../docs/architecture/stack-decision.md)
for the rationale.

## Canonical paths

| Concern              | Source of truth                                                |
| -------------------- | -------------------------------------------------------------- |
| Product brief        | [`docs/PRD.md`](../docs/PRD.md)                                |
| Design system        | [`docs/DESIGN.md`](../docs/DESIGN.md)                          |
| Roadmap              | [`docs/ROADMAP.md`](../docs/ROADMAP.md)                        |
| Security posture     | [`docs/SECURITY.md`](../docs/SECURITY.md)                      |
| Deployment / env     | [`docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md)                  |
| Decision log         | [`docs/DECISIONS.md`](../docs/DECISIONS.md)                    |
| Changelog            | [`docs/CHANGELOG.md`](../docs/CHANGELOG.md)                    |
| Env shape            | [`.env.example`](../.env.example)                              |
| Env validation       | `packages/config/env.schema.ts`                                |
| Marketing IA         | [`MARKETING-IA.md`](../MARKETING-IA.md)                        |
| Nav config           | `src/config/nav.ts`                                            |
| Lead intake          | `src/app/api/applied-intelligence/leads/route.ts`              |
| Lead persistence     | `src/db/leads.ts`, `db/migrations/`                            |

## Architecture patterns

### Lead capture (the most important flow)

1. Form submits to `src/app/api/applied-intelligence/leads/route.ts` (or
   the generic `src/app/api/leads/route.ts`).
2. Handler validates with **Zod**, rate-limits per IP, and scores the
   lead via `src/lib/leads/lead-scoring.ts`.
3. Lead is **persisted to NeonDB** (`src/db/leads.ts →
   insertAppliedIntelligenceLead`) **before** the response returns.
4. Internal notification is sent via **Resend**
   (`RESEND_API_KEY` + `LEAD_NOTIFICATION_EMAIL`).
5. Optional `N8N_LEAD_WEBHOOK_URL` fires last; failures are logged but
   never block the response.

### Content

Long-form content (insights, blog, topic clusters) lives in **Sanity
CMS** and is rendered through the App Router. Schema notes:
[`docs/sanity-blog-content-model.md`](../docs/sanity-blog-content-model.md).

### Commerce

- **Whop** (`/api/whop/*`) — productized offerings, licensing.
- **Stripe** (`/api/stripe/*`) — payments and customer portal.

The site links into checkout but does not own post-purchase fulfillment.

### Imagery

`IKImage` (in `src/components/`) routes through ImageKit in production
and falls back to local `/public` assets in dev. Use `IKImage` instead
of raw `<Image>` for any path under `/assets/`.

### Tailwind & tokens

Tailwind v4 with CSS variables. Tokens are defined in **four** places
that must stay in sync — see [`docs/DESIGN.md`](../docs/DESIGN.md).
Reach for the semantic typography classes (`.h-display`, `.h-1`,
`.eyebrow`, `.metric`) before hand-rolling type stacks.

## Workflow

### Before changes

1. Read the relevant canonical doc above.
2. Read the surrounding files; match existing patterns.
3. If the change feels architectural, add a
   [`DECISIONS.md`](../docs/DECISIONS.md) entry instead of guessing.

### While changing code

- Prefer editing existing files over creating new ones.
- Keep diffs minimal and scoped. Don't refactor for taste.
- Don't introduce new dependencies without explicit approval.
- Don't add comments that restate the code; add comments only when the
  *why* is non-obvious.
- Don't create new top-level `*_COMPLETE.md` / `*_HARDENING_*.md` reports.
  Add to [`docs/CHANGELOG.md`](../docs/CHANGELOG.md) instead.

### Before committing

```bash
pnpm install            # if dependencies could have drifted
pnpm typecheck
pnpm lint
pnpm check:no-firebase
pnpm build
```

If any step fails, **fix the cause**. Do not bypass it (no `--no-verify`,
no skipping the Firebase guard).

## Security

- No secrets in the repo — ever. Storage is Vercel env vars (or
  Doppler/1Password locally). See [`docs/SECURITY.md`](../docs/SECURITY.md).
- Webhook routes verify signatures from `*_WEBHOOK_SECRET`.
- `NEXT_PUBLIC_*` is shipped to the browser; server-only secrets must
  not start with that prefix.

## Common pitfalls

- **Firebase imports.** Even harmless ones break CI via
  `check:no-firebase`. There is no Firebase in this site.
- **Skipping Neon persistence.** Lead handlers must write to Neon
  *before* responding 200. Do not move the persistence call after the
  Resend / n8n calls.
- **Truncated long secrets in Vercel.** Use the CLI with file input;
  see [`docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md).
- **Stale workspace package builds.** `pnpm build` already runs
  `pnpm packages:build`; if you bypass it, expect missing exports from
  `@aj/*`.
- **Missing Sanity dataset env.** Without
  `NEXT_PUBLIC_SANITY_PROJECT_ID`, the blog surface renders empty
  rather than failing — set it explicitly per environment.

## Routes

Authoritative list: [`MARKETING-IA.md`](../MARKETING-IA.md) and
`src/config/nav.ts`. Do not rename a route without a redirect plan and
explicit approval.
