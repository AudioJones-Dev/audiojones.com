---
title: "Audio Jones DESIGN.md"
version: "1.0.0"
status: "draft"
owner: "Audio Jones / AJ Digital"
repo: "AudioJones-Dev/audiojones.com"
design_language: "Editorial Intelligence Systems"
last_updated: "2026-05-06"
---

# Audio Jones DESIGN.md

The canonical design-system + implementation guide for AudioJones.com. Reflects the actual implementation in `src/app/globals.css` and `src/lib/applied-intelligence/tokens.ts` first; target-state recommendations are clearly marked.

## 1. Overview

Audio Jones is the public marketing site and product surface for AJ Digital LLC, an Applied Intelligence Systems partner for founder-led businesses. The site needs to feel **authored, intelligent, weight-bearing, cinematic, intentional, analytical, psychologically sharp** — and convert without theater.

This document is the source of truth for visual, typographic, and component decisions. Future Claude / Codex / human contributors must read this before designing or implementing UI.

The implementation lives in:

- `src/app/globals.css` — canonical CSS variables + Tailwind v4 `@theme inline` bridge
- `src/lib/applied-intelligence/tokens.ts` — TypeScript-side token mirror (must stay in sync with `globals.css`)
- `src/components/ui/` — shared primitives
- `src/components/Header.tsx` / `src/components/Footer.tsx` — chrome
- `src/app/layout.tsx` — typography registration + chrome composition

## 2. Brand Thesis

**Editorial Intelligence Systems.** The shape is **Apple restraint × Linear product polish × Palantir operational seriousness** — applied to a broadsheet-grade editorial canvas. Dark-first. Signal-orange where it matters. Restraint everywhere else.

Core voice: signal over noise. Strategic operators reading the page should feel like the interface itself is doing analytic work — not selling them on AI hype.

## 3. Design Philosophy

1. **Signal over noise.** Every pixel has a reason. Decoration is a tax on attention.
2. **Hierarchy through typography, borders, spacing, contrast, and rhythm** — not gradients, glows, or shadows.
3. **Color is semantic, not decorative.** Orange means *signal emergence* / *strategic activation* / *operator action*. Red means *critical / destructive / urgent*. Use them deliberately.
4. **Objects are anchored, not floating.** Cards have borders + structure. Avoid glassmorphism unless it earns its place.
5. **Motion implies progression and intelligence unfolding.** Directional fades, progressive reveals, snappy ease-out. No bounce. No particles.
6. **Editorial authority + systems precision + cinematic tension.** The surface should read like a well-designed publication, not a SaaS landing page.
7. **Restraint over trendiness.** Precision over decoration. Asymmetry over templates. Operational clarity over visual novelty.

## 4. Token Philosophy

Tokens are **semantic roles**, not raw values. Consumers reference roles (`--signal`, `--bg-2`, `--fs-h1`); the role definition lives in one place (`globals.css`). Renaming a role is a one-line change site-wide.

Three layers:

1. **Raw brand values** — `--aj-orange`, `--aj-blue-bright`, `--aj-gold`. Don't reference these directly in components except inside the token system itself.
2. **Surface / text / line / spacing / type / motion roles** — `--bg-0` through `--bg-4`, `--fg-0` through `--fg-3`, `--line-1` through `--line-3`, `--sp-md` etc. Components reference these.
3. **Semantic aliases** — `--signal`, `--system`, `--metric`, `--success`, `--warning`, `--danger`. Use these for state-bearing UI.

Tailwind v4's `@theme inline` block in `globals.css` maps these CSS vars to Tailwind utilities (`bg-bg-2`, `text-fg-1`, `text-aj-orange`, etc.). New utility tokens go in **both** the `:root` block and the `@theme inline` block, in lockstep with `tokens.ts`.

## 5. Tokens

### 5.1 Color Tokens

