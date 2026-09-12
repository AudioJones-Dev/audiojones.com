# Plain-language conversion release

Status: local implementation reviewed; Audio authorized commit/push and draft PR preparation with "Proceed you can push." Production merge and deployment remain pending.
Base: origin/main at 711d88176dff0fd9ec3632b553e220d06e021fc2.

## Problem and desired outcome

Copy and UI work is split across unmerged drafts. The live homepage leads with an
abstract signal metaphor. The local-service draft makes lost inquiries concrete
but narrows the business to lead follow-up. The positioning draft explains the
root cause (work depends on the founder and scattered knowledge) but asks readers
to understand too much jargon before acting.

Combine the concrete symptoms with the broader systems capability. Help founders
with existing demand identify the issue costing them the most time or sales, then
request a diagnostic review. Conversion lift is a hypothesis, not an observed result.

## Scope and plan

- Reuse the positioning draft's simpler portrait hero and restrained layout.
- Lead with time, sales, dropped follow-up, stuck work, and founder dependence.
- Explain the method and technical terms after the problem; retain qualified
  Founder Intelligence Systems naming and links to existing topic pages.
- Keep homepage metadata, visible FAQs and FAQ schema consistent.
- Align header, closing CTA, solutions summaries and diagnostic introduction.
- Preserve existing offer names, pricing, route URLs, structured entity IDs,
  form fields, submission behavior, and provider wiring.

Likely files: homepage page and landing components, Header, nav CTA labels,
solutions page, diagnostic introduction, this spec. No bulk import of old branches.
No dependency, deployment, credentials, API or database changes.

## Success criteria and validation

- One visible H1. One main diagnostic action per section; booking is secondary.
- Core problem/benefit paragraphs aim for fifth-grade readability. Short sentences,
  familiar verbs, concrete examples; specialist names receive plain definitions.
- No guaranteed revenue gains, fabricated client results, instant-result promises,
  new prices, or assertions that an automated intake is a completed paid diagnosis.
- Canonical homepage URL and Organization/Person/WebSite schema remain intact.
- FAQs use one source for rendered answers and JSON-LD.
- Typecheck, lint, no-Firebase guard and production build pass.
- Desktop/mobile review checks overflow, CTA contrast, anchors and destinations.

## Evidence, tradeoffs and risks

Source drafts: local-service-conversion-copy at 31bff43 and uncommitted
audiojones-positioning-v2, reviewed without modifying either. The July 28 messaging
spec identifies fragmented operations, lost revenue and founder dependency as the
buyer problem. Current main's August 12 decision puts pain before architecture.
The commercial register on current main remains pricing/offer authority.

Recommendation: retain the breadth of systems consulting while using lost time
and sales as the entry point. A narrower missed-lead headline could be stronger
for response-only traffic; this version serves the broader founder-led ICP.
There is no traffic, conversion or keyword-volume evidence in this review to
prove which headline wins. Measure qualified diagnostic completions after release.

SEO/AEO: use clear answers, descriptive headings, useful topic links and existing
entity/schema structure. Terminology alone cannot establish domain authority.
Google guidance checked 2026-09-11:
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## Open questions / release gates

Review the composed preview before publication. Commit/push, merge and production
deployment remain separate actions. Existing worktrees and their drafts stay intact.
No claim of conversion lift or search ranking improvement until measured.

## Completed review and local implementation

| Source | Kept | Changed or left out | Reason |
| --- | --- | --- | --- |
| Local-service copy, 31bff43 | Missed leads, unclear next steps, time and sales as the cost | Lead-only positioning and an AI-first entry label | The ICP also loses time through stuck jobs and founder dependence |
| Positioning-v2 working files | Simple portrait hero, shared knowledge, team handoffs, diagnosis before tools | Long architecture lists and abstract opening copy | Explain the problem before naming the technical solution |
| Current main | Routes, offers, pricing, entity schema, canonical URLs, existing intake | Homepage narrative and conversion labels | Avoid bringing old branch infrastructure or offer changes into this release |
| Shared-conversion WIP, b2d3213 | Javi CTA contrast, stacked footer and mobile launcher in document flow | Other inquiry/offer edits | Fix the observed unreadable CTA and copy obstruction without importing unrelated changes |

Implementation covers the homepage, Solutions summaries, AI-readiness landing,
diagnostic introduction, shared diagnostic FAQs, header CTAs and Javi CTA.
The shared FAQ wording also appears on its existing consumer pages.
Existing main's commercial names and prices remain unchanged.
All primary review CTAs point to the existing Founder Intelligence Diagnostic
form. Booking and learning links remain secondary paths.

Core copy: "Find what's costing you time and sales. Fix that first."
Technical terms are named with plain explanations: workflow automation,
business memory, marketing attribution, AI agent systems and CRM.
No measurable conversion advantage is claimed over either draft.

## Local validation evidence

- Clean frozen-lockfile install completed without lockfile changes.
- `pnpm validate`: passed all nine configured gates, including typecheck, lint,
  no-Firebase, existing offer/row/notification contracts and production build.
- Final edits: typecheck, targeted ESLint and a fresh production build passed.
- Full lint has 1,046 existing warnings and zero errors; changed-file lint is clean.
- Builds warn that local `NEXT_PUBLIC_SITE_URL` is absent; rendered canonicals
  use the existing `https://www.audiojones.com` fallback. Provider setup and
  live form delivery were not tested. No credentials were loaded for this work.
- Production-build browser QA: 1440, 1280, 1024, 768, 518, 390 and 320px homepage
  widths have no horizontal overflow. Solutions and both diagnostic pages also
  pass at 390px. Each checked page has one H1 and its expected canonical URL.
- All seven homepage FAQ answers match the FAQ JSON-LD after expansion.
- Header/menu and hero/process link checked; process anchor clears the header
  by about 96px. No page JavaScript errors were recorded.
- Homepage and Javi primary CTA text: rgb(8,8,8) on rgb(232,255,90).
  Javi's mobile panel fits the viewport and its launcher no longer covers copy.
- Readability spot check: homepage rendered text estimates grade 4.4 using
  Flesch-Kincaid with heuristic syllable counts. This is a rough editorial check,
  not a certified reading level. Commercial names and specialist labels on the
  Solutions page raise its whole-page score; their explanations use short sentences.
- `git diff --check` passes. Remote main remains at the recorded base SHA.

Local browser evidence is in `.codex/qa/` (ignored): report.json, responsive
screenshots, final-build.log, final-typecheck.log and final-javi-lint.log.
Local preview: http://localhost:3108. It requires the local server to remain running.

At the local-review checkpoint, no commit, push, PR, merge or deployment had been
performed. Audio subsequently authorized pushing this combined release candidate.
The original drafts remain intact. Production merge and deployment require
separate approval after PR checks and preview review.
