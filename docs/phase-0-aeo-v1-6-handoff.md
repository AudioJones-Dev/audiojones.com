---
title: "Phase 0 Handoff — AEO v1.6"
status: "ready for Claude Code pickup"
strategy_version: "v1.5.1"
generated: "2026-05-12"
production_state: "homepage live at https://audiojones.com (post PR #69 merge `2d7d007`)"
preserved_recovery: "wip/full-snapshot-2026-05-12, archive/pr-58-codex-services-phase-1-2026-05-08, tag v-homepage-redesign-2026-05-12"
analysis_outputs: "outputs/phase_0_audiojones_implementation_plan.md, outputs/phase_0_summary.md (local-only — not part of this commit)"
---

> # Audio Jones Permanent Doctrine
>
> ## Complexity exists in the architecture.
> ## Not in the reading experience.

# Phase 0 Handoff — AEO v1.6

This document is the single-source pickup for Claude Code (or any subsequent agent) taking AEO v1.6 work into Git workflow. The local-session Phase 0 analysis is complete; this handoff codifies what was learned, the canonical decisions, the immediate next tasks, and the guardrails.

---

## §1. Strategy version

**v1.5.1** — canonical brand + framework decisions locked 2026-05-12.

(The full strategy doc is not currently in-repo. Phase 1.0 codifies it at `docs/strategy/audiojones-strategy-v1.5.1.md`. Until then, the canonical reference card in §2 is the authoritative substitute.)

---

## §2. Canonical brand decisions (verbatim — do not reinterpret)

- **Audio Jones** = authority brand
- **AJ Digital LLC** = operating / legal entity
- **Founder Intelligence Systems™** = public anchor
- **Applied Intelligence Systems** = internal methodology only
- **Signal Doctrine** = philosophical layer
- **M.A.P.** = Measurement + Attribution + Prediction
- **Permanent doctrine** (required at top of AGENTS.md, CLAUDE.md, framework pages, Rekonr positioning, internal philosophy): *"Complexity exists in the architecture. Not in the reading experience."*

### Vocabulary migration boundaries

- **Public-only sweep:** Applied Intelligence Systems / AIS → Founder Intelligence Systems™ / FIS™ (PUBLIC mentions only; internal AIS retained as methodology vocabulary)
- **Global sweep:** Signal Theory → Signal Doctrine (everywhere — code, docs, copy, schema)
- **Public + global sweep:** M.A.P. "Meaningful + Actionable + Profitable" → "Measurement + Attribution + Prediction"

### Framework hierarchy

Signal Doctrine → Predictive Reconstruction (PR) → Affective Systems Intelligence (ASI) → Founder Intelligence Systems™ (FIS / internal: AIS) → M.A.P. Attribution → Emotional Predictive Marketing (EPM) → Business Diagnostics.

### Layer split

- **Operational layer (founder-facing):** AI for Founder-Led Businesses, FIS™, MAP, Signal Audit, Founder Prediction Error, Signal vs Noise
- **Theoretical layer:** Signal Doctrine, PR, ASI, EPM, acronym ontology

### Primary persona

Founder Operator Under Cognitive Load (qualified on signal-maturity criteria, NOT hard ARR bands).

---

## §3. Sprint 1 build order

5 framework pages, in this order:

1. **Predictive Reconstruction** — theoretical anchor (0/4 LLMs recognize today — pure blue ocean)
2. **Founder Prediction Error Model** — operational anchor
3. **M.A.P. Attribution Framework** — operational acquisition (rewrites existing `/frameworks/map-attribution` for M.A.P. = Measurement + Attribution + Prediction)
4. **Signal Audit Framework** — operational + lead magnet (DISTINCT from `/applied-intelligence/diagnostic` Signal Audit instance)
5. **AI for Founder-Led Businesses** — operational bridge phrase

### §0.8 page structure (mandatory for every framework + acronym page)

H1 → Founder TL;DR (1-2 sentences plain English) → Why It Matters → Operational Interpretation → Technical Definition → Framework Relationships → Business Application → Related Terms → FAQ.

---

## §4. Phase 0 repo audit findings

### Repo at a glance