```yaml
# Brand (raw — don't reference directly in components)
ajOrange:
  value: "#FF4500"
  role: "Signal emergence / strategic activation. Primary CTA, key insights, active states."
  usage: "Primary CTAs, key insight markers, active states, signal moments."
  avoid: "Decorative gradients, sale/discount messaging, generic SaaS startup styling, repeated decorative use."
ajOrangeSoft:
  value: "#FF6A30"
  role: "Hover/active variation of signal."
ajBlue:
  value: "#0088CC"
  role: "Secondary system intelligence layer."
ajBlueBright:
  value: "#3B5BFF"
  role: "Component-level system blue used for focus rings, system-glow buttons, framework accents."
ajGold:
  value: "#C8A96A"
  role: "Eyebrows, metric labels, editorial markers."

# Surfaces — dark (default)
bg0:
  value: "#05070F"
  role: "Page background — base operational canvas."
bg1:
  value: "#0B0F1A"
  role: "Alternating section background."
bg2:
  value: "#0B1020"
  role: "Card / elevated analytical surface."
bg3:
  value: "#101827"
  role: "Elevated card / table head / structural container."
bg4:
  value: "#1A2234"
  role: "Hover surface."

# Surfaces — light split (opt-in via .surface-light)
paper:
  value: "#F8FAFC"
  role: "Light clarity layer — comparison panels, system diagrams, results pages. Dark stays primary."
surface:
  value: "#F5F5F5"
surfaceSoft:
  value: "#EEF2F6"
ink:
  value: "#111111"
inkMuted:
  value: "#4B5563"

# Text — dark
fg0:
  value: "#FFFFFF"
  role: "Primary high-clarity foreground ink. Headlines, key labels, primary copy."
fg1:
  value: "#E5E7EB"
  role: "Body text default."
fg2:
  value: "#94A3B8"
  role: "Secondary copy, descriptions, helper text."
fg3:
  value: "#64748B"
  role: "Muted metadata, timestamps, low-priority captions."

# Borders (carry hierarchy — see globals.css comments)
line1:
  value: "rgba(255,255,255,0.06)"
  role: "Subtle dividers."
line2:
  value: "rgba(255,255,255,0.10)"
  role: "Default structural borders."
line3:
  value: "rgba(255,255,255,0.18)"
  role: "Emphasized hierarchy / active borders."
lineBlue:
  value: "rgba(59,91,255,0.40)"
lineGold:
  value: "rgba(200,169,106,0.40)"

# Semantic state
signal:
  value: "var(--aj-orange)"
  role: "Strategic activation. Primary CTA, insight emergence, operator action."
  usage: "ONE primary CTA per major section. Insight indicators. Active state on key controls."
  avoid: "Generic excitement, discount/sale aesthetics, decorative gradients, every button on a page."
system:
  value: "var(--aj-blue-bright)"
  role: "Framework / structural / supporting CTA."
metric:
  value: "var(--aj-gold)"
  role: "Eyebrows / metric labels / editorial markers."
success:
  value: "#22C55E"
  role: "Positive operational state, completion."
warning:
  value: "#FACC15"
  role: "Caution, partial readiness."
danger:
  value: "#EF4444"
  role: "Critical errors, destructive actions, urgent failures only."
```

### 5.2 Typography Tokens

```yaml
fontHeadline:
  value: "Space Grotesk"
  role: "Display + section hierarchy."
  notes: "Self-hosted at /public/fonts/SpaceGrotesk-{Regular,Medium,SemiBold,Bold}.ttf — see globals.css @font-face."
fontAccent:
  value: "Sora"
  role: "Editorial accents, occasional display alternative."
  notes: "Self-hosted, weights 400/500/600/700."
fontBody:
  value: "Inter"
  role: "Primary UI / body / navigation."
  notes: "Self-hosted, weights 400/500/600/700 + italic 400."
fontMono:
  value: "ui-monospace, SF Mono, Menlo, Consolas"
  role: "Code, diagnostics, system overlays."
  notes: "System mono — no custom mono shipped (intentional)."
```

