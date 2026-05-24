# DESIGN.md — AudioJones.com design system

**Status:** canonical · single source of truth
**Brand version:** 2.0 (May 2026) — "All Signal. No Noise."
**Supersedes:** every other DESIGN/design file in this repo. There is
no other source of truth. If you find one, delete it or fold its
content here.

This document, `src/app/globals.css`, and `src/lib/applied-intelligence/tokens.ts`
are kept in lockstep by `pnpm check:design-tokens`. Drift between them
is treated as a build failure, not a style debate.

Implemented in this repo as:

- `src/app/globals.css` — CSS variables + `@theme inline` Tailwind v4
  bridge + semantic typography classes (`.t-display-xl`, `.t-h1`, …,
  `.t-label`).
- `src/lib/applied-intelligence/tokens.ts` — TypeScript token mirror
  (consumed by JSON-LD / OG / email contexts).
- `src/components/ui/` — canonical primitives (Button, Eyebrow, Card,
  Badge, Input, Select, Textarea, Checkbox, FormField).
- `public/assets/logos/` and `public/assets/trusted-by/` — brand assets.

Fonts are loaded from Google Fonts (Syne · DM Sans · DM Mono) via
`@import` in `globals.css`. The legacy self-hosted TTFs in
`public/fonts/` (Inter · Sora · Space Grotesk) remain as fallbacks at
the tail of the font stack and are kept until call sites stop
referencing them.

---

## 1. Design intent

AudioJones.com is a premium personal-brand and AI-systems company site.
It should feel like a **systems platform**, not a consultant portfolio.

The design language is:

```
Apple × Linear × Palantir × Stripe
Premium · minimal · intelligent · dark-first · cinematic · gridded
Editorial Intelligence Systems
```

Avoid:

- Generic AI-agency templates
- AI purple gradients
- Crypto/Web3 neon chaos
- Playful startup UI
- Confetti / gamification / particle effects
- Glassmorphism without purpose (sticky header is the one exception)
- Pixelated/game-like controls in production surfaces
- Over-rounded consumer SaaS UI
- Ecommerce urgency / discount-sale styling
- Decorative effects that don't clarify hierarchy

---

## 2. Brand position

**Audio Jones (AJ Digital LLC)** — Applied Intelligence Systems Partner
for founder-led businesses ($250K–$5M revenue range).

### Tagline

> All Signal. No Noise.

### Category direction

> AI agent systems for founder-led businesses.

### Narrative

Audio Jones builds AI-powered business systems that recover missed
revenue, automate follow-up, diagnose operational gaps, and turn founder
expertise into scalable infrastructure.

### Product language — use

- Agent Systems
- Revenue Recovery Infrastructure
- Applied Intelligence Systems
- AI Readiness Diagnostic
- Business Signal Clarity
- Operating System for Founder-Led Growth
- Control Plane / Intelligence Layer

### Product language — avoid

- Chatbot, "bot package"
- AI gimmick / automation hack
- Prompt engineering service
- Generic AI consultant
- Marketing buzzwords ("unlock", "supercharge", "harness", "revolutionize")

---

## 3. Design principles

When the spec is ambiguous, return here.

1. **Signal over noise.** Every pixel earns its place. If a visual
   element doesn't carry a signal — strategic action, hierarchy,
   semantic state, editorial weight — it's noise.
2. **Hierarchy through type, border, spacing, contrast, and rhythm.**
   Not gradients. Not glows. Not shadows. Not bouncing animations.
3. **Color is semantic, not decorative.** Signal yellow means *strategic
   activation / operator action*. Blue means *system / data*. Red means
   *critical*. Use them deliberately and sparingly — saturation kills
   meaning.
4. **Anchored, not floating.** Cards have borders and structural mass.
   Avoid glassmorphism for content surfaces; reserve it for chrome.
5. **Motion implies progression and intelligence unfolding.** Snappy
   ease-out. No bounce. No particles. Nothing over `--dur-slow`
   (320ms).
6. **Editorial authority + systems precision + cinematic tension.**
   The surface should read like a well-designed broadsheet, not a SaaS
   landing page.
7. **Restraint over trendiness.** Asymmetry over templates.
   Operational clarity over visual novelty.
8. **Mobile-first conversion discipline.** Every conversion-critical
   surface is authored mobile-first. iOS 44px touch target. Real-device
   Safari proof required — Playwright passes are not sufficient.

