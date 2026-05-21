---
title: "Citation Ledger — AudioJones.com Marketing Surface"
status: "draft — schema in place, populated with PROVISIONAL anchor claims pending AI Workforce Economics Index dataset intake"
owner: "AJ Digital LLC — strategy / research"
ledger_version: "0.1"
parent_strategy_doc: "docs/strategy/conversion-strategy-2026.md"
review_cadence: "every 12 months minimum; every 36 months mandatory retirement of un-republished claims"
last_updated: "2026-05-21"
---

# Citation Ledger — AudioJones.com Marketing Surface

This ledger is the **single source of truth** for every statistic, benchmark,
range, or research-grounded claim that appears on a public AudioJones.com
surface. It implements the citation contract specified in
[`conversion-strategy-2026.md`](./conversion-strategy-2026.md) §5.5 and §7.5.

Every footnote on every page resolves to a row here. **No exceptions.**

---

## 0. Operating contract

1. **No claim ships to a public surface without a row in this ledger.** If a
   draft references a number that does not exist here, the draft is rejected
   at intake.
2. **No row in this ledger ships without `confidence_level` populated.** A
   missing confidence value blocks publication.
3. **Conservative framing.** Where the underlying research provides a range,
   `preferred_public_wording` cites the *lower* end. Premium positioning is
   destroyed faster by one inflated number than by ten cautious ones.
4. **Vendor statistics are flagged.** Any `source_type: vendor` claim
   requires either (a) cross-confirmation by a non-vendor source in the same
   ledger row, or (b) explicit `risk_note` framing the limitation.
5. **The ledger is reviewable.** Every entry carries `date_accessed` and
   `next_review`. Claims past `next_review` get archived to §9 and removed
   from the marketing surface until re-verified.
6. **PROVISIONAL flag.** Any entry below marked `status: PROVISIONAL` has
   been structured but not yet anchor-verified against the live AI Workforce
   Economics Index dataset. These entries may not ship until status
   transitions to `VERIFIED`.

---

## 1. Source quality hierarchy

Sources are ranked. When two sources support the same claim, the higher-tier
source is preferred. When only a lower-tier source is available, the claim
goes on a deeper surface (research page, proposal) — never the homepage.

| Tier | Source class | Examples | Acceptable surfaces |
|---|---|---|---|
| **1** | Government statistical agency | U.S. Bureau of Labor Statistics (BLS), Census, OECD | Any surface |
| **2** | Peer-reviewed academic / Tier-1 research | Harvard Business Review, MIT Sloan, Kellogg, NBER working papers | Any surface |
| **3** | Established research / professional bodies | SHRM, McKinsey Global Institute, Gartner, Forrester, Work Institute | Any surface, ideally paired with Tier 1 or 2 |
| **4** | Industry benchmark vendors | Salesforce, HubSpot, CallRail, Invoca, Twilio, Nextiva, DiscoverOrg | ResponseOS / ReKonr OS pages, research surface, proposal — flagged |
| **5** | Salary / labor-market aggregators | ZipRecruiter, Indeed, Glassdoor, PayScale | Directional ranges only; never headline numbers |
| **6** | Vendor marketing claims | Single-vendor case studies, self-published benchmarks | Proposal only; never marketing surface |

---

## 2. Approved surface taxonomy

`approved_surface` on each row is one or more of:

| Token | Meaning |
|---|---|
| `homepage` | Cleared for use anywhere on `/` |
| `responseos` | Cleared for `/agents/responseos` and ResponseOSWedge homepage block |
| `rekonr-os` | Cleared for `/agents/rekonr-os` (when launched) |
| `roi-calculator` | Cleared for `/roi-calculator` page and outputs |
| `research-page` | Cleared for the proposed `/research` surface |
| `proposal-only` | Internal proposal / sales collateral — never marketing surface |
| `awaiting-verification` | Held until verified against the AI Workforce Economics Index dataset |

A claim with `awaiting-verification` in its surface list **cannot ship** to
any other listed surface until that token is removed via a ledger update.

---

## 3. Homepage claims

### AJW-001 — Lead response time decay (5-minute window)