Type scale (desktop) — defined as CSS vars (`--fs-display-xl` through `--fs-label`) and exposed as utility classes (`t-display-xl`, `t-h1`, `t-lead`, `t-body`, etc.) in `globals.css` lines ~325–410.

### 5.3 Spacing Tokens

```yaml
spXs: 4px
spSm: 8px
spMd: 16px
spLg: 24px
spXl: 32px
sp2xl: 48px
sp3xl: 64px
sp4xl: 96px
sp5xl: 128px
```

Section padding rhythm: hero `py-16 sm:py-24`, value strip `py-12`, content section `py-16 sm:py-24`. Page max-width `--page-max: 1280px`. Copy column `--copy-max: 720px`.

### 5.4 Border Radius Tokens

```yaml
rSm: 6px       # inputs, chips
rMd: 10px      # most controls
rLg: 16px      # buttons (large)
rCard: 20px    # standard card
rPanel: 24px   # large analytical panel
rPill: 9999px  # pills / badges
```

### 5.5 Border Tokens

See §5.1 — `--line-1`, `--line-2`, `--line-3` for hierarchy. Inputs and buttons typically use `border-[var(--line-2)]` and elevate to `--line-3` on hover/focus.

### 5.6 Elevation / Shadow Tokens

```yaml
shadowGlowBlue:
  value: "0 10px 40px -10px rgba(59,91,255,0.7)"
  usage: "Primary system-blue button rest state."
shadowGlowOrange:
  value: "0 10px 40px -10px rgba(255,69,0,0.5)"
  usage: "Signal CTA hover / active."
shadowCard:
  value: "inset 0 1px 0 rgba(255,255,255,0.04), 0 30px 80px -40px rgba(0,0,0,0.6)"
  usage: "Floating card anchor — DO NOT layer multiple shadow tokens."
```

Prefer borders + spacing over shadows for hierarchy. When using shadows, use exactly one of these tokens.

### 5.7 Motion Tokens

```yaml
easeOut: "cubic-bezier(0.22, 1, 0.36, 1)"
easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)"
durFast: "120ms"   # state changes (hover, focus)
durBase: "180ms"   # default transitions
durSlow: "320ms"   # entrance reveals
```

## 6. Color Roles

| Role | Token | When to use |
|---|---|---|
| Signal emergence | `--signal` (orange) | Single primary CTA per major section. The "Calculate Your AI ROI" / "Take Signal Diagnostic" / strategic action moments. |
| System / framework | `--system` (blue-bright) | Secondary CTA, framework accents, system module callouts, focus rings. |
| Metric / editorial | `--metric` (gold) | Eyebrows, KPI labels, editorial section markers. |
| Success | `--success` | Confirmation, readiness complete, positive validation. |
| Warning | `--warning` | Partial readiness, caution states. |
| Danger | `--danger` | Errors, destructive actions, critical alerts only. |

**Hard rule:** orange is never decorative. If a button is orange, the action it represents must be the most important next step on the page.

## 7. Typography Roles

| Role | CSS class | Font | Use |
|---|---|---|---|
| Display XL | `t-display-xl` | Space Grotesk | Marketing hero only. Rare. |
| Display LG | `t-display-lg` | Space Grotesk | Hero h1 on flagship pages. |
| H1 | `t-h1` | Space Grotesk | Page hero h1 (default). |
| H2 | `t-h2` | Space Grotesk | Section headings. |
| H3 | `t-h3` | Space Grotesk | Sub-section headings. |
| H4 | `t-h4` | Space Grotesk | Card titles, small headings. |
| Lead | `t-lead` | Inter | Hero subcopy, intro paragraphs. |
| Body LG | `t-body-lg` | Inter | Long-form readable content. |
| Body | `t-body` | Inter | Default UI / interface text. |
| Small | `t-small` | Inter | Captions, helper text, secondary nav. |
| Label | `t-label` | Inter (uppercase, tracked) | Eyebrows, metric labels. |

