---
title: Founder Revenue Leak Diagnostic Route Build Spec
status: proposed
program_id: ADFIP
owner: AJ Digital LLC
date: 2026-06-30
related:
  - docs/specs/ai-discoverability-founder-intelligence-platform.md
  - docs/strategy/AUDIOJONES_SEO_AEO_ENTITY_IMPLEMENTATION_PLAN.md
  - docs/strategy/PHASE_3C_FOUNDER_GRAVITY_SHARED_ENGINE_PARITY_REPORT.md
  - docs/sop/offer-ecosystem/Tier 1 - Free Lead Gen.md
  - docs/sop/offer-ecosystem/Tier 2 - Paid Diagnostics.md
---

# Founder Revenue Leak Diagnostic Route Build Spec

## 1. Goal

Build `/diagnostics/founder-revenue-leak-diagnostic` as the canonical public
landing page for the Founder Revenue Leak Diagnostic.

The route should strengthen ADFIP's Diagnostic Acquisition Layer and AI
Discoverability Layer without creating a fourth disconnected diagnostic engine.

## 2. Current State

### Facts

- `src/app/diagnostics/` does not exist on `origin/main`.
- `/ai-readiness-diagnostic` is the current public diagnostic CTA page.
- `/founder-intelligence/diagnostic` is the working six-step intake form.
- `/roi-calculator` is the current revenue-leak-adjacent free calculator.
- `/insights/revenue-leak-diagnostic` defines "Revenue Leak Diagnostic" as an
  insight article, not an acquisition page.
- `/pricing` already lists "Revenue Leak Diagnostic" at `$1,997`, but its CTA
  currently routes to `/book-a-call`.
- The Phase 3C diagnostic parity report says the repo has parallel diagnostic
  systems today, not a shared engine.
- The SEO/AEO entity plan recommends
  `/diagnostics/founder-revenue-leak-diagnostic` with `DefinedTerm`,
  `FAQPage`, and `Service` schema.

### Inferences

- The first route PR should build an acquisition/entity page and route users
  into existing working flows. It should not attempt to build the shared
  diagnostic runtime.
- The best transitional primary CTA is the free revenue-leak sizing path,
  currently `/roi-calculator`, because the program sequence is:

```txt
Free Score
  -> Paid Diagnostic
  -> ResponseOS
  -> Founder Intelligence System
```

- The paid diagnostic CTA should remain available, but it should not be the
  only above-the-fold action.

### Assumptions

- "Founder Revenue Leak Diagnostic" is the public entity name for this route.
- "Revenue Leak Diagnostic" remains acceptable as a shorter paid-offer label
  within pricing copy after first mention.
- The first implementation uses existing route targets:
  `/roi-calculator`, `/pricing`, `/book-a-call`, `/agents/responseos`, and
  `/founder-intelligence`.
- A later PR can flip global header CTAs after this route is live and validated.

## 3. Problem

The site currently discusses revenue leaks across pricing, insights, ROI,
ResponseOS, and diagnostics, but there is no canonical acquisition page that
defines the Founder Revenue Leak Diagnostic, explains the paid diagnostic,
answers buyer questions, references price, and gives search engines and AI
assistants structured entity data.

The result is a weak conversion path:

- Pricing points the paid diagnostic directly to booking.
- The insight article explains the concept but is not built as a commercial
  landing page.
- The ROI calculator sizes the leak but is not framed as the first step in a
  diagnostic ladder.

## 4. Desired Outcome

Create one crawlable, schema-rich landing page that:

- Defines the Founder Revenue Leak Diagnostic.
- Explains who it is for.
- Shows what it measures.
- Routes visitors into the free revenue-leak score path first.
- Makes the `$1,997` paid diagnostic visible without making the page feel like
  a booking form.
- Connects the diagnostic to ResponseOS and Founder Intelligence Systems for
  founder-led service businesses.
- Gives AI/search systems clean metadata, breadcrumbs, FAQ, `DefinedTerm`, and
  `Service` signals.

## 5. Scope

### In Scope For The Route PR

- Add `src/app/diagnostics/founder-revenue-leak-diagnostic/page.tsx`.
- Add page metadata with `buildMetadata`.
- Add visible breadcrumbs using the existing `Breadcrumbs` component.
- Add JSON-LD for:
  - `BreadcrumbList`.
  - `FAQPage`.
  - `DefinedTerm`.
  - `Service`.
- Add a focused FAQ block.
- Add a pricing reference to the existing `$1,997` paid diagnostic.
- Add one primary CTA to the free score path and one secondary CTA to the paid
  diagnostic/booking path.
- Add internal links to `/pricing`, `/roi-calculator`,
  `/agents/responseos`, `/founder-intelligence`, and
  `/insights/revenue-leak-diagnostic` where contextually useful.
