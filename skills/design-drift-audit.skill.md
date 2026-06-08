---
name: design-drift-audit
description: Audit a UI change (component, page, section, or PR) for drift from the Audio Jones design system as defined in docs/design/DESIGN.md. Run before declaring UI work done.
---

# Audio Jones — Design Drift Audit Skill

Use this skill to audit any UI change against `docs/design/DESIGN.md`. Run at the end of UI work, before requesting review or merge.

## When to invoke

- Before opening a PR with UI changes
- Before claiming a UI task complete
- When reviewing UI work from another contributor (human or AI)
- When inheriting an unfamiliar UI surface and assessing drift

## Inputs

- The PR / branch / files under audit
- `docs/design/DESIGN.md` (source of truth)
- `src/app/globals.css` (token implementation)
- `src/lib/founder-intelligence/tokens.ts` (TS-side mirror)
- `src/components/ui/` (existing primitives)

## Audit checklist

### 1. Token discipline

- ✅ All colors reference CSS variables (`var(--signal)`, `text-fg-1`, `bg-bg-2`) — NOT raw hex.
- ✅ New tokens (if introduced) appear in **both** `globals.css` (`:root` + `@theme inline`) AND `tokens.ts`.
- ❌ Flag: any inline hex color not in the token system.
- ❌ Flag: token added to one source of truth but not the other.

### 2. Color semantics

- ✅ Orange (`--signal`) appears only on a **single primary CTA per major section** OR on key insight markers. Not decorative.
- ❌ Flag: more than one orange CTA in a single viewport.
- ❌ Flag: orange used for newsletter signup, footer links, or "show more" affordances.
- ❌ Flag: orange in a hover-only state (use system blue for hovers on non-signal actions).
- ❌ Flag: red used for non-critical / non-destructive context.

### 3. Typography

- ✅ Headings use `t-h1` / `t-h2` / `t-h3` / `t-h4` utility classes (Space Grotesk).
- ✅ Body uses Inter (`font-body` or default).
- ✅ Eyebrows use the `<Eyebrow>` component or matching pattern.
- ❌ Flag: arbitrary `text-[Xpx]` overrides where a `t-*` utility exists.
- ❌ Flag: a new font-family imported without a recorded justification.

### 4. Spacing rhythm

- ✅ Section padding uses one of the documented patterns (`py-12`, `py-16 sm:py-24`, `py-24 sm:py-32`).
- ✅ Card padding follows `p-6 sm:p-10` (analytical) or `p-5` (compact).
- ✅ Page gutters: `px-5 sm:px-8`.
- ❌ Flag: arbitrary one-off spacing values.

### 5. Border, radius, shadow

- ✅ Borders use `border-[var(--line-2)]` etc. (semantic line tokens).
- ✅ Radii follow the documented scale (no `rounded-3xl` for cards).
- ✅ At most one shadow token per component.
- ❌ Flag: stacked Tailwind shadow utilities (`shadow-md shadow-2xl`) — they don't match the design language.

### 6. Excessive glassmorphism

- ✅ Glass effect (`backdrop-blur-*` + transparent bg) limited to chrome (sticky header) or deliberate compositional surfaces.
- ❌ Flag: glass cards in content areas. Use solid surfaces with borders instead.

### 7. Generic-AI / consumer-SaaS aesthetic check

- ❌ Flag: AI purple gradients (purple-to-blue, indigo-to-violet, etc.).
- ❌ Flag: rainbow gradients. Confetti. Bouncing illustrations of robots.
- ❌ Flag: over-rounded buttons (`rounded-3xl`+ on standard CTAs).
- ❌ Flag: emoji-as-icon (use real icons from a defined set).

### 8. Navigation / page chrome

- ✅ Nav structure unchanged in non-nav PRs.
- ✅ Wordmark = home (no explicit Home item).
- ✅ Header uses `Header.tsx` rendered NAV array (not `mainNav` config — known dead).
- ❌ Flag: nav restructure bundled with unrelated UI work.

### 9. Component reuse

- ✅ Standard shapes use `<Button>`, `<Card>`, `<Badge>`, `<Eyebrow>`, `<FormField>` from `src/components/ui/`.
- ⚠️ Lead-capture critical paths: native HTML controls (per `DESIGN.md §17.5`). Flag as policy match if the path is critical and the change uses shared primitives — but only flag if it's clearly conversion-critical (multi-step form, primary contact form, calculator). Marketing-page CTAs continue to use shared `<Button>`.

### 10. Mobile checklist

- ✅ Touch target ≥ 44×44px on all interactive controls.
- ✅ No horizontal overflow on iPhone-13 viewport (390px wide).
- ✅ Hero CTA visible above-the-fold on mobile.
- ✅ Stacked layout for narrow widths verified.
- ✅ `inputMode` set on number inputs (`numeric` / `decimal`).

### 11. Accessibility

- ✅ Focus visible via `focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]` (or equivalent).
- ✅ Color is not the only state indicator (errors include text).
- ✅ Heading levels don't skip.
- ✅ Form labels associated with inputs (`<FormField>` covers this).
- ✅ `prefers-reduced-motion` respected for non-essential motion.
- ✅ `<button>` for actions, `<a>` for navigation.

### 12. Component consistency

- ✅ New components match the visual vocabulary of existing siblings (e.g., a new card component should look like existing analytical cards, not invent its own pattern).
- ❌ Flag: novel component shape that ignores established patterns.

## Output format

When auditing, produce a report with three sections:

```
## Drift audit — {PR or path}

### Pass
- Token discipline: ✅
- Color semantics: ✅
- Typography: ✅
- ...

### Flags
- {category}: {specific issue at file:line} — {recommendation}

### Recommendations
- {high-priority recommended fix}
- {lower-priority recommended fix}

### Verdict
- READY / READY-WITH-NITS / NEEDS-REWORK
```

## When to surface vs auto-fix

- **Auto-fix** trivial drift (raw hex → token, missing focus-visible class, wrong padding scale) if scope permits.
- **Surface** anything touching brand semantics (color role, typography hierarchy, navigation structure, component vocabulary) — these need human judgment.
- **Block** if any item in §2 (color semantics) or §10 (mobile checklist) fails — these are non-negotiable.
