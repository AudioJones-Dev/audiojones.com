---
title: "Codex Brief — ResponseOS v1"
status: "draft, awaiting Phase 2 kickoff"
target_route: "/agents/responseos"
target_branch: "feat/responseos-v1 (TBD by Codex)"
parent_design_doc: "docs/design/DESIGN.md"
related: "docs/codex/roi-calculator-v1-brief.md (precedent), docs/architecture/stack-decision.md"
last_updated: "2026-05-10"
---

# Codex Brief — ResponseOS v1

This brief is a self-contained handoff for the **flagship product narrative
page** of the Audio Jones agents ecosystem. Codex (or whichever agent picks it
up in Phase 2) will read this and implement; this document ships only the
spec, no app code.

**This is a product spec, not marketing copy.** Frame ResponseOS as
infrastructure. The page should read like a Linear / Palantir / Stripe-docs
product surface — operational, system-oriented, restraint-first — not an
agency pitch deck.

---

## 1. Why this exists

ResponseOS is the **wedge product** in the Audio Jones agents ecosystem
(`/agents/{responseos, signalos, contentos, podcastos, clientos, salesos}`).
It will become:

- the highest-converting route on the site
- the strongest commercial SEO/AEO surface
- the primary outbound sales / demo link
- the core attachment point for case studies
- the bridge between Audio Jones consulting and the SaaS positioning

ResponseOS earns wedge status because it has, more clearly than the other
OSes, all five conditions of a sellable product:

| Condition | ResponseOS evidence |
|---|---|
| Measurable pain | Missed calls / delayed follow-up have concrete dollar value per lead |
| Obvious buyer | Founder-led service businesses with inbound volume they can't service |
| Operational urgency | Every hour after-hours = quantifiable lead leakage |
| Demoable surface | Inbound flows are observable; the "before" state is the operator's current voicemail box |
| Commercial search intent | Operators search for "missed call text-back", "speed-to-lead", "after hours phone answering" — high-intent terms |

The other OSes are real products too, but they're **education-led** (SignalOS
sells the framework before the system; ContentOS sells the audit before the
engine). ResponseOS sells the recovered revenue directly.

---

## 2. Strategic positioning — read this before writing a single word

### The category sentence

**ResponseOS is Revenue Recovery Infrastructure for founder-led businesses.**

That sentence is the brief. Every word matters:

- **Revenue Recovery** — not lead generation, not customer service, not AI
  automation. The job is recovering revenue that is currently being lost. That
  framing puts it in the same mental category as fraud-recovery, A/R-recovery,
  and dunning systems — categories operators already pay for, where ROI is
  obvious.
- **Infrastructure** — not a tool, not a chatbot, not an app. Infrastructure
  is something you build a business on top of. Operators buy infrastructure
  with multi-year posture; they buy tools with quarterly skepticism. This word
  shifts the buying frame from "AI experiment" to "operational dependency".
- **Founder-led businesses** — narrows the buyer. Disqualifies enterprise
  procurement cycles. Aligns with the rest of the Audio Jones ICP
  (`docs/architecture/stack-decision.md` and the wider site framing).

### What ResponseOS is NOT

Do not use any of these words on the page, in metadata, or in JSON-LD:

| ❌ Banned framing | Why it's wrong |
|---|---|
| AI chatbot | Commodity category, race-to-the-bottom pricing, dismissed by operators who've already bought one and gotten nothing |
| AI assistant | Implies the user does the work and the AI helps. Operators don't want an assistant; they want their phone to stop being a leak |
| AI receptionist | Anthropomorphises a system into a role and immediately compresses pricing to "less than a human receptionist" |
| Smart automation | "Smart" is what 2018 SaaS sold. Operators have heard it 10,000 times |
| AI-powered CRM | Wrong category. ResponseOS feeds the CRM; it isn't one |
| Conversational AI | Feature-language, not product-language |
| Lead capture tool | Ten thousand of these exist; commodity |
| 24/7 answering service | True functionally, but defines the product down to one feature |

