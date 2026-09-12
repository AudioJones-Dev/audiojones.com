# DECISIONS.md — AudioJones.com decision log

A lightweight architecture decision record (ADR) log. Each entry is
short, dated, and immutable once accepted. Supersede with a new entry
rather than rewriting an old one.

Format:

```
## YYYY-MM-DD — short title
Status: proposed | accepted | superseded | rejected
Decision: …
Rationale: …
Consequences: …
```

---

## 2026-04-29 — Drop Firebase from AudioJones.com

**Status:** accepted
**Decision:** AudioJones.com runs on Cloudflare → Vercel/Next.js →
Sanity → NeonDB → Resend → n8n, with Supabase added only when auth /
storage / realtime is genuinely required. Firebase (and any
`FIREBASE_*` / `NEXT_PUBLIC_FIREBASE_*` env keys) is intentionally
excluded.

**Rationale:** the site's responsibilities — marketing pages, SEO/AEO,
lead capture, transactional email, lightweight automation — are fully
covered by the stack above without overlap. Firebase added duplicate
hosting, duplicate functions, duplicate storage, and duplicate
Postgres-class storage without adding capability for this specific
site. Firebase Studio is also being sunset on 2027-03-22, which made
the dependency strictly worse over time.

**Consequences:**
- A `pnpm check:no-firebase` guardrail fails CI if Firebase imports,
  packages, or env keys are reintroduced.
- The legacy `/portal/*` and `/api/admin/*` routes that depended on
  Firebase Admin remain in the codebase as a phase-out queue, not as a
  development surface. New admin needs go to a separate application.
- A typed shim (`src/lib/legacy-stubs.ts`) keeps unmigrated tooling
  type-checking until it is removed.

Full context: [`docs/architecture/stack-decision.md`](./architecture/stack-decision.md).

---

## 2026-04-29 — NeonDB as the lead store

**Status:** accepted
**Decision:** Founder Intelligence diagnostic leads and other
structured marketing data persist to NeonDB (Postgres). Sanity remains
the CMS for unstructured/long-form content.

**Rationale:** Neon gives us a real Postgres with branching for
preview environments, low operational overhead, and clean separation
from the CMS surface.

**Consequences:**
- Schema lives in `db/migrations/` (canonical:
  `db/migrations/001_applied_intelligence_leads.sql`).
- Lead capture handlers must persist to Neon **before** firing
  optional integrations (Resend, n8n) so we never lose a lead to a
  downstream outage.

---

## 2026-04-29 — Resend for transactional email; n8n is optional

**Status:** accepted
**Decision:** Internal lead notifications go through Resend
(`RESEND_API_KEY` + `LEAD_NOTIFICATION_EMAIL`). The n8n webhook is
optional and best-effort.

**Rationale:** keeps the critical path short and observable. Email
delivery is a Resend dashboard problem; workflow orchestration is an
n8n problem. They don't block each other.

**Consequences:** lead capture handlers must not let n8n failures
short-circuit the response.

---

## 2026-05-15 — Documentation readiness bootstrap

**Status:** accepted
**Decision:** Establish `AGENTS.md`, `CLAUDE.md`, and a canonical
`docs/` hierarchy (`PRD.md`, `DESIGN.md`, `ROADMAP.md`,
`SECURITY.md`, `DEPLOYMENT.md`, `DECISIONS.md`, `CHANGELOG.md`).
Older root-level and duplicated docs become one-line redirect stubs
pointing at the canonical files.

**Rationale:** the repo accumulated parallel documents
(`AUDIOJONES_DESIGN.md` + `docs/design.md`, root `DEPLOYMENT.md` +
`VERCEL_ENV_SETUP.md` + `docs/VERCEL_ENV_SOP.md`, `docs/env.example` +
`docs/env/env-template.md`). Without one source of truth, AI agents
and humans both end up reading stale material.

**Consequences:**
- New work updates the canonical docs only.
- Stub files remain so existing inbound links don't 404 in editors,
  but they carry no content beyond a redirect line.
- Future docs follow the same pattern: one canonical home, stubs
  elsewhere if needed.

---

## 2026-06-07 — Canonical design system path

**Status:** accepted
**Decision:** `docs/design/DESIGN.md` is the canonical design-system and
brand-voice source of truth. `docs/DESIGN.md` remains as a redirect stub for
older links. The tracked lowercase `docs/design.md` duplicate is removed from
Git because it case-collides with `docs/DESIGN.md` on Windows checkouts.

