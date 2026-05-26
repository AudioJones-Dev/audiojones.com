---
title: "Audio Jones DESIGN.md"
version: "2.0.0"
status: "draft"
owner: "Audio Jones / AJ Digital"
repo: "AudioJones-Dev/audiojones.com"
design_language: "Editorial Intelligence Systems"
last_updated: "2026-05-23"
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

**Editorial Intelligence Systems.** The shape is **Apple restraint × Linear product polish × Palantir operational seriousness** — applied to a broadsheet-grade editorial canvas. Dark-first. Signal-yellow where it matters, data-blue where structure speaks. Restraint everywhere else.

Core voice: signal over noise. Strategic operators reading the page should feel like the interface itself is doing analytic work — not selling them on AI hype.

## 3. Design Philosophy

1. **Signal over noise.** Every pixel has a reason. Decoration is a tax on attention.
2. **Hierarchy through typography, borders, spacing, contrast, and rhythm** — not gradients, glows, or shadows.
3. **Color is semantic, not decorative.** Signal-yellow (`#E8FF5A`) means *signal emergence* / *strategic activation* / *operator action*. Data-blue (`#4DACFF`) means *system / framework / structural*. Red means *critical / destructive / urgent*. Use them deliberately.
4. **Objects are anchored, not floating.** Cards have borders + structure. Avoid glassmorphism unless it earns its place.
5. **Motion implies progression and intelligence unfolding.** Directional fades, progressive reveals, snappy ease-out. No bounce. No particles.
6. **Editorial authority + systems precision + cinematic tension.** The surface should read like a well-designed publication, not a SaaS landing page.
7. **Restraint over trendiness.** Precision over decoration. Asymmetry over templates. Operational clarity over visual novelty.

## 4. Token Philosophy

Tokens are **semantic roles**, not raw values. Consumers reference roles (`--signal`, `--bg-2`, `--fs-h1`); the role definition lives in one place (`globals.css`). Renaming a role is a one-line change site-wide.

Three layers:

1. **Raw brand values (V2 canonical)** — `--signal-yellow`, `--signal-soft`, `--accent-blue`, `--accent-red`, `--accent-amber`, `--accent-green`. The legacy V1 names (`--aj-orange`, `--aj-blue-bright`, `--aj-gold`) are preserved as **aliases retargeted to V2 values** so ~300 existing call sites pick up the new palette without per-file edits. Prefer V2 names in new code; don't reference either layer outside the token system itself.
2. **Surface / text / line / spacing / type / motion roles** — `--bg-base` / `--surface-1` / `--surface-2` (V2 canonical) or the legacy `--bg-0` through `--bg-4` aliases; `--text-primary` / `--text-muted` or legacy `--fg-0` through `--fg-3`; `--border-subtle` / `--border-strong` or legacy `--line-1` through `--line-3`; `--sp-md` etc. Components reference these.
3. **Semantic aliases** — `--signal`, `--system`, `--metric`, `--success`, `--warning`, `--danger`. Use these for state-bearing UI.

Tailwind v4's `@theme inline` block in `globals.css` maps these CSS vars to Tailwind utilities (`bg-bg-2`, `text-fg-1`, `text-signal-yellow`, `bg-surface-1`, `border-accent-blue`, etc.). Legacy utility names (`text-aj-orange`, `border-aj-blue-bright`) still resolve via the alias layer. New utility tokens go in **both** the `:root` block and the `@theme inline` block. Note: `src/lib/applied-intelligence/tokens.ts` is intended to mirror this — see §17.5 for current drift state.

## 5. Tokens

### 5.1 Color Tokens

**Canonical values live in `src/app/globals.css` `:root` (V2, May 2026).** The block below mirrors that file. Tagline: *All Signal. No Noise.* — the palette collapsed from three competing primaries (orange + blue + gold) to a two-accent system: **signal-yellow + data-blue**.

