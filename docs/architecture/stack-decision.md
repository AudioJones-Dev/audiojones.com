# Stack decision — AudioJones.com

**Status:** accepted
**Date:** 2026-04-29
**Owner:** AudioJones engineering

## TL;DR

AudioJones.com is a content, authority, SEO/AEO, lead capture, and conversion
site. It runs on:

```
Cloudflare
  → Vercel / Next.js
    → Sanity CMS
    → NeonDB
    → Resend
    → n8n
    → Stripe
    → MailerLite
    → ImageKit
```

Firebase, Whop, and Supabase are **intentionally excluded** from this site.

## Why not Firebase

The site's responsibilities — marketing pages, SEO/AEO content, lead capture,
email notifications, and lightweight automation — are already covered by the
stack above without overlap:

| Need                       | Service                                         |
| -------------------------- | ----------------------------------------------- |
| DNS (registrar)            | GoDaddy (delegated to Cloudflare)               |
| CDN, edge, WAF             | Cloudflare                                      |
| Hosting, SSR, API routes   | Vercel + Next.js                                |
| CMS / structured content   | Sanity                                          |
| Lead + structured data DB  | NeonDB (Postgres)                               |
| Transactional email        | Resend                                          |
| Waitlist / newsletter      | MailerLite                                      |
| Workflow / CRM automation  | n8n (optional)                                  |
| Payments                   | Stripe                                          |
| Media CDN                  | ImageKit                                        |
| File / static binary       | Cloudflare R2                                   |

Adding Firebase on top of that would duplicate Vercel hosting, Vercel/Next.js
serverless functions, Cloudflare R2, and Postgres — without adding capability
for this specific site.

Firebase Studio is also being sunset on **March 22, 2027**, with core Firebase
services remaining available. This is not a panic migration — it is
architectural cleanup so the site stops carrying an unused dependency.

## Mapping of removed Firebase responsibilities

| Old (Firebase)                  | New (approved stack)                                              |
| ------------------------------- | ----------------------------------------------------------------- |
| Firestore (lead storage)        | NeonDB — `applied_intelligence_leads` (db/migrations/)            |
| Firestore (CMS data)            | Sanity (already canonical)                                        |
| Firebase Auth                   | Not used — site has no auth surface (see 2026-06-08 decision)     |
| Firebase Storage                | Cloudflare R2 (binaries) / ImageKit (media)                       |
| Firebase Hosting                | Vercel + Cloudflare                                               |
| Firebase Cloud Functions        | Next.js API routes / Vercel Functions / Cloudflare Workers / n8n  |
| Firebase email triggers         | Resend (+ n8n for orchestration)                                  |

## When Firebase may be reconsidered

Firebase is not banned across the org. It is excluded **for this site**.
Future products where Firebase may legitimately be reconsidered:

- Mobile apps (iOS / Android)
- Push notification systems
- Offline-first / sync-heavy clients
- Realtime collaboration features

Any such reintroduction must be a deliberate, separately scoped decision — not
an accidental dependency creep into AudioJones.com.

## Guardrail

`scripts/check-no-firebase.ts` (run via `pnpm check:no-firebase`) fails the
build if Firebase imports, Firebase packages, or `FIREBASE_*` /
`NEXT_PUBLIC_FIREBASE_*` env keys are reintroduced into source or env
templates. Wire it into CI.

## Migration notes

- `src/db/neon.ts` and `src/db/leads.ts` are the canonical NeonDB entry points.
- The lead capture flow lives at `src/app/api/leads/route.ts` and
  `src/app/api/founder-intelligence/leads/route.ts` (the diagnostic form).
- The Neon table is still named `applied_intelligence_leads` after the
  2026-06-08 Applied Intelligence → Founder Intelligence System rebrand;
  the legacy table name is stable and is read/written by the new symbols
  (`insertFounderIntelligenceLead`, etc.). See [`docs/DECISIONS.md`](../DECISIONS.md).
