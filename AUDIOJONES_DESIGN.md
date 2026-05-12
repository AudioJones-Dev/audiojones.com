# Audio Jones DESIGN.md

## 0. Design Intent

AudioJones.com is a premium personal-brand and AI systems company website. It should feel like a **systems platform**, not a generic consultant portfolio. The design language combines founder-led authority, AI infrastructure, operational intelligence, and cinematic signal/noise contrast.

The site should communicate:

- **Audio Jones** as the strategist/operator behind the systems.
- **Agents** as deployable business infrastructure.
- **ResponseOS** as the flagship wedge: revenue recovery infrastructure.
- **Services** as the human advisory and implementation layer.
- **Insights, Workshops, ROI Calculator, and AI Readiness Diagnostic** as the acquisition and education engine.

The design should feel like:

```text
Apple × Linear × Palantir × Stripe
Premium, minimal, intelligent, dark-first, systems-oriented, cinematic.
```

Avoid:

- Generic AI agency templates
- Crypto/Web3 neon chaos
- Playful startup UI
- Corporate consulting blandness
- Random glassmorphism without purpose
- Overly pixelated/game-like controls in production surfaces

---

## 1. Brand Positioning

### Core Phrase

```text
Signal over noise.
```

### Category Direction

```text
AI agent systems for founder-led businesses.
```

### Primary Narrative

Audio Jones builds AI-powered business systems that recover missed revenue, automate follow-up, diagnose operational gaps, and turn founder expertise into scalable infrastructure.

### Product Language

Use:

- Agent Systems
- Revenue Recovery Infrastructure
- Applied Intelligence Systems
- AI Readiness Diagnostic
- Business Signal Clarity
- Operating System for Founder-Led Growth
- Control Plane
- Intelligence Layer

Avoid:

- Chatbot
- Bot package
- AI gimmick
- Automation hack
- Prompt engineering service
- Generic AI consultant

---

## 2. Site Architecture Context

### Primary Nav

```text
Home
Agents
Services
Case Studies
Insights
ROI Calculator
Workshops
```

### Right-Side CTAs

```text
AI Readiness Diagnostic
Book a Call
```

### Core Routes

```text
/
/agents
/agents/responseos
/services
/case-studies
/insights
/roi-calculator
/workshops
/ai-readiness-diagnostic
/book-a-call
/about
```

### Future Product Routes

```text
/agents/signalos
/agents/contentos
/agents/podcastos
/agents/clientos
/agents/salesos
/agents/responseos/demo
```

---

## 3. Visual Theme & Atmosphere

The Audio Jones design system is **dark-first, high-contrast, cinematic, and infrastructure-driven**. It should feel like a control room for business signal: minimal surfaces, intentional orange-blue energy, structured grids, sharp typography, and clean product storytelling.

### Key Characteristics

- Near-black navy foundation
- Signal orange as the primary brand accent
- Electric blue as the intelligence/data accent
- Warm amber as secondary creative accent
- Clean white/off-white surfaces for contrast sections
- Premium restraint with selective glow/motion
- Strong editorial typography
- System diagrams, grids, nodes, routing lines, and diagnostic panels
- Components that feel operational, not decorative

### Mood Keywords

```text
Signal
Infrastructure
Precision
Intelligence
Revenue recovery
Founder authority
Diagnostic clarity
Operational leverage
```

---

## 4. Color System

The imported palette inspiration uses bold tech, warm creative, and modern minimal palettes. Audio Jones should merge those into one controlled system with stronger dark-first identity.

### 4.1 Core Audio Jones Palette

