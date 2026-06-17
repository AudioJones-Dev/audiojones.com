---
title: AJ Digital — Canonical Offer Ratification Proposal
status: proposal-awaiting-approval
version: v0.1
date: 2026-06-17
owner: AJ Digital LLC
approver: Audio (founder) — approval required before any implementation
companion: docs/strategy/AUDIOJONES_DOCTRINE_ALIGNMENT_AUDIT.md (PR #174)
scope: docs-only — no website copy, components, or config changed
supersedes-on-approval: docs/sop/offer-ecosystem/* (see §6)
---

# AJ Digital — Canonical Offer Ratification Proposal

> **Purpose.** PR #174 found that AudioJones.com is running **three
> non-aligned offer models at once**. This document proposes a **single
> canonical offer model** — built from the current AJ Digital pricing
> doctrine — and asks Audio to ratify it. It is **docs-only**: it changes
> no website copy, components, or configuration. Nothing should be built
> until the decisions in §8 are approved.

> **Why this exists.** The audit (PR #174) scored doctrine alignment at
> **54/100**, with the offer layer as the single largest failure: 6 of the
> 7 doctrine offers are not named anywhere on the site, and the surfaces
> that *do* describe offers (`/services`, `/agents`, `/ecosystem`,
> `/pricing`) contradict each other. A reviewer/visitor currently gets a
> different answer to "what do you sell" on every page. This proposal
> resolves that — on paper, for approval — before any code is touched.

---

## 1. Decision requested

Audio is asked to approve, amend, or reject:

1. **The canonical offer ladder** (§3) as the single source of truth.
2. **The crosswalk** (§4) that maps every current site asset into it.
3. **Deprecation of the competing models** (§6): the repo SOP
   `docs/sop/offer-ecosystem/*` and the duplicate product catalogs.
4. **The naming/qualifier rules** (§7).
5. **The specific open questions** (§8) that this proposal cannot decide
   for you (pricing, which products survive, vertical wedge).

No website work begins until §8 is signed off.

---

## 2. The conflict being resolved (recap from PR #174)

| Model | Where it lives today | Offer language |
|---|---|---|
| **A — Pricing Doctrine** *(proposed canonical)* | AJ Digital pricing doctrine / audit brief | Founder Intelligence Systems · AI Operations Audit · System Architecture & Blueprint · Custom Application Builds · AI Agent Builds · AI Receptionist Builds · Managed Intelligence Retainers |
| **B — Repo SOP** *(repo-canonical, conflicting)* | `docs/sop/offer-ecosystem/*` + `/ecosystem` page | 5 tiers: Free Lead Gen → Paid Diagnostics → Workshops/Agent OS → Retainer. Agent OS = ResponseOS, ReKonr OS, PodcastOS, Founder Intelligence System |
| **C — Site as built** | `/services`, `/pricing`, `/agents` | 4 "engagement paths" + ResponseOS Starter/Core/Pro SaaS tiers + "Founder Intelligence System" custom + Strategic Advisory + Performance Partnership; `/agents` adds SignalOS, ContentOS, ClientOS, SalesOS |

**This proposal adopts Model A as canonical** and folds B and C into it.

---

## 3. Proposed canonical offer ladder

Founder Intelligence Systems is the **umbrella category** (always qualified
"for founder-led service businesses" — see §7). Beneath it, a five-stage
value ladder containing the seven doctrine offers:

```
UMBRELLA — Founder Intelligence Systems (for founder-led service businesses)

  TIER 0 · Free demand capture
    • Free scorecard / readiness check          (one entry asset)

  TIER 1 · Paid prescription
    • AI Operations Audit                        ← paid, decision-ready diagnosis

  TIER 2 · Architecture
    • System Architecture & Blueprint            ← the build plan the Audit prescribes

  TIER 3 · Builds (the money offers)
    • Custom Application Builds
    • AI Agent Builds
    • AI Receptionist Builds

  TIER 4 · Recurring
    • Managed Intelligence Retainers             ← post-install operating layer
```

**Doctrine logic (why this order):** demand before prescription
(scorecard → Audit), prescription before build (Audit → Blueprint), build
before retainer (Builds → Managed Retainer). This preserves the SOP's
strategic truths ("diagnostic prescribes, install solves, retainer
compounds") while replacing its product names with the doctrine's offers.

---

## 4. Crosswalk — every current asset → canonical offer

> No asset is orphaned; nothing is wasted. This shows what each existing
> surface *becomes* under the canonical model. (Reference only — no code
> changes in this PR.)

| Current site asset | File / surface | Maps to canonical offer | Action on approval |
|---|---|---|---|
| AI Readiness Score (free) | `/pricing`, `/ai-readiness-diagnostic` | Tier 0 — Free scorecard | Keep; make the one canonical free entry |
| Founder Gravity Audit | `/founder-gravity-audit` | Tier 0 — Free scorecard | Consolidate into the single free entry (or retire) |
| AI Business Systems Diagnostic | `/services` | **AI Operations Audit** | Rename to the canonical offer |
| Revenue Leak Diagnostic ($1,997) | `/pricing` | **AI Operations Audit** (paid tier) | Fold into AI Operations Audit pricing |
| Attribution + Signal Audit | `/services` | **AI Operations Audit** (module) | Fold in as an audit lens |
| AI Readiness Kaizen Diagnostic ($3,500) | `/pricing` | **AI Operations Audit** (deep tier) | Fold in as the deep audit tier |
| — (only a phrase: "Blueprint or Agent OS") | `/ecosystem` | **System Architecture & Blueprint** | **Create offer + page (missing today)** |
| AI Agent Workflow Design | `/services` | **AI Agent Builds** | Upgrade "design" → "build" |
| ResponseOS (+ Starter/Core/Pro) | `/agents/responseos`, `/pricing` | **AI Receptionist Builds** | Re-frame ResponseOS as the named receptionist build |
| Founder Intelligence Systems Buildout | `/services` | Umbrella / multi-build engagement | Keep as the flagship umbrella engagement |
| Strategic Advisory (from $2,000/mo) | `/pricing` | **Managed Intelligence Retainers** | Rename/elevate |
| Retainer / Optimization (stage) | `/ecosystem` | **Managed Intelligence Retainers** | Same offer, canonical name |
| — | — | **Custom Application Builds** | **Create offer + page (missing today)** |
| SignalOS, ContentOS, ClientOS, SalesOS | `/agents`, `src/data/audiojones-design.ts` | *(no canonical mapping)* | **Decide: retire or re-cast as build templates (§8 Q3)** |
| ReKonr OS, PodcastOS | `/ecosystem` ("in development") | *(no canonical mapping)* | **Decide: retire or hold as future builds (§8 Q3)** |
| Workshops | `/workshops` | Top-of-funnel (supports Tier 0/1) | Keep as funnel support, not a ladder rung |
| Performance Partnership | `/pricing` | Variant of Managed Retainer | Keep as application-only retainer variant |

**Result:** all seven doctrine offers get a home; two offers (System
Architecture & Blueprint, Custom Application Builds) are net-new and must be
created; the orphaned "OS" products require an explicit keep/retire decision.

---

## 5. Pricing posture (only what is already public; nothing invented)

This proposal does **not** set new prices. It records what the site already
publishes and flags where the doctrine needs a number Audio must supply.

| Canonical offer | Existing public price (from `/pricing`) | Proposal |
|---|---|---|
| Free scorecard | Free | Keep free |
| AI Operations Audit | $1,997 (Revenue Leak) / $3,500 (Kaizen) | Pick one canonical audit price or a 2-tier structure — **§8 Q4** |
| System Architecture & Blueprint | *none published* | **Price to be set — §8 Q4** |
| Custom Application Builds | *none published* | **Scope/price to be set — §8 Q4** |
| AI Agent Builds | *none published* | **Price to be set — §8 Q4** |
| AI Receptionist Builds | $397 / $797 / $1,297 /mo (ResponseOS) | Carry over if ResponseOS = receptionist build — **§8 Q4** |
| Managed Intelligence Retainers | from $2,000/mo (Strategic Advisory) | Carry over or revise — **§8 Q4** |
| Founder Intelligence Systems (umbrella) | Custom, "$5,000–$25,000+" | Keep as custom multi-build engagement |

---

## 6. Supersession — what this deprecates on approval

- **`docs/sop/offer-ecosystem/*`** (Model B) is currently marked
  `status: canonical`. On approval, it should be **superseded** by this
  ratified model and either (a) re-tagged `status: superseded` with a
  pointer here, or (b) rewritten to the canonical ladder. **Recommendation:
  re-tag as superseded** to preserve history; do not silently delete a
  doc another process treats as canonical. — **§8 Q2**
- The **duplicate product catalogs** (`/agents` 6-OS list vs `/ecosystem`
  4-OS list) collapse into the single canonical ladder; one of the two
  pages becomes canonical and the other 301-redirects (implementation, not
  this PR).

> ⚠️ I am flagging — not executing — the supersession of a repo-canonical
> SOP. That is an architecturally significant change and is explicitly an
> approval item (§8 Q2), not something this docs PR enacts.

---

## 7. Naming & qualifier rules (from the corrections doc)

Carried over from `docs/strategy/AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md`
so the canonical model is born compliant:

1. **"Founder Intelligence Systems"** always qualified **"for founder-led
   service businesses"** in public copy (Accenture "Founders Intelligence"
   collision).
2. **M.A.P** — no acronym-first; spell out **"Measurement · Attribution ·
   Prediction"** verbatim. (Note: the site currently expands it as
   "Meaningful. Actionable. Profitable." — these must be reconciled; **§8 Q5**.)
3. **Retire the `$250K–$5M ARR` band** from public copy; use signal-maturity
   framing.
4. **Retire the stale "AIS" short title** for Founder Intelligence Systems.
5. SAFE claims (95% pilots, 62% calls, etc.) only with linked primary
   sources; REMOVE-class claims never published.

---

## 8. Open decisions for Audio (approval gate)

This proposal cannot answer these — they are yours:

- **Q1 — Adopt Model A as canonical?** ☐ Approve ☐ Amend ☐ Reject
- **Q2 — Supersede the repo SOP (`docs/sop/offer-ecosystem/*`)?**
  ☐ Re-tag as superseded (recommended) ☐ Rewrite to canonical ☐ Keep both ☐ Other
- **Q3 — The orphaned "OS" products** (SignalOS, ContentOS, ClientOS,
  SalesOS, ReKonr OS, PodcastOS): ☐ Retire ☐ Re-cast as build templates
  under AI Agent / Custom App Builds ☐ Hold as roadmap
- **Q4 — Pricing** for the offers with no public number (Blueprint, Custom
  App, AI Agent, and confirmation that ResponseOS tiers = AI Receptionist
  Build pricing): _Audio to supply._
- **Q5 — M.A.P expansion:** ☐ "Measurement · Attribution · Prediction"
  (corrections doc) ☐ "Meaningful · Actionable · Profitable" (current site)
  — these conflict; pick one.
- **Q6 — Vertical wedge:** the corrections doc names
  accessibility / home-modification / aging-in-place as the primary wedge.
  ☐ Lead with the wedge ☐ Keep horizontal "founder-led service businesses"
- **Q7 — Canonical "what we sell" page:** ☐ `/services` ☐ `/ecosystem`
  ☐ new `/offers` — which one survives; the others redirect.

---

## 9. Non-goals (what this proposal explicitly does NOT do)

- Does **not** change any website copy, component, route, or config.
- Does **not** set prices it cannot source from the existing site.
- Does **not** delete or rewrite the SOP — only proposes supersession.
- Does **not** build the two missing offer pages.
- Does **not** decide the vertical wedge or product retirements.

---

## 10. Sequencing AFTER ratification (informational)

Once §8 is approved, implementation proceeds as **separate scoped PRs**
(each docs-or-code, draft-first), in this order:

1. Re-tag/supersede SOP (Q2) + write the canonical model into `docs/`.
2. Offer-page renames on `/services` + `/pricing` (Audit, Builds, Retainer).
3. Reconcile `/agents` ↔ `/ecosystem` product line; 301 the non-canonical one.
4. Create the two missing offer pages (Blueprint, Custom Application Builds).
5. Naming/qualifier sweep (FIS qualifier, M.A.P, ARR band, "AIS").
6. Proof: replace placeholder case studies; activate the Sanity blog.

None of these run until Audio signs §8.
</content>