| Field | Value |
|---|---|
| `claim_id` | `AJW-001` |
| `short_claim` | Lead value decays sharply within 5 minutes of arrival. |
| `full_claim` | Firms that attempt first contact with inbound web leads within five minutes of arrival are dramatically more likely to qualify the lead than firms that respond later in the first hour. Specifically, the odds of contacting the lead drop ~10x between minute 5 and minute 30, and the odds of qualifying drop nearly 7x between hour 1 and hour 24. |
| `source_name` | "The Short Life of Online Sales Leads" — James B. Oldroyd, Kristina McElheran, David Elkington (Harvard Business Review, March 2011). Underlying study: InsideSales / Kellogg School of Management. |
| `source_type` | Tier 2 — peer-reviewed business journal |
| `source_url` | `https://hbr.org/2011/03/the-short-life-of-online-sales-leads` |
| `date_published` | 2011-03 |
| `date_accessed` | TBD on intake |
| `confidence_level` | high |
| `approved_surface` | `homepage`, `responseos`, `roi-calculator`, `research-page`, `awaiting-verification` |
| `usage_note` | Anchor for the entire response-time economics narrative. Cite once per surface — do not repeat the same number in adjacent sections. |
| `risk_note` | Study is dated 2011. Verify against newer AI Workforce Economics Index data; if newer benchmark exists, cite both and let the newer headline lead. |
| `preferred_public_wording` | "An inbound lead loses most of its operational value within minutes of arrival. The odds of qualifying the lead drop nearly sevenfold by the end of the first hour.¹" |
| `status` | PROVISIONAL |
| `next_review` | 2027-05-21 |

### AJW-002 — Fully-loaded receptionist / front-office labor cost

| Field | Value |
|---|---|
| `claim_id` | `AJW-002` |
| `short_claim` | Fully-loaded front-office FTE cost (median, U.S.). |
| `full_claim` | The median fully-loaded annual cost of a U.S. receptionist / front-office coordinator is composed of (a) median annual wage per BLS Occupational Employment Statistics (occupation 43-4171, "Receptionists and Information Clerks") plus (b) benefits and payroll taxes per BLS Employer Costs for Employee Compensation (ECEC), which add approximately 30% on top of wages for service-sector workers. |
| `source_name` | U.S. Bureau of Labor Statistics — OES (occupation 43-4171) + ECEC, most recent published wave. |
| `source_type` | Tier 1 — government statistical agency |
| `source_url` | `https://www.bls.gov/oes/current/oes434171.htm` ; `https://www.bls.gov/ncs/ect/` |
| `date_published` | TBD — current BLS wave |
| `date_accessed` | TBD on intake |
| `confidence_level` | high |
| `approved_surface` | `homepage`, `responseos`, `roi-calculator`, `research-page`, `awaiting-verification` |
| `usage_note` | Use as the *operational context* anchor — never frame as "AI is cheaper than hiring". The narrative is leverage on existing labor, not replacement. See §6.4 banned language in the strategy doc. |
| `risk_note` | BLS wages vary materially by metro. Quote the national median only; do not extrapolate by region on the marketing surface. |
| `preferred_public_wording` | "A fully-loaded front-office FTE in the U.S. costs in the range of $[XX]K–$[XX]K annually once wages, taxes, and benefits are included.²" |
| `status` | PROVISIONAL — exact numeric pending current BLS wave intake |
| `next_review` | Annual — re-pull each BLS OES release |

### AJW-003 — Knowledge worker context-reconstruction time

| Field | Value |
|---|---|
| `claim_id` | `AJW-003` |
| `short_claim` | Knowledge workers spend ~19% of work time searching and gathering information. |
| `full_claim` | Knowledge workers spend roughly one-fifth of every working day searching for, gathering, or reconstructing information that exists somewhere within the business but is not retrievable on demand. |
| `source_name` | McKinsey Global Institute — "The social economy: Unlocking value and productivity through social technologies" (July 2012). |
| `source_type` | Tier 3 — established research / professional body |
| `source_url` | `https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-social-economy` |
| `date_published` | 2012-07 |
| `date_accessed` | TBD on intake |
| `confidence_level` | medium |
| `approved_surface` | `homepage`, `rekonr-os`, `research-page`, `awaiting-verification` |
| `usage_note` | This is the *anchor stat* for the entire ReKonr OS cognitive-tax narrative. Use once on the homepage (in "The Cost of the Gap" col. 3) and again on the ReKonr OS page (Economics of Memory Loss row A). Different framing each time. |
| `risk_note` | Study is dated 2012 — operationally still cited, but flag for newer corroborating data from the AI Workforce Economics Index dataset before headline use. |
| `preferred_public_wording` | "Knowledge workers spend roughly one-fifth of every working day reconstructing context the business already has but cannot retrieve.³" |
| `status` | PROVISIONAL |
| `next_review` | 2027-05-21 |