| Token | Hex | Role |
|---|---:|---|
| `--aj-bg` | `#05070F` | Primary dark background |
| `--aj-bg-elevated` | `#0B1020` | Elevated dark surface |
| `--aj-surface` | `#101827` | Cards, panels, diagnostics |
| `--aj-surface-2` | `#151F32` | Hovered cards, drawer surfaces |
| `--aj-ink` | `#F8FAFC` | Primary text on dark |
| `--aj-muted` | `#94A3B8` | Secondary text |
| `--aj-border` | `rgba(148, 163, 184, 0.20)` | Borders on dark |
| `--aj-orange` | `#FF4500` | Primary signal accent |
| `--aj-orange-soft` | `#FF6B35` | Hover/accent warmth |
| `--aj-blue` | `#00A4FF` | Intelligence/data accent |
| `--aj-blue-deep` | `#0088CC` | Deeper blue interaction state |
| `--aj-amber` | `#FFC857` | Creative/workshop accent |
| `--aj-success` | `#00CC66` | Valid/positive/system online |
| `--aj-danger` | `#EF4444` | Error/critical state |
| `--aj-white` | `#FFFFFF` | Light text/surfaces |
| `--aj-paper` | `#F5F5F5` | Light section background |
| `--aj-charcoal` | `#262626` | Dark neutral from source palette |

### 4.2 Palette Families

#### Bold Tech

| Color | Hex | Use |
|---|---:|---|
| Signal Orange | `#FF4500` | Main CTA, active state, high-attention moments |
| Intelligence Blue | `#00A4FF` | Links, data, diagrams, secondary CTA |
| Graphite | `#262626` | Neutral surface, typography on light |
| Orange → Blue Gradient | `linear-gradient(135deg, #FF4500 0%, #00A4FF 100%)` | Hero accents, system lines, card borders |
| Orange → Graphite Gradient | `linear-gradient(135deg, #FF4500 0%, #262626 100%)` | Intense product/diagnostic panels |

#### Warm Creative

| Color | Hex | Use |
|---|---:|---|
| Signal Orange | `#FF4500` | Primary brand energy |
| Warm Amber | `#FFC857` | Workshops, creative systems, education layer |
| Deep Navy | `#1E2A3A` | Secondary dark background |
| Orange Wash | `linear-gradient(135deg, #FF4500 0%, #FF9A62 100%)` | Creative accents, light illustration overlays |

#### Modern Minimal

| Color | Hex | Use |
|---|---:|---|
| Signal Orange | `#FF4500` | Primary action accent |
| Paper | `#F5F5F5` | Light sections |
| Deep Blue | `#0088CC` | Links, data, trust accents |
| Minimal Gradient | `linear-gradient(180deg, #F5F5F5 0%, rgba(255, 69, 0, 0.12) 100%)` | Light-to-brand transitions |

### 4.3 Color Ratios

Use colors in this proportion:

```text
70% dark neutral foundation
15% light/off-white contrast surfaces
10% signal orange
4% intelligence blue
1% amber/special accent
```

### 4.4 Gradient Tokens

```css
:root {
  --aj-gradient-signal: linear-gradient(135deg, #ff4500 0%, #ff6b35 45%, #00a4ff 100%);
  --aj-gradient-data: linear-gradient(135deg, rgba(0, 164, 255, 0.18), rgba(255, 69, 0, 0.16));
  --aj-gradient-dark: radial-gradient(circle at top left, rgba(255, 69, 0, 0.22), transparent 32%), radial-gradient(circle at bottom right, rgba(0, 164, 255, 0.18), transparent 30%), #05070f;
  --aj-gradient-card-border: linear-gradient(135deg, rgba(255, 69, 0, 0.85), rgba(0, 164, 255, 0.65));
}
```

---

## 5. Typography

### Font Stack

Use the repo’s existing brand font direction:

| Role | Font | Use |
|---|---|---|
| Primary UI/Body | `Inter` | Body, nav, forms, buttons |
| Display/Brand | `Sora` | H1/H2, product headers, hero statements |
| Technical Accent | `Space Grotesk` | Labels, code-like UI, diagnostic stats |
| Monospace | `JetBrains Mono` or `ui-monospace` | Code blocks, diagnostics, metadata |

### Type Scale

