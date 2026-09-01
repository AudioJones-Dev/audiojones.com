# REJECTED — QuestionFinder batch, 2026-08-31

**Do not use these files as search-demand evidence. Do not normalize them. Do not enter any row
into the Query Opportunity Register.**

| | |
|---|---|
| **Batch** | QuestionFinder exports, 9 files, 9 seeds |
| **Acquired** | on or before 2026-08-31 |
| **Audited** | 2026-08-31 |
| **Verdict** | **REJECT** — 7 of the acquisition-QA tests in `SEARCH_IMPLEMENTATION_SPEC` §9A fail |
| **Admissible register rows** | **0** |
| **Files** | retained unmodified; see checksums below |
| **Reproduce** | `node verify-rejection.cjs` (exits 1) |

---

## Why these were rejected

Two distinct failure shapes.

### Shape 1 — six files are one template with the seed substituted in

Stripping the submitted seed phrase from every question and comparing the remaining templates
across files returns **102 of 102 questions identical, in identical row order, across all six
files**. Volumes are jittered 17–27% around a shared base.

The template is a generic home-services / trades FAQ scaffold. Substituting B2B software and
services seeds into it produces **84 category-alien questions** carrying confident-looking volume:

```text
r11  "is ai receptionist covered by insurance"                              2,416/mo
r12  "does medicare cover ai receptionist"                                  1,175/mo
r53  "AI search optimization for small business building code requirements"   220/mo
r52  "permits required for AI consultant Miami"                               275/mo
r71  "energy-efficient ai receptionist"                                       516/mo
r83  "AI automation for service businesses for landlords"                     188/mo
```

Nobody searches these. The volumes attached to them are not measurements.

### Shape 2 — three files are degenerate

`seo-for-contractors-miami`, `website-optimization-miami`, and `seo-consultant-miami` are all
`volume=0, signal=100` on every row. The questions look like genuine PAA scrapes, but the seed's
specificity is gone: **only 1–2 rows per file retain the "Miami" qualifier**, and the three files
heavily overlap each other. A large share are practitioner or job-seeker intent, not buyer intent:

```text
"Is SEO a good career path?"
"Are SEO jobs still in demand?"
"Which country is the best for finding SEO jobs?"
"Is there a free SEO course available?"
"How do I learn SEO as a beginner?"
```

Across all three files, **two unique questions carry buyer intent** for AJ Digital — "How much does
SEO cost in Miami?" and "What is the best SEO company in Miami?" — and both are zero-volume.

### The operative risk

The real Miami data shows almost nothing. The *synthetic* Miami data shows
`"how much does business automation Miami cost" — 3,961/mo`.

Read without this audit, the batch makes the local/Miami wedge look validated. **It is the
fabricated files carrying the local signal.** That inversion is why these files are quarantined
rather than simply ignored.

---

## Scope of the claim

What is established: **these exports** are unusable as demand evidence.

What is **not** established: whether QuestionFinder always behaves this way, hit a fallback mode on
unrecognized B2B seeds, or whether something else produced these files. The two distinct failure
shapes suggest two different modes.

**Before QuestionFinder is used again**, re-qualify it: one manual re-run on a known-good seed,
compared against the corresponding DataForSEO PAA set for the same seed. If the template reappears,
retire the tool for this program. If it does not, admit QuestionFinder as **corroboration only** —
it may confirm a question DataForSEO also returned; it may never originate a register row.

---

## Verification output

Produced by `node verify-rejection.cjs` in this directory on 2026-08-31:

