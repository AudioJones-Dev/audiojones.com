---
title: "Phase 0 — audiojones.com Implementation Plan (v1.6 execution baseline)"
status: "analysis only — no code changes in this phase"
generated: "2026-05-12 (post PR #69 merge)"
production_state: "homepage live at https://audiojones.com — 7-section flow, Spline removed, new signal logo"
main_head: "2d7d007 (PR #69 squash)"
preserved_recovery: "wip/full-snapshot-2026-05-12 (449 files), archive/pr-58-codex-services-phase-1-2026-05-08"
strategy_basis: "Audio Jones strategy v1.5.1 — see Appendix C for cross-reference gaps"
ground_truth: "canonical reference card supplied with the Phase 0 dispatch (this session)"
---

> # Audio Jones Permanent Doctrine
>
> ## Complexity exists in the architecture.
> ## Not in the reading experience.
>
> *This doctrine governs all engineering, documentation, copy, and framework authoring. Every page, component, schema, and acronym definition produced under v1.6 must keep cognitive load on the reader low, even when the underlying system is deep. Required at the top of `AGENTS.md`, `CLAUDE.md`, every framework page, every acronym page, Rekonr positioning surfaces, and internal philosophy docs.*

# Phase 0 — Implementation Plan

Read-only baseline for Phase 1 execution. Nine deliverables follow per the Phase 0 specification.

---

## Canonical reference basis

This plan is produced against the **canonical reference card** supplied in the Phase 0 dispatch (treated as authoritative truth for this session) because the strategy v1.5.1 source document is not reachable from this session's filesystem. Any place this plan would have benefited from cross-reference against the full strategy doc is flagged in **Appendix C — Strategy v1.5.1 cross-reference gaps**.

The reference card encodes:

- **Brand hierarchy:** Audio Jones (authority brand, intellectual identity, framework ecosystem, publishing identity) → AJ Digital LLC (operating / legal entity, implementation layer, schema `legalName`)
- **Public vs internal vocabulary:** Founder Intelligence Systems™ (PUBLIC ANCHOR) replaces public AIS™; Applied Intelligence Systems (INTERNAL METHODOLOGY ONLY — no ™, no public mentions); Signal Doctrine (top-of-hierarchy philosophical layer; replaces Signal Theory **globally**, not just in public copy); M.A.P. = Measurement + Attribution + Prediction (NOT "Meaningful + Actionable + Profitable")
- **Framework hierarchy:** Signal Doctrine → Predictive Reconstruction (PR) → Affective Systems Intelligence (ASI) → Founder Intelligence Systems™ (FIS / internal: AIS) → M.A.P. Attribution → Emotional Predictive Marketing (EPM) → Business Diagnostics
- **Layer split:** Operational (AI for founder-led businesses, FIS™, MAP, Signal Audit, Founder Prediction Error, Signal vs Noise) vs Theoretical (Signal Doctrine, PR, ASI, EPM, acronym ontology)
- **Primary persona:** Founder Operator Under Cognitive Load (qualified on signal-maturity criteria, NOT hard ARR bands)
- **Sprint 1 build order:** Predictive Reconstruction → Founder Prediction Error Model → M.A.P. Attribution → Signal Audit Framework → AI for Founder-Led Businesses
- **§0.8 page structure:** H1 → Founder TL;DR → Why It Matters → Operational Interpretation → Technical Definition → Framework Relationships → Business Application → Related Terms → FAQ
- **Doctrine line:** required at the top of AGENTS.md, CLAUDE.md, framework pages, Rekonr positioning, internal philosophy

---

## §1. Repo structure map

### Top-level

```
C:/dev/audiojones-clean/
├── apps/                        # workspace apps (monorepo)
├── packages/                    # workspace packages (adapters, config)
├── data/                        # static data
├── db/                          # SQL migrations (NeonDB) — db/migrations/
├── docs/                        # documentation (see §3 audit)
├── env/                         # environment templates
├── outputs/                     # Phase 0+ deliverables (created this phase)
├── public/                      # static assets
│   ├── assets/Homepage/         # per-section design assets
│   ├── assets/logos/            # brand logos (workmark + new signal-logo set)
│   ├── backgrounds/             # aj-bg-* PNG/SVG/WEBP — referenced by globals.css CSS vars
│   ├── favicon*.png, site.webmanifest
│   └── 3d/ — REMOVED in PR #69 (Spline)
├── scripts/                     # build/cli helpers (including check-no-firebase.ts guard)
├── src/                         # main app code (Next.js App Router)
├── codex.{deploy,init,preview,test}.yml — Codex task configs
├── eslint.config.mjs            # ESLint flat config
├── middleware.ts                # Next.js middleware (root-level)
├── next.config.ts               # Next.js config (image domains, headers, redirects)
├── package.json                 # pnpm 10.30.3, Next.js 16.2.3, Tailwind v4
├── pnpm-lock.yaml
├── tsconfig.json
├── vercel.json                  # Vercel deploy config
├── AUDIOJONES_DESIGN.md         # ⚠️ UNTRACKED root file (May 11 WIP draft — see §3)
├── DESIGN.md (root)             # ⚠️ UNTRACKED root file separate from canonical (see §3)
├── docs/DESIGN.md               # ⚠️ DUPLICATE — separate from canonical docs/design/DESIGN.md (see §3)
├── DEPLOYMENT.md, DEPLOYMENT_READINESS_2026-05-04.md
├── MARKETING-IA.md              # IA reference doc
└── ISSUE_ANALYSIS.md            # legacy issue tracker (not to be edited)
```

### `src/app/` routes (Next.js App Router — 22 top-level segments)