| Role | Size | Line Height | Weight | Tracking | Notes |
|---|---:|---:|---:|---:|---|
| Hero Display | `clamp(3.5rem, 8vw, 7rem)` | `0.92` | `700–800` | `-0.06em` | Big, compressed, cinematic |
| Page H1 | `clamp(3rem, 6vw, 5.5rem)` | `0.98` | `700` | `-0.05em` | Product/route title |
| Section H2 | `clamp(2.25rem, 4vw, 4rem)` | `1.02` | `700` | `-0.04em` | Strong section breaks |
| H3 | `clamp(1.5rem, 2.4vw, 2.25rem)` | `1.08` | `650` | `-0.03em` | Cards/feature groups |
| H4 | `1.125rem` | `1.25` | `700` | `-0.01em` | Card titles |
| Body Large | `1.125rem` | `1.75` | `400–500` | `0` | Hero supporting text |
| Body | `1rem` | `1.7` | `400` | `0` | Standard text |
| Body Small | `0.875rem` | `1.6` | `400–500` | `0` | Supporting copy |
| Label / Eyebrow | `0.75rem` | `1.2` | `700` | `0.12em` | Uppercase system labels |
| Code / Data | `0.8125rem` | `1.6` | `500` | `0` | Monospace diagnostics |

### Typography Rules

- Use large compressed display type for category ownership.
- Keep body copy precise and not overly long.
- Use `Sora` for confident, strategic statements.
- Use `Space Grotesk` for operational/system labels.
- Use monospace sparingly to signal diagnostics, data, and system states.

---

## 6. Layout System

### Containers

```css
:root {
  --aj-container: 1200px;
  --aj-container-wide: 1440px;
  --aj-gutter-mobile: 1rem;
  --aj-gutter-tablet: 1.5rem;
  --aj-gutter-desktop: 2rem;
}
```

### Grid

- Desktop: 12-column grid
- Tablet: 8-column grid
- Mobile: 4-column grid
- Product pages: use alternating 7/5 and 6/6 layouts
- Diagnostic/tool pages: use 5/7 or 4/8 layouts with form/tool surface on the right

### Section Spacing

| Context | Desktop | Tablet | Mobile |
|---|---:|---:|---:|
| Hero | `128px 0 96px` | `96px 0 72px` | `72px 0 56px` |
| Standard Section | `96px 0` | `72px 0` | `56px 0` |
| Dense Section | `64px 0` | `56px 0` | `40px 0` |
| Card Grid Gap | `24px` | `20px` | `16px` |

### Layout Philosophy

- Dark sections should feel like an operating room/control plane.
- Light sections should feel like strategic clarity and proof.
- Use asymmetric layouts for premium editorial feel.
- Use grids, lines, system maps, and node diagrams to explain complexity.
- Avoid clutter; one dominant message per section.

---

## 7. Navigation

### Header Personality

The header should feel like a floating control bar: precise, stable, premium.

### Desktop Nav

- Fixed top header
- Dark translucent surface
- Subtle blur
- Thin border
- Nav gap should be tight enough to support 7 primary items + 2 CTAs
- Collapse to drawer below the breakpoint that prevents overflow

```css
.aj-header {
  position: fixed;
  top: 0;
  z-index: 50;
  width: 100%;
  height: 80px;
  background: rgba(5, 7, 15, 0.78);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
}

.aj-nav-link {
  color: rgba(248, 250, 252, 0.72);
  font-size: 0.8125rem;
  font-weight: 600;
  transition: color 180ms ease, transform 180ms ease;
}

.aj-nav-link:hover,
.aj-nav-link[aria-current='page'] {
  color: #ffffff;
}
```

### Mobile Drawer

- Full-width drawer
- Dark surface
- CTAs stacked full-width
- Close on link tap
- ESC closes
- Body scroll lock must restore on close

---

## 8. Buttons

The button system should use the provided Uiverse inspiration but convert it into Audio Jones branding. Do **not** use global `button` selectors. Prefix classes with `aj-`.

### 8.1 Primary Button — Signal Glow

Use for highest-intent CTAs:

- Book a Call
- Recover Lost Revenue
- Start Diagnostic
- Calculate Lost Revenue

```css
.aj-btn-signal {
  --glow-color: #ff6b35;
  --glow-spread-color: rgba(255, 69, 0, 0.34);
  --enhanced-glow-color: #ffc857;
  --btn-color: #05070f;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.875rem 1.4rem;
  border: 1px solid rgba(255, 107, 53, 0.75);
  border-radius: 999px;
  color: #fff7ed;
  font-family: Inter, system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, rgba(255, 69, 0, 0.95), rgba(255, 107, 53, 0.78));
  box-shadow:
    0 0 0 1px rgba(255, 69, 0, 0.2),
    0 0 24px rgba(255, 69, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.24);
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.24);
  outline: none;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.aj-btn-signal::after {
  pointer-events: none;
  content: '';
  position: absolute;
  inset: 75% 8% -60% 8%;
  z-index: -1;
  background: var(--glow-spread-color);
  filter: blur(24px);
  opacity: 0.55;
  transform: perspective(2rem) rotateX(35deg) scale(1, 0.6);
}

.aj-btn-signal:hover {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(255, 69, 0, 0.34),
    0 0 34px rgba(255, 69, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.aj-btn-signal:active {
  transform: translateY(0);
  box-shadow:
    0 0 0 1px rgba(255, 69, 0, 0.28),
    0 0 18px rgba(255, 69, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.aj-btn-signal:focus-visible {
  outline: 2px solid #00a4ff;
  outline-offset: 3px;
}
```

### 8.2 Secondary Button — Intelligence Outline

Use for diagnostic and product detail CTAs.

```css
.aj-btn-intel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.875rem 1.25rem;
  border: 1px solid rgba(0, 164, 255, 0.52);
  border-radius: 999px;
  color: #dff6ff;
  background: rgba(0, 164, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  font-weight: 700;
  transition: border-color 180ms ease, background 180ms ease, transform 180ms ease;
}

.aj-btn-intel:hover {
  transform: translateY(-1px);
  border-color: rgba(0, 164, 255, 0.9);
  background: rgba(0, 164, 255, 0.14);
}
```

### 8.3 Minimal Skew Button — Editorial CTA

Adapted from the black/white Uiverse button. Use for secondary editorial CTAs on light sections.

```css
.aj-btn-skew {
  position: relative;
  z-index: 1;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.8rem 1.2rem;
  border: 1px solid #262626;
  border-radius: 0.75rem;
  color: #ffffff;
  background: #05070f;
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
  transition: color 220ms ease, border-color 220ms ease;
}

.aj-btn-skew::after {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0 -24%;
  background: #ffffff;
  transform: skewX(-35deg) scaleX(0);
  transform-origin: left;
  transition: transform 300ms ease;
}

.aj-btn-skew:hover {
  color: #05070f;
  border-color: #05070f;
}

.aj-btn-skew:hover::after {
  transform: skewX(-35deg) scaleX(1);
}
```

---

## 9. Cards & Panels

Cards should feel like operational panels: dark surfaces, subtle border, data-like structure, and selective gradient edges.

### 9.1 Signal Card

```css
.aj-card-signal {
  position: relative;
  border-radius: 1.25rem;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255, 69, 0, 0.78), rgba(0, 164, 255, 0.5));
  transition: transform 220ms ease, box-shadow 220ms ease;
}

.aj-card-signal > .aj-card-inner {
  min-height: 100%;
  border-radius: calc(1.25rem - 1px);
  background: linear-gradient(180deg, rgba(16, 24, 39, 0.98), rgba(5, 7, 15, 0.98));
  padding: 1.5rem;
}

.aj-card-signal:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(255, 69, 0, 0.18), 0 18px 60px rgba(0, 0, 0, 0.32);
}
```

### 9.2 Product Card

```css
.aj-product-card {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 1.25rem;
  background:
    radial-gradient(circle at top right, rgba(0, 164, 255, 0.12), transparent 32%),
    rgba(16, 24, 39, 0.86);
  padding: 1.5rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.24);
}
```

