# Homepage Annotation Calibration Spec

## Problem

The first calibration improved the homepage surface rhythm, but annotated review found that several diagrams and transitions still require too much interpretation. The ROI section also blends into the dark page instead of interrupting the scroll.

## Desired outcome

Make the signal, recovery, and revenue relationships understandable at a glance while preserving the approved Quiet Operator direction and Audio Jones design system.

## Success criteria

- The signal diagram identifies its input, gap, and recovered output without relying on body copy.
- The decision rule creates a clear visual bridge from the dark problem section to the light Founder Intelligence section.
- Founder Intelligence has a contrasting recognition banner.
- ResponseOS communicates Capture → Qualify → Route → Recover as a connected process.
- ROI uses a light interruption surface and a blue/lime glass preview card.
- Desktop and mobile layouts remain readable and the existing links continue to work.

## Scope

- `SignalNoiseModel`
- `ResponseOSWedge`
- `RoiLeadMagnet`
- Responsive visual QA and local validation

## Out of scope

- Homepage sections after ROI
- Route changes
- Calculator logic changes
- Javi widget changes
- Commit, push, PR, or deployment

## Constraints

- Preserve `#080808`, `#E8FF5A`, `#4DACFF`, and the warm editorial light surface.
- Do not add dependencies.
- Do not introduce unsupported performance claims.
- Keep the existing diagnostic and calculator destinations.

## Existing assets

- Canonical Audio Jones portrait and typography
- Generated signal-gap flow asset
- Lucide icon library already installed in the repository
- Existing ROI preview values and routes

## Proposed plan

1. Add a three-stage legend and a high-contrast decision-rule band.
2. Add a contrasting Founder Intelligence banner.
3. Replace the abstract ResponseOS SVG with four semantic icon cards.
4. Convert ROI to a light interruption surface and glass calculation card.
5. Validate and compare desktop/mobile renders.

## Risks

- Over-decoration could undermine the Quiet Operator tone.
- Glass effects can reduce contrast if transparency is too high.
- Process cards can become dense on mobile without strict copy limits.

## Open questions

- Final copy and illustration refinements remain subject to the next screenshot review gate.
