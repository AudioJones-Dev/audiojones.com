---
title: "Audio Jones Design Principles"
version: "1.0.0"
parent: "docs/design/DESIGN.md"
last_updated: "2026-05-06"
---

# Audio Jones Design Principles

The decision framework. When the spec is ambiguous, return here.

## 1. Signal over noise

Every pixel earns its place. If a visual element doesn't carry a signal — strategic action, hierarchy, semantic state, editorial weight — it's noise. Decoration is a tax on attention.

Practical: when adding a UI element, ask "what does this clarify?" If the answer is "it looks nice," cut it.

## 2. Hierarchy through type, border, spacing, contrast, and rhythm

Not gradients. Not glows. Not shadows. Not bouncing animations.

Hierarchy comes from typographic scale, deliberate spacing, border weight, surface contrast, and the rhythm of section padding. These are the structural materials. Visual effects are last-resort accents, not load-bearing tools.

## 3. Color is semantic, not decorative

Orange means **signal emergence / strategic activation / operator action**. Use it when the user MUST notice. Use it sparingly — saturation kills meaning.

Blue means **system / framework / structural support**. Gold means **metric / editorial marker**. Red means **critical / destructive / urgent**, never anything else.

If you need a color and one of the existing roles doesn't fit, the answer is usually "use surface + border instead," not "add a new color."

## 4. Anchored, not floating

Cards have borders + structural mass. Buttons have intentional weight. Avoid glassmorphism for content surfaces; reserve it for chrome (sticky header) or deliberate compositional moments.

Practical: prefer `border + bg-bg-2` over `backdrop-blur + bg-white/5`. Borders carry the meaning.

## 5. Motion implies progression and intelligence unfolding

Motion should reveal information, reinforce hierarchy, imply system flow, support directionality. Snappy ease-out. Restrained entrance sequencing.

Motion should NOT bounce, scale decoratively, run longer than 320ms, or use particle effects. The interface is a serious operator tool, not a children's app.

## 6. Editorial authority + systems precision + cinematic tension

The surface should read like a well-designed broadsheet. Strong headlines. Disciplined typography. Selective accents. Authored, not generated.

When in doubt, reduce. The most cinematic moments are the quietest ones.

## 7. Restraint over trendiness

Don't ship the latest UI trend just because it's the trend. Ask whether it serves the brand thesis (Editorial Intelligence Systems). Most won't.

Specifically avoid: AI purple gradients, playful SaaS aesthetics, confetti, glassmorphism on content cards, neon cyberpunk styling, over-rounded consumer UI.

## 8. Precision over decoration

A perfectly aligned 3-card grid with disciplined spacing reads more premium than the same content with decorative effects. Get the bones right; decoration becomes unnecessary.

## 9. Asymmetry over templates

The site should feel composed, not generated. Hero compositions can be asymmetric. Cards can vary in width by purpose. Don't force every section into the same 3-column template.

The Audio Jones surface earns its weight by feeling **authored**.

## 10. Operational clarity over visual novelty

Clear data display, readable diagnostics, legible scores, unambiguous CTAs — these matter more than novelty. The user is here to make a decision, not to admire a UI.

## 11. Mobile-first conversion discipline

Every conversion-critical surface (calculator, lead form, contact, apply) is authored mobile-first. iOS 44pt touch target. Production-mode tested on real iPhone Safari before declaring shippable. Native HTML controls for critical paths — see `DESIGN.md §17.5`.

## 12. Real-device proof

Playwright Chromium passes ≠ mobile-Safari passes. Playwright WebKit emulation passes ≠ real-iPhone passes. Production mode passes ≠ dev mode passes through a tunnel. Each layer adds proof; none replaces real-device verification for conversion surfaces.

---

When these principles conflict with each other (e.g., principle 1 says "cut decoration" but you need *some* visual interest to avoid feeling sterile), the conflict is the design problem. Resolve it by raising the conflict explicitly — don't silently pick one principle.
