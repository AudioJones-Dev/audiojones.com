# AUDIOJONES AEO/SEO CONTENT INTEGRATION STRATEGY

**Status:** strategy / planning (review before implementation)
**Owner:** AJ Digital LLC
**Scope:** Integrating three AnswerThePublic seed themes into the Audio Jones
content architecture, entity model, conversion funnel, and 90-day roadmap.
**Seed themes:** `revenue-linked attribution` · `attribution models for small
B2B businesses` · `scalable growth operating model`

> This document is a plan, not a code change. It maps each theme onto the
> **routes, frameworks, and schema helpers that already exist in this repo**
> (`/frameworks/map-attribution`, `/agents/responseos`,
> `/ai-readiness-diagnostic`, `src/lib/seo/schema.ts`, etc.) so implementation
> is additive, not a rebuild.

---

## 0. How to read this document

The strategic intent in the brief uses positioning language
(*Founder Intelligence Systems, Revenue Leak Diagnostics, Attribution
Intelligence, Follow-Up Intelligence, Signal Revenue System*) that is **not yet
the live vocabulary in the codebase**. The repo's canonical category is
**Applied Intelligence Systems (AIS)**, with M.A.P, N.I.C.H.E, Signal vs Noise,
and ResponseOS underneath it.

Rather than fork the vocabulary, this strategy treats the brief's terms as
**reader-facing pain language** that ladders down into the **existing entity
spine**. Section 7 (Ontology/Entity Strategy) holds the reconciliation table so
the two never drift. Nothing here invents a parallel taxonomy.

---

## 1. Executive summary

The three seed themes are not three blog posts. They are three **semantic
entry points** into the same operational story Audio Jones already tells:
*founder-led businesses are scaling spend, effort, and tooling on top of signal
they can't trust, and the leak shows up as missed revenue.*

| Seed theme | What the founder is actually asking | Where it lands | Anchor entity |
|---|---|---|---|
| revenue-linked attribution | "How do I know which marketing/effort actually made money?" | Framework/glossary page (DefinedTerm) | **M.A.P** (the *Profitable* filter, made operational) |
| attribution models for small B2B businesses | "Which attribution model should a business my size use?" | High-authority comparison pillar | **M.A.P** differentiation vs. last/first/multi-touch |
| scalable growth operating model | "Why does growth make my business harder to run?" | Founder-readable pillar | **Applied Intelligence Systems** (the operating model) |

**The wedge stays ResponseOS, the CTA stays the Diagnostic.** Every asset in
this plan routes to one of three exits already wired into the site:
`/ai-readiness-diagnostic`, `/services`, `/agents/responseos`
(with `/roi-calculator` as the quantification step in front of ResponseOS).

**Three concrete moves:**

1. **Build the attribution cluster** around the existing
   `/frameworks/map-attribution` hub. Add a new DefinedTerm page
   (`revenue-linked-attribution`) and a comparison pillar
   (`attribution-models-for-founder-led-businesses`). These are the fastest AEO/entity wins
   because the hub and one cluster page (`marketing-attribution-causal-identification`)
   already exist and rank-ready.
2. **Reframe "scalable growth operating model"** into founder pain language and
   use it as a second pillar feeding `/frameworks/applied-intelligence-systems`.
   Preserve the strategic meaning (AIS *is* the scalable operating model);
   change only the front-door wording.
3. **Wire AEO answer-blocks + `speakableSpec` + FAQ schema into every asset**
   and feed new entities into `aiEntity.knowsAbout` so the entity graph
   compounds, not just the page count.

**Prioritization headline (full matrix in §11):**
- *Fastest SEO traction:* `revenue-linked-attribution` glossary page.
- *Highest conversion intent:* `attribution-models-for-founder-led-businesses` comparison.
- *Strongest entity-building:* upgrading the `map-attribution` hub + entity graph.

---

## 2. Strategic principles (applied to every asset)

These operationalize the brief's constraints. Each content brief in §6 is
checked against them.

1. **Pain first, framework second.** The H1 and the opening answer-block use
   plain founder language ("you can't tell which marketing made money"). The
   Audio Jones framework (M.A.P, AIS) is introduced *underneath* as the
   mechanism, never as the hook.
2. **One reader, one decision, one exit.** Every page resolves to a single
   primary CTA. No page offers four equal doors.
3. **Cluster, not confetti.** Each asset is a hub or a spoke with explicit
   up/lateral/down links. No orphan posts.
4. **Numbers over adjectives.** "Recover $X of slow-follow-up revenue" beats
   "supercharge growth." Matches `DESIGN.md §8`.
5. **Complexity behind the glass.** The seven-layer stack, causal
   identification, and scoring math live *below the fold* and *below the
   answer*. The reading experience stays founder-readable.
6. **Additive to the codebase.** Reuse `FrameworkArticle` / `InsightArticle`,
   `buildMetadata`, and the `JsonLd` helpers. No new rendering primitives.

---

## 3. Content architecture (pillar / cluster model)

Three clusters, each a hub-and-spoke. Hubs are framework pages (category-
building, evergreen, DefinedTerm-backed). Spokes are insight pillars and
comparison articles (intent-capturing, FAQ-rich). Conversion anchors are the
product/service surfaces.

```
                         ┌─────────────────────────────────────┐
                         │  HOMEPAGE  (revenue-leak narrative)   │
                         └───────────────┬───────────────────────┘
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         │                                │                               │
   CLUSTER A                        CLUSTER B                       CLUSTER C
   Attribution Intelligence         Scalable Growth Operating       Follow-Up / Revenue Recovery
   HUB: /frameworks/map-attribution Model                          HUB: /agents/responseos
         │                          HUB: /frameworks/                     │
         │                          applied-intelligence-systems          │
   ┌─────┴───────────────┐                │                         ┌─────┴───────────┐
   │                     │          ┌─────┴─────────────┐           │                 │
   ▼                     ▼          ▼                   ▼           ▼                 ▼
 [NEW] revenue-      [NEW]        [NEW] scalable-     [exists]     /roi-calculator   [supporting
 linked-attribution  attribution-  growth-operating-  signal-vs-   (Calculate Lost   FAQ + answer
 (DefinedTerm)       models-       model (pillar)     noise        Revenue)          blocks on
   │                 founder-led     │                 framework      │              ResponseOS)
   │                 (compare; +4    │
   │                 spokes §6A.10)  │
   │                     │           │                                │
   └─────────┬───────────┘           └───────────┬────────────────────┘
             │                                   │
             ▼                                   ▼
   [exists] marketing-attribution-      CONVERSION EXITS (all clusters):
   causal-identification (insight)      /ai-readiness-diagnostic · /services · /agents/responseos
```

