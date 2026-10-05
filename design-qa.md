# Homepage Quiet Operator Calibration — Design QA

## Scope

- Homepage hero
- Dark signal-problem section
- Light transition into Founder Intelligence
- ResponseOS process relationship
- ROI calculator interruption and glass output card
- Desktop and mobile responsive behavior

Sections after the ROI calculator remain outside this calibration slice.

## Visual source

- Approved mockup: `C:\Users\tyron.AUDIOJONES\.codex\generated_images\019ffd03-0ddc-7c22-9563-baad37395520\exec-7dbf348f-1778-4cf1-8f0f-efd90b879795.png`
- Existing Audio Jones portrait and design tokens were retained as the canonical brand assets.
- A text-free signal-gap flow asset was generated specifically for the measured dark-section slot.

## Viewports reviewed

- Desktop: 1440 × 1100
- Mobile: 390 × 844

The implementation captures are in `C:\Users\tyron.AUDIOJONES\.codex\visualizations\2026\08\13\019ffd03-0ddc-7c22-9563-baad37395520\feedback-final`.

## QA findings and iterations

### P1 — Desktop signal headline overpowered the diagram

The first implementation used a balanced headline treatment that created seven short lines. This made the dark section feel denser than the approved mockup and weakened the diagram.

Resolution: reduced the desktop type scale, widened the usable measure, and removed automatic text balancing. The final headline resolves into four editorial lines at the desktop review viewport.

### P1 — Mobile section-link landing could sit behind the fixed header

Direct hash-state screenshots exposed a risk that the fixed navigation could obscure the section opening.

Resolution: added an 80px scroll margin to both calibration anchors and verified the actual hero link interaction. The eyebrow and full headline remain visible after the click.

### Annotation 1 — Signal diagram lacked context

Resolution: added a three-stage legend—Demand captured, Follow-up gap, and Signal recovered—and rewrote the image alternative text to explain the full relationship.

### Annotation 2 — Decision statement lacked visual impact

Resolution: converted the sentence into a full-width lime decision-rule band. It now creates a deliberate pause before the light Founder Intelligence section.

### Annotation 3 — Founder Intelligence needed a stronger entry cue

Resolution: replaced the quiet eyebrow with a compact black banner and high-contrast lime label.

### Annotation 4 — ResponseOS needed a process infographic

Resolution: replaced the abstract route diagram and repeated cards with a four-stage Capture → Qualify → Route → Recover sequence. Each stage now identifies its role, relationship, and operational outcome.

### Annotation 5 — ROI needed to stop the dark visual flow

Resolution: changed the section to a warm off-white interruption with restrained blue and lime radial light. The left side leads with consequence-focused copy and the right side resolves the inputs into one dominant output.

### Annotation 6 — Blue should remain in the ROI glass card

Resolution: kept blue as the data/preview accent inside a translucent gradient-border card, while lime remains reserved for the action and revenue-at-risk signal.

### Scoped review notes

- The existing global Javi widget remains visible in the lower-right corner. It was not introduced or changed by this slice.
- The portrait differs from the generated mockup because the implementation intentionally uses the repository's canonical Audio Jones portrait instead of inventing a replacement identity asset.
- The Founder Intelligence section remains an opening transition; its deeper content and the homepage sections after ROI are not part of this calibration.
- The $28,224 ROI output is retained from the existing homepage sample and is explicitly labeled as a sample scenario.

## Validation

- `pnpm typecheck` — passed
- `pnpm exec eslint src/components/home/landing/HeroAllSignal.tsx src/components/home/landing/SignalNoiseModel.tsx` — passed
- `pnpm exec eslint src/components/home/landing/SignalNoiseModel.tsx src/components/home/landing/ResponseOSWedge.tsx src/components/home/landing/RoiLeadMagnet.tsx` — passed
- `pnpm check:no-firebase` — passed
- `git diff --check` — passed
- `pnpm build` — passed
- Full-repository `pnpm lint` — completed with 0 errors and 1068 pre-existing warnings outside this slice
- Local production preview — HTTP 200 at `/`, `/agents/responseos`, `/roi-calculator`, and `/ai-readiness-diagnostic`

The production build continued through the repository's existing non-blocking local environment warnings for `NEXT_PUBLIC_SITE_URL`, removed Firebase-backed admin data, and the dynamic `/status` fetch.

## Final result

Passed. No open P0, P1, or P2 visual defects remain in the scoped calibration implementation.
