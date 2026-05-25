# CI Failure Aggregation Plan

## Goal
Create a single persistent operational inbox for GitHub Actions failures so run failures stop fragmenting into email-only triage. The target is one rolling issue titled **`CI Failure Log — audiojones.com`** that is automatically appended with normalized failure records and can feed Slack/Discord/email digests.

## 1) Current CI workflows found

From `.github/workflows`:

- `ci.yml` (**CI**) — lockfile sync check + typecheck + build on `main` pushes/PRs.
- `build-and-lint.yml` (**Build & Lint**) — lint, typecheck, package builds, `check:no-firebase`, plus legacy grep-based checks on push/PR.
- `deploy.yml` (**Deploy AJ Digital Suite**) — validate + main-branch build + Vercel deploy.
- `smoke-preview.yml` (**Smoke Test (Preview)**) — PR preview smoke checks with explicit skip-vs-fail logic.
- `smoke-prod.yml` (**Smoke Test (Production)**) — scheduled/manual production smoke checks.
- `smoke-test-incident-feed.yml` (**Smoke Test – Incident Feed**) — scheduled/manual incident/public API checks.
- `infrastructure-hardening.yml` (**Infrastructure Hardening - API Route Testing**) — push/PR/scheduled critical route tests + security scan.
- `codex.yml` (**Codex**) — manual workflow dispatch, currently disabled by design.

## 2) Failure events worth aggregating

Aggregate failures that indicate reliability, quality, or deployment risk:

1. **Code gate failures (merge-blocking)**
   - `ci.yml` and `build-and-lint.yml` failures (lockfile drift, lint/type/build, firebase guard).
2. **Release path failures**
   - `deploy.yml` failures in `validate`, `build`, or `deploy` jobs.
3. **Preview validation failures**
   - `smoke-preview.yml` when `outcome=failed` or route checks fail.
   - Explicit **skip** outcomes should be tracked as informational (non-failure) telemetry only.
4. **Production reliability failures**
   - `smoke-prod.yml`, `smoke-test-incident-feed.yml`, `infrastructure-hardening.yml` failures on schedule/manual.
5. **Security signal failures**
   - `infrastructure-hardening.yml` security/audit failures.

Do **not** aggregate intentionally disabled/no-op workflows (e.g., current `codex.yml`) as incidents unless they fail unexpectedly.

## 3) Recommended GitHub Actions approach

### Primary mechanism
Add a dedicated workflow, e.g. `.github/workflows/ci-failure-aggregator.yml`, triggered by:

- `workflow_run` with `types: [completed]` for selected workflows above.

Flow:

1. Receive completed workflow metadata.
2. Exit early unless `conclusion == failure` (and optionally `timed_out`/`cancelled` depending policy).
3. Use GitHub REST API to fetch failed jobs and failed steps for the run ID.
4. Build a compact markdown failure record:
   - Date/time UTC
   - Workflow, job, failed step
   - Branch/ref
   - PR number/link if present
   - Commit SHA (short + full)
   - Run URL
   - Short error summary (first actionable line from logs/annotations)
   - Likely owner heuristic (CODEOWNERS path match or workflow-to-owner map)
   - Status default: `open`
5. Find or create rolling issue `CI Failure Log — audiojones.com`.
6. Append record as a new comment (preferred) or update top-post table.

### Why `workflow_run`
- Captures failures centrally without changing each existing workflow immediately.
- Keeps failure aggregation logic in one place.
- Easier to evolve into digest/reporting pipelines.

### Optional phase 2 hardening
- Add a de-dup key (`workflow + job + step + normalized error + path`) and suppress repeated identical failures inside a window (e.g., 24h).
- Auto-label failures by class (`ci/code-gate`, `ci/deploy`, `ci/smoke`, `ci/security`).

## 4) Required permissions

Aggregator workflow minimum permissions:

```yaml
permissions:
  actions: read
  contents: read
  issues: write
  pull-requests: read
```

