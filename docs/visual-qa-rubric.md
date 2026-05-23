# Visual QA Rubric — audiojones.com

This rubric is consumed by `scripts/visual-qa/review-screenshots.ts`. It is
the same checklist a human reviewer applies when looking at a captured
screenshot set. AI review, when wired in, must answer against these same
items so the decision shape stays stable.

Every screenshot is graded against the items below. The overall decision
is a single token: **`PASS`**, **`FAIL`**, or **`NEEDS_HUMAN_REVIEW`**.

---

## 1. Brand alignment

- Dark-first surface — `bg-0` / `bg-1` dominate; light sections only where
  intended (`LightProofSection`).
- Signal-yellow (`--signal-yellow`, `#E8FF5A`) is the only accent used as a
  CTA / hover state. No reintroduction of V1 cyan (`#0088cc`) or legacy
  orange as a decorative fill.
- Eyebrows use `--aj-gold` (which maps to signal-yellow per V2 §07), not
  `--aj-amber` (warning) or `--aj-orange`.
- "Premium, minimal, gridded" feel — no decorative gradients on text, no
  unnecessary emoji or icon noise.

## 2. Typography consistency

- Display copy uses `font-accent`.
- Hierarchy follows the `t-h1` / `t-h2` / `t-lead` / `t-body` scale from
  `globals.css`.
- No raw `text-[Npx]` font sizes outside of intentional design tokens.
- Line-height and tracking do not collide between sibling sections.

## 3. CTA visibility

- Primary CTA is reachable above the fold on `/` and `/ai-readiness-diagnostic`.
- Buttons render with the expected `ButtonLink` token (no plain anchor
  styles leaking through).
- Hover state contrast meets WCAG AA against the surface beneath it.

## 4. Header / nav contrast

- Header link labels are white (`text-fg-0`) and semibold against the dark
  surface. No washed-out grey.
- Hover state transitions to `text-signal-yellow`.
- Logo and CTA on the right are not clipped on a 1280-wide capture.

## 5. Layout integrity

- No horizontal overflow on the captured viewport (no body wider than the
  capture width).
- Mobile screenshots (when captured) do not show fixed-width grids
  spilling outside the viewport.
- Section spacing matches the rhythm described in `docs/DESIGN.md` §3.

## 6. Legacy color regressions

- No raw hex literals visible in eyebrows / body copy (`#0088cc`,
  `#4b5563`, etc.) — those should already have been converted to
  `var(--accent-blue)` / `var(--ink-muted)` tokens.
- No `text-aj-orange` on emphasis spans inside body copy.
- SignalConsole uses `--accent-red` for critical, `--accent-blue` for
  system, `--accent-amber` for warning.

## 7. Obstructions

- The Javi chat widget, when present, does not cover the primary CTA on
  any captured route.
- A cookie banner, if rendered (it should not be with `no_cookie_popup=1`),
  does not occlude headlines or CTAs.

## 8. Capture health

- Every requested route produced a non-zero PNG.
- No route returned a blank / error / "Sign in" placeholder screenshot.
- File sizes look consistent across captures of the same route.

---

## Decision rules

| Condition                                                                                                                | Verdict               |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| Every captured route renders cleanly **and** every rubric item passes.                                                   | `PASS`                |
| A capture failed, a layout overflows, a legacy color regressed, a CTA is occluded, or any rubric item is clearly broken. | `FAIL`                |
| Captures are healthy but a rubric item is ambiguous (e.g. a borderline contrast call) or the AI reviewer is not present. | `NEEDS_HUMAN_REVIEW`  |

The harness is **advisory**: a `FAIL` does not block merges yet. It does
block merging when wired up as a required check — see `docs/VISUAL-QA.md`
for the rollout path.
