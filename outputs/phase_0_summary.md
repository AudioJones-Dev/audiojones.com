---
title: "Phase 0 — Quick-Scan Summary"
generated: "2026-05-12"
full_plan: "outputs/phase_0_audiojones_implementation_plan.md"
ground_truth: "canonical reference card from Phase 0 dispatch (strategy v1.5.1 doc not reachable from this session — gaps flagged in Appendix C of full plan)"
---

> ## Complexity exists in the architecture.
> ## Not in the reading experience.

# Phase 0 — Quick Scan

## 5 highest-priority gaps

1. **All 5 mandatory v1.6 docs are missing or duplicated.** `AGENTS.md`, `CLAUDE.md`, `docs/PRD.md`, `docs/ROADMAP.md` — none exist. `DESIGN.md` exists in **four** locations: canonical `docs/design/DESIGN.md` (29,840 b), stale `docs/DESIGN.md` (8,479 b), untracked root `AUDIOJONES_DESIGN.md` (30,341 b — May 11 v2 draft), and untracked root `DESIGN.md` (19,944 b earlier variant). Until Phase 1.0 lands the five with the doctrine line at top and reconciles the four-way DESIGN.md drift, no other v1.6 work has a stable operating-rules baseline.

2. **No acronym / glossary subsystem exists.** Zero `/glossary` routes, zero acronym content store, zero `<AcronymPageTemplate>`. v1.6 needs 11+ acronym definition pages (ACI, ACIx, AID, AIG, ASA, CAPS, EPM, HAI, IPT, MSEE, PAS, PRA, PR per the reference card; "20+" total per strategy). All scaffolding is greenfield.

3. **No §0.8 framework page template exists.** The 4 existing `/frameworks/*` sub-pages (`applied-intelligence-systems`, `map-attribution`, `niche-framework`, `signal-vs-noise`) almost certainly don't follow the §0.8 nine-step structure (H1 → Founder TL;DR → Why It Matters → Operational Interpretation → Technical Definition → Framework Relationships → Business Application → Related Terms → FAQ). The 5 Sprint 1 framework pages need a new `<FrameworkPageTemplate>`.

4. **Brand vocabulary state contradicts v1.5.1 lock** — three sweeps needed:
   - **Public-only:** Applied Intelligence Systems / AIS → Founder Intelligence Systems™ / FIS™ (PUBLIC mentions only; internal AIS retained as methodology vocabulary)
   - **Global:** Signal Theory → Signal Doctrine (everywhere — code, docs, copy, schema)
   - **Public + global:** M.A.P. "Meaningful + Actionable + Profitable" → "Measurement + Attribution + Prediction"
   
   Plus `/frameworks/applied-intelligence-systems` route disposition decision (redirect / banner / rename).

5. **Live security exposure in `VERCEL_ENV_SETUP.md`.** Git-tracked, contains a real Firebase service account private key + (already-rotated) Whop API key. Until the file is purged from git history AND the Firebase service account is revoked in Google Cloud Console, the Firebase credential remains compromised. **Recommended remediation BEFORE Phase 1 work starts** — every contributor cloning the repo gets the live key.

## 3 biggest risks

1. **AIS public-copy sweep miss rate.** "Applied Intelligence Systems" / "AIS" likely lives in 50+ places (components, copy, schema, OG tags, docs). The public/internal distinction makes the sweep harder than a blanket replace — ambiguous-context matches need manual categorization. Requires comprehensive multi-pattern grep + manual review + automated audit script + AGENTS.md rule defining the boundary.

2. **M.A.P. redefinition collides with already-published external content.** The current public framing ("Meaningful + Actionable + Profitable") likely exists in LinkedIn posts, podcast notes, OG images, social collateral. Rewriting to "Measurement + Attribution + Prediction" needs an external-mention inventory before the rewrite — otherwise v1.6 contradicts the user's own historical positioning.

3. **Acronym page quality at scale.** 11 acronym pages × 9-step §0.8 structure = 99 content units. Doctrine-line drift across that volume is the most likely failure mode. Requires Phase 1.2 to build a constraining template + human review pass on the first 2-3 pages before authoring the remaining 8-9.

## Recommended Phase 1 scope (one specific scoped task)

### **Phase 1.0 — Foundation docs** (docs-only, single PR)

Author the 5 mandatory v1.6 docs with the Audio Jones Permanent Doctrine Line at the top of each, AND reconcile the existing DESIGN.md duplicates, AND codify strategy v1.5.1 in-repo.

**Deliverables in the PR:**
1. `AGENTS.md` (root) — doctrine line at top + agent operating non-negotiables (no Firebase, no public AIS, doctrine compliance, §0.8 mandatory for definitions, NeonDB-only persistence, Resend-only email, mobile-first, real iPhone Safari production-mode QA on conversion paths, native HTML controls for lead-capture critical paths, Audio Jones / AJ Digital LLC brand identity boundaries)
2. `CLAUDE.md` (root) — doctrine line at top + Claude operating principles + session memory pointers + Phase 0 doc as baseline + strategy v1.5.1 link + WIP-snapshot-preservation pattern from this session
3. `docs/PRD.md` — doctrine line at top + v1.6 PRD (Founder Operator Under Cognitive Load persona, framework hierarchy, layer split, Sprint 1 build order, acronym ontology, AEO targets, Speed-to-Lead Benchmark, MAP-aligned measurement)
4. `docs/ROADMAP.md` — doctrine line at top + phased v1.6 → v1.7+ roadmap with milestone gates anchored to Phase 0
5. Update `docs/design/DESIGN.md` (canonical) — doctrine line at top, FIS™ public brand, Signal Doctrine global rename, M.A.P. redefinition, AJ Digital LLC `legalName` schema note, layer split context
6. **Reconcile DESIGN.md duplicates** — delete or pointer-redirect `docs/DESIGN.md`; decide root `AUDIOJONES_DESIGN.md` (merge or park as DRAFT-v2); likely delete root `DESIGN.md` (stub)
7. **Codify strategy v1.5.1** at `docs/strategy/audiojones-strategy-v1.5.1.md` as the in-repo single source of truth (filling cross-reference gaps from Appendix C of the full plan where possible)

**Why this scope:** Phase 1.0 blocks every other v1.6 phase. Until agent rules exist, every subsequent task risks drift from doctrine, brand split, §0.8 structure, no-Firebase rule, iPhone QA gate.

**Out of scope for Phase 1.0:** any code changes, copy sweeps, new pages, schema changes.

**Suggested delivery:** single PR — `docs/phase-1-0-foundation-docs-2026-05-12` — opens as draft, user reviews each doc, marks ready, admin squash-merge per established pattern.

**Pre-flight gate (strongly recommended):** complete `VERCEL_ENV_SETUP.md` remediation (rotate Firebase service account, purge from git history) BEFORE Phase 1.0 ships.

---

## Phase 0 cleanup confirmation

- ✅ Files written: exactly 2, both in `outputs/`
- ✅ Zero code changes
- ✅ Zero modifications outside `outputs/`
- ✅ Zero git commits, pushes, merges, deploys
- ✅ All preserved recovery branches (`wip/full-snapshot-2026-05-12`, `archive/pr-58-codex-services-phase-1-2026-05-08`) untouched
- ✅ Production at `https://audiojones.com` untouched (post-PR #69 state preserved)

Awaiting user sign-off on Phase 1.0 scope before any further action.