**Marketing/public:**
- `page.tsx` — homepage (7-section flow, PR #69)
- `about/`, `services/`, `agents/{page.tsx, responseos/}`
- `applied-intelligence/{page.tsx, diagnostic/}` — currently public; v1.6 demotes "Applied Intelligence Systems" public branding to internal-only (see §6 Phase 1.1)
- `apply/{page.tsx, thank-you/}`, `book-a-call/`, `pricing/`
- `blog/`, `insights/`, `case-studies/`, `workshops/`
- `frameworks/{page.tsx, applied-intelligence-systems/, map-attribution/, niche-framework/, signal-vs-noise/}` — 4 existing framework sub-pages
- `roi-calculator/`, `ai-readiness-diagnostic/`, `step-2/`

**Legal/policy:** `cancellation-policy/`, `consent-testimonial/`, `cookie-policy/`, `privacy-policy/`, `studio-policy/`, `terms-of-service/`

**Auth-walled / ops:** `portal/`, `ops/`, `status/`, `env/`, `not-authorized/`, `test-slack/`, `uploader/`

**API + global:** `api/` (multiple route handlers), `layout.tsx`, `globals.css`, `robots.ts`, `sitemap.ts`, `favicon.ico`, `not-found.tsx`

### `src/components/` structure

**Shared primitives (`src/components/ui/`):**
- `Button.tsx` (`<Button>` + `<ButtonLink>` — variants: `primary`, `secondary`, `ghost`, `glow`, `system-glow`; sizes: `sm`, `md`, `lg`)
- `Eyebrow.tsx` — tone="gold" (default) | "blue" | "muted"
- `Card.tsx`, `Badge.tsx` — ⚠️ admin-styled (raw Tailwind grays) — do NOT use for marketing surfaces
- `Input.tsx`, `Textarea.tsx`, `Checkbox.tsx`, `Select.tsx`, `FormField.tsx`
- `cards/` — specialized card subtypes

**Layout / chrome:** `Header.tsx`, `Footer.tsx`, `CookieBanner.tsx`, `CapacityBanner.tsx`, `BuildStamp.tsx`, `GlobalDisclaimer.tsx`

**SEO:** `seo/JsonLd.tsx` — JSON-LD `<script>` wrapper

**Feature surfaces:** `home/landing/` (13 components — post PR #69 7-section homepage), `applied-intelligence/` (including `Breadcrumbs.tsx`), `apply/`, `blog/`, `marketing/`, `newsletter/`, `roi-calculator/`, `pages/`, `AuthForm.tsx`/`AuthWidget.tsx`/`AuthNav.tsx` (inert post-Firebase-removal)

### `src/lib/` key directories

- `seo/` — `metadata.ts` (`buildMetadata` helper) + `schema.ts` (**8 schema helpers — see §2.6**)
- `applied-intelligence/tokens.ts` — TypeScript token mirror of `globals.css` CSS vars
- `leads/` — `lead-storage.ts` (NeonDB), `lead-schema.ts`, `lead-scoring.ts`, `lead-notifications.ts`
- `apply/` — `apply-storage.ts` (mock + stubbed-production adapter pattern), `apply-schema.ts`
- `newsletter/` — `newsletter-storage.ts` (mock + MailerLite adapter with mock fallback)
- `roi-calculator/` — `roi-calculator-storage.ts` (NeonDB), `roi-calculator-email.ts` (Resend), `calculations.ts`, `roi-calculator-schema.ts`
- `site.ts` — `siteConfig`, `publicRoutes`, `noindexRoutes`, `disallowedRoutes`
- `legacy-stubs.ts` — Firebase-shaped throwing stubs (Firebase removed per `docs/architecture/stack-decision.md`)
- Admin/portal infrastructure (server/, ai/, analytics/, streaming/, slo/, backup/, etc.) — mostly inert post-Firebase removal
- `mcp/whop.ts`, `agents/whop-actions.ts` — Whop integration dormant per 2026-05-08 audit
- `db/leads.ts`, `db/applied-intelligence-leads.ts` — Neon Postgres lead pipeline

### `src/config/` — site-wide config

- `links.ts` — `ctaLinks` (signalDiagnostic, roiCalculator, bookSession, viewServices, viewPricing, contactUs); `portalLinks`, `socialLinks`, `externalIntegrations`
- `nav.ts` — `mainNav` (post-PR #62 7-item nav)
- `modules.ts` — module list (post-PR #59 retirement updates)

### Build tooling

- **Package manager:** pnpm 10.30.3 (monorepo via workspaces)
- **Framework:** Next.js 16.2.3 (App Router, React Server Components)
- **Styling:** Tailwind v4 with `@theme inline` block in `globals.css` (CSS-var-driven tokens)
- **TypeScript:** strict mode, paths aliased
- **Linting:** ESLint flat config (`eslint.config.mjs`)
- **Validation scripts:** `pnpm typecheck`, `pnpm exec eslint src`, `pnpm build`, `pnpm check:no-firebase`

### Deployment

- **Host:** Vercel (production: `https://audiojones.com`)
- **Phase 3A pipeline:** `.github/workflows/...` → `validate` → `build` → `deploy` (calls `vercel deploy --prod`)
- **Phase 3B condition:** `smoke_preview` check fails on PRs (expected); admin override pattern in use
- **Recent merge history:** PR #50–#69 — all squash-merged via admin override after iPhone Safari QA where relevant

---

## §2. Existing systems inventory

### §2.1 Design system

Source of truth: **`docs/design/DESIGN.md`** (29,840 bytes, canonical; see §3 for duplicate reconciliation).

- **Brand thesis:** "Editorial Intelligence Systems" — Apple × Linear × Palantir × broadsheet editorial canvas. Dark-first, signal-orange semantic accents, restrained otherwise.
- **Brand identity layer (per reference card):**
  - **Audio Jones** = authority brand / intellectual identity / framework ecosystem / publishing identity
  - **AJ Digital LLC** = operating / legal entity / implementation layer / `schema.org/Organization.legalName`
- **Component philosophy:** semantic tokens (`--signal`, `--system`, `--metric`), never raw hex; borders + spacing for hierarchy; native HTML controls on lead-capture critical paths (PR #47 lesson).

### §2.2 Token system

CSS variables in `src/app/globals.css` lines 84+ mirrored in `src/lib/applied-intelligence/tokens.ts`:

- **Brand raw values:** `--aj-orange` (#FF4500), `--aj-blue-bright`, `--aj-gold`, `--aj-blue`
- **Surfaces dark:** `--bg-0` (#05070F page bg) → `--bg-4` (hover surface)
- **Surfaces light split (opt-in via `.surface-light`):** `--paper`, `--surface`, `--surface-soft`, `--ink`, `--ink-muted`
- **Text:** `--fg-0` (white) → `--fg-3` (muted)
- **Borders:** `--line-1` → `--line-3` (hierarchy via opacity)
- **Semantic:** `--signal`, `--system`, `--metric`, `--success`, `--warning`, `--danger`
- **Type families:** `--font-headline` (Space Grotesk), `--font-accent` (Sora), `--font-body` (Inter), `--font-mono` (system)
- **Spacing:** `--sp-xs` (4px) → `--sp-5xl` (128px); page max `--page-max: 1280px`; copy max `--copy-max: 720px`
- **Radii:** `--r-sm` (6px) → `--r-pill` (9999px); cards `--r-card` (20px)
- **Shadows:** `--shadow-glow-blue`, `--shadow-glow-orange`, `--shadow-card`
- **Motion:** `--ease-out`, `--ease-in-out`, `--dur-fast` (120ms) / `--dur-base` (180ms) / `--dur-slow` (320ms)

### §2.3 Typography utility classes

In `globals.css` lines ~325-410: `t-display-xl`, `t-display-lg`, `t-h1`, `t-h2`, `t-h3`, `t-h4`, `t-lead`, `t-body-lg`, `t-body`, `t-small`, `t-label`.

Hard rule: **all typography flows through `t-*` classes** — zero raw `text-{n}xl font-extrabold` patterns.

### §2.4 Tailwind v4 bridge

`@theme inline` block in `globals.css` exposes CSS vars to Tailwind utilities (`bg-bg-2`, `text-fg-1`, `text-aj-orange`, `border-aj-blue-bright`). Adding a new token requires updating `globals.css` (`:root` AND `@theme inline`) and `tokens.ts` in lockstep.

### §2.5 Component primitives (canonical, marketing-safe)

| Component | Status | Notes |
|---|---|---|
| `<Button>` + `<ButtonLink>` | Stable | Variants `glow` (signal orange) + `system-glow` (system blue) for primary CTAs; `secondary` for transparent+border; `ghost` for text-only |
| `<Eyebrow>` | Stable | gold/blue/muted; uppercase, tracked, `text-[12px]` |
| `<Card>` (`ui/`) | ⚠️ admin-styled | Raw Tailwind grays — DO NOT use for marketing |
| `<Badge>` (`ui/`) | ⚠️ admin-styled | Same caveat |
| `<Input>`, `<Textarea>`, `<Checkbox>`, `<FormField>` | Stable | Native-wrapping |
| `<Select>` | ⚠️ Known mobile-Safari issue in lead-capture critical paths (PR #47) | Use native `<select>` directly in conversion forms |
| `<JsonLd>` | Stable | Wraps inline JSON-LD `<script>` |
| `<Breadcrumbs>` (scoped to `applied-intelligence/`) | Needs promotion to `ui/` | Currently consumed only by applied-intelligence subroutes |

### §2.6 SEO / schema infrastructure (`src/lib/seo/`)

**`metadata.ts`** — `buildMetadata({title, description, path, ...})` helper for Next.js Metadata API.

**`schema.ts`** — 8 schema helpers, **all already in place**:

| Helper | Use in v1.6 |
|---|---|
| `organizationJsonLd()` | Org schema for Audio Jones (parentOrganization: AJ Digital LLC via `legalName`) |
| `personJsonLd()` | Founder Person schema |
| `webSiteJsonLd()` | WebSite schema (with SearchAction) |
| `breadcrumbJsonLd(items)` | Every new framework + acronym page |
| `faqJsonLd(items)` | §0.8 step 8 on every framework + acronym page |
| `articleJsonLd({...})` | Framework pages (optional richer parsing) |
| **`definedTermJsonLd({...})`** | **Every acronym page is a `DefinedTerm` — pre-built for v1.6 ontology work** |
| `speakableSpec(cssSelectors)` | AEO / voice-search optimization on every new page |

**Implication:** the schema layer for v1.6 acronym + framework pages is **already implemented**. Phase 1 page authoring consumes these helpers directly; no new schema infrastructure required. ⚠️ Verify `organizationJsonLd()` body sets `legalName: "AJ Digital LLC"` (Phase 1.0 audit task; if missing, add).

### §2.7 Lead capture infrastructure

**Stack (per `docs/architecture/stack-decision.md`):** Cloudflare → Vercel/Next.js → Sanity CMS → NeonDB → Resend → n8n → Supabase (only when auth/storage/realtime genuinely required).

**Active lead pipelines:**
1. **Applied Intelligence diagnostic / `/api/leads`** → NeonDB + Resend + optional n8n
2. **ROI Calculator (`/roi-calculator` + `/api/roi-calculator/lead`)** → NeonDB + Resend (Resend domain verification pending — emails fail soft)
3. **/apply form (`/api/apply`)** → adapter pattern; production adapter stubbed back to mock (deferred to "Wave 7 funnel-pack reconciliation"); leads currently log to console only
4. **Newsletter (`/api/newsletter`)** → MailerLite adapter with mock fallback; legacy `/api/newsletter/subscribe` preserved

### §2.8 Existing homepage (post-PR #69)

`src/app/page.tsx` renders 7 sections in order: HeroAllSignal → SignalNoiseModel → ResponseOSWedge → RoiLeadMagnet → ProcessPipeline → ProofStats → DiagnosticCTA.

⚠️ **Hero copy references "Applied Intelligence Systems" publicly** — Phase 1.1 sweep to Founder Intelligence Systems™.

### §2.9 Nav + Header/Footer (post-PR #62 + PR #69)

- 7-item primary nav rendered by `Header.tsx` driven from `src/config/nav.ts`
- Dual hero CTAs (primary glow + secondary ghost)
- New "audio jones signal logo white nav" variant in both Header + Footer (PR #69 logo swap commit `c4ecdf5`)

### §2.10 Firebase removal posture

- **Status:** intentionally removed per `docs/architecture/stack-decision.md` (Status: accepted, 2026-04-29)
- **Guard:** `scripts/check-no-firebase.ts` runs in CI (`pnpm check:no-firebase`); allowlists `legacy-stubs.ts` + a few doc paths
- **Stubs:** `src/lib/legacy-stubs.ts` + `src/lib/server/firebaseAdmin.ts` + `src/lib/shared/firebaseAdmin.ts` — exports throw at runtime; 100+ admin/portal files import from these (all inert)
- **Live security exposure:** `VERCEL_ENV_SETUP.md` (git-tracked) contains a real Firebase service account private key + (already-rotated) Whop API key. Firebase service account rotation + git-history purge still pending (see §8 risk 1).

### §2.11 Documentation footprint

- `docs/codex/` — Codex task briefs (ROI calculator v1, ResponseOS v1)
- `docs/specs/` — spec docs (services rebrand 2026-05-08 with 2026-05-11 amendment; client-portal)
- `docs/architecture/` — stack-decision, backend-stack
- `docs/design/` — canonical DESIGN.md (570 lines) + design-principles.md
- ~20 historical phase/event/issue docs (low signal for v1.6)

---

## §3. Documentation audit

### Mandatory v1.6 docs

| File | Status | Size | Action |
|---|---|---|---|
| `AGENTS.md` (root) | ❌ **MISSING** | — | **Phase 1.0 — author with doctrine line at top** |
| `CLAUDE.md` (root) | ❌ **MISSING** | — | **Phase 1.0 — author with doctrine line at top** |
| `docs/PRD.md` | ❌ **MISSING** | — | **Phase 1.0 — author with doctrine line at top** |
| `docs/ROADMAP.md` | ❌ **MISSING** | — | **Phase 1.0 — author with doctrine line at top** |
| `docs/DESIGN.md` (canonical for v1.6 referencing) | ⚠️ **DUPLICATED in 4 locations** | varies | **Phase 1.0 — reconcile to single canonical (`docs/design/DESIGN.md`), add doctrine line at top, encode FIS™ + Signal Doctrine + M.A.P. redefinition** |

### DESIGN.md drift (4 conflicting files)

| File | Size | Disposition |
|---|---|---|
| `docs/design/DESIGN.md` | 29,840 b | Canonical — keep, update for FIS™ + Signal Doctrine + M.A.P. redefinition + doctrine line |
| `docs/DESIGN.md` | 8,479 b | **Stale / earlier draft.** Reconcile: delete OR convert to a one-line pointer at canonical |
| `AUDIOJONES_DESIGN.md` (root, untracked) | 30,341 b | DESIGN.md v2 draft authored during May 11 WIP. Decide: merge into canonical OR park at `docs/design/DRAFT-v2.md` |
| `DESIGN.md` (root, untracked) | 19,944 b | Earlier/stub variant of AUDIOJONES_DESIGN.md. Likely delete after WIP review |
| `docs/design.md` | small | Brand-folder mirror reference. Keep, cross-link to canonical |

### Other existing docs of consequence

- `docs/codex/roi-calculator-v1-brief.md` — Codex brief with §17.1 CTA canonicality amendment
- `docs/codex/responseos-v1-brief.md` — ResponseOS v1 product spec (PR #65)
- `docs/specs/services-rebrand-spec-2026-05-08.md` — superseded by PR #69 for the homepage scope; services-page rebrand still pending separately
- `docs/architecture/stack-decision.md` — Firebase removal rationale
- `docs/architecture/backend-stack.md` — backend wiring
- `MARKETING-IA.md` (root) — IA reference; verify alignment with v1.5.1
- `env-audit.md` (root, untracked) — 2026-05-10 audit surfacing the Firebase + Whop credential leak in `VERCEL_ENV_SETUP.md`

### Existing acronym / glossary / ontology docs

❌ **None found.** No `docs/glossary/`, `docs/ontology/`, or `docs/acronyms/`. The 20+ proprietary acronyms (ACI, ACIx, AID, AIG, ASA, CAPS, EPM, HAI, IPT, MSEE, PAS, PRA, PR) have no canonical definitions in the repo yet.

### Existing strategy docs

❌ **No `docs/strategy/` directory.** Strategy v1.5.1 is referenced by the dispatch but not present in-repo. **Phase 1.0 codifies it at `docs/strategy/audiojones-strategy-v1.5.1.md`** as the single downstream reference (see Appendix C for cross-reference gaps).

---

## §4. Reusable component inventory — what v1.6 can extend

These primitives exist and are token-compliant. v1.6 should consume them rather than build new equivalents.

| Asset | Path | Use in v1.6 |
|---|---|---|
| `<Eyebrow tone="gold\|blue\|muted">` | `src/components/ui/Eyebrow.tsx` | Section eyebrows on every framework + acronym page |
| `<Button>` / `<ButtonLink>` | `src/components/ui/Button.tsx` | All CTAs (variants `glow` primary, `secondary` secondary) |
| `<JsonLd data={...}>` | `src/components/seo/JsonLd.tsx` | Inject all schema (faq, definedTerm, breadcrumb, speakable, article) |
| Typography utilities | `src/app/globals.css` | `t-h1`/`t-h2`/`t-h3`/`t-h4`/`t-lead`/`t-body`/`t-small`/`t-label` |
| Color tokens | CSS vars | `bg-bg-0/1`, `text-fg-0/1/2/3`, `border-[var(--line-2)]` |
| Spacing tokens | CSS vars | `max-w-[var(--page-max)]` (1280px), `max-w-[var(--copy-max)]` (720px) |
| Radius tokens | CSS vars | `rounded-[var(--r-card)]` |
| `buildMetadata({...})` | `src/lib/seo/metadata.ts` | Canonical metadata on every new page |
| `organizationJsonLd()` | `src/lib/seo/schema.ts` | Reused on every page (verify `legalName: "AJ Digital LLC"` is set) |
| `breadcrumbJsonLd([...])` | `src/lib/seo/schema.ts` | Every new page emits its breadcrumb chain |
| **`faqJsonLd([...])`** | `src/lib/seo/schema.ts` | §0.8 step 9 (FAQ) on every framework + acronym page |
| **`definedTermJsonLd({...})`** | `src/lib/seo/schema.ts` | Every acronym page is a `DefinedTerm` |
| **`articleJsonLd({...})`** | `src/lib/seo/schema.ts` | Framework pages (optional richer parsing) |
| **`speakableSpec(['h1', '.tldr-block'])`** | `src/lib/seo/schema.ts` | AEO optimization on every new page |
| `<Breadcrumbs>` (currently in `applied-intelligence/`) | `src/components/applied-intelligence/Breadcrumbs.tsx` | **Phase 1.2 — promote to `src/components/ui/Breadcrumbs.tsx`** |
| Hero patterns | `src/components/home/landing/HeroAllSignal.tsx` | Reference for framework page hero composition |

---

## §5. Missing structures inventory — what v1.6 must create

### Routes

| Missing route | Purpose |
|---|---|
| `/glossary/` (index) | Acronym subsystem landing — alphabetic index + groupings by hierarchy layer (Theoretical vs Operational) |
| `/glossary/[slug]` | Per-acronym definition page (§0.8 nine-step) |
| `/frameworks/predictive-reconstruction` | Sprint 1 framework #1 (theoretical anchor, 0/4 LLMs recognize) |
| `/frameworks/founder-prediction-error-model` | Sprint 1 framework #2 (operational anchor) |
| `/frameworks/signal-audit-framework` | Sprint 1 framework #4 — **distinct from `/applied-intelligence/diagnostic` (Signal Audit diagnostic instance)** |
| `/frameworks/ai-for-founder-led-businesses` | Sprint 1 framework #5 (operational bridge phrase) |
| `/frameworks/founder-intelligence-systems` (or rename of `/frameworks/applied-intelligence-systems`) | Public anchor page for FIS™ (Phase 1.1 decision) |
| `/docs/strategy/audiojones-strategy-v1.5.1.md` (not a route — internal doc) | Strategy v1.5.1 codified in-repo |

### Components

| Missing component | Purpose |
|---|---|
| `<FrameworkPageTemplate>` | Implements §0.8 nine-step structure — composable, content-driven |
| `<AcronymPageTemplate>` | §0.8 with lighter scope (definition emphasis, shorter copy targets) |
| Promoted `<Breadcrumbs>` (`src/components/ui/`) | Shared UI primitive |
| `<RelatedTerms>` / `<RelatedFrameworks>` | Step 7 of §0.8 — internal-link block |
| `<FounderTldrBlock>` | Step 2 of §0.8 — 1-2 sentence plain-English callout (likely gold-accent treatment) |
| `<FaqBlock>` (consuming `faqJsonLd`) | Step 9 of §0.8 — accessible Q/A with schema attached |

### Content model

| Missing structure | Decision needed |
|---|---|
| Acronym/term content store | **TS module per term** vs Sanity vs MDX — Phase 1.2 lock (recommend TS modules for v1) |
| Framework content store | Same approach as acronyms |
| "Related Terms" graph | Edge data — inline in content file OR separate `terms.graph.ts` |

### Page content (Sprint 1 + acronym 11)

| Missing copy artifact | Phase |
|---|---|
| Predictive Reconstruction framework page copy | 1.3.1 |
| Founder Prediction Error Model framework page copy | 1.3.2 |
| M.A.P. Attribution Framework — **rewrite** of existing page for M.A.P. = Measurement + Attribution + Prediction | 1.3.3 |
| Signal Audit Framework framework page copy | 1.3.4 |
| AI for Founder-Led Businesses framework page copy | 1.3.5 |
| 11 acronym page copy (ACI, ACIx, AID, AIG, ASA, CAPS, EPM, HAI, IPT, MSEE, PAS, PRA, PR) | 1.4 |
| Global sweep: Signal Theory → Signal Doctrine (PUBLIC + INTERNAL — per reference card "globally") | 1.1 |
| Public sweep: Applied Intelligence Systems → Founder Intelligence Systems™ (PUBLIC ONLY — internal AIS retained) | 1.1 |
| Public sweep: M.A.P. "Meaningful Actionable Profitable" → "Measurement + Attribution + Prediction" | 1.1 |
| Hero copy update on `/applied-intelligence/page.tsx` (methodology entrypoint, not public brand vehicle) | 1.1 |

### Instrumentation

| Missing structure | Phase |
|---|---|
| AEO tracking — LLM-referred traffic classifier (user-agent + referrer heuristics) | 1.7 |
| Speed-to-Lead Benchmark page + diagnostic | 1.7 |
| MAP-aligned lead measurement instrumentation (extend `lead-scoring.ts` for Measurement + Attribution + Prediction signal capture) | 1.7 |

---

## §6. v1.6 Implementation plan (phased task list)

> The doctrine line — *"Complexity exists in the architecture. Not in the reading experience."* — is the universal pass/fail criterion. If a page reads as dense even though the system behind it is correct, it fails.

### Phase 1.0 — Foundation docs (BLOCKS everything else)

Author the 5 mandatory docs + reconcile duplicates + codify strategy:

1. `AGENTS.md` (root) — doctrine line at top. Body: agent operating rules (Codex, Claude Code, future bots) — non-negotiables (no Firebase, no public AIS, doctrine compliance, §0.8 structure for definitions, NeonDB-only persistence, Resend-only email, mobile-first, real iPhone Safari production-mode QA on conversion paths, native HTML for lead-capture critical paths).
2. `CLAUDE.md` (root) — doctrine line at top. Body: Claude-specific operating principles, session memory pointers, this Phase 0 doc as baseline, strategy v1.5.1 link.
3. `docs/PRD.md` — doctrine line at top. Body: v1.6 PRD — Founder Operator Under Cognitive Load persona, framework hierarchy, Sprint 1 build order, acronym ontology, AEO targets, Speed-to-Lead Benchmark, MAP-aligned measurement.
4. `docs/ROADMAP.md` — doctrine line at top. Body: phased v1.6 → v1.7+ roadmap with milestone gates.
5. `docs/design/DESIGN.md` (canonical) — append doctrine line, encode FIS™ public brand + Signal Doctrine global rename + M.A.P. redefinition + AJ Digital LLC `legalName` reference.
6. **Reconcile DESIGN.md duplicates:**
   - Delete or pointer-redirect `docs/DESIGN.md` (8,479 b)
   - Decision on `AUDIOJONES_DESIGN.md` (root untracked, 30,341 b) — merge OR park at `docs/design/DRAFT-v2.md`
   - Decision on root `DESIGN.md` (untracked, 19,944 b) — likely delete after WIP review
7. **Codify strategy v1.5.1** at `docs/strategy/audiojones-strategy-v1.5.1.md` as single source of truth.

### Phase 1.1 — Brand vocabulary migration (public + global)

> ⚠️ Per reference card: "Signal Doctrine replaces Signal Theory **globally**" (not just public). AIS replacement is PUBLIC ONLY (internal AIS retained). M.A.P. redefinition affects both public and internal vocabulary going forward.

1. **Global sweep** — `Signal Theory` → `Signal Doctrine` everywhere (code comments, doc-internal, public copy, schema, OG tags)
2. **Public sweep** — `Applied Intelligence Systems` / `AIS` (when used as public brand) → `Founder Intelligence Systems™` / `FIS™`. Preserve INTERNAL mentions (architecture diagrams, code comments referring to the methodology layer).
3. **Public + global sweep** — `M.A.P.` "Meaningful + Actionable + Profitable" → "Measurement + Attribution + Prediction" (with the period-separated initialism preserved)
4. Update `siteConfig.description` in `src/lib/site.ts` if it leaks public AIS
5. Update `<HeroAllSignal>` homepage copy
6. Update `/applied-intelligence/page.tsx` to position as methodology entrypoint, not public brand vehicle
7. Update `/frameworks/applied-intelligence-systems/` page — convert to internal-only banner OR rename/redirect to `/frameworks/founder-intelligence-systems`
8. Update `/services/page.tsx` (coordinate with pending services rebrand)
9. Verify `organizationJsonLd()` body sets `legalName: "AJ Digital LLC"`

### Phase 1.2 — Framework + Acronym subsystem foundations

1. **Promote `<Breadcrumbs>`** from `src/components/applied-intelligence/` to `src/components/ui/Breadcrumbs.tsx`
2. **Author `<FrameworkPageTemplate>`** — composable component taking typed `content` prop, rendering §0.8 nine-step structure
3. **Author `<AcronymPageTemplate>`** — lighter variant of §0.8
4. **Author `<FounderTldrBlock>`** — distinctive 1-2 sentence callout (step 2 of §0.8) with gold-accent treatment
5. **Author `<RelatedTermsBlock>` + `<RelatedFrameworksBlock>`** — internal-link patterns (step 7)
6. **Author `<FaqBlock>`** — accessible Q/A renderer wired to `faqJsonLd` (step 9)
7. **Content data model decision (lock)** — recommend TS modules `src/content/{frameworks,glossary}/[slug].ts`
8. **Author `src/content/types.ts`** defining `FrameworkContent` and `AcronymContent` types matching §0.8 structure

### Phase 1.3 — Sprint 1 framework pages (5 in locked order)

For EACH page:
- `src/content/frameworks/<slug>.ts` (typed content per §0.8)
- `src/app/frameworks/<slug>/page.tsx` (consumes `<FrameworkPageTemplate>`)
- `buildMetadata({...})`
- `<JsonLd>` blocks: `organizationJsonLd`, `breadcrumbJsonLd`, `faqJsonLd`, `articleJsonLd` (optional), `speakableSpec(['h1', '.tldr-block'])`
- iPhone Safari production-mode QA before merge
- Internal links to relevant acronym pages + sibling frameworks

**Build order (locked per reference card):**
1. `predictive-reconstruction` (theoretical anchor — pure blue ocean)
2. `founder-prediction-error-model` (operational anchor)
3. `map-attribution` — **rewrite existing page** for M.A.P. = Measurement + Attribution + Prediction
4. `signal-audit-framework` (operational + lead magnet; distinct from `/applied-intelligence/diagnostic`)
5. `ai-for-founder-led-businesses` (operational bridge phrase)

### Phase 1.4 — Acronym subsystem (11 pages + index)

1. `src/app/glossary/page.tsx` — alphabetic index, grouped by hierarchy layer (Theoretical vs Operational per reference card layer split)
2. `src/app/glossary/[slug]/page.tsx` — dynamic per-acronym route
3. `src/content/glossary/<slug>.ts` × 11 — ACI, ACIx, AID, AIG, ASA, CAPS, EPM, HAI, IPT, MSEE, PAS, PRA, PR

   ⚠️ **Note slug collision risk:** `PR` (acronym) collides with `predictive-reconstruction` (framework page slug). Recommend acronym route `/glossary/pr-acronym` or disambiguate during Phase 1.4 content authoring.

4. Each page: `definedTermJsonLd`, `breadcrumbJsonLd`, `faqJsonLd`, `speakableSpec`
5. Update `src/app/sitemap.ts` to include `/glossary` + every `/glossary/<slug>`
6. Update `src/lib/site.ts` `publicRoutes` array

### Phase 1.5 — Internal linking architecture

1. Cross-link the 5 framework pages (each lists 2-4 related frameworks)
2. Cross-link the 11 acronym pages (each lists 2-3 related terms + 1-2 parent frameworks)
3. Add acronym links INTO framework pages where terms are referenced
4. Add framework links INTO acronym pages (step 7 of §0.8)
5. Update `/applied-intelligence/page.tsx` to link OUT to framework pages
6. Pattern: max 4 outbound internal links per page (prevent spammy signal)

### Phase 1.6 — Schema rollout + validation

1. Confirm every Sprint 1 framework page emits: `organizationJsonLd`, `breadcrumbJsonLd`, `faqJsonLd`, `articleJsonLd`, `speakableSpec`
2. Confirm every acronym page emits: `organizationJsonLd`, `breadcrumbJsonLd`, `definedTermJsonLd`, `faqJsonLd`, `speakableSpec`
3. Validate against Google Rich Results Test for each canonical page
4. Add CI script (`scripts/check-schema-coverage.ts`) asserting every framework/glossary route has the required schema set

### Phase 1.7 — AEO tracking + Speed-to-Lead Benchmark + MAP-aligned measurement

1. **AEO tracking** — instrument page-load telemetry to classify LLM-referred traffic (user-agent contains `GPTBot`/`ClaudeBot`/`PerplexityBot`; referrer contains `chat.openai.com`/`claude.ai`/`perplexity.ai`). Surface in `/portal/admin` analytics (admin-only).
2. **Speed-to-Lead Benchmark** — new page (route TBD: `/diagnostic/speed-to-lead` recommended) capturing user's stated time-to-first-response, benchmarking against founder-operator industry typical, surfacing gap-to-best-practice, CTA to ResponseOS wedge.
3. **MAP-aligned measurement** — every lead capture API enriches with Measurement (source channel, attribution-token), Attribution (first/last/multi-touch), Prediction (extend existing `lead-scoring.ts`).

### Phase 1.8 — Distribution prep (non-code; docs-only)

1. `docs/distribution/reddit-templates.md`
2. `docs/distribution/linkedin-carousel-templates.md`
3. `docs/distribution/podcast-outreach-kit.md`
4. `docs/distribution/sequencing-plan.md`

---

## §7. Sequencing recommendations

```
Phase 1.0 (foundation docs)              ◆ BLOCKS all subsequent work
   │
   ├─→ Phase 1.1 (vocabulary migration)
   │      can parallel
   ├─→ Phase 1.2 (templates + glossary foundations)
   │
   ↓ (after both complete)
   ├─→ Phase 1.3 (5 framework pages — sequential within phase, locked build order)
   │      can parallel with Phase 1.4
   ├─→ Phase 1.4 (11 acronym pages + glossary subsystem)
   │
   ↓
   └─→ Phase 1.5 (internal linking — depends on 1.3 + 1.4)
          │
          ├─→ Phase 1.6 (schema rollout — overlaps 1.3/1.4)
          │
          ↓
          ├─→ Phase 1.7 (AEO + Speed-to-Lead + MAP measurement)
                 can parallel
          └─→ Phase 1.8 (distribution prep, docs-only)
```

### Hard dependencies

- Phase 1.0 **blocks all subsequent work** — agents won't have operating rules until AGENTS.md/CLAUDE.md exist
- Phase 1.1 must complete BEFORE Phase 1.3.5 (AI for Founder-Led Businesses) to avoid landing a new page that references the old public brand
- Phase 1.2 must complete BEFORE Phase 1.3.1 (template needed before first page)
- Phase 1.3.3 (M.A.P. rewrite) requires audit of existing `/frameworks/map-attribution` page first
- Phase 1.5 requires content from 1.3 + 1.4 to exist
- Phase 1.6 (schema) folds into 1.3/1.4 page work — no separate gate

### Parallelization opportunities

- 1.1 + 1.2 parallel after 1.0
- 1.3 + 1.4 parallel after 1.1 + 1.2
- Within 1.4, all 11 acronym pages can be authored in parallel
- 1.7 + 1.8 parallel after 1.5

---

## §8. Risk report

### High priority

1. **Live security exposure in `VERCEL_ENV_SETUP.md`** — git-tracked file with real Firebase service account private key + (already-rotated) Whop API key. Until the file is purged from git history (BFG / `git filter-repo`) AND the Firebase service account is revoked in Google Cloud Console, the Firebase credential remains compromised. **Recommendation: rotate + history-purge BEFORE Phase 1 work starts.**

2. **AIS public-copy sweep completeness** — "Applied Intelligence Systems" / "AIS" likely appears in 50+ places. Per reference card, public mentions get replaced with FIS™ but INTERNAL mentions stay. Risk: ambiguous-context matches (a doc comment that references both layers) get mis-categorized. Mitigation: comprehensive multi-pattern grep + manual review of each match + automated audit script + Phase 1.0 AGENTS.md rule defining the boundary.

3. **M.A.P. redefinition collisions** — current `/frameworks/map-attribution` page content + likely external collateral (LinkedIn, podcast notes) uses "Meaningful + Actionable + Profitable". Rewriting to "Measurement + Attribution + Prediction" must coordinate. Mitigation: surface external-mention inventory before rewrite; consider 301 redirect strategy if URL slug needs changing.

### Medium priority

4. **Acronym page volume × §0.8 quality at scale** — 11 acronym pages × 9-step structure = 99 distinct content units. Doctrine-line failure is the most likely failure mode. Mitigation: Phase 1.2 builds a tight template; first 2-3 pages get human review pass before remaining 8-9 are authored.

5. **Existing `/frameworks/applied-intelligence-systems` route disposition** — rename, redirect, or convert to "internal context" banner? Each has SEO trade-offs. Mitigation: lock decision in Phase 1.1; if redirect, use `next.config.ts` 308 like PR #59 did.

6. **Glossary content storage decision** — TS modules ship fastest but block non-engineering edits; Sanity is robust but adds latency. Mitigation: lock TS modules for v1; design type interface so a future Sanity migration is mechanical.

7. **AEO instrumentation specificity** — "LLM-referred traffic" detection via user-agent + referrer is heuristic with false positives/negatives. Mitigation: document the heuristic in `docs/instrumentation/aeo-tracking.md`; treat first month as calibration; gate dashboards behind admin auth.

### Lower priority

8. **`<Breadcrumbs>` promotion compatibility** — existing consumers in `applied-intelligence/` may have shape-dependent code. Mitigation: keep original at current path as a thin re-export; promote a clean variant to `ui/`.

9. **`PR` acronym vs `predictive-reconstruction` framework slug collision** — both occupy the "PR" namespace in different contexts. Mitigation: glossary slug `/glossary/pr-acronym` (or similar) with cross-link to framework page; document the collision in strategy doc.

10. **Doctrine line enforcement at content authoring time** — content-quality constraint without an automated check. Risk: pages pass schema/typecheck but fail the doctrine. Mitigation: encode in CLAUDE.md / AGENTS.md as mandatory PR-review step; add doctrine-compliance checklist to PR templates.

11. **`/applied-intelligence/diagnostic` (Signal Audit instance) vs `/frameworks/signal-audit-framework` distinction** — the framework page describes the methodology; the diagnostic page runs the instance. User confusion risk. Mitigation: explicit reciprocal links + distinct H1s; framework page's CTA points to the diagnostic.

12. **DESIGN.md duplicate cleanup is a docs-PR risk** — three different DESIGN docs (root, docs/, docs/design/) plus the untracked AUDIOJONES_DESIGN.md. Reconciling risks losing nuance. Mitigation: read all four before deciding canonical content; preserve in git history before deletion.

13. **Strategy v1.5.1 source doc not reachable from this session** — the canonical reference card is the working ground truth, but the full strategy doc may carry detail not captured here (signal-maturity criteria specifics, framework-relationship edge cases, EPM scope, ASI definition, etc.). Mitigation: Phase 1.0 codifies strategy at `docs/strategy/audiojones-strategy-v1.5.1.md` as the first task; cross-reference gaps flagged in Appendix C.

---

## §9. Recommended Phase 1 scope (single dispatched task)

### **Phase 1.0 — Foundation docs**

Single PR (docs-only, no code changes). Authors the 5 mandatory v1.6 docs with the Audio Jones Permanent Doctrine Line at the top of each, reconciles the existing DESIGN.md duplicates, and codifies strategy v1.5.1.

**Deliverables in the PR:**

1. **`AGENTS.md` (root)** — agent operating rules. Doctrine line at top. Non-negotiables:
   - No Firebase, no public AIS (FIS™ only public), no public "Signal Theory" (Signal Doctrine global), no M.A.P. "Meaningful Actionable Profitable" (Measurement + Attribution + Prediction)
   - §0.8 nine-step structure mandatory for framework + acronym pages
   - NeonDB-only persistence, Resend-only email, MailerLite for newsletter
   - Mobile-first design; real iPhone Safari production-mode QA before merge for conversion-critical paths (per PR #47 lesson)
   - Native HTML controls (not shared `<Select>`/`<Button>` abstractions) on lead-capture critical paths
   - Brand identity layer: Audio Jones (authority) over AJ Digital LLC (operating; `legalName` in schema)
2. **`CLAUDE.md` (root)** — doctrine line at top. Claude-specific operating principles, session memory pointers (`memory/` directory references), Phase 0 doc as reference baseline, strategy v1.5.1 link, the WIP-snapshot-preservation pattern from this session.
3. **`docs/PRD.md`** — doctrine line at top. v1.6 PRD covering:
   - Audience: Founder Operator Under Cognitive Load (signal-maturity qualified, not hard ARR bands)
   - Framework hierarchy: Signal Doctrine → PR → ASI → FIS™ → MAP → EPM → Business Diagnostics
   - Layer split: Operational vs Theoretical
   - Sprint 1 build order locked
   - 11 acronym pages locked
   - AEO targets
   - Speed-to-Lead Benchmark
   - MAP-aligned measurement
4. **`docs/ROADMAP.md`** — doctrine line at top. v1.6 phases (1.0 through 1.8) with milestone gates, anchored to this Phase 0 plan as baseline.
5. **`docs/design/DESIGN.md` update** — add doctrine line at top, encode FIS™ public brand, Signal Doctrine global rename, M.A.P. redefinition, AJ Digital LLC `legalName` reference, layer split context.
6. **DESIGN.md reconciliation:**
   - Delete or pointer-redirect `docs/DESIGN.md` (8,479 b — stale)
   - Decide on `AUDIOJONES_DESIGN.md` (root, 30,341 b WIP draft) — merge or park at `docs/design/DRAFT-v2.md`
   - Decide on root `DESIGN.md` (19,944 b earlier variant) — likely delete after WIP review
7. **`docs/strategy/audiojones-strategy-v1.5.1.md`** — codify the reference card as the in-repo single source of truth for downstream phases. Cross-reference Appendix C gaps if user has the full strategy doc available to fill them.

**Why this scope:**
- Phase 1.0 blocks every other v1.6 phase
- Without AGENTS.md / CLAUDE.md, every subsequent task risks drift from the doctrine, brand split, §0.8 structure, no-Firebase rule, iPhone QA gate
- Author these once correctly, then every downstream phase can move quickly with high confidence

**Out of scope for Phase 1.0:** any code changes, copy sweeps, new pages, schema changes, Whop/Firebase code touches.

**Suggested delivery:** single PR — `docs/phase-1-0-foundation-docs-2026-05-12` — opens as draft, user reviews each doc, marks ready, admin squash-merge per established pattern.

**Estimated effort:** 1-2 sessions of authoring + user review cycles.

**Pre-flight gate (recommended):** complete `VERCEL_ENV_SETUP.md` remediation (rotate Firebase service account, purge from git history) BEFORE Phase 1.0 ships, so the foundation docs ship into a non-compromised repo.

---

# Appendix A — State preserved for recovery

These references stay intact for the duration of v1.6 — **never delete**:

- **`wip/full-snapshot-2026-05-12`** (local branch) — 449 files captured from May 12 WIP; includes services/agents/case-studies/workshops/ai-readiness-diagnostic/newsletter/env-schema/scripts/brand-docs work deferred from PR #69
- **`archive/pr-58-codex-services-phase-1-2026-05-08`** (local branch) — 3 unpushed commits (1 merge + 2 security) from May 8 cycle
- **Tag `v-homepage-redesign-2026-05-12`** (origin) — PR #69 squash anchor

# Appendix B — Phase 1 entry criteria

Phase 1 can begin when:

- [ ] User approves this Phase 0 plan (read sign-off)
- [ ] User locks doc-reconciliation decisions (§3 DESIGN.md duplicate handling)
- [ ] User locks content-storage decision (§5 — TS modules recommended; alternatives Sanity / MDX)
- [ ] User locks `/frameworks/applied-intelligence-systems` retirement path (§8 risk 5)
- [ ] User decides Phase 1.0 execution scope — recommended as the first dispatched task; everything else gates on it
- [ ] **(Strongly recommended)** Live security remediation on `VERCEL_ENV_SETUP.md` either completed or formally deferred with risk acknowledgment

# Appendix C — Strategy v1.5.1 cross-reference gaps

Places this plan would have benefited from direct cross-reference against the full strategy v1.5.1 doc (not reachable from this session — canonical reference card used as authoritative substitute):

1. **Signal-maturity qualification criteria specifics** — reference card says "qualified on signal-maturity criteria, NOT hard ARR bands" but doesn't enumerate the actual signal-maturity criteria. Phase 1.0 PRD authoring needs these.
2. **ASI (Affective Systems Intelligence) definition** — listed in framework hierarchy but no definition in reference card. Phase 1.4 acronym authoring needs this (ASI may also be a framework page in a later sprint).
3. **EPM (Emotional Predictive Marketing) scope** — listed in framework hierarchy but no scope/positioning in reference card.
4. **Business Diagnostics layer scope** — final node in framework hierarchy; reference card doesn't explain whether this is a single framework or an umbrella term for multiple diagnostics.
5. **All 20+ acronyms (reference card lists 13 — ACI, ACIx, AID, AIG, ASA, CAPS, EPM, HAI, IPT, MSEE, PAS, PRA, PR)** — strategy mentions "20+" total. The remaining 7+ are not in the reference card; Phase 1.4 may discover more.
6. **Rekonr positioning** — reference card mentions doctrine line is required on "Rekonr positioning" surfaces; the actual Rekonr scope/integration isn't defined here.
7. **Speed-to-Lead Benchmark target metric** — what's the actual industry-typical baseline and the AJ aspirational target?
8. **AEO target metrics** — what specific LLM-traffic-share goals exist for v1.6?
9. **Layer-split edge cases** — Signal Audit appears in the Operational layer (founder-facing tool) but Signal Audit Framework is a methodology — does the framework page sit on the Operational or Theoretical side?
10. **§0.8 character/length targets** — what's the target word count for Founder TL;DR, Why It Matters, Operational Interpretation, etc.? Doctrine line implies tight, but Phase 1.2 template needs numeric guidance.

Phase 1.0 codification of strategy v1.5.1 in-repo (deliverable §9 item 7) is the natural moment to fill these gaps.

---

*End Phase 0 implementation plan. No code changes made in this phase. Next deliverable: Phase 1.0 dispatch — foundation docs with the Audio Jones Permanent Doctrine Line at the top of each.*
