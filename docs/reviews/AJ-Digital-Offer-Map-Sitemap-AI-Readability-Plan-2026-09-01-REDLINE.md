# AJ Digital Offer Map, Sitemap, Internal Linking & AI Readability Plan — REDLINE

> **This is a redlined copy.** `~~Struck text~~` is removed; **bold** text is added;
> `⚠️ REDLINE N` blocks give the rationale.
>
> Verified against `audiojones.com` at `f5745ea` and against
> `AJ-Digital-Master-Pricing-Matrix-2026 v2.md`. Several claims were additionally confirmed
> against a **local production build on 2026-09-01** — those are marked *(build-verified)*.
>
> **Rebuilt 2026-09-01** after the original was lost when `~/Downloads` was emptied. Content is
> unchanged from the first issue except for redline #11, a correction to my own erroneous note
> about the sitemap URL count.
>
> **No pricing or offer name is decided in this redline.** Edits to Section 5 reframe *what the
> decision is*; the decisions themselves remain the operator's.

## Redline change log

| # | Section | Change | Severity |
|---|---|---|---|
| 1 | §10 | `robots.txt` block is a **merge**, not a replacement — restores 13 dropped disallows *(build-verified)* | Critical |
| 2 | §11 Phase 0 | Exit gate now inherits the matrix's own §12 open-decisions list | Critical |
| 3 | §4, §7, §11 Phase 2 | Proof gate made real: hub pages blocked on named case-study evidence | High |
| 4 | §3, §8, §12 | Legacy catalog retained for media/personal-brand families, not superseded | High |
| 5 | §6 | Route waves renumbered and cross-referenced to §11 phases | High |
| 6 | §6 | Live content surfaces restored to the canonical top-level table *(build-verified)* | High |
| 7 | §5 | ReKonr reframed as a display convention; R2 name collision surfaced | Medium |
| 8 | §5 | Matrix authority scoped to structure; Core Business Memory contradiction flagged | Medium |
| 9 | §6, §11, §12 | Test classes mapped to the CI workflows that can actually run them | Medium |
| 10 | various | Factual corrections (`/diagnostic`, `speakable`, source filename, Zod) | Low |
| 11 | §2 | **Correction to this redline:** the plan's "32 URLs" was right; my earlier "computes 34" note was wrong | Low |

---

