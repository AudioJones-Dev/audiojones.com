# AGENTS.md - Components DOX

## Purpose

- Own React UI components, shared primitives, page sections, and brand
  implementation.

## Ownership

- Applies to `src/components/`.
- Page routing and API behavior are owned by `src/app/`; design-system source
  of truth is `docs/design/DESIGN.md`.

## Local Contracts

- Shared primitives live in `src/components/ui/`; prefer them before adding new
  one-off controls.
- UI must follow the Audio Jones design system: editorial, precise, restrained,
  and signal over noise.
- Do not redesign pages, route structure, or public copy unless the task
  explicitly asks for it.

## Work Guidance

- Use semantic CSS tokens from `src/app/globals.css` and token mirrors where
  applicable.
- Keep component props typed and focused.
- Avoid decorative gradients, generic SaaS language, and visual effects that
  reduce readability.

## Verification

- Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` for component changes.
- Use browser/screenshot checks for meaningful visual changes when practical.

## Child DOX Index

- No child AGENTS.md files are currently defined under `src/components/`.