---

## 4. Site architecture

Authoritative source for routes and nav:
[`MARKETING-IA.md`](./archive/MARKETING-IA.md) and `src/config/nav.ts`.

> ⚠️ `Header.tsx` currently hardcodes the nav array. `src/config/nav.ts`
> exports `mainNav` but is not yet consumed by the rendered header.
> Until that's consolidated, add new nav items in `Header.tsx`.

### Primary nav

```
Home · Agents · Services · Case Studies · Insights · ROI Calculator · Workshops
```

### Right-side CTAs

```
AI Readiness Diagnostic · Book a Call
```

### Surface tiers

- **Applied Intelligence surface** (canonical): homepage, `/agents`,
  `/applied-intelligence`, `/ai-readiness-diagnostic`, `/services`,
  `/insights`, `/roi-calculator`, `/workshops`, `/case-studies`,
  `/book-a-call`. New work targets this surface.
- **Legacy marketing surface**: `/blog`, older `/services` variants,
  `/portal/*`. Still live but de-listed; do not deepen.

---

## 5. Color tokens

Authoritative table. Values here must match `:root` in
`globals.css` and `aiColors` in `tokens.ts`.

### 5.1 V2 canonical palette

| Token              | Value      | Role                                                                                  |
| ------------------ | ---------- | ------------------------------------------------------------------------------------- |
| `--signal-yellow`  | `#E8FF5A`  | Primary accent — the brand. Strategic activation / operator action. One per section.  |
| `--signal-soft`    | `#F0FF85`  | Hover / lighter signal variant.                                                       |
| `--bg-base`        | `#080808`  | Page background.                                                                      |
| `--surface-1`      | `#0F0F0F`  | Card / standard surface.                                                              |
| `--surface-2`      | `#161616`  | Secondary card / elevated surface / table head.                                       |
| `--border-strong`  | `#2A2A2A`  | Emphasized hierarchy / active borders / dividers.                                     |
| `--border-subtle`  | `#1E1E1E`  | Default structural borders.                                                           |
| `--text-primary`   | `#E8E8E8`  | Body copy.                                                                            |
| `--text-muted`     | `#666666`  | Labels, secondary copy.                                                               |
| `--accent-blue`    | `#4DACFF`  | Data · links · system layer · focus ring.                                             |
| `--accent-red`     | `#FF4545`  | Critical · P0 · destructive actions only.                                             |
| `--accent-amber`   | `#FFB340`  | Warning · P1 · caution / partial readiness.                                           |
| `--accent-green`   | `#3DFFB0`  | Positive · wins · operational success.                                                |

### 5.2 Surfaces — light split (opt-in clarity layer)

Wrap a section in `<section class="surface-light">` (or
`<div data-surface="light">`) to flip just that subtree to the light
clarity layer. Default remains dark. There is no
`prefers-color-scheme` switching — light is a deliberate composition
tool, reserved for system diagrams, comparison panels, and results
pages.

| Token            | Value                   | Role                              |
| ---------------- | ----------------------- | --------------------------------- |
| `--paper`        | `#F8FAFC`               | Light clarity-layer base.         |
| `--surface`      | `#F5F5F5`               | Light section subtle.             |
| `--surface-soft` | `#EEF2F6`               | Light card.                       |
| `--ink`          | `#111111`               | Headlines / body on light.        |
| `--ink-muted`    | `#4B5563`               | Muted on light.                   |
| `--border-light` | `rgba(17,17,17,0.10)`   | Card hairline on light.           |

### 5.3 Text — dark

| Token   | Value      | Role                                  |
| ------- | ---------- | ------------------------------------- |
| `--fg-0`| `#FFFFFF`  | Highest-clarity foreground.           |
| `--fg-1`| `#E8E8E8`  | Body default (= `--text-primary`).    |
| `--fg-2`| `#9A9A9A`  | Secondary copy, descriptions.         |
| `--fg-3`| `#666666`  | Muted metadata (= `--text-muted`).    |

### 5.4 Legacy aliases (kept, retargeted)

