# Visual QA Harness

Optional, advisory visual QA for `audiojones.com` PR previews. Captures
PNG screenshots of the canonical marketing routes via the
[Site-Shot](https://site-shot.com) API and writes a markdown review
against `docs/visual-qa-rubric.md`.

Status: **advisory** — does not block merges. Outputs are uploaded as a
GitHub Actions artifact for human review.

---

## What it does

1. `pnpm visual:qa:capture` — calls Site-Shot once per route, saves PNGs
   plus a `manifest.json` under
   `artifacts/visual-qa/<iso-timestamp>/`.
2. `pnpm visual:qa:review` — reads the most recent capture directory and
   writes `review.md` next to the screenshots. If `ANTHROPIC_API_KEY` is
   set, a future revision will run AI review against the rubric; today
   the review is a per-route checklist.
3. `pnpm visual:qa` — runs both steps end to end.

Default routes: `/`, `/agents`, `/agents/responseos`,
`/ai-readiness-diagnostic`, `/services`. Override with
`VISUAL_QA_ROUTES="/a,/b,/c"`.

Capture params are pinned in
[`scripts/visual-qa/capture-site-shot.ts`](../scripts/visual-qa/capture-site-shot.ts):
1280×1280 viewport, full-page up to 8000px, PNG, 2s settle delay, no ads,
no cookie popup.

The `artifacts/visual-qa/` directory is gitignored — screenshots stay
local or on the workflow artifact.

---

## Add `SITE_SHOT_API_KEY`

The key is never committed and never echoed in script output. Add it in
the places that need it:

### Local development

Append the line to `.env.local` (gitignored):

```
SITE_SHOT_API_KEY=<your-site-shot-key>
VISUAL_QA_BASE_URL=https://audiojones.com
```

> `dotenv` loads `.env.local` from the repo root inside both scripts.

### Vercel

Not required. The visual QA harness does not run as part of the Vercel
build and the key must not be exposed to the runtime app.

### GitHub Actions

```bash
gh secret set SITE_SHOT_API_KEY --body "<your-site-shot-key>"
```

The [`.github/workflows/visual-qa.yml`](../.github/workflows/visual-qa.yml)
workflow consumes it as `secrets.SITE_SHOT_API_KEY` and only exposes it
as a step-level env var when invoking the capture script.

---

## Run it

### Locally

```bash
pnpm visual:qa
```

Outputs:

```
artifacts/visual-qa/2026-05-23T18-12-04-921Z/
  home.png
  agents.png
  agents_responseos.png
  ai-readiness-diagnostic.png
  services.png
  manifest.json
  review.md
```

### Against a Vercel preview

```bash
VISUAL_QA_BASE_URL=https://audiojones-com-git-<branch>-<scope>.vercel.app \
  pnpm visual:qa
```

### From GitHub Actions

The workflow is `workflow_dispatch` only — manual trigger:

```bash
gh workflow run "Visual QA (Advisory)" --field base_url="https://audiojones.com"
```

Artifacts land under the workflow run as `visual-qa-<run-id>`.

---

## Why advisory first

- The Site-Shot API costs credits per capture. Treating it as a required
  check on every PR would spend the budget on noise.
- The current `review.md` is a checklist, not an automated verdict. Until
  AI review is wired in, "fail" decisions still need a human.
- Vercel preview URL auto-detection is not implemented yet (see below).

When the rubric scoring is automated and a budget cap is in place, the
workflow can be flipped to `pull_request` and added to the required
checks.

---

## Future path

1. **Preview URL auto-detection** — extend the workflow to look up the
   Vercel preview URL the same way `smoke-preview.yml` does (polls the
   GitHub Deployments API), so `base_url` is not a required input.
2. **AI review** — wire `review-screenshots.ts` to the Anthropic API
   when `ANTHROPIC_API_KEY` is present, send each screenshot with the
   rubric, and emit a structured verdict (`PASS` / `FAIL` /
   `NEEDS_HUMAN_REVIEW`).
3. **PR comment** — post the verdict and a link to the artifact as a
   sticky PR comment.
4. **Required check** — once verdicts are stable and budget-bounded,
   add the workflow to the protected-branch required checks list.

---

## Hard rules

- `SITE_SHOT_API_KEY` is read only by Node scripts and the GitHub
  Actions workflow. It is **never** referenced from `src/` or any
  client-bundled module.
- The harness does not modify the production runtime, does not touch
  the lead-capture (ROI) pipeline, and does not introduce tracking.
- Failures in this harness do not block merges today.