```yaml
# ── V2 canonical palette — Brand Guidelines 2.0 ─────────────────────
# These are the source values. Everything else aliases back to them.

signalYellow:
  value: "#E8FF5A"
  role: "Primary brand accent. Signal emergence, strategic activation, operator action."
  usage: "Primary CTAs, key insight markers, active states, eyebrows, metric labels, signal moments."
  avoid: "Decorative use, sale/discount aesthetics, generic SaaS startup styling, every button on a page."
signalSoft:
  value: "#F0FF85"
  role: "Hover / lighter signal variation."

accentBlue:
  value: "#4DACFF"
  role: "Data, links, system framework. Secondary CTA, focus rings, system-glow buttons, structural accents."
accentRed:
  value: "#FF4545"
  role: "Critical / destructive / P0. Errors, destructive actions, urgent failures only."
accentAmber:
  value: "#FFB340"
  role: "Warning / partial readiness / P1. Caution states."
accentGreen:
  value: "#3DFFB0"
  role: "Positive operational state, wins, completion."

# Surfaces — dark (default)
bgBase:
  value: "#080808"
  role: "Page background — base operational canvas."
surface1:
  value: "#0F0F0F"
  role: "Card / alternating section background. (V2 collapses former --bg-1 and --bg-2 to one surface.)"
surface2:
  value: "#161616"
  role: "Elevated card / table head / structural container."
bg4:
  value: "#1A1A1A"
  role: "Hover surface."

# Borders
borderSubtle:
  value: "#1E1E1E"
  role: "Default structural borders (V2 canonical for --line-2)."
borderStrong:
  value: "#2A2A2A"
  role: "Emphasized hierarchy / active borders (V2 canonical for --line-3)."
line1:
  value: "rgba(255,255,255,0.06)"
  role: "Subtle dividers."
lineBlue:
  value: "rgba(77,172,255,0.40)"
lineSignal:
  value: "rgba(232,255,90,0.45)"
  role: "Signal-yellow tinted divider. --line-gold is now an alias of this."

# Text — dark
fg0:
  value: "#FFFFFF"
  role: "Primary high-clarity foreground ink. Headlines, key labels, primary copy."
textPrimary:
  value: "#E8E8E8"
  role: "Body text default. (V2 canonical for --fg-1; was #E5E7EB in V1.)"
fg2:
  value: "#9A9A9A"
  role: "Secondary copy, descriptions, helper text. (Was #94A3B8 in V1.)"
textMuted:
  value: "#666666"
  role: "Muted metadata, labels, timestamps. (V2 canonical for --fg-3; was #64748B in V1.)"

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

# Semantic state (these are what components should reference)
signal:
  value: "var(--signal-yellow)"   # #E8FF5A
  role: "Strategic activation. Primary CTA, insight emergence, operator action."
  usage: "ONE primary CTA per major section. Insight indicators. Active state on key controls."
  avoid: "Generic excitement, discount/sale aesthetics, decorative gradients, every button on a page."
system:
  value: "var(--accent-blue)"     # #4DACFF
  role: "Framework / structural / supporting CTA, data, links."
metric:
  value: "var(--signal-yellow)"   # #E8FF5A — V2 collapses metric to signal-yellow (was antique-gold #C8A96A in V1).
  role: "Eyebrows, metric labels, editorial markers."
success:
  value: "var(--accent-green)"    # #3DFFB0
warning:
  value: "var(--accent-amber)"    # #FFB340
danger:
  value: "var(--accent-red)"      # #FF4545
```

#### V1 → V2 alias map (legacy names preserved for back-compat)