### The narrative spine

> Founder-led businesses are losing revenue not because demand is weak but
> because their human response systems break under operational load. The
> phone goes unanswered. The web form sits in an inbox. The voicemail piles
> up. The lead cools. By the time anyone responds, the operator has already
> lost — even if they didn't know they had a fight.
>
> ResponseOS closes the gap between inbound demand and revenue capture. It
> answers the call, qualifies the lead, routes it to the right person,
> books the appointment, follows up if nobody books, and reports on every
> lost-and-recovered dollar. It is infrastructure: it runs whether or not
> anyone is paying attention to it.

That is the narrative the page must telegraph in the first 100 vertical
pixels. Hero copy, sub-copy, primary CTA, and proof strip should all reinforce
it.

---

## 3. Target branch + scope discipline

### Target branch

`feat/responseos-v1` (Codex names the actual branch when it picks this up).

### Phase 2 scope

This brief defines the **flagship page** at `/agents/responseos` plus the
**index page** at `/agents`. Both must ship in the same PR so the Agents
ecosystem feels coherent on launch.

The other OS pages (`signalos`, `contentos`, `podcastos`, `clientos`,
`salesos`) ship as **light placeholders** with one-sentence positioning, in a
SEPARATE follow-up PR. Do not deepen them in v1 — they don't have product
clarity yet, and shipping them deep would dilute ResponseOS's wedge effect.

### Anti-goals

- ❌ No new fonts (DESIGN.md §15)
- ❌ No new color tokens (work within `--bg-0..4`, `--fg-0..3`, `--signal`,
  `--system`, `--metric`)
- ❌ No nav restructure — `mainNav` is locked by the 2026-05-10 restructure
  (`src/config/nav.ts`). Add `Agents` placement only if the restructure PR
  hasn't already landed; otherwise the slot is reserved
- ❌ No CTA destination changes site-wide. ResponseOS CTAs flow through
  `ctaLinks.bookSession` → `/book-a-call` and `ctaLinks.signalDiagnostic` →
  whichever route is canonical when v1 ships
- ❌ No Stripe integration on the page. Pricing is **posture**, not
  checkout (see §9). (Whop was removed site-wide on 2026-06-08.)
- ❌ No demo functionality in v1. `/agents/responseos/demo` is documented in
  §11 as a follow-up; this PR does not implement it
- ❌ No live phone/SMS infrastructure on the page. The page describes the
  product; it does not run the product
- ❌ No Firebase, no env-file changes, no analytics integrations
  (`docs/architecture/stack-decision.md` is the binding constraint)

### Decisions locked

These are not Codex-decision-time questions. They are settled and informational:

- **Page route:** `/agents/responseos` (not `/products/...`, not `/systems/...`)
- **Index route:** `/agents` (lists all six OSes)
- **Category framing:** "Revenue Recovery Infrastructure" — verbatim, not
  paraphrased
- **Buyer:** founder-led service businesses, $250K–$5M annual revenue, with
  inbound phone/web/SMS volume that exceeds their staffed capacity
- **Funnel role:** ResponseOS is the conversion page. CTAs go to `/book-a-call`
  primary, `/roi-calculator` secondary

---

## 4. Page architecture

The page is a **vertical product narrative**. Every section earns its scroll
distance by either reframing the problem, demonstrating the system, or
forcing a buying decision. No filler.