- Add the route to `src/app/sitemap.ts`.
- Add the route to `publicRoutes` in `src/lib/site.ts` if that list remains a
  public route registry.
- Update `/pricing` so the Revenue Leak Diagnostic card points first to
  `/diagnostics/founder-revenue-leak-diagnostic`, not directly to booking.
- Update `/resources` or the Revenue Intelligence theme only if the change is
  narrow and clearly improves the route graph.

### Out Of Scope For The Route PR

- Building a new diagnostic engine.
- Changing `/founder-intelligence/diagnostic` form behavior.
- Changing lead persistence, scoring, CRM, email, or n8n logic.
- Renaming `/ai-readiness-diagnostic`.
- Flipping the global header CTA.
- Retiring `/insights/revenue-leak-diagnostic`.
- Creating a `/diagnostics` index page.
- Adding Firecrawl, Search Console, CRM, or email integrations.
- Touching `package.json` or `pnpm-lock.yaml`.
- Deploying to production.

## 6. Recommended Page Structure

### 6.1 Metadata

Recommended metadata:

```ts
title: "Founder Revenue Leak Diagnostic"
description: "Find where founder-led service businesses lose revenue through missed calls, slow follow-up, weak qualification, broken attribution, and reporting gaps."
path: "/diagnostics/founder-revenue-leak-diagnostic"
```

### 6.2 JSON-LD

Required JSON-LD blocks:

- `breadcrumbJsonLd`.
- `definedTermJsonLd`.
- `faqJsonLd`.
- New or inline `Service` schema for the diagnostic offer.

Preferred implementation:

- Add a reusable `serviceJsonLd` helper in `src/lib/seo/schema.ts` if it can be
  done narrowly.
- If adding a helper causes scope creep, inline the service object in the page
  and leave helper extraction for the later schema migration PR.

Service schema should include:

- `@type: "Service"`.
- `name: "Founder Revenue Leak Diagnostic"`.
- `provider` as Audio Jones / AJ Digital LLC.
- `areaServed` as United States or online/remote service.
- `description` aligned with the visible page definition.
- `offers.price: "1997"` and `priceCurrency: "USD"` if the price remains
  confirmed.
- `url` set to the canonical route.

### 6.3 Visible Sections

1. **Hero**
   - H1: "Founder Revenue Leak Diagnostic"
   - Direct-answer subcopy: define the diagnostic in one or two sentences.
   - Primary CTA: "Calculate your leak" -> `ctaLinks.roiCalculator`.
   - Secondary CTA: "Book the paid diagnostic" -> `ctaLinks.bookSession`.
   - Stats or proof strip:
     - "Free score first"
     - "$1,997 paid diagnostic"
     - "ResponseOS-ready prescription"

2. **What It Finds**
   - Missed calls.
   - Slow follow-up.
   - Weak qualification.
   - Broken attribution.
   - Reporting gaps.

3. **How The Diagnostic Ladder Works**
   - Free Score.
   - Paid Diagnostic.
   - ResponseOS.
   - Founder Intelligence System.

4. **Pricing Reference**
   - State the paid diagnostic price as `$1,997`.
   - Link to `/pricing`.
   - Clarify that the price is for analysis and a decision-ready report, not
     generic consulting time.

5. **What You Get**
   - Leak map.
   - Revenue-recovery priority.
   - Recommended next system.
   - Decision-ready action plan.

6. **Who It Is For**
   - Founder-led service businesses.
   - Existing lead flow but weak follow-up or unclear attribution.
   - Operators considering ResponseOS or a broader Founder Intelligence System.

7. **FAQ**
   - Use the FAQ component.
   - Keep answers direct and retrieval-friendly.

8. **Final CTA**
   - Primary CTA remains the free score path.
   - Secondary CTA remains paid diagnostic booking or pricing.

## 7. FAQ Draft

Use this as starter copy. Final implementation can tune wording, but should
preserve the retrieval intent.

| Question | Answer |
| --- | --- |
| What is the Founder Revenue Leak Diagnostic? | The Founder Revenue Leak Diagnostic is a structured assessment that shows where a founder-led service business is losing revenue through missed calls, slow follow-up, weak qualification, broken attribution, and reporting gaps. |
| Is this the same as the ROI calculator? | No. The ROI calculator is the free score path. The paid diagnostic is the deeper analysis that turns the score into a decision-ready action plan. |
| How much does the Revenue Leak Diagnostic cost? | The paid Revenue Leak Diagnostic is currently listed at $1,997. The free score path should be used first when you are still sizing the leak. |
| What happens after the diagnostic? | The output should identify the highest-leverage leak and route the business toward the right next step: ResponseOS, a workshop, or a broader Founder Intelligence System. |
| Who is it for? | It is for founder-led service businesses with inbound demand, missed follow-up, unclear attribution, or a sense that revenue is leaking after leads arrive. |
| Do I need to book a call first? | No. Start with the free score path. Book the paid diagnostic when you want the deeper analysis and prescription. |