**Status:** Read-only architecture plan; no repository changes performed
**Prepared:** September 1, 2026
**Redlined:** August 31, 2026 · **rebuilt and corrected** September 1, 2026
**Repository reviewed:** `AudioJones-Dev/audiojones.com` at `main` commit ~~`43f2b56f76abf73a946747f6729cf7d02817e82d`~~ **`f5745ea` (redline verification baseline; the plan's `43f2b56` is two commits earlier and none of the intervening commits touch the surfaces in scope)**
**Commercial source reviewed:** ~~`AJ-Digital-Master-Pricing-Matrix-2026 v2(1).md`~~ **`AJ-Digital-Master-Pricing-Matrix-2026 v2.md` — no file by the cited name existed; `Downloads` held `...-2026 (1).md` and `...-2026 v2.md`, which were byte-identical. Cite one path so the canonical source is unambiguous.**
**Live site reviewed:** `https://www.audiojones.com`

## 1. Executive decision

The site should use this architecture:

1. `/solutions` remains the canonical, human-facing offer map.
2. Seven solution-family hubs organize the commercial catalog.
3. Only buyer-comprehensible offers receive standalone public pages; internal implementation components remain internal.
4. One typed offer registry becomes the source for visible pricing, offer relationships, JSON-LD, sitemap inclusion, CTA routing, and a sanitized `/offers.json` endpoint.
5. `/pricing` remains a consolidated comparison and qualification page, but every material pricing card links to an explanatory offer page before or alongside its application CTA.
6. `robots.txt`, `sitemap.xml`, canonical tags, JSON-LD, and internal links remain the primary discovery layer. `llms.txt` and `/offers.json` are supplemental machine-readable aids, not substitutes for crawlable HTML.
7. **Public offer pages are gated on publishable proof, not only on approved pricing. A hub or detail page that cannot carry a named case study, a documented process, or original evidence is deferred, not shipped thin. See §4 and §11 Phase 2.**

Do **not** implement the new public pricing yet. The September matrix and the live/repository pricing model conflict in several commercially material places. Resolve the pricing gates in Section 5 first**, and the matrix's own §12 open decisions, which Section 11 Phase 0 now inherits in full**.

## 2. Evidence and truth state

### Known

- The repository contract defines AudioJones.com as AJ Digital's public marketing site, not an admin portal.
- The current primary navigation is Home, Solutions, Pricing, About, Resources, and Contact, with AI Readiness Diagnostic and Book a Call CTAs.
- Repository guidance already designates `/solutions` as the canonical "what we sell" surface.
- The live homepage, solutions, pricing, services, resources, and ResponseOS pages all returned HTTP 200 during the review.
- The live sitemap exposes 32 URLs.

> ⚠️ **REDLINE 11 — correcting this redline, not the plan.**
> The first issue of this document claimed the generator "computes 21 static + 5 framework + 8
> insight = 34" and told you to re-verify. **That was wrong.** A local production build on
> 2026-09-01 emits exactly **32** `<loc>` entries — **21 static + 4 framework + 7 insight**, with 0
> Sanity blog posts when `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset. My content counts came from
> `grep -c "slug:"`, which also matched the `slug: string` type declaration in each `index.ts` and
> inflated both by one. **The plan's figure of 32 is correct as written.**

- **Build-verified 2026-09-01: all 32 sitemap URLs carry an identical `<lastmod>` equal to the build timestamp (`2026-09-01T12:19:19.515Z`). The `new Date()` defect is real and observable in output, not only in source.**
- **Build-verified: `/apply` is present in the generated sitemap, as are `/case-studies`, `/insights`, `/frameworks`, `/blog`, `/workshops`, and `/roi-calculator`.**
- The live `/llms.txt` and `/offers.json` paths return branded HTML 404 pages, not machine-readable files.
- `src/content/pricing.ts` is the current typed source for ten live pricing offers. **Confirmed.**
- `data/catalog/services_pricing_catalog.json` is a separate, older catalog dated 2025-11-07 and includes service families outside the September systems matrix. **Those families — podcast production, media systems, personal-brand services — are outside the matrix *by the matrix's own §12 item 10*, which lists their integration as still-pending work. They are out of scope, not superseded. See redline #4.**
- The homepage emits Organization, Person, and WebSite JSON-LD.
- `/pricing` emits BreadcrumbList, FAQPage, and ItemList/Service JSON-LD.
- `/agents/responseos` emits BreadcrumbList, FAQPage, and Service JSON-LD.
- `/solutions` emits BreadcrumbList only; `/services` emits FAQPage only.
- `robots.txt` allows the public site for the default crawler group and specifically blocks GPTBot. **It also disallows thirteen further paths that Section 10's original draft omitted — build-verified against the generated `robots.txt`: `/test-slack`, `/uploader`, `/env`, `/not-authorized`, `/status`, `/consent-testimonial`, `/business`, `/creators`, `/artisthub`, `/(site)/artist-hub`, `/(site)/epm`, and `/portal/admin/`.**
- The September master matrix describes itself as the canonical working source for offer architecture and pricing governance. **Its closing section claims less: "The matrix *structure* is canonical," with each price carrying an evidence status. Structure authority and price authority are not the same claim. See redline #8.**
- **`src/lib/seo/schema.ts` already exports `speakableSpec()`. Section 9 discusses `speakable` as a future option; it is implemented.**
- **There is no `pnpm test` script. Contract tests run as individual `pnpm exec tsx --test <file>` steps in `.github/workflows/build-and-lint.yml`; a new test file not added as its own step never runs. See redline #9.**
- **`/case-studies` renders anonymous cards with no client names, no named outcomes, and no `/case-studies/[slug]` detail routes. Total long-form inventory is 7 insights and 4 frameworks.**

### Inferred

- The principal SEO/AEO risk is not absence of pages alone. It is commercial-entity drift across the master matrix, the typed pricing source, the legacy JSON catalog, overlapping routes, and structured data.
- Publishing one page for every matrix row would create thin, duplicative pages and expose internal allocations as if they were standalone offers.
- The existing site has enough technical foundation to implement the offer map without a framework or dependency change.
- **The binding constraint on new indexed pages is publishable proof, not registry engineering. The registry can be built now; the pages it drives cannot clear this plan's own §4 qualification rule until at least one named case study exists.**

### Unknown or approval-gated

- Which ResponseOS commercial model supersedes the other.
- Which prices in the matrix are approved for public visibility versus internal qualification only.
- Whether the Revenue Leak Assessment, Team AI Readiness Workshop, Worksie Reference Pilot, and Strategic Partnership remain public offers.
- Whether `/services`, `/agents`, and the overlapping diagnostic routes should redirect, remain transitional, or be repurposed.
- Whether GPTBot should remain blocked as an explicit model-training policy.
- **The seven further items in matrix §12 that this plan did not carry forward: diagnostic-fee credits, SLA tiers, included monthly capacity for M1–M10, pass-through billing administration fee, bundled-usage and overage methodology, M9's capacity model, and South Florida quote validation for R3–R9.**
- **Whether "Revenue Leak" names the $1,997 bounded assessment or matrix R2. Both currently claim it. See redline #7.**
- **Which Core Business Memory figure governs: the $25,000 BM1–BM11 target or the $15,000–$20,000 typical corridor. The matrix states both.**

## 3. Current-state audit

| Area | Current state | Material issue | Required disposition |
|---|---|---|---|
| Commercial hub | `/solutions` is in primary navigation | Offer names do not fully match the September matrix | Rebuild from canonical registry |
| Duplicate hub | `/services` is crawlable and describes overlapping offers | Competes with `/solutions` and creates ambiguous authority | Consolidate or give a distinct non-overlapping role |
| Pricing | Ten live offers in `src/content/pricing.ts` | Multiple prices and offer names conflict with the September matrix | Ratify before publication |
| Legacy catalog | `data/catalog/services_pricing_catalog.json` | Separate schema, stale date, ~~unrelated~~ **out-of-matrix** service families | ~~Supersede, generate, or clearly mark non-authoritative~~ **Mark non-authoritative for systems offers and exclude from `/offers.json`. Retain as the interim pricing record for podcast, media, and personal-brand families until matrix §12 item 10 integrates them. Do not supersede or delete.** |
| Sitemap | 32 URLs; every static URL uses `new Date()` **— build-verified: all 32 share one `lastmod`** | All pages appear modified on every sitemap generation; forms and overlapping routes are included | Use real dates or omit them; include canonical indexable URLs only |
| Internal linking | Homepage links to a few offers; pricing cards mainly route to applications | Money pages do not consistently pass context and authority to dedicated offer pages | Add hub, prerequisite, next-step, and evidence links |
| Structured data | Stronger on homepage, pricing, and ResponseOS than elsewhere | No shared entity graph or schema contract across all commercial pages | Generate page schema from registry |
| AI crawler policy | Default allow; GPTBot disallow**; thirteen further path disallows** | Search permission is implicit rather than explicit; Cloudflare behavior is unverified | Explicitly allow OAI-SearchBot; preserve or change GPTBot only by policy decision**; preserve every existing disallow** |
| Machine-readable endpoints | `/llms.txt` and `/offers.json` return 404 | No concise machine-facing catalog | Add generated endpoints after registry exists |
| Diagnostic routes | Several assessment/diagnostic brands and routes coexist | Search intent, lead routing, and canonical ownership are unclear | Assign each route one role and redirect/noindex duplicates |
| **Proof inventory** | **Anonymous case-study cards; no detail routes; 7 insights, 4 frameworks** | **No named evidence exists to satisfy §4's qualification rule or §7's proof-link contract** | **Produce one named case study before Phase 2 hub pages ship** |
| **Test wiring** | **No `pnpm test`; per-file `tsx --test` steps in `build-and-lint.yml`** | **New contract tests silently never run unless added as workflow steps** | **Map each new test class to a named workflow — see redline #9** |

## 4. Canonical commercial model

Use the matrix's customer pathway as the site's narrative spine:

> Assessment → Paid Diagnostic → Blueprint / Architecture → Implementation → Managed Optimization

### Public offer-map families

| Family hub | Purpose | Matrix coverage | Public pricing treatment |
|---|---|---|---|
| `/solutions/diagnostics` | Establish truth, quantify gaps, choose the next intervention | R0–R9 | Publish fixed/starting price only when approved; keep corridors internal |
| `/solutions/digital-foundation` | Website, CRM, data, automation, analytics, local visibility, communications | A1–A9 | Present family-level starting price or scoped engagement; do not publish a nine-line shopping cart |
| `/solutions/revenue-systems` | CRM, routing, attribution, automation, response and follow-up | A2, A4, A5, A9, ResponseOS relationships | Separate implementation from recurring operation |
| `/solutions/business-memory` | Knowledge inventory, governance, SOPs, AI-ready context, founder intelligence | R3, BM1–BM11, M5 | Publish the six offer-level BM packages; keep BM1–BM11 allocations internal |
| `/solutions/ai-systems` | Voice agents, assistants, conversational automation, guardrails | R6, AR1–AR8, M6 | Keep productized ResponseOS distinct from bespoke AR implementation |
| `/solutions/custom-operations` | Internal applications, field workflows, documentation, billing, audit systems | R7, D1–D9, M7 | Assessment-gated and scoped; D1–D9 are components, not public products |
| `/solutions/managed-operations` | Operate, monitor, improve, and govern installed systems | M1–M10 | Publish selected retainers and starting prices; explain bundles and exclusions **— blocked until matrix §12 items 3, 4, and 6 (SLA tiers, included monthly capacity, overage methodology) are decided. A published retainer price without settled capacity and overage terms is the trust risk §14 warns about.** |

### Public versus internal rule

Create a standalone indexed page only when all are true:

- A buyer can understand the problem and outcome without reading the internal matrix.
- The offer has a distinct search intent or conversion role.
- Scope boundaries and pricing visibility are approved.
- The page can contain original proof, process, FAQ, deliverables, and next-step content.
- It is not merely an internal component of a larger engagement.

> ⚠️ **REDLINE 3 — this rule currently disqualifies every page in the original Phase 1/2 route table.**
> The fourth condition requires original proof. The repository has no named case study, no
> case-study detail routes, and 11 total long-form assets. Seven family hubs plus three diagnostic
> detail pages cannot all carry original proof today.
>
> **Enforcement added:** each page in the §6 route tables must name its proof source before build.
> A page with no identified proof source is deferred to a later wave — it is not shipped with
> placeholder or recycled copy. The alternative — explicitly choosing to ship thin hubs as
> `noindex` navigational stubs until proof lands — is a legitimate call, but it must be a stated
> decision rather than a silent outcome.

Therefore:

- R0–R9 may become public diagnostic pages, phased by demand**, proof,** and evidence.
- BM1–BM11, AR1–AR8, and D1–D9 should remain internal components unless one is later productized.
- M1–M10 may be represented on the managed-operations hub; only strategically important retainers need separate pages.
- **No family hub ships indexed without at least one named proof asset it can link under §7's link contract.**

## 5. Pricing reconciliation gate

The following conflicts must be decided before code or copy changes.

> ⚠️ **REDLINE 8 — scope of the matrix's authority.**
> Decision 1 below asks whether the matrix "supersedes" `pricing.ts`. The matrix claims less than
> that: its closing section states the *structure* is canonical, and each price carries an evidence
> status — Established, Established corridor, Market-calibrated working, Previously established, or
> Scoped. A blanket supersede promotes a "market-calibrated working" figure to settled fact.
> Supersede the structure; adjudicate prices row by row against evidence status.
>
> **Unresolved inside the matrix itself:** BM1–BM11 sum to a stated **$25,000 "Core Business
> Memory target,"** while the Business Memory package table lists **Core AI-Ready Business
> Knowledge System at a $15,000–$25,000 corridor, typical $15,000–$20,000.** The matrix states
> both. Decision 5 cannot be executed until one governs.

| Live/repository offer | Live public price | September matrix relationship | Conflict | Recommended default |
|---|---:|---|---|---|
| AI Readiness Score | Free | R0 Online AI Readiness Assessment: Free | Naming only | Rename consistently; preserve the existing funnel until route migration is approved |
| Revenue Leak Assessment | $1,997 | No exact equivalent; R2 target is $4,500 | Orphaned feeder offer **— and a direct name collision: matrix R2 is titled "ReKonr Revenue *Leak* Diagnostic," which is this offer's name** | Keep private or define it as a deliberately bounded pre-diagnostic product with non-overlapping deliverables **— decided jointly with the row below, not separately** |
| ReKonr Revenue Recovery Diagnostic | From $3,500 | R2 target/public anchor $4,500 **within a $3,500–$6,500 corridor** | ~~Price conflict~~ **Display-convention difference, not a price conflict. "From $3,500" is the corridor floor; $4,500 is the anchor. Both describe the same corridor truthfully.** | ~~Use $4,500 if the September matrix supersedes July; otherwise amend the matrix~~ **Choose one display convention — corridor floor or anchor — and apply it uniformly to all ten offers. Then resolve the "Revenue Leak" name: matrix R2's title and the $1,997 product cannot both hold it.** |
| Team AI Readiness Workshop | From $2,500 | Not present in the matrix | Orphaned public offer | Add to the matrix or remove from the canonical public map |
| ResponseOS Managed Pilot | From $8,500 + $1,500/month | Productized tiers: $797 setup + $397/month and upward; bespoke AR target $34,500 | Direct model conflict | Keep the managed implementation model public; keep low-cost tiers private until usage, scope, margin, and support are finalized **— matrix §12 item 1 lists public names and included usage for the three tiers as an open decision, so the tiers cannot be published either way until it closes** |
| ResponseOS Core | From $12,500 + $2,500/month | Same conflict as above | Direct model conflict | Same as above |
| Founder Intelligence System | From $15,000 | Core Business Memory $15,000–$25,000; Integrated Founder Intelligence/RAG $25,000–$60,000+ | Two offers collapsed into one name**, and the Core figure is itself contested inside the matrix — see the note above** | Split Core Business Memory from Integrated Founder Intelligence |
| Managed Intelligence | From $2,500/month | M5 target $2,500; M9 target $6,000; M8 from $2,000 | Scope ambiguity | Name the exact managed service and its installed-system prerequisite |
| Worksie Reference Pilot | Application only | Maps generally to D family, but is not named | Orphaned product | Keep as controlled case-study/pilot path, not a main offer family **— note this is also the most likely source of the first named case study Phase 2 depends on** |
| Strategic Partnership | Application only | Could map to M8, M9, or M10 | Scope ambiguity | Replace with the selected M8/M9/M10 service name or keep as a private qualification path |

*Matrix figures in this table were verified against the source and are accurate: R2 $4,500, ResponseOS Tier 1 $797 + $397/month, bespoke AR target $34,500, M5 $2,500/month, M8 from $2,000/month, M9 $6,000/month, Integrated Founder Intelligence/RAG $25,000–$60,000+.*

### Required pricing decisions

1. ~~Declare the September matrix as superseding `src/content/pricing.ts`, or amend the matrix where July pricing remains authoritative.~~ **Adopt the matrix's structure as canonical, and adjudicate each price against its stated evidence status. "Established" prices supersede `pricing.ts` directly; "Market-calibrated working" and "Scoped" prices require explicit ratification before they reach a public surface.**
2. Choose the public ResponseOS model: managed implementation, productized tier, or explicitly separated dual tracks.
3. Approve a `visibility` value for every offer: `public-fixed`, `public-from`, `public-scoped`, `private-corridor`, or `internal-allocation`.
4. Decide the disposition of the four orphaned public offers.
5. Separate Business Memory, Founder Intelligence/RAG, and general Managed Intelligence so one name does not represent several scopes**, and settle whether Core Business Memory is $25,000 or the $15,000–$20,000 typical**.
6. **Choose the public price-display convention — corridor floor ("From $X") or anchor — and apply it to all offers uniformly.**
7. **Assign the "Revenue Leak" name to exactly one product: the $1,997 bounded assessment or matrix R2. This is coupled to decision 6 and to the two ReKonr rows above; decide them in one sitting.**

## 6. Target sitemap architecture

> ⚠️ **REDLINE 5 — wave numbering.** The tables below previously used "Phase 1" and "Phase 2" for
> route waves, colliding with the differently-numbered implementation phases in §11. As written, a
> reader building "Phase 1" routes would ship pages before the registry that drives them exists.
> Waves are renumbered A/B/C and each table now names its §11 phase.

### Keep as canonical top-level routes

| Route | Role |
|---|---|
| `/` | Brand/entity homepage |
| `/solutions` | Canonical offer map |
| `/pricing` | Public pricing and qualification hub |
| `/resources` | Content/tool hub |
| `/about` | Person and organization authority |
| `/book-a-call` | High-intent conversion route |
| **`/case-studies`** | **Proof hub — in the sitemap and load-bearing for §7's link contract** |
| **`/insights`** | **Article hub (7 detail pages)** |
| **`/frameworks`** | **Definition/DefinedTerm hub (4 detail pages)** |
| **`/blog`** | **Sanity-backed content surface** |
| **`/workshops`** | **Destination for the Team AI Readiness Workshop CTA** |
| **`/roi-calculator`** | **Interactive tool, currently indexed** |

> ⚠️ **REDLINE 6.** All six added rows are build-verified present in the generated sitemap. Their
> omission, combined with the §6 rule "include only canonical, indexable pages," reads as an
> instruction to deindex them. §7 separately depends on `/insights` and `/case-studies` existing.

### Add in wave A **(§11 Phase 2 — after the registry exists)**

| Route | Page type | Primary matrix coverage | **Named proof source (required before build)** |
|---|---|---|---|
| `/solutions/diagnostics` | Family hub | R0–R9 | **TBD** |
| `/solutions/digital-foundation` | Family hub | A1–A9 | **TBD** |
| `/solutions/revenue-systems` | Family hub | A2, A4, A5, A9, R2 | **TBD** |
| `/solutions/business-memory` | Family hub and core offer | R3, BM, M5 | **TBD** |
| `/solutions/ai-systems` | Family hub | R6, AR, M6 | **TBD** |
| `/solutions/custom-operations` | Family hub | R7, D, M7 | **TBD** |
| `/solutions/managed-operations` | Family hub | M1–M10 | **TBD** |
| `/solutions/diagnostics/revenue-leak` | Diagnostic detail | R2 | **TBD** |
| `/solutions/diagnostics/business-memory` | Diagnostic detail | R3 | **TBD** |
| `/solutions/diagnostics/seo-aeo` | Diagnostic detail | R5 | **TBD** |
| ~~`/offers.json`~~ | ~~Sanitized machine-readable catalog~~ | ~~Public offers only~~ | **→ moved to wave C (§11 Phase 4), matching §11** |
| ~~`/llms.txt`~~ | ~~Concise machine-readable navigation~~ | ~~Canonical public pages only~~ | **→ moved to wave C (§11 Phase 4), matching §11** |

**Every row above is blocked until its proof source is named. A row still reading TBD at build time is deferred to wave B or ships `noindex`; it is not shipped indexed and thin.**

### Add in wave B **(§11 Phase 2, later)** after evidence and keyword validation

| Route | Matrix coverage |
|---|---|
| `/solutions/diagnostics/ai-readiness` | R1 |
| `/solutions/diagnostics/digital-foundation` | R4 |
| `/solutions/diagnostics/ai-receptionist` | R6 |
| `/solutions/diagnostics/software-readiness` | R7 |
| `/solutions/diagnostics/system-blueprint` | R8 |
| `/solutions/diagnostics/transformation-architecture` | R9 |
| `/solutions/business-memory/foundation` | BM Foundation |
| `/solutions/business-memory/core` | Core AI-Ready Business Knowledge System |
| `/solutions/business-memory/founder-intelligence` | Integrated Founder Intelligence / RAG |
| `/solutions/managed-operations/seo-aeo` | M4 |
| `/solutions/managed-operations/business-memory` | M5 |
| `/solutions/managed-operations/digital-operations-growth` | M9 |

### **Add in wave C (§11 Phase 4) — machine endpoints**

| **Route** | **Page type** | **Coverage** |
|---|---|---|
| **`/offers.json`** | **Sanitized machine-readable catalog** | **Public offers only** |
| **`/llms.txt`** | **Concise machine-readable navigation** | **Canonical public pages only** |

### Consolidate or redirect after funnel audit

| Current route | Proposed disposition | Gate |
|---|---|---|
| `/services` | 308 to `/solutions`, or repurpose as a non-overlapping engagement-method page | Confirm no backlinks/conversions need preservation beyond redirect |
| `/agents` | Recast as AI Systems product index or redirect to `/solutions/ai-systems` | Decide whether "agents" remains a public category |
| `/agents/responseos` | Keep canonical initially; later migrate to `/solutions/ai-systems/responseos` with 308 | Preserve current equity and campaign links |
| `/ai-readiness-diagnostic` | Keep funnel route; align visible name to R0 | Do not break lead capture |
| `/founder-intelligence/diagnostic` | Assign a unique role or redirect/noindex | Audit form, analytics, and lead destination |
| `/founder-gravity-audit` and ~~`/diagnostic`~~ **`/founder-gravity-audit/diagnostic`** | Assign unique role or redirect/noindex | Resolve naming and funnel overlap **— no top-level `/diagnostic` route exists in `src/app`; the two diagnostic sub-routes are `/founder-gravity-audit/diagnostic` and `/founder-intelligence/diagnostic`, both build-verified in the sitemap** |
| `/apply` and thank-you/form-step routes | Remove from XML sitemap; generally noindex | Preserve accessibility to users and campaigns **— `/apply` is build-verified present in the generated sitemap, and every pricing CTA routes to it with UTM parameters; confirm no campaign depends on its indexation before removal** |

### Sitemap implementation rules

- Include only canonical, indexable, HTTP 200 pages.
- Do not include application steps, thank-you pages, internal tools, portal/admin/API routes, or redirected URLs.
- Use real content modification dates from source metadata/CMS. For static pages without a trustworthy date, omit `lastModified` rather than setting it to the request time.
- Generate offer URLs from the same registry used by pages and schema.
- Add a test that every sitemap URL returns 200, is canonical to itself, and is not `noindex`. **This test requires a running server and therefore belongs in `.github/workflows/smoke-preview.yml` and `smoke-prod.yml`, not `build-and-lint.yml`. See redline #9.**
- Keep sitemap segmentation optional until URL volume warrants separate solution/content sitemaps.

## 7. Internal linking system

### Link contract by page type

| Source page | Required links |
|---|---|
| Homepage | `/solutions`, primary diagnostic, primary implementation wedge, `/pricing` |
| `/solutions` | All seven family hubs, current primary diagnostic, pricing |
| Family hub | Parent `/solutions`, every public child offer, one relevant proof/resource, pricing or application next step |
| Diagnostic page | Family hub, one or two prescribed implementation families, one evidence resource, application CTA |
| Implementation page | Required diagnostic, relevant managed service, pricing anchor, case study/insight, application CTA |
| Managed-service page | Installed-system prerequisite, implementation page, pricing, operating-boundary FAQ, application CTA |
| Pricing card | Explanatory offer page plus distinct apply/book CTA; do not make the form the only internal destination |
| Insight/framework article | One canonical definition/hub, one relevant diagnostic, one implementation/service page |
| Case study | The diagnosed problem, implemented offer, managed layer if applicable, relevant CTA |

> ⚠️ **REDLINE 3 (continued).** Three rows above — Family hub, Diagnostic page, Implementation
> page — require a proof or case-study link, and the last row defines a page type that has no
> pages: there are no `/case-studies/[slug]` routes. Either produce case-study detail pages as a
> Phase 2 prerequisite, or relax these rows to accept an insight/framework article as the evidence
> link — and record which, because the choice changes what Phase 2 can ship.

### Relationship rules

- Every indexed offer page must have at least one inbound contextual link from outside navigation/footer.
- Every child links to its parent hub with descriptive anchor text.
- Diagnostics link forward; implementations link backward to their diagnostic and forward to management.
- Do not link every page to every offer. Use the registry's explicit `followOnOfferIds`, `prerequisiteOfferIds`, and `relatedResourcePaths`.
- Use descriptive anchors such as "Business Memory Diagnostic," not "learn more."
- Maintain one canonical page per commercial entity; articles may discuss an entity but should link to its definition/offer page.
- Add automated orphan-page and broken-internal-link tests. **These are static analyses over the registry and route tree, so they run in `build-and-lint.yml` — but each needs its own explicit `pnpm exec tsx --test` step. See redline #9.**

## 8. Machine-readable offer architecture

### Canonical source

Generalize the current typed `src/content/pricing.ts` into a full offer registry. Recommended shape:

```json
{
  "id": "R3",
  "slug": "business-memory-diagnostic",
  "name": "Business Memory Diagnostic & Knowledge Inventory",
  "family": "business-memory",
  "lifecycleStage": "diagnostic",
  "summary": "Inventories organizational knowledge and determines whether it is governed and AI-ready.",
  "decisionAnswered": "What knowledge exists, where does it live, and is it AI-ready?",
  "audience": ["founder-led-service-businesses"],
  "pricing": {
    "currency": "USD",
    "display": "$3,500",
    "min": 3500,
    "max": 3500,
    "billingModel": "one_time",
    "visibility": "public-fixed",
    "evidenceStatus": "established"
  },
  "pagePath": "/solutions/diagnostics/business-memory",
  "public": true,
  "indexable": true,
  "prerequisiteOfferIds": [],
  "followOnOfferIds": ["BM-FOUNDATION", "BM-CORE", "M5"],
  "schemaTypes": ["Service", "Offer"],
  "updatedAt": "2026-09-01"
}
```

**Two fields to add, each making a gate stated elsewhere in this plan mechanically checkable:**

```json
  "proofAssetPaths": [],
  "displayConvention": "anchor"
```

**`proofAssetPaths` enforces §4's proof requirement — a contract test can fail any record with
`indexable: true` and an empty proof array. `displayConvention` records which price-display rule
(decision 6) the record follows, so the parity test can verify HTML, JSON-LD, and `/offers.json`
render the same convention rather than merely the same number.**

### Source files and generated views

| Concern | Recommended source |
|---|---|
| Full internal registry | `src/content/offers.ts` |
| Runtime type/validation | ~~Existing TypeScript types plus Zod if already available in the repo~~ **Existing TypeScript types plus assertion helpers in the `node:test` files. Zod is not a current dependency; adding it is a dependency change requiring its own approval under the repository contract, and the contract this registry needs is expressible without it.** |
| Public sanitized feed | `src/app/offers.json/route.ts` generated from public fields only |
| Offer relationship helpers | `src/lib/offers/relationships.ts` |
| JSON-LD builders | Extend `src/lib/seo/schema.ts` |
| Human offer map | `/solutions` and family pages read the registry |
| Pricing page | Reads public-price views from the registry |
| Sitemap | Reads `public && indexable` offer paths from the registry |
| `llms.txt` | Generated concise index from the same registry |
| Legacy JSON catalog | ~~Mark superseded or generate it from the registry; do not hand-maintain both~~ **Mark non-authoritative for systems offers and exclude from `/offers.json` and the sitemap. Retain unchanged as the interim record for podcast, media, and personal-brand families, which matrix §12 item 10 lists as not yet priced in the systems matrix. Revisit when that integration closes.** |

### Public JSON rules

- Expose only approved public names, descriptions, prices, relationships, URLs, and update dates.
- Never expose internal allocations, private price corridors, delivery margin assumptions, or proposal rules.
- Return `application/json; charset=utf-8`, allow GET/HEAD, and set a conservative cache policy.
- Include a schema/version field so downstream tools can detect changes.
- Make HTML pages canonical for search; `/offers.json` is a machine-consumption convenience.
- **Filter `private-corridor` and `internal-allocation` records at serialization time in the public view helper, not at authoring time, so a mis-tagged record fails closed rather than leaking.**

## 9. JSON-LD and entity graph

### Site-wide graph

Use stable `@id` values so pages refer to the same entities:

- `https://www.audiojones.com/#organization` — AJ Digital LLC, alternate name Audio Jones.
- `https://www.audiojones.com/#person` — Audio Jones/Tyrone Nelms.
- `https://www.audiojones.com/#website` — AudioJones.com.
- Per-page `#webpage`, per-service `#service`, and per-offer `#offer` identifiers.

### Schema by page type

| Page type | JSON-LD types | Rules |
|---|---|---|
| Homepage | Organization, Person, WebSite, WebPage | Reuse stable IDs and visible brand facts |
| Offer-map/family hub | CollectionPage or WebPage, ItemList, BreadcrumbList | ItemList contains canonical public children only |
| Diagnostic/implementation/managed page | Service, Offer when a public price exists, BreadcrumbList, WebPage | Offer price must match visible copy exactly |
| Pricing | ItemList of Service entries, Offer only for approved public prices, BreadcrumbList, FAQPage | No internal corridors or application-only fake prices |
| Framework/definition | DefinedTerm plus Article/WebPage where appropriate | Use only for genuinely defined concepts |
| Article/insight | Article, BreadcrumbList | Accurate author and publication/modification dates |
| FAQ | FAQPage only when the same Q&A is visibly rendered | Never add schema-only answers |

### Schema controls

- Generate `Service` and `Offer` objects from the registry, not duplicated literals.
- Do not use Product for bespoke professional services.
- Do not add aggregate ratings, reviews, guarantees, or performance claims without evidence.
- Structured data must describe the page's visible primary content.
- Validate JSON syntax, canonical URLs, price parity, and stable IDs in CI. **As a static assertion over the registry and the builders in `src/lib/seo/schema.ts`, this runs in `build-and-lint.yml` as its own step.**
- Treat `speakable` markup as optional; it is not a substitute for concise visible definitions. **Note: `speakableSpec()` is already implemented and exported from `src/lib/seo/schema.ts`. The open question is whether to keep using it, not whether to add it.**

## 10. Crawler and AI-readability policy

OpenAI documents three distinct controls: OAI-SearchBot for ChatGPT Search, GPTBot for potential model-training use, and ChatGPT-User for certain user-triggered retrieval. These settings are independent.

> ⚠️ **REDLINE 1 — CRITICAL. This is a merge, not a replacement.**
> The original draft listed only three disallowed paths. The generated `robots.txt` — build-verified
> 2026-09-01 — carries **sixteen**. Pasting the original block would have unblocked `/uploader`,
> `/env`, `/status`, `/not-authorized`, `/test-slack`, `/consent-testimonial`, `/business`,
> `/creators`, `/artisthub`, `/(site)/artist-hub`, `/(site)/epm`, and `/portal/admin/` to every
> crawler.
>
> **Second, subtler defect:** a named user-agent group does **not** inherit the `*` group's
> disallows. robots.txt matching selects the single most specific matching group and applies only
> that group's rules. An `OAI-SearchBot` group with bare `Allow: /` therefore *widens* that
> crawler's access — even if every other disallow is preserved.
>
> **The only intended change is adding the OAI-SearchBot group. The disallow set must not shrink.**

~~Recommended:~~ **Recommended (complete — mirrors the build-verified output plus the new group):**

```text
User-agent: *
Allow: /
Disallow: /portal/
Disallow: /ops/
Disallow: /api/
Disallow: /test-slack
Disallow: /uploader
Disallow: /env
Disallow: /not-authorized
Disallow: /status
Disallow: /consent-testimonial
Disallow: /business
Disallow: /creators
Disallow: /artisthub
Disallow: /(site)/artist-hub
Disallow: /(site)/epm
Disallow: /portal/admin/

User-agent: OAI-SearchBot
Allow: /
Disallow: /portal/
Disallow: /ops/
Disallow: /api/
Disallow: /test-slack
Disallow: /uploader
Disallow: /env
Disallow: /not-authorized
Disallow: /status
Disallow: /consent-testimonial
Disallow: /business
Disallow: /creators
Disallow: /artisthub
Disallow: /(site)/artist-hub
Disallow: /(site)/epm
Disallow: /portal/admin/

User-agent: GPTBot
Disallow: /

Sitemap: https://www.audiojones.com/sitemap.xml
```

**Simpler alternative worth considering: omit the OAI-SearchBot group entirely.** The `*` group
already permits it, so the group adds no access — only an explicit policy statement, at the cost of
a duplicated list that will drift. If kept, add a contract test asserting the two lists stay
identical.

Keep the GPTBot block if AJ Digital intends to opt out of training use. That block does not need to be removed to permit ChatGPT Search. Also verify Cloudflare does not block OAI-SearchBot's published IP ranges.

### `llms.txt`

Add a concise generated file containing:

- Brand and legal-entity definition.
- One-sentence category definition.
- Canonical solution hubs.
- Canonical diagnostics and primary offers.
- Pricing, evidence, and resource links.
- Last updated date.

Do not place secret, private, proposal-only, or internal pricing data in it. Treat it as supplemental and experimental; crawlable HTML, sitemaps, canonical URLs, and structured data remain authoritative.

## 11. Implementation phases

### Phase 0 — Ratify commercial truth

- Resolve the pricing conflicts in Section 5**, including the two decisions added there: the public price-display convention, and which product owns the "Revenue Leak" name**.
- Assign public/private visibility to every matrix row.
- Approve route dispositions for `/services`, `/agents`, and overlapping diagnostics.
- Record decisions in `docs/DECISIONS.md` and a pricing reconciliation document.
- **Close — or explicitly defer with a stated reason — each of the ten items in the matrix's own §12 "Remaining commercial decisions":**
  1. **Public names and included usage for the three ResponseOS tiers**
  2. **Whether diagnostic fees are credited toward implementation**
  3. **Final SLA tiers and response-time commitments**
  4. **Included monthly capacity for M1–M10**
  5. **Pass-through billing administration fee**
  6. **Bundled-usage and overage methodology (telephony, SMS, AI models, storage)**
  7. **M9's canonical capacity model**
  8. **South Florida quote validation for R3, R4, R5, R6, R8, and R9**
  9. **Final public-versus-internal visibility status for each price**
  10. **Disposition of the podcast, media, and personal-brand families not priced in the systems matrix**
- **Resolve the matrix-internal Core Business Memory contradiction ($25,000 vs. $15,000–$20,000).**
- **Decide whether §7's proof-link contract is enforced as written or relaxed — this determines whether Phase 2 needs case-study detail routes.**

> ⚠️ **REDLINE 2 — CRITICAL.** The original Phase 0 covered roughly three of the matrix's ten
> stated blockers. Items 3, 4, and 6 are publication-blocking for the managed retainers §4
> schedules for public pricing — a retainer price without settled capacity and overage terms is a
> live commercial commitment with undefined delivery. Item 1 blocks the ResponseOS tier decision in
> either direction.

**Exit gate:** one approved table maps every public offer to one name, one price-display rule, one route, one lifecycle stage, and one CTA — **and every matrix §12 item is marked closed or explicitly deferred with a reason.**

### Phase 1 — Build the canonical registry

- Create the typed registry and public/private views.
- Migrate `src/content/pricing.ts` to read the registry.
- ~~Deprecate or generate the legacy JSON catalog.~~ **Mark the legacy JSON catalog non-authoritative for systems offers and exclude it from generated public surfaces. Leave its media and personal-brand entries intact.**
- Add contract tests for IDs, routes, prices, visibility, and relationships. **Extend `test/pricing-offers.test.ts` where possible — it already has a CI step. Any genuinely new test file needs its own `pnpm exec tsx --test` step added to `build-and-lint.yml` in the same PR, or it never runs.**

**This phase has no proof prerequisite beyond Phase 0 and can proceed as a narrow registry/governance branch. It is the correct place to start, and it is the only phase fully unblocked today.**

**Exit gate:** pricing cards and pricing JSON-LD are generated from the same records.

### Phase 2 — Build offer map and family hubs

- Rebuild `/solutions` from the registry.
- **Produce at least one named case study with a `/case-studies/[slug]` detail route — or formally relax §7's proof-link contract per the Phase 0 decision. This is a prerequisite, not a parallel task.**
- Add the seven family hubs**, each with `proofAssetPaths` populated. Hubs with no proof source ship `noindex` as navigational stubs, or wait.**
- Preserve existing routes until redirect approval and analytics review.
- Add offer detail pages in the P0 order: Revenue Leak, Business Memory, SEO/AEO, then remaining diagnostics. **The Revenue Leak page cannot be named until Phase 0 decision 7 resolves the collision between matrix R2's title and the $1,997 assessment.**

**Exit gate:** no public offer is orphaned, **no indexed page lacks a named proof asset,** and no internal component is accidentally presented as a public product.

### Phase 3 — Internal links and sitemap

- Implement the page-type link contract.
- Remove forms/duplicates from the sitemap.
- Generate offer routes and real modification dates.
- Add 200/canonical/noindex/orphan/broken-link tests. **Split by where they can run: orphan and broken-internal-link checks are static and belong in `build-and-lint.yml`; 200, self-canonical, and noindex checks need a deployed URL and belong in `smoke-preview.yml` and `smoke-prod.yml`.**

**Exit gate:** every sitemap URL is canonical and indexable; every money page has contextual inbound and next-step links.

### Phase 4 — Entity graph and machine endpoints

- Extend schema builders with stable IDs and registry-driven Service/Offer graphs.
- Add `/offers.json` and `/llms.txt`. **(These are §6 wave C. The original §6 listed them under "Phase 1" — see redline #5.)**
- Make OAI-SearchBot permission explicit and document the GPTBot policy. **Preserve all existing disallows — see redline #1.**
- Verify Cloudflare bot access.

**Exit gate:** HTML, JSON-LD, `/offers.json`, `llms.txt`, and the sitemap agree on names and canonical URLs.

### Phase 5 — Demand and cannibalization validation

- Use DataForSEO after names/routes are ratified to map search intent, South Florida modifiers, national demand, competitor SERPs, and page cannibalization risk.
- Use Firecrawl to re-crawl the deployed preview and compare rendered offers, links, canonicals, and machine endpoints.
- Submit the canonical sitemap in Google Search Console and monitor indexation.

**Exit gate:** every new indexed page has a distinct query/decision role and no two pages target the same primary intent without an explicit hub/detail relationship.

## 12. Likely repository files affected during implementation

| Existing file | Planned role/change |
|---|---|
| `src/content/pricing.ts` | Migrate to registry-backed public pricing view |
| `data/catalog/services_pricing_catalog.json` | ~~Supersede or generate; stop independent maintenance~~ **Mark non-authoritative for systems offers; exclude from public surfaces; retain for media and personal-brand families pending matrix §12 item 10** |
| `src/app/solutions/page.tsx` | Registry-driven canonical offer map |
| `src/app/pricing/page.tsx` | Link cards to detail pages and consume registry |
| `src/config/nav.ts` | Preserve primary nav; add family discovery through Solutions, not seven top-level nav items |
| `src/app/sitemap.ts` | Canonical/indexable registry routes and truthful dates **— remove `/apply`; replace `new Date()` with real dates or omit `lastModified`** |
| `src/app/robots.ts` | Explicit OAI-SearchBot policy; retain GPTBot decision **; preserve all thirteen existing non-obvious disallows — the disallow set must not shrink, and a named group does not inherit the `*` group's rules** |
| `src/lib/seo/schema.ts` | Stable entity IDs and registry-driven Service/Offer/ItemList builders **(note `speakableSpec()` already exists here)** |
| `src/app/services/page.tsx` | Redirect or distinct role after approval |
| `src/app/agents/responseos/page.tsx` | Price/model reconciliation; eventual canonical-route decision |
| `test/pricing-offers.test.ts` | Expand into offer-registry parity and policy tests |
| **`.github/workflows/build-and-lint.yml`** | **Add a `pnpm exec tsx --test` step per new test file; static parity, orphan, and broken-link checks live here** |
| **`.github/workflows/smoke-preview.yml`, `smoke-prod.yml`** | **Host the 200 / self-canonical / noindex sitemap assertions, which need a running deployment** |
| **`src/app/case-studies/`** | **Add `[slug]` detail routes if §7's proof-link contract is kept as written** |
| New `src/content/offers.ts` | Canonical internal offer registry |
| New `src/lib/offers/*` | Public view and relationship helpers |
| New `src/app/offers.json/route.ts` | Sanitized public JSON |
| New `src/app/llms.txt/route.ts` | Generated concise machine-readable index |

Implementation must follow the repository contract: create a branch, avoid unrelated refactors or dependency changes, and pass `pnpm typecheck`, `pnpm lint`, `pnpm check:no-firebase`, and `pnpm build` before handoff. **There is no `pnpm test`; run contract tests the way CI does — `pnpm exec tsx --test test/<file>.test.ts`, one invocation per file. Note `pnpm install` fails inside a git worktree on Windows; junction `node_modules` to the main checkout instead.**

## 13. Acceptance criteria

- One authoritative offer registry controls every public name, route, price display, and relationship.
- Zero public price mismatches between visible HTML, JSON-LD, and `/offers.json`.
- Zero internal allocations or private corridors exposed publicly.
- `/solutions` visibly represents the entire approved customer journey.
- Every public offer belongs to exactly one primary family and lifecycle stage.
- Every indexed offer page has at least one contextual inbound link and one appropriate next-step link.
- Every sitemap URL returns 200, is self-canonical, and is indexable.
- Application, thank-you, portal, admin, API, and redirected routes are absent from the XML sitemap.
- `/llms.txt` returns plain text and `/offers.json` returns valid JSON rather than branded 404 HTML.
- OAI-SearchBot is explicitly allowed; GPTBot behavior matches the documented training policy.
- Schema is generated from visible facts and passes automated parity checks.
- No route rename occurs without an approved redirect map and analytics/funnel check.
- **`robots.txt` disallows every path it disallowed before the change, for every user-agent group present; the disallow set only grows.**
- **Every indexed offer page has a non-empty `proofAssetPaths`, or is explicitly recorded as an accepted `noindex` stub.**
- **Every public price uses the single ratified display convention across HTML, JSON-LD, and `/offers.json`.**
- **Every new test file has a corresponding step in a CI workflow that can actually execute it.**
- **No matrix §12 item is silently open at the Phase 0 exit — each is closed or deferred with a reason on the record.**

## 14. Primary risks and controls

| Risk | Consequence | Control |
|---|---|---|
| Publishing the matrix without reconciling July decisions | Contradictory prices and damaged trust | Phase 0 approval gate**, now inheriting all ten matrix §12 items** |
| Creating a page per implementation component | Thin/cannibalizing content | Public-page qualification rule |
| Exposing internal pricing through JSON | Negotiation and governance leakage | Sanitized public view**, filtered at serialization so mis-tagged records fail closed** |
| Redirecting diagnostic routes before auditing forms | Lost leads and campaign failures | Funnel and analytics gate |
| Treating `llms.txt` as sufficient | Weak real-world discoverability | HTML, sitemap, internal links, schema remain primary |
| Blocking search bots at Cloudflare despite permissive robots | AI-search invisibility | IP/log verification after deploy |
| Schema drifting from visible copy | Search-engine distrust and invalid markup | Registry generation and parity tests |
| **Replacing rather than merging `robots.txt`** | **Uploader, env, and status surfaces exposed to all crawlers** | **Disallow-set-only-grows acceptance criterion; diff `robots.ts` before merge** |
| **Adding a named crawler group with bare `Allow: /`** | **That crawler bypasses every `*`-group disallow** | **Repeat the disallow list per group; contract-test the two lists for equality** |
| **Shipping hubs with no proof to hit a page-count target** | **Ten thin pages that fail this plan's own §4 rule and dilute `/solutions`** | **`proofAssetPaths` required per indexed page; unproven pages `noindex` or deferred** |
| **Adding contract tests with no CI step** | **Green builds that assert nothing; drift returns silently** | **Test-file-to-workflow mapping in §12; PR checklist item** |
| **Publishing managed retainers before capacity and overage terms settle** | **Price disputes and refund exposure on live commitments** | **Matrix §12 items 3, 4, and 6 in the Phase 0 gate** |

## 15. Recommended immediate next action

~~Ratify the pricing reconciliation table in Section 5.~~ **Two actions, in this order.**

**First — ahead of any pricing ratification — rewrite the Phase 0 gate to inherit the matrix's own §12 list, then settle the coupled naming and display questions in one sitting:**

- **The public price-display convention: corridor floor or anchor, applied uniformly to all ten offers.**
- **Which product owns the name "Revenue Leak": matrix R2, or the $1,997 bounded assessment. These two cannot be decided independently of each other or of the two ReKonr rows in §5.**

**Second, ratify the Section 5 table.** The recommended default is **unchanged from the original plan, and remains the operator's decision — nothing in this redline ratifies a price or a name**:

- Keep ResponseOS public as a managed implementation, not low-cost SaaS tiers, until the productized scope and economics are finalized.
- Adopt the September R2 anchor of $4,500 for the full ReKonr diagnostic.
- Keep the $1,997 Revenue Leak Assessment only if its bounded scope is explicitly distinct.
- Split Business Memory Core from Integrated Founder Intelligence/RAG.
- Map Managed Intelligence to an exact M-service rather than using it as a catch-all.

Once those decisions are approved, Phase 1 can be implemented as a narrow registry/governance branch before any new public pages are built. **Phase 1 is genuinely unblocked by the proof gap and can start as soon as Phase 0 closes; Phase 2 cannot.**

## Sources reviewed

- [AudioJones.com live site](https://www.audiojones.com)
- [AudioJones.com repository](https://github.com/AudioJones-Dev/audiojones.com)
- [Official OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)
- Repository sources including `AGENTS.md`, `docs/PRD.md`, `src/config/nav.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/content/pricing.ts`, `src/lib/seo/schema.ts`, and the existing pricing/SEO strategy records.
- **Redline verification additionally read in full: `.github/workflows/ci.yml`, `.github/workflows/build-and-lint.yml`, `package.json`, `test/pricing-offers.test.ts`, `src/app/case-studies/page.tsx`, `src/app/solutions/page.tsx`, `src/content/insights/index.ts`, `src/content/frameworks/index.ts`, `data/catalog/services_pricing_catalog.json`, and `AJ-Digital-Master-Pricing-Matrix-2026 v2.md`.**
- **Build-verified claims come from a local `pnpm build` on 2026-09-01 at commit `1c360b2`, inspecting the generated `.next/server/app/robots.txt.body` and `sitemap.xml.body`.**