**Why these three clusters:**
- **A (Attribution Intelligence)** is where two of three seed themes live and
  where the most ownable category language sits (M.A.P). Highest entity payoff.
- **B (Scalable Growth Operating Model)** is the demand-side reframe of the AIS
  category — it captures founders searching the *symptom* ("growth is breaking
  the business") and routes them to the *category* (AIS).
- **C (Follow-Up / Revenue Recovery)** is the conversion floor. It does not need
  new seed-theme pages; it needs the other two clusters to *link into it*,
  because attribution + operating-model problems both resolve into "your
  follow-up leaks revenue" — which is exactly ResponseOS's job.

---

## 4. Topical authority map (entity graph)

```
Applied Intelligence Systems (CATEGORY / hub entity)
│
├── Signal vs Noise (philosophical anchor)
│     └── feeds → every "which metric matters" decision
│
├── M.A.P Attribution Framework  ◄── Meaningful · Actionable · Profitable
│     ├── Revenue-Linked Attribution      [NEW entity]  = the operational form of "Profitable"
│     ├── Causal Identification            [exists]
│     ├── Attribution Models (compare)     [NEW page; defines last/first/multi-touch/data-driven/causal]
│     └── Signal vs Noise scoring          [exists, on hub]
│
├── Scalable Growth Operating Model        [NEW entity]  = founder-readable surface of AIS
│     ├── "growth that breaks the business" (pain term)
│     ├── Operating model layers (7-layer AIS stack, simplified)
│     └── N.I.C.H.E (positioning input to the operating model)
│
└── ResponseOS (Revenue Recovery Infrastructure)
      ├── Follow-Up Speed (diagnostic dimension)
      ├── Revenue Leak (pain entity) ──► quantified by /roi-calculator
      └── consumes → Revenue-Linked Attribution (you can't recover what you can't attribute)
```

**Entity ownership goal:** Audio Jones should be the page that *defines*
"revenue-linked attribution" and "scalable growth operating model" for the
founder-led segment — not just rank for them. That is the AEO play in §9.

---

## 5. Recommended routes / slugs

New assets follow the existing convention: framework/glossary → `/frameworks/*`;
intent/comparison/essay → `/insights/*`. Reuse `FrameworkArticle` for hubs and
DefinedTerm pages, `InsightArticle` for pillars/comparisons.

| # | Asset | Type | Route / slug | Reuses |
|---|---|---|---|---|
| A1 | Revenue-Linked Attribution | Framework / glossary (DefinedTerm) | `/frameworks/revenue-linked-attribution` | `FrameworkArticle`, `definedTermJsonLd` |
| **A2** | **Attribution Models for Founder-Led Service Businesses** | **Comparison pillar (flagship)** | `/insights/attribution-models-for-founder-led-businesses` | `InsightArticle`, `articleJsonLd`, `faqJsonLd` |
| A3 | M.A.P Attribution hub upgrade | Hub edit (links + answer-block + speakable) | `/frameworks/map-attribution` *(exists)* | add `speakableSpec` |
| A2-s1 | Why last-click attribution fails | Cluster spoke | `/insights/why-last-click-attribution-fails` | `InsightArticle` |
| A2-s2 | How to track revenue, not clicks | Cluster spoke | `/insights/how-to-track-revenue-not-clicks` | `InsightArticle` |
| A2-s3 | Why founders can't trust marketing reports | Cluster spoke | `/insights/why-founders-cant-trust-marketing-reports` | `InsightArticle` |
| A2-s4 | How long sales cycles break attribution | Cluster spoke | `/insights/how-long-sales-cycles-break-attribution` | `InsightArticle` |
| B1 | The Operating Model Founders Outgrow (scalable growth) | Founder-readable pillar | `/insights/scalable-growth-operating-model` | `InsightArticle` |
| B2 | Applied Intelligence Systems hub upgrade | Hub edit (link B1 in, answer-block) | `/frameworks/applied-intelligence-systems` *(exists)* | add `speakableSpec` |
| C1 | ResponseOS supporting FAQ + answer-block | Section edit | `/agents/responseos` *(exists)* | add `faqJsonLd` (page currently renders FAQ UI without FAQ schema) |
| C2 | "What is a revenue leak?" answer-block | FAQ/definition (can live on ResponseOS or as glossary) | `/agents/responseos#revenue-leak` or `/frameworks/revenue-leak` | `definedTermJsonLd` |

> **Slug note:** the canonical diagnostic entry is `/ai-readiness-diagnostic`
> (which starts the flow at `/applied-intelligence/diagnostic`). Throughout this
> doc, "the Diagnostic CTA" = `/ai-readiness-diagnostic`.

---

## 6. Content briefs

Each brief carries the 10 required fields, plus the founder-pain framing and the
specific framework tie-in.

### A1 — Revenue-Linked Attribution *(NEW · framework/glossary · DefinedTerm)*

This is the brief's first explicit ask: make "revenue-linked attribution"
support M.A.P, ResponseOS, attribution-intelligence positioning, and the
diagnostic funnel. It does all four by being the **operational definition of
M.A.P's "Profitable" filter.**

- **1. Page title:** `Revenue-Linked Attribution: connecting marketing effort to actual revenue`
- **2. Slug:** `/frameworks/revenue-linked-attribution`
- **3. Meta description direction:** Plain-language promise — "Revenue-linked
  attribution ties every marketing input to the revenue it actually produced,
  so founders stop scaling guesses. Here's the model and how to apply it."
  (~150 chars, no buzzwords.)
- **4. Primary search intent:** Informational with commercial undertone — a
  founder/operator wants a definition *and* a way to apply it; ready to act if
  the page proves competence.
- **5. Supporting long-tail variations:**
  - "how to link marketing to revenue"
  - "revenue attribution for small business"
  - "tie marketing spend to revenue"
  - "which marketing makes money"
  - "revenue attribution vs marketing attribution"
- **6. Internal links:**
  - Up → `/frameworks/map-attribution` (this is the *Profitable* filter in depth)
  - Lateral → `/insights/attribution-models-for-founder-led-businesses`,
    `/insights/marketing-attribution-causal-identification`
  - Down → `/services` (Attribution + Signal Audit bucket),
    `/agents/responseos` ("you can't recover revenue you can't attribute")
- **7. CTA strategy:** Primary = **AI Readiness Diagnostic** (the
  attribution/data-quality dimensions are the natural hook). Secondary =
  Attribution + Signal Audit on `/services`. Tertiary inline = `/roi-calculator`.
- **8. Schema type:** `DefinedTerm` (primary) + `Article` + `FAQPage` +
  `BreadcrumbList`. Use existing `definedTermJsonLd`, `articleJsonLd`,
  `faqJsonLd`, `breadcrumbJsonLd`.
- **9. AEO answer-block structure:**
  - 45-word direct definition at top (speakable).
  - "In one line: it answers *did this input make money, or just make noise?*"
  - 3-bullet "how it works" (input → comparison → revenue tie).
  - "The Audio Jones view" — M.A.P's *Profitable* gate.
- **10. Framework/entity supported:** **M.A.P** (operationalizes *Profitable*);
  feeds **ResponseOS** (recovery justification) and the **diagnostic** (Data
  quality + Follow-up speed dimensions).

**How it supports each required surface:**
- *M.A.P Attribution Framework:* it is the worked example of the third filter —
  the hub defines *Profitable*; this page shows how to actually draw the line.
- *ResponseOS:* establishes the principle "recovery requires attribution," so
  the ResponseOS page can claim measurable follow-up credibly.
- *Attribution-intelligence positioning:* gives the segment a named, ownable
  concept Audio Jones defines.
- *Diagnostic funnel:* the page's CTA seeds the diagnostic, and the diagnostic's
  attribution-weakness branch (see §8) links *back* here.

---

### A2 — Attribution Models for Founder-Led Service Businesses *(NEW · flagship comparison pillar — summary; full brief in §6A)*

The brief's third explicit ask: a high-authority comparison article that
*naturally* introduces Audio Jones differentiation. The differentiation is not
"we have a better model" — it's "most models answer the wrong question; M.A.P
asks whether the metric earns a decision."

> **Expanded in §6A.** This brief is the summary row; the full flagship pillar
> brief (with the founder-led service-business lens, supporting cluster, and all
> 10 required outputs) lives in **§6A** below. The canonical slug is the refined
> `/insights/attribution-models-for-founder-led-businesses`.

- **1. Page title:** `Which Attribution Model Actually Works for Small B2B Service Businesses?`
- **2. Slug:** `/insights/attribution-models-for-founder-led-businesses`
- **3. Meta description direction:** "Last-touch, first-touch, multi-touch,
  data-driven, causal — a plain comparison of attribution models for small B2B
  businesses, and how to pick one you can act on."
- **4. Primary search intent:** Commercial investigation / comparison — high
  intent, evaluating approaches, close to a buying or hiring decision.
- **5. Supporting long-tail variations:**
  - "best attribution model for B2B"
  - "first touch vs last touch attribution"
  - "multi-touch attribution small business"
  - "attribution model comparison"
  - "do small businesses need attribution software"
- **6. Internal links:**
  - Up → `/frameworks/map-attribution`
  - Lateral → `/frameworks/revenue-linked-attribution`,
    `/insights/marketing-attribution-causal-identification`,
    `/frameworks/signal-vs-noise`
  - Down → `/services` (Attribution + Signal Audit), `/ai-readiness-diagnostic`
- **7. CTA strategy:** Primary = **Attribution + Signal Audit** (`/services`) —
  the comparison naturally ends at "you need someone to map your signal path."
  Secondary = Diagnostic. Inline mid-article = `/frameworks/map-attribution`.
- **8. Schema type:** `Article` + `FAQPage` + `BreadcrumbList`. Optionally a
  comparison `Table` rendered in HTML for snippet capture (see §10). No new
  helper needed.
- **9. AEO answer-block structure:**
  - 50-word direct answer: "For most small B2B businesses, the right attribution
    model is the simplest one you can act on — usually a lightweight multi-touch
    or causal comparison, not enterprise data-driven attribution." (speakable)
  - Comparison table (model · what it tells you · where it lies · who it fits).
  - "The catch every model shares" → introduces M.A.P as the meta-filter.
  - Recommendation block by business size/motion.
- **10. Framework/entity supported:** **M.A.P** (positioned as the layer *above*
  model choice); secondary **Signal vs Noise**.

**Differentiation mechanic:** the article is genuinely useful and even-handed
about the standard models (builds trust + dwell time + links), then reframes:
*every one of these models still reports touches; none of them tell you whether
the metric earns a decision.* That reframe is the M.A.P wedge, delivered as
insight rather than pitch.

---

### B1 — The Operating Model Founders Outgrow *(NEW · founder-readable pillar)*

The brief's second explicit ask: reframe "scalable growth operating model" into
stronger founder-readable language while preserving strategic meaning. The
strategic meaning is **Applied Intelligence Systems is the operating model that
lets growth scale without breaking the business.** The reframe keeps that and
swaps the abstract title for a felt problem.

- **Reframe (term → reader language):**
  - Jargon: "scalable growth operating model"
  - Founder-readable H1: **"Why growth is making your business harder to run"**
  - Subhead carries the strategic term once, for SEO: *"…and how to build a
    growth operating model that scales with you instead of against you."*
- **1. Page title:** `Why growth is making your business harder to run (the operating model fix)`
- **2. Slug:** `/insights/scalable-growth-operating-model`
- **3. Meta description direction:** "More revenue, more chaos? You've outgrown
  your operating model. Here's the founder-readable version of a growth
  operating model that scales — and where AI actually belongs in it."
- **4. Primary search intent:** Problem-aware informational — founder feels the
  symptom (growth = chaos), searching for a model/framing, not yet shopping.
- **5. Supporting long-tail variations:**
  - "scalable growth operating model"
  - "business operating model for growth"
  - "why scaling breaks my business"
  - "operating model for founder-led business"
  - "systems to scale a service business"
- **6. Internal links:**
  - Up → `/frameworks/applied-intelligence-systems`
  - Lateral → `/frameworks/niche-framework`, `/frameworks/signal-vs-noise`
  - Down → `/agents/responseos` (the first layer most founders install),
    `/ai-readiness-diagnostic`, `/services` (Buildout)
- **7. CTA strategy:** Primary = **AI Readiness Diagnostic** ("see which layer is
  breaking first"). Secondary = `/services` Buildout. Inline = ResponseOS as the
  concrete first install.
- **8. Schema type:** `Article` + `FAQPage` + `BreadcrumbList`. The *concept*
  ("Scalable Growth Operating Model") also gets a `DefinedTerm` block so the
  entity is claimable; the AIS hub remains the canonical category.
- **9. AEO answer-block structure:**
  - 45-word answer: "A scalable growth operating model is the system underneath
    the business — how work enters, decisions get made, and follow-up happens —
    designed so adding revenue doesn't add chaos." (speakable)
  - "The symptom checklist" (5 founder-recognizable signs).
  - "The 4 layers that break first" (simplified AIS, not all seven).
  - "Where AI actually belongs" → routes to AIS hub + ResponseOS.
- **10. Framework/entity supported:** **Applied Intelligence Systems** (this is
  its demand-side front door); secondary **N.I.C.H.E**, **ResponseOS**.

**Preserving strategic meaning:** the seven-layer AIS stack is *not* dumbed
down — it's *staged*. The pillar shows 4 felt layers and links to the hub for
the full model. The category claim ("AIS is the operating model") is reinforced,
not diluted.

---

### A3 / B2 — Hub upgrades *(EDITS to existing framework pages)*

These are small, high-leverage edits, not new pages.

- **A3 — `/frameworks/map-attribution`:**
  - Add a top-of-page **45-word speakable answer-block** ("M.A.P Attribution is
    a three-question filter…") before the existing prose.
  - Add `speakableSpec` to the JSON-LD (the helper exists in `schema.ts` but the
    page doesn't yet use it).
  - Add a "Related" block linking down to A1 and A2 (currently the hub has no
    outbound cluster links).
- **B2 — `/frameworks/applied-intelligence-systems`:**
  - Add speakable answer-block + `speakableSpec`.
  - Link to B1 as the founder-readable entry point.

---

### C1 / C2 — ResponseOS supporting content *(EDITS to existing product page)*

The ResponseOS page (`/agents/responseos`) renders a FAQ section **in HTML but
does not emit `FAQPage` schema** — a free AEO win.

- **C1:** Wrap the existing four Q&As in `faqJsonLd` and add 2 more that bridge
  from the attribution cluster:
  - "How do I know slow follow-up is costing me revenue?" → links `/roi-calculator`.
  - "Can you prove follow-up recovered revenue?" → links A1 (revenue-linked attribution).
- **C2:** Add a short **"What is a revenue leak?"** DefinedTerm answer-block on
  the ResponseOS page (or a small `/frameworks/revenue-leak` glossary page if we
  want it independently rankable). This names the brief's "Revenue Leak
  Diagnostics" concept and binds it to the entity graph.

---

## 6A. Flagship pillar deep-dive — Attribution models for founder-led service businesses

This is the expansion of brief **A2** into the flagship comparison pillar. It is
the single highest-leverage long-form asset in the plan: it captures the
comparison-intent searcher (buying mode), and it is the natural place to
introduce the entire Audio Jones attribution ontology *underneath a real
founder problem*.

**Positioning rule (non-negotiable):** lead with the founder's lived problem —
*long sales cycles, referrals, offline conversations, founder-led trust buying,
and a CRM nobody updates make every standard attribution model lie.* Introduce
M.A.P, revenue-linked attribution, Attribution Intelligence, ResponseOS, Revenue
Leak Diagnostics, and Applied Intelligence Systems only **after** the reader sees
their own problem on the page. Plain language first; proprietary language second.

### 6A.1 Page brief

- **Title (canonical):** *Which Attribution Model Actually Works for Small B2B
  Service Businesses?*
  - *Alternates for A/B or H2 reuse:* "Why Most Attribution Models Fail
    Founder-Led Businesses" · "How to Track Marketing Attribution When Your Sales
    Cycle Is Long"
- **Slug:** `/insights/attribution-models-for-founder-led-businesses`
- **Type:** Pillar comparison article (not a minor blog post). Hub-adjacent —
  links up to `/frameworks/map-attribution`, anchors 4 supporting spokes.
- **Pillar taxonomy:** `attribution` (matches `InsightSummary.pillar` in
  `src/content/insights/index.ts`).
- **Meta description direction:** "First-touch, last-click, linear, time-decay,
  data-driven — none fit a founder-led service business cleanly. Here's why, and
  the revenue-linked approach that does."
- **Word-count intent:** long-form pillar (comprehensive enough to be the
  definitive answer for the segment; depth lives below the answer-block).
- **The five models to compare (each evaluated through the founder-led lens):**
  | Model | What it tells you | Why it lies for founder-led B2B |
  |---|---|---|
  | First-touch | Credits the first interaction | Ignores the months of follow-up and referral trust that actually close the deal |
  | Last-click | Credits the final click | "Direct" / branded search hides the real cause; offline conversations are invisible |
  | Linear | Splits credit evenly | Pretends every touch mattered equally; flattering, not causal |
  | Time-decay | Weights recent touches | Penalizes the early referral that started the whole relationship |
  | Data-driven | Algorithmic credit | Needs data volume a sub-$5M business doesn't have; false confidence at low N |
- **The founder-led distortions the article names explicitly:** limited data
  volume, longer sales cycles, referral influence, offline conversations,
  founder-led trust buying, fragmented CRM/follow-up behavior.

### 6A.2 Search intent

Commercial investigation / comparison — **buying mode.** The searcher is a
founder or operator actively evaluating *how* to do attribution and is one good
answer away from either trying a model or hiring help. Secondary
problem-aware intent ("my reports don't make sense") is captured by the
supporting spokes (§6A.10) that feed this pillar.

- **Head term:** "attribution models for small B2B"
- **Long-tail captured:** "best attribution model for service business",
  "attribution for long sales cycle", "why is my marketing attribution wrong",
  "attribution model for referral business", "how to attribute offline sales".

### 6A.3 AEO answer-block opportunities

Top-of-page, above the first H2, speakable, self-contained. Use the supplied
example as the canonical answer string (reused verbatim in the page's
`DefinedTerm`/intro constant and in the matching FAQ so the entity is consistent
across extraction surfaces):

> **For most founder-led B2B service businesses, no single attribution model is
> fully reliable** — long sales cycles, referrals, offline conversations, and
> repeat touchpoints distort standard reporting. A hybrid **revenue-linked
> attribution** approach is usually more useful, because it connects marketing
> activity, follow-up behavior, sales signals, and closed revenue.

Secondary answer-blocks to format for extraction:
- **Per-model verdict** (one 25–40 word verdict line under each model — each is
  its own snippet/voice candidate).
- **"What to do instead" block** — 3 steps (track revenue not clicks → close the
  follow-up gap → run metrics through M.A.P), each a complete claim.
- **Decision block** by business motion (referral-heavy vs. paid-heavy vs.
  founder-sold) — table format for the "which model should I use" snippet.

### 6A.4 FAQ block

Phrased as real founder questions; 30–55 words each; shipped via `faqJsonLd`.

- **Which attribution model is best for a small B2B service business?**
  No single model — the standard five all distort long-cycle, referral-driven,
  founder-led sales. A revenue-linked approach that ties effort, follow-up, and
  conversations to closed revenue is more reliable than picking one model.
- **Why does a long sales cycle break attribution?**
  Most models assign credit at the moment of conversion. When the cycle runs
  months and spans referrals and offline conversations, the touch that gets
  credited is rarely the touch that caused the deal.
- **Do small businesses need data-driven attribution?**
  Usually no. Data-driven (algorithmic) attribution needs data volume a
  sub-$5M business doesn't have. At low volume it produces confident-looking
  numbers built on noise.
- **How do I attribute revenue from referrals and offline conversations?**
  You stop trying to credit a single click and start tracking the revenue path:
  source, follow-up behavior, and sales signals tied to closed revenue. That's
  revenue-linked attribution.
- **Why can't I trust my CRM's attribution?**
  Fragmented, owner-dependent CRM hygiene means the "source" field is a guess.
  Fixing the follow-up and signal path (the job of ResponseOS) comes before the
  dashboard can be trusted.

### 6A.5 Internal linking plan

- **Up (hub):** `/frameworks/map-attribution` — *in the first third of the page.*
- **Lateral (framework + sibling spokes):**
  `/frameworks/revenue-linked-attribution` (A1),
  `/insights/marketing-attribution-causal-identification` (exists),
  `/frameworks/signal-vs-noise`.
- **Down to spokes (the supporting cluster this pillar anchors):**
  `/insights/why-last-click-attribution-fails`,
  `/insights/how-to-track-revenue-not-clicks`,
  `/insights/why-founders-cant-trust-marketing-reports`,
  `/insights/how-long-sales-cycles-break-attribution`.
- **Bridge (cross-cluster, conversion):** `/agents/responseos` (the follow-up
  fix) and `/services` (Attribution + Signal Audit).
- **Anchor-text rule:** use entity names ("revenue-linked attribution",
  "M.A.P Attribution"), never "click here" / "learn more".

### 6A.6 Diagnostic CTA integration

- **Primary CTA:** *Attribution + Signal Audit* (`/services`) — the article ends
  in buying mode at "you need someone to map your signal path."
- **Secondary CTA:** **AI Readiness Diagnostic** (`/ai-readiness-diagnostic`),
  framed as *"Find your attribution blind spot in 6 dimensions."* This ties to
  the diagnostic's **Data quality** + **Follow-up speed** dimensions and the
  new attribution-signal question proposed in §8 (*"Can you name the source of
  your last five closed deals?"*).
- **Loop:** the diagnostic's weak-attribution result routes the reader *back* to
  this pillar and to A1 — content → diagnostic → content (the closed loop in §8).

### 6A.7 ResponseOS integration

The article's strongest conversion bridge. The causal chain it draws:
*you can't attribute what you never followed up on, and you can't recover what
you can't attribute.* Fragmented CRM/follow-up behavior (one of the named
founder distortions) **is a ResponseOS problem before it is a reporting
problem.** Place one inline link to `/agents/responseos` in the
"why-your-CRM-lies" section, and route the **Revenue Leak** framing toward
`/roi-calculator` (Calculate Lost Revenue) so the follow-up gap gets quantified.

### 6A.8 M.A.P framework integration

M.A.P is introduced as the **meta-layer above model choice**, not as a sixth
model. After the even-handed comparison, the reframe: *every model on this list
still reports touches; none tell you whether the metric earns a decision.* Run
each candidate metric through **Meaningful → Actionable → Profitable**; the
*Profitable* gate is exactly **revenue-linked attribution** (A1). This makes the
pillar the demand-side on-ramp to the `/frameworks/map-attribution` hub.

### 6A.9 Suggested schema

Reuse `src/lib/seo/schema.ts` — no new infrastructure:
- `articleJsonLd` (pillar article)
- `faqJsonLd` (§6A.4 questions)
- `breadcrumbJsonLd` (Home › Insights › title)
- `speakableSpec` (answer-block class + FAQ answers)
- Optional: render the model-comparison as an HTML `<table>` for featured-snippet
  capture (no schema change needed); a `DefinedTerm` block for "revenue-linked
  attribution" may be reused from A1's constant for entity consistency.

### 6A.10 Supporting cluster articles

The pillar anchors a spoke cluster. Each spoke is problem-aware (plain-language
search entry), links **up** to this pillar, and routes **down** to a CTA. This
turns one article into a topical authority cluster (brief constraint #5).

| Spoke | Slug | Search entry (founder problem) | Routes up to | Primary CTA |
|---|---|---|---|---|
| Why last-click attribution fails | `/insights/why-last-click-attribution-fails` | "last click attribution wrong" | A2 + `/frameworks/map-attribution` | Diagnostic |
| How to track revenue, not clicks | `/insights/how-to-track-revenue-not-clicks` | "track revenue not clicks" | A2 + A1 | Attribution + Signal Audit |
| Why founders can't trust marketing reports | `/insights/why-founders-cant-trust-marketing-reports` | "marketing reports don't make sense" | A2 + ResponseOS | ROI Calculator → ResponseOS |
| How long sales cycles break attribution | `/insights/how-long-sales-cycles-break-attribution` | "attribution long sales cycle" | A2 + A1 | Diagnostic |

**Slug reconciliation (important — avoid duplicate/cannibalizing URLs):** the
follow-up brief also listed `/frameworks/map-attribution-framework`,
`/frameworks/revenue-linked-attribution`, and
`/insights/what-is-revenue-linked-attribution`. Resolve as follows so we don't
split entity authority:
- `/frameworks/map-attribution-framework` → **use the live route
  `/frameworks/map-attribution`** (already exists, already ranks-ready). Do not
  create a second M.A.P URL.
- "revenue-linked attribution" → **one canonical home: `/frameworks/revenue-linked-attribution`**
  (brief A1, a DefinedTerm/framework page). Do **not** also create
  `/insights/what-is-revenue-linked-attribution`; that would compete with A1 for
  the same entity. If a "what is…" entry point is wanted, make it an H2 + FAQ on
  A1, not a separate URL.

---

## 7. Ontology / entity strategy

### 7.1 Vocabulary reconciliation (brief positioning ↔ live entities)

| Brief positioning term | Maps to live entity | Treatment |
|---|---|---|
| Founder Intelligence Systems | **Applied Intelligence Systems** | Keep AIS as canonical; "founder" is an audience adjective, not a new category. |
| Revenue Leak Diagnostics | **AI Readiness Diagnostic** + **ROI Calculator** | "Revenue leak" becomes a named pain entity (C2) feeding the diagnostic. |
| Attribution Intelligence | **M.A.P Attribution Framework** | "Attribution Intelligence" = the cluster name (A); M.A.P is the framework. |
| Follow-Up Intelligence | **ResponseOS** | ResponseOS already owns follow-up; "Follow-Up Intelligence" = positioning gloss. |
| Operational Intelligence | **Applied Intelligence Systems** (operating layers) | Subsumed by AIS; no separate page. |
| Signal Revenue System | **Signal vs Noise** + **ResponseOS** | Concept, not a new route; reinforce via internal links. |
| AI Business Systems Therapist | persona/voice for the **Diagnostic** | Voice device, not an entity. Do not create a page. |
| Scalable growth operating model | **Applied Intelligence Systems** (demand front door = B1) | New DefinedTerm block, canonical entity stays AIS. |

> **Recommendation:** do **not** add new top-level categories to the codebase
> for the brief's positioning terms. The site already owns "Applied Intelligence
> Systems." Adding parallel categories would split entity authority. Use the
> brief's terms as page-level pain language and cluster names instead.

### 7.2 New `DefinedTerm` entities to claim

Add these as `DefinedTerm` pages/blocks, all `inDefinedTermSet` = "Audio Jones
Applied Intelligence Glossary" (the set already declared in
`definedTermJsonLd`):

1. **Revenue-Linked Attribution** (A1) — flagship new entity.
2. **Scalable Growth Operating Model** (B1 block) — demand-side AIS term.
3. **Revenue Leak** (C2) — pain entity bound to ResponseOS + ROI calculator.

### 7.3 `aiEntity.knowsAbout` additions

`src/lib/applied-intelligence/tokens.ts` currently lists 10 `knowsAbout`
topics. Append (so Person/Organization schema reflects the new authority):

```
"Revenue-Linked Attribution",
"Attribution Models",
"Scalable Growth Operating Model",
"Revenue Recovery",
"Follow-Up Systems"
```

This is a one-line-each edit to an existing array — no schema refactor.

### 7.4 Entity interlink rule

Every new DefinedTerm page must (a) declare `definedTermJsonLd`, (b) link up to
its parent framework hub, and (c) appear in the hub's "Related" list. That
bidirectional link is what makes the glossary read as a *set* to crawlers and
answer engines, not isolated definitions.

---

## 8. Diagnostic integration

The diagnostic scores six dimensions: **Workflow clarity, Data quality,
Follow-up speed, SOP maturity, Tool fragmentation, Team adoption**
(`src/data/audiojones-design.ts`). The attribution cluster maps cleanly onto
**Data quality** and **Follow-up speed**.

**Recommended additions (logic, not necessarily new dimensions):**

1. **Attribution-signal question** under *Data quality*:
   *"Can you name the source of your last five closed deals?"*
   - Strong answer → reinforce, route to ResponseOS.
   - Weak answer → flag "attribution blind spot," route results to
     `/frameworks/revenue-linked-attribution` + Attribution + Signal Audit.
2. **Follow-up question** under *Follow-up speed*:
   *"When a lead goes quiet, does anyone know what was lost?"*
   - Weak answer → "revenue leak" branch → `/roi-calculator` → ResponseOS.
3. **Results-page content routing:** each weak dimension should deep-link to the
   matching cluster asset so the diagnostic doubles as a distribution channel
   for the content (and the content's CTA seeds the diagnostic — a closed loop).

**Closed loop:** Content → Diagnostic CTA → weak-dimension result →
back into the relevant cluster page → service/ResponseOS CTA. This is how the
brief's "every asset routes toward /diagnostic, /services, /agents/responseos"
becomes bidirectional rather than one-way.

---

## 9. AEO implementation guidance (answer engines)

AEO is the highest-ROI layer here because the seed themes are
**definitional and comparative** — exactly what answer engines extract.

### 9.1 Answer-block pattern (apply to every asset)

```
[H1 — founder pain, plain language]

> Direct answer: 40–55 words. Self-contained. Leads with the plain
> definition, names the Audio Jones concept once. Wrapped in a stable
> CSS class for speakable + extraction.

[3–5 bullet "how it works" — scannable, each line a complete claim]

[The Audio Jones view — framework tie-in, 1 short paragraph]

[deeper sections / table / FAQ]
```

- The answer-block must be **above the first H2** and must **stand alone** (an
  engine quoting just that block should still represent Audio Jones correctly).
- Name the entity exactly once in the block (e.g., "M.A.P Attribution") so
  attribution-to-brand survives extraction.

### 9.2 Speakable

Add `speakableSpec([...])` to the JSON-LD on hubs and pillars, targeting the
answer-block class and the FAQ answers. The helper already exists in
`src/lib/seo/schema.ts` and is currently unused on pages — adopting it is pure
upside.

### 9.3 FAQ as AEO surface

`faqJsonLd` is already used on `map-attribution` and the attribution insight.
Extend the pattern: each new asset ships 4–6 FAQs phrased as **real founder
questions** (see §10), each answer 30–55 words, each self-contained. The
ResponseOS page should start emitting `faqJsonLd` (it currently doesn't).

### 9.4 Entity consistency

Because answer engines build entity graphs, the *same definition string* for
each concept should appear in: the DefinedTerm schema, the on-page answer-block,
and any FAQ that defines it. Define each term once as a constant and reuse it
(the codebase already does this — e.g., `DEFINITION` const on `map-attribution`).

---

## 10. FAQ, featured-snippet & answer-block opportunities

### 10.1 FAQ opportunities (by asset)

**A1 Revenue-Linked Attribution**
- What is revenue-linked attribution?
- How is it different from marketing attribution?
- How do small businesses link marketing to revenue without enterprise tools?
- Why can't I just trust my CRM's source field?

**A2 Attribution Models comparison**
- What is the best attribution model for a small B2B business?
- First-touch vs last-touch — which is better?
- Do small businesses need multi-touch attribution software?
- What's wrong with data-driven attribution for small companies?

**B1 Scalable Growth Operating Model**
- What is a growth operating model?
- Why does growth make a business harder to run?
- What breaks first when a service business scales?
- Where does AI fit in a growth operating model?

**C ResponseOS**
- How do I know slow follow-up is costing me revenue?
- Can follow-up recovery be measured?

### 10.2 Featured-snippet targets (format the page to win the box)

| Query | Snippet format to target | Page |
|---|---|---|
| "best attribution model for small B2B" | **Table** (model vs fit) | A2 |
| "first touch vs last touch attribution" | **Definition + 2-row table** | A2 |
| "what is revenue attribution" | **Paragraph** (45 words) | A1 |
| "why does scaling break my business" | **Numbered list** | B1 |
| "what is the M.A.P framework" | **Paragraph** | hub (A3) |

### 10.3 Answer-block opportunities (speakable)

Every asset's top answer-block (§9.1) is a speakable target. Priority order for
implementation matches §11: A1 → A2 → A3/B2 → B1 → C.

---

## 11. Content prioritization

Scored across the brief's three lenses. Score = relative, 1–5 (5 = strongest).

| Asset | Fastest SEO traction | Highest conversion intent | Strongest AEO/entity | Build effort | Priority |
|---|---|---|---|---|---|
| **A1** Revenue-Linked Attribution | 5 (hub exists, low competition long-tail) | 4 | 5 (flagship entity) | Low (new page, reuse components) | **P0** |
| **A3/B2** Hub upgrades | 4 (boosts ranking pages) | 3 | 5 (speakable + links) | Very low (edits) | **P0** |
| **A2** Attribution Models compare | 3 (more competitive) | 5 (comparison = buying mode) | 4 | Medium | **P1** |
| **C1/C2** ResponseOS FAQ + revenue-leak | 3 | 5 (bottom of funnel) | 4 (free FAQ schema) | Very low (edits) | **P1** |
| **B1** Scalable Growth pillar | 4 (problem-aware volume) | 3 | 4 | Medium | **P2** |

**Reading the matrix:**
- *Fastest SEO traction:* **A1** (new, low-competition, attaches to a ranking
  hub) and **A3/B2** (improve pages that already exist).
- *Highest conversion intent:* **A2** and **C1/C2** (comparison + bottom-funnel).
- *Strongest AEO/entity-building:* **A1** + **hub upgrades** (new claimable
  entity + speakable/interlink on the category hub).

---

## 12. 90-day publishing roadmap

Three two-to-four-week phases. Each phase ends with a measurable check tied to
the PRD success signals (diagnostic completion, qualified leads, organic growth
on cluster topics).

### Phase 1 — Foundation & fast wins (Weeks 1–3)
- **A1** Revenue-Linked Attribution page ships (P0).
- **A3 + B2** hub upgrades: answer-blocks, `speakableSpec`, cluster "Related"
  links (P0).
- `aiEntity.knowsAbout` additions (§7.3).
- **C1** ResponseOS FAQ schema goes live (P1, trivial edit).
- *Check:* A1 indexed; hubs emit speakable + FAQ; internal links live.

### Phase 2 — Authority & conversion (Weeks 4–7)
- **A2** Attribution Models comparison pillar ships (P1) with table + FAQ.
- **C2** Revenue-leak DefinedTerm block ships.
- Diagnostic logic: attribution-signal question + weak-dimension routing (§8).
- *Check:* A2 ranking for ≥1 comparison long-tail; diagnostic results deep-link
  into cluster; first attribution-driven diagnostic starts attributed.

### Phase 3 — Demand-side reframe, spokes & loop closure (Weeks 8–12)
- **B1** Scalable Growth Operating Model pillar ships (P2) with DefinedTerm.
- **A2 supporting spokes** ship (§6A.10): `why-last-click-attribution-fails`,
  `how-to-track-revenue-not-clicks`, `why-founders-cant-trust-marketing-reports`,
  `how-long-sales-cycles-break-attribution` — each linking up to the A2 pillar.
  Sequence by demand: ship the two with clearest search entry first
  (`why-last-click…`, `how-to-track-revenue…`).
- Homepage revenue-leak narrative block linking into all three clusters (§13).
- Expand FAQ coverage; add any missing snippet-format tweaks from §10.2.
- *Check:* full hub-and-spoke interlinking complete (pillar + 4 spokes live);
  homepage routes to clusters; entity graph (DefinedTermSet) reads as a set in
  schema testing.

> **Cadence rule:** ship P0/P1 edits *before* new long-form. The cheapest wins
> (hub speakable + ResponseOS FAQ schema) compound under everything published
> later.

---

## 13. Homepage & service-page integration

### 13.1 Homepage
- Add a **"revenue leak" narrative block** (pain-first) that names the three
  founder problems — *can't tell what's working, growth is getting harder,
  follow-up leaks revenue* — each linking into its cluster (A hub, B1, ResponseOS).
- This makes the homepage the top of the topical map (§3) rather than a
  standalone pitch.

### 13.2 `/services`
- The **Attribution + Signal Audit** bucket should link out to A1 + A2 as the
  "what this fixes / why it matters" explanation layer (the service page
  currently describes the engagement but doesn't link the supporting content).
- The **Diagnostic** bucket should link to B1 (the operating-model framing) and
  `/ai-readiness-diagnostic`.

### 13.3 `/agents/responseos`
- Add the new bridging FAQs (C1) and a single inline link to A1
  ("recovery requires attribution"). Keep the page's existing
  ROI-calculator-first CTA order intact.

---

## 14. CTA integration map

| Surface | Primary CTA | Secondary | Rationale |
|---|---|---|---|
| A1 Revenue-Linked Attribution | AI Readiness Diagnostic | Attribution + Signal Audit (`/services`) | Data-quality hook → diagnostic |
| A2 Attribution Models compare | Attribution + Signal Audit (`/services`) | Diagnostic | Comparison = buying mode → service |
| A3 M.A.P hub | Diagnostic | `/services` | Category page → assessment |
| B1 Scalable Growth pillar | Diagnostic ("which layer breaks first") | Buildout (`/services`) | Problem-aware → diagnose before build |
| B2 AIS hub | Diagnostic | ResponseOS | Category → first install |
| C ResponseOS | Calculate Lost Revenue (`/roi-calculator`) | Book a Call | Quantify leak before scoping (existing order) |
| Homepage block | Diagnostic | per-cluster deep links | Top of funnel |

**Rule (matches `DESIGN.md §8` "one CTA per section"):** one primary CTA per
page; the diagnostic is the default primary unless the page is bottom-of-funnel
(ResponseOS/services), where the quantifier or the call leads.

---

## 15. Schema recommendations (mapped to existing helpers)

All recommendations reuse `src/lib/seo/schema.ts`; **no new schema
infrastructure is required.**

| Asset | Schema (helper) |
|---|---|
| A1 | `definedTermJsonLd` + `articleJsonLd` + `faqJsonLd` + `breadcrumbJsonLd` + `speakableSpec` |
| A2 | `articleJsonLd` + `faqJsonLd` + `breadcrumbJsonLd` (+ HTML comparison table for snippet) |
| A3 (hub) | existing schema **+ add `speakableSpec`** |
| B1 | `articleJsonLd` + `definedTermJsonLd` (concept block) + `faqJsonLd` + `breadcrumbJsonLd` + `speakableSpec` |
| B2 (hub) | existing schema **+ add `speakableSpec`** |
| C1 (ResponseOS) | **add `faqJsonLd`** (currently missing) |
| C2 (revenue leak) | `definedTermJsonLd` |
| Site-wide | append to `aiEntity.knowsAbout` (Person/Organization schema) |

**Two no-cost wins to call out:** (1) `speakableSpec` exists but isn't used on
any page yet; (2) the ResponseOS FAQ renders without FAQ schema. Both are
edits, not builds.

---

## 16. Internal linking recommendations (summary)

**Pattern:** strict hub-and-spoke per cluster.
- **Spoke → up:** every spoke links to its hub in the first third of the page.
- **Spoke → lateral:** 1–2 sibling spokes (no more — avoid link soup).
- **Spoke → down:** exactly one primary CTA destination + one supporting.
- **Hub → down:** "Related" block listing all its spokes.
- **Cross-cluster:** only the *bridge* links (A1 → ResponseOS; B1 → ResponseOS;
  A2 → Signal vs Noise). These bridges are what make the three clusters read as
  one ecosystem rather than three silos.

**Anchor-text rule:** use the entity name as anchor text ("Revenue-Linked
Attribution", "M.A.P Attribution") so internal links reinforce the entity graph,
not generic "learn more."

---

## 17. Implementation notes (for the build phase — not this PR)

- New pages copy the structure of `src/app/frameworks/map-attribution/page.tsx`
  (framework/DefinedTerm) or
  `src/app/insights/marketing-attribution-causal-identification/page.tsx`
  (insight/comparison). Both already wire breadcrumbs + JSON-LD correctly.
- Register new insights in `src/content/insights/index.ts` (add an
  `attribution`-pillar entry for A2) and new frameworks in
  `src/content/frameworks/index.ts` (A1).
- Validation contract before any code PR (from `CLAUDE.md`):
  `pnpm typecheck && pnpm lint && pnpm check:no-firebase && pnpm build`.
- Keep diffs small and reviewable; no new rendering primitives; no Firebase.

---

## 18. Open decisions for review

1. **Vocabulary:** confirm we keep **Applied Intelligence Systems** as the
   canonical category and treat the brief's positioning terms as reader-facing
   language (§7.1) — vs. introducing new top-level categories. *Recommended: keep
   AIS canonical.*
2. **Revenue-leak page:** standalone `/frameworks/revenue-leak` (independently
   rankable) vs. an answer-block on ResponseOS only. *Recommended: start as a
   ResponseOS block; promote to a page if it earns search demand.*
3. **Diagnostic changes:** add net-new questions vs. only re-route existing
   results (§8). *Recommended: re-route first (lower risk), add questions in
   Phase 2.*
4. **File location of this strategy:** placed in `docs/` (not repo root) to
   respect `CLAUDE.md`'s "no new top-level Markdown reports" guardrail. Confirm
   that's acceptable, or move if a root-level deliverable is explicitly wanted.