Mono usage: only for code blocks, diagnostic output, and the dev-only debug overlays. Never use mono for marketing copy.

## 8. Spacing System

- **Page gutter:** `px-5 sm:px-8` mobile/tablet, `px-8` desktop. Don't deviate.
- **Section vertical rhythm:** `py-12` (compact), `py-16 sm:py-24` (default), `py-24 sm:py-32` (hero). Pick one and don't blend.
- **Card interior padding:** `p-6 sm:p-10` for analytical panels, `p-5` for value-strip cards.
- **Stack spacing:** prefer `space-y-{n}` or `mt-{n}` increments matching `--sp-*` tokens.

## 9. Border Radius Rules

- Inputs / chips / small buttons: `rounded-md` (10px).
- Standard buttons: `rounded-md` (matches input height for inline alignment).
- Cards: `rounded-2xl` (20px) for analytical, `rounded-xl` (16px) for value-strip.
- Pills / badges / tags: `rounded-full`.
- **Never:** `rounded-3xl` or larger except for explicit pill use. Over-rounding reads as consumer SaaS, not operational tooling.

## 10. Elevation and Shadow Rules

- **Default state:** no shadow. Borders + spacing carry hierarchy.
- **Floating card anchor:** `shadow-[var(--shadow-card)]` — at most once per section.
- **Glow buttons (`.btn-glow`):** the glow IS the elevation. Don't add additional shadow.
- **Don't** stack multiple shadow tokens. Don't use `shadow-md` / `shadow-lg` from Tailwind defaults — they don't match the design language.

## 11. Component Rules

### 11.1 Buttons

Two systems coexist:

- **`.btn-glow` / `.btn-glow-sys`** (in `globals.css`) — primary glow CTAs. Orange glow = signal action. Blue glow = system action. Used for the most important CTA on a page or section.
- **Tailwind variant Button** (`src/components/ui/Button.tsx`) — primary / secondary / ghost variants. Used for everything else.

Rules:

- One signal-glow CTA per major section. Pages can have multiple sections, but resist orange glow on every section.
- Secondary actions: `variant="secondary"` (transparent + border) or `variant="ghost"` (text-only).
- Buttons should feel decisive, not playful. No bounce on hover. No scale transforms.
- iOS minimum touch target: 44px height — `size="md"` and `size="lg"` satisfy this; `size="sm"` is desktop-only.