| Legacy V1 token | V1 value | V2 retarget | V2 value |
|---|---|---|---|
| `--aj-orange` | `#FF4500` | `var(--signal-yellow)` | `#E8FF5A` |
| `--aj-orange-soft` | `#FF6A30` | `var(--signal-soft)` | `#F0FF85` |
| `--aj-blue` | `#0088CC` | `var(--accent-blue)` | `#4DACFF` |
| `--aj-blue-bright` | `#3B5BFF` | `var(--accent-blue)` | `#4DACFF` (collapsed) |
| `--aj-gold` | `#C8A96A` | `var(--signal-yellow)` | `#E8FF5A` (eyebrows now signal-yellow per V2 §07) |
| `--bg-0` | `#05070F` | `var(--bg-base)` | `#080808` |
| `--bg-1` | `#0B0F1A` | `var(--surface-1)` | `#0F0F0F` |
| `--bg-2` | `#0B1020` | `var(--surface-1)` | `#0F0F0F` (collapsed) |
| `--bg-3` | `#101827` | `var(--surface-2)` | `#161616` |
| `--bg-4` | `#1A2234` | `#1A1A1A` | `#1A1A1A` |
| `--fg-1` | `#E5E7EB` | `var(--text-primary)` | `#E8E8E8` |
| `--fg-2` | `#94A3B8` | (direct) | `#9A9A9A` |
| `--fg-3` | `#64748B` | `var(--text-muted)` | `#666666` |
| `--line-2` | `rgba(255,255,255,0.10)` | `var(--border-subtle)` | `#1E1E1E` |
| `--line-3` | `rgba(255,255,255,0.18)` | `var(--border-strong)` | `#2A2A2A` |
| `--line-gold` | `rgba(200,169,106,0.40)` | `var(--line-signal)` | `rgba(232,255,90,0.45)` |
| `--signal` | `var(--aj-orange)` | `var(--signal-yellow)` | `#E8FF5A` |
| `--system` | `var(--aj-blue-bright)` | `var(--accent-blue)` | `#4DACFF` |
| `--metric` | `var(--aj-gold)` | `var(--signal-yellow)` | `#E8FF5A` |
| `--success` | `#22C55E` | `var(--accent-green)` | `#3DFFB0` |
| `--warning` | `#FACC15` | `var(--accent-amber)` | `#FFB340` |
| `--danger` | `#EF4444` | `var(--accent-red)` | `#FF4545` |

New code should reference V2 canonical names. Legacy aliases are kept indefinitely so the ~300-call-site component layer keeps working without per-file edits.

### 5.2 Typography Tokens

**Canonical font families live in `src/app/globals.css` (V2, May 2026):** loaded over the wire from Google Fonts at line 25, mapped to CSS vars at lines 156–159. Brand 2.0 mandate is **Syne · DM Sans · DM Mono**. The legacy self-hosted TTFs (Space Grotesk / Sora / Inter) remain on disk and appear in the font stacks as fallbacks only — see §17.1.

```yaml
fontHeadline:
  value: "Syne"
  weights: [500, 600, 700, 800]
  role: "Display + section hierarchy. All headers."
  notes: "Loaded via Google Fonts (globals.css line 25). Tight tracking, target -0.02em. Fallback stack: Space Grotesk, ui-sans-serif, system-ui, sans-serif."
  source: "var(--font-headline) — globals.css line 156"
fontAccent:
  value: "Syne"
  weights: [500, 600, 700, 800]
  role: "Editorial accents — V2 collapses display and accent onto the same family."
  notes: "Sora is retired in V2. Fallback stack identical to --font-headline."
  source: "var(--font-accent) — globals.css line 157"
fontBody:
  value: "DM Sans"
  weights: [300, 400, 500, 700]
  italics: [400]
  role: "Primary UI / body / navigation / paragraph copy."
  notes: "Generous line-height (1.65–1.75) against dark surfaces. Fallback stack: Inter, ui-sans-serif, system-ui, sans-serif."
  source: "var(--font-body) — globals.css line 158"
fontMono:
  value: "DM Mono"
  weights: [400, 500]
  role: "Labels / data / metrics / badges / timestamps / system markers — the 'intelligence layer.'"
  notes: "Uppercase, tracking 0.1em–0.2em for labels. Fallback stack: ui-monospace, SF Mono, Menlo, Consolas, monospace."
  source: "var(--font-mono) — globals.css line 159"
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
| Signal emergence | `--signal` (yellow `#E8FF5A`) | Single primary CTA per major section. The "Calculate Your AI ROI" / "Take Signal Diagnostic" / strategic action moments. |
| System / framework | `--system` (data-blue `#4DACFF`) | Secondary CTA, framework accents, system module callouts, focus rings, links. |
| Metric / editorial | `--metric` (yellow `#E8FF5A`) | Eyebrows, KPI labels, editorial section markers. (V2 collapsed metric to signal-yellow — antique-gold is retired.) |
| Success | `--success` (`#3DFFB0`) | Confirmation, readiness complete, positive validation. |
| Warning | `--warning` (`#FFB340`) | Partial readiness, caution states. |
| Danger | `--danger` (`#FF4545`) | Errors, destructive actions, critical alerts only. |

