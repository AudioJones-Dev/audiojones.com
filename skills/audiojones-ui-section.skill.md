---
name: audiojones-ui-section
description: Build a new UI section / component / page for AudioJones.com that adheres to the Editorial Intelligence Systems design language. Use when adding a new section, page, or significant UI feature.
---

# Audio Jones — UI Section Skill

Use this skill when creating new UI on AudioJones.com. It enforces the Editorial Intelligence Systems language and prevents the most common drift modes.

## Pre-flight (always)

1. **Read `docs/design/DESIGN.md` first.** This is the source of truth — tokens, components, anti-patterns, drift risks.
2. **Read `docs/design/design-principles.md`.** Decision framework for ambiguous cases.
3. **Check existing implementations.** Before designing, look at the most-similar existing surface (`/applied-intelligence`, `/services`, `/insights`, `/blog`, `/apply`). Match their visual rhythm where reasonable.
4. **Identify the conversion criticality of this surface.** Lead-capture critical (form that drives leads) vs. marketing-page critical (hero, content section) vs. supporting. Different rules apply — see §17.5 of DESIGN.md.

## Authoring rules

### Tokens

- Use semantic tokens (`bg-bg-2`, `text-fg-1`, `text-aj-orange`, `border-[var(--line-2)]`).
- No raw hex. If a token doesn't exist for the role you need, **add it** to `globals.css` (`:root` + `@theme inline`) AND `tokens.ts` in the same commit. Never branch token sources.
- Reference type via `t-h1` / `t-h2` / `t-lead` / `t-body` utilities. Don't invent type sizes.

### Color discipline

- ONE primary signal-orange CTA per major section. The action must be the most important next step.
- Secondary actions: `<Button variant="secondary">` (transparent + border) or `variant="ghost"` (text-only).
- Eyebrows: gold (`<Eyebrow tone="gold">`).
- System / framework: `--aj-blue-bright` or `<Button variant="system-glow">`.

### Typography

- Headlines in Space Grotesk via `t-h1` / `t-h2` / `t-h3` / `t-h4`.
- Body in Inter (default font).
- Editorial accents may use Sora (`font-accent`).
- Mono only for code, diagnostics, debug overlays.

### Spacing

- Section: `py-16 sm:py-24` default; `py-12` compact; `py-24 sm:py-32` hero.
- Card padding: `p-6 sm:p-10` (analytical), `p-5` (compact).
- Page gutter: `px-5 sm:px-8`.

### Layout

- `max-w-[1280px]` on top-level wrappers.
- `max-w-3xl` for copy columns.
- Asymmetric compositions encouraged for hero / signature surfaces — don't force everything into 3-column templates.

### Components

For non-critical paths, use shared primitives from `src/components/ui/`:

- `<Button>` / `<ButtonLink>` — variants `primary`, `secondary`, `ghost`, `glow`, `system-glow`.
- `<Card>`, `<Badge>`, `<Eyebrow>`, `<FormField>`, `<Input>`, `<Select>`, `<Checkbox>`, `<Textarea>`.

For **lead-capture critical paths** (multi-step forms, primary contact, calculators, applications):

- Use **native** `<button type="button">` with explicit `onClick={(e) => { e.preventDefault(); e.stopPropagation(); handler(); }}`.
- Use **native** `<select>` + `<option>` with direct `value`/`onChange` props.
- Avoid `<form>` wrappers — use `<div>` + button onClick handlers for state-machine UIs.
- See `DESIGN.md §17.5` for the rationale (real-iPhone-Safari hydration / event-propagation issues with shared abstractions).

### Motion

- Entrance: opacity + translateY-2, `--ease-out`, `--dur-base`.
- State change: opacity / color, `--ease-in-out`, `--dur-fast`.
- Honor `prefers-reduced-motion: reduce`.
- No bounce, no spring, no longer than `--dur-slow` (320ms).

### Accessibility

- Keyboard focus visible (`focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]`).
- iOS 44pt touch target minimum.
- Semantic HTML — `<button>` for actions, `<a>` for navigation.
- `<FormField>` for every input (label + error).
- Color is not the only state indicator.

## Surface tradeoffs before coding

If the spec asks for something that conflicts with DESIGN.md, **surface the conflict before implementing**. Common conflicts:

- "Add a glow gradient hero" → conflicts with anti-patterns. Propose: editorial composition with selective accent.
- "Make every card orange" → conflicts with semantic color rule. Propose: gold eyebrows + signal CTA only.
- "Add a fancy entrance animation" → conflicts with restraint. Propose: directional fade.
- "Use a custom design library" → conflicts with token discipline. Propose: extending the existing token system.

When you raise the conflict, propose a brand-aligned alternative. Don't just refuse.

## Mobile-first authoring loop

1. Author baseline at ≤640px width.
2. Add `sm:` / `md:` / `lg:` refinements for desktop.
3. Verify at iPhone-13 viewport (390×844). No horizontal overflow.
4. Verify primary CTA is above-the-fold on mobile.
5. Verify touch targets ≥ 44×44px.

## Verification checklist before "done"

For non-critical surfaces:

- ✅ Typecheck (`pnpm typecheck`) passes.
- ✅ Lint (`pnpm exec eslint src`) passes (no new warnings).
- ✅ Build (`pnpm build`) passes — route renders, no compile errors.
- ✅ Local dev visual review (Chrome/Edge desktop + Chrome/Safari mobile emulation).
- ✅ Run `skills/design-drift-audit.skill.md` audit.

For lead-capture critical paths, ALL of the above PLUS:

- ✅ **Production-mode local test:** `pnpm build && NEXT_PUBLIC_SITE_URL=https://audiojones.com pnpm start`. Verify the surface works end-to-end.
- ✅ **Real-device iPhone Safari test through Cloudflare tunnel of the production-mode server.** Not dev. Not Playwright. Real device.
- ✅ Hydration verified (calculator advances steps, form submits, etc. — actual interaction working).
- ✅ Error state surfaces (network failure, validation error, etc.) tested on real device.

## Output format when reporting work done

```
## UI section delivered: {name}

### Files changed
- {file:summary}

### Tokens used
- {existing tokens referenced}
- {new tokens added (if any), with both globals.css + tokens.ts entries}

### Drift audit result
- READY / READY-WITH-NITS / NEEDS-REWORK
- {flagged items + resolution}

### Verification results
- typecheck / lint / build: ✅ / ❌
- mobile review (emulation): ✅ / ❌
- production-mode local: ✅ / ❌ / N/A
- real-device iPhone Safari: ✅ / ❌ / N/A

### Risks / follow-ups
- {anything worth flagging}
```

## Anti-patterns to refuse (without explicit override)

- Adding new font dependencies
- Introducing color outside the token system
- Making nav structure changes inside non-nav PRs
- Using shared `<Select>` / `<Button>` in lead-capture critical paths
- Skipping production-mode test on conversion surfaces
- Claiming "fixed" without on-iPhone verification for mobile-Safari-affecting surfaces
- Stacked / decorative shadows
- Bouncing motion
- AI purple gradients
