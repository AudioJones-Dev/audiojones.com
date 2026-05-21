---
title: "Conversion Strategy 2026 — AI Workforce Economics Integration"
status: "draft, awaiting research-dataset numerics + design-team intake"
owner: "AJ Digital LLC — strategy"
target_surfaces:
  - "/"
  - "/agents"
  - "/agents/responseos"
  - "/agents/rekonr-os (new)"
parent_design_doc: "docs/DESIGN.md"
parent_product_doc: "docs/PRD.md"
related:
  - "docs/codex/responseos-v1-brief.md"
  - "docs/architecture/stack-decision.md"
  - "docs/archive/MARKETING-IA.md"
last_updated: "2026-05-21"
---

# Conversion Strategy 2026 — AI Workforce Economics Integration

This document is the strategic brief for integrating the **AI Workforce
Economics Index** research layer into the AudioJones.com marketing surface
without compromising the premium, editorial, anti-hype positioning of the
Founder Intelligence Systems™ architecture.

It is **a strategy spec, not a copy deck**. Final copy is drafted from
this against the brand voice in [`docs/DESIGN.md`](../DESIGN.md) §8 and
the product framing in [`docs/PRD.md`](../PRD.md). Final statistics are
sourced from the AI Workforce Economics Index dataset before any line is
shipped — see §7.5 on the citation contract.

---

## 0. Reading order

1. §1 — Executive analysis: what the current site does well, what it is missing.
2. §2 — Homepage messaging architecture.
3. §3 — ResponseOS page architecture (revenue recovery infrastructure).
4. §4 — ReKonr OS page architecture (business memory infrastructure).
5. §5 — AI Workforce Economics integration: statistic placement map.
6. §6 — CTA system, objection map, executive framing.
7. §7 — Implementation order, citation contract, governance.

---

## 1. Executive strategic analysis

### 1.1 What AudioJones.com already does well

The audit baseline as of 2026-05-21:

| Surface | Strength | Source |
|---|---|---|
| Homepage hero | "All Signal" hero is editorial, restrained, premium. The "growth problem → signal problem" reframe is intellectually distinctive. | `src/components/home/landing/HeroAllSignal.tsx` |
| Signal vs Noise model | The three-column Noise / Acceptable Noise / Signal model is conceptually unique — it positions Audio Jones as a *filter*, not a vendor. | `src/components/home/landing/SignalNoiseModel.tsx` |
| ResponseOS wedge | Already framed as "Revenue Recovery Infrastructure", not as a chatbot. The Capture / Qualify / Recover pillars are operationally correct. | `src/components/home/landing/ResponseOSWedge.tsx` |
| Proof layer | Before/after architecture with KPI tiles and an honest disclaimer ("Representative system outcomes…") preserves trust. | `src/components/home/landing/ProofStats.tsx` |
| /agents page | "Six operating systems. One control plane." is the right architectural framing — it removes Audio Jones from the AI-agency category entirely. | `src/app/agents/page.tsx` |
| Brand voice contract | `docs/DESIGN.md` §8 already bans "unlock / harness / supercharge / revolutionize" and demands "numbers > adjectives". | `docs/DESIGN.md` |

The site reads, today, like a systems platform with editorial discipline.
That is the asset to protect.

### 1.2 What the site is structurally missing

These are the **persuasion gaps** the AI Workforce Economics Index is
positioned to close. They are gaps in *evidence layer*, not in voice or
visual identity.

| Gap | Symptom | Strategic cost |
|---|---|---|
| **Operational economics** | The site argues for "signal" but rarely puts a dollar figure on the *cost of noise*. The proof layer shows CAC / conversion deltas, never absolute revenue at stake. | The executive reader cannot translate "signal problem" into a board-deck line item. |
| **Response-time economics** | ResponseOS is positioned as revenue recovery but does not show the *time-decay curve* of a high-intent lead. | The buyer cannot anchor urgency. Urgency is the wedge. |
| **Labor / capacity economics** | The site does not address the founder's actual capital constraint: headcount math. Receptionist, SDR, ops-coordinator, CSM labor cost is the implicit comparison set. | The reader runs the AI vs. hire comparison in their head, unanchored, and lands on the wrong number. |
| **Citation-backed proof** | Outside the in-flight engagement disclaimer, there are no third-party citations. | A premium buyer expects research provenance the way a fund expects a data room. |
| **Operational continuity framing** | "After-hours" / "out-of-office" / "founder-as-bottleneck" failure modes are gestured at but not priced. | The buyer cannot see what it costs to *not* install the system. |
| **ReKonr OS positioning** | A second product line exists conceptually (business memory) but has no surface, no narrative, and no place in the agent grid. | The site cannot upsell past the ResponseOS wedge. |

These are the six gaps the integration closes. Nothing else needs to
move.

### 1.3 What we deliberately will not change

The site is a premium asset. We protect it by *not* doing these things:

- **No new homepage statistic carpet.** The hero already carries three
  metrics; the proof section carries four. Adding more diminishes each.
- **No "AI replaces your team" framing.** Not on any surface, ever. The
  Founder Intelligence Systems™ position is *operational leverage*, not
  workforce reduction. (See §6.4 — Banned language.)
- **No reframing of Signal vs Noise.** It is the conceptual anchor of
  the brand. Operational economics enters *around* it, not on top of it.
- **No chatbot/receptionist vocabulary on ReKonr OS.** It is not that
  category; it must not be discoverable as that category. (See §4.)
- **No SaaS-style pricing tiles or feature matrices on the marketing
  surface.** ResponseOS and ReKonr OS are infrastructure; they are
  scoped after diagnosis, not bought from a comparison table.