### AJW-004 — Quarterly revenue leak — founder-led service businesses

| Field | Value |
|---|---|
| `claim_id` | `AJW-004` |
| `short_claim` | Median quarterly revenue leak from inbound follow-up gaps (service SMBs). |
| `full_claim` | Composite estimate: median founder-led service business loses $[XX,XXX]–$[XX,XXX] per quarter to follow-up gaps (missed inbound, slow response, unrecovered lapsed leads) before a recovery system is installed. Computed as (inbound volume × intent-qualified share × average ticket × follow-up gap rate). |
| `source_name` | AI Workforce Economics Index, AJ Digital LLC (2026) — composite methodology required. |
| `source_type` | First-party research (AJ Digital LLC) |
| `source_url` | TBD — to be published on `/research` |
| `date_published` | 2026 (pending) |
| `date_accessed` | n/a |
| `confidence_level` | TBD — high only if methodology is reviewable; medium otherwise |
| `approved_surface` | `homepage`, `responseos`, `roi-calculator`, `awaiting-verification` |
| `usage_note` | This is a composite, not an external citation. It MUST be paired with the methodology page on `/research` before going on a marketing surface. Otherwise it reads as a promotional estimate, not research. |
| `risk_note` | First-party composites are the highest-risk claim type. Conservatively frame as a *range*, never a point estimate. State assumptions inline if a deeper surface allows it. |
| `preferred_public_wording` | "Median founder-led service business loses $[XX,XXX]–$[XX,XXX] per quarter to follow-up gaps before a recovery system is installed.⁴" |
| `status` | PROVISIONAL — methodology and numerics both pending |
| `next_review` | Quarterly while live |

---

## 4. ResponseOS claims

### AJW-005 — Inbound channel fragmentation per SMB

| Field | Value |
|---|---|
| `claim_id` | `AJW-005` |
| `short_claim` | Founder-led businesses operate across 7–10 inbound channels. |
| `full_claim` | The typical founder-led service business receives inbound demand across at least 7 distinct channels (phone, web form, email, SMS, social DM, marketplace inbox, scheduling tool, walk-in), each with separate logging and follow-up posture. |
| `source_name` | Cross-vendor synthesis — Salesforce State of Sales, HubSpot State of Marketing, plus AI Workforce Economics Index intake survey. |
| `source_type` | Tier 4 — industry benchmark (vendor, requires pairing) |
| `source_url` | TBD — multi-source |
| `date_published` | Various — current waves |
| `date_accessed` | TBD on intake |
| `confidence_level` | medium |
| `approved_surface` | `responseos`, `research-page`, `awaiting-verification` |
| `usage_note` | Do not put this on the homepage — it reads as descriptive, not as an economic price. Reserve for "The Leak" Inbound Scatter card. |
| `risk_note` | Vendor sources will overstate channel count to favor their own consolidation product. Cross-reference against the AI Workforce Economics Index intake survey and quote the lower-bound. |
| `preferred_public_wording` | "Founder-led service businesses now receive inbound demand across at least seven distinct channels, each with its own follow-up posture.⁵" |
| `status` | PROVISIONAL |
| `next_review` | 2027-05-21 |

### AJW-006 — Qualification accuracy under volume / time pressure