```text
QuestionFinder batch 2026-08-31 — acquisition QA (spec §9A)

FAIL  1. template collision (>60% positional identity fails)
      baseline questionfinder-ai-receptionist.csv
      102/102 (100%) questionfinder-ai-automation-for-service-businesses.csv
      102/102 (100%) questionfinder-business-automation-miami.csv
      102/102 (100%) questionfinder-ai-consultant-miami.csv
      102/102 (100%) questionfinder-google-business-profile-optimization-mia.csv
      102/102 (100%) questionfinder-ai-search-optimization-for-small-busines.csv
FAIL  2. domain plausibility (84 category-alien questions)
      r11 "is ai receptionist covered by insurance" (2416/mo) [insurance]
      r12 "does medicare cover ai receptionist" (1175/mo) [medicare]
      r14 "ai receptionist without insurance" (689/mo) [insurance]
      r15 "ai receptionist insurance codes" (334/mo) [insurance]
      r16 "appealing an ai receptionist insurance denial" (215/mo) [insurance]
      ...and 79 more
FAIL  3. volume distribution (<30% cross-seed spread fails)
      r1 "how much does {SEED} cost"        [5100, 4548, 3961, 4277, 4009, 4881] spread 22%
      r2 "average {SEED} cost"              [2951, 2970, 3325, 2432, 3142, 2981] spread 27%
      r3 "{SEED} cost per hour"             [1496, 1837, 1373, 1846, 1630, 1361] spread 26%
      r4 "{SEED} cost near me"              [1135, 1386, 1131, 1193, 1117, 1338] spread 19%
      r5 "is {SEED} expensive"              [870, 753, 802, 995, 978, 942] spread 24%
      r6 "cheap {SEED} options"             [633, 685, 693, 688, 759, 708] spread 17%
FAIL  3b. all-zero volume batch
      questionfinder-seo-for-contractors-miami.csv — 15/15 rows at volume 0
FAIL  3b. all-zero volume batch
      questionfinder-website-optimization-miami.csv — 15/15 rows at volume 0
FAIL  3b. all-zero volume batch
      questionfinder-seo-consultant-miami.csv — 12/12 rows at volume 0
FAIL  4. seed fidelity (seed qualifiers absent from returned questions)
      questionfinder-seo-for-contractors-miami.csv: 2/15 rows retain the "Miami" qualifier
      questionfinder-website-optimization-miami.csv: 2/15 rows retain the "Miami" qualifier
      questionfinder-seo-consultant-miami.csv: 1/12 rows retain the "Miami" qualifier

VERDICT: REJECT — 7 test(s) failed
Admissible Query Opportunity Register rows from this batch: 0
```

---

## File inventory

Copied unmodified from `~/Downloads` on 2026-08-31. SHA-256 (first 16 hex chars) recorded so later
alteration is detectable.

| SHA-256 (16) | Bytes | Rows | Shape | File |
|---|---:|---:|---|---|
| `743000edf5fbd7c1` | 11,702 | 102 | template | `questionfinder-ai-automation-for-service-businesses.csv` |
| `a81dd0e4f100395f` |  9,923 | 102 | template | `questionfinder-ai-consultant-miami.csv` |
| `37a8cfe3e9b65333` |  9,541 | 102 | template | `questionfinder-ai-receptionist.csv` |
| `c8f97e976bb9e299` | 12,185 | 102 | template | `questionfinder-ai-search-optimization-for-small-busines.csv` |
| `810071d73f7626f1` | 10,541 | 102 | template | `questionfinder-business-automation-miami.csv` |
| `82ff0ced590832d2` | 12,312 | 102 | template | `questionfinder-google-business-profile-optimization-mia.csv` |
| `a3b440c6b8438eeb` |  1,203 |  12 | degenerate | `questionfinder-seo-consultant-miami.csv` |
| `7a906e322bdcca5d` |  1,549 |  15 | degenerate | `questionfinder-seo-for-contractors-miami.csv` |
| `4816fa24b46459da` |  1,637 |  15 | degenerate | `questionfinder-website-optimization-miami.csv` |

Verify with:

```bash
sha256sum *.csv
```

Hashes are of the LF originals as acquired. This directory ships a `.gitattributes` marking the
CSVs `-text`, because the repo checks out with `core.autocrlf=true` — without it, checkout would
rewrite them to CRLF and every hash above would mismatch, which reads as tampering rather than as
a line-ending conversion.

---

## Why these files are kept