**Rationale:** newer implementation briefs already depend on
`docs/design/DESIGN.md`, and that file contains the current v2 design system.
Keeping both `docs/DESIGN.md` and `docs/design.md` tracked as separate files
creates an unstable working tree on case-insensitive filesystems.

**Consequences:**
- Agents should read `docs/design/DESIGN.md` before UI or voice work.
- Existing `docs/DESIGN.md` links still resolve to a redirect stub.
- Do not re-add `docs/design.md`; use `docs/DESIGN.md` only as the legacy
  redirect path.

---

## 2026-06-08 — Canonical public host is www.audiojones.com

**Status:** accepted
**Decision:** Default public SEO URLs use `https://www.audiojones.com`.
Sitemap, robots, page metadata, and JSON-LD should resolve through the shared
site URL helpers instead of hardcoded non-www URLs. A legacy exact
`https://audiojones.com` `NEXT_PUBLIC_SITE_URL` value is normalized to the
www host.

**Rationale:** the site audit found sitemap URLs resolving through the
non-www to www redirect path. Canonical URLs should match the final production
destination to avoid avoidable redirect hops and mixed host signals.

**Consequences:**
- `NEXT_PUBLIC_SITE_URL` can still override the host per environment, except
  the exact non-www production host is normalized to the final www host.
- The default fallback host is now `https://www.audiojones.com`.
- Retired `/book` remains handled by the existing permanent redirect to
  `/book-a-call`; robots must not block the live `/book-a-call` path.

---

## 2026-08-12 — Sell the pain first; keep the frontier internal

**Status:** accepted
**Decision:** Public surfaces lead with the buyer's problem and its economic
cost. Concretely: the `h1` is problem-anchored, and the sections that explain
the category and the system architecture come after the proof rather than
before it. This governs the narrative order and the headline — not the
category label itself, which still appears as the hero eyebrow, verbatim and
qualified, per the naming rules and
[`docs/codex/responseos-v1-brief.md`](./codex/responseos-v1-brief.md) §6
("the H1 is problem-anchored, not category-anchored").
The long-horizon thesis — machine-readable operating models,
agentic business operations — stays in `docs/strategy/` and is not published
as page copy, product naming, or metadata. Canonical statement:
[`docs/strategy/AJ_DIGITAL_S_CURVE_POSITIONING.md`](./strategy/AJ_DIGITAL_S_CURVE_POSITIONING.md).