| Field | Value |
|---|---|
| `claim_id` | `AJW-006` |
| `short_claim` | Manual qualification accuracy degrades as inbound volume rises. |
| `full_claim` | TBD — claim category exists; specific benchmark pending AI Workforce Economics Index intake. Likely framed as "Manual qualification accuracy declines by [X]% when daily inbound volume exceeds [N] per operator." |
| `source_name` | TBD — likely InsideSales / Kellogg follow-up research or AI Workforce Economics Index primary survey. |
| `source_type` | TBD |
| `source_url` | TBD |
| `date_published` | TBD |
| `date_accessed` | TBD |
| `confidence_level` | low — pending intake |
| `approved_surface` | `awaiting-verification` |
| `usage_note` | Reserve for ResponseOS "The Leak" Qualification card. If no defensible source emerges from dataset intake, drop this slot from the page rather than soften it. |
| `risk_note` | This category is easy to overclaim. Numerically tight evidence is rare; qualitative framing may be more defensible. |
| `preferred_public_wording` | Held pending source verification. |
| `status` | PROVISIONAL — TBD |
| `next_review` | n/a — gated on intake |

### AJW-007 — Lapsed leads never re-engaged

| Field | Value |
|---|---|
| `claim_id` | `AJW-007` |
| `short_claim` | A majority of inbound leads receive no follow-up beyond the first touch. |
| `full_claim` | Across surveyed B2B and service businesses, approximately 50% of inbound leads receive no follow-up touch beyond the first attempt, and 80% of eventual sales require five or more follow-up touches. |
| `source_name` | Marketo (now Adobe), InsideSales / XANT, National Sales Executive Association — multi-source benchmark; AI Workforce Economics Index for current-wave confirmation. |
| `source_type` | Tier 4 — industry benchmark (vendor synthesis) |
| `source_url` | TBD — multi-source |
| `date_published` | 2011–2024 (older anchors, newer corroborations) |
| `date_accessed` | TBD on intake |
| `confidence_level` | medium |
| `approved_surface` | `responseos`, `research-page`, `awaiting-verification` |
| `usage_note` | Reserve for ResponseOS "The Leak" Recovery card. Frame as a *system gap*, not as a "your team isn't trying hard enough" implication. |
| `risk_note` | The "80% require 5+ touches" stat is widely misattributed. Verify the live attribution before publication. |
| `preferred_public_wording` | "Roughly half of inbound leads never receive a follow-up touch beyond the first attempt — and most eventual sales require five or more.⁷" |
| `status` | PROVISIONAL |
| `next_review` | 2027-05-21 |

### AJW-008 — Response-time decay curve (graphable)

| Field | Value |
|---|---|
| `claim_id` | `AJW-008` |
| `short_claim` | Lead qualification odds plotted against time-to-first-contact. |
| `full_claim` | Same underlying research as AJW-001, expressed as a curve rather than a single statistic. Used for the ResponseOS economics-section visualization where decay-over-time is the explicit point. |
| `source_name` | Same as AJW-001 (Oldroyd / McElheran / Elkington 2011) + any updated benchmark from AI Workforce Economics Index. |
| `source_type` | Tier 2 |
| `source_url` | Same as AJW-001 |
| `date_published` | 2011-03 (anchor) |
| `date_accessed` | TBD |
| `confidence_level` | high |
| `approved_surface` | `responseos`, `research-page`, `awaiting-verification` |
| `usage_note` | If used as a chart, the chart must reproduce the source's reported intervals — do not interpolate or smooth points that the source did not measure. |
| `risk_note` | Interpolating a curve where the source reports discrete intervals is a presentation lie. Either reproduce the discrete intervals or omit the curve. |
| `preferred_public_wording` | Chart caption: "Odds of qualifying an inbound lead, by time-to-first-contact. Source: Oldroyd et al., HBR 2011.⁸" |
| `status` | PROVISIONAL |
| `next_review` | 2027-05-21 |

### AJW-009 — After-hours inbound share

