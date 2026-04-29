# Environment template — AudioJones.com

Canonical list of supported env vars. The source of truth is
[.env.example](../../.env.example) (shape) and
[packages/config/env.schema.ts](../../packages/config/env.schema.ts)
(validation).

Firebase env keys (`FIREBASE_*`, `NEXT_PUBLIC_FIREBASE_*`) are **not**
supported and will be flagged by `pnpm check:no-firebase`. See
[architecture/stack-decision.md](../architecture/stack-decision.md).

## Core

| Key                    | Required | Notes                                          |
| ---------------------- | -------- | ---------------------------------------------- |
| `NODE_ENV`             | yes      | `development` / `production` / `test`          |
| `NEXT_PUBLIC_SITE_URL` | yes      | Absolute URL, e.g. `https://audiojones.com`    |

## Database — NeonDB

| Key            | Required | Notes                                                |
| -------------- | -------- | ---------------------------------------------------- |
| `DATABASE_URL` | yes      | Neon connection string with `?sslmode=require`       |

## Email — Resend

| Key                       | Required | Notes                                          |
| ------------------------- | -------- | ---------------------------------------------- |
| `RESEND_API_KEY`          | yes      | Server-side                                    |
| `LEAD_NOTIFICATION_EMAIL` | yes      | Internal recipient for new leads               |
| `RESEND_FROM_EMAIL`       | no       | Defaults to a no-reply address if not set      |
| `FROM_EMAIL`              | no       | Legacy alias for `RESEND_FROM_EMAIL`           |

## n8n / CRM (optional)

Lead capture continues to work if these are not set.

| Key                    | Required | Notes                                |
| ---------------------- | -------- | ------------------------------------ |
| `N8N_LEAD_WEBHOOK_URL` | no       | Posts a lead-created event to n8n    |
| `N8N_WEBHOOK_URL`      | no       | Generic n8n webhook                  |
| `CRM_WEBHOOK_URL`      | no       | Fallback CRM handoff URL             |

## Applied Intelligence diagnostic

| Key                | Required | Notes                                    |
| ------------------ | -------- | ---------------------------------------- |
| `LEAD_FORM_SECRET` | no       | Optional shared secret between form/API  |
| `IP_HASH_SALT`     | no       | Salt used when hashing requester IPs     |

## Sanity CMS

| Key                            | Required | Notes                              |
| ------------------------------ | -------- | ---------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`| yes      | Project id                         |
| `NEXT_PUBLIC_SANITY_DATASET`   | yes      | Usually `production`               |
| `SANITY_API_READ_TOKEN`        | no       | Required for previews / drafts     |

## Supabase (only if needed)

Set only when the site genuinely needs auth, storage, or realtime.

| Key                              | Required |
| -------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | no       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | no       |
| `SUPABASE_SERVICE_ROLE_KEY`      | no       |

## Other

See `.env.example` for ImageKit, Stripe, Whop, MailerLite, OpenAI,
observability, and API base URL settings.

## Local dev

```bash
cp .env.example .env.local
# fill in the values you need (DATABASE_URL + RESEND_API_KEY are the minimum
# for lead capture to work end-to-end)
pnpm install
pnpm dev
```

## Verification

```bash
pnpm check:no-firebase   # repo guardrail
pnpm typecheck           # tsc --noEmit
pnpm lint
pnpm build
```