**Hard rule:** signal-yellow is never decorative. If a button is yellow, the action it represents must be the most important next step on the page.

## 7. Typography Roles

| Role | CSS class | Font | Use |
|---|---|---|---|
| Display XL | `t-display-xl` | Syne 800 | Marketing hero only. Rare. |
| Display LG | `t-display-lg` | Syne 800 | Hero h1 on flagship pages. |
| H1 | `t-h1` | Syne 800 | Page hero h1 (default). |
| H2 | `t-h2` | Syne 700 | Section headings. |
| H3 | `t-h3` | Syne 700 | Sub-section headings. |
| H4 | `t-h4` | Syne 700 | Card titles, small headings. |
| Lead | `t-lead` | DM Sans 400 | Hero subcopy, intro paragraphs. |
| Body LG | `t-body-lg` | DM Sans 400 | Long-form readable content. |
| Body | `t-body` | DM Sans 400 | Default UI / interface text. |
| Small | `t-small` | DM Sans 300/400 | Captions, helper text, secondary nav. |
| Label | `t-label` | DM Mono 400 (uppercase, tracked 0.1em–0.2em) | Eyebrows, metric labels, badges, dates, version numbers. |

Mono (DM Mono) extends beyond code: in V2 it's the "intelligence layer" — eyebrows, metric values, timestamps, system state, severity badges. Headlines remain Syne only; body copy remains DM Sans only. Don't mix mono into marketing prose.

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

- **`.btn-glow` / `.btn-glow-sys`** (in `globals.css`) — primary glow CTAs. Yellow glow = signal action (`--shadow-glow-signal` / legacy `--shadow-glow-orange`). Blue glow = system action (`--shadow-glow-blue`). Used for the most important CTA on a page or section.
- **Tailwind variant Button** (`src/components/ui/Button.tsx`) — primary / secondary / ghost variants. Used for everything else.

Rules:

- One signal-glow CTA per major section. Pages can have multiple sections, but resist signal-yellow glow on every section.
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
- Tones: `signal` (yellow) for attention/upside, `system` (blue) for readiness/structure, `metric` (yellow) for priority/scoring. (Signal and metric share the yellow accent in V2 — distinguish by typography weight + label context, not hue.)
- Always pair the score with a recommendation card ("Automate Now" / "Pilot First" / "Diagnose the Workflow" / etc.) + clear next-step CTA.

### 11.8 Editorial / Insight Blocks

These should feel **authored, not generated**:

- Strong headline (Syne h1 / h2).
- Restrained metadata above headline (signal-yellow eyebrow + small caps).
- Body in DM Sans, generous line-height (`leading-7` to `leading-relaxed`).
- One pull-quote per long article max.
- Section dividers via `<hr class="border-[var(--line-1)]">` — selective, not every paragraph.
- Selective accent: one signal-yellow word or phrase per insight max.

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
- ✅ One signal-yellow CTA per section.
- ✅ Native HTML controls for lead-capture critical paths.
- ✅ Test on real iPhone Safari + real Android Chrome before declaring "mobile works."
- ✅ Test in production mode (`pnpm build && pnpm start`) before declaring "fixed."
- ✅ Borders + spacing for hierarchy.
- ✅ Selective accent (one signal-yellow word, yellow eyebrow) over saturation.

**DON'T:**

- ❌ Use signal-yellow for non-strategic actions (newsletter signup, "show more," footer links).
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
- Discount/sale-style accent usage (yellow or otherwise)
- Vague AI chatbot visuals
- Decorative effects that don't clarify hierarchy

## 17. Current Implementation Audit

### 17.1 Existing Fonts

**V2 primary (Google Fonts, loaded over the wire — `globals.css` line 25):**