| Field | Value |
|---|---|
| `claim_id` | `AJW-009` |
| `short_claim` | A meaningful share of high-intent inquiries arrive outside business hours. |
| `full_claim` | For founder-led service businesses, approximately 30–50% of inbound calls and form fills arrive outside standard business hours (typically defined as 08:00–17:00 local time, Mon–Fri). |
| `source_name` | CallRail, Invoca call-analytics benchmarks; AI Workforce Economics Index intake survey for current-wave figures. |
| `source_type` | Tier 4 — vendor benchmark |
| `source_url` | TBD |
| `date_published` | Various — current waves |
| `date_accessed` | TBD |
| `confidence_level` | low-to-medium |
| `approved_surface` | `responseos`, `research-page`, `awaiting-verification` |
| `usage_note` | Reserve for ResponseOS economics row B (After-hours). Pair with framing: "Hours 17:00–08:00 are not 'after hours' — they are the largest revenue surface most service businesses operate without coverage." |
| `risk_note` | Call-analytics vendors have a commercial interest in inflating this number. Quote the lower bound and pair with industry-vertical caveat. |
| `preferred_public_wording` | "Roughly one in three high-intent inbound inquiries to founder-led service businesses arrives outside standard business hours.⁹" |
| `status` | PROVISIONAL |
| `next_review` | 2027-05-21 |

### AJW-010 — Missed-call rate (inbound voice)

| Field | Value |
|---|---|
| `claim_id` | `AJW-010` |
| `short_claim` | A meaningful share of inbound calls to service SMBs go unanswered. |
| `full_claim` | Inbound call analytics across U.S. service SMBs show approximately 30–60% of inbound calls go unanswered during peak demand or after-hours, depending on industry vertical. |
| `source_name` | Invoca, CallRail, Nextiva — call analytics benchmarks; AI Workforce Economics Index for cross-vertical synthesis. |
| `source_type` | Tier 4 — vendor benchmark |
| `source_url` | TBD |
| `date_published` | Various |
| `date_accessed` | TBD |
| `confidence_level` | low-to-medium |
| `approved_surface` | `responseos`, `roi-calculator`, `research-page`, `awaiting-verification` |
| `usage_note` | Use sparingly. The wide range (30–60%) requires careful framing — either cite the vertical-specific lower bound or omit a numeric and use a qualitative claim. |
| `risk_note` | Wide range = high risk of overclaim. Pair with vertical-specific qualifier whenever cited numerically. |
| `preferred_public_wording` | "In peak-demand and after-hours windows, founder-led service businesses miss a material share of inbound calls — verified across multiple vendor benchmarks.¹⁰" |
| `status` | PROVISIONAL |
| `next_review` | 2027-05-21 |

---

## 5. ReKonr OS claims

### AJW-011 — Employee turnover knowledge-loss cost

| Field | Value |
|---|---|
| `claim_id` | `AJW-011` |
| `short_claim` | Employee turnover writes off operational knowledge worth 50–200% of annual salary. |
| `full_claim` | SHRM and the Work Institute estimate the total cost of replacing a departed employee — including productivity loss, training, recruiting, and knowledge transfer — ranges from approximately 50% of annual salary for entry-level roles up to 200% for skilled / managerial roles. A material portion of this cost is attributable to undocumented operational knowledge that exits with the employee. |
| `source_name` | Society for Human Resource Management (SHRM); Work Institute Retention Reports; Gallup turnover research. |
| `source_type` | Tier 3 — established professional body / research |
| `source_url` | `https://www.shrm.org/` (specific publication TBD on intake) |
| `date_published` | Various — current SHRM editions |
| `date_accessed` | TBD on intake |
| `confidence_level` | medium-to-high |
| `approved_surface` | `rekonr-os`, `research-page`, `awaiting-verification` |
| `usage_note` | Reserve for ReKonr OS Economics of Memory Loss row B. Frame as *knowledge depreciation*, not as "HR / retention" — that miscategorizes the product. |
| `risk_note` | SHRM and similar bodies report ranges, not point estimates. Always cite the range, never the midpoint as a headline. |
| `preferred_public_wording` | "Every employee or contractor transition writes off operational knowledge worth a meaningful fraction of annual salary — even at the low end of the range.¹¹" |
| `status` | PROVISIONAL |
| `next_review` | 2027-05-21 |

### AJW-012 — CRM data decay rate

