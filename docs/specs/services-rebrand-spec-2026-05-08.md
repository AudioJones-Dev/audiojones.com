---
title: "Spec — Services Rebrand v1 (DESIGN.md compliance)"
status: "draft, awaiting user decision lock"
target_route: "/services"
target_branch: "feat/services-rebrand-v1 (TBD by Codex)"
parent_design_doc: "docs/design/DESIGN.md"
related_audit: "DESIGN.md §17.5 + §16 Anti-Patterns"
last_updated: "2026-05-08"
---

# Spec — Services Rebrand v1

This spec is a self-contained handoff for the Services page rebrand. **Codex will read this and implement; this PR ships only the spec, no app code.** No prior conversation context required.

The current `src/app/services/page.tsx` is the worst-offending DESIGN.md-drift file on the site. This spec captures audit findings, brand-framing direction, IA, component-level direction, Whop integration strategy, acceptance criteria, phased implementation, and open questions for user lock.

---

## §1 Goal

### What v1 ships

- Rebuild `src/app/services/page.tsx` (route `/services`) so it reads as **strategic-operator tooling**, not as ecommerce.
- Eliminate every P1 DESIGN.md drift item enumerated in §2 below.
- Reframe page copy from "buy this offer" toward "this is how we work with you."
- Re-anchor the primary conversion CTA to `/roi-calculator` (the just-shipped ROI calculator) with a secondary `/apply` CTA, replacing the gradient "Find the Right Offer" CTA.
- Harden Whop product integration with ISR caching + graceful fallback.

### Anti-goals