V1 used `--aj-orange` (#FF4500), `--aj-blue-bright` (#3B5BFF), and
`--aj-gold` (#C8A96A) as the primary accents. V2 collapses all three
emphasis roles onto `--signal-yellow`. To avoid touching ~300 call
sites, the legacy names remain as aliases pointing at V2 values:

```
--aj-orange       → var(--signal-yellow)   /* #E8FF5A */
--aj-orange-soft  → var(--signal-soft)     /* #F0FF85 */
--aj-blue         → var(--accent-blue)     /* #4DACFF */
--aj-blue-bright  → var(--accent-blue)     /* #4DACFF */
--aj-gold         → var(--signal-yellow)   /* #E8FF5A */
```

Do not reintroduce the V1 hex values. Do not rename the aliases until
the call sites are migrated.

### 5.5 Usage rules

- **Dark is non-negotiable.** Light surfaces are opt-in only.
- **Signal yellow is a signal, not a fill.** Use it for the single
  most important moment in a section — primary CTA, key insight,
  active state. Never decorative.
- **One signal-yellow CTA per major section.** Pages can have multiple
  sections, but resist signal on every section.
- **Blue is for data and structure**, not emphasis. Focus rings, links,
  system-layer callouts, framework accents.
- **Red is for critical only.** Never for emphasis or excitement.

---

## 6. Typography

V2 §03: Syne · DM Sans · DM Mono. Loaded via Google Fonts in
`globals.css`; the self-hosted TTFs (Inter · Sora · Space Grotesk)
remain at the tail of the font stack as fallbacks.

| Family       | Token             | Role                                          |
| ------------ | ----------------- | --------------------------------------------- |
| **Syne**     | `--font-headline` | Display / hero / page titles / all headers.   |
| **DM Sans**  | `--font-body`     | UI, body, navigation.                         |
| **DM Mono**  | `--font-mono`     | Labels, data, badges, eyebrows.               |

### 6.1 Semantic typography classes

Defined in `globals.css`. Reach for these before hand-rolling Tailwind
type stacks. They include responsive scaling — do not override.

| Role         | Class            | Font     | Use                                        |
| ------------ | ---------------- | -------- | ------------------------------------------ |
| Display XL   | `.t-display-xl`  | Syne     | Marketing hero only. Rare.                 |
| Display LG   | `.t-display-lg`  | Syne     | Hero h1 on flagship pages.                 |
| H1           | `.t-h1`          | Syne     | Page hero h1 (default).                    |
| H2           | `.t-h2`          | Syne     | Section headings.                          |
| H3           | `.t-h3`          | Syne     | Sub-section headings.                      |
| H4           | `.t-h4`          | Syne     | Card titles, small headings.               |
| Lead         | `.t-lead`        | DM Sans  | Hero subcopy, intro paragraphs.            |
| Body LG      | `.t-body-lg`     | DM Sans  | Long-form readable content.                |
| Body         | `.t-body`        | DM Sans  | Default UI / interface text.               |
| Small        | `.t-small`       | DM Sans  | Captions, helper text, secondary nav.      |
| Label        | `.t-label`       | DM Mono  | Eyebrows, metric labels (uppercase, 0.16em).|
| Mono         | `.t-mono`        | DM Mono  | Code, diagnostics, system overlays.        |

### 6.2 Type scale (desktop)

```
--fs-display-xl: 96px
--fs-display-lg: 72px
--fs-h1:         60px
--fs-h2:         44px
--fs-h3:         32px
--fs-h4:         24px
--fs-lead:       22px
--fs-body-lg:    18px
--fs-body:       16px
--fs-small:      14px
--fs-label:      12px
```

Mobile (≤640px): display-xl→54, display-lg→46, h1→42, h2→34, h3→26,
h4→22, lead→19, body-lg→17. Auto-applied via media query in
`globals.css`.

---

## 7. Spacing, radii, layout, motion

### 7.1 Spacing scale

```
--sp-xs:   4px      --sp-2xl:  48px
--sp-sm:   8px      --sp-3xl:  64px
--sp-md:  16px      --sp-4xl:  96px
--sp-lg:  24px      --sp-5xl: 128px
--sp-xl:  32px
```

Section rhythm: `py-12` (compact), `py-16 sm:py-24` (default),
`py-24 sm:py-32` (hero). Page gutter: `px-5 sm:px-8` mobile/tablet,
`px-8` desktop. Card interior: `p-6 sm:p-10` for analytical panels,
`p-5` for value-strip cards.

### 7.2 Radii

```
--r-sm:    6px    /* inputs, chips */
--r-md:   10px    /* most controls, buttons */
--r-lg:   16px    /* large buttons */
--r-card: 20px    /* standard card */
--r-panel:24px    /* large analytical panel */
--r-pill: 9999px  /* pills, badges */
```

Never `rounded-3xl` or larger except for explicit pill use.
Over-rounding reads consumer SaaS, not operational tooling.

### 7.3 Layout

```
--page-max:       1280px
--copy-max:        720px
--hero-max:        780px
--gutter-desktop:   32px
--gutter-tablet:    24px
--gutter-mobile:    20px
```

12-column grid, asymmetrical-but-structured. Generous vertical
whitespace. Prefer fewer, sharper sections over dense walls of copy.

### 7.4 Motion

```
--ease-out:    cubic-bezier(0.22, 1, 0.36, 1)
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)
--dur-fast:    120ms   /* state changes (hover, focus) */
--dur-base:    180ms   /* default transitions */
--dur-slow:    320ms   /* entrance reveals */
```

**Should:** reveal information progressively, reinforce hierarchy,
respect `prefers-reduced-motion`.
**Must not:** bounce, spring, squash-and-stretch, particles, anything
over 320ms.

### 7.5 Shadows

```
--shadow-glow-blue:   0 10px 40px -10px rgba(77, 172, 255, 0.55)
--shadow-glow-signal: 0 10px 40px -10px rgba(232, 255, 90, 0.55)
--shadow-card:        inset 0 1px 0 rgba(255,255,255,0.04),
                      0 30px 80px -40px rgba(0,0,0,0.6)
```

Default state: no shadow. Borders + spacing carry hierarchy. Floating
card anchor: `shadow-[var(--shadow-card)]`, at most once per section.
Don't stack multiple shadow tokens. Don't use Tailwind defaults
(`shadow-md`, `shadow-lg`) — they don't match the design language.

---

## 8. Components

Canonical primitives live under `src/components/ui/`. Compose pages
from those, not from raw Tailwind. When a new primitive is needed,
add it there and register tokens in all three sync locations
(`globals.css`, `tokens.ts`, this doc).

| File             | Purpose                                                          |
| ---------------- | ---------------------------------------------------------------- |
| `Button.tsx`     | `<Button>` + `<ButtonLink>` — variants `primary`, `secondary`, `ghost`, `glow`, `system-glow`. Sizes `sm`, `md`, `lg`. |
| `Eyebrow.tsx`    | Signal/blue/muted small-caps eyebrow text (DM Mono).             |
| `Card.tsx`       | Standard analytical card wrapper. See also `ui/cards/`.          |
| `Badge.tsx`      | Pill badge with tones.                                           |
| `Input.tsx`      | Native `<input>` wrapper with brand styling + invalid state.     |
| `Select.tsx`     | Native `<select>` wrapper. ⚠️ See §9 lead-capture caveat.        |
| `Textarea.tsx`   | Native `<textarea>` wrapper.                                     |
| `Checkbox.tsx`   | Native `<input type="checkbox">` wrapper.                        |
| `FormField.tsx`  | Label + hint + error wrapper.                                    |

### 8.1 Buttons

Two systems coexist:

- **`.btn-glow` / `.btn-glow-sys`** (in `globals.css`) — primary glow
  CTAs. Signal glow = strategic action. Blue glow = system action.
  Used for the most important CTA on a page or section.
- **`Button.tsx`** — primary / secondary / ghost variants for
  everything else.

One signal-glow CTA per major section. iOS 44px touch target: `md`
and `lg` sizes satisfy this; `sm` is desktop-only.

### 8.2 Cards / panels

Anchor structurally: `border border-[var(--border-subtle)] bg-bg-2 rounded-2xl`.
The border IS the card. Floating glass cards only for chrome (sticky
header) or deliberate composition moments.

### 8.3 Inputs / forms

- `h-11 w-full rounded-md border bg-bg-2 px-4 t-body text-fg-0`.
- Border default `--border-subtle`. Hover `--border-strong`. Focus
  `--accent-blue` + 2px focus-visible ring.
- Error: `border-[color:var(--accent-red)]` + `aria-invalid={true}`.
- Number inputs: include `inputMode="numeric"` (or `"decimal"`) so
  iOS shows the right keyboard.
- Placeholder selects: `<option value="" disabled>{placeholder}</option>`.

---

## 9. Lead-capture critical-path caveat

**Surfaced during PR #47 (ROI Calculator prototype).** On real iPhone
Safari:

- Shared `<Select>` shows the user's selection visually but React
  state stays empty (no `onChange` propagation).
- Shared `<Button>` form submits race past `e.preventDefault()`.
- Playwright Chromium AND Playwright WebKit emulation BOTH pass —
  only real-device Safari surfaces the issue.

**For lead-capture critical paths** (multi-step forms, contact
submits, calculator inputs, anything that drives conversion):

1. Use **native `<select>`** with direct `value`/`onChange` props.
2. Use **native `<button type="button">`** with `onClick` and
   explicit `e.preventDefault(); e.stopPropagation();`.
3. Avoid `<form>` wrappers around multi-step UIs — prefer `<div>` +
   explicit button handlers for multi-step state machines.
4. Test in **production mode locally** (`pnpm build && pnpm start`)
   before declaring fixes work.
5. **Real-device Safari proof is mandatory** for these surfaces.
   Playwright is necessary but not sufficient.

The shared primitives are fine for non-critical UI.

---

## 10. Accessibility

- WCAG AA contrast minimum (4.5:1 body, 3:1 large text).
- Keyboard focus visible: `focus-visible:[box-shadow:0_0_0_2px_var(--accent-blue)]`.
- Semantic headings: one `<h1>` per page, no level skipping.
- `<button>` for actions, `<a>` for destinations.
- `prefers-reduced-motion: reduce` honored — disable transforms,
  keep opacity fades.
- `alt=""` on decorative images, descriptive alt on content.
- Color is never the sole indicator of state. Errors include text,
  not just red border.
- Touch targets: 44×44px minimum.

---

## 11. Voice & copy

- Direct, founder-led, technical.
- Show the system, then the result. Don't open with hype.
- Numbers > adjectives. "Recovered $X" beats "boosts revenue".
- One CTA per section. Lead with the diagnostic or the call.

See [`MARKETING-IA.md`](./archive/MARKETING-IA.md) for the funnel and
module map this voice serves.

---

## 12. Sync rule

A token, color, or font change is not done until it lands in:

1. `src/app/globals.css` (`:root` block — the runtime truth)
2. `src/lib/applied-intelligence/tokens.ts` (`aiColors` export)
3. The color-tokens table in **this document** (§5)

`pnpm check:design-tokens` enforces this. Run it locally before
opening a PR; CI runs it on every push.

---

## 13. Agent instructions

When generating UI for AudioJones.com:

1. **Read this DESIGN.md first** before writing any new section, page,
   or component.
2. **Reuse existing tokens.** Don't introduce raw hex values. If a
   token doesn't exist for the role you need, propose adding it in
   lockstep across §12's three locations — don't just inline a hex.
3. **Reuse `src/components/ui/` primitives** for non-critical paths.
   For lead-capture critical paths see §9.
4. **Preserve the dark-first canvas.** Don't introduce light surfaces
   unless using `.surface-light` opt-in.
5. **Use signal-yellow semantically.** ONE primary CTA per major
   section. Never decorative.
6. **Mobile-first authoring.** Baseline ≤640px. iOS 44px touch
   target.
7. **Match existing motion vocabulary.** Directional fades,
   progressive reveals. No bounce.
8. **No new font dependencies** without explicit justification.
9. **Surface design tradeoffs before coding.** If the spec conflicts
   with this DESIGN.md, raise the conflict — don't silently deviate.
10. **Real-iPhone Safari + production-mode test mandatory** for
    lead-capture / conversion surfaces.

---

## 14. Changelog

| Date       | Brand v | Change                                                      |
| ---------- | ------- | ----------------------------------------------------------- |
| 2026-05-24 | 2.0     | Consolidation: this doc is now the only DESIGN.md. Deleted `AUDIOJONES_DESIGN.md`, `docs/design.md`, `docs/design/DESIGN.md`, `docs/design/design-principles.md`. Color table re-synced to V2 (signal yellow, #080808 base). Type system updated to Syne · DM Sans · DM Mono with `.t-*` semantic classes. Added `pnpm check:design-tokens` guard. |
| 2026-05-06 | 1.0     | Initial DESIGN.md from V1 implementation (Space Grotesk · Inter · Sora, orange #FF4500, bg #05070F). |