**Rationale:** the homepage opened on a category, then an abstract
signal-vs-noise taxonomy, then the flagship system, and only then the
economic cost — asking a visitor to understand the architecture before
feeling the problem. `HomeFaqSection.tsx` already encoded the correct rule
in a code comment ("leads with what the business does in everyday terms,
then names the framework"); the page as a whole did not follow it. The
frontier thesis is real but has no fundable buyer today, so it is funded by
the commercial wedge rather than sold alongside it.

**Consequences:**
- Homepage section order is pain → economic cost → diagnosis → proof →
  system → architecture. New homepage sections must state which beat they
  serve.
- New product ideas are subject to the portfolio filter in
  `AJ_DIGITAL_S_CURVE_POSITIONING.md` §4; capability alone is not a reason
  to build.
- "business graph" / "business memory" / "persistent business memory" stay
  descriptive concepts, never branded product names (entity-collision risk
  per `AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md` §2).
- **This decision does not resolve the offer ladder.**
  `AJ_DIGITAL_CANONICAL_OFFER_RATIFICATION_PROPOSAL.md` §8 Q1–Q7 remain
  open, and no offer name, price, tier, or route changed here.

## 2026-07-31 — Diagnostic-led public pricing enters controlled testing

**Status:** accepted for controlled testing; preview QA approved; merge and production publication require separate Audio approval
**Decision:** The public pricing model follows diagnosis → evidence-supported
implementation → managed improvement → controlled expansion. ResponseOS is a
managed Revenue Recovery System, not a self-service receptionist subscription.
All numerical prices are starting-price hypotheses with internal status
`Testing`; provider usage is separate; no outcome fee, success fee,
recovered-revenue percentage, or guarantee is publicly offered.

**Rationale:** AJ Digital's delivery responsibility includes diagnosis,
workflow design, integration, data quality, attribution, implementation,
monitoring, support, and optimization. Commodity software tiers obscure that
scope before repeated delivery has established standardization, support burden,
margin, retention, and low founder dependence.

**Consequences:**
- `src/content/pricing.ts` is the public offer/price source for `/pricing` and
  its structured data and CTA event contract.
- Pricing evidence remains governed by
  [`docs/strategy/PRICE_VALIDATION_LEDGER.md`](./strategy/PRICE_VALIDATION_LEDGER.md).
- The prior public prices and terminology are reconciled in
  [`docs/strategy/PRICING_OFFER_RECONCILIATION_2026-07-31.md`](./strategy/PRICING_OFFER_RECONCILIATION_2026-07-31.md).
- Public starting prices, directional ICP wording, public ResponseOS detail,
  unsupported-claim disposition, evidence ownership, the review trigger, and
  internal `Testing` status were ratified by Audio on 2026-07-31.
- The ReKonr diagnostic is independently deliverable and is not automatically
  credited toward implementation; revisit after three comparable paid ReKonr
  engagements.
- Audio owns claim and publication approval; AJ Digital Ops maintains the
  engagement evidence register.
- The existing automatic preview is approved for human QA only. Merge and
  production deployment remain separate `proceed` gates.

---

## How to add an entry

1. Append to the bottom of this file with today's date.
2. Use the four-field format above.
3. If the new decision supersedes an older one, mark the older entry
   `superseded by YYYY-MM-DD — short title` instead of deleting it.
4. Keep entries to a screen or less. Link out for detail.

---

## 2026-08-31 — Preview deploys skip the Vercel build cache

**Status:** accepted
**Decision:** `deploy_preview` passes `--force` to `vercel deploy`, discarding
the restored build cache and installing clean on every preview. Production
(`deploy`) is unchanged and still uses the cache.

**Context:** Vercel restores `node_modules` from a previous deployment and runs
an incremental `pnpm install` over it. When a PR changes a dependency's
resolved version, that tree can end up incoherent with the lockfile. On #193 it
produced `Module not found: Can't resolve 'protobufjs/minimal'` for four
different `protobufjs` values while the one version already in the cache built
fine — a non-monotonic result that no version-compatibility explanation fits.
Clean installs of every version tested build successfully. See #219.

**Consequences:**
- Preview deploys are slower; correctness is the point of the job.
- Dependency PRs are validated against the tree their lockfile actually
  describes, not against whatever the last deployment left behind.
- Production deploys still build over a cache and remain exposed to the same
  failure mode after a dependency change merges. Left unchanged deliberately —
  prod deploy time is a separate tradeoff and should be decided on its own.
- A green `deploy_preview` on a dependency PR now means something. A green
  `smoke_preview` still does not (#216).

---

## 2026-09-08 — audiojones.com DECISIONS.md is the register of record for commercial pricing

**Status:** accepted

**Decision:** This file is the register of record for commercial pricing and
offer decisions across AJ Digital properties. The AJ Digital Master Pricing
Matrix (`aj-digital-revops/docs/commercial/`) is the commercial-architecture
working source — offer inventory, corridors, targets, catalog governance,
proposals — and conforms to decisions ratified here.

Tie-break: where the published registry (`src/content/offers.ts`) and the
matrix disagree, neither silently wins. The divergence is recorded as a `C-`
entry in the offer crosswalk and stays open until ratified here.

**Context:** Both documents claimed canonical status without qualifying the
domain. The 2026-07-31 decision retiring the productized ResponseOS tiers was
ratified and shipped here, but the matrix carried the retired
$397 / $797 / $1,297 rows unchanged through v1.0, v1.1 and v1.2, labelled
"Previously established" — a label that predates this decision and never
registered it. Five weeks of undetected drift, because no rule said which
trail governed and nothing mapped the two offer taxonomies to each other.

`aj-digital-revops/docs/decision-register.md` claims no primacy; it is scoped
to the HubSpot catalog provisioning run and remains so.

**Consequences:**
- The matrix header drops "pricing governance" from its canonical claim and
  states that it conforms to decisions ratified here.
- A ratified decision is propagated to both the registry and the matrix in the
  same change, or logged as an open `C-` conflict in the crosswalk.
- Publication, merge, and HubSpot provisioning gates are unchanged. This
  decides where decisions are recorded, not who approves them.
- Nothing is retroactively re-decided. Prior ratifications stand.

## 2026-09-09 — Remove the legacy local Whop catalog

**Status:** accepted for local implementation by explicit owner instruction, "Remove whop catalogue".

Remove `data/catalog/services_pricing_catalog.json`, its `src/lib/getPricing.ts`
helper, and the local fallback in both legacy Whop webhook routes. This
supersedes the catalog-retention requirement in the 2026-09-01 offer-map and
search implementation redlines. Those documents remain historical records.

An unmatched legacy SKU now has no local pricing mapping. This decision does
not supply replacement prices or retire the underlying service families.
The public offer registry, approved commercial pricing, HubSpot catalog, and
Whop account products and billing are unchanged. Existing webhook routes and
their legacy persistence path are not repaired or certified by this removal.
No deployment or external account change is authorized by this decision.

## 2026-09-12 — Managed Business Memory carries a $4,000/month minimum for dedicated deployments

**Status:** proposed — drafted into the register, **not accepted**. Acceptance is Audio's. No propagation to the published offer registry or to the pricing matrix may occur before it, and no proposal may quote these terms until then.

**Decision (proposed):** Managed Business Memory (matrix M5) carries two commercial targets rather than one — $2,500/month for managed multi-tenant deployments, and a $4,000/month minimum for managed dedicated deployments, with heavier deployments moving toward the $5,000+ end of the established corridor.

**Context:** M5's ratified corridor in `AJ-Digital-Master-Pricing-Matrix-2026-v1.3` is $1,500–$5,000+ with a target of $2,500/month. The $4,000 minimum sits inside that corridor and contradicts no ratified figure. What it changes is the *shape* of the row: a single target becomes a target plus a minimum indexed by deployment model, which is why it is recorded here rather than treated as an operating detail.

The figure derives from measured unit economics. Managed dedicated carries a metered envelope of $450/month/tenant (model and inference $250, transcription $125, storage and egress $75), five support hours, and a separately tracked dedicated platform baseline of roughly $250. At $4,000 that is approximately $2,800 contribution, or 70%. Multi-tenant at $2,500 against a $275 envelope and four support hours is $1,825, or 73%. Pricing dedicated tenancy as though it cost the same as shared tenancy is what the minimum exists to prevent.

**Propagation.** The 2026-09-08 rule requires a ratified decision to propagate to the published registry and the matrix in the same change, or be logged as an open `C-`. Two facts prevent a single change here, and both are stated rather than worked around:

1. The matrix lives in `aj-digital-revops`, a separate repository, so no single change can span both. If this is accepted and the matrix update does not land alongside it, a temporary `C-` opens in the crosswalk and stays open until it does.
2. The registry target is `managed-intelligence` in `src/content/offers.ts`, which today shows `From $2,500/month` with `evidenceStatus: "unratified"`. Its own comment records that the reconciliation gate "requires naming the exact managed service and its installed-system prerequisite before this can be placed; today the name spans several matrix scopes." That is crosswalk entry **C-3**, open. **This decision cannot reach the registry until C-3 resolves to M5.**

On acceptance *and* C-3 resolution, the registry edit is: `managed-intelligence` gains a dedicated-deployment price alongside the multi-tenant display, and `evidenceStatus` flips from `unratified`. Those edits are client-facing and are deliberately not made by this entry.

**Consequences:**

- Client-owned dedicated deployments remain **unpriced**. That model carries four AJ-funded support hours — roughly $400/month at internal cost — and no monthly minimum, so its margin cannot be computed. It should not be quoted until a minimum is set.
- A fifth internal accounting field, `dedicated_platform_cost`, is tracked per tenant alongside the four customer-facing ceilings. Without it a managed-dedicated tenant reads as profitable while its isolated database, compute, auth, observability and deployment footprint consumes the margin.
- This decision prices a deployment model. It does not authorize one, and it does not resolve which matrix row the `managed-intelligence` offer maps to.

---

## 2026-09-12 — Managed Business Memory is a 12-month commitment billed monthly

**Status:** proposed — drafted into the register, **not accepted**. Acceptance is Audio's. No propagation to the published offer registry or to the pricing matrix may occur before it.

**Decision (proposed):** M5 is sold on a 12-month initial commitment, billed monthly. The $30,000/year already carried beside the $2,500/month target is ratified as the **committed recurring service value** — not an annualized illustration, and not the total contract value, because implementation is separately priced one-time work above it.

After the initial term the agreement converts to month-to-month unless the applicable agreement specifies another renewal term or either party gives non-renewal notice. **The notice period is 30 days.** Cancellation for convenience during the initial commitment does not eliminate amounts committed for the remaining term unless AJ Digital agrees otherwise in writing; termination for breach, nonpayment, security concerns or other cause remains governed by the applicable agreement. Usage overages reconcile **monthly, never annually**.

**Context:** The matrix already carries $30,000/year against a $2,500/month target, which implies an annual commitment without ratifying one. Onboarding, integration, memory ingestion and governance are front-loaded costs, which makes month-to-month cancellation structurally unattractive on the delivery side as well as the revenue side.

Read as a total, $30,000 understates a Core engagement by the entire implementation charge. The companion implementation-fee entry below records why.

**Propagation.** The registry target is again `managed-intelligence`, which today shows a monthly price with no term language at all. The same two constraints as the entry above apply: the matrix is in a separate repository, and **C-3 is open**, so this cannot reach the registry until that conflict resolves. On acceptance and resolution, the registry edit is the addition of term language to that offer.

**Consequences:**

- **A disputed usage charge must be traceable** to tenant-level metering records sufficient to identify vendor, billing period, tenant/account, usage category, measured consumption, underlying vendor cost, and amount passed through. Because overages are billed at actual cost, these seven fields are invoice evidence rather than reporting convenience, and should be treated as a schema requirement wherever the managed service is implemented.
- Shorter commercial terms may be approved for paid pilots, proofs of concept, narrowly scoped validation engagements, migration periods and explicitly temporary deployments. An approved exception does not redefine the standard M5 term.
- The export obligation **survives termination**, including termination for cause and for nonpayment. Client data is retained for **30 days after export delivery** and then deleted; what deletion must reach — structured memory, narrative vault, tenant-scoped evidence objects, and derived artifacts including embeddings — belongs in the implementing system's architecture record, not here.
- Client-owned dedicated deployments keep the same 12-month default unless expressly approved otherwise, but generate no AJ pass-through, since infrastructure and API vendors bill the client directly.

---

## 2026-09-12 — Implementation pricing is the implementation fee; there is no separate setup fee

**Status:** proposed — drafted into the register, **not accepted**. Acceptance is Audio's. No propagation to the published offer registry or to the pricing matrix may occur before it.

**Decision (proposed):** AJ Digital charges **no separate generic setup fee** for the Business Memory System. The upfront implementation engagement *is* the implementation charge.

Implementation is separately priced one-time work required to design, configure, migrate, integrate, validate and launch the system. No additional generic platform setup fee is charged unless explicitly stated for an exceptional third-party or client-specific requirement. Exceptional one-time work is **scope-triggered, never automatic**: extraordinary historical-data migration, custom connectors outside the standard integration envelope, local or client-side deployment and training, client-owned infrastructure provisioning or transfer, extensive data remediation, and bespoke automation beyond the selected implementation package.

**Context:** Matrix §BM.2 already prices implementation directly — Business Memory Foundation from $7,500, Core AI-Ready Business Knowledge System typically $15,000–$20,000 within a $15,000–$25,000 corridor. Those figures already pay for provisioning, configuration, onboarding, integrations, schema setup, migration, QA and launch, so a second activation charge on top would be difficult to defend.

The decision is recorded as an **implementation fee policy** rather than a "setup fee" deliberately. "Setup fee" describes SaaS account activation; what is being sold is systems engineering and operational deployment, and the name should not invite the comparison.

A normal deal therefore reads *$15,000 implementation + $2,500/month on a 12-month commitment* — a first-year value of $45,000, or $50,000 at the top of the Core corridor, and $37,500 at Foundation.

**Propagation.** This entry adds no figure; it fixes what the §BM.2 one-time prices *mean*. It also carries a schema constraint: **the published registry must not carry a generic `setup_fee` field beside implementation figures.** Two vaguely overlapping fields are how a $15,000 implementation becomes $15,000 plus setup — not because anyone decides it should, but because the schema offers a blank and someone fills it.

The registry has no §BM.2 offer to attach this to. The nearest is `founder-intelligence-system` in `src/content/offers.ts`, whose comment records that the name "currently collapses two distinct matrix offers (Core Business Memory and Integrated Founder Intelligence / RAG), which must be split first." That is crosswalk entry **C-2**, open. **This decision cannot reach the registry until C-2 closes and a Business Memory implementation offer exists as its own row.**

**Consequences:**

- All three 2026-09-12 entries share one dependency: they are recordable now but **blocked at the registry layer on C-2 and C-3**, because the registry offers they would bind to are the ones those conflicts are about. Closing C-2 and C-3 is the prerequisite for propagating any of them.
- None of these entries resolves **C-1**. The ReKonr naming conflict is untouched, and this register's own tie-break continues to govern it.