```
/agents/responseos
│
├── 1. Hero
│     Eyebrow: "Revenue Recovery Infrastructure"
│     H1: short, declarative, problem-anchored (not a pun, not a tagline)
│     Sub: the §2 narrative spine compressed to 1–2 sentences
│     Primary CTA: Book a Call → /book-a-call (variant="glow")
│     Secondary CTA: Calculate Lost Revenue → /roi-calculator (variant="secondary")
│     Trust strip below CTAs: 3–5 industry/category badges, monochrome
│
├── 2. Missed Revenue Problem
│     Editorial section. 1 H2 + 3–4 paragraphs.
│     Frame: missed inbound is not a service problem, it's a revenue problem.
│     Cite at least one operator-language stat: "X% of inbound calls go
│     unanswered after 3pm in [industry]" — sourced if possible, structurally
│     accurate if not
│
├── 3. The Cost of Slow Follow-Up
│     Numeric block. 3 large stat cards in the analytical-card pattern
│     (border-[var(--line-2)] bg-bg-2 rounded-2xl, p-6).
│     Each stat: signal-orange numeral + gold eyebrow + 1-line description.
│     Examples (operators must verify before launch):
│       "78% drop in conversion when first response > 5 minutes"
│       "$X average lead value × Y missed/month = $Z monthly leak"
│       "After-hours inbound: ~30% of total volume in service businesses"
│
├── 4. How ResponseOS Works
│     The system narrative — six lifecycle stages. Each stage is one card
│     or one line in a horizontal pipeline diagram (see §5).
│     Stages, in order:
│       1. Capture     — inbound across SMS, voice, web, missed call
│       2. Qualify     — intake logic, ICP filtering, intent scoring
│       3. Route       — to the right operator, location, or queue
│       4. Recover     — missed-call text-back, after-hours flow,
│                        re-engagement on cold leads
│       5. Re-engage   — scheduled follow-up if no booking action
│       6. Attribute   — every recovered dollar tied to its source
│
├── 5. System Diagram
│     One static SVG (or CSS-grid composition) showing the six stages above
│     with explicit data flow arrows. Inbound on the left, recovered revenue
│     on the right. Visual style: Palantir/Linear infrastructure diagram —
│     monochrome with one signal-orange highlight on the "Recover" stage.
│     This is the single most important asset on the page. It IS the product.
│
├── 6. Features
│     Grid of 8–12 feature cards. Two-line each: feature label + 1 sentence.
│     No icons-as-decoration; if an icon is used, it must carry meaning.
│     Required features list (rearrange/group as the design supports):
│       - Inbound SMS capture
│       - Voice routing + transcription
│       - Missed-call text-back (the wedge feature for AEO terms)
│       - Web form intake unification
│       - CRM sync (HubSpot, Pipedrive, GHL, Salesforce — name the integrations)
│       - Lead routing rules (location, service, time-of-day, urgency)
│       - Calendar booking
│       - Escalation to human
│       - Real-time notifications (Slack, SMS, email)
│       - Reporting dashboard (response time, recovery rate, attributed revenue)
│       - Multi-location support
│       - After-hours flow
│
├── 7. Integrations
│     Logo strip OR labeled chip grid. Not a feature dump — a credibility
│     surface. List ~10 integrations operators recognize. If an integration
│     is planned but not yet shipped, do not include it in v1.
│
├── 8. Industries
│     Vertical-specific framing. Each industry: name + 1-line operational
│     pain + 1-line ResponseOS angle.
│     Priority order (highest fit first):
│       1. Home services (HVAC, plumbing, electrical, roofing)
│       2. Accessibility / lifts / mobility services
│       3. General contractors + trades
│       4. Med spas + aesthetics
│       5. Legal (PI, family, criminal — high inbound volume verticals)
│       6. Marketing/creative agencies (use ResponseOS for client intake)
│       7. Founder-led SMBs (catch-all)
│
├── 9. ROI Snapshot
│     Compact computation block — one paragraph + one inline calculation.
│     Example: "If your average lead is worth $1,200 and you currently miss
│     8 inbound calls per week, ResponseOS's recovery rate of 35% pays for
│     itself in [X] days."
│     CTA below: "Run the full calculation → /roi-calculator"
│     Connects ResponseOS to the existing ROI Calculator surface.
│
├── 10. Case Study Blocks
│     2–3 case study cards. Each: industry chip, headline metric (signal
│     orange), 1-paragraph narrative, attribution line ("[Operator name],
│     [company], [city]" — anonymize until permission granted).
│     If no case studies are available at v1 launch, this section is
│     replaced by a "First-Cohort Operators" placeholder and a CTA to
│     /book-a-call. Do NOT ship a fake case study.
│
├── 11. Pricing Posture
│     One section, one paragraph. NO pricing table. NO "starts at $X".
│     Posture language:
│       - "Setup + recurring infrastructure"
│       - "Engagement, not subscription"
│       - "Priced relative to recovered revenue"
│     CTA: Book a Call → /book-a-call (variant="glow")
│     Why this is the right posture is documented in §9.
│
├── 12. FAQ
│     6–8 questions. FAQPage JSON-LD attached.
│     Question categories:
│       - "How is this different from [competitor category]?"
│         (chatbot, answering service, AI receptionist — name them, refute
│         the framing)
│       - "How long does setup take?"
│       - "What systems does it integrate with?"
│       - "Who owns the data?"
│       - "What happens if it routes a lead wrong?"
│       - "What's the ramp-down if we cancel?"
│       - "Is this HIPAA/GDPR/etc compliant?" (answer: scope-dependent,
│         qualify the buyer)
│
├── 13. CTA
│     Full-width section. Primary glow CTA to /book-a-call. Secondary text
│     link to /roi-calculator. Reuse the homepage's DiagnosticCTA pattern
│     (src/components/home/landing/DiagnosticCTA.tsx) for visual rhythm
│     consistency.
│
└── 14. Related Systems
      RelatedLinks block (src/components/seo/RelatedLinks.tsx — added in
      the SEO audit PR). Cross-link to the other five OSes by category:
        ResponseOS  | Revenue       | (current)
        SignalOS    | Intelligence  | /agents/signalos
        SalesOS     | Pipeline      | /agents/salesos
        ClientOS    | Operations    | /agents/clientos
        ContentOS   | Authority     | /agents/contentos
        PodcastOS   | Media         | /agents/podcastos
      The category column is part of the framing — operators understand
      "this is one of six infrastructure products, each owning a function".
```