### 1.4 The conversion thesis

The conversion thesis for 2026 is one sentence:

> The buyer does not convert because we describe a better system. They
> convert because they cannot afford the gap they now see in their
> current one.

The AI Workforce Economics Index, integrated correctly, makes the gap
*visible and priced*. That is the entire job. Premium positioning is
preserved because we never *sell* the statistics — we *cite* them, the
way a research desk does.

---

## 2. Homepage messaging architecture

### 2.1 Current section flow (preserved)

```
1. HeroAllSignal              — identity + reframe
2. SignalNoiseModel           — conceptual anchor
3. ResponseOSWedge            — flagship product
4. RoiLeadMagnet              — diagnostic capture
5. ProcessPipeline            — Diagnose / Design / Deploy
6. ProofStats                 — before/after evidence
7. DiagnosticCTA              — final exit
```

This sequencing is correct. The recommendation is **not to reorder it.**
We insert one new section and modify the contents of two existing ones.

### 2.2 Recommended homepage flow (post-integration)

```
1. HeroAllSignal              — UNCHANGED visually; one numeric subline added (§2.3)
2. SignalNoiseModel           — UNCHANGED
3. The Cost of the Gap (NEW)  — operational economics interlude (§2.4)
4. ResponseOSWedge            — UNCHANGED, but the "Calculate Lost Revenue" CTA gets an anchored number alongside it (§2.5)
5. RoiLeadMagnet              — UNCHANGED
6. ProcessPipeline            — UNCHANGED
7. ProofStats                 — augmented with one citation row beneath the disclaimer (§2.6)
8. DiagnosticCTA              — UNCHANGED
```

