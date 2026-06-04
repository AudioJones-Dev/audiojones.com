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

Two supported paths. Pick one.

**Option A — manual `.env.local` (no extra tooling):**

```bash
cp .env.example .env.local
# Fill in the values you actually need. The minimum to run lead capture
# end-to-end is DATABASE_URL + RESEND_API_KEY.
pnpm install
pnpm dev
```

**Option B — Doppler (shared secrets, no hand-copying):**

The repo is pinned to the `audiojones-com` project / `dev` config via
[`doppler.yaml`](../doppler.yaml), so the CLI resolves automatically
inside the repo — no interactive `doppler setup` is needed.

```bash
# One-time: install the CLI (https://docs.doppler.com/docs/install-cli)
# and authenticate against the AJ Digital workspace:
doppler login

pnpm install
pnpm dx:init   # links Doppler from doppler.yaml and writes
               # .env.development.local (gitignored) from the dev config
pnpm dev
```

To run a one-off command with secrets injected without writing a file:

```bash
doppler run -- pnpm dev
```

`.env.development.local` is gitignored (matched by `.env*.local`); never
commit it. `doppler.yaml` holds only project/config names — no secrets —
and is safe to commit.

### 3.3 Adding a new variable

1. Add it to [`.env.example`](../.env.example) (with an empty value and
   a one-line comment if non-obvious).
2. Add it to `packages/config/env.schema.ts` so the Zod validator
   catches misconfiguration early.
3. Set it in Vercel for **all three** scopes: production, preview,
   development.
4. Reference it from code via the validated config — never directly
   from `process.env` in app code if a typed accessor exists.

### 3.4 Removing a variable

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

## 9. Applied Intelligence diagnostic — preview QA checklist

The diagnostic at `/applied-intelligence/diagnostic` posts to
`/api/applied-intelligence/leads`, which writes a row to the Neon
`applied_intelligence_leads` table and fires Resend + (optional) n8n
notifications. Before promoting a preview to production, run this
checklist against the preview URL.

### 9.1 Required Vercel env (Preview + Production)

| Env var                   | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `DATABASE_URL`            | Neon Postgres connection string            |
| `RESEND_API_KEY`          | Internal lead-notification sender          |
| `LEAD_NOTIFICATION_EMAIL` | Internal recipient (AJ Digital inbox)      |
| `FROM_EMAIL`              | Verified Resend sender (e.g. `Audio Jones <notifications@audiojones.com>`) |

Optional:

| Env var                  | Purpose                                |
| ------------------------ | -------------------------------------- |
| `IP_HASH_SALT`           | Salt for IP-hash column. Defaults to a constant — set to a unique value before launch. |
| `N8N_LEAD_WEBHOOK_URL`   | Downstream automation. Lead capture continues if it fails. |
| `CRM_WEBHOOK_URL`        | Fallback if `N8N_LEAD_WEBHOOK_URL` is not set. |

### 9.2 Apply the migration to the target Neon database

The repo does not auto-apply migrations. Run the canonical schema
manually against the Preview Neon branch (or Production) before
expecting writes to succeed:

```bash
psql "$DATABASE_URL" -f db/migrations/001_applied_intelligence_leads.sql
```

Verify:

```bash
psql "$DATABASE_URL" -c "\d applied_intelligence_leads" | head -20
```

### 9.3 Submit a real test diagnostic against the preview

1. Open the Vercel preview URL → `/ai-readiness-diagnostic`.
2. Click *Start the Diagnostic* → wizard at `/applied-intelligence/diagnostic`.
3. Complete steps 1–6 using a real test inbox you control. Tick consent.
4. Submit → expect redirect to `/applied-intelligence/diagnostic/thank-you`.

### 9.4 Confirm the lead landed in Neon

```bash
psql "$DATABASE_URL" -c \
  "select id, email, total_score, priority, created_at
   from applied_intelligence_leads order by created_at desc limit 5;"
```

A row matching the submission must be present.

### 9.5 Confirm the internal notification fired

- Resend dashboard → Logs → filter recipient = `LEAD_NOTIFICATION_EMAIL`.
- Vercel runtime logs must **not** contain
  `[applied-intelligence] internal notification skipped: email env missing`
  on the happy path. If they do, an email env is unset for that
  environment.

### 9.6 Negative-path spot checks (curl against the preview)

```bash
# Validation error — missing required fields
curl -s -o /dev/null -w "%{http_code}\n" \
  -X POST "$PREVIEW/api/applied-intelligence/leads" \
  -H 'content-type: application/json' -d '{"firstName":"x"}'
# Expect: 400

# Honeypot trap
curl -s -X POST "$PREVIEW/api/applied-intelligence/leads" \
  -H 'content-type: application/json' \
  -d '{"firstName":"Bot","email":"bot@example.com","consentToContact":true,"website_url":"http://spam"}'
# Expect: { "ok": true, "leadId": "blocked", ... } and NO Neon row.

# Storage-error message must be generic
# (Confirm in Vercel runtime logs that the detailed error is logged
#  server-side, but the JSON response only contains the generic message.)
```

### 9.7 What "ready" means

The funnel is considered production-ready when 9.1 through 9.6 all
pass against the preview that mirrors production env. A green homepage
preview alone is not sufficient — the diagnostic must reach Neon and
trigger a Resend "Delivered" log entry.

---

## 10. Related docs

- [`docs/SECURITY.md`](./SECURITY.md) — secrets, CSP, admin gating.
- [`docs/architecture/stack-decision.md`](./architecture/stack-decision.md)
  — why the stack looks like this.
- [`docs/architecture/backend-stack.md`](./architecture/backend-stack.md)
  — runtime topology.
- [`docs/dev-setup.md`](./dev-setup.md) — local recovery procedures.