### 9.3 Light Proof Card

```css
.aj-proof-card {
  border: 1px solid rgba(38, 38, 38, 0.1);
  border-radius: 1.25rem;
  background: #ffffff;
  color: #101827;
  padding: 1.5rem;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
}
```

---

## 10. Forms, Inputs & Diagnostics

Forms should look like a diagnostic intake system, not a generic contact form.

### 10.1 Text Input

```css
.aj-input-wrap {
  position: relative;
}

.aj-input {
  width: 100%;
  min-height: 48px;
  padding: 0.875rem 1rem;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 0.875rem;
  color: #f8fafc;
  background: rgba(5, 7, 15, 0.64);
  outline: none;
  box-shadow: 0 0 0 rgba(0, 164, 255, 0);
  transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.aj-input::placeholder {
  color: rgba(148, 163, 184, 0.68);
}

.aj-input:focus {
  border-color: rgba(0, 164, 255, 0.82);
  background: rgba(5, 7, 15, 0.88);
  box-shadow: 0 0 0 3px rgba(0, 164, 255, 0.14);
}

.aj-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 700;
}

.aj-helper {
  margin-top: 0.375rem;
  color: #94a3b8;
  font-size: 0.8125rem;
}
```

### 10.2 Form Panel

```css
.aj-form-panel {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at top left, rgba(255, 69, 0, 0.14), transparent 30%),
    rgba(11, 16, 32, 0.88);
  padding: clamp(1.25rem, 3vw, 2rem);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
}

.aj-form-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #f8fafc;
  font-family: Sora, Inter, system-ui, sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
}

.aj-form-title::before {
  content: '';
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 999px;
  background: #ff4500;
  box-shadow: 0 0 0 6px rgba(255, 69, 0, 0.14), 0 0 18px rgba(255, 69, 0, 0.45);
}
```

---

## 11. Checkboxes, Radios & Toggles

Use the pixel/Uiverse inspiration only as a **micro-interaction reference**. Production controls should feel like signal switches, not arcade UI.

### 11.1 Signal Checkbox

```css
.aj-check {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #f8fafc;
  font-size: 0.95rem;
  font-weight: 650;
  cursor: pointer;
  user-select: none;
}

.aj-check input[type='checkbox'] {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  margin: 0;
  border: 1px solid rgba(255, 69, 0, 0.72);
  border-radius: 0.375rem;
  background: rgba(255, 69, 0, 0.14);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.aj-check input[type='checkbox']:checked {
  background: #00cc66;
  border-color: #00cc66;
  box-shadow: 0 0 18px rgba(0, 204, 102, 0.24);
}

.aj-check input[type='checkbox']:checked::after {
  content: '✓';
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: #05070f;
  font-size: 0.875rem;
  font-weight: 900;
}

.aj-check input[type='checkbox']:focus-visible {
  outline: 2px solid #00a4ff;
  outline-offset: 3px;
}
```

### 11.2 Signal Toggle

```css
.aj-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: #f8fafc;
  font-size: 0.95rem;
  font-weight: 650;
}

.aj-toggle input[type='checkbox'] {
  appearance: none;
  position: relative;
  width: 3.25rem;
  height: 1.75rem;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.14);
  cursor: pointer;
  transition: background 180ms ease, border-color 180ms ease;
}

.aj-toggle input[type='checkbox']::before {
  content: '';
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 999px;
  background: #94a3b8;
  transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
}

.aj-toggle input[type='checkbox']:checked {
  border-color: rgba(255, 69, 0, 0.72);
  background: rgba(255, 69, 0, 0.18);
}

.aj-toggle input[type='checkbox']:checked::before {
  transform: translateX(1.45rem);
  background: #ff4500;
  box-shadow: 0 0 18px rgba(255, 69, 0, 0.42);
}
```

### 11.3 Radio Group