- **Syne** — 500, 600, 700, 800. Display, headlines, all heading levels.
- **DM Sans** — 300, 400, 500, 700 + italic 400. Body / UI / paragraph copy.
- **DM Mono** — 400, 500. Labels, metrics, badges, timestamps, system state — the "intelligence layer."

CSS-var mapping at `globals.css` lines 156–159: `--font-headline`, `--font-accent` (both → Syne), `--font-body` → DM Sans, `--font-mono` → DM Mono.

**Legacy (self-hosted at `/public/fonts/`, kept as fallback only):**

- **Space Grotesk** — 400, 500, 600, 700. Fallback in `--font-headline` / `--font-accent` stacks.
- **Inter** — 400, 500, 600, 700, 400-italic. Fallback in `--font-body` stack.
- **Sora** — still on disk but no longer in any V2 font stack (retired; V2 collapses display and accent onto Syne).

`@font-face` declarations for the legacy TTFs remain in `src/app/globals.css`. `font-display: swap`. **Do not add new font dependencies without justification.**

### 17.2 Existing CSS Variables

Defined in `src/app/globals.css` `:root` (V2 canonical block) plus a legacy-alias block immediately after. Categories:

- **V2 canonical brand palette** — `--signal-yellow`, `--signal-soft`, `--accent-blue`, `--accent-red`, `--accent-amber`, `--accent-green`
- **V2 canonical surfaces / text / borders** — `--bg-base`, `--surface-1`, `--surface-2`, `--text-primary`, `--text-muted`, `--border-subtle`, `--border-strong`
- **Legacy brand palette aliases** (retargeted to V2) — `--aj-orange`, `--aj-orange-soft`, `--aj-blue`, `--aj-blue-bright`, `--aj-gold`
- **Surfaces dark aliases** — `--bg-0` through `--bg-4` (point to V2 surfaces)
- **Surfaces light split** — `--paper`, `--surface`, `--surface-soft`, `--ink`, `--ink-muted`, `--border-light`
- **Text dark aliases** — `--fg-0` through `--fg-3` (point to V2 text)
- **Text light** — `--fg-light-0` through `--fg-light-2`
- **Borders** — `--line-1` plus aliased `--line-2` / `--line-3` and colored `--line-blue` / `--line-signal` (legacy `--line-gold` aliases `--line-signal`)
- **Semantic state** — `--signal` / `--system` / `--metric` / `--success` / `--warning` / `--danger`
- **Brand identity aliases** — `--orange-primary`, `--blue-system`, `--dark-primary`, `--dark-secondary` (all retargeted to V2)
- **Type families** — `--font-headline` / `--font-accent` / `--font-body` / `--font-mono`
- **Type scale** — `--fs-display-xl` through `--fs-label`
- **Spacing scale** — `--sp-xs` through `--sp-5xl`
- **Radii** — `--r-sm` through `--r-pill`
- **Layout** — `--page-max`, `--copy-max`, `--hero-max`, `--gutter-*`
- **Shadows** — `--shadow-glow-blue`, `--shadow-glow-signal` (V2), `--shadow-glow-orange` (legacy alias, now yellow rgba), `--shadow-card`
- **Motion** — `--ease-out`, `--ease-in-out`, `--dur-fast/base/slow`

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
5. **Use signal-yellow semantically.** ONE primary CTA per major section. Never decorative.
6. **Mobile-first authoring.** Baseline ≤640px. iOS 44px touch target.
7. **Match existing motion vocabulary.** Directional fades, progressive reveals. No bounce.
8. **No new font dependencies** without explicit justification and approval.
9. **Surface design tradeoffs before coding.** If the spec conflicts with this DESIGN.md, raise the conflict — don't silently deviate.
10. **Run accessibility checks.** Keyboard focus visibility, semantic headings, label associations.
11. **Real-iPhone Safari + production-mode test mandatory** for lead-capture / conversion surfaces. See `skills/audiojones-ui-section.skill.md`.
12. **Run drift audit** (`skills/design-drift-audit.skill.md`) before considering UI work done.

## 19. Future Recommendations