Per `SEARCH_IMPLEMENTATION_SPEC` §27, **rejected data is quarantined, never deleted.** The rejection
is itself evidence: it documents a failure mode this program should be able to recognize on sight,
and it is the worked example behind the §9A acquisition-QA gate.

## The `~/Downloads` copies

The originals remain in `~/Downloads`, outside version control. On 2026-09-01 they were renamed to
the §28 convention `<source>__<seed-slug>__<date>__<qa-verdict>.csv` so the verdict travels with the
filename and they cannot be picked up later and mistaken for evidence. Contents are untouched — all
nine still match the hashes above.

The files in *this* directory deliberately keep their original names, per §27's "unmodified" rule.
Mapping:

| Original name (kept here) | Renamed in `~/Downloads` |
|---|---|
| `questionfinder-ai-receptionist.csv` | `qf__ai-receptionist__2026-08-31__reject-template-collision.csv` |
| `questionfinder-ai-automation-for-service-businesses.csv` | `qf__ai-automation-for-service-businesses__2026-08-31__reject-template-collision.csv` |
| `questionfinder-business-automation-miami.csv` | `qf__business-automation-miami__2026-08-31__reject-template-collision.csv` |
| `questionfinder-ai-consultant-miami.csv` | `qf__ai-consultant-miami__2026-08-31__reject-template-collision.csv` |
| `questionfinder-google-business-profile-optimization-mia.csv` | `qf__google-business-profile-optimization-miami__2026-08-31__reject-template-collision.csv` |
| `questionfinder-ai-search-optimization-for-small-busines.csv` | `qf__ai-search-optimization-for-small-business__2026-08-31__reject-template-collision.csv` |
| `questionfinder-seo-consultant-miami.csv` | `qf__seo-consultant-miami__2026-08-31__reject-zero-volume.csv` |
| `questionfinder-seo-for-contractors-miami.csv` | `qf__seo-for-contractors-miami__2026-08-31__reject-zero-volume.csv` |
| `questionfinder-website-optimization-miami.csv` | `qf__website-optimization-miami__2026-08-31__reject-zero-volume.csv` |

Two notes on the mapping:

- **Two slugs were corrected.** The export tool truncated `...-mia` and `...-busines`; the renamed
  files carry the seeds actually submitted — `google-business-profile-optimization-miami` and
  `ai-search-optimization-for-small-business`.
- **Two verdicts, not one.** `reject-template-collision` marks the six substituted-template files;
  `reject-zero-volume` marks the three degenerate files, whose primary disqualifier is a wholly
  zero-volume batch compounded by seed-fidelity failure.

---

## What replaced this batch

Real question sources for this program, in precedence order (`SEARCH_IMPLEMENTATION_SPEC` §3, §9A):

1. **GSC query export** — first-party, unfalsifiable, free. Outranks every third-party tool for
   questions about existing demand.
2. **GBP "queries used to find your business"** — first-party local demand; currently the only
   trustworthy local signal.
3. **DataForSEO** `serp/google/organic/live/regular` → `people_also_ask`, plus
   `keywords_for_keywords/live` on parent seeds.
4. **Competitor FAQ extraction via Firecrawl** — pre-validated by the fact that a ranking page
   chose to answer the question.
5. **Sales-call transcripts and intake forms** — the actual source for §21's `CUSTOMER LANGUAGE`.

Every future batch, from any source, is logged in `docs/search-intelligence/ACQUISITION_QA_LOG.md`
with a provenance record and QA verdict. A batch with no provenance record is inadmissible.

---

## Detection technique worth reusing

The tell was not any single absurd question — one bad scrape could produce "does medicare cover AI
receptionist." The tell was **positional identity**: row 53 is the building-code question in all six
files. Real search data has no reason to align across unrelated topics.

When auditing any scraped corpus, compare *structure across samples* before reading rows. Generation
artifacts are invisible row-by-row and obvious in aggregate.

The volume jitter is what made this dangerous rather than obviously broken. Identical volumes would
have been caught immediately; ±22% variation reads as plausible and survives a skim.