```css
.aj-radio-group {
  display: grid;
  gap: 0.75rem;
}

.aj-radio {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #f8fafc;
  cursor: pointer;
}

.aj-radio input[type='radio'] {
  appearance: none;
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid rgba(0, 164, 255, 0.64);
  border-radius: 999px;
  background: rgba(0, 164, 255, 0.1);
}

.aj-radio input[type='radio']::before {
  content: '';
  position: absolute;
  inset: 0.3rem;
  border-radius: 999px;
  background: #00a4ff;
  transform: scale(0);
  transition: transform 150ms ease;
}

.aj-radio input[type='radio']:checked::before {
  transform: scale(1);
}
```

---

## 12. Code Blocks & Technical Surfaces

Code blocks must match the Audio Jones brand. They should feel like diagnostic system output, not default markdown.

### Code Block Style

```css
.aj-code-block,
.prose pre {
  position: relative;
  overflow: auto;
  border: 1px solid rgba(0, 164, 255, 0.18);
  border-radius: 1rem;
  background:
    linear-gradient(180deg, rgba(0, 164, 255, 0.06), rgba(255, 69, 0, 0.04)),
    #05070f;
  color: #e2e8f0;
  padding: 1.25rem;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.28);
}

.aj-code-block code,
.prose pre code {
  font-family: JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  line-height: 1.7;
}

.aj-code-block::before,
.prose pre::before {
  content: 'SIGNAL OUTPUT';
  display: block;
  margin-bottom: 0.75rem;
  color: #00a4ff;
  font-family: Space Grotesk, Inter, system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.aj-inline-code,
.prose :not(pre) > code {
  border: 1px solid rgba(255, 69, 0, 0.2);
  border-radius: 0.375rem;
  background: rgba(255, 69, 0, 0.08);
  color: #ffd7c2;
  padding: 0.15rem 0.35rem;
  font-family: JetBrains Mono, ui-monospace, monospace;
  font-size: 0.86em;
}
```

### Data Panel

```css
.aj-data-panel {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 1rem;
  background:
    linear-gradient(90deg, rgba(255, 69, 0, 0.08), transparent),
    rgba(5, 7, 15, 0.76);
  padding: 1rem;
  font-family: JetBrains Mono, ui-monospace, monospace;
}

.aj-data-label {
  color: #94a3b8;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.aj-data-value {
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 800;
}
```

---

## 13. Patterns & Backgrounds

Use grid patterns as subtle infrastructure language. Keep opacity low.

### 13.1 Dark Signal Grid

```css
.aj-bg-grid-dark {
  --grid-color: rgba(114, 114, 114, 0.18);
  background-color: #05070f;
  background-image:
    linear-gradient(0deg, transparent 24%, var(--grid-color) 25%, var(--grid-color) 26%, transparent 27%, transparent 74%, var(--grid-color) 75%, var(--grid-color) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, var(--grid-color) 25%, var(--grid-color) 26%, transparent 27%, transparent 74%, var(--grid-color) 75%, var(--grid-color) 76%, transparent 77%, transparent);
  background-size: 55px 55px;
}
```

### 13.2 Light Diagnostic Grid

```css
.aj-bg-grid-light {
  --grid-color: rgba(38, 38, 38, 0.08);
  background-color: #f5f5f5;
  background-image:
    linear-gradient(0deg, transparent 24%, var(--grid-color) 25%, var(--grid-color) 26%, transparent 27%, transparent 74%, var(--grid-color) 75%, var(--grid-color) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, var(--grid-color) 25%, var(--grid-color) 26%, transparent 27%, transparent 74%, var(--grid-color) 75%, var(--grid-color) 76%, transparent 77%, transparent);
  background-size: 55px 55px;
}
```

### 13.3 Noise Overlay

```css
.aj-noise-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: screen;
  background-image: url('/assets/noise/noise-soft.png');
}
```

---

## 14. Loaders & System States

Use loaders sparingly. They should look like system processing, not decorative animation.

### Signal Triangle Loader