| Field | Value |
|---|---|
| `claim_id` | `AJW-012` |
| `short_claim` | B2B contact records decay at roughly 30% per year. |
| `full_claim` | Industry benchmarks consistently report that B2B contact records (email validity, role accuracy, company association) decay at approximately 25–30% per year due to job changes, role changes, and organizational restructuring — meaning a CRM left un-maintained becomes substantially obsolete within 24–36 months. |
| `source_name` | DiscoverOrg / ZoomInfo, Marketing Sherpa, HubSpot — multi-source synthesis. |
| `source_type` | Tier 4 — industry benchmark (vendor synthesis) |
| `source_url` | TBD |
| `date_published` | Various |
| `date_accessed` | TBD |
| `confidence_level` | medium |
| `approved_surface` | `rekonr-os`, `research-page`, `awaiting-verification` |
| `usage_note` | Reserve for ReKonr OS "The Reconstruction Problem" CRM-decay card. Frame as *memory failure*, not as a CRM-vendor critique. |
| `risk_note` | These are vendor sources with a commercial interest in promoting contact-data refresh services. Pair with the conservative lower bound. |
| `preferred_public_wording` | "Business contact data decays at roughly a quarter per year — meaning every CRM becomes materially obsolete within thirty-six months unless actively maintained.¹²" |
| `status` | PROVISIONAL |
| `next_review` | 2027-05-21 |

### AJW-013 — Unstructured share of enterprise data

| Field | Value |
|---|---|
| `claim_id` | `AJW-013` |
| `short_claim` | The majority of business knowledge lives outside the system of record. |
| `full_claim` | Industry analysts consistently report that approximately 80% of enterprise data is unstructured — sitting in email, documents, chat, meeting recordings, and individual heads rather than in CRMs, ERPs, or other structured systems of record. |
| `source_name` | IBM, Gartner, IDC — multi-source synthesis. |
| `source_type` | Tier 3 — established research / professional body |
| `source_url` | TBD — multi-source |
| `date_published` | Various — recurring benchmarks since ~2010 |
| `date_accessed` | TBD |
| `confidence_level` | medium |
| `approved_surface` | `rekonr-os`, `research-page`, `awaiting-verification` |
| `usage_note` | Reserve for ReKonr OS Five Forms of Operational Memory closing line. The frame is *legibility*, not data-storage. |
| `risk_note` | The "80% unstructured" claim is widely cited but with shifting attributions over the years. Verify current attribution before publication. |
| `preferred_public_wording` | "The majority of operational knowledge inside a founder-led business is unstructured — living in email, calls, documents, and individual heads, not in the CRM.¹³" |
| `status` | PROVISIONAL |
| `next_review` | 2027-05-21 |

### AJW-014 — Founder operational cognitive load

| Field | Value |
|---|---|
| `claim_id` | `AJW-014` |
| `short_claim` | The founder's most expensive output is judgment. Context reconstruction crowds it out. |
| `full_claim` | TBD — composite claim. Draws on AJW-003 (knowledge-worker context-reconstruction time, McKinsey 2012) and the AI Workforce Economics Index founder-cohort survey to express the same dynamic specifically for founder-operators. |
| `source_name` | McKinsey Global Institute (anchor) + AI Workforce Economics Index founder cohort (forthcoming). |
| `source_type` | Tier 3 (anchor) + First-party (cohort survey) |
| `source_url` | See AJW-003 |
| `date_published` | 2012 (anchor); 2026 (cohort survey, pending) |
| `date_accessed` | TBD |
| `confidence_level` | low — pending intake |
| `approved_surface` | `rekonr-os`, `research-page`, `awaiting-verification` |
| `usage_note` | Reserve for ReKonr OS Economics of Memory Loss row C. If no founder-specific cohort data emerges from intake, this slot stays empty rather than borrowing the generic AJW-003 number for a founder-specific claim. |
| `risk_note` | Extrapolating a knowledge-worker benchmark to founders specifically is the most common AI-marketing overclaim in this category. Do not do it without primary cohort data. |
| `preferred_public_wording` | Held pending cohort intake. |
| `status` | PROVISIONAL — TBD |
| `next_review` | n/a — gated on intake |

### AJW-015 — Category disambiguation — memory infrastructure vs. chatbots / KBs