- ❌ No nav restructure (PR #50 owns `src/config/nav.ts` + Header/Footer single-source — do not touch).
- ❌ No CTA destination changes to `signalDiagnostic` (PR #51 unified the constant; PR #53 set its value to `/applied-intelligence/diagnostic`. Both diagnostic and ROI CTAs must continue to flow through `ctaLinks` in `src/config/links.ts`).
- ❌ No new routes added — `/services` stays at `/services`.
- ❌ No new font dependencies (DESIGN.md §15).
- ❌ No new color tokens introduced — work within the existing `--bg-*`, `--fg-*`, `--line-*`, `--signal`, `--system`, `--metric` palette.
- ❌ No changes to `/applied-intelligence`, `/roi-calculator`, `/apply`, `/blog`, or other existing routes.
- ❌ No DESIGN.md edits in this PR (those land in their own PR if needed).

---

## §2 Audit summary — current `src/app/services/page.tsx` violations

The current implementation (97 lines) violates DESIGN.md across 6 P1 sections + 1 P2 caching item.

### P1 — Token / typography / anti-pattern violations

| # | File:line | Current code | DESIGN.md section violated | Required correction |
|---|---|---|---|---|
| 1 | `src/app/services/page.tsx:45` | `<main className="min-h-screen bg-[#111] text-white">` | **§4 Token philosophy** ("Don't reference raw values"); **§5.1** (background should map to `--bg-0` = `#05070F`, not arbitrary `#111`) | `bg-bg-0` (page) or wrap each section with appropriate `bg-bg-{0..3}` and explicit text utilities |
| 2 | `src/app/services/page.tsx:48` | `<h1 className="text-4xl sm:text-5xl font-extrabold">Services & Offers</h1>` | **§7 Typography Roles** (use `t-h1` utility, not raw Tailwind sizing); **§5.2** (typography tokens via `t-*` classes) | `<h1 className="t-h1">{newTitle}</h1>` — see §3 for new title |
| 3 | `src/app/services/page.tsx:56-57` | `bg-gradient-to-r from-[#FF4500] to-[#FFD700] hover:opacity-90` on a CTA, with `text-black` | **§6 Color Roles** ("Orange is never decorative; if a button is orange, the action must be the most important next step"); **§16 Anti-Patterns** ("Discount/sale-style orange usage", "Ecommerce urgency styling") | Use `<ButtonLink variant="glow">` (the `.btn-glow` signal-orange CTA) for primary, or `variant="secondary"` for the secondary border CTA. Zero gradient backgrounds on CTAs. |
| 4 | `src/app/services/page.tsx:56,77,84` | `rounded-full` on CTAs (3 instances) | **§9 Border Radius Rules** ("Standard buttons: rounded-md; pills/badges: rounded-full"); **§16 Anti-Patterns** ("Over-rounded consumer UI") | `rounded-md` on standard CTAs (matches input height for inline alignment). `rounded-full` reserved for pills/badges/progress bars only. |
| 5 | `src/app/services/page.tsx:48,58` | Copy: `"Services & Offers"`, `"Find the Right Offer"` | **§16 Anti-Patterns** ("Ecommerce urgency styling"); **DESIGN.md §2 Brand Thesis** (Editorial Intelligence Systems, not retail) | New title + subhead per §3 below — operator framing, not ecommerce |
| 6 | `src/app/services/page.tsx:72` | `<div className="text-3xl font-extrabold bg-gradient-to-r from-[#FF4500] to-[#FFD700] bg-clip-text text-transparent">` | **§16 Anti-Patterns** ("Generic AI purple gradients" / "Decorative effects that don't clarify hierarchy" — extends to gradient text); **§7** (use typography utility, not inline) | If price needs visual emphasis, use `t-h3` or `t-h2` with `text-fg-0`. No gradient text. |

### P2 — Performance / data integrity

| # | File:line | Current code | Issue | Required correction |
|---|---|---|---|---|
| 7 | `src/app/services/page.tsx:42` (calling `getProducts()`) | `cache: "no-store"`, `next: { revalidate: 0 }` | Whop products fetched on every render — no SSG/ISR strategy. Marketing copy + slow-changing product list re-fetched on every page view. Fragile if Whop API is down (currently returns `[]` silently → blank section with no fallback message in some states). | ISR with `revalidate: 3600` (1 hour). Typed product response. Graceful fallback if Whop API unreachable — see §6. |

### Cross-reference

- DESIGN.md **§17.5** (Drift Risks) established the audit-first discipline; while §17.5 explicitly names lead-capture critical-path components as the highest-priority drift, the audit pattern surfaces the services page as the **next-highest-priority structural drift** because every visible CTA on the page violates §6/§9/§16. This spec resolves that.
- DESIGN.md **§16** (Anti-Patterns) is violated in 4 of the 6 P1 items above.
- DESIGN.md **§7** (Typography Roles) is violated by raw `text-Xxl font-extrabold` patterns.

---

## §3 Brand framing direction

### Page-level reframe

Move from ecommerce framing → strategic-operator framing. The user is a founder evaluating whether AJ is the right partner for an operating-system rebuild. They are NOT here to "find the right offer" or browse a catalog.

### Page title — propose 3 candidates (user picks one in §10 Q1)

| # | Candidate | Rationale |
|---|---|---|
| **A** | **"Applied Intelligence Services"** | Mirrors the existing `/applied-intelligence` framework page; reinforces the AJ thesis; clean and operator-clinical. |
| **B** | **"Operating Systems for Founder-Led Businesses"** | Most descriptive of what AJ actually delivers; longest of the three; emphasizes "operating systems" framing. |
| **C** | **"How We Work With Founders"** | Most warm and direct; positions the page as engagement framing rather than a catalog. |

### Hero subhead — propose 2 candidates (user picks one in §10 Q1)

| # | Candidate |
|---|---|
| **a** | "We don't sell tools. We build the operating systems founder-led businesses run on — diagnosed first, automated second, measured continuously." |
| **b** | "Engagements anchored in signal — diagnostic first, applied intelligence buildout second, measurement and durability third. No retainers, no template solutions, no AI theater." |

### Service-bucket framing principles

For each bucket (current Whop products OR new buckets per §10 Q3), reframe from "buy this" to "this is how we work with you." Examples of the reframe pattern:

- ❌ Old: "AI Branding System – $999/mo. Includes podcast production, automation, content."
- ✅ New: "**Applied Intelligence Buildout.** A 90-day engagement to install the operating system your business already needs but isn't running. We diagnose the bottleneck, deploy the AI agent that resolves it, and instrument the measurement loop. Most engagements ship in 60 days."

- ❌ Old: "Podcast Production Package – $499/mo. Episodes, edits, distribution."
- ✅ New: "**Authority + Content Systems.** A monthly cadence that turns your operator perspective into compounding signal. We don't sell episodes — we install the editorial system that makes thought leadership a byproduct of how you already work."

The exact buckets + their canonical descriptions are an open question (see §10 Q3) — the user must lock the framing direction before Codex implements copy.

### CTA hierarchy (locked, replaces current "Find the Right Offer")

| Position | Label | Destination | Variant | Rationale |
|---|---|---|---|---|
| Primary (hero) | **"Calculate Your AI ROI"** | `/roi-calculator` (internal) | `<ButtonLink variant="glow">` | Matches the site Header CTA; leverages the just-shipped (PR #52) ROI calculator; primary conversion path; signal-orange = "the most important next step" per §6. |
| Secondary (hero) | **"Apply for Engagement"** | `/apply` (internal) | `<ButtonLink variant="secondary">` | Transparent + border per §11.1; the next-best action for founders who already know they want a conversation. |
| Footer (page-bottom CTA section) | **"Take the Signal Diagnostic"** | `ctaLinks.signalDiagnostic` (= `/applied-intelligence/diagnostic` — see §17.1 of `docs/codex/roi-calculator-v1-brief.md` for canonical-CTA policy) | `<ButtonLink variant="glow">` | Page-bottom recovery CTA for users who've read the page but haven't yet engaged. Same canonical destination used by ROI Calculator + applied-intelligence + blog. |

**Hard rule: zero `<a>` tags with hardcoded URLs for these three destinations. All three flow through `<ButtonLink>` with `href` from `ctaLinks` (or the literal internal route for `/roi-calculator` and `/apply`).**

---

## §4 IA + section structure

Proposed page architecture (in render order):

### 4.1 Hero (server-rendered, ~80vh on mobile, capped on desktop)

- **Eyebrow**: `<Eyebrow tone="gold">Audio Jones Services</Eyebrow>`
- **H1**: chosen title from §3 (rendered with `t-h1` utility)
- **Subhead** (`t-lead` or `t-body-lg`, `text-fg-2`): chosen subhead from §3
- **Dual CTA** (flex row, mobile-first stacked):
  - Primary: `<ButtonLink variant="glow" href="/roi-calculator">Calculate Your AI ROI</ButtonLink>`
  - Secondary: `<ButtonLink variant="secondary" href="/apply">Apply for Engagement</ButtonLink>`
- Trailing small-print paragraph (`t-small`, `text-fg-3`): one-line orienting sentence (proposed copy: "We engage selectively. Most engagements ship in 60 days. Diagnostic first, automation second.")

### 4.2 Strategic positioning section ("What we actually do")

- Eyebrow: `<Eyebrow tone="gold">The Method</Eyebrow>`
- H2 (`t-h2`): "We don't sell AI. We diagnose your operating system, then install what's missing." (or equivalent — propose 1-2 candidates in §10 Q4)
- 1-2 paragraphs (`t-body`, `text-fg-1`, `max-w-[var(--copy-max)]`) explaining the diagnostic-first methodology, with one selective accent (one orange word per §11.8). Example accent: "We treat AI as a *force multiplier on a working system*, not a substitute for one."
- No imagery in this section — typographic discipline only.

### 4.3 Service buckets (3-5 buckets, see §10 Q3 for count + naming lock)

- Eyebrow: `<Eyebrow tone="gold">Engagements</Eyebrow>`
- H2 (`t-h2`): "How we work with founder-led businesses." (or proposed alternative)
- Grid (`grid gap-6 sm:grid-cols-2 lg:grid-cols-3`) of bucket cards. Each bucket card:
  - Inline marketing-grade card pattern (NOT consuming `src/components/ui/Card.tsx` — that primitive is admin-styled, see §5.1 below)
  - Border + `bg-bg-2` per §11.2
  - `rounded-2xl` per §9
  - Inside the card:
    - Optional small `<Eyebrow tone="blue">CATEGORY</Eyebrow>` (e.g., "DIAGNOSTIC" / "BUILDOUT" / "AUTHORITY")
    - `t-h3` heading with the bucket name
    - 2-3 sentence description (`t-body`, `text-fg-2`)
    - Optional metadata row at card bottom: typical engagement length, cadence, fit ("90 days · 1-2 sprints · founder + ops lead")
    - Optional inline link `<Link>...</Link>` (text-only, no orange) → relevant section of `/applied-intelligence` if the bucket maps cleanly
- **No prices on cards in v1.** Pricing-as-design-element is ecommerce-coded; engagement pricing is conversation-driven (see §10 Q3 for "retain Whop products?" decision).

### 4.4 How we work (process / methodology callout)

- Eyebrow: `<Eyebrow tone="gold">Process</Eyebrow>`
- H2 (`t-h2`): "Diagnostic first. Automation second. Measurement always." (or proposed alternative)
- A disciplined ordered list (`<ol>` with `space-y-md`) of 3-5 phases. Each phase:
  - Number + phase name (`t-h4`)
  - 1-2 sentence description (`t-body`)
- No decorative icons. No timeline graphic. The list IS the diagram.
- Trailing inline text link → `/applied-intelligence` (text-only, e.g., "Read the full Applied Intelligence framework →")

### 4.5 Proof / signal section

- Eyebrow: `<Eyebrow tone="gold">Signal</Eyebrow>`
- H2 (`t-h2`): "What working with us looks like in practice." (or proposed alternative)
- 2-3 short metric / signal callouts in a row. Each:
  - Large metric (`t-h2` or `t-h3` with `text-aj-orange` or `text-aj-gold`)
  - 1-line caption (`t-small`, `text-fg-2`) explaining the metric
- Followed by: 2-3 inline "Recent insight" links → `/insights` (text-only links to specific articles or category)
- No carousel. No customer-logo-cloud. (Audio Jones doesn't do testimonial-soup styling.)

### 4.6 Conversion footer CTA section

- Eyebrow: `<Eyebrow tone="gold">Ready to engage</Eyebrow>`
- H2 (`t-h2`): "Start with a diagnostic. Most engagements begin there." (or proposed alternative)
- Centered single primary CTA: `<ButtonLink variant="glow" href={ctaLinks.signalDiagnostic}>Take the Signal Diagnostic</ButtonLink>`
- Optional inline secondary text link below: `<Link href="/apply">Or apply for an engagement directly</Link>`
- Section padding: `py-16 sm:py-24`
- Section background: `bg-bg-1` for visual separation from the page's primary `bg-bg-0`

---

## §5 Component-level direction

### 5.1 ⚠️ Do NOT use existing `Card.tsx` and `Badge.tsx` from `src/components/ui/`

**Critical drift discovered during this spec authoring:**

`src/components/ui/Card.tsx` and `src/components/ui/Badge.tsx` use raw Tailwind grays (`bg-gray-900`, `border-gray-700`, `text-gray-400`, `bg-blue-900`, `text-blue-100`) and are **not DESIGN.md-compliant**. The file comments in both confirm: `// Simple card components for admin dashboard`. They were built for the admin portal, not the marketing site.

For the services rebrand:

- ✅ Build the bucket card pattern **inline** in the services page (or extract to `src/components/services/ServiceBucketCard.tsx` if reused elsewhere). Use design tokens directly (`bg-bg-2`, `border-[var(--line-2)]`, `text-fg-{0,1,2}`, `rounded-2xl`, `p-6 sm:p-10`).
- ✅ Use `<Eyebrow>` from `src/components/ui/Eyebrow.tsx` — that primitive IS DESIGN.md-compliant.
- ✅ Use `<Button>` / `<ButtonLink>` from `src/components/ui/Button.tsx` — DESIGN.md-compliant, and §11.1 already covers the CTA variant guidance.
- ❌ Do not import `Card` / `Badge` from `src/components/ui/`. (Resolution: those primitives need their own admin-vs-marketing split in a future PR — out of scope here.)

This drift was not caught during the original DESIGN.md audit and is surfaced here for visibility. **Codex must build the bucket card pattern inline rather than rely on the admin primitive.**

### 5.2 Typography utilities

All headings + body text consume `t-*` utility classes from `globals.css` (lines ~325-410):

| Role | Class | Where |
|---|---|---|
| Page H1 | `t-h1` | Hero h1 |
| Section H2 | `t-h2` | Each section's heading |
| Card title | `t-h3` | Bucket card titles, callout headings |
| Sub-heading | `t-h4` | Process step names, metric labels |
| Hero subcopy | `t-lead` | Hero subhead |
| Long body | `t-body-lg` | Strategic positioning paragraphs |
| Default body | `t-body` | Card descriptions, process step descriptions |
| Small caption | `t-small` | Metric captions, trailing small-print, helper text |
| Eyebrow | (handled by `<Eyebrow>` component — `t-label` underneath) | All section eyebrows |

**Hard rule: zero raw `text-{N}xl`, `font-extrabold`, `font-bold` patterns. All typography flows through `t-*` utility classes.**

### 5.3 Button + CTA discipline

- Primary CTAs (one per major section, signal-orange): `<ButtonLink variant="glow">` — uses `.btn-glow` class from `globals.css`.
- Secondary CTAs (transparent + border): `<ButtonLink variant="secondary">` — uses Tailwind variant from `Button.tsx`.
- Tertiary inline links (text-only, no styling): `<Link>` from `next/link` with `t-small` or `t-body` and `text-aj-orange` or `text-fg-1`.
- All CTAs `rounded-md` (handled by the variants) — never `rounded-full` on standard CTAs.
- iOS 44px minimum: handled by `size="md"` (default) and `size="lg"`.
- **No `e.preventDefault(); e.stopPropagation();` ceremony required** on the services page — these CTAs are simple navigations, not multi-step lead-capture critical paths. The §17.5 native-control discipline applies to the ROI Calculator and similar conversion forms, NOT to marketing CTAs.

### 5.4 Color discipline

- **Page background:** `bg-bg-0` on `<main>`. Section backgrounds may alternate `bg-bg-0` / `bg-bg-1` for rhythm.
- **Card surface:** `bg-bg-2` on bucket cards. Hover surface `bg-bg-3` or `bg-bg-4` if a hover state is added (it does not need to be).
- **Borders:** `border-[var(--line-2)]` default, `border-[var(--line-3)]` for emphasized hierarchy.
- **Text:** `text-fg-0` for headings, `text-fg-1` for body, `text-fg-2` for muted, `text-fg-3` for trailing small-print.
- **Selective accents:** at most 1-2 orange words per section (DESIGN.md §11.8). Use `text-aj-orange` or `text-aj-orange-soft`.
- **Eyebrows + metrics:** `text-aj-gold` (default `<Eyebrow>` tone) for editorial markers; `text-aj-blue-bright` for system/framework callouts.
- **Zero raw hex.** Every color references a token role.

### 5.5 Spacing + responsive discipline

- Page gutter: `px-5 sm:px-8`
- Page max-width: `max-w-[var(--page-max)]` (= 1280px)
- Section padding rhythm: hero `py-24 sm:py-32`, content sections `py-16 sm:py-24`, compact callouts `py-12`
- Card padding: `p-6 sm:p-10` for analytical cards (bucket cards), `p-5` for compact value strips
- Mobile-first: baseline ≤640px, `sm:` `md:` `lg:` add desktop refinements
- iPhone-13 viewport (390px wide) must render without horizontal overflow — test mandatory before declaring done

---

## §6 Whop product integration

### Current state

`src/app/services/page.tsx:18-31` calls `/api/whop/products` via `fetch()` with `cache: "no-store"` and `next: { revalidate: 0 }`. Returns `[]` silently on failure. Renders a blank product grid if no products are returned.

### Target state — three sub-decisions, locked here

#### 6.1 Caching: ISR with `revalidate: 3600`

```ts
async function getProducts(): Promise<WhopProduct[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${baseUrl}/api/whop/products`, {
    next: { revalidate: 3600 }, // 1 hour ISR
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data?.data) ? data.data : [];
}
```

- 1-hour revalidation matches the typical product-update cadence at AJ.
- Zero `cache: "no-store"`, zero `revalidate: 0`.

#### 6.2 Typed response

Define a typed interface near the fetch:

```ts
type WhopPrice = { id?: string; amount?: number; currency?: string; interval?: "month" | "year" | "one_time" };
type WhopProduct = { id: string; name?: string; description?: string; url?: string; prices?: WhopPrice[] };
```

(The current `page.tsx` already declares these types — preserve, refine if needed.)

If `/api/whop/products` returns malformed data, the fetch helper coerces to `[]` and the page falls back to §6.3 below.

#### 6.3 Fallback strategy

Three states the page must render gracefully:

1. **Whop API healthy + products available** → render the bucket grid normally.
2. **Whop API healthy + zero products configured** → render a single "Currently configuring offerings — apply for an engagement to discuss your fit" callout (single-card width, centered). Replaces the current bare "Offers will appear here once Whop products are available." paragraph.
3. **Whop API down / fetch fails / non-2xx** → identical fallback to state 2. Never break the page; never expose error text to the user.

The fallback callout includes:

- `<Eyebrow tone="gold">Currently configuring</Eyebrow>`
- `t-h3` headline ("Engagements are configured per founder.")
- `t-body` paragraph (1-2 sentences explaining that engagement scoping happens on a call)
- `<ButtonLink variant="secondary" href="/apply">Apply for Engagement</ButtonLink>` (no orange CTA on a fallback — fallback is informational, not high-signal)

### 6.4 Open question — see §10 Q3

Whether to retain Whop products on the page at all (vs. retire them and replace with the static service-bucket descriptions from §3) is **not yet locked**. This spec assumes hybrid: static buckets section + optional Whop product grid below it (gated by §6.3 fallback states). User to lock in §10 Q3.

---

## §7 Acceptance criteria

Codex implementation is "done" when ALL of the following measurable conditions hold:

### 7.1 Token + typography compliance

- [ ] **Zero raw hex** (`bg-[#xxxxxx]`, `text-[#xxxxxx]`, `border-[#xxxxxx]`, etc.) anywhere in `src/app/services/page.tsx` and any new components. Verified via `grep -E "(bg|text|border|from|to|via)-\[#" src/app/services/ src/components/services/` (if a `services/` component dir is added) returning zero matches.
- [ ] **Zero raw Tailwind grays** (`bg-gray-{n}`, `text-gray-{n}`, etc.) — verified via `grep -E "(bg|text|border)-gray-" src/app/services/` returning zero matches.
- [ ] **Zero `text-Xxl font-extrabold`** patterns — all typography via `t-*` utility classes. Verified via `grep -E "text-[1-9]xl|font-extrabold|font-bold[^-]" src/app/services/` returning zero matches.
- [ ] All headings use exactly one `t-h{1-4}` utility class.

### 7.2 Anti-pattern elimination

- [ ] **Zero `bg-gradient-*` on CTAs.** Verified via `grep "bg-gradient" src/app/services/` returning zero matches on CTA elements (a non-CTA decorative element would still need justification).
- [ ] **Zero `bg-clip-text` gradient text.** Verified via `grep "bg-clip-text" src/app/services/` returning zero matches.
- [ ] **Zero `rounded-full` on standard CTAs.** Verified via inspection — `rounded-full` allowed only on pills/badges (none required in v1) or progress bars (none required in v1).
- [ ] **Zero ecommerce framing** in copy. The strings "Services & Offers", "Find the Right Offer", "Select", and equivalent retail-coded language are absent. Verified via review against §3.

### 7.3 Component compliance

- [ ] All CTAs use `<Button>` or `<ButtonLink>` from `src/components/ui/Button.tsx` (variants `glow` for primary signal, `secondary` for secondary).
- [ ] All eyebrows use `<Eyebrow>` from `src/components/ui/Eyebrow.tsx`.
- [ ] **Zero imports of `Card` or `Badge` from `src/components/ui/`** (admin-styled, see §5.1). Bucket cards built inline or in a new `src/components/services/` subdirectory using DESIGN.md-compliant tokens.
- [ ] All CTAs satisfy iOS 44pt touch-target via `size="md"` or `size="lg"` (default).

### 7.4 Whop integration

- [ ] `getProducts()` uses `revalidate: 3600`, never `no-store` or `revalidate: 0`.
- [ ] Typed `WhopProduct` / `WhopPrice` shapes preserved or refined — no `any`.
- [ ] All three states (healthy+products, healthy+empty, API-down) render without breaking the page.
- [ ] No raw error messages exposed to the user in the API-down state.

### 7.5 Page-level checks

- [ ] DESIGN.md §17.5 services-page drift item is marked **resolved** in this PR's body (with evidence: this spec PR + the implementation PR cross-referenced).
- [ ] `pnpm typecheck` clean.
- [ ] `pnpm exec eslint src/app/services` clean (only the unrelated baseline-browser-mapping notice acceptable).
- [ ] `pnpm build` clean.
- [ ] iPhone-13 viewport (390px) renders without horizontal overflow (DESIGN.md §13).
- [ ] **Real iPhone Safari production-mode QA performed and documented in the implementation PR body** (per DESIGN.md §11 + design-principles §12). Tunnel screenshot, scroll-through, both healthy and API-down states verified.
- [ ] Lighthouse score (mobile, performance) on production preview ≥ 85. (Not strict — directional check that the rebrand doesn't regress core web vitals.)

### 7.6 SEO / metadata

- [ ] Page metadata via `buildMetadata({ title, description, path })` from `src/lib/seo/metadata.ts` (existing pattern). Title: `"X"` not `"X | Audio Jones"` (DESIGN.md §17.5 title-template-doubling note). Description: 1-sentence operator framing aligned with §3 subhead.
- [ ] No 301/302 redirects added — route stays `/services`.

---

## §8 Implementation phases

Two paths offered. **User locks Phase strategy in §10 Q5.**

### Path A — Single PR (recommended for v1 if scope holds)

- One Codex PR: copy + IA + token migration + component swaps + Whop hardening + real-device QA, all together.
- Estimated 2-4 days of implementation + QA.
- Single review surface, single deploy, single regression-risk moment.
- Recommended when: the rebrand is straightforward, the Whop fallback is well-defined, no surprise IA discoveries during implementation.

### Path B — Phased PRs

| Phase | Scope | Estimated effort | Sequencing |
|---|---|---|---|
| 1 | Copy + IA + token migration: replace raw hex, replace inline typography with `t-*`, replace ecommerce framing with operator framing per §3, no new components | ~1-2 days | Sequential, lands first |
| 2 | Component-level swaps + inline bucket card pattern + dual-CTA hero + Process/Proof sections | ~1 day | Sequential, after Phase 1 |
| 3 | Whop integration hardening: ISR + typing + fallback states | ~1 day | **Can run in parallel with Phase 2** if a different Codex task picks it up |
| 4 | Real-device QA + polish (iPhone Safari, iPhone-13 viewport, all 3 Whop states) | ~0.5 days | Sequential, gate before merge |

Path B is recommended when: scope is uncertain, parallel Codex tasks are available, the user wants smaller review surfaces, or any phase surfaces blocking IA questions.

---

## §9 Risks

### 9.1 Whop product list shape drift

The current `WhopProduct` / `WhopPrice` types are loosely defined (most fields optional). If the Whop API response shape has evolved since the types were authored, strict typing in Phase 3 may surface runtime mismatches. **Mitigation:** test against the live Whop API output during Phase 3; widen types if the API's actual shape diverges; never use `any`.

### 9.2 SEO impact from H1 + meta change

`/services` is a live indexed route. Changing the H1 + meta description will cause a Google re-crawl and possible temporary ranking fluctuation. **Mitigation:** the new title (§3 candidates A/B/C) is more keyword-aligned with operator/founder/applied-intelligence search intent, so the long-term effect is expected positive. No 301 redirects needed (route unchanged).

### 9.3 Visual regression across viewports

The full visual change touches every section of `/services`. **Mitigation:** mandatory real-iPhone Safari QA per DESIGN.md §11 + design-principles §12 + the lessons from PR #47. Production-mode-locally testing (`pnpm build && pnpm start` + cloudflared tunnel) before merge gate. Reproduce all three Whop states (healthy+products, empty, API-down).

### 9.4 Card primitive admin-vs-marketing split surfaces during implementation

The drift surfaced in §5.1 (existing `Card.tsx` + `Badge.tsx` are admin-styled) means Codex must build the bucket card inline rather than reach for a primitive. **Mitigation:** explicit instruction in this spec; Codex builds inline (or in `src/components/services/`); the broader admin-vs-marketing primitive split is queued as a separate follow-up PR.

### 9.5 Whop API outage during deploy

If the Whop API is unreachable at the moment Vercel builds the page, ISR's first build will still cache the empty state for 1 hour. **Mitigation:** §6.3 fallback renders gracefully even from an empty cached state; first user to hit the page after the next revalidation triggers a fresh fetch; no broken state is ever served.

### 9.6 Internal-link drift during copy migration

The `/applied-intelligence`, `/insights`, `/apply`, `/roi-calculator` internal links must continue to resolve correctly. **Mitigation:** Codex implementation PR includes a smoke-check that all internal hrefs resolve to existing routes (no 404s in the rendered HTML).

---

## §10 Open questions for user lock

> ✅ **All 7 open questions resolved at senior-recommendation defaults on 2026-05-08. Codex Phase 1 (copy + IA + token migration) is unblocked once PR #57 merges.**

The following decisions must be locked **before Codex begins implementation**. This spec PR is the lock surface.

### Q1 — Page title (pick one)

- [ ] **A: "Applied Intelligence Services"** — clinical, mirrors the existing framework page
- [ ] **B: "Operating Systems for Founder-Led Businesses"** — most descriptive, longest
- [ ] **C: "How We Work With Founders"** — warm, engagement-framed

> **Decided (2026-05-08): Option A — "Applied Intelligence Services"**. Matches the site brand thesis, leverages the existing `/applied-intelligence` route, and aligns with the established framework section vocabulary.

### Q2 — Hero subhead (pick one)

- [ ] **a:** "We don't sell tools. We build the operating systems founder-led businesses run on — diagnosed first, automated second, measured continuously."
- [ ] **b:** "Engagements anchored in signal — diagnostic first, applied intelligence buildout second, measurement and durability third. No retainers, no template solutions, no AI theater."

> **Decided (2026-05-08): Option a — tools-vs-systems framing.** Anchors operator language ("We don't sell tools, we build systems") and aligns directly with the brand thesis. Carries the Q1 "Applied Intelligence Services" headline cleanly into the subhead.

### Q3 — Service buckets (pick approach + count)

- [ ] **Approach 1:** Static buckets only (retire Whop product list display from `/services`; keep Whop API integration for backend / portal / internal use). Static buckets sourced from the audit's recommended IA: AI Business Systems Diagnostic, Applied Intelligence Systems Buildout, AI Agent Workflow Design, Content + Authority Systems, Attribution + Signal Audit. **Pick count: 3 / 4 / 5.**
- [ ] **Approach 2:** Hybrid — static bucket framing section + Whop product grid below (with §6.3 fallback). User-decided ordering: static-first / Whop-first.
- [ ] **Approach 3:** Whop products only (retain current Whop-driven bucket grid; reframe per §3 copy direction; no static buckets layer).

> **Decided (2026-05-08): Approach 2 — Hybrid (static-first), 4 buckets.** Static bucket section renders above the Whop product grid; if the Whop API is down, the page still works with the 4 strategic buckets visible. The 4 locked buckets are:
>
> 1. **AI Business Systems Diagnostic** (entry point)
> 2. **Applied Intelligence Systems Buildout** (the core engagement)
> 3. **AI Agent Workflow Design** (modular tactical work)
> 4. **Attribution + Signal Audit** (measurement layer)
>
> "Content + Authority Systems" from the original audit list is intentionally **not** included in v1 (deferred to a later expansion). Whop products render as supplementary/optional below the 4 strategic buckets per §6.3 fallback rules.

### Q4 — Section copy (lock 1-2 headlines per section before Codex implements)

For each non-hero section, the user locks the H2 from a 2-candidate proposal. Surfacing here for batch decision:

- [ ] **Strategic positioning H2** (§4.2):
  - **a:** "We don't sell AI. We diagnose your operating system, then install what's missing."
  - **b:** "Diagnostic first. Buildout second. Theater never."
- [ ] **Service buckets H2** (§4.3):
  - **a:** "How we work with founder-led businesses."
  - **b:** "Engagements designed for operators."
- [ ] **Process H2** (§4.4):
  - **a:** "Diagnostic first. Automation second. Measurement always."
  - **b:** "The method behind every engagement."
- [ ] **Proof H2** (§4.5):
  - **a:** "What working with us looks like in practice."
  - **b:** "Signal we've shipped recently."
- [ ] **Footer CTA H2** (§4.6):
  - **a:** "Start with a diagnostic. Most engagements begin there."
  - **b:** "If you're ready, the diagnostic is the front door."

> **Decided (2026-05-08): Defer per-section H2 copy to Codex** within the locked Q1/Q2/Q3 framing. Codex picks reasonable H2s consistent with "Applied Intelligence Services" + tools-vs-systems framing + the 4 locked buckets; reviewer can refine specific lines in Phase 1's PR. This keeps spec review lighter and lets Codex make tactical wording calls inside the locked strategy.

### Q5 — Implementation strategy

- [ ] **Path A: Single PR** (recommended if scope is well-defined)
- [ ] **Path B: Phased PRs** (4 sub-PRs per §8) — and if Path B, parallel Phase 2 + 3 or strictly sequential?

> **Decided (2026-05-08): Path B — phased, sequential.** Four small PRs in order:
>
> 1. Phase 1 — copy + IA + token migration
> 2. Phase 2 — component swaps (after Phase 1 lands)
> 3. Phase 3 — Whop integration hardening (after Phase 2 lands)
> 4. Phase 4 — real-device QA + polish (gate before Phase 3 merges)
>
> Easier review surface per PR, easier to ship safely, each phase is one small reviewable PR. **Strictly sequential** — no parallel Phase 2 + 3 work in this dispatch.

### Q6 — Real-device QA gate

- [ ] **Mandatory pre-merge** — Codex implementation PR is held until iPhone Safari production-mode QA passes (recommended, matches PR #52 ROI Calculator pattern)
- [ ] **Post-merge canary** — implementation PR can merge after Phase 3A passes; iPhone QA happens against production with hotfix-on-failure (faster but risks user-visible regression)

> **Decided (2026-05-08): Mandatory pre-merge.** PR #47's ROI Calculator hydration regression was the source-of-truth lesson — native iPhone Safari is the only authoritative validation for production-mode hydration + interaction. Each phase's PR (especially Phase 1's copy/IA changes and Phase 4's polish) is held until iPhone Safari production-mode QA documents the rendered result. No post-merge canary path.

### Q7 — Imagery / iconography (default: none, surface to confirm)

- [ ] **Default — no imagery / icons.** Typographic discipline per §11.8. (Recommended for v1.)
- [ ] Add inline minimal icons (e.g., a single-stroke icon per service bucket). Requires icon system decision; out of scope for v1 unless user explicitly opts in.

> **Decided (2026-05-08): Default — no imagery / icons.** DESIGN.md is restraint-first ("Decoration is a tax on attention" — design-principles §1). Icons can come in v2 if the page reads as too sparse after Phase 4 QA, but the v1 build relies on typographic discipline and structural spacing alone.

---

## §11 Hard rules carried forward

These rules apply throughout implementation. Violations require user re-approval.

- **No nav restructure.** PR #50 owns `src/config/nav.ts` + Header/Footer single-source. Do not touch.
- **No CTA destination changes to `signalDiagnostic`.** PR #51 unified the constant; PR #53 set its value to `/applied-intelligence/diagnostic`. Both must continue to flow through `ctaLinks` in `src/config/links.ts`. No hardcoded URLs to either `/applied-intelligence/diagnostic` or `https://diagnostic.audiojones.com`.
- **No new routes.** `/services` stays at `/services`.
- **No app code changes in THIS spec PR.** Spec only.
- **No new dependencies.** No `package.json` changes, no `pnpm-lock.yaml` changes.
- **No env / secret / workflow / deploy changes.** No `.env*`, no `.github/workflows/*`, no Vercel CLI invocation.
- **No PR #47 / #43 modifications.** PR #47 is a paused reference branch; PR #43 is unrelated history.
- **No DESIGN.md edits in implementation PRs.** If implementation surfaces a DESIGN.md gap (e.g., a new utility token needed), Codex raises the conflict in the implementation PR body — does not silently amend DESIGN.md.
- **No Codex implementation start until §10 questions are locked.** This spec PR is the gate.

---

## §12 Cross-references

- `docs/design/DESIGN.md` — the parent design system; especially §5 (tokens), §6 (color roles), §7 (typography), §9 (radius), §11 (component rules), §16 (anti-patterns), §17.5 (drift risks).
- `docs/design/design-principles.md` — decision framework when this spec is ambiguous.
- `docs/codex/roi-calculator-v1-brief.md` — format reference for spec-to-Codex handoff (NOT a content reference).
- `docs/codex/roi-calculator-v1-brief.md §17.1` — canonical-CTA policy (locked: `/applied-intelligence/diagnostic` is canonical via `ctaLinks.signalDiagnostic` in v1).
- PR #50 (`077b2a5`) — nav.ts single-source consolidation. Do not regress.
- PR #51 (`cc74a12`) — CTA unification through `ctaLinks`. Do not regress.
- PR #52 (`e30e2c2`) — ROI Calculator v1 (the Primary CTA destination from this spec).
- PR #53 (`f6f9092`) — `signalDiagnostic` value flip to internal route.
- PR #55 (open draft, current session) — brief amendment + email error logging.

---

## §13 Hand-off checklist (for Codex once §10 is locked)

When Codex picks up this spec:

- [ ] Confirm read of DESIGN.md (§5/§6/§7/§9/§11/§16) + design-principles.md.
- [ ] Confirm read of this spec, including §10 user-locked decisions.
- [ ] Confirm branch off latest `main` (post PR #55 merge if applicable).
- [ ] Open implementation PR as **draft** until real-device QA gate passes (per §10 Q6).
- [ ] Implementation PR body cross-references this spec PR + the locked §10 answers.
- [ ] Implementation PR body explicitly resolves DESIGN.md §17.5 services-page drift item.
- [ ] Implementation PR body documents real-iPhone Safari production-mode QA results (tunnel screenshot, scroll-through, all 3 Whop fallback states).
- [ ] Mark ready + admin merge after user approves QA evidence.

---

**Status: draft. User reviews + locks §10. Then Codex dispatch.**