```css
.aj-loader-triangle {
  width: 3rem;
  height: 3rem;
  animation: aj-triangle-float 4s ease-in-out infinite;
}

.aj-loader-triangle .aj-loader-a {
  fill: #ff4500;
  animation: aj-loader-a 4s ease infinite both;
}

.aj-loader-triangle .aj-loader-b {
  fill: #f7931e;
  animation: aj-loader-b 4s ease infinite both;
}

.aj-loader-triangle .aj-loader-c {
  fill: #00a4ff;
  animation: aj-loader-c 4s ease infinite both;
}

@keyframes aj-loader-a {
  0%, 100% { fill: #ff4500; }
  34% { fill: #f7931e; }
  66% { fill: #00a4ff; }
}

@keyframes aj-loader-b {
  0%, 100% { fill: #f7931e; }
  34% { fill: #00a4ff; }
  66% { fill: #ff4500; }
}

@keyframes aj-loader-c {
  0%, 100% { fill: #00a4ff; }
  34% { fill: #ff4500; }
  66% { fill: #f7931e; }
}

@keyframes aj-triangle-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}
```

---

## 15. Motion System

Motion should communicate system intelligence and state change.

### Motion Rules

- Use subtle movement: `120ms–300ms` for UI interactions.
- Use slower atmospheric motion: `4s–12s` for background elements.
- Avoid excessive bounce.
- Prefer easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Respect `prefers-reduced-motion`.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 16. Page Templates

### 16.1 Home

Purpose: convert brand attention into product/system curiosity.

Sections:

1. Hero: “You don’t have an AI problem. You have a signal problem.”
2. Signal vs Noise model
3. Agent Systems overview
4. ResponseOS wedge block
5. ROI Calculator lead magnet
6. Services support layer
7. Case studies/proof
8. Insights/authority
9. Workshops
10. Final CTA

### 16.2 Agents Index

Purpose: product ecosystem page.

Sections:

1. Hero: “Agent systems for business execution.”
2. Product grid: Revenue, Intelligence, Authority, Media, Operations, Pipeline
3. Featured ResponseOS block
4. System comparison matrix
5. Diagnostic CTA
6. Related insights

### 16.3 ResponseOS

Purpose: flagship product narrative.

Sections:

1. Hero
2. Missed revenue problem
3. Cost of slow follow-up
4. How ResponseOS works
5. System diagram
6. Features
7. Integrations
8. Industries
9. ROI snapshot
10. Case study blocks
11. Pricing posture
12. FAQ
13. CTA
14. Related systems

### 16.4 ROI Calculator

Purpose: primary lead magnet.

Design:

- Tool surface should feel like an executive diagnostic.
- Use dark form panel + live output panel.
- Results should route to ResponseOS and AI Readiness Diagnostic.

### 16.5 AI Readiness Diagnostic

Purpose: qualify and segment leads.

Design:

- Multi-step intake
- Progress indicator
- Diagnostic scoring
- Final readiness tier
- CTA to Book a Call or ResponseOS where applicable

---

## 17. Component Content Language

### CTAs

Use:

```text
Book a Call
Calculate Lost Revenue
Start the Diagnostic
See Agent Systems
Explore ResponseOS
Recover Missed Revenue
Build the System
```

Avoid:

```text
Learn More
Submit
Get Started
Contact Us
```

### Labels

Use:

```text
SYSTEM STATUS
REVENUE LEAK
SIGNAL SCORE
FOLLOW-UP GAP
AGENT LAYER
RECOVERY PATH
```

---

## 18. Accessibility

- Touch targets must be at least `44px × 44px`.
- Primary text contrast must pass WCAG AA.
- Do not rely on color alone for error/success states.
- Focus states must be visible, especially on dark backgrounds.
- Forms must use semantic labels.
- Nav drawer must trap/restore focus if implemented as modal.
- Respect reduced motion.

---

## 19. Responsive Rules

### Breakpoints

