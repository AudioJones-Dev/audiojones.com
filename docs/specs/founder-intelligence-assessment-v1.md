---
title: Founder Intelligence Assessment v1
status: draft
program_id: ADFIP
epic: 1
task: 1.2
owner: AJ Digital LLC
last_updated: 2026-06-30
---

# Founder Intelligence Assessment v1

## Problem

The existing `/founder-intelligence/diagnostic` flow captures a qualified lead,
scores it server-side, persists it to Neon, and sends optional Resend/n8n
notifications. It does not yet expose the score back to the visitor or route
the visitor into a clear next diagnostic step.

ADFIP Task 1.2 needs the diagnostic to behave more like an assessment engine:
questions, scoring, results, CRM/email handoff, and a visible recommendation.

## Desired Outcome

Turn the existing Founder Intelligence diagnostic into a first-pass assessment
without disrupting the current lead-capture API.

The v1 assessment should:

- keep `/founder-intelligence/diagnostic` as the entry point;
- reuse the existing form and `/api/founder-intelligence/leads` route;
- preserve Neon persistence before optional automation;
- show a visitor-facing result after successful submission;
- recommend the next path from score and priority;
- keep CRM/email automation non-blocking after persistence.

## Success Criteria

- Submitting the existing diagnostic stores the returned `leadId`, scores, and
  priority in browser session storage.
- Successful submissions route to
  `/founder-intelligence/diagnostic/result`.
- The result page renders total score, four dimension scores, priority, and a
  recommended next step.
- The result page is `noindex` and does not depend on public URL parameters
  that expose personal information.
- The existing `/api/founder-intelligence/leads` API contract remains
  backwards-compatible.
- Resend and n8n failures remain non-blocking after persistence.
- `pnpm typecheck`, `pnpm lint`, `pnpm check:no-firebase`, and `pnpm build`
  pass.

## Scope

### In Scope

- Result-page route under `/founder-intelligence/diagnostic/result`.
- Session-backed result handoff from the existing diagnostic form.
- Score presentation using the existing `LeadScores` shape.
- Recommendation copy tied to lead priority.
- Documentation updates to ADFIP and the roadmap.

### Out of Scope

- A new CRM provider.
- A new database table.
- Public shareable result URLs.
- Emailing the full visitor-facing report to the lead.
- Replacing `/ai-readiness-diagnostic`.
- Renaming existing public routes.
- Building the full Task 1.3 routing tree.

## Constraints

- Do not reintroduce Firebase.
- Do not bypass the existing Neon-first durability rule.
- Do not make n8n or email required for a successful user response.
- Do not expose PII in query strings.
- Keep the result page out of the sitemap.
- Keep this as an additive v1 slice; do not refactor the Founder Gravity Audit.

## Existing Assets Inspected

- `src/app/founder-intelligence/diagnostic/page.tsx`
- `src/components/founder-intelligence/DiagnosticForm.tsx`
- `src/app/api/founder-intelligence/leads/route.ts`
- `src/lib/leads/lead-schema.ts`
- `src/lib/leads/lead-scoring.ts`
- `src/lib/leads/lead-notifications.ts`
- `src/components/founder-gravity-audit/FounderGravityAuditFlow.tsx`
- `src/components/founder-gravity-audit/FounderGravityReport.tsx`
- `src/lib/founder-gravity-audit/scoring.ts`

## Proposed Plan

1. Add a noindex result route:
   `/founder-intelligence/diagnostic/result`.
2. Add a client result component that reads a typed session-storage payload.
3. Update `DiagnosticForm` to store the API response and redirect to the result
   route after successful submission.
4. Keep the existing thank-you route as a fallback/manual confirmation surface.
5. Validate typecheck, lint, Firebase guard, build, and route smoke.

## Result Routing v1

| Priority | Visitor-facing recommendation |
| --- | --- |
| `urgent` | Book a diagnostic review |
| `high` | Book a diagnostic review |
| `medium` | Start the Founder Revenue Leak Diagnostic |
| `low` | Read the Founder Intelligence Systems framework |

This is intentionally simple. Task 1.3 can later move this into a formal
diagnostic-routing engine with Free Score -> Paid Diagnostic -> ResponseOS ->
Founder Intelligence System.

## Risks

- Session-backed results are browser-local. Reloading in a new browser will not
  show the report.
- CRM/email automation already exists but is not yet a full CRM-native workflow.
- A future shareable report will require a durable result retrieval route and
  access-control decision.

## Open Questions

1. Should the public name be "Founder Intelligence Assessment" or should the
   current "Founder Intelligence Diagnostic" naming remain canonical?
2. Should high-priority leads get a paid diagnostic checkout path before
   booking?
3. Which CRM is canonical if n8n is not the first integration layer?
4. Should v2 email the visitor a summary report, or only notify Audio Jones?
