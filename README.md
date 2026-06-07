# audiojones.com

Public marketing site for **AJ Digital LLC** — content, SEO/AEO, the
Applied Intelligence diagnostic, lead capture, and booking. Built on
Next.js 16 (App Router, React 19) and TypeScript, deployed via Vercel
behind Cloudflare.

## Documentation

The repo's source-of-truth docs live under [`docs/`](./docs/):

- **[`docs/PRD.md`](./docs/PRD.md)** — what the site is for.
- **[`docs/design/DESIGN.md`](./docs/design/DESIGN.md)** — brand, tokens, voice.
- **[`docs/ROADMAP.md`](./docs/ROADMAP.md)** — what's in flight.
- **[`docs/SECURITY.md`](./docs/SECURITY.md)** — secrets and posture.
- **[`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)** — env vars, Vercel,
  release flow.
- **[`docs/DECISIONS.md`](./docs/DECISIONS.md)** — architecture
  decision log.
- **[`docs/CHANGELOG.md`](./docs/CHANGELOG.md)** — notable repo-level
  changes.

If you are an AI coding agent, start with **[`AGENTS.md`](./AGENTS.md)**
(and **[`CLAUDE.md`](./CLAUDE.md)** if you are Claude Code). Those
files define the contract for changes in this repo.

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

**Firebase is intentionally excluded.** See
[`docs/DECISIONS.md`](./docs/DECISIONS.md). The
`pnpm check:no-firebase` script fails CI if a Firebase import, package,
or env key is reintroduced.

## Quick start

```bash
cp .env.example .env.local
# Fill in DATABASE_URL and RESEND_API_KEY at minimum to exercise lead capture.
pnpm install
pnpm dev          # http://localhost:3000
```

Required toolchain: Node 22+, pnpm 10.30.3 (pinned via `packageManager`),
git.

## Validation

Run before opening a PR:

```bash
pnpm typecheck
pnpm lint
pnpm check:no-firebase
pnpm build
```

CI is authoritative. If local passes and CI fails, trust CI. See
[`docs/dev-setup.md`](./docs/dev-setup.md) for known recovery
procedures.

## Environment

[`.env.example`](./.env.example) is the canonical shape. Validation
lives in `packages/config/env.schema.ts`. Provider-specific notes are
in [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

Never commit secrets — see [`docs/SECURITY.md`](./docs/SECURITY.md).

## Repository layout

| Path                        | Purpose                                          |
| --------------------------- | ------------------------------------------------ |
| `src/app/`                  | Next.js App Router pages and API routes.         |
| `src/components/`           | UI components (canonical primitives in `ui/`).   |
| `src/lib/`                  | Domain logic (lead scoring, applied-intelligence tokens, integrations). |
| `src/db/`                   | NeonDB clients and lead persistence.             |
| `db/migrations/`            | SQL migrations for the lead store.               |
| `packages/`                 | Workspace packages (`@aj/config`, `@aj/whop`, adapters). |
| `public/`                   | Static assets (fonts, logos, images).            |
| `docs/`                     | Canonical documentation.                         |
| `scripts/`, `tools/`        | One-off and operational scripts.                 |
| `functions/`                | **Legacy Firebase Functions tree.** Excluded from the TS program; do not extend. |

## License

ISC — see `package.json`.
