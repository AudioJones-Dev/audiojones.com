# SECURITY.md — AudioJones.com

**Status:** canonical
**Supersedes:** root `secrets.md`

This document defines how secrets, credentials, and sensitive data are
handled in this repository. Read it before adding any environment
variable, integration, or admin endpoint.

---

## 1. Bright lines

1. **No secrets in the repo.** Ever. Not in `.env.example`, not in docs,
   not in scripts, not in code, not in test fixtures, not in commit
   messages, not in PR descriptions.
2. **No Firebase reintroduction.** `pnpm check:no-firebase` enforces
   this in CI.
3. **No admin endpoints without auth.** Any route under
   `/api/admin/*` or `/portal/admin/*` must verify identity *and*
   authorization on the server.
4. **No client-side secrets.** Anything prefixed `NEXT_PUBLIC_*` is
   shipped to the browser. Server-only secrets must not start with that
   prefix.
5. **No production data in dev.** Local development uses fixtures,
   mocks, or scoped test accounts.

---

## 2. Where secrets live

| Environment | Storage                                                          |
| ----------- | ---------------------------------------------------------------- |
| Production  | Vercel Project Environment Variables (encrypted at rest).        |
| Preview     | Vercel Project Environment Variables (Preview scope).            |
| Local dev   | `.env.local` (gitignored). Optionally Doppler / 1Password.       |
| Long secrets (PEM, JWT private keys) | Vercel CLI with `--sensitive --force`, fed from a local file (see [`DEPLOYMENT.md`](./DEPLOYMENT.md)). |

The shape of supported variables is documented in
[`.env.example`](../.env.example) and validated by
`packages/config/env.schema.ts`.

---

## 3. If a secret leaks

A secret is considered compromised the moment it lands anywhere outside
the approved stores above — including:

- A committed file (even if force-pushed away later; assume git history
  is forever for risk purposes).
- A Slack message, screenshot, screen recording, or video.
- A PR description, code comment, or doc.
- A logged HTTP request or stack trace.
- A third-party AI tool prompt.

### Response

1. **Rotate immediately** in the issuing system (Stripe, Whop, Resend,
   Neon, Sanity, etc.).
2. Update the value in Vercel for every scope (production, preview,
   development).
3. Invalidate any derived sessions / tokens if the credential signed
   anything.
4. Note the incident in [`CHANGELOG.md`](./CHANGELOG.md) under a
   `Security` entry, with the date and the rotation steps taken (no
   secret values).

---

## 4. Application security model

### 4.1 Lead intake

- All form handlers validate input with Zod before any side effect.
- Per-IP rate limiting is applied in
  `src/app/api/founder-intelligence/leads/route.ts` and the generic
  `src/app/api/leads/route.ts`.
- Persistence to NeonDB happens **before** the response returns 200.
- Optional downstream calls (Resend, n8n) must not block the response
  on failure; failures are logged, not propagated.

### 4.2 Admin / portal routes (legacy)

The legacy admin surface uses three layers when present:

1. **Edge middleware** (`middleware.ts`) — checks for a session cookie
   before allowing `/portal/admin/*`.
2. **Server layout** — verifies session cookie + admin claim.
3. **API guards** — Bearer token validation in protected routes.

Do not deepen this surface; it is on the decommission queue. New admin
needs go to a separate application.

### 4.3 Webhook endpoints

- Inbound webhooks (Whop, Stripe, n8n) verify signatures using their
  documented secret before acting on the payload.
- The signing secret is read from env (`*_WEBHOOK_SECRET`); never
  hard-coded.
- Replay protection is enforced where the provider supports it
  (timestamp window).

### 4.4 Edge / CDN

- Cloudflare provides DNS, WAF, and CDN.
- Vercel hosts the application and runs middleware at the edge for
  per-request checks.

---

## 5. Headers & CSP

Production responses set:

- `Strict-Transport-Security` (HSTS) with a long max-age.
- `Content-Security-Policy` scoped to the integrations actually used
  (Sanity, ImageKit, Cloudflare, Vercel analytics, Calendly/Cal.com,
  Whop, Stripe).
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `X-Content-Type-Options: nosniff`.
- `Permissions-Policy` denying camera/microphone by default.

Changes to security headers must land in `next.config.ts` (or the
relevant middleware) and be reviewed.

---

## 6. Reporting a vulnerability

Internal: open a private issue in the AJ Digital `audiojones-dev/audiojones.com`
repository and tag the maintainer.

External: email **security@audiojones.com** with the details. Do not
file a public issue for an unpatched vulnerability.

---

## 7. Audit hooks

- `pnpm check:no-firebase` — fails CI if Firebase is reintroduced.
- `pnpm lint:api-imports` — guardrail on API route imports.
- A repository secret-scan workflow is planned (out of scope for this
  PR; tracked in [`ROADMAP.md`](./ROADMAP.md)).