The new section (#3) is the single most important architectural change.
It is the *bridge* between the conceptual reframe (Signal vs Noise) and
the product (ResponseOS). It does the operational-economics work for
the entire site so that no other section has to.

### 2.3 Hero subline modification

**Today:** The hero carries three metrics in the metrics strip:
`CAC ↓37% · Pipeline ↑28% · Conversion ↑42%`. These are in-flight
engagement metrics.

**Change:** Add a single eyebrow line *above* the metrics strip on
desktop, beneath the strip on mobile. One line. One number. Cited.

**Eyebrow concept (premium, anti-hype):**

> Research-grade context — sourced from the AI Workforce Economics Index
> ⟶ inline pill, monospace, gold-on-dark, 9px tracking 0.22em.

**Numeric anchor (one statistic — choose one from §5.1):**

> _e.g._ "Inbound leads decay 78% in operational value within 5 minutes
> of arrival.¹"

This is the *only* statistic above the fold. Its job is to make the
"signal problem" feel like a measured, observable economic phenomenon
before the reader scrolls. Not to sell. To *anchor*.

### 2.4 NEW section — "The Cost of the Gap"

**Position:** Between `SignalNoiseModel` and `ResponseOSWedge`.

**Eyebrow:** `Operational Economics`

**Headline (three options, ranked):**

1. _Preferred._ **The gap between intent and response is now a P&L line.**
2. The cost of operating without an intelligence layer is no longer
   theoretical.
3. Operational continuity has a price. Most founders are paying it
   without seeing it.

**Subhead:**

> Three economic forces are reshaping what it costs to run a
> founder-led business in 2026: the decay rate of inbound demand, the
> labor cost of the front office, and the cognitive load of operating
> without business memory. The AI Workforce Economics Index quantifies
> each.

**Layout — three columns, editorial, restrained:**

| Column | Role | Statistic slot |
|---|---|---|
| **Response decay** | Time-economics of a lead. Frames ResponseOS. | One stat: lead-value decay vs. time-to-response (§5.1.A) |
| **Front-office labor** | Capacity-economics. Frames operational leverage. | One stat: median fully-loaded front-office FTE cost (§5.1.B) |
| **Operational memory** | Cognition-economics. Frames ReKonr OS. | One stat: founder/operator time lost to context reconstruction (§5.1.C) |

Each column is a single citation, a single sentence, and a single line
of operational interpretation. No bar charts. No icon library. No
"how it works". This section *names the economics* — it does not sell.

**Closing principle line (gold-pill style, like the existing
SignalNoise principle strip):**

> These are not productivity statistics. They are the price of running
> a business without an intelligence layer.

**Visual treatment:** Identical structural rhythm to `SignalNoiseModel`
— three cards, gold/blue tonal contrast, dark background, one principle
line below. Reusing the existing visual grammar is what keeps the new
section feeling *editorial* rather than *bolted on*.

**Critical constraint:** One statistic per column. Three statistics
total. If the section grows past three, it has failed.

### 2.5 ResponseOSWedge — minimal augmentation

The component itself is not redesigned. One change:

**Today:** The CTA pair reads `Explore ResponseOS` / `Calculate Lost
Revenue`.

**Change:** Add a single muted-text line beneath the CTA pair, the
"operating cost" of *not* installing the system.

**Concept (subject to §5.1.D):**

> _e.g._ "Median founder-led service business loses
> $[NN,NNN]–$[NN,NNN] per quarter to follow-up gaps before a system
> is installed.²"

Set in body text, 12px, color `rgba(255,255,255,0.45)`, anchored under
the CTA cluster. The reader sees a price, not a pitch.

### 2.6 ProofStats — citation row

The existing disclaimer reads:

> Representative system outcomes. Actual results depend on
> implementation, offer, market, and operational maturity.

Beneath it, add a **citation row** (one line, monospace, 10px,
`rgba(255,255,255,0.35)`):

> Industry benchmarks: AI Workforce Economics Index, 2026.
> [linked superscripts 1–N → /research]

Why this works: it shifts the proof layer from "our in-flight numbers"
to "our in-flight numbers, in the context of an externally cited
research baseline". The premium reader reads that as posture, not
promotion.

### 2.7 What does NOT change on the homepage

- The hero composition, portrait, "ALL SIGNAL" typography.
- The three metrics in the hero strip.
- Signal vs Noise model — text, layout, animation.
- ProcessPipeline.
- DiagnosticCTA copy.
- Every CTA color, glow, and button variant.

The homepage gains exactly one new section and three small inline
augmentations. That is the entire change.

---

## 3. ResponseOS page architecture

### 3.1 Position in the agent ecosystem

ResponseOS is the **wedge**. The page must do four things, in order:

1. Name the leak in operational, not technical, language.
2. Price the leak in cited dollars and cited minutes.
3. Describe the infrastructure that closes it.
4. Route the reader to the ROI Calculator or Diagnostic — never to
   "request a demo" or "see pricing".

The existing page (`src/app/agents/responseos/page.tsx`) hits 1, 3, and
4. It does not yet do 2. That is the change.

### 3.2 Recommended page narrative

```
1. SignalHero                     — UNCHANGED
2. The Leak                       — UNCHANGED structure; copy upgrade (§3.3)
3. Capture / Qualify / Route /    — UNCHANGED
   Recover flow
4. The Economics of the Gap (NEW) — operational economics block (§3.4)
5. ROI Snapshot                   — UNCHANGED structure; one citation row
6. The "Before vs After"          — NEW section (§3.5)
   operational frame
7. FAQ                            — copy upgrade for objections (§3.6)
8. FinalCta                       — UNCHANGED
```

### 3.3 "The Leak" — copy upgrade

The current three cards read:

- Inbound scatter
- No qualification layer
- No recovery memory

Keep the three cards. Add one cited line per card, in monospace eyebrow
beneath the description. Example structure:

| Card | Existing description (kept) | New cited line |
|---|---|---|
| Inbound scatter | "Lead signals live across forms, phone, email, social, chat, and scheduling tools." | `[Stat §5.2.A — channel fragmentation]` |
| No qualification layer | "The team cannot quickly separate high-intent opportunities from low-signal activity." | `[Stat §5.2.B — qualification accuracy under load]` |
| No recovery memory | "When follow-up fails, the business rarely knows what was lost or why." | `[Stat §5.2.C — % of lost leads never re-engaged]` |

Each cited line is one number plus a six-to-ten-word interpretation.
No more.

### 3.4 NEW section — "The Economics of the Gap"

This section is the **center of gravity** of the ResponseOS page. It is
where the page earns the right to ask for the calculator click.

**Eyebrow:** `Operational Economics — Revenue Recovery`

**Headline:**

> Speed-to-response is now a unit-economics input.

**Subhead:**

> The mathematics of inbound demand have shifted. A lead's economic
> value decays on a curve, not a step function — and the curve steepens
> every year as response expectation compresses.

**Three rows, each a single statistic + a single operational
interpretation:**

| Row | Slot | Operational interpretation |
|---|---|---|
| **A — Decay curve** | §5.2.D | "An inbound lead is not a lead. It is a depreciating asset." |
| **B — After-hours economics** | §5.2.E | "Hours 17:00–08:00 are not 'after hours'. They are the largest revenue surface most service businesses operate without coverage." |
| **C — Labor parity** | §5.2.F | "A front-office FTE costs $[X] fully loaded. ResponseOS is not a replacement — it is the only way to give that FTE the leverage to operate at scale." |

**Closing principle line:**

> ResponseOS is not faster follow-up. It is the operational layer that
> turns inbound demand from a depreciating asset into a recoverable one.

**Visual treatment:** Three horizontal rows on desktop, stacked on
mobile. Each row reads like a research note, not a feature card.
Numbers in `Space Grotesk` (the existing metric typeface). One color
accent (`--aj-blue-bright`) for emphasis — no rainbow.

### 3.5 NEW section — "Before vs After" operational frame

This is *not* a feature comparison table. It is an **operational
state** comparison — two columns describing what the front office
*looks like* before and after the infrastructure exists.

**Eyebrow:** `Operational State`

**Headline:** "What changes is not the team. What changes is what the team
sees."

**Two columns, narrative paragraphs (not bullet lists):**

| Before | After |
|---|---|
| The front-office operator opens five tools each morning to reconstruct what happened overnight. High-intent inquiries are mixed with newsletter replies. Missed calls have no recovery path. Qualification is intuition under time pressure. The founder is consulted for every ambiguous lead. | One inbound surface. Every inquiry timestamped, scored, and routed. Recovery cadence runs automatically against intent and offer. The operator works the calls worth working. The founder sees only what requires founder judgment. |

**Visual treatment:** Two-column split on desktop, dark left / light
right (mirroring the existing `LightProofSection` clarity-layer
convention). This section is *narrative density*; it is allowed more
words than any other section on the page.

### 3.6 FAQ — objection handling upgrade

Keep the four existing FAQs. Add two more, drawn directly from the
operational economics framing:

| Question | Answer (premium, anti-hype) |
|---|---|
| "Will this replace my receptionist or SDR?" | No. ResponseOS gives an existing operator the leverage to handle the volume of demand the business is currently *failing* to handle. The cost of the system is measured against recovered revenue, not against headcount. |
| "How is this different from a missed-call text-back tool?" | A missed-call text-back tool reacts to one channel. ResponseOS is the operational layer beneath all inbound channels — it consolidates capture, qualification, routing, and recovery into a single system with memory. The text-back is one output, not the product. |

### 3.7 Page-level CTA strategy

- **Primary CTA throughout:** "Calculate Lost Revenue" → /roi-calculator.
  This is the conversion engine. Every section should drive there.
- **Secondary CTA:** "Book a Call" → /book-a-call. Only the hero and
  the final CTA carry this. Mid-page CTAs are calculator-only.
- **No "Try ResponseOS" or "Start a Trial" language anywhere.**
  ResponseOS is scoped, not signed up for.

---

## 4. ReKonr OS page architecture

### 4.1 What ReKonr OS is — and is not

This section is the most important paragraph in this document. Get
this wrong and the entire product line is miscategorized.

**ReKonr OS is the operational cognition layer of the Founder
Intelligence Systems™ architecture.** It reconstructs operational
context from the artifacts the business already produces — CRM
history, email, calls, meetings, documents, founder dictation, Slack,
delivery notes — and makes that context queryable, durable, and
operationally usable.

It is **business memory infrastructure**. It is the back-of-house
counterpart to ResponseOS:

| | ResponseOS | ReKonr OS |
|---|---|---|
| Layer | Front-of-house | Back-of-house |
| Job | Recover revenue at the point of inbound failure | Reconstruct operational context so failure points become visible |
| Pain it removes | Missed inquiries, slow follow-up, no recovery memory | Founder overload, scattered knowledge, duplicated work, CRM decay |
| Buyer's existing comparison set | Receptionist services, missed-call text-back tools, lead-response SaaS | None — operators do not currently buy this category from anyone |
| Wedge urgency | Quarterly revenue leak — visible | Long-tail operational drag — felt, not seen |

ReKonr OS is the **second product**, not the first. ResponseOS earns
the meeting. ReKonr OS earns the multi-year posture.

### 4.2 What ReKonr OS is NOT — banned framings

The single biggest commercial risk of ReKonr OS is that the casual
reader categorizes it as a chatbot. **It is not a chatbot.** Banned
vocabulary on the ReKonr OS page, in meta tags, in JSON-LD, in
sitemap descriptions, and in any internal-link anchor text:

| Banned | Why |
|---|---|
| chatbot, "AI chatbot", "AI assistant" | Wrong category — collapses ReKonr OS into a saturated commodity space. |
| receptionist, virtual receptionist, AI receptionist | Belongs to ResponseOS's adjacent category, not this one. |
| customer support, support agent | Wrong audience — this is operator-facing, not customer-facing. |
| knowledge base, KB, FAQ bot | Trivializes the cognition layer into a documentation tool. |
| "ask your data" | Generic AI vendor slogan; collapses the category. |
| "second brain", "Notion for X" | Consumer productivity framing — wrong altitude. |
| "agent that learns" | Hype framing; reads as marketing, not infrastructure. |

### 4.3 The category sentence

> **ReKonr OS is Business Memory Infrastructure for founder-led
> operations.**

Each word is load-bearing:

- **Business Memory** — operators do not buy "AI knowledge tools".
  They buy systems that remember what their business has already
  done. Memory is a known, valued category. AI is the implementation
  detail.
- **Infrastructure** — same posture as ResponseOS. Not a tool, not an
  app. The buying frame is *operational dependency*, not experiment.
- **Founder-led operations** — narrows the buyer. Aligns with the
  rest of the AudioJones ICP.

### 4.4 The five framings (used interchangeably across the page)

Each framing illuminates a different operator pain. Rotate them across
sections; do not blend them into one paragraph.

| Framing | Use when surfacing… |
|---|---|
| **Business Memory Infrastructure** | The headline / category surface. |
| **Operational Reconstruction Intelligence** | The diagnostic value — explaining what happened, why pipeline stalled, why a deal slipped. |
| **Signal Extraction Infrastructure** | The continuous-operation value — turning scattered organizational input into usable signal. |
| **Founder Operational Clarity System** | The emotional framing — naming the founder overload pain. |
| **Organizational Intelligence Layer** | The architectural framing — explaining how it sits beneath the rest of the agent ecosystem. |

### 4.5 Page narrative architecture

```
1. SignalHero — "Your business already knows the answer."
2. The Reconstruction Problem        — operator pain, named (§4.6)
3. Five Forms of Operational Memory  — conceptual model (§4.7)
4. How ReKonr OS Works               — capture / reconstruct / extract / serve
5. The Economics of Memory Loss      — operational economics (§4.8)
6. Before vs After (operational state)
7. FAQ — banned-category disambiguation
8. FinalCta
```

### 4.6 "The Reconstruction Problem" section

**Eyebrow:** `The Cognitive Tax`

**Headline:** "The business already knows. It just cannot remember
together."

**Subhead:**

> Founder-led businesses do not lack information. They lack a way to
> reconstruct it on demand. Every operator decision compresses against
> the same constraint: the context lives in too many places, in too
> many heads, in too many channels.

**Four operator pain points — each one sentence, no icons, no
illustrations:**

1. **Founder bottleneck.** Every non-trivial decision routes back to
   one person who holds the operational history in their head.
2. **CRM decay.** The system of record describes the past in
   structured fields and the present in nobody's hands.
3. **Duplicated work.** The team rebuilds the same context every time
   a lead, project, or client re-enters the pipeline.
4. **Knowledge loss at handoff.** Every employee transition, every
   contractor rotation, every founder vacation costs operational
   memory that nobody priced.

**Closing line:**

> This is not a tooling problem. It is an absence of operational
> memory.

### 4.7 "Five Forms of Operational Memory" — conceptual model

This is ReKonr OS's equivalent of the Signal vs Noise model — a
**conceptual anchor** that makes the category legible. It is the
single most important visual section on the page.

**Five horizontal panels (desktop) or stacked cards (mobile):**

| Layer | One-line definition |
|---|---|
| **Transactional memory** | What the business did — orders, invoices, deliveries, retentions. |
| **Relational memory** | Who the business knows — clients, vendors, past leads, lapsed accounts. |
| **Decisional memory** | What the business chose — pricing exceptions, scope changes, contractual nuance. |
| **Operational memory** | How the business runs — playbooks, exceptions, the way things are actually done. |
| **Founder memory** | What the founder knows — the unwritten context that lives in one head. |

**Closing principle line (gold-pill, mirrors SignalNoiseModel):**

> ReKonr OS reconstructs all five into a single operational layer the
> business can query and act on.

**Visual treatment:** Five thin vertical panels on desktop with subtle
tonal progression — gold at the transactional end, blue at the
founder-memory end (mirroring the existing token palette in
`docs/DESIGN.md` §4). Each panel is sparse. The conceptual model is
the proof, not the chrome.

### 4.8 "The Economics of Memory Loss" section

**Eyebrow:** `Operational Economics — Cognitive Tax`

**Headline:**

> Operating without business memory is a tax. It is also priceable.

**Three rows — same architectural rhythm as the ResponseOS economics
section (§3.4), different evidence base:**

| Row | Slot | Operational interpretation |
|---|---|---|
| **A — Context reconstruction time** | §5.3.A | "Operators spend a measurable fraction of every working day rebuilding context that already exists somewhere in the business." |
| **B — Knowledge attrition at exit** | §5.3.B | "Every employee or contractor transition writes off operational memory that took months to accumulate." |
| **C — Founder cognitive load** | §5.3.C | "The founder's most expensive output is judgment. Reconstruction work crowds it out." |

**Closing principle line:**

> ReKonr OS does not make the business smarter. It stops the business
> from forgetting what it already knows.

### 4.9 Visual storytelling concepts

The page should *feel* like a Palantir Gotham product surface — calm,
gridded, slightly cinematic, but never busy. Visual ideas to brief
into design:

1. **Reconstruction diagram.** A scatter of small grey nodes
   (emails, calls, documents, CRM entries, Slack messages) resolving
   into a single luminous blue lattice. The lattice is the
   reconstruction — the metaphor is forensic, not decorative.
2. **Memory layers diagram.** A horizontal stack of the five
   memory forms in §4.7, with a thin vertical "query line" running
   through them — visualizing the cross-layer reconstruction.
3. **Temporal axis treatment.** ReKonr OS works *across time*; the
   page should subtly carry a horizontal-time motif (faint timeline
   strokes in section dividers) without ever drawing a literal
   timeline component.
4. **No agent / character illustration.** ReKonr OS is impersonal
   infrastructure. No avatar, no "meet your AI" framing.

### 4.10 CTA strategy

- **Primary CTA:** "Start the Operational Diagnostic" →
  /ai-readiness-diagnostic.
- **Secondary CTA:** "Book a Strategy Call" → /book-a-call.
- **No ROI calculator link from ReKonr OS pages.** The ROI calculator
  is anchored to ResponseOS's revenue-leak math; routing ReKonr OS
  traffic into it dilutes the calculator's diagnostic precision. A
  separate ReKonr OS readiness instrument can be scoped later.

### 4.11 Adding ReKonr OS to the agent grid

Update `src/data/audiojones-design.ts → agentSystems` to insert
ReKonr OS — recommended slot: position 2 (immediately after
ResponseOS, before SignalOS), so the front-of-house / back-of-house
pairing reads as architecturally intentional.

```text
1. ResponseOS    — Revenue Recovery Infrastructure
2. ReKonr OS     — Business Memory Infrastructure   ← NEW
3. SignalOS      — Business Signal Clarity
4. ContentOS     — Authority Operations
5. ClientOS      — Delivery Operations
6. SalesOS       — Pipeline Operations
```

(`PodcastOS` to be reviewed separately — see §7.4.)

ReKonr OS card description (one sentence, for the grid):

> Business memory infrastructure that reconstructs operational context
> from the artifacts the business already produces — so the founder
> stops being the system of record.

---

## 5. AI Workforce Economics Index — integration map

### 5.1 Statistics safe for homepage usage

The homepage is the most expensive surface. Only statistics that meet
**all four** of the following criteria belong above the diagnostic CTA:

1. Defensibly cited (peer-reviewed, government, or named research org).
2. Directional, not point-specific (ranges over single numbers where
   the underlying research permits).
3. Operationally interpretable in under twelve words.
4. Not industry-specific (the homepage serves the full ICP).

**Slots required from the AI Workforce Economics Index dataset.** Every
slot maps to a row in [`citations.md`](./citations.md). No statistic ships
to the homepage until the linked claim transitions from `PROVISIONAL` to
`VERIFIED` per the intake checklist in `citations.md` §10.

| Slot | Surface | Statistic category | Required form | Claim ID |
|---|---|---|---|---|
| §5.1.A | Hero subline (§2.3) | Lead-value decay vs. time-to-response | One number, single source, ≤14 words. | [`AJW-001`](./citations.md#ajw-001--lead-response-time-decay-5-minute-window) |
| §5.1.B | "The Cost of the Gap" — col. 1 | Lead response time economics | One number + source, single sentence interpretation. | [`AJW-001`](./citations.md#ajw-001--lead-response-time-decay-5-minute-window) (reuse, different framing) |
| §5.1.C | "The Cost of the Gap" — col. 2 | Fully-loaded front-office labor cost (median) | One number + source, framed as "operating context", not "alternative". | [`AJW-002`](./citations.md#ajw-002--fully-loaded-receptionist--front-office-labor-cost) |
| §5.1.D | "The Cost of the Gap" — col. 3 | Founder/operator time spent on context reconstruction | One number + source, framed as cognitive tax. | [`AJW-003`](./citations.md#ajw-003--knowledge-worker-context-reconstruction-time) |
| §5.1.E | ResponseOSWedge muted CTA line (§2.5) | Median quarterly revenue leak — service businesses | Range, two-source minimum, framed conservatively. | [`AJW-004`](./citations.md#ajw-004--quarterly-revenue-leak--founder-led-service-businesses) — methodology required |

### 5.2 Statistics for the ResponseOS page

The ResponseOS page can carry **higher statistic density** than the
homepage because the buyer has already self-selected into the
revenue-recovery frame.

| Slot | Surface | Statistic category | Claim ID |
|---|---|---|---|
| §5.2.A | "The Leak" — Inbound scatter card | Average number of inbound channels per SMB | [`AJW-005`](./citations.md#ajw-005--inbound-channel-fragmentation-per-smb) |
| §5.2.B | "The Leak" — Qualification card | Qualification accuracy under volume / time pressure | [`AJW-006`](./citations.md#ajw-006--qualification-accuracy-under-volume--time-pressure) — TBD, gated on intake |
| §5.2.C | "The Leak" — Recovery card | % of lapsed leads never re-engaged | [`AJW-007`](./citations.md#ajw-007--lapsed-leads-never-re-engaged) |
| §5.2.D | Economics — Decay curve | Time-to-response value-decay curve (graphable) | [`AJW-008`](./citations.md#ajw-008--response-time-decay-curve-graphable) |
| §5.2.E | Economics — After-hours | Share of high-intent inquiries arriving outside business hours | [`AJW-009`](./citations.md#ajw-009--after-hours-inbound-share) + [`AJW-010`](./citations.md#ajw-010--missed-call-rate-inbound-voice) |
| §5.2.F | Economics — Labor parity | Fully-loaded receptionist / SDR / front-office FTE cost | [`AJW-002`](./citations.md#ajw-002--fully-loaded-receptionist--front-office-labor-cost) (reuse) |

Maximum total on the page: **six**. Anything beyond six on the
ResponseOS page begins to read as a deck, not a product surface. If
`AJW-006` does not transition out of `TBD` at intake, drop the slot
rather than soften the language — five strong stats are stronger than
six mixed-quality ones.

### 5.3 Statistics for the ReKonr OS page

The ReKonr OS page can carry **the highest statistic density on the
site**, because the buyer cannot yet *feel* the cost the way they feel
inbound revenue leak. Statistics do the price-making work that
intuition does for ResponseOS.

| Slot | Surface | Statistic category | Claim ID |
|---|---|---|---|
| §5.3.A | Economics — Context reconstruction | Knowledge-worker / operator daily time spent on context reconstruction | [`AJW-003`](./citations.md#ajw-003--knowledge-worker-context-reconstruction-time) (reuse, ReKonr-specific framing) |
| §5.3.B | Economics — Knowledge attrition | Cost of employee turnover attributable to knowledge loss | [`AJW-011`](./citations.md#ajw-011--employee-turnover-knowledge-loss-cost) |
| §5.3.C | Economics — Founder cognitive load | Founder time spent on operational reconstruction (survey-based, cited) | [`AJW-014`](./citations.md#ajw-014--founder-operational-cognitive-load) — TBD, cohort survey required |
| §5.3.D | Reconstruction Problem section | CRM data decay rate per year (industry benchmark) | [`AJW-012`](./citations.md#ajw-012--crm-data-decay-rate) |
| §5.3.E | Five Forms of Operational Memory — closing | % of operational knowledge that lives in unstructured / non-system locations | [`AJW-013`](./citations.md#ajw-013--unstructured-share-of-enterprise-data) |
| §5.3.F | FAQ — disambiguation | Reference to category research distinguishing memory infrastructure from chatbots / KBs | [`AJW-015`](./citations.md#ajw-015--category-disambiguation--memory-infrastructure-vs-chatbots--kbs) — TBD, analyst publication required |

Maximum total on the page: **eight**. The page is research-led; this
is the one surface where research density is the proof. The two `TBD`
slots (`AJW-014`, `AJW-015`) are *gated on intake* — if either does not
transition to `PROVISIONAL` with a defensible anchor before
implementation, the corresponding section ships without the citation
rather than borrowing a weaker source.

### 5.4 Statistics best reserved for deeper surfaces

Some research is too granular for the marketing surface. Route these
to `/insights` long-form essays or to gated PDF research notes (a
plausible 2026Q3 deliverable):

- Industry-specific labor cost tables (HVAC, dental, legal, agency, etc.).
- Geographic variation in response-time economics.
- Year-over-year deltas in any of the above.
- Vendor-specific benchmarks (any data tied to a named SaaS competitor).
- Cohort-level retention math.

These statistics, on the marketing surface, *cheapen* the brand —
they read as competitive comparison rather than research. Keep them
in long-form.

### 5.5 The citation contract

**This is non-negotiable.** Every statistic on every surface must
satisfy all of:

1. **Footnoted on the page** with a superscript that resolves to a
   citation block (either inline at section end or on a dedicated
   `/research` page — recommend the latter for premium posture).
2. **Sourced to either** (a) a peer-reviewed publication, (b) a named
   government or supranational dataset, (c) a recognized research
   institution, or (d) AJ Digital LLC's own published research (when
   the AI Workforce Economics Index itself is the source).
3. **Conservative in framing.** Where the underlying research gives a
   range, the page cites the *lower* end. Premium positioning is
   destroyed faster by one inflated number than by ten cautious ones.
4. **Dated.** Year-of-publication appears in the citation. Statistics
   older than 36 months without re-publication get retired.
5. **Reviewable.** A single [`citations.md`](./citations.md) ledger
   tracks every statistic on the site, its source, its surface, and
   its review date. This is the data room. The ledger schema and
   intake checklist are authoritative — claims do not ship to a
   marketing surface until they pass the `PROVISIONAL → VERIFIED`
   transition in `citations.md` §10.

---

## 6. CTA system, objection map, executive framing

### 6.1 CTA hierarchy across the site

| Tier | Label | Destination | Where it appears |
|---|---|---|---|
| **Hard primary** | "Calculate Lost Revenue" | /roi-calculator | ResponseOSWedge, ResponseOS page (every section CTA). |
| **Hard secondary** | "Start the Operational Diagnostic" | /ai-readiness-diagnostic | Hero, ReKonr OS, ProcessPipeline. |
| **Soft secondary** | "Book a Call" | /book-a-call | Final-CTA position, FAQ-adjacent, hero secondary on product pages. |
| **Editorial exit** | "Read the research" | /research (new, see §7.4) | Footnote rows, citation strip beneath ProofStats. |

There are exactly four CTAs site-wide. **Adding a fifth dilutes all
four.**

### 6.2 Premium CTA copy — preferred and banned

| Use | Avoid |
|---|---|
| Calculate Lost Revenue | Get Started |
| Start the Operational Diagnostic | Take the Quiz |
| Book a Call | Get a Demo |
| Explore ResponseOS | Try ResponseOS |
| Read the Research | Download the Free Guide |
| See the System | Watch a Walkthrough |

### 6.3 Executive objection map

The premium buyer carries five objections. Each has a planted answer
on the site:

| Objection | Where the page answers it |
|---|---|
| "This is AI hype repackaged." | Signal vs Noise model + citation-backed economics sections. |
| "We already have tools that do this." | "Do not buy another tool before you know the leak." (`/agents` Light Proof Section — keep as-is). |
| "AI is going to replace my team." | "What changes is not the team. What changes is what the team sees." (§3.5). |
| "I do not have time for an implementation." | ProcessPipeline — Diagnose / Design / Deploy. Already in place. |
| "Show me ROI before I commit." | ROI calculator + the cited revenue-leak range in §2.5. |

### 6.4 Banned language — site-wide

Reinforces `docs/DESIGN.md` §2 and §8. Strict.

- unlock, harness, supercharge, revolutionize, transform, empower
- AI-powered, AI-driven, AI-enabled (as standalone adjectives)
- "future-proof", "next-gen", "cutting-edge"
- "replace your staff / employees / receptionist / SDR"
- "fire your", "no more"
- "10x", "100x", any unspecified multiplier
- "skyrocket", "explode", "crush it"
- emoji decoration in headers or CTAs
- "Limited time", "Act now", "Don't miss out"

If any of these appear in a draft, the draft is rejected at intake.

### 6.5 Executive framing — the three sentences

When a premium buyer asks "what is Audio Jones", any one of these
sentences should be available depending on altitude:

| Altitude | Sentence |
|---|---|
| **Investor / board** | "Audio Jones builds Founder Intelligence Systems™ — operational infrastructure that converts founder expertise into compounding operational leverage for businesses in the $250K–$5M revenue band." |
| **Operator / founder** | "Audio Jones installs the intelligence layer founder-led businesses are operating without: a revenue recovery system at the front of the house, and a business memory system at the back." |
| **Casual / one-line** | "Operational intelligence consulting for founder-led businesses. Signal over noise." |

All three are usable verbatim in collateral, email signatures, and
press positioning.

---

## 7. Implementation order, governance, and citation contract

### 7.1 Recommended implementation priority

Sequenced for compounding lift — each phase enables the next.

| # | Work | Surface | Why this order |
|---|---|---|---|
| **1a** | Citation ledger — schema + PROVISIONAL anchor population | [`docs/strategy/citations.md`](./citations.md) | **Complete** as of ledger v0.1. Schema in place; 16 claim rows seeded with public anchors where available, TBD slots marked. |
| **1b** | Research dataset intake — transition rows from PROVISIONAL → VERIFIED | `docs/strategy/citations.md` | Gated on AI Workforce Economics Index dataset delivery. **Nothing on the public surface ships until the linked claims for that surface transition out of `PROVISIONAL`.** |
| **2** | Hero subline statistic (§2.3) | Homepage | Lowest-cost change, highest above-the-fold signal lift. Gated on `AJW-001` VERIFIED. |
| **3** | "Cost of the Gap" section (§2.4) | Homepage | The central architectural insertion. |
| **4** | ResponseOSWedge CTA augmentation (§2.5) | Homepage | Bridge to product page. |
| **5** | ProofStats citation row (§2.6) | Homepage | Trust posture upgrade. |
| **6** | ResponseOS page upgrade (§3) | /agents/responseos | Convert the wedge. |
| **7** | ReKonr OS page launch (§4) + add to agentSystems (§4.11) | /agents/rekonr-os (new) | Open the second product line. |
| **8** | /research surface (§7.4) | /research (new) | Posture; supports footnotes. |
| **9** | Insights long-form integrations (§5.4) | /insights | Distribute deep research; SEO/AEO compounding. |

Phases 2–6 are scoped to a single PR each. Phase 7 is its own
feature branch (`feat/rekonr-os-v1`).

### 7.2 Surfaces explicitly out of scope

The following surfaces are *not* in this strategy and should not be
modified as a side-effect:

- `/portal/*`, `/api/admin/*` (legacy, being phased out — `docs/PRD.md` §1)
- `/blog/*` (legacy marketing surface — `docs/DESIGN.md` §3)
- `/services` (its own rebrand spec exists — `docs/specs/services-rebrand-spec-2026-05-08.md`)
- `/case-studies` (data dependency on consent flow; needs separate spec)
- `/workshops`, `/apply`, `/step-2` (downstream funnel, separate scope)

### 7.3 Validation contract per phase

Per `AGENTS.md` §4 and `CLAUDE.md`, every code-touching phase must
pass before review:

```bash
pnpm typecheck
pnpm lint
pnpm check:no-firebase
pnpm build
```

Strategy-only PRs (this one included) skip those checks but must still
land on a feature branch and open as draft.

### 7.4 New surfaces this strategy implies

Two new routes, scoped here and to be specced separately before
implementation:

1. **`/agents/rekonr-os`** — full page per §4. Spec it as
   `docs/codex/rekonr-os-v1-brief.md` following the format of
   `docs/codex/responseos-v1-brief.md`.
2. **`/research`** — citation directory and AI Workforce Economics
   Index landing. Premium-formatted research index, no lead
   capture, no gated PDFs. Posture surface only. Spec it as
   `docs/specs/research-surface-spec.md`.

`PodcastOS` should be reviewed for relevance before the ReKonr OS
launch — it predates the Founder Intelligence Systems™ architecture
and may not belong in the agent grid at all. Recommendation: flag for
audit, do not modify in this scope.

### 7.5 The citation ledger

Create `docs/strategy/citations.md` as part of phase 1. Schema:

```yaml
- id: 1
  surface: "homepage / hero subline"
  statistic: "[exact wording as it appears on the page]"
  value: "78%"
  source_title: "[publication title]"
  source_org: "[publishing organization]"
  publication_date: "YYYY-MM"
  source_url: "https://..."
  retrieved: "2026-05-21"
  next_review: "2027-05-21"
  notes: "[methodology caveats; why this number was chosen over alternatives]"
```

Every footnote on every page resolves to a row in this ledger. No
exceptions. This is the data room.

### 7.6 Governance — what stays out of code

This strategy doc itself stays in `docs/strategy/`. The page-level
specs (§7.4) live in `docs/codex/` and `docs/specs/` per the existing
convention. Implementation PRs reference both.

A single one-line entry goes into `docs/CHANGELOG.md` under
**Unreleased / Documentation** referencing this document. Nothing
else changes in the repo from this PR.

---

## 8. Appendix — Premium copy examples

These are reference voice samples, not finished copy. They show the
register the implementation drafts should hit. Final copy is drafted
against this voice plus the live research dataset.

### 8.1 Hero subline (homepage)

> ```
> RESEARCH NOTE — AI WORKFORCE ECONOMICS INDEX
> ```
> An inbound lead loses [XX]% of its operational value within five
> minutes of arrival.¹

Footnote 1 → [`AJW-001`](./citations.md#ajw-001--lead-response-time-decay-5-minute-window).

### 8.2 "Cost of the Gap" — opening line

> Three economic forces are reshaping what it costs to run a
> founder-led business in 2026. Each is now measurable. None are
> theoretical.

### 8.3 ResponseOSWedge muted CTA line

> Median founder-led service business loses $[XX,XXX]–$[XX,XXX] per
> quarter to follow-up gaps before a system is installed.²

Footnote 2 → [`AJW-004`](./citations.md#ajw-004--quarterly-revenue-leak--founder-led-service-businesses). Methodology and numerics both pending — this line does not ship until `AJW-004` transitions to `VERIFIED`.

### 8.4 ResponseOS — Economics section closing

> ResponseOS is not faster follow-up. It is the operational layer
> that turns inbound demand from a depreciating asset into a
> recoverable one.

### 8.5 ReKonr OS — hero candidate

> ```
> BUSINESS MEMORY INFRASTRUCTURE
> ```
> ## Your business already knows the answer.
> It just cannot remember together.
>
> ReKonr OS reconstructs operational context from the artifacts your
> business already produces — so the founder stops being the system
> of record.

### 8.6 ReKonr OS — Economics section closing

> ReKonr OS does not make the business smarter. It stops the
> business from forgetting what it already knows.

### 8.7 The three-sentence framing (reusable in any collateral)

> Operational intelligence consulting for founder-led businesses.
> Front of the house: a system for recovering the revenue your
> follow-up is losing. Back of the house: a system for reconstructing
> the operational memory your business is losing. Signal over noise.

---

## 9. Sign-off requirements before any implementation begins

This strategy is not actionable in code until:

1. The AI Workforce Economics Index research dataset is shared with
   the strategy team (statistics, sources, methodology, license). **Not
   yet received.**
2. [`citations.md`](./citations.md) ledger transitions the homepage
   claim rows (`AJW-001`, `AJW-002`, `AJW-003`, `AJW-004`) from
   `PROVISIONAL` to `VERIFIED` per the intake checklist in
   `citations.md` §10. **Schema is in place (ledger v0.1, this PR); row
   verification is pending dataset intake.**
3. The owner of `/research` surface is named (recommendation: AJ
   Digital LLC research function, not the website team). **Not yet
   named.**
4. The ReKonr OS naming is confirmed in trademark posture — the
   page architecture in §4 assumes the brand mark holds. **Not yet
   confirmed.**

Until those four are in place, this document is the spec. No
homepage modifications, no `/agents` modifications, no new pages.