Notes:

- `actions: read` to inspect workflow/job/step/run context.
- `issues: write` to create/update issue and add comments.
- No personal access token required; use `GITHUB_TOKEN`.
- No new secrets required for core aggregation.

## 5) Proposed failure-log issue format

Issue title:

- `CI Failure Log — audiojones.com`

Issue body (stable header):

- Purpose and triage rules
- Link to dashboard/search filters
- “How to close entries” convention

Per-failure appended comment template:

```md
## Failure — 2026-05-25T14:37:00Z
- Workflow: CI
- Failed job: build
- Failed step: Build
- Branch: main
- PR: #123
- Commit: abc1234 (full SHA: ...)
- Error summary: Next.js build failed: missing env var XYZ
- Run: https://github.com/<org>/<repo>/actions/runs/<id>
- Likely owner: platform/web
- Status: open
```

Optional footer:

- `Resolution PR:`
- `Resolution commit:`
- `Status: fixed | ignored (reason)`

## 6) Rolling issue vs one issue per failure

**Recommendation: one rolling issue** (`CI Failure Log — audiojones.com`) plus one comment per failure.

Rationale:

- Matches “single inbox/dashboard” objective.
- Preserves timeline and recurring-pattern visibility.
- Reduces issue noise and notification fatigue.
- Enables Codex loop prompt: “Fix latest/highest-frequency open failure in CI Failure Log.”

When to split into dedicated issues:

- Repeated incident exceeds threshold (e.g., 3+ occurrences in 7 days).
- Security-sensitive failure needing owner-specific workflow.

## 7) Optional Slack/Discord/email digest path

Recommended digest layer (phase 2):

1. Trigger on new failure comment (or scheduled daily summary workflow).
2. Aggregate last 24h failures by category and count.
3. Send concise digest to one or more targets:
   - Slack webhook
   - Discord webhook
   - Email summary (notification only)

Digest payload should include:

- total failures
- top recurring signatures
- oldest unresolved failure age
- direct links to run and rolling issue comment anchors

No secrets should be added until channel selection is finalized.

## 8) Risks

1. **Signal noise / duplicate events**
   - A single failed workflow may generate multiple failed jobs; avoid over-posting by grouping run-level failures into one comment.
2. **Log access limitations**
   - Step log extraction can be noisy/truncated; fall back to annotations and failed step name if detailed message unavailable.
3. **Infinite recursion risk**
   - Exclude aggregator workflow itself from monitored workflow list.
4. **False-positive operational failures**
   - Scheduled smoke tests can fail on transient infra; tag these as `ops/transient` until confirmed.
5. **Owner attribution ambiguity**
   - “Likely owner” is heuristic; keep manual override path in triage checklist.

## 9) Exact files to change in next implementation step

Planned files (implementation phase, not changed in this planning step):

1. **New** `.github/workflows/ci-failure-aggregator.yml`
   - `workflow_run` trigger, API fetch logic, issue create/update/comment behavior.
2. **New** `.github/scripts/ci-failure-aggregator.mjs` (or `.ts` if repo convention prefers)
   - Failure extraction, normalization, dedupe key, markdown formatting.
3. **Optional new** `.github/scripts/ci-failure-digest.mjs`
   - Daily/periodic digest generation for Slack/Discord/email.
4. **Optional update** `.github/workflows/*` (selected)
   - Add explicit metadata outputs/annotations if richer summaries are needed.
5. **Docs update** `docs/ops/CI_FAILURE_AGGREGATION_PLAN.md`
   - Mark implementation status and operational runbook links once built.

## smoke_preview behavior note

Current `smoke-preview.yml` explicitly differentiates:

- `ready` → run smoke checks,
- terminal preview failure → fail job,
- preview unavailable/time-window miss → **skip with notice** and `exit 0`.

Aggregator should treat `skipped` outcomes from this workflow as informational telemetry, not a CI incident, to avoid reintroducing false-failure noise.
