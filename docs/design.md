# Audio Jones — Design System

Single source of truth for the canonical Applied Intelligence surface.
Mirrors the brand-folder design system (Audio Jones Design System) at
`H:\AUDIO JONES BRAND FOLDER 2\AUDIO JONES SITE UI\Audio Jones Design System\`
and is implemented in this repo as:

- `src/app/globals.css` — CSS variables + `@theme inline` Tailwind v4 bridge + semantic typography classes
- `src/lib/applied-intelligence/tokens.ts` — TypeScript token mirror
- `src/components/ui/` — canonical primitives (Button, Eyebrow, …)
- `public/fonts/` — self-hosted Inter / Sora / Space Grotesk
- `public/assets/logos/` and `public/assets/trusted-by/` — brand assets

Update tokens in **all four** places when changing — they must stay in sync.

---

## Brand position

**Audio Jones (AJ Digital LLC)** — Applied Intelligence Systems Partner for founder-led businesses ($250K–$5M).

This is **not** a marketing website. It is a cognitive operating system interface.
Style anchors: **Apple × Linear × Palantir.** Minimal, high contrast, gridded,
asymmetrical-but-structured, no fluff.

---

## Color

| Token | Value | Use |
|---|---|---|
| `--aj-orange` | `#FF4500` | Primary accent — **emphasis only**, never a fill background. One signal moment per section. |
| `--aj-orange-soft` | `#FF6A30` | Hover/secondary orange. |
| `--aj-blue` | `#0088CC` | Secondary system blue (legacy + deep system layer). |
| `--aj-blue-bright` | `#3B5BFF` | Primary CTA, active step, focus ring, "system layer" callouts. |
| `--aj-gold` | `#C8A96A` | Eyebrows, metric labels, process numerals. **Never** body text or fills. Acts like a ledger marking. |
| `--bg-0` | `#05070F` | Page background. |
| `--bg-1` | `#0B0F1A` | Alt section background. |
| `--bg-2` | `#0B1020` | Card surface. |
| `--bg-3` | `#101827` | Elevated card / table head. |
| `--bg-4` | `#1A2234` | Hover surface. |
| `--paper` | `#F8FAFC` | Light split — opt-in clarity layer (hero right-pane system diagram, comparison panels, /results/* tier pages). |
| `--surface` | `#F5F5F5` | Light section subtle. |
| `--surface-soft` | `#EEF2F6` | Light card. |
| `--ink` | `#111111` | Headlines/body on light. |
| `--ink-muted` | `#4B5563` | Muted on light. |
| `--border-light` | `rgba(17,17,17,0.10)` | Card hairline on light. |
| `--bg-light-0/1/2`, `--fg-light-0/1/2` | (legacy aliases) | Pinned to canonical paper/surface/ink tokens; will be removed once call sites migrate. |
| `--fg-0` | `#FFFFFF` | Headlines on dark. |
| `--fg-1` | `#E5E7EB` | Body on dark. |
| `--fg-2` | `#94A3B8` | Muted on dark. |
| `--fg-3` | `#64748B` | Caption / least-secondary on dark. |
| `--fg-light-0` | `#111111` | Headlines on light. |
| `--fg-light-1` | `#1E2A3A` | Body on light. |
| `--fg-light-2` | `#4B5563` | Muted on light. |

### Border colors carry meaning

- `--line-2` (white/10) — generic card hairline
- `--line-blue` (blue/40) — active card / system column
- `--line-gold` (gold/40) — "noise that reveals signal" middle column

Border *color* IS the categorical encoding. Use deliberately.

### Light split (opt-in only)

Dark is the primary brand identity. Light is a **clarity/system contrast
layer** used deliberately — for the hero's right-pane system diagram, the
clean-vs-chaotic comparison panel in the problem reframe, the `/results/*`
tier pages, comparison tables, and printable docs. **Never** convert the
whole site to light. **Never** rely on `prefers-color-scheme` — light is
a composition tool, not a theme.

Opt in by wrapping a subtree with `class="surface-light"` or
`data-surface="light"`. The wrapper rebinds the `--bg-*`, `--fg-*`, and
`--line-*` variables so token-driven children flip cleanly without changes.

```html
<section class="surface-light">
  <h3 class="t-h3">Clear system</h3>
  <p class="t-body">Repeatable. Causal. Compounding.</p>
</section>
```

---

## Type

Three families with strict roles. Never decorative.

| Family | Role | Example |
|---|---|---|
| **Space Grotesk** | Display, h1–h3, framework names, big statements. Tight tracking (-0.02 to -0.04em). | `t-display-xl`, `t-h1`, `t-h2`, `t-h3` |
| **Sora** | h4, lead, pull-quotes, metric labels, the *one* phrase that needs to feel premium. | `t-h4`, `t-lead` |
| **Inter** | Body, UI, nav, buttons, forms, captions, system labels. **Always.** | `t-body`, `t-body-lg`, `t-small`, `t-label` |

Self-hosted from `public/fonts/`. No Google Fonts dependency.

Body: 16/1.6. Lead: 22/1.45. Headlines never go below 32px on desktop.

Mobile (≤640px) reduces display sizes — see `globals.css` `@media (max-width: 640px)`.

---

## Spacing & layout

- **12-col grid, 1280px max, 32px desktop gutter.** Tablet → 8-col / 24px. Mobile → 4-col / 20px.
- **Section padding:** 96–128px desktop, 72–96px tablet, 56–72px mobile. Rhythm > density.
- **Cards:** 24–32px internal padding, 24px grid gap, 20–24px radius.
- **Negative space is structural.** Two-column heros dedicate ~40% of canvas to space.

Tokens: `--sp-xs` (4) → `--sp-5xl` (128).

---

## Backgrounds

- **No photographs in primary surfaces.** Hero backgrounds are subtle radial gradients on near-black:
  ```css
  background:
    radial-gradient(circle at 15% 20%, rgba(59,91,255,0.18), transparent 55%),
    radial-gradient(circle at 85% 85%, rgba(200,169,106,0.10), transparent 60%);
  ```
- **Hairline gradient dividers** (1px, transparent → blue/40 → transparent) imply signal flow.
- **No textures, grain, patterns, or decorative illustrations.**
- **Diagrams are the imagery.** SVG flow lines, ordered lists with numbered chips, comparison tables.

---

## Animation

Subtle, structural, fast. 120–320ms. Default 180ms. Ease: `cubic-bezier(0.22, 1, 0.36, 1)`.

- **Hover:** opacity 0.92 on filled buttons; color shift on outlines (border + text → blue). No scale.
- **Press:** `transform: translateY(1px)`. No shrink-scale.
- **Focus:** 2px blue ring (`0 0 0 2px var(--aj-blue-bright)`). Never browser default.
- **No bounces, no spring. No card lift on hover.**

Tokens: `--ease-out`, `--dur-fast`, `--dur-base`, `--dur-slow`.

---

## Borders, shadows, radii

- Default card: `1px solid rgba(255,255,255,0.10)`.
- Active card: `1px solid rgba(59,91,255,0.40)` + tinted `rgba(59,91,255,0.10)` background.
- "Noise reveals signal" middle column: `1px solid rgba(200,169,106,0.40)`.
- **Shadows almost never used on dark.** Two exceptions:
  - Glow under primary CTA — `0 10px 40px -10px rgba(59,91,255,0.7)`.
  - Inset top-highlight on cards — `inset 0 1px 0 rgba(255,255,255,0.04)`.
- Radii: 6 (buttons/inputs), 10–16 (badges/small cards), 20–24 (primary cards/panels), 9999 (pills).

---

## Voice & content rules

- **Second person ("you")**, never "we" first. *"You are tracking activity, not causality."*
- **Declarative, not promotional.** No "transform your business."
- **Contrarian reframes are the hook.** *"Most companies don't fail at AI. They fail at signal architecture."*
- **Cause → effect, not feature → benefit.**
- **Frameworks as proper nouns.** M.A.P, N.I.C.H.E, Signal vs Noise, Applied Intelligence Systems, Step 2.
- **Numbered systems.** *"Seven layers", "Step 01 / 02 / 03"*.
- **No hype words.** Avoid: revolutionary, game-changing, leverage AI, unleash, supercharge, transform, empower, seamless. OK: leverage (noun), compound, signal, attribution, constraint, causal, augmentation.
- **No emoji. No exclamation points.**
- **Casing.** Headlines: sentence case with a period. Eyebrows: ALL CAPS, 0.18em tracking, gold. Buttons: sentence case.

---

## Iconography

- **Material Symbols Outlined** (CDN webfont) for utility icons.
- **Lucide** for illustrative icons at small sizes (when AJ-branded).
- **No emoji.** Unicode arrows (`→`) and em-dash (`—`) only.
- SVG diagrams hand-drawn per design — no library imports for hero/system art.

---

## Primitives (`src/components/ui/`)

| Component | Purpose | Reference |
|---|---|---|
| `<Button>` / `<ButtonLink>` | Primary (blue glow), secondary (outline), ghost. md/lg sizes. | `ui_kits/website/Button.jsx` |
| `<Eyebrow>` | Gold/blue/muted ALL-CAPS label. 12px / 0.18em tracking. | `ui_kits/website/Eyebrow.jsx` |

More primitives land per wave (SectionShell, Card, FormField, Toast, etc.).

---

## Reference

The authoritative external source is the **Audio Jones Design System** folder on the brand drive. Always read its `README.md` first when in doubt. This file mirrors that brand brief into the codebase.