| Name | Width | Behavior |
|---|---:|---|
| Mobile | `320–767px` | Drawer nav, single-column layout, full-width CTAs |
| Tablet | `768–1023px` | Drawer nav if header overflow risk exists, two-column content where safe |
| Desktop | `1024–1279px` | Desktop nav only if no overflow; otherwise keep drawer until larger |
| Wide | `1280px+` | Full nav, multi-column product grids |

### High-Risk Header Viewports

Check:

```text
1024px
1100px
1180px
1280px
1440px
```

If desktop nav overflows, apply in this order:

```text
1. gap-6 → gap-5
2. AI Readiness Diagnostic size="md" → size="sm"
3. Do not push lg → xl unless 1 and 2 fail
```

---

## 20. Do / Do Not

### Do

- Lead with systems and outcomes.
- Make ResponseOS feel like infrastructure.
- Use orange for action and urgency.
- Use blue for data, intelligence, and routing.
- Use dark cards with subtle grid/noise for AI/system surfaces.
- Use light sections for proof, case studies, and clarity.
- Keep nav labels short and decisive.
- Use bold, ownable page titles.
- Create visual diagrams for workflows and revenue recovery paths.

### Do Not

- Make the site look like a chatbot landing page.
- Overuse neon glow.
- Use global CSS selectors from Uiverse snippets.
- Make controls too pixelated for serious business pages.
- Add visual effects that slow page performance.
- Introduce Firebase.
- Hardcode secrets.
- Add dependencies unnecessarily.
- Dilute the Agents product architecture with generic service language.

---

## 21. Google Stitch AI Prompt Guidance

When generating designs from this file, instruct Google Stitch AI:

```text
Design a premium dark-first website for Audio Jones, a personal brand and AI systems company. The site should feel like a high-end AI infrastructure/control-plane experience for founder-led businesses, not a generic AI agency. Use near-black navy backgrounds, signal orange (#FF4500), intelligence blue (#00A4FF), strong editorial typography, subtle system grids, diagnostic panels, and clean product cards. Prioritize the Agents architecture, with ResponseOS as the flagship revenue recovery infrastructure product. Build layouts with Apple/Linear/Palantir/Stripe-level restraint, strong whitespace, and clear CTAs. Avoid playful startup visuals, crypto aesthetics, and generic chatbot imagery.
```

### Stitch Output Requirements

Ask Stitch for:

- Home page
- Agents index
- ResponseOS product page
- ROI Calculator page
- AI Readiness Diagnostic page
- Services page
- Mobile nav drawer
- Component system: buttons, cards, forms, code blocks, toggles, radios

---

## 22. Implementation Tokens

```css
:root {
  --aj-bg: #05070f;
  --aj-bg-elevated: #0b1020;
  --aj-surface: #101827;
  --aj-surface-2: #151f32;
  --aj-ink: #f8fafc;
  --aj-muted: #94a3b8;
  --aj-border: rgba(148, 163, 184, 0.2);
  --aj-orange: #ff4500;
  --aj-orange-soft: #ff6b35;
  --aj-blue: #00a4ff;
  --aj-blue-deep: #0088cc;
  --aj-amber: #ffc857;
  --aj-success: #00cc66;
  --aj-danger: #ef4444;
  --aj-paper: #f5f5f5;
  --aj-charcoal: #262626;

  --aj-radius-sm: 0.5rem;
  --aj-radius-md: 0.875rem;
  --aj-radius-lg: 1.25rem;
  --aj-radius-xl: 1.5rem;
  --aj-radius-pill: 999px;

  --aj-shadow-card: 0 12px 40px rgba(0, 0, 0, 0.24);
  --aj-shadow-float: 0 24px 80px rgba(0, 0, 0, 0.32);
  --aj-shadow-signal: 0 0 34px rgba(255, 69, 0, 0.28);
}
```

---

## 23. Final Design Rule

Every page should answer one question:

```text
Where is the signal, where is the leak, and what system fixes it?
```

If a design element does not support that answer, remove it.
