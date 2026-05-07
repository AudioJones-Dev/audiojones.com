---
title: "Codex Brief — ROI Calculator v1 (full-stack)"
status: "ready-for-codex-handoff"
target_branch: "feat/roi-calculator-v1-fullstack"
parent_design_doc: "docs/design/DESIGN.md"
prototype_reference: "PR #47 (feat/nav-roi-calculator-2026-05-06) — paused as reference"
last_updated: "2026-05-06"
---

# Codex Brief — ROI Calculator v1

This brief is a self-contained handoff. Codex will build a clean v1 of the AudioJones.com ROI Calculator as a full-stack mobile-first lead-capture mini-app. **No prior conversation context is required to execute this.**

---

## 1. Why this exists (read before writing code)

The first attempt at this calculator (PR #47, branch `feat/nav-roi-calculator-2026-05-06`) is a working prototype that proved direction but is **not the v1 implementation**. Specifically:

**What PR #47 proved (preserve in v1):**

- Visual direction (dark canvas, signal-orange CTA, Audio Jones design language).
- ROI hero copy: "Find out if AI is actually worth it for your business." + "Estimate potential ROI, readiness, and payback period before you invest in automation."
- Primary CTA copy: **"Calculate Your AI ROI"**.
- 5-step information architecture (Business Profile / Workflow Bottleneck / Error & Friction Cost / AI Investment Estimate / AI Readiness Diagnostic).
- 3-card score output (ROI / Readiness / Priority) + recommendation card + result CTA to `https://diagnostic.audiojones.com`.
- The scoring math in `src/lib/ai-roi-diagnostic/scoring.ts` (functional reference).
- The recommendation copy in `src/lib/ai-roi-diagnostic/recommendations.ts` (functional reference).

**What PR #47 surfaced (avoid in v1):**

- **The shared `<Select>` / `<Button>` abstractions failed on real iPhone Safari** (state-propagation gap, event-bubbling gaps). The shared primitives are fine for marketing-page CTAs but unreliable for conversion-critical paths. **v1 must use native `<select>` and `<button type="button">` with direct `value` / `onChange` / `onClick` props inside the calculator's critical path.**
- **Playwright Chromium and Playwright WebKit emulation are insufficient mobile proof.** Both passed end-to-end while real iPhone Safari over the dev tunnel did not hydrate at all. **v1 must be tested in production mode locally (`pnpm build && pnpm start`) on a real iPhone before declaring shippable.**
- **The Next.js dev runtime + Cloudflare tunnel produced hydration false negatives** that masqueraded as code bugs. Production mode bypasses these. The real bug in PR #47 was likely never in the code — but the dev-runtime artifact made it look that way for many iterations.
- **`<form>` wrappers on multi-step UIs are a navigation hazard on mobile Safari.** A stray click can race past `e.preventDefault()`. **v1 should use `<div>` wrappers + explicit button `onClick` handlers** for the multi-step state machine.
- **Marketing intro gates ("Are you sure you want to start?") are friction.** When the user clicks the hero CTA, they want to start. **v1's hero CTA scrolls to the form and the form is the first thing they see — no intro card.**
- **PR #47 is purely a frontend prototype. No backend lead capture exists today.** Lead capture is mocked into `localStorage` only. **v1 must implement real backend persistence + Resend email delivery (agency notification + client result email).**

These lessons informed the spec below. **Read `docs/design/DESIGN.md` §17.5 ("Current Drift Risks") before starting.** It captures the most critical patterns to avoid.

---

## 2. Mission

Build the AudioJones.com ROI Calculator v1: a full-stack, mobile-first, lead-capture mini-app at `/roi-calculator`.

The calculator:

- Accepts user input across 5 steps.
- Computes ROI / readiness / automation-priority scores client-side.
- Surfaces a recommendation + score breakdown.
- Captures the lead via an email gate before showing detailed results.
- Persists the lead to a backend store (Neon Postgres).
- Sends an agency notification email (to the AudioJones team).
- Sends a client result email (with their personalized scores + next-step CTA).
- Handles failure modes gracefully (network down, email API down) without losing the lead.

---

## 3. Target branch + scope discipline

- **Branch name:** `feat/roi-calculator-v1-fullstack`
- **Branched from:** `main` (HEAD `c3b181f` at the time of writing — verify current `main` HEAD before starting).
- **Sibling work — do not start in this branch:** Workshops, Services deepening, AI Agents page, Blog/Insights system improvements, Google Business Profile work, Phase 3B (Vercel Preview Protection bypass / GitHub App reconnect), DESIGN.md changes (this branch will already include DESIGN.md from `feat/audiojones-design-md-system` once merged).

---

## 4. Product goals

1. **Reduce calculator drop-off compared to PR #47 prototype.** Drop the intro gate. Form starts immediately when the hero CTA is tapped.
2. **Capture every lead even when email delivery partially fails.** Lead persisted before email is attempted; email failure does not block the user.
3. **Mobile-first conversion.** 100% of interaction states tested on real iPhone Safari in production mode before merge.
4. **Editorial Intelligence Systems aesthetic** consistent with `docs/design/DESIGN.md`. Dark surfaces, signal-orange single CTA, restrained editorial type.
5. **Agency-grade email delivery.** Result email feels authored, not generated. Agency notification surfaces score + lead context immediately.

---

## 5. UX requirements

### 5.1 Page route

- **Route:** `/roi-calculator`
- **Renders as:** static (`○`) — most of the page is server-rendered marketing copy + structured data; the calculator itself is a client component.
- **Above the fold:** hero h1, subcopy, primary CTA "Calculate Your AI ROI" → fragment-anchor to `#diagnostic` section. No intro card. The first thing users see when they scroll/jump to `#diagnostic` is **Step 1 of the calculator form**.

### 5.2 Hero (server-rendered)

- Eyebrow: "AI ROI Calculator" (gold, `<Eyebrow tone="gold">`).
- h1: "Find out if AI is actually worth it for your business."
- Subcopy: "Estimate potential ROI, readiness, and payback period before you invest in automation."
- Primary CTA: `<button type="button">Calculate Your AI ROI</button>` styled as `.btn-glow` (signal orange glow). Anchor-jump to `#diagnostic`.
- Secondary CTA: `<a href="https://diagnostic.audiojones.com" target="_blank" rel="noopener noreferrer">Take Signal Diagnostic</a>` styled as ghost/secondary.
- Trailing paragraph (small, fg-3): "Most AI projects fail because the workflow, data, SOPs, or measurement system were not ready. This diagnostic separates real AI opportunity from expensive automation theater."

### 5.3 Value strip (server-rendered)

3-card horizontal grid (`grid-cols-1 sm:grid-cols-3 gap-5`):

1. "Signal vs. Noise" — "AI accelerates whatever system already exists. We diagnose the system before recommending automation."
2. "ROI Before Hype" — "We calculate labor savings, error reduction, payback period, and risk-adjusted impact — not vibes."
3. "Applied Intelligence" — "Score your workflow on ROI, readiness, and priority. Get one of six clear recommended next steps."

### 5.4 Calculator (client component, anchor `#diagnostic`)

- 5 steps: Business Profile → Workflow Bottleneck → Error & Friction Cost → AI Investment Estimate → AI Readiness Diagnostic.
- Wrap in `<div>` (NOT `<form>`).
- Sticky-header-aware fragment anchor: `scroll-mt-24` on the `#diagnostic` section so anchor scroll lands cleanly below the 80px sticky header.
- Progress indicator: "Step N of 5" + percentage + horizontal progress bar.
- Step labels visible on desktop (≥640px): "1. Business › 2. Workflow › 3. Friction › 4. Investment › 5. Readiness". Hidden on mobile.
- Each step renders the relevant inputs. Required-field validation on Next click.
- Back / Next buttons at the bottom. Both `<button type="button">`. Next becomes "See My Diagnostic" on Step 5.

### 5.5 Inputs (per step) — match PR #47 reference

Reuse the schema from `src/lib/ai-roi-diagnostic/types.ts` and `src/lib/ai-roi-diagnostic/constants.ts` (option lists, field limits). Re-import those files unchanged into the v1 implementation if useful.

**Step 0 — Business Profile**
- Industry (required) — native `<select>`, options from `INDUSTRY_OPTIONS`.
- Company size (required) — `COMPANY_SIZE_OPTIONS`.
- Monthly revenue range (required) — `REVENUE_OPTIONS`.
- Gross margin range (optional) — `MARGIN_OPTIONS`.
- Business model (optional) — `BUSINESS_MODEL_OPTIONS`.

**Step 1 — Workflow Bottleneck**
- Workflow type (required) — `WORKFLOW_OPTIONS`.
- Task frequency (required) — `FREQUENCY_OPTIONS`.
- Time per task minutes (required, number) — `FIELD_LIMITS.timePerTaskMinutes`.
- People involved (required, number) — `FIELD_LIMITS.peopleInvolved`.
- Hourly labor cost USD (required, number) — `FIELD_LIMITS.hourlyLaborCost`.
- Manual handoffs (optional, number) — `FIELD_LIMITS.manualHandoffs`.

**Step 2 — Error & Friction Cost** (no required fields)
- Error rate %, rework time hours, customer wait time hours, tool count, approval bottleneck checkbox.

**Step 3 — AI Investment Estimate** (no required fields)
- Implementation budget range (`IMPLEMENTATION_BUDGET_OPTIONS`), monthly software budget, internal training hours, human QA hours per week, adoption timeline months.

**Step 4 — AI Readiness Diagnostic**
- 8 selects using `MATURITY_OPTIONS` ("Strong" / "Partial" / "Weak"): SOP maturity (required), data quality (required), process clarity (required), KPI tracking, leadership buy-in, team adoption risk, existing automation, security constraints.

### 5.6 Email gate

Between Step 5 submit and full results display:

- Modal or inline panel.
- Headline: "Your AI ROI diagnostic is ready."
- Sub: "Enter your email to view your full report and get the breakdown emailed to you."
- Single email input + "Show My Results" button.
- Validate email shape client-side. POST to `/api/roi-calculator/lead` with full input + computed scores.
- On success: dismiss gate, render full results + start the result email send in the background (server-side).
- On failure (network / API): show full results anyway (don't punish user for our outage), but log to observability + retry email send asynchronously.

### 5.7 Results

3-card score grid (ROI Score / AI Readiness Score / Automation Priority — same structure as PR #47):

- Each card: tone (signal / system / metric), score number, 1-line description.
- Below the grid: recommendation card with the chosen state ("Automate Now" / "Pilot First" / "Take the Signal Diagnostic" / etc.) + description + primary CTA (`https://diagnostic.audiojones.com`).
- Two-column dl below recommendation: estimated annual impact (Conservative / Expected / Aggressive), payback period months.
- "Restart" link at the bottom. (Doesn't lose lead in DB — it's just a UI re-init.)

### 5.8 Mobile requirements

- 100% of viewport widths from 360px to 1280px must work without horizontal overflow.
- iOS 44pt touch target minimum on every control.
- Native `<select>` opens iOS native picker. Don't override.
- Native `<input type="number" inputMode="numeric">` for number inputs (or `inputMode="decimal"` for decimal-bearing fields).
- Sticky-header-aware fragment anchor (`scroll-mt-24`).
- Email gate must be full-width on mobile, no awkward modals.

---

## 6. Native-control requirement (non-negotiable for v1)

For every control inside the `#diagnostic` calculator section AND the email gate:

- **Selects:** native `<select>` + `<option>` children. NOT the shared `<Select>` from `src/components/ui/Select.tsx`.
- **Buttons:** native `<button type="button">`. Use the existing `.btn-glow` CSS class for the primary glow style (defined in `src/app/globals.css`). NOT the shared `<Button>` from `src/components/ui/Button.tsx`.
- **Number / text inputs:** the shared `<Input>` is fine to reuse OR inline native `<input>` with the same Tailwind classes — your call. (The PR #47 issue was specifically with `<Select>` and `<Button>`, not `<Input>`.)
- **Form labels / errors:** the shared `<FormField>` is fine.
- **Checkboxes:** the shared `<Checkbox>` is fine.

Hero CTA + value strip + page chrome (header, footer) continue to use shared primitives — those are not lead-capture critical paths.

---

## 7. Scoring / calculation

Reuse `src/lib/ai-roi-diagnostic/scoring.ts` and `src/lib/ai-roi-diagnostic/recommendations.ts` from the prototype. They produce:

- `roiScore` (0–100)
- `readinessScore` (0–100)
- `priorityScore` (0–100)
- `recommendation` (one of 6 states)
- `conservativeAnnualImpact` / `expectedAnnualImpact` / `aggressiveAnnualImpact` (USD)
- `paybackMonths`
- Bottleneck analysis with confidence rating

These are pure functions. Compute client-side at "See My Diagnostic" click time. POST the input + computed result to the API at email-gate submit time so the backend stores both raw input and the derived scores.

---

## 8. Backend API route

### 8.1 Endpoint

`POST /api/roi-calculator/lead`

### 8.2 Request body

```typescript
{
  email: string;            // validated client + server (Zod)
  input: DiagnosticInput;   // full input as defined in lib/ai-roi-diagnostic/types.ts
  result: DiagnosticResult; // computed scores + recommendation
  source?: string;          // e.g. "homepage-hero", "ai-roi-cta", default "roi-calculator-page"
  utm?: {                   // optional, populated client-side from URL params on mount
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  };
  hp?: string;              // honeypot — must be empty
}
```

### 8.3 Response (success)

```typescript
{
  ok: true;
  leadId: string;           // server-generated UUID
}
```

### 8.4 Response (validation error)

```typescript
{
  ok: false;
  error: "VALIDATION_ERROR" | "RATE_LIMITED" | "PROVIDER_ERROR";
  message: string;
}
```

### 8.5 Server-side flow

1. **Validate** request body with Zod (`roiLeadSchema`).
2. **Honeypot check** — if `hp` is non-empty, return 200 with `ok: true` but do nothing (silently drop bot).
3. **Rate-limit** by IP-hash + email (10/hour). Use the existing pattern from `src/lib/apply/` if present, otherwise a simple in-memory + persist-on-success pattern.
4. **Persist lead** to Neon (table `roi_calculator_leads` — schema below). Generate `leadId` server-side.
5. **Send agency notification email** via Resend (synchronous, awaited but errors don't block client response).
6. **Send client result email** via Resend (async, fire-and-forget — log failures but don't block).
7. **Return** `{ ok: true, leadId }`.

If step 5 or 6 fails, the lead is still persisted (step 4 already succeeded). Both email failures should log to observability with the leadId so the team can manually reach out.

---

## 9. Storage adapter (Neon)

### 9.1 Schema

```sql
CREATE TABLE roi_calculator_leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         CITEXT NOT NULL,
  email_hash    TEXT NOT NULL,           -- SHA-256(email + IP_HASH_SALT) for dedupe
  ip_hash       TEXT,                     -- SHA-256(ip + IP_HASH_SALT) for rate limit
  user_agent    TEXT,
  source        TEXT,
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  utm_term      TEXT,
  utm_content   TEXT,
  input         JSONB NOT NULL,           -- full DiagnosticInput
  result        JSONB NOT NULL,           -- full DiagnosticResult
  agency_email_status TEXT DEFAULT 'pending',  -- 'sent' | 'failed' | 'pending'
  client_email_status TEXT DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX roi_calculator_leads_email_idx ON roi_calculator_leads (email_hash);
CREATE INDEX roi_calculator_leads_created_at_idx ON roi_calculator_leads (created_at DESC);
```

### 9.2 Adapter pattern

Match the pattern used in `src/lib/newsletter/newsletter-storage.ts` (existing — has mock + production wrappers). If no DB connection is configured (dev), fall back to a mock adapter that logs but doesn't persist. Production must persist to Neon.

Adapter file: `src/lib/roi-calculator/roi-calculator-storage.ts`. Schema: `src/lib/roi-calculator/roi-calculator-schema.ts` (Zod).

---

## 10. Resend email delivery

### 10.1 Agency notification email

- **From:** `FROM_EMAIL` (e.g. `notifications@audiojones.com`)
- **To:** `LEAD_NOTIFICATION_EMAIL` (e.g. `team@audiojones.com`)
- **Subject:** `[ROI Calc] {industry} / {companySize} — {recommendation}`
- **Body:** plain HTML with score grid, recommendation, full input dump, lead email + utm/source.
- **Send order:** awaited synchronously after lead persist, but errors don't block client.

### 10.2 Client result email

- **From:** `FROM_EMAIL`
- **To:** lead's email
- **Subject:** `Your AI ROI Diagnostic — {recommendation}`
- **Body:** authored editorial copy. Score grid. Recommendation card. Estimated annual impact. Payback period. CTA to `https://diagnostic.audiojones.com` for the next step.
- **Tone:** match the on-site editorial voice — no SaaS-y "We're so excited!" copy. Authored by Audio Jones, signed accordingly.
- **Send order:** fire-and-forget after agency notification. Status tracked in DB row (`client_email_status`).

### 10.3 Email implementation file

`src/lib/roi-calculator/roi-calculator-email.ts`. Match the pattern from any existing Resend integration in the repo (search for `RESEND_API_KEY`).

---

## 11. Environment variables

### 11.1 Required for v1

| Var | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Site base URL for canonical/OG | `https://audiojones.com` |
| `DATABASE_URL` | Neon postgres connection string | `postgresql://user:pass@neon-host/db` |
| `RESEND_API_KEY` | Resend API key | `re_xxxxx` |
| `FROM_EMAIL` | Sender address | `notifications@audiojones.com` |
| `LEAD_NOTIFICATION_EMAIL` | Agency inbox for notifications | `team@audiojones.com` |
| `IP_HASH_SALT` | HMAC salt for IP/email hashing (any random string ≥16 chars) | (32+ char random) |

### 11.2 Validation

Add to `packages/config/env.schema.ts` if any are missing. Server-side env validation runs in `prestart` hook (see `package.json`).

### 11.3 No new secrets created by Codex

Codex must NOT create or rotate secrets. Document the requirements; the user will set GitHub Actions / Vercel env vars manually.

---

## 12. Validation requirements (build / lint / type)

- `pnpm typecheck` — 0 errors.
- `pnpm exec eslint src` — 0 errors. Zero new warnings introduced.
- `pnpm build` — clean compile. `/roi-calculator` registers as static (`○`).
- All Zod schemas have explicit error messages.

---

## 13. Real-device QA requirements

**Required** before requesting review:

1. **`pnpm build && NEXT_PUBLIC_SITE_URL=… DATABASE_URL=… [other stub vars] pnpm start`** — production mode locally.
2. **Cloudflare tunnel** (or similar) exposing the local prod server to a public HTTPS URL.
3. **Real iPhone Safari test** through the tunnel:
   - Open `/roi-calculator` on iPhone Safari (5G or same Wi-Fi as desktop).
   - Tap hero CTA "Calculate Your AI ROI".
   - Complete Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Email gate → Results.
   - Verify all 5 score numbers render.
   - Verify recommendation CTA links to `https://diagnostic.audiojones.com`.
   - Verify "Restart" returns to Step 1.
4. **Real Android Chrome test** — same flow.
5. **Receipt verification:**
   - Agency notification email arrives at `LEAD_NOTIFICATION_EMAIL` within 60 seconds.
   - Client result email arrives at the test email within 2 minutes.
   - Lead row appears in Neon within 5 seconds of email-gate submit.

**If any of those steps fail, the v1 is not ready.** Don't ship on Playwright-only proof.

---

## 14. Lessons learned from PR #47 (preserve in v1)

These are non-negotiable for v1:

1. **Native HTML controls in the critical path.** Selects + buttons inside `#diagnostic` and the email gate.
2. **No `<form>` wrapper.** Use `<div>` + button onClick.
3. **No intro gate.** The hero CTA scrolls directly to Step 1.
4. **`scroll-mt-24` on the anchor target.** The 80px sticky header obscures fragment-scroll otherwise.
5. **Production-mode local testing on real iPhone.** Required before merge.
6. **Don't trust Playwright Chromium / WebKit emulation as mobile-Safari proof.** Use them as smoke tests, not approval gates.
7. **Lead persisted before email is attempted.** Email is fire-and-forget; lead is durable.
8. **Recommendation CTAs go to `https://diagnostic.audiojones.com`** — the standalone Diagnostic OS, not an internal page.
9. **The 5-step flow is the right shape.** Don't reduce or expand.
10. **Hero copy is canonical.** Don't rewrite.

---

## 15. Acceptance criteria

This v1 PR is ready for review when:

### Functional

- [ ] `/roi-calculator` route renders correctly on desktop (Chrome / Safari) and mobile (real iPhone Safari, real Android Chrome).
- [ ] Hero CTA "Calculate Your AI ROI" scrolls to `#diagnostic` and Step 1 is the first thing visible.
- [ ] All 5 steps advance reliably on real iPhone Safari (production mode tunnel test passed).
- [ ] Required-field validation surfaces visible errors before allowing Next.
- [ ] Email gate captures email and submits to `/api/roi-calculator/lead`.
- [ ] Results page renders with 3 score cards + recommendation card + impact dl.
- [ ] Recommendation CTA opens `https://diagnostic.audiojones.com` in new tab.
- [ ] "Restart" returns to Step 1 with empty inputs.

### Backend

- [ ] `POST /api/roi-calculator/lead` validates via Zod and returns proper status codes.
- [ ] Honeypot field silently drops bot submissions.
- [ ] Rate limit enforced (10/hour per IP + email).
- [ ] Lead persists to Neon `roi_calculator_leads` table.
- [ ] Agency notification email arrives at `LEAD_NOTIFICATION_EMAIL` (verified in real test).
- [ ] Client result email arrives at lead address (verified in real test).
- [ ] Email send failure does NOT block lead persistence.

### Code quality

- [ ] Native `<select>` and `<button type="button">` in calculator critical path. Shared `<Select>` / `<Button>` are NOT used inside `#diagnostic`.
- [ ] No `<form>` wrapper inside the calculator.
- [ ] All design tokens reference CSS variables — no raw hex.
- [ ] All env vars validated via `packages/config/env.schema.ts`.
- [ ] Zod schemas for request body + DB row.
- [ ] All adapters follow mock + production pattern (graceful fallback in dev).

### Validation gates

- [ ] `pnpm typecheck` passes.
- [ ] `pnpm exec eslint src` passes (0 errors, no new warnings).
- [ ] `pnpm build` passes; `/roi-calculator` registers as static.
- [ ] **Production-mode local + real iPhone Safari test screenshots attached to the PR.**
- [ ] **Real device end-to-end test (Step 1 → Results) verified.**

### Drift discipline

- [ ] `skills/design-drift-audit.skill.md` audit produces READY or READY-WITH-NITS verdict.
- [ ] No nav structure changes bundled.
- [ ] No DESIGN.md changes bundled.
- [ ] No other lanes (Workshops / Services / etc.) touched.

---

## 16. Out of scope for v1

These are explicitly NOT in scope. Open separate issues:

- A/B testing different hero copy variants
- Multi-language support
- Calculator analytics dashboard for the agency
- Integration with HubSpot / Salesforce / other CRMs
- Webhook delivery to n8n / Zapier
- PDF export of the result email
- A "share my result" social card
- Workshops-related content
- Services page deepening
- Phase 3B (Vercel Preview Protection / GitHub App)
- Any deployment-workflow changes

---

## 17. Reference files (PR #47 prototype)

For copy / scoring / recommendation reference (not architectural reference):

- `src/lib/ai-roi-diagnostic/types.ts` — `DiagnosticInput`, `DiagnosticResult`, `RecommendationState` types.
- `src/lib/ai-roi-diagnostic/constants.ts` — option lists + field limits.
- `src/lib/ai-roi-diagnostic/scoring.ts` — pure scoring functions.
- `src/lib/ai-roi-diagnostic/recommendations.ts` — recommendation copy by state.

These can be re-imported into v1's `src/lib/roi-calculator/` as-is or copied/refined. The naming convention `roi-calculator` is preferred for v1 (matches the route).

PR #47 itself: `https://github.com/AudioJones-Dev/audiojones.com/pull/47` — open in draft as prototype reference. Do not merge it. Do not delete its branch.

---

## 18. Open questions for the user (surface before starting)

1. Should the agency notification email link to a Linear issue / Slack channel / admin portal page? Currently spec says plain email to `LEAD_NOTIFICATION_EMAIL`.
2. Confirm: the v1 client result email should NOT include the full diagnostic input, only the scores + recommendation? (Privacy default = yes, but worth confirming.)
3. Confirm: rate limit is 10/hour per IP-hash. Acceptable, or stricter?
4. Confirm: nav update (add "ROI Calculator" item to Header.tsx NAV) is in scope of v1, or a separate small PR?
5. Confirm: `MAILERLITE_GROUP_ID` and other newsletter env vars are NOT needed for v1.
