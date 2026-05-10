# Audio Jones — Deployment Guide

## Stack

```
Cloudflare → Vercel + Next.js 16 → Sanity (CMS) + NeonDB (Postgres) + Resend + n8n
```

Firebase has been removed from this site. See
[`docs/architecture/stack-decision.md`](docs/architecture/stack-decision.md).
The guard `pnpm check:no-firebase` fails the build if Firebase imports or
`FIREBASE_*` env keys reappear.

## How a deploy happens

Continuous deploy on push to `main` via `.github/workflows/deploy.yml` →
Vercel. There is no manual `vercel --prod` step in the normal flow. PRs trigger
Vercel preview deploys; `smoke-preview.yml` then hits the preview URL to
confirm the marketing surface loads.

| Workflow                         | Trigger                | Purpose                                  |
| -------------------------------- | ---------------------- | ---------------------------------------- |
| `ci.yml`                         | PR + push to `main`    | lockfile / typecheck / build             |
| `deploy.yml`                     | push to `main`         | production deploy to Vercel              |
| `smoke-preview.yml`              | PR                     | smoke-test the Vercel preview URL        |
| `smoke-prod.yml`                 | every 30 min           | smoke-test public marketing routes       |

## Vercel environment variables

Set in Vercel Project Settings → Environment Variables (Production scope).

### Required for marketing launch

- `NEXT_PUBLIC_SITE_URL` = `https://audiojones.com`
- `DATABASE_URL` — Neon Postgres connection string
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_NOTIFICATION_EMAIL`
- `IP_HASH_SALT`, `LEAD_FORM_SECRET`
- `IMAGEKIT_ENDPOINT`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
  `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`
- `N8N_LEAD_WEBHOOK_URL` (or `CRM_WEBHOOK_URL`)

### Required for commerce / portal

- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
  `STRIPE_WEBHOOK_SECRET`
- `WHOP_API_KEY`, `NEXT_PUBLIC_WHOP_APP_ID`, `NEXT_PUBLIC_WHOP_COMPANY_ID`,
  `WHOP_WEBHOOK_SECRET`

### Optional

- `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`
- `OPENAI_API_KEY`
- `SENTRY_DSN`, `RELEASE`

See `docs/VERCEL_ENV_SOP.md` for the canonical per-integration matrix.

## Database migrations

Schema lives in `db/migrations/`. Apply against Neon prod **before** promoting
code that depends on a new table — the storage adapters refuse to fall back to
the mock provider when `NODE_ENV=production` and `DATABASE_URL` is set.

| File                                     | Owner table                  |
| ---------------------------------------- | ---------------------------- |
| `001_applied_intelligence_leads.sql`     | `applied_intelligence_leads` |
| `002_roi_calculator_leads.sql`           | `roi_calculator_leads`       |

To apply a migration on Neon, paste the SQL into the Neon SQL editor against
the production branch, or run with any Postgres client:

```bash
psql "$DATABASE_URL" -f db/migrations/002_roi_calculator_leads.sql
```

## Pre-launch verification

1. `pnpm release:check` runs clean locally (install + no-Firebase guard +
   build).
2. Submit a real lead through each capture surface and confirm:
   - Neon row appears in the matching table
   - Resend delivers the operator email to `LEAD_NOTIFICATION_EMAIL`
   - n8n webhook receives the payload (if configured)

   | Surface                                   | API endpoint                              | Table                          |
   | ----------------------------------------- | ----------------------------------------- | ------------------------------ |
   | `/applied-intelligence/diagnostic`        | `/api/applied-intelligence/leads`         | `applied_intelligence_leads`   |
   | `/apply`                                  | `/api/applied-intelligence/leads`         | `applied_intelligence_leads`   |
   | `/roi-calculator`                         | `/api/roi-calculator/lead`                | `roi_calculator_leads`         |
   | Newsletter forms                          | `/api/newsletter/subscribe`               | (MailerLite — no table)        |

3. Verify `https://audiojones.com/sitemap.xml` and `/robots.txt` are 200 and
   list the routes you intend to drive traffic to.
4. Confirm the `smoke-prod.yml` cron is green in the Actions tab.

## Public marketing surface

| Route                                | Status                         |
| ------------------------------------ | ------------------------------ |
| `/`                                  | static (homepage)              |
| `/applied-intelligence`              | static                         |
| `/applied-intelligence/diagnostic`   | static                         |
| `/services`                          | dynamic (Whop catalog)         |
| `/roi-calculator`                    | static (client-side form)      |
| `/apply`                             | static                         |
| `/pricing`                           | static                         |
| `/insights` + `/insights/[slug]`     | static                         |
| `/frameworks` + `/frameworks/[slug]` | static                         |
| `/blog` + `/blog/[slug]`             | static (Sanity-backed)         |

`/portal/*`, `/ops/*`, and admin routes are gated by `middleware.ts` and are
not part of the public marketing surface.