### Required visual primitives

All from `src/components/ui/`:

- `Eyebrow` (gold tone for section labels)
- `ButtonLink` (`variant="glow"` for primary, `variant="secondary"` for
  alternate paths)
- DESIGN.md card pattern: `border border-[var(--line-2)] bg-bg-2 rounded-2xl
  p-6 sm:p-10`
- Typography utilities: `t-display-lg` (hero only), `t-h1` / `t-h2` / `t-h3` /
  `t-h4`, `t-lead`, `t-body`, `t-small`, `t-label`
- Color tokens: `text-fg-0` / `text-fg-1` / `text-fg-2`, `text-aj-orange` (one
  signal-orange highlight per major section, max), `text-aj-gold` (eyebrows),
  `text-aj-blue-bright` (secondary system accents)

### Required NEW components

These don't exist yet and should be built scoped to ResponseOS, then
generalised in a follow-up PR if they prove reusable:

- `ResponseOSSystemDiagram` (the §5 SVG/CSS infrastructure diagram)
- `LifecycleStageList` (the §4 six-stage pipeline)
- `IndustryCard` (the §8 vertical-specific framing — could become reusable
  for case studies later)

Do NOT create these as `home/landing/*` components or under any other
namespace. Scope them to `src/components/agents/responseos/` so the wedge
page's components don't pollute the shared UI surface.

---

## 5. /agents index page

Sibling deliverable. Renders alongside ResponseOS in the same PR.

### Frame

`/agents` is **a product ecosystem surface**, not a services catalog. Visual
rhythm reference: Apple's product grid (with restraint), Linear's product
architecture page, Palantir's capability surface.

### Content