| Field | Value |
|---|---|
| `claim_id` | `AJW-015` |
| `short_claim` | Business memory infrastructure is a distinct analyst category from conversational AI or knowledge bases. |
| `full_claim` | Industry analysts (Gartner, Forrester) distinguish between (a) conversational AI / chatbots, (b) enterprise knowledge management / KB systems, and (c) emerging operational-context / business-memory infrastructure. ReKonr OS belongs to category (c). |
| `source_name` | Gartner Hype Cycle for Artificial Intelligence; Forrester Wave reports on adjacent categories — analyst sources to be specified on intake. |
| `source_type` | Tier 3 — established analyst firm |
| `source_url` | TBD |
| `date_published` | Various — current editions |
| `date_accessed` | TBD |
| `confidence_level` | low — pending exact analyst publication identification |
| `approved_surface` | `rekonr-os`, `research-page`, `proposal-only`, `awaiting-verification` |
| `usage_note` | Reserve for the ReKonr OS FAQ disambiguation entries. Used to *defend the category*, not to claim leadership in it. |
| `risk_note` | Naming analyst-firm category placement before the category is named by the analyst is a positioning error. If no analyst publication can be cited, drop this and rely on qualitative differentiation in the FAQ copy. |
| `preferred_public_wording` | Held pending analyst-publication anchor. |
| `status` | PROVISIONAL — TBD |
| `next_review` | n/a — gated on intake |

---

## 6. ROI calculator claims

The ROI calculator surface has its own dedicated subset of claims because
its outputs are operationalized as numbers users compute against, not as
editorial assertions.

### AJW-016 — Calculator input ranges (industry vertical defaults)

| Field | Value |
|---|---|
| `claim_id` | `AJW-016` |
| `short_claim` | Default values seeded into the ROI calculator for each industry vertical. |
| `full_claim` | The ROI calculator pre-populates input ranges (inbound volume, close rate, average ticket, current response time) per industry vertical. Each default value resolves to its own AJW-### claim row (forthcoming) so the calculator's outputs trace cleanly to research. |
| `source_name` | Composite — see linked sub-claims AJW-016.1 through AJW-016.N (to be enumerated per vertical). |
| `source_type` | Composite |
| `source_url` | TBD |
| `date_published` | TBD per sub-claim |
| `date_accessed` | TBD |
| `confidence_level` | varies by sub-claim |
| `approved_surface` | `roi-calculator`, `research-page`, `awaiting-verification` |
| `usage_note` | The calculator must surface "Where this number comes from" inline for every default — link directly to the ledger row. No black-box defaults. |
| `risk_note` | Calculator defaults are the highest-trafficked source-of-truth on the site. A wrong default = a wrong output = a wrong sales conversation. Treat with maximum care. |
| `preferred_public_wording` | "Default values are pre-populated from industry benchmarks. Click any field to see the source." |
| `status` | PROVISIONAL — sub-claims to be enumerated per industry vertical |
| `next_review` | Quarterly |

---

## 7. Slot ↔ claim mapping

This table is the bridge between
[`conversion-strategy-2026.md`](./conversion-strategy-2026.md) §5
statistic slots and the rows above. Implementation PRs reference this
table to know which claim is approved for which surface.

| Strategy slot | Claim | Surface | Status |
|---|---|---|---|
| §5.1.A — Hero subline | `AJW-001` | homepage | PROVISIONAL |
| §5.1.B — Cost of Gap col. 1 (response decay) | `AJW-001` (reuse, different framing) | homepage | PROVISIONAL |
| §5.1.C — Cost of Gap col. 2 (front-office labor) | `AJW-002` | homepage | PROVISIONAL |
| §5.1.D — Cost of Gap col. 3 (operational memory) | `AJW-003` | homepage | PROVISIONAL |
| §5.1.E — ResponseOSWedge muted CTA line | `AJW-004` | homepage | PROVISIONAL — methodology pending |
| §5.2.A — ResponseOS Leak — Inbound scatter | `AJW-005` | responseos | PROVISIONAL |
| §5.2.B — ResponseOS Leak — Qualification | `AJW-006` | responseos | TBD — gated on intake |
| §5.2.C — ResponseOS Leak — Recovery | `AJW-007` | responseos | PROVISIONAL |
| §5.2.D — ResponseOS Economics — Decay curve | `AJW-008` | responseos | PROVISIONAL |
| §5.2.E — ResponseOS Economics — After-hours | `AJW-009` + `AJW-010` | responseos | PROVISIONAL |
| §5.2.F — ResponseOS Economics — Labor parity | `AJW-002` (reuse) | responseos | PROVISIONAL |
| §5.3.A — ReKonr Economics — Context reconstruction | `AJW-003` (reuse, ReKonr-specific framing) | rekonr-os | PROVISIONAL |
| §5.3.B — ReKonr Economics — Knowledge attrition | `AJW-011` | rekonr-os | PROVISIONAL |
| §5.3.C — ReKonr Economics — Founder cognitive load | `AJW-014` | rekonr-os | TBD — gated on intake |
| §5.3.D — ReKonr Reconstruction Problem — CRM decay | `AJW-012` | rekonr-os | PROVISIONAL |
| §5.3.E — ReKonr Five Forms — closing | `AJW-013` | rekonr-os | PROVISIONAL |
| §5.3.F — ReKonr FAQ disambiguation | `AJW-015` | rekonr-os | TBD — gated on intake |

