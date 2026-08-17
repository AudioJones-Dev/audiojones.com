---
title: Claim Verification Log
status: canonical
version: v1.0
date: 2026-08-13
owner: AJ Digital LLC
scope: citations file — primary-source verification record for every figure published on a public surface
related:
  - docs/strategy/AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md
  - docs/strategy/AUDIOJONES_SEO_AEO_ENTITY_IMPLEMENTATION_PLAN.md
---

# Claim Verification Log

`AUDIOJONES_NICHE_VALIDATION_CORRECTIONS.md` §1 requires that every claim be
re-verified **at its primary source before publication**, and that the source
URL and access date be captured "in a citations file or inline footnote."
This is that citations file.

**Rule:** a figure does not ship until it appears below with a `VERIFIED`
verdict. Marking a claim SAFE in the corrections table is necessary but not
sufficient — the table records that a claim *may* be publishable, this log
records that someone actually opened the source and checked.

---

## Verified — cleared for publication

### 62% of inbound calls to small businesses go unanswered

| | |
|---|---|
| **Verdict** | ✅ VERIFIED at primary source |
| **Primary source** | 411 Locals — <https://411locals.us/small-business-owners-dont-answer-62-of-phone-calls/> |
| **Accessed** | 2026-08-13 |
| **Published** | **2016-01-18** (see caveat) |
| **Method** | 85 businesses, 58 industries, 30 days |
| **Figures confirmed** | 24.3% no response + 37.8% to voicemail ≈ 62% unattended |
| **Required qualifier** | Small sample **and the 2016 date** |
| **Published as** | "62% of inbound calls to small businesses go unanswered — 411 Locals, Jan 2016 · 85 businesses, 30 days" |
| **Used on** | `src/components/home/landing/HeroAllSignal.tsx` |

> ⚠️ **Caveat the corrections table does not capture.** This study is from
> **January 2016** — a decade old. Many secondary roundups misdate it to
> 2023/2024. The corrections doc's approved public form ("A study of local
> small businesses found 62% of inbound calls go unanswered") omits the year,
> which understates its age. The date is therefore published inline. Compare
> the doc's own treatment of the 2019 MBO solopreneur figure, which it
> downgrades to REQUIRE QUALIFICATION for being outdated — this claim
> warrants the same treatment. **Recommend amending §1 of the corrections
> doc to carry the year.**

---

## Failed verification — must not be published

### 9.3 hrs/week lost to context switching

| | |
|---|---|
| **Verdict** | ❌ **NOT VERIFIED — do not publish** |
| **Corrections table says** | SAFE, "Cite Asana, not the 2012 McKinsey study" |
| **Checked** | 2026-08-13, against Asana's published Anatomy of Work Index |
| **What Asana actually reports** | ~4 hrs/week reorienting after app switching; 308 hrs/year on duplicated and no-longer-relevant work; 13 apps switched 30×/day (US) |
| **Problem** | No 9.3 hrs/week figure appears in the index. The number can only be reached by summing two different metrics from different sections, which is a derivation, not a citation. |

**This is a defect in the corrections doc itself** — a claim marked SAFE
does not verify at the named source. Per §1's rule 4 ("if the source has been
retracted, updated, or moved — escalate before publishing"), it is escalated
here. Either cite Asana's actual figures with their own framing, or drop the
claim. **Recommend amending §1.**

### $126K/yr lost to missed calls

| | |
|---|---|
| **Verdict** | ⚠️ **NOT CLEARED** |
| **Corrections table says** | SAFE if framed as modeled — bizrnr.com industry calculation, "transparent assumptions" |
| **Checked** | 2026-08-13 |
| **Problem** | The source is a vendor calculation. The SEO/AEO plan §9 requires that "the model inputs must be linkable to a transparent calculation page"; no such page was located. Vendor blogs are explicitly not acceptable as sole source. |

Publishable only if a transparent methodology page is found, or if the
modelling is redone in-house against the site's own ROI calculator
assumptions and published as AJ Digital's own model.

### 95% of enterprise genAI pilots deliver no measurable P&L impact

| | |
|---|---|
| **Verdict** | ⚠️ **NOT CLEARED — corroborated but no primary source opened** |
| **Corrections table says** | SAFE with enterprise-scope qualifier — MIT NANDA |
| **Checked** | 2026-08-13 |
| **What is confirmed** | The report exists: *The GenAI Divide: State of AI in Business 2025*, MIT NANDA (MIT Media Lab), July 2025. Method consistently reported as 52 interviews, 153 survey responses, ~300 public deployments. Widely covered by Fortune, Healthcare IT News, and others. |
| **Problem** | No official MIT/NANDA URL could be opened. A third-party PDF mirror returned HTTP 403; the referenced `nandapapers` GitHub location returned 404. §1 rule 1 requires opening the canonical source URL, and news retellings are not the primary document. |

Cleared for publication as soon as an official MIT/NANDA URL is located and
the figure confirmed in the document itself. Note also that the claim is
**enterprise-scope**, while the site's audience is founder-led small
businesses — the qualifier has to be prominent, not a footnote.

---

## Withdrawn from publication — no source exists

These were published as measured outcomes. Nothing in the repository
supports them, and the doctrine audit
(`AUDIOJONES_DOCTRINE_ALIGNMENT_AUDIT.md`) had already recorded that there
is "effectively no hard proof on doctrine terms." They are removed rather
than cited, because a citation cannot be attached to a number that was
never measured.

| Claim | Was published on | Action |
|---|---|---|
| `↓37%` CAC, `↑28%` pipeline, `↑42%` conversion | homepage hero + `ProofStats` | Removed (#206) |
| `↑41%` pipeline drift | homepage `ProofStats` "before" card | Removed (#206) |
| `+38%` reply-rate lift | `/agents`, `/agents/responseos`, `/case-studies` hero | Replaced with a capability statement |
| `<9 min` median first response | same three pages | Replaced with a capability statement |

`proofSignals` in `src/data/audiojones-design.ts` now describes how the
installed system behaves rather than asserting outcomes, matching the
treatment `ProofStats` received.

### Deleted — `agentsProofStrip`

This export carried `+38%`, `<9 min`, `$214K` "recovered revenue, first 90
days", and a testimonial attributed only to "Founder, professional
services, $1.2M run-rate". No surface ever imported it, so none of it was
published.

It was briefly annotated in place, then **deleted outright** — dead data
holding an unattributable endorsement is a trap, not a resource, and the
annotation only helped if someone read it before wiring the export up.
Git history preserves the content if a real, consented version of that
testimonial ever surfaces.

Restoring any part of it requires the same bar as anything else here: each
figure needs a VERIFIED entry in this log, and the quote needs a named
client with consent on record. A fabricated testimonial is a worse
exposure than a fabricated metric.

The three `/case-studies` entries carry qualitative outcomes only
("Follow-up gap identified", "Signal scorecard created"), so they need no
change here — but they remain anonymous placeholders rather than real
proof.

---

## How to add an entry

1. Open the canonical source URL and read the figure in the source itself.
2. Record: verdict, primary URL, access date, publication date, method or
   sample size, the exact figures confirmed, and the required qualifier.
3. Record the exact string as published and the file that publishes it.
4. If the source cannot be opened, or the figure does not match, mark it
   **NOT VERIFIED** and do not publish. Do not substitute a news article or
   vendor blog for the primary document.