```
Hero
  Eyebrow: "Audio Jones Agents"
  H1: "AI infrastructure for the operations of founder-led businesses"
  Sub: 1–2 sentences. The agents ecosystem is the operational layer; each
       OS owns one revenue or workflow function

Six-card grid (3 cols on lg, 2 cols on md, 1 col on sm)
  Each card:
    - Category eyebrow (Revenue / Intelligence / Pipeline / Operations /
      Authority / Media)
    - Product name (t-h3, fg-0)
    - One-sentence positioning
    - Status pill: "Production-ready" (ResponseOS only at v1) /
      "Early access" / "Coming soon"
    - Hover: border lift to var(--line-3)
    - Click → respective /agents/<slug>

Card order (left-to-right, top-to-bottom):
  1. ResponseOS    — Revenue       — Production-ready
  2. SignalOS      — Intelligence  — Early access
  3. SalesOS       — Pipeline      — Coming soon
  4. ClientOS      — Operations    — Coming soon
  5. ContentOS     — Authority     — Coming soon
  6. PodcastOS     — Media         — Coming soon

CTA section
  "Book a working session to map your highest-leverage system."
  Primary: /book-a-call
  Secondary: /roi-calculator
```

The status pills do strategic work — they signal that this is a real product
roadmap, not a brochure. Status reflects reality: only ResponseOS ships in
v1. The others are placeholders. Honest > aspirational.

---

## 6. Why "Revenue Recovery Infrastructure" is the positioning

Codex must internalise this section. It is the categorical frame for every
copy decision on the page.

**Revenue Recovery Infrastructure** does four things at once:

1. **It positions ResponseOS in a buying category operators already fund.**
   Operators have an A/R-recovery line item, a fraud-recovery line item, a
   churn-recovery initiative. They do not have an "AI chatbot" line item —
   AI is a discretionary experiment. Slotting ResponseOS as recovery
   infrastructure moves it from the "AI experiments" budget (defensive,
   small, skeptical) to the "revenue infrastructure" budget (offensive,
   substantial, expected to compound).

2. **It compresses the value proposition into one sentence the operator
   already understands.** "Recovery" implies the loss is happening *now*
   without ResponseOS — which is true. "Infrastructure" implies durable
   load-bearing systems — which is what differentiates this from a tool
   purchase.

3. **It defends pricing posture.** Tools are priced per-seat or per-feature.
   Infrastructure is priced relative to the value it carries. ResponseOS is
   priced relative to recovered revenue. The category language defends the
   posture.

4. **It future-proofs the brand.** When Audio Jones ships SignalOS,
   SalesOS, etc., they're each "infrastructure for [function]". The category
   pattern — `[Function] [Verb] Infrastructure` — extends:
     - Revenue Recovery Infrastructure → ResponseOS
     - Signal Identification Infrastructure → SignalOS
     - Pipeline Operations Infrastructure → SalesOS
     - Client Delivery Infrastructure → ClientOS
     - Authority Compounding Infrastructure → ContentOS
     - Media Production Infrastructure → PodcastOS

That symmetry is the brand asset. Every OS earns its slot by owning one
function in the operational layer.

**Implementation rule for v1:** the phrase "Revenue Recovery Infrastructure"
appears at minimum:

- in the hero eyebrow (verbatim)
- in the page metadata description
- in the OpenGraph + Twitter description
- in the H2 of the §2 "Missed Revenue Problem" section (paraphrased OK)
- in the FAQ answer to "how is this different from a chatbot?"

It should NOT appear:

- in the H1 (the H1 is problem-anchored, not category-anchored)
- in CTA labels (CTAs are action-anchored)
- in the system diagram (the diagram shows the system; it doesn't sell it)

---

## 7. Visual direction

**Reference grammar:** Apple product page restraint × Linear product
architecture × Palantir operational seriousness × dark-first signal
aesthetic.

**Anti-grammar** (per DESIGN.md §16):

- No purple AI gradients
- No glassmorphism beyond the sticky header
- No 3D blobs / particle effects
- No emoji as icon (`<div className="text-4xl">⚡</div>` — banned)
- No "smart automation" decorative lighting effects
- No rotating tagline carousels

**Specific visual choices for ResponseOS:**

- **Hero background:** dark gradient `bg-bg-0 → bg-bg-1` with a single
  signal-orange highlight tied to one element of the system diagram preview.
  No SaaS screenshots in the hero
- **System diagram (§5):** mostly `--fg-2` lines, mostly `--bg-2` boxes, ONE
  `--signal` highlight on the "Recover" stage. The diagram should look like
  it could ship in a Palantir capability deck
- **Stat cards (§3):** signal-orange numerals, gold eyebrows, fg-1 body. One
  hairline border. No shadow stacking
- **Industry section (§8):** monochrome row of industry name + pain + angle.
  No industry logos; industry names alone carry weight
- **CTA buttons:** existing `btn-glow` (signal) for primary, existing
  Tailwind variant-secondary for alternate paths. Do not invent new variants
- **Motion (§DESIGN.md §12):** progressive reveal on scroll for the system
  diagram only. Other sections fade in opacity-only. No bounce, no
  scale-on-hover, no spring physics

---

## 8. Industries — vertical priority order

Order matters for v1 layout (§4 step 8). Each entry is operationally distinct
and each one has its own dollar-per-missed-lead math:

| # | Industry | Operational pain | ResponseOS angle |
|---|---|---|---|
| 1 | Home services (HVAC, plumbing, electrical, roofing) | High inbound volume during business hours, near-zero coverage after hours, dispatch bottlenecks | Capture after-hours leads, qualify by service type + zip, route to on-call tech |
| 2 | Accessibility / lifts / mobility | Long sales cycles, technical qualification, in-home consultations | Intake by accessibility need, qualify by home type + insurance, book in-home assessment |
| 3 | General contractors / trades | Lead arbitrage from ads, no follow-up bandwidth, missed calls = lost bid | Speed-to-lead < 60s, qualify by project size, route to PM |
| 4 | Med spas / aesthetics | Web form leads sit, walk-ins under-served, repeat-customer follow-up | SMS first-response, treatment-specific intake, rebook flow |
| 5 | Legal (PI, family, criminal) | High intent inbound, qualification matters more than volume, after-hours = critical for PI | Intake compliance, conflict-check qualification, urgency-aware routing |
| 6 | Marketing / creative agencies | Operators need ResponseOS for their own client intake | Demo target — if Audio Jones agencies use it, they sell it |
| 7 | Founder-led SMBs (catch-all) | Generic positioning slot for the long tail | Inbound recovery generally |

Pick 4–6 of these for the v1 §8 section. Home services + accessibility +
contractors + med spas is the core. Legal is the high-value optional. Agency
is the meta-buyer. SMB catch-all is the disqualifier check.

---

## 9. Pricing posture (not pricing)

ResponseOS does NOT show prices on the page in v1. The pricing section is
**posture**, not commerce. Reasons:

1. **Pricing is engagement-defined.** Each ResponseOS deployment touches
   different volume tiers, integrations, custom routing logic, and
   compliance scopes. A public price disqualifies high-fit buyers (the
   complex deployments) and attracts low-fit buyers (the
   shopping-around-on-features crowd)
2. **The posture defends the framing.** A subscription price below $500/mo
   compresses ResponseOS into the "tool" category and breaks "infrastructure"
   positioning instantly
3. **The wedge is a Book-a-Call, not a self-serve checkout.** Audio Jones
   sells engagements; ResponseOS is the operational system delivered via
   engagement. Self-serve would change the product economics

### Posture copy direction

The §11 "Pricing Posture" section should communicate:

- This is **infrastructure**, not subscription
- Pricing is **relative to recovered revenue**, not relative to feature set
- There is a **setup phase + recurring layer** — not a free trial, not a
  per-seat-per-month
- The **floor is meaningful** — operators without inbound volume do not
  need ResponseOS, and we will tell them that on the call

Suggested headline: "Priced as infrastructure, not as software."

CTA: Book a Call → /book-a-call.

### Future pricing surface

When ResponseOS opens up self-serve tiers (Phase 3+), pricing will live at
`/agents/responseos/pricing` — separate route, distinct page. v1 does not
implement this. Do not pre-build the route.

---

## 10. SEO / AEO requirements

### Page metadata

- `title`: short, problem-anchored. Working draft: "ResponseOS — Revenue
  Recovery Infrastructure for founder-led businesses"
- `description`: ≤155 chars. Must contain "Revenue Recovery Infrastructure"
  verbatim and at least one operator-recognised pain term ("missed calls",
  "lost leads", "after-hours response", or similar)
- `alternates.canonical`: `https://audiojones.com/agents/responseos`
- `openGraph` / `twitter`: same description + a route-specific OG image at
  `/assets/og/responseos.png` (1200×630). Codex will request this asset; if
  not yet available at launch, fall back to the site default

### Structured data (JSON-LD)

Required, in this order on the page:

1. `BreadcrumbList` — Home → Agents → ResponseOS
   (use `breadcrumbJsonLd` from `src/lib/seo/schema.ts`)
2. `Service`
   - `name`: "ResponseOS"
   - `serviceType`: "Revenue Recovery Infrastructure"
   - `provider`: Organization (ref `organizationJsonLd()`)
   - `areaServed`: "United States" (until international ICP confirmed)
   - `description`: same as page meta description
   - `category`: "Customer service infrastructure"
   - Note: this requires extending `src/lib/seo/schema.ts` with a new
     `serviceJsonLd()` builder; do not inline ad-hoc JSON-LD
3. `FAQPage` — populated from §12 questions

### Internal linking

- ResponseOS must link IN from: `/agents` (index card), `/services`
  (one mention in the Services rebuild PR #58), homepage if a "Featured
  System" slot exists
- ResponseOS must link OUT to: `/book-a-call`, `/roi-calculator`,
  `/case-studies` (if available), `/agents` (breadcrumb), the other five
  agents OS pages via `RelatedLinks`

### Sitemap

Add `/agents` and `/agents/responseos` to `src/app/sitemap.ts` at priority
0.95 and 0.9 respectively. The other OS routes go in at 0.6 (placeholder
pages) when the follow-up PR ships.

### Robots

No robots changes. `/agents/*` is allowed by default.

---

## 11. Future expansion (NOT in v1 scope)

Documented so it doesn't get rebuilt mid-v1. None of these ship in this PR.

| Future surface | Trigger to build |
|---|---|
| `/agents/responseos/demo` | First 3 paying ResponseOS deployments. Builds simulated dashboard + sample inbound flow. Demo > screenshot for infrastructure products |
| `/agents/responseos/integrations/[partner]` | Each major CRM/integration earns its own SEO surface once the integration is production-stable |
| Live ResponseOS dashboard widget on the page | Phase 3+ once a single-tenant demo dashboard exists |
| `/agents/responseos/case-studies/[slug]` | First case study with attribution permission |
| `/agents/responseos/changelog` | When Audio Jones starts shipping ResponseOS updates publicly |
| Self-serve pricing surface at `/agents/responseos/pricing` | When self-serve tier opens (Phase 3+) |
| Client portal connection at `client.audiojones.com/responseos` | If/when a client-servicing surface ships in a separate application — the client portal was removed from this codebase on 2026-06-08 |
| Multi-location dashboard | When a multi-location operator becomes a public reference customer |
| Industry-specific landing pages (`/agents/responseos/home-services`, etc.) | When inbound traffic data shows clear vertical segmentation |

The shape of these expansions confirms the brief's central claim: ResponseOS
isn't a page, it's a product surface that grows out from the v1 narrative
page. The v1 page must be built so that future expansion attaches naturally
to it without rework.

---

## 12. Acceptance criteria

ResponseOS v1 is done when:

- [ ] `/agents/responseos` renders as a static (`○`) route
- [ ] `/agents` renders as a static (`○`) route with the six-card ecosystem
      grid + correct status pills
- [ ] All five other OS routes render as static placeholders with one-sentence
      positioning + correct category eyebrow + working CTAs
- [ ] All 14 sections from §4 are present on `/agents/responseos`, in order
- [ ] The phrase "Revenue Recovery Infrastructure" appears in every required
      location from §6
- [ ] BreadcrumbList + Service + FAQPage JSON-LD all render and validate
      against Google's Rich Results Test
- [ ] Sitemap includes `/agents` and `/agents/responseos`
- [ ] All CTAs route to `/book-a-call` (primary) and `/roi-calculator`
      (secondary) — no orphan CTAs, no `/contact` links
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm check:no-firebase`
      all pass
- [ ] Responsive QA harness (`pnpm qa:responsive`) passes against the
      preview at all 10 viewport widths
- [ ] No new font dependencies introduced
- [ ] No new color tokens introduced
- [ ] No banned framing words from §2 appear anywhere in the page, metadata,
      or JSON-LD (chatbot / assistant / receptionist / smart automation /
      AI-powered CRM / conversational AI / lead capture tool / 24/7 answering)
- [ ] Visual QA pass against DESIGN.md §16 anti-pattern checklist
- [ ] Pricing posture section ships without dollar amounts, without tables,
      without "starts at"

---

## 13. Out of scope (explicit non-goals for v1)

- ❌ Live ResponseOS demo or simulated dashboard
- ❌ SignalOS / ContentOS / PodcastOS / ClientOS / SalesOS deep pages
  (placeholders only — separate PR)
- ❌ ResponseOS pricing table or self-serve checkout
- ❌ Client portal integration (the client portal was removed from
  this codebase on 2026-06-08 — see [`docs/CHANGELOG.md`](../CHANGELOG.md))
- ❌ Industry-specific landing pages
- ❌ ResponseOS changelog or release notes
- ❌ Customer logo strip beyond what real attribution permits
- ❌ Stripe or any payment integration on the page (Whop was removed
  site-wide on 2026-06-08)
- ❌ A/B test framework (Phase 3+)
- ❌ Newsletter capture on the page (use the footer)

---

## 14. References

- `docs/codex/roi-calculator-v1-brief.md` — structural precedent for this
  brief
- `docs/design/DESIGN.md` — binding visual + token rules
- `docs/architecture/stack-decision.md` — stack constraints (no Firebase,
  no Whop, no Supabase; Cloudflare → Vercel + Next.js + Sanity + Neon +
  Resend + n8n + Stripe + MailerLite + ImageKit)
- `src/components/seo/RelatedLinks.tsx` — internal-link block to reuse
- `src/lib/seo/schema.ts` — JSON-LD builders (will need a new
  `serviceJsonLd()` for §10)
- `src/lib/seo/metadata.ts` — `buildMetadata()` for the page metadata
  block; does not need extension
- `src/config/nav.ts` — `mainNav` + `headerCtas` are locked; do not modify
- `src/config/links.ts` — `ctaLinks.bookSession` is the canonical
  Book-a-Call destination

---

## 15. What this brief is intentionally NOT

This brief defines **product narrative architecture and category framing**.
It does not define:

- The specific copy to use in any section (Codex writes the copy; this
  brief gives the constraints)
- The exact SVG geometry of the system diagram (Codex designs; this brief
  gives the visual grammar)
- The exact list of integrations in §6 (Codex confirms which integrations
  are production-ready at the time of v1; do not list aspirational ones)
- Which specific stats appear in §3 "Cost of Slow Follow-Up" (Codex sources
  or removes; do NOT ship invented stats — better to ship one verified stat
  than three unsourced ones)
- The case studies in §10 (Codex uses what's actually attributable at v1;
  if zero, replace with the placeholder section per §4)

The purpose of this brief is to ensure that Codex builds the page that the
**positioning** demands, not the page that the visual templates suggest.
Positioning leads, design follows.
