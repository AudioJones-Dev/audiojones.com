# PR Review Notes — April 29, 2026

## Scope Reviewed
Recent changes merged to `main` covering the Applied Intelligence release.
Anchored to commits:
- `b25a097` feat(applied-intelligence): build personal brand site, diagnostic funnel, Step 2 layer
- `00b120f` chore: add resend, @neondatabase/serverless, @neondatabase/neon-js, @supabase/supabase-js, @supabase/ssr dependencies
- `cc376ad` fix: use correct @neondatabase/neon-js beta version
- `9240b58` fix(ci): move corepack before setup-node, use no-frozen-lockfile, pass required env vars
- `2a5f12c` feat: Applied Intelligence redesign — funnel, Step 2, frameworks, insights + all integrations

## Summary of Changes

### 1) Applied Intelligence + Step 2 repositioning
- Homepage flow now includes a dedicated Step 2 section in the primary narrative (`src/components/home/Step2Section.tsx`).
- Messaging emphasizes the "missing middle" and directs users to a Step 2 explainer (`src/app/step-2/page.tsx`) and diagnostic funnel.
- Applied Intelligence surface expanded with `src/app/applied-intelligence/page.tsx`, `src/app/frameworks/`, `src/app/insights/`, and components under `src/components/applied-intelligence/`.

### 2) Lead funnel backend implementation
- Lead intake API at `src/app/api/applied-intelligence/leads/route.ts` (104 LoC).
- Validation, anti-abuse controls (in-memory rate limiter + honeypot field), lead scoring, persistence, and async notifications via `src/lib/leads/{lead-schema,lead-scoring,lead-storage,lead-notifications}.ts`.

### 3) CI/build stability fixes
- `.github/workflows/ci.yml` now enables Corepack before `setup-node`, activates pinned `pnpm@10.30.3`, and installs deps with `--no-frozen-lockfile`.
- Build step maps required env vars/secrets (Firebase, Stripe, Whop, Resend, `DATABASE_URL`, etc.) to reduce deployment-time failures.

### 4) Dependency/integration expansion
- Added/pinned `@neondatabase/serverless@^1.0.0`, `@neondatabase/neon-js@0.2.0-beta.1`, `@supabase/supabase-js@^2.50.0`, `@supabase/ssr@^0.6.1`, `resend@^4.6.0`.
- Follow-up commit `cc376ad` corrected the Neon beta package version.

## Risks / Follow-ups
- **`--no-frozen-lockfile` in CI** weakens reproducible builds and hides lockfile drift. Track restoring `--frozen-lockfile` once the lockfile is reconciled.
- **In-memory rate limiter** in the lead route does not survive serverless cold starts and is per-instance; effective protection requires a shared store (Upstash/Redis/KV).
- **Honeypot-only spam mitigation** will be defeated by targeted bots. Consider Turnstile/hCaptcha or a server-side scoring threshold before notifications fan out.
- **Neon beta pin** (`0.2.0-beta.1`) is intentional but should be revisited on each upstream release until GA.
- Several CI env values are placeholders (`MAILERLITE_GROUP_ID`, `N8N_WEBHOOK_URL`, `WHOP_WEBHOOK_SECRET`, `NEXT_PUBLIC_WHOP_COMPANY_ID`, `NEXT_PUBLIC_WHOP_AGENT_USER_ID`); confirm that these are not required at build time.

## Net Impact
Production-ready acquisition pipeline (lead intake + scoring + notifications) plus expanded Applied Intelligence content surface, landing on a CI configuration that builds reliably but trades some reproducibility guarantees that should be restored.