**Per PR #48 review — these are deferred backlog items, NOT v1 scope.** None of these should be pulled into ROI Calculator v1 (`feat/roi-calculator-v1-fullstack`) unless they directly block the calculator. Each should land as its own focused PR after ROI Calculator v1 ships.

Documented for the queue, not for this pass:

- **Consolidate dual nav definition.** Decide whether `Header.tsx` consumes `mainNav` from `src/config/nav.ts` (DRY) or whether the config-side is removed (less indirection). Currently the config is dead code.
- **Fix title template doubling.** Switch all `buildMetadata({title: "X | Audio Jones"})` callers to `title: "X"` and rely on root layout's `template` to append the suffix. ~10 page files affected.
- **Resolve the controlled `<select>` `value` + `defaultValue` antipattern in `Select.tsx`** — known to fire React 19 warnings; the calculator-local native rewrite during PR #47 confirmed the cleaner pattern is conditional spread.
- **Page-system guidance for ROI Calculator, Services, Workshops, AI Agents, Blog/Insights** — each surface should have a dedicated section in this document once the v1 of each ships. Reference the actual implementation, then mark drift risks. Codex brief at `docs/codex/roi-calculator-v1-brief.md` is the first such artifact.
- **Light-split documentation.** The `.surface-light` opt-in is implemented but lightly used. Document where it appears and the criteria for adding new light sections.
- **Dev-mode mobile QA documentation.** Production-mode-locally (`pnpm build && pnpm start`) workflow for mobile QA needs a runbook. Add to `docs/dev-setup.md` after this lands.

**Deferred from the 2.0.0 V2-sync pass (May 2026)** — surfaced while reconciling external Brand Kit references against the repo. Each is a governance/doctrine decision, not a doc correction:

- **Radius governance decision.** External Brand Kit specifies `4px` everywhere (sharp-premium geometry). Implementation currently uses `rounded-md` (10px) for buttons and `rounded-2xl` (20px) for analytical cards, with documented UX rationale in commit `ec1e898` (*"so the CTAs stop reading as instrument-panel chips next to softer cards"*). Pick one: align doc + code to 4px, or update external Brand Kit to match shipped 10/20px. Needs design owner sign-off.
- **Container width decision.** Five values across sources — external Brand Kit `1180px / 1360px`, `globals.css` `1200px / 1440px`, this doc §8 `1280px`. Pick one standard and reconcile all three.
- **Brand doctrine doc sync.** External Brand Kit `DESIGN.md` contains content not yet captured here: brand belief ("*Most businesses do not have a growth problem. They have a signal problem.*"), homepage hero copy template, preferred/avoided language lists, "Founder Intelligence Systems™" product noun, acceptance checklist. Should land as its own focused PR — voice/positioning doctrine pass, not a visual pass.
- **PDF Brand Kit reconciliation.** `AudioJones-BrandKit-Guidelines.pdf` was not text-extractable in the V2-sync pass. If it contains additional visual rules beyond the markdown references, a separate extraction pass is warranted.

## 20. Changelog

| Date | Version | Change |
|---|---|---|
| 2026-05-06 | 1.0.0 | Initial DESIGN.md from current implementation. Captures tokens, fonts, components, drift risks discovered during PR #47 ROI Calculator prototype. |
| 2026-05-23 | 2.0.0 | Sync to Brand Guidelines 2.0 already shipped in `globals.css`. **Colors:** primary accent shifted from signal-orange (`#FF4500`) to signal-yellow (`#E8FF5A`); blue collapsed from `#3B5BFF` to data-blue `#4DACFF`; antique-gold `#C8A96A` retired in favor of signal-yellow for eyebrows/metric. Surfaces re-grounded on `#080808` / `#0F0F0F` / `#161616`. **Typography:** primary families corrected to Syne (headlines) / DM Sans (body) / DM Mono (labels/data) per `globals.css` Google Fonts import; Space Grotesk / Inter / Sora demoted to fallback-only. Legacy V1 token names preserved as aliases. See homepage commit `ec1e898`. Radius, container width, and brand doctrine (belief, hero copy, voice, Founder Intelligence Systems™, acceptance checklist) explicitly deferred — see §19. |