---

## 8. What is implementation-ready vs. what still needs verification

### 8.1 Ready for implementation drafting (subject to intake verification)

Claims with a defensible Tier 1–3 anchor and a `PROVISIONAL` (not `TBD`) status:

- `AJW-001` — Lead response time decay (HBR Oldroyd 2011) — Tier 2 anchor, awaiting current-wave corroboration
- `AJW-002` — Front-office labor cost (BLS OES + ECEC) — Tier 1 anchor, awaiting current-wave pull
- `AJW-003` — Knowledge worker context-reconstruction (McKinsey 2012) — Tier 3 anchor, awaiting newer corroboration
- `AJW-008` — Response-time decay curve (same anchor as AJW-001)
- `AJW-011` — Turnover knowledge-loss cost (SHRM) — Tier 3 anchor
- `AJW-012` — CRM data decay (multi-vendor synthesis) — Tier 4, conservative framing acceptable
- `AJW-013` — Unstructured data share (IBM / Gartner / IDC) — Tier 3
- `AJW-005` — Channel fragmentation (vendor synthesis) — Tier 4, conservative framing acceptable
- `AJW-007` — Lapsed leads never re-engaged (multi-source) — Tier 4, conservative framing acceptable
- `AJW-009` — After-hours inbound share — Tier 4, vertical-qualifier required
- `AJW-010` — Missed-call rate — Tier 4, qualitative framing recommended over numeric

### 8.2 Held — not implementation-ready

These claims do not get drafted into copy until intake verification is complete:

- `AJW-004` — Quarterly revenue leak composite (methodology required)
- `AJW-006` — Qualification accuracy under load (no defensible anchor identified)
- `AJW-014` — Founder cognitive load (cohort survey required)
- `AJW-015` — Analyst-firm category disambiguation (analyst publication required)
- `AJW-016` — ROI calculator vertical defaults (sub-claim enumeration required)

### 8.3 Banned — never on the marketing surface

No statistic that triggers any of the following may enter this ledger:

- Headcount replacement framing ("replaces X FTEs", "no more receptionist", "fire your front desk")
- Unspecified ROI multipliers ("10x your pipeline", "100x leverage")
- "Average customer sees" claims without primary methodology
- Survival rates ("businesses without AI will fail")
- Vendor competitor comparisons by name

These align with the banned-language contract in
[`conversion-strategy-2026.md`](./conversion-strategy-2026.md) §6.4.

---

## 9. Archive — retired claims

(Empty — populate on first ledger review cycle.)

---

## 10. Intake checklist — to move a row from PROVISIONAL → VERIFIED

For each row, the following must be true before publication:

1. `source_name` populated with a specific, named publication or dataset.
2. `source_url` resolves to a public, durable URL (or, for paid research,
   a paid-access-but-stable URL).
3. `date_published` set to YYYY-MM at minimum.
4. `date_accessed` set to the exact date the source was last reviewed.
5. `confidence_level` populated and matches the source-tier hierarchy in §1.
6. `awaiting-verification` removed from `approved_surface`.
7. `preferred_public_wording` reviewed against
   [`conversion-strategy-2026.md`](./conversion-strategy-2026.md) §6.4
   banned language list.
8. `next_review` set.
9. Ledger version bumped, this document's `last_updated` updated.

Until every box above is checked for a given claim, the slot in the
strategy doc remains unfilled and the surface ships without that
statistic. Better an empty slot than a wrong one.
