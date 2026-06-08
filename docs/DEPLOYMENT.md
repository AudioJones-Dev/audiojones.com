# DEPLOYMENT.md — AudioJones.com

**Status:** canonical
**Supersedes:** root `DEPLOYMENT.md`, root `VERCEL_ENV_SETUP.md`,
`docs/VERCEL_ENV_SOP.md`

This is the operational guide for shipping AudioJones.com. For *what*
the product is, see [`PRD.md`](./PRD.md). For *why* the stack looks
like this, see [`DECISIONS.md`](./DECISIONS.md) and
[`architecture/stack-decision.md`](./architecture/stack-decision.md).

---

## 1. Stack at a glance

```
Cloudflare → Vercel + Next.js 16 (App Router, React 19)
             → Sanity CMS
             → NeonDB (Postgres)
             → Resend
             → n8n
             → Supabase   (only if auth/storage/realtime is needed)
             → Whop / Stripe
             → ImageKit
```

Firebase is intentionally excluded. `pnpm check:no-firebase` enforces
this; do not bypass it.

---

## 2. Hosting

| Concern         | Provider                                              |
| --------------- | ----------------------------------------------------- |
| DNS / WAF / CDN | Cloudflare                                            |
| App hosting     | Vercel (automatic deploys from `main` and PR branches)|
| Media CDN       | ImageKit (`https://ik.imagekit.io/audiojones`)        |
| Static binary   | Cloudflare R2 (preferred) or Supabase Storage         |

The Vercel project is `audiojones-com` under the AJ Digital team. PRs
get preview deployments automatically; merging to `main` deploys to
production.

---

## 3. Environment variables

### 3.1 Source of truth

- **Shape:** [`.env.example`](../.env.example).
- **Validation:** `packages/config/env.schema.ts`.
- **Documentation:** this file + the `.env.example` comments.

`docs/env.example` and `docs/env/env-template.md` are now redirect
stubs pointing here and at `.env.example`. Do not maintain them as
parallel templates.

### 3.2 Local setup

```bash
cp .env.example .env.local
# Fill in the values you actually need. The minimum to run lead capture
# end-to-end is DATABASE_URL + RESEND_API_KEY.
pnpm install
pnpm dev
```

### 3.3 Adding a new variable

1. Add it to [`.env.example`](../.env.example) (with an empty value and
   a one-line comment if non-obvious).
2. Add it to `packages/config/env.schema.ts` so the Zod validator
   catches misconfiguration early.
3. Set it in Vercel for **all three** scopes: production, preview,
   development.
4. Reference it from code via the validated config — never directly
   from `process.env` in app code if a typed accessor exists.

### 3.4 Booking provider (`NEXT_PUBLIC_BOOKING_URL`)

The `/book-a-call` page renders an `<iframe>` scheduler embed sourced
from `NEXT_PUBLIC_BOOKING_URL` — typically a Calendly or Cal.com event
URL. Set it in Vercel for **production**, **preview**, and
**development** scopes so previews behave like production. The page
degrades to an apply-async CTA when the variable is unset, so missing
the value in a preview won't break the build — but it will silently
swap the conversion path back to `/apply`. When rotating the booking
URL, update all three Vercel scopes together; the value is public
(it's already prefixed `NEXT_PUBLIC_`), so no `--sensitive` flag is
needed.

### 3.5 Removing a variable

1. Remove the consumer code first.
2. Remove from `.env.example` and `packages/config/env.schema.ts` in
   the same change.
3. Remove from Vercel scopes after the deploy is live.

---

## 4. Long secrets (PEM keys, JWT private keys)

The Vercel dashboard has historically truncated very long values. The
reliable workflow is the CLI with file input:

```bash
# 1. Keep the key file local and gitignored.
# 2. Pipe it directly so newlines and headers survive intact.
cat scripts/long-secret.txt | vercel env add LONG_SECRET production --sensitive --force
```

Notes:

- `--sensitive` hides the value in the dashboard.
- `--force` overwrites an existing entry.
- Verify length after upload (`vercel env pull` to a temp file, check
  character count, then delete the temp file). Do not commit it.
- Prefer file input over Base64 — it's simpler to debug. Base64 is a
  valid fallback if a transport step keeps mangling newlines.

---

## 5. Deploy workflow

### 5.1 Standard release

```bash
# Branch and develop
git checkout -b feat/your-change
# ... edit ...
pnpm typecheck
pnpm lint
pnpm check:no-firebase
pnpm build

git push -u origin feat/your-change
# Open a draft PR. Vercel posts a preview URL on the PR.
# Promote PR to ready, request review, merge to main.
```

Merging to `main` triggers the production deploy automatically. No
manual `vercel --prod` step is required for the standard flow.

### 5.2 Manual / emergency deploy

If the auto-deploy is unhealthy and a manual push is needed:

```bash
vercel --prod
```

This requires the Vercel CLI to be authenticated against the AJ
Digital team. Use sparingly; the standard flow is auditable, manual
deploys are not.

### 5.3 Rollback

Use the Vercel dashboard's **Promote** action on the previous healthy
deployment. Avoid `git revert` as the first move — it produces a noisy
history and a slower rollback than promoting an existing build.

---

## 6. Validation pipeline

Local and CI both run:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck   # tsc --noEmit
pnpm packages:build
pnpm check:no-firebase
pnpm build
```

CI is authoritative — if local passes and CI fails, trust CI.

---

## 7. Monitoring

- **Vercel** — build logs, runtime logs, analytics.
- **Sentry** — application errors (`SENTRY_DSN` env).
- **Cloudflare** — edge metrics, WAF events.
- **Resend** — email delivery logs.
- **Neon** — query logs and connection pool metrics.

When something breaks in production, start with Vercel runtime logs,
then Sentry, then the relevant integration's dashboard.

---

## 8. Common pitfalls

- **Truncated secrets.** Always verify long secrets with `vercel env
  pull` (then delete the file). The 40-char truncation bug has bitten
  this project before; see the historical context in
  [`CHANGELOG.md`](./CHANGELOG.md).
- **Stale workspace package builds.** `pnpm build` already runs
  `pnpm packages:build`; if you bypass it, expect missing exports from
  `@aj/*`.
- **Forgotten Sanity dataset variable.** A missing
  `NEXT_PUBLIC_SANITY_PROJECT_ID` won't crash the build, but the blog
  surface will render empty. Set it explicitly per environment.
- **n8n outage.** Lead capture must keep working. Confirm
  `applied_intelligence_leads` is receiving rows in Neon when the n8n
  webhook is timing out.

---

## 9. Related docs

- [`docs/SECURITY.md`](./SECURITY.md) — secrets, CSP, admin gating.
- [`docs/architecture/stack-decision.md`](./architecture/stack-decision.md)
  — why the stack looks like this.
- [`docs/architecture/backend-stack.md`](./architecture/backend-stack.md)
  — runtime topology.
- [`docs/dev-setup.md`](./dev-setup.md) — local recovery procedures.
