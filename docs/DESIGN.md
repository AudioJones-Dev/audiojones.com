# DESIGN.md — AudioJones.com design system

**Status:** canonical
**Supersedes:** `AUDIOJONES_DESIGN.md` (root) and `docs/design.md`

This is the single source of truth for the AudioJones.com brand, voice,
and Founder Intelligence System UI surface. It mirrors the brand-folder design
system (Audio Jones Design System) and is implemented in this repo as:

- `src/app/globals.css` — CSS variables + `@theme inline` Tailwind v4
  bridge + semantic typography classes.
- `src/lib/founder-intelligence-system/tokens.ts` — TypeScript token mirror.
- `src/components/ui/` — canonical primitives (Button, Eyebrow, …).
- `public/fonts/` — self-hosted Inter / Sora / Space Grotesk.
- `public/assets/logos/` and `public/assets/trusted-by/` — brand assets.

When you change a token, update **all** locations in the same change so
they stay in sync.

---

## 1. Design intent

AudioJones.com is a premium personal-brand and AI-systems company site.
It should feel like a **systems platform**, not a consultant portfolio.

The design language is:

```
Apple × Linear × Palantir × Stripe
Premium · minimal · intelligent · dark-first · cinematic · gridded
```

Avoid:

- Generic AI-agency templates
- Crypto/Web3 neon chaos
- Playful startup UI
- Glassmorphism without purpose
- Pixelated/game-like controls in production surfaces

---

## 2. Brand position

**Audio Jones (AJ Digital LLC)** — Founder Intelligence Systems Partner
for founder-led businesses ($250K–$5M revenue range).

### Core phrase

> Signal over noise.

### Category direction

> AI agent systems for founder-led businesses.

### Narrative

Audio Jones builds AI-powered business systems that recover missed
revenue, automate follow-up, diagnose operational gaps, and turn founder
expertise into scalable infrastructure.

### Product language — use

- Agent Systems
- Revenue Recovery Infrastructure
- Founder Intelligence Systems
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

## 3. Site architecture

Authoritative source for routes and nav:
[`MARKETING-IA.md`](./archive/MARKETING-IA.md) and `src/config/nav.ts`.

### Primary nav

```
Home · Agents · Services · Case Studies · Insights · ROI Calculator · Workshops
```

### Right-side CTAs

```
AI Readiness Diagnostic · Book a Call
```

### Surface tiers

- **Founder Intelligence System surface** (canonical): homepage, `/agents`,
  `/founder-intelligence-system`, `/ai-readiness-diagnostic`, `/services`,
  `/insights`, `/roi-calculator`, `/workshops`, `/case-studies`,
  `/book-a-call`. New work targets this surface.
- **Legacy marketing surface**: `/blog`, older `/services` variants,
  `/portal/*`. Still live but de-listed; do not deepen.

---

## 4. Color tokens

| Token              | Value                  | Use                                                                 |
| ------------------ | ---------------------- | ------------------------------------------------------------------- |
| `--aj-orange`      | `#FF4500`              | Primary accent — emphasis only, never a fill background. One signal moment per section. |
| `--aj-orange-soft` | `#FF6A30`              | Hover / secondary orange.                                           |
| `--aj-blue`        | `#0088CC`              | Secondary system blue (legacy + deep system layer).                 |
| `--aj-blue-bright` | `#3B5BFF`              | Primary CTA, active step, focus ring, "system layer" callouts.      |
| `--aj-gold`        | `#C8A96A`              | Eyebrows, metric labels, process numerals. Never body text or fills.|
| `--bg-0`           | `#05070F`              | Page background (dark).                                             |
| `--bg-1`           | `#0B0F1A`              | Alt section background.                                             |
| `--bg-2`           | `#0B1020`              | Card surface.                                                       |
| `--bg-3`           | `#101827`              | Elevated card / table head.                                         |
| `--bg-4`           | `#1A2234`              | Hover surface.                                                      |
| `--paper`          | `#F8FAFC`              | Light split — opt-in clarity layer.                                 |
| `--surface`        | `#F5F5F5`              | Light section subtle.                                               |
| `--surface-soft`   | `#EEF2F6`              | Light card.                                                         |
| `--ink`            | `#111111`              | Headlines / body on light.                                          |
| `--ink-muted`      | `#4B5563`              | Muted on light.                                                     |
| `--border-light`   | `rgba(17,17,17,0.10)`  | Card hairline on light.                                             |
| `--fg-0`           | `#FFFFFF`              | Headlines on dark.                                                  |
| `--fg-1`           | `#E5E7EB`              | Body on dark.                                                       |

### Usage rules

- Dark is primary. Light surfaces are an opt-in *clarity layer*
  (system diagrams, comparison panels, results pages).
- `--aj-orange` is a signal, not a fill. Use it for the single most
  important moment in a section — never as a button background.
- `--aj-gold` is a ledger marking. Eyebrows, step numerals, metric
  labels only.
- `--aj-blue-bright` is the CTA / active-state color.

---

## 5. Typography

Self-hosted, three families:

| Family            | Role                                           |
| ----------------- | ---------------------------------------------- |
| **Sora**          | Display / hero / page titles.                  |
| **Inter**         | UI, body, navigation.                          |
| **Space Grotesk** | Numerals, metric callouts, monospace-ish data. |

Semantic classes live in `src/app/globals.css` (`.h-display`, `.h-1`,
`.h-2`, `.eyebrow`, `.metric`, etc.). Reach for those before
hand-rolling Tailwind type stacks.

---

## 6. Layout & motion

- **Grid:** 12-column, gridded, asymmetrical-but-structured. Generous
  vertical whitespace.
- **Density:** prefer fewer, sharper sections over dense walls of copy.
- **Motion:** subtle. Reveal on scroll, easing on hover. Never
  ornamental animation.
- **Imagery:** cinematic, high-contrast, signal-rich. Avoid stock AI
  illustrations.

---

## 7. Components

Canonical primitives live under `src/components/ui/`. Compose pages from
those, not from raw Tailwind. When a new primitive is needed, add it
there and register tokens in all four sync locations (CSS, TS tokens,
brand folder, this doc).

---

## 8. Voice & copy

- Direct, founder-led, technical.
- Show the system, then the result. Don't open with hype.
- Numbers > adjectives. "Recovered $X" beats "boosts revenue".
- One CTA per section. Lead with the diagnostic or the call.

See [`MARKETING-IA.md`](./archive/MARKETING-IA.md) for the funnel and module
map this voice serves.

---

## 9. Sync rule

A token, color, or font change is not done until it lands in:

1. `src/app/globals.css`
2. `src/lib/founder-intelligence-system/tokens.ts`
3. The brand-folder design system
4. This document

Drift between these is the most common visual bug source. Treat them as
one artifact.