- **Stack:** Next.js 16.2.3 App Router · pnpm 10.30.3 (monorepo workspaces) · Tailwind v4 (`@theme inline`) · NeonDB · Resend · MailerLite · Vercel
- **Production:** `https://audiojones.com` — homepage live post PR #69 (7-section flow, Spline removed, new "audio jones signal logo white nav" variant)
- **Main HEAD:** `2d7d007` (PR #69 squash)
- **Firebase:** intentionally removed; guard script `scripts/check-no-firebase.ts` runs in CI

### Existing routes (relevant to v1.6)

- `/applied-intelligence/{page.tsx, diagnostic/}` — methodology page + diagnostic instance
- `/frameworks/{page.tsx, applied-intelligence-systems/, map-attribution/, niche-framework/, signal-vs-noise/}` — 4 existing framework sub-pages (likely do NOT follow §0.8)
- `/agents/{page.tsx, responseos/}`, `/services/`, `/roi-calculator/`, `/apply/`, `/blog/`, `/insights/`, `/case-studies/`, `/workshops/`
- ❌ **No `/glossary/` route** (acronym subsystem is greenfield)

### Existing systems (reusable)

- **Token system:** `src/app/globals.css` (CSS vars) + `src/lib/applied-intelligence/tokens.ts` (TS mirror)
- **Typography utilities:** `t-display-xl`/`t-display-lg`/`t-h1`/`t-h2`/`t-h3`/`t-h4`/`t-lead`/`t-body-lg`/`t-body`/`t-small`/`t-label`
- **UI primitives (marketing-safe):** `<Button>`/`<ButtonLink>` (variants `glow`, `system-glow`, `primary`, `secondary`, `ghost`), `<Eyebrow>` (gold/blue/muted), `<Input>`, `<Textarea>`, `<Checkbox>`, `<FormField>`, `<JsonLd>`
- **SEO infrastructure (`src/lib/seo/schema.ts` — 8 helpers already in place):** `organizationJsonLd`, `personJsonLd`, `webSiteJsonLd`, `breadcrumbJsonLd`, `faqJsonLd`, `articleJsonLd`, `definedTermJsonLd`, `speakableSpec`
- **Lead capture:** NeonDB + Resend (Applied Intelligence diagnostic + ROI Calculator) · MailerLite (newsletter) · `/apply` adapter pattern stubbed
- **Site config:** `src/config/links.ts` (ctaLinks), `src/config/nav.ts` (post-PR #62 7-item nav), `src/lib/site.ts` (siteConfig, publicRoutes, noindexRoutes, disallowedRoutes)

### Components to avoid

- `src/components/ui/Card.tsx` + `Badge.tsx` — admin-styled (raw Tailwind grays). DO NOT use on marketing surfaces. Build inline card patterns.
- Shared `<Select>` in lead-capture critical paths — known mobile-Safari hydration issue (PR #47 lesson). Use native `<select>` in conversion forms.

### Critical pre-built v1.6 building blocks

The schema layer for AEO v1.6 is **already implemented**:

- `definedTermJsonLd({...})` — every acronym page is a `DefinedTerm`
- `faqJsonLd([...])` — §0.8 step 9 schema attached
- `breadcrumbJsonLd([...])` — every new page gets its chain
- `speakableSpec(['h1', '.tldr-block'])` — AEO / voice-search optimization
- `articleJsonLd({...})` — richer parsing on framework pages
- `<JsonLd>` wrapper component — injects all of the above

---

## §5. Missing documentation checklist

Must be authored / reconciled in Phase 1.0:

- [ ] **`AGENTS.md` (root)** — MISSING. Doctrine line at top + agent operating non-negotiables.
- [ ] **`CLAUDE.md` (root)** — MISSING. Doctrine line at top + Claude operating principles + session memory pointers.
- [ ] **`docs/PRD.md`** — MISSING. Doctrine line at top + v1.6 PRD (persona, framework hierarchy, Sprint 1 order, acronym ontology, AEO targets, Speed-to-Lead Benchmark, MAP-aligned measurement).
- [ ] **`docs/ROADMAP.md`** — MISSING. Doctrine line at top + v1.6 → v1.7+ roadmap with milestone gates.
- [ ] **`docs/design/DESIGN.md`** (canonical, 29,840 b) — UPDATE: add doctrine line at top, encode FIS™ public brand, Signal Doctrine global rename, M.A.P. redefinition, AJ Digital LLC `legalName` schema reference.
- [ ] **`docs/strategy/audiojones-strategy-v1.5.1.md`** — MISSING. Codify the canonical reference card as in-repo single source of truth.

### DESIGN.md 4-way drift to reconcile

| File | Size | Disposition |
|---|---|---|
| `docs/design/DESIGN.md` | 29,840 b | **Canonical — keep, update** |
| `docs/DESIGN.md` | 8,479 b | Stale / earlier draft — delete or convert to pointer |
| `AUDIOJONES_DESIGN.md` (root, untracked) | 30,341 b | May 11 v2 WIP draft — merge OR park at `docs/design/DRAFT-v2.md` |
| `DESIGN.md` (root, untracked) | 19,944 b | Earlier stub variant of AUDIOJONES_DESIGN.md — likely delete after WIP review |

---

## §6. Recommended Phase 1 scope

**Phase 1.0 — Foundation docs** (docs-only single PR).

Single PR creates the 6 mandatory docs above (5 new + 1 canonical DESIGN.md update) and reconciles the 4-way DESIGN.md drift. Doctrine line at top of every authored file.

**Out of scope for Phase 1.0:** any code changes, copy sweeps, new pages, schema changes, framework page authoring.

**Why Phase 1.0 must ship first:** every subsequent v1.6 phase (1.1 vocabulary migration, 1.2 templates, 1.3 framework pages, 1.4 acronym pages, 1.5 internal linking, 1.6 schema rollout, 1.7 AEO/measurement, 1.8 distribution) depends on agent operating rules existing. Without AGENTS.md / CLAUDE.md, downstream tasks risk drift from doctrine, brand split, §0.8 structure, no-Firebase rule, iPhone QA gate.

**Pre-flight gate (strongly recommended):** complete `VERCEL_ENV_SETUP.md` security remediation (rotate Firebase service account, purge from git history) BEFORE Phase 1.0 ships. The file is git-tracked and contains a real Firebase service account private key.

---

## §7. Guardrails for Claude Code (verbatim — embed in agent context)

- Analyze before modifying
- No production / main direct edits
- Use a feature branch
- No secrets
- No Firebase
- No dependency changes unless explicitly approved
- No design-system replacement
- No mass refactor
- No framework swaps
- No formatting-only rewrites
- Surgical edits only
- Validate after each scoped task

### Additional context-derived guardrails

- **No public AIS:** "Applied Intelligence Systems" is INTERNAL methodology only. Public surfaces use "Founder Intelligence Systems™" / FIS™.
- **No "Signal Theory":** globally renamed to "Signal Doctrine" — code, docs, copy, schema.
- **No "Meaningful + Actionable + Profitable" for M.A.P.:** redefined as Measurement + Attribution + Prediction.
- **§0.8 nine-step structure mandatory** for every framework + acronym page.
- **iPhone Safari production-mode QA mandatory** before merge for any conversion-critical surface (per PR #47 lesson).
- **Native HTML controls** (`<select>`, `<button type="button">`) on lead-capture critical paths — not shared abstractions.
- **NeonDB-only persistence** · **Resend-only transactional email** · **MailerLite for newsletter**.
- **Audio Jones / AJ Digital LLC brand identity boundary:** Audio Jones is authority brand; AJ Digital LLC is operating entity and goes in `schema.org/Organization.legalName`.
- **Preserve recovery branches:** never delete `wip/full-snapshot-2026-05-12` or `archive/pr-58-codex-services-phase-1-2026-05-08`.

---

## §8. Exact next tasks for Claude Code

In order. Each task is its own PR.

### Task 1 — Phase 1.0 Foundation docs (single PR)

Branch: `docs/phase-1-0-foundation-docs`

Author (each with doctrine line at top):

1. `AGENTS.md` (root) — agent operating rules + non-negotiables from §7 of this handoff
2. `CLAUDE.md` (root) — Claude operating principles + memory pointers + reference to this handoff + strategy v1.5.1 link
3. `docs/PRD.md` — v1.6 PRD (persona, framework hierarchy, layer split, Sprint 1 order, acronym ontology, AEO targets, Speed-to-Lead Benchmark, MAP-aligned measurement)
4. `docs/ROADMAP.md` — v1.6 → v1.7+ phased roadmap anchored to this handoff
5. Update `docs/design/DESIGN.md` (canonical) — doctrine line at top, FIS™ public brand, Signal Doctrine global rename, M.A.P. redefinition, AJ Digital LLC `legalName` schema note, layer split
6. Reconcile DESIGN.md duplicates per §5 table
7. `docs/strategy/audiojones-strategy-v1.5.1.md` — codify the canonical reference card

Open as draft. User reviews each doc. Admin squash-merge per established pattern.

### Task 2 — Pre-flight security remediation (separate PR, before any further work)

Branch: `security/vercel-env-setup-remediation`

1. Delete `VERCEL_ENV_SETUP.md` from working tree
2. Add to `.gitignore`
3. Cherry-pick the 2 archived security commits from `archive/pr-58-codex-services-phase-1-2026-05-08` if relevant
4. Run `git filter-repo --invert-paths --path VERCEL_ENV_SETUP.md` to purge from history (coordinate with user — repo-wide rewrite)
5. User actions (out-of-code):
   - Revoke Firebase service account in Google Cloud Console
   - Confirm Whop API key revoked (user has already done this per session log)

### Task 3 — Phase 1.1 Brand vocabulary migration (after Phase 1.0 lands)

Branch: `chore/v1-6-brand-vocabulary-migration`

Three sweeps with comprehensive multi-pattern grep + manual review:

1. **Public-only:** `Applied Intelligence Systems` / `AIS` → `Founder Intelligence Systems™` / `FIS™`
2. **Global:** `Signal Theory` → `Signal Doctrine`
3. **Public + global:** `M.A.P.` "Meaningful + Actionable + Profitable" → "Measurement + Attribution + Prediction"

Update `siteConfig.description`, homepage Hero copy, `/applied-intelligence/page.tsx`, `/frameworks/applied-intelligence-systems/` retirement decision, services page coordination.

Verify `organizationJsonLd()` body sets `legalName: "AJ Digital LLC"`.

### Task 4 — Phase 1.2 Framework + Acronym subsystem foundations (parallel to Task 3)

Branch: `feat/v1-6-page-templates`

1. Promote `<Breadcrumbs>` from `src/components/applied-intelligence/` to `src/components/ui/Breadcrumbs.tsx`
2. Author `<FrameworkPageTemplate>` (composable, content-driven, §0.8 nine-step)
3. Author `<AcronymPageTemplate>` (lighter §0.8 variant)
4. Author `<FounderTldrBlock>`, `<RelatedTermsBlock>`, `<RelatedFrameworksBlock>`, `<FaqBlock>`
5. Author `src/content/types.ts` (FrameworkContent, AcronymContent types per §0.8)
6. Content storage decision: **TS modules in `src/content/{frameworks,glossary}/[slug].ts`** (recommended for v1; design type interface so a future Sanity migration is mechanical)

### Task 5 — Phase 1.3 Sprint 1 framework pages (after Tasks 3 + 4)

Five PRs (one per framework page, in locked order):

1. `feat/framework-predictive-reconstruction`
2. `feat/framework-founder-prediction-error-model`
3. `feat/framework-map-attribution-rewrite`
4. `feat/framework-signal-audit-framework`
5. `feat/framework-ai-for-founder-led-businesses`

Each PR: content file + page route + metadata + 5 schema blocks (`organizationJsonLd`, `breadcrumbJsonLd`, `faqJsonLd`, `articleJsonLd`, `speakableSpec`) + iPhone Safari production-mode QA before merge.

### Task 6 — Phase 1.4 Acronym subsystem (parallel to Task 5)

Branch: `feat/glossary-subsystem`

1. `/glossary/page.tsx` — alphabetic index, grouped by layer (Operational vs Theoretical)
2. `/glossary/[slug]/page.tsx` — dynamic per-acronym route
3. 11 content files in `src/content/glossary/<slug>.ts` (ACI, ACIx, AID, AIG, ASA, CAPS, EPM, HAI, IPT, MSEE, PAS, PRA, PR)

   ⚠️ **Slug collision risk:** `PR` (acronym) vs `predictive-reconstruction` (framework page slug). Recommend acronym route `/glossary/pr-acronym` or similar.

4. Each acronym page emits `definedTermJsonLd`, `breadcrumbJsonLd`, `faqJsonLd`, `speakableSpec`
5. Update `src/app/sitemap.ts` + `src/lib/site.ts` `publicRoutes`

### Tasks 7-9 (deferred until 5 + 6 land)

- Phase 1.5: Internal linking architecture
- Phase 1.6: Schema rollout + validation (`scripts/check-schema-coverage.ts`)
- Phase 1.7: AEO tracking + Speed-to-Lead Benchmark + MAP-aligned measurement
- Phase 1.8: Distribution prep (docs-only)

---

## §9. Validation commands (run after every scoped task)

```bash
pnpm typecheck
pnpm lint
pnpm build
```

All three must pass before opening or marking PR ready.

### Additional checks per task

- `pnpm check:no-firebase` — Firebase guard (runs in CI; can run locally)
- `git status --short` — verify only intended files staged

---

## §10. Manual verification checklist (after merge to main, before declaring task done)

For any task that touches user-visible surface:

- [ ] **Homepage renders** on `https://audiojones.com/` (200, expected H1, all 7 sections)
- [ ] **Nav** renders 7-item primary + dual CTAs (post PR #62 structure preserved)
- [ ] **robots.txt** still serves disallow list correctly (`/portal/`, `/ops/`, `/api/`, etc.)
- [ ] **sitemap.xml** includes all public routes (especially new framework + glossary routes after Tasks 5 + 6)
- [ ] **Schema output** — view-source on each new page, confirm JSON-LD blocks present + valid against Google Rich Results Test
- [ ] **Responsive behavior** — iPhone-13 viewport (390px) renders without horizontal overflow

---

## §11. Risks + deferred items

### Active risks (high priority)

1. **Live Firebase private key in git-tracked `VERCEL_ENV_SETUP.md`** — must remediate (Task 2) BEFORE Phase 1 work expands the contributor surface
2. **AIS public-only sweep ambiguity** — internal AIS stays, public AIS → FIS™; ambiguous-context matches need manual categorization
3. **M.A.P. redefinition external collateral collision** — LinkedIn / podcast / OG images may use the old "Meaningful + Actionable + Profitable" framing
4. **Acronym page quality at scale** — 11 × §0.8 nine-step = 99 content units; doctrine-line drift is the failure mode
5. **`/frameworks/applied-intelligence-systems` route disposition** — rename, redirect, or convert to internal-only banner (Phase 1.1 decision)

### Strategy v1.5.1 cross-reference gaps (Phase 1.0 should fill)

Reference card supplied is the working ground truth, but the full strategy doc likely carries detail not captured:

- Signal-maturity qualification criteria specifics
- ASI (Affective Systems Intelligence) definition
- EPM (Emotional Predictive Marketing) scope
- Business Diagnostics layer scope
- Full acronym list (reference card has 13 — strategy mentions "20+")
- Rekonr positioning scope
- Speed-to-Lead Benchmark target metrics
- AEO target metrics
- Layer-split edge cases (Signal Audit Framework — Operational or Theoretical?)
- §0.8 character/length targets (Founder TL;DR target word count, etc.)

### Deferred items (out of v1.6 scope)

- Services page rebrand (PR #58 closed; replacement PR pending)
- Other-page redesigns: agents, ai-readiness-diagnostic, case-studies, workshops, roi-calculator detail polish — all preserved on `wip/full-snapshot-2026-05-12`
- 4 untracked root files (`AUDIOJONES_DESIGN.md`, root `DESIGN.md`, `env-audit.md`, `public/icons/`) — deferred user judgment
- Whop full removal (Tier 3-7 backend infrastructure dormant — separate cleanup PR if/when desired)
- Firebase code residue removal (100+ admin/portal files import inert stubs — separate cleanup PR if/when desired)
- `/api/newsletter/subscribe` legacy route retirement (preserved for external callers)
- `/apply` form production adapter (currently stubs back to mock — Wave 7 funnel-pack reconciliation)

---

## §12. Recovery anchors (never delete)

- **`wip/full-snapshot-2026-05-12`** (local branch) — 449 files captured from May 12 WIP
- **`archive/pr-58-codex-services-phase-1-2026-05-08`** (local branch) — 3 unpushed security commits
- **Tag `v-homepage-redesign-2026-05-12`** (origin) — PR #69 squash anchor (`2d7d007`)

---

*End handoff. Phase 0 analysis complete. Phase 1.0 (foundation docs) is the next dispatched task. No code changes in this commit — handoff doc only.*
