# Responsive QA harness

Manual-run Playwright suite that screenshots the header / nav at 10 viewport
widths and asserts the layout invariants that matter for the marketing surface.

**This is tooling, not CI.** It does not run on PRs. The failure modes it
catches (nav wrap, CTA overflow, drawer regressions, sticky-header drift) are
visual and need a human to look at the output. CI gating on screenshot diff is
intentionally deferred — that becomes noisy too early in a fast-iterating UI.

## What it checks

For each of `390 / 430 / 768 / 820 / 1024 / 1100 / 1180 / 1280 / 1440 / 1728`:

- **No horizontal page overflow** (`document.documentElement.scrollWidth <= clientWidth`)
- **Sticky header stays fixed** during scroll (header `y` doesn't drift)
- **Header screenshot** captured to `test-results/preview-qa/<width>-header.png`
- **Hero+nav screenshot** captured to `test-results/preview-qa/<width>-home-nav.png`

For desktop widths (≥1024px):

- **Nav single-row guarantee** — every nav `<li>` shares the same `offsetTop`
- **At least one header CTA visible** — text-matched against Diagnostic / Book a Call / Signal

For mobile widths (<1024px):

- **Drawer opens** when the menu button is clicked
- **Body scroll-lock applied** while drawer is open (`document.body.style.overflow === "hidden"`)
- **ESC closes drawer** and restores `document.body.style.overflow === ""`
- **Tapping a link inside the drawer closes it** (navigation intercepted)
- **Drawer screenshot** captured to `test-results/preview-qa/<width>-mobile-drawer-open.png`

## One-time setup

Install the Chromium binary Playwright needs (~150 MB, only happens once):

```bash
pnpm exec playwright install chromium
```

## Running it

### Against a local dev / production build

In one terminal:

```bash
pnpm build && pnpm start
```

In another:

```bash
pnpm qa:responsive
```

### Against a Vercel preview deploy

```bash
PREVIEW_URL=https://audiojones-com-pr-62.vercel.app pnpm qa:responsive
```

If the preview is behind Vercel Deployment Protection, get a bypass token from
your Vercel project settings (Project → Settings → Deployment Protection →
Protection Bypass for Automation) and pass it:

```bash
VERCEL_PROTECTION_BYPASS=<token> \
PREVIEW_URL=https://audiojones-com-pr-62.vercel.app \
pnpm qa:responsive
```

The harness sets `x-vercel-protection-bypass` on every request automatically.

### Against production

```bash
PREVIEW_URL=https://audiojones.com pnpm qa:responsive
```

## Output

Screenshots land in `test-results/preview-qa/` with self-documenting names:

```
test-results/preview-qa/
├── 390-header.png
├── 390-home-nav.png
├── 390-mobile-drawer-open.png
├── 430-header.png
├── 430-home-nav.png
├── 430-mobile-drawer-open.png
├── 768-header.png
├── 768-home-nav.png
├── 768-mobile-drawer-open.png
├── 820-...
├── 1024-header.png
├── 1024-home-nav.png
├── ...
└── 1728-home-nav.png
```

A standard Playwright HTML report also lands in
`test-results/preview-qa-report/`. Open it with:

```bash
pnpm exec playwright show-report test-results/preview-qa-report
```

## When to run it

- **Before merging any nav / header / CTA change** — the danger zone is
  1024–1280px where nav items + CTAs compete for horizontal space
- **Before launching a new IA** — sweep the whole matrix to baseline
- **After adding a long-label nav item or CTA** — e.g. "AI Readiness Diagnostic"
- **As a smoke check on production after a deploy** — same command, point
  `PREVIEW_URL` at audiojones.com

## Why these viewports

| Width | Why it's in the matrix |
|---|---|
| 390 | iPhone 12/13/14/15 baseline |
| 430 | iPhone 14/15 Pro Max |
| 768 | iPad portrait + lots of tablets |
| 820 | iPad Air |
| 1024 | exactly at Tailwind `lg` — this is where the drawer→desktop-nav transition happens |
| 1100, 1180 | the danger zone for nav overflow |
| 1280 | site `max-w-[1280px]` boundary |
| 1440 | most common laptop |
| 1728 | 16" MacBook Pro / large desktop |

## Why not put this in CI

Three reasons:

1. **Screenshot diffs are noisy at this stage.** Tiny font-rendering, scrollbar,
   or browser-update changes cause false failures and train people to ignore
   the suite.
2. **Vercel preview URLs need a bypass token** that's awkward to manage as a
   GitHub Actions secret without adding security surface.
3. **It's a 10-viewport visual sweep that wants human eyes.** The assertions
   catch the binary failures (nav wrap, overflow); the real value is the
   screenshots, and they need a human to review.

If/when this matures into a regression gate, move to:
`@playwright/test --update-snapshots` baseline + opt-in CI job. Not yet.