## 8. Route Graph

### Inbound links to add or verify

- `/pricing` Revenue Leak Diagnostic card -> new route.
- `/insights/revenue-leak-diagnostic` business implication section -> new
  route.
- `/resources` Revenue Intelligence theme -> new route or keep `/roi-calculator`
  if the theme is explicitly about the calculator.
- `/agents/responseos` FAQ or CTA context -> new route only if the copy can
  stay narrow.

### Outbound links from the new route

- `/roi-calculator` as the free score path.
- `/pricing` as pricing detail.
- `/book-a-call` as paid diagnostic booking path.
- `/agents/responseos` as the likely revenue-recovery system.
- `/founder-intelligence` for broader system context.
- `/insights/revenue-leak-diagnostic` for the definition/article version.

## 9. Files Likely Touched

Implementation PR should be limited to:

- `src/app/diagnostics/founder-revenue-leak-diagnostic/page.tsx`
- `src/app/sitemap.ts`
- `src/lib/site.ts`
- `src/lib/seo/schema.ts` only if adding `serviceJsonLd`
- `src/app/pricing/page.tsx`
- `src/app/insights/revenue-leak-diagnostic/page.tsx`
- `src/app/resources/page.tsx` only if needed for route graph clarity

If additional files are needed, explain why in the PR body.

## 10. Implementation Constraints

- Use existing components before creating new components.
- Keep the page static and server-rendered.
- Use `buildMetadata` for metadata.
- Use `JsonLd` for structured data.
- Use the existing `Breadcrumbs`, `FAQ`, `SignalHero`, `DarkSection`,
  `LightProofSection`, `SectionIntro`, and `FinalCta` patterns where they fit.
- Use `ctaLinks` for CTA destinations instead of hardcoded diagnostic, ROI, or
  booking paths.
- Do not add dependencies.
- Do not change existing form submission behavior.
- Do not change route names without a redirect plan.
- Do not add Firebase references except existing exclusion/guardrail language.

## 11. Acceptance Criteria

- `/diagnostics/founder-revenue-leak-diagnostic` renders successfully.
- Page metadata has a canonical URL for the new route.
- Page includes visible breadcrumbs and JSON-LD breadcrumbs.
- Page includes `FAQPage` JSON-LD.
- Page includes `DefinedTerm` JSON-LD for "Founder Revenue Leak Diagnostic".
- Page includes `Service` JSON-LD for the paid diagnostic.
- Page references `$1,997` consistently with `/pricing`.
- Primary CTA points to the free score path.
- Secondary CTA points to paid diagnostic booking or pricing.
- `/pricing` links the Revenue Leak Diagnostic card to the new route.
- Sitemap includes the new route.
- No existing diagnostic route is removed.
- No lead API or persistence behavior changes.
- No Firebase guardrail regression.

## 12. Validation

For the implementation PR, run:

```bash
pnpm typecheck
pnpm lint
pnpm check:no-firebase
pnpm build
```

Manual checks:

- Visit `/diagnostics/founder-revenue-leak-diagnostic`.
- Verify hero and final CTAs resolve.
- Verify `/pricing` Revenue Leak Diagnostic card resolves to the new route.
- Inspect page source or rendered DOM for JSON-LD blocks.
- Confirm sitemap output includes the new route.

## 13. Open Questions Before Implementation

1. Should the paid CTA label be "Book the paid diagnostic" or "Book the
   Revenue Leak Diagnostic"?
2. Should `/roi-calculator` be renamed in visible copy as the "free revenue
   leak score" without changing its route?
3. Should the global header diagnostic CTA remain "AI Readiness Diagnostic" for
   now, or should a later PR flip it to the new Founder Revenue Leak Diagnostic
   route?
4. Should the page mention "Founder Revenue System" yet, or only ResponseOS
   and Founder Intelligence Systems for founder-led service businesses?
5. Is `$1,997` locked as the public price for this diagnostic?

## 14. Recommended Next Codex Task

```txt
Review/Diagnosis owner: Codex
Actionable AI Assistant Task owner: Codex
Execution location/tool: C:\dev\audiojones-adfip or a new feat worktree from docs/adfip-program
Human/operator role: Confirm price and CTA wording if different from this spec
Copy/paste destination: Codex

Task:
Implement /diagnostics/founder-revenue-leak-diagnostic from
docs/specs/founder-revenue-leak-diagnostic-route.md. Keep the change scoped to
the route, sitemap/public route registry, schema helper only if needed, and
narrow internal links. Do not alter diagnostic engine logic, lead APIs,
dependencies, or global header CTAs. Validate with pnpm typecheck, pnpm lint,
pnpm check:no-firebase, and pnpm build.
```
