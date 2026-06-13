# AGENTS.md - Public assets DOX

## Purpose

- Own static public files served by Next.js: images, fonts, manifests, favicons,
  background assets, logos, and public asset maps.

## Ownership

- Applies to `public/`.
- Source components that consume assets are owned by `src/`.

## Local Contracts

- Public assets must not contain secrets, private client data, or unlicensed
  material.
- Preserve filenames and paths used by routes/components unless the task also
  updates every reference and any necessary redirects.
- Brand imagery must stay aligned with `docs/design/DESIGN.md`.

## Work Guidance

- Prefer real image assets for public-facing pages over abstract placeholders.
- Keep README/ASSET_MAP files current when asset organization changes.
- Do not add large duplicate assets without a clear reference or usage path.

## Verification

- Run `pnpm build` when changing assets referenced by imported code or metadata.
- For visual asset changes, smoke-test the affected route when practical.

## Child DOX Index

- [`assets/AGENTS.md`](./assets/AGENTS.md) - brand, homepage, testimonial,
  background, icon, logo, and trusted-by asset collections.