**⚠️ Critical pitfall — lead-capture and conversion forms:** the shared `Button` and `Select` abstractions have caused real-iPhone-Safari hydration / event-propagation issues in the wild (PR #47 prototype). For any **lead-capture critical-path control** (Next button on a multi-step form, primary submit on a contact form, etc.), use **native `<button type="button">`** with `onClick` and explicit `e.preventDefault(); e.stopPropagation();` — bypass the shared primitives. See §17.5 and §11.3.

### 11.2 Cards / Panels

- Anchor structurally: `border border-[var(--line-2)] bg-bg-2 rounded-2xl`.
- Padding: `p-6 sm:p-10` for analytical panels, `p-5` for compact value cards.
- Prefer borders + contrast over shadows. The border IS the card.
- Floating glass cards (`backdrop-blur-*` over partial backgrounds) only when the surface beneath is a deliberate composition tool (e.g., the sticky `<header>`). Don't use glass for content cards.

### 11.3 Inputs / Forms

- Inputs: `h-11 w-full rounded-md border bg-bg-2 px-4 t-body text-fg-0`.
- Border default: `border-[var(--line-2)]`. Hover `border-[var(--line-3)]`. Focus `border-aj-blue-bright` + 2px focus-visible ring.
- Error: `border-[color:var(--danger)]` and `aria-invalid={true}`.
- Number inputs: include `inputMode="numeric"` (or `"decimal"`) so iOS shows the right keyboard.
- Placeholder selects: `<option value="" disabled>{placeholder}</option>`.
- **Lead-capture critical-path selects on real mobile devices:** prefer native `<select>` with native `<option>` children and direct `value`/`onChange` props in the consumer component. The shared `Select.tsx` abstraction has caused state-propagation issues on real iOS Safari that did not reproduce in Playwright Chromium or Playwright WebKit emulation. See §17.5.

### 11.4 Chips / Tags / Badges

- Use for metadata, state, readiness, signal classification.
- Pill-shape (`rounded-full`), uppercase or system-style label, low contrast against surface.
- One word ideal. Avoid badge clutter — if a card needs three badges, the card is doing too much.

### 11.5 Lists / Tables

- Lists: bullet alignment carries rhythm. Use `--sp-sm` for tight stacks, `--sp-md` for breathable.
- Tables for diagnostic / attribution data: clean dividers (`--line-1`), monospaced numerics, no zebra striping, no full grid lines. Structure over decoration.

### 11.6 Navigation

- Primary nav: `Header.tsx` is the rendered source of truth. `src/config/nav.ts` exports `mainNav` but **is not currently consumed** by the rendered header (known dead config — flag for cleanup).
- Wordmark = home (no explicit "Home" item).
- Mobile drawer mirrors desktop.
- **Don't change nav structure as part of unrelated PRs.** Nav restructure goes in its own PR for review focus.

### 11.7 Diagnostic / Score Components

For ROI Calculator, Signal Diagnostic, Readiness Score, and similar:

- 3-card score grid is the canonical pattern (`<DiagnosticScoreCard>` reference in PR #47 prototype).
- Each score: large number + tone-coded eyebrow + 1-line description.
- Tones: `signal` (orange) for attention/upside, `system` (blue) for readiness/structure, `metric` (gold) for priority/scoring.
- Always pair the score with a recommendation card ("Automate Now" / "Pilot First" / "Diagnose the Workflow" / etc.) + clear next-step CTA.

### 11.8 Editorial / Insight Blocks

These should feel **authored, not generated**:

- Strong headline (Space Grotesk h1 / h2).
- Restrained metadata above headline (gold eyebrow + small caps).
- Body in Inter, generous line-height (`leading-7` to `leading-relaxed`).
- One pull-quote per long article max.
- Section dividers via `<hr class="border-[var(--line-1)]">` — selective, not every paragraph.
- Selective accent: one orange word or phrase per insight max.

## 12. Motion Rules

**Should:**

- Reveal information progressively (`opacity` + `translate-y-2` on entry).
- Reinforce hierarchy (parent fades in slightly before child).
- Use `--ease-out` for entrance, `--ease-in-out` for state toggles.
- Respect `prefers-reduced-motion: reduce` — disable transforms, keep opacity.

**Must not:**

- Bounce. Spring physics. Squash-and-stretch.
- Particles, confetti, gamification effects.
- Decorative noise.
- Motion longer than `--dur-slow` (320ms) — anything longer feels sluggish.

## 13. Responsive Rules

- **Mobile-first.** Author baseline styles for ≤640px. Use `sm:` `md:` `lg:` breakpoints to add desktop refinement.
- **Page max-width:** `max-w-[1280px]` (`--page-max`).
- **Hero:** `pt-16 pb-12 sm:pt-24 sm:pb-16`. Don't cram on mobile.
- **Type scaling:** existing `t-h1` / `t-h2` classes already include responsive scaling. Don't override.
- **CTA visibility:** primary CTA must be visible above-the-fold on mobile. If the hero is too tall, shorten the hero — don't push the CTA off-screen.
- **Diagnostic / data components:** must remain readable on iPhone-13 viewport (390px wide). Stacked layout for narrow widths is not negotiable.
- **No horizontal overflow.** Audit every new section on mobile.

## 14. Accessibility Rules

- WCAG AA contrast minimum (4.5:1 for body, 3:1 for large text). Token roles already meet this on dark — re-validate when introducing new color roles.
- Keyboard focus visible: `focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]` on all controls.
- Semantic headings: `<h1>` per page, no skipping levels.
- Buttons vs links: `<button>` for actions that don't navigate, `<a>` for actual destinations. Don't style links as buttons unless they navigate to a meaningful URL.
- `prefers-reduced-motion: reduce` honored — see §12.
- `alt=""` on decorative images, descriptive alt on content images.
- Form labels: `<FormField>` wraps every input — don't skip the label.
- Color is never the only indicator of state. Errors include text, not just red border. Required indicates with `*` + `aria-required`.
- Touch targets: 44×44px minimum for interactive controls.

## 15. Do / Don't Rules

**DO:**

- ✅ Use semantic tokens (`--signal`, `--system`, `--metric`).
- ✅ One signal-orange CTA per section.
- ✅ Native HTML controls for lead-capture critical paths.
- ✅ Test on real iPhone Safari + real Android Chrome before declaring "mobile works."
- ✅ Test in production mode (`pnpm build && pnpm start`) before declaring "fixed."
- ✅ Borders + spacing for hierarchy.
- ✅ Selective accent (orange word, gold eyebrow) over saturation.

**DON'T:**

- ❌ Use orange for non-strategic actions (newsletter signup, "show more," footer links).
- ❌ Add new font dependencies without justification.
- ❌ Rely on Playwright Chromium / WebKit emulation as proof for mobile-Safari-critical surfaces.
- ❌ Use shared `<Select>` / `<Button>` in lead-capture critical paths until §17.5 is resolved.
- ❌ Stack multiple shadow tokens.
- ❌ Use motion that bounces, scales decoratively, or runs longer than `--dur-slow`.

## 16. Anti-Patterns

Visual aesthetics to actively avoid (verbatim from brief):

- Generic AI purple gradients
- Playful SaaS aesthetics (rainbow gradients, illustrations of robots, etc.)
- Confetti / gamification
- Excessive glassmorphism (more than the sticky header)
- Random 3D blobs
- Neon cyberpunk clichés
- Over-rounded consumer UI
- Template-driven layouts
- Noisy dashboard clutter
- Unnecessary animation
- Arbitrary color additions
- Soft edtech styling
- Ecommerce urgency styling
- Discount/sale-style orange usage
- Vague AI chatbot visuals
- Decorative effects that don't clarify hierarchy

## 17. Current Implementation Audit

### 17.1 Existing Fonts

Self-hosted at `/public/fonts/`:

- **Space Grotesk** — 400, 500, 600, 700 (Regular / Medium / SemiBold / Bold). Headline / display.
- **Sora** — 400, 500, 600, 700. Editorial accent.
- **Inter** — 400, 500, 600, 700, 400-italic. Body / UI.
- **Mono** — system stack only (`ui-monospace, SF Mono, Menlo, Consolas`). No custom mono shipped (intentional).

`@font-face` declarations live in `src/app/globals.css` lines 17–80. `font-display: swap`. **Do not add new font dependencies without justification.**

### 17.2 Existing CSS Variables

Defined at `src/app/globals.css:84` onward. Categories:

- Brand palette (`--aj-orange`, `--aj-blue`, `--aj-blue-bright`, `--aj-gold`, soft variants)
- Surfaces dark (`--bg-0` through `--bg-4`)
- Surfaces light split (`--paper`, `--surface`, `--surface-soft`, `--ink`, `--ink-muted`, `--border-light`)
- Text dark (`--fg-0` through `--fg-3`)
- Text light (`--fg-light-0` through `--fg-light-2`)
- Borders (`--line-1` / `--line-2` / `--line-3` + colored `--line-blue` / `--line-gold`)
- Semantic state (`--signal` / `--system` / `--metric` / `--success` / `--warning` / `--danger`)
- Brand identity aliases (`--orange-primary`, `--blue-system`, `--dark-primary`, `--dark-secondary`)
- Type families (`--font-headline` / `--font-accent` / `--font-body` / `--font-mono`)
- Type scale (`--fs-display-xl` through `--fs-label`)
- Spacing scale (`--sp-xs` through `--sp-5xl`)
- Radii (`--r-sm` through `--r-pill`)
- Layout (`--page-max`, `--copy-max`, `--hero-max`, `--gutter-*`)
- Shadows (`--shadow-glow-blue`, `--shadow-glow-orange`, `--shadow-card`)
- Motion (`--ease-out`, `--ease-in-out`, `--dur-fast/base/slow`)

The light-split section (`.surface-light`, `[data-surface="light"]`) is opt-in — wrapping a section flips it to the paired clarity layer. **Dark stays primary.** No `prefers-color-scheme` switching.

### 17.3 Existing Tailwind Tokens

Tailwind v4 reads tokens from the `@theme inline` block in `globals.css` (lines ~211–262). This bridges CSS vars to Tailwind utilities (`bg-bg-2`, `text-fg-1`, `text-aj-orange`, `border-aj-blue-bright`, etc.).

Type utility classes (`.t-display-xl` through `.t-label`) live at `globals.css` lines ~325–410 and provide responsive typography in one className.

### 17.4 Existing Shared Components

`src/components/ui/`:

| File | Purpose | Status |
|---|---|---|
| `Button.tsx` | `<Button>` + `<ButtonLink>` with variants `primary`, `secondary`, `ghost`, `glow`, `system-glow`. Sizes `sm`, `md`, `lg`. | Stable for non-critical paths. ⚠️ See §17.5 for lead-capture caveat. |
| `Eyebrow.tsx` | Gold/blue/muted small-caps eyebrow text. | Stable. |
| `Card.tsx` | Standard analytical card wrapper. | Stable. |
| `Badge.tsx` | Pill badge with tones. | Stable. |
| `Input.tsx` | Native `<input>` wrapper with brand styling + invalid state. | Stable. |
| `Select.tsx` | Native `<select>` wrapper with placeholder option support. | ⚠️ Has known mobile-Safari issue in lead-capture critical paths — see §17.5. |
| `Textarea.tsx` | Native `<textarea>` wrapper. | Stable. |
| `Checkbox.tsx` | Native `<input type="checkbox">` wrapper. | Stable. |
| `FormField.tsx` | Label + hint + error wrapper. | Stable. |

Plus `src/components/ui/cards/` for specialized card subtypes.

Layout-level: `Header.tsx`, `Footer.tsx`, `Toast.tsx`. Header composes the wordmark + nav + glow CTA + mobile drawer.

### 17.5 Current Drift Risks

**🔴 Critical: shared `Select.tsx` and `Button.tsx` in lead-capture critical paths.**

Surfaced during PR #47 (ROI Calculator prototype). Symptoms on real iPhone Safari (over Cloudflare tunnel against `pnpm dev`):

- Native `<select>` shows the user's selection visually, but React state stays empty (no `onChange` propagation).
- "Next" button form-submit raced past `e.preventDefault()` and triggered native form navigation.
- Multiple "fixed" cycles failed because Playwright Chromium AND Playwright WebKit emulation BOTH passed — only real-device Safari surfaced the issue.
- Root cause was finally isolated to **Next.js dev runtime + Cloudflare tunnel cross-origin block** preventing client-bundle hydration on real-device Safari, NOT actual code in the components.

**Implications for future work:**

1. **Use native HTML controls for lead-capture critical paths.** For multi-step forms, contact forms, calculator inputs, etc. that drive conversion, prefer native `<select>` / `<button type="button">` with direct `value` / `onChange` props. The shared abstractions are fine for non-critical UI.

2. **Mobile testing must use production-mode locally** (`pnpm build && pnpm start`) before declaring fixes work. Dev-mode HMR + tunnel + real-device Safari produces hydration false negatives that look like code bugs.

3. **Playwright Chromium and Playwright WebKit emulation are NOT proof for mobile-Safari critical surfaces.** They use desktop touch dispatch and don't reproduce iOS native picker behavior or real cross-origin tunnel constraints. They're necessary but not sufficient.

4. **The intro-gate pattern (require user to tap "Start" before showing the form) creates friction.** If the user clicked the hero CTA, they want to start — show the form directly. (Surfaced as PR #47 dead-CTA issue.)

5. **`<form>` wrappers around multi-step UIs are a navigation hazard.** A stray click that triggers form submission on mobile Safari can race past `e.preventDefault()`. Prefer `<div>` wrappers + explicit button onClick handlers for multi-step state machines.

**🟡 Minor: dual nav definition.** `Header.tsx` has a hardcoded `NAV` array. `src/config/nav.ts` exports `mainNav` that is **not consumed** by the rendered header. Document this until consolidated. New nav items must go in `Header.tsx` to be visible.

**🟡 Minor: title template doubling.** Root `metadata.title.template = "%s | Audio Jones"` combined with page-level `title: "X | Audio Jones"` produces `"X | Audio Jones | Audio Jones"`. Pages should set `title: "X"` only.

## 18. Agent Instructions for Claude / Codex

When generating UI for AudioJones.com:

1. **Read this DESIGN.md first.** Before writing any new section, page, or component.
2. **Reuse existing tokens.** Don't introduce raw hex values. If a token doesn't exist for the role you need, propose adding it to `globals.css` + `tokens.ts` in lockstep — don't just add a hex.
3. **Reuse existing components from `src/components/ui/` for non-critical paths.** For lead-capture critical paths, see §17.5.
4. **Preserve the dark-first canvas.** Don't introduce light surfaces unless using `surface-light` opt-in.
5. **Use signal-orange semantically.** ONE primary CTA per major section. Never decorative.
6. **Mobile-first authoring.** Baseline ≤640px. iOS 44px touch target.
7. **Match existing motion vocabulary.** Directional fades, progressive reveals. No bounce.
8. **No new font dependencies** without explicit justification and approval.
9. **Surface design tradeoffs before coding.** If the spec conflicts with this DESIGN.md, raise the conflict — don't silently deviate.
10. **Run accessibility checks.** Keyboard focus visibility, semantic headings, label associations.
11. **Real-iPhone Safari + production-mode test mandatory** for lead-capture / conversion surfaces. See `skills/audiojones-ui-section.skill.md`.
12. **Run drift audit** (`skills/design-drift-audit.skill.md`) before considering UI work done.

## 19. Future Recommendations

Documented for the queue, not for this pass:

- **Consolidate dual nav definition.** Decide whether `Header.tsx` consumes `mainNav` from `src/config/nav.ts` (DRY) or whether the config-side is removed (less indirection). Currently the config is dead code.
- **Fix title template doubling.** Switch all `buildMetadata({title: "X | Audio Jones"})` callers to `title: "X"` and rely on root layout's `template` to append the suffix. ~10 page files affected.
- **Resolve the controlled `<select>` `value` + `defaultValue` antipattern in `Select.tsx`** — known to fire React 19 warnings; the calculator-local native rewrite during PR #47 confirmed the cleaner pattern is conditional spread.
- **Page-system guidance for ROI Calculator, Services, Workshops, AI Agents, Blog/Insights** — each surface should have a dedicated section in this document once the v1 of each ships. Reference the actual implementation, then mark drift risks. Codex brief at `docs/codex/roi-calculator-v1-brief.md` is the first such artifact.
- **Light-split documentation.** The `.surface-light` opt-in is implemented but lightly used. Document where it appears and the criteria for adding new light sections.
- **Dev-mode mobile QA documentation.** Production-mode-locally (`pnpm build && pnpm start`) workflow for mobile QA needs a runbook. Add to `docs/dev-setup.md` after this lands.

## 20. Changelog

| Date | Version | Change |
|---|---|---|
| 2026-05-06 | 1.0.0 | Initial DESIGN.md from current implementation. Captures tokens, fonts, components, drift risks discovered during PR #47 ROI Calculator prototype. |
