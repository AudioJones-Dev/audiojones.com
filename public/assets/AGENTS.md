# AGENTS.md - Public asset collections DOX

## Purpose

- Own organized brand and page asset collections under `public/assets/`.

## Ownership

- Applies to `public/assets/`, including Homepage collections, Audio Jones
  website images, testimonials, backgrounds, icons, logos, and trusted-by
  marks.

## Local Contracts

- Keep asset maps and README files aligned with folder contents.
- Do not rename or remove assets referenced from `src/` without updating the
  consuming code and verifying the affected route.
- Brand assets must preserve Audio Jones identity and the current design-system
  direction.

## Work Guidance

- Use descriptive filenames and folder placement tied to the page or component
  that consumes the asset.
- Keep archive/reference materials distinct from production assets.

## Verification

- Verify image paths after asset moves or renames.
- Run `pnpm build` when asset changes affect imported metadata or static route
  generation.

## Child DOX Index

- No child AGENTS.md files are currently defined under `public/assets/`.
