# AUTOMATED_VALIDATION_REVIEW_LOOP.md — AudioJones.com

**Status:** proposal — plan only, no code shipped.
**Owner:** ops / DX.
**Scope:** PR-level validation, notification, and review handoff. Does
not change product code, deploy logic, or merge rules.
**Related contracts:** [`AGENTS.md`](../../AGENTS.md) §4–§5,
[`CLAUDE.md`](../../CLAUDE.md) "Validation contract",
[`docs/DEPLOYMENT.md`](../DEPLOYMENT.md),
[`docs/SECURITY.md`](../SECURITY.md).

The repo already runs the right checks. What's missing is a single
machine- and human-readable result on the PR that tells the next actor
(Codex, Claude, or a human) what to do, so work doesn't stall waiting
for someone to correlate three or four workflow runs.

---

## 1. Current-state diagnosis

### 1.1 What exists today

| Workflow                            | Triggers                       | Checks                                                                                  | Surfaces result via |
| ----------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------- | ------------------- |
| `.github/workflows/ci.yml`          | PR → main, push → main         | `pnpm install --frozen-lockfile`, `tsc --noEmit`, `pnpm build` (with full env secrets)  | Check run only      |
| `.github/workflows/build-and-lint.yml` | push, pull_request          | `pnpm lint`, `tsc --noEmit`, `pnpm packages:build`, `pnpm check:no-firebase`, inline greps for Firebase Admin / admin-key duplication | Check run only |
| `.github/workflows/deploy.yml`      | PR → main, push → main         | install + `packages:build` + `lint` (validate), then `build` and `vercel deploy --prod` on `main` | Check run + Vercel deployment |
| `.github/workflows/smoke-preview.yml` | PR → main                    | Polls Deployments API up to 5m for a `Preview` env URL, then curls 4 routes (`/`, `/status`, `/portal/billing`, `/api/public/incidents`) | Check run + `::notice` annotation |
| `.github/workflows/smoke-prod.yml`  | `*/30 * * * *`, manual         | curls 5 prod URLs + sitemap                                                              | Check run only      |
| `.github/workflows/smoke-test-incident-feed.yml` | every 6h, manual  | curls incident feed + public API + status page + admin-leak check                       | Check run only      |
| `.github/workflows/infrastructure-hardening.yml` | push/PR → main, daily 06:00 UTC | Production route auth + perf tests, `pnpm audit --prod`                          | Check run only      |
| `.github/workflows/codex.yml`       | manual                          | Disabled (`echo "Codex workflow is disabled"`)                                          | n/a                 |

Local validation contract (from `CLAUDE.md`):

```bash
pnpm typecheck
pnpm lint
pnpm check:no-firebase
pnpm build
```

### 1.2 Where the loop stalls

1. **Three overlapping PR workflows** (`ci.yml`, `build-and-lint.yml`,
   `deploy.yml`-validate) run the same `typecheck` / `lint` / `build`
   commands with subtly different inputs and emit nothing combined.
   Claude or Codex has to click into each run to triage.
2. **No PR-level summary comment.** The polling smoke-preview job
   already classifies outcome as `ready` / `skipped` / `failed` with
   reason, but that classification lives only in a job annotation. A
   reviewer reading the PR conversation sees red/green checks with no
   "what blew up and what should happen next."
3. **No machine-readable validation artifact.** Each workflow logs to
   itself. There is nothing an agent (or n8n in Phase 2) can fetch and
   reason over without parsing log files.
4. **No structured handoff.** Once CI is red there is no convention for
   "Codex should fix this" vs "Claude should review the design choice"
   vs "human approval required" (env var change, dependency bump,
   route rename per `AGENTS.md` §2). Decisions stall in limbo.
5. **Preview smoke is the only check with a recovery story.** The
   others fail and stop. Vercel deployments can lag the PR by minutes;
   the rest of CI doesn't know to retry or re-classify.
6. **No local mirror.** Devs and agents run the four commands by hand
   and produce ad-hoc summaries that don't match what CI later posts.
   Pre-push and CI should agree on the format.
7. **`codex.yml` is a placeholder.** There is no automation path
   already wired for "Codex picks up the next task," so the loop
   currently terminates at "human reads the PR comment."

### 1.3 What is intentionally already-correct and we must not regress

- `smoke-preview.yml`'s polling pattern (30 × 10s) and its three-way
  outcome (`ready` / `skipped` / `failed`) — keep as-is, just expose it.
- `check:no-firebase` is a hard gate per `AGENTS.md` §2.1.
- No deploy / merge automation. The loop must **never** auto-merge,
  auto-deploy past Vercel's own preview, or auto-rotate secrets.
- All secrets stay in Vercel / Doppler / 1Password / GitHub Actions
  Secrets — never in repo, per `AGENTS.md` §2.2.

---

## 2. Recommended automation architecture

**Principle:** automate *notification, classification, and handoff*.
Do not automate destructive or production-affecting actions. The loop
escalates to a human or a named AI actor — it does not bypass them.

```
┌──────────────┐    PR opened/updated    ┌────────────────────────────┐
│ Claude/Codex │ ──────────────────────▶ │  Existing CI workflows     │
│   pushes     │                         │  (ci, build-and-lint,      │
└──────────────┘                         │   smoke-preview, …)        │
                                         └─────────────┬──────────────┘
                                                       │ check_suite: completed
                                                       ▼
                                         ┌────────────────────────────┐
                                         │ validation-summary.yml     │
                                         │  (new, Phase 1)            │
                                         │                            │
                                         │ • Reads conclusions of all │
                                         │   PR check runs via gh API │
                                         │ • Pulls preview URL +      │
                                         │   smoke outcome from       │
                                         │   smoke-preview outputs    │
                                         │ • Writes:                  │
                                         │    - validation-summary    │
                                         │      .json (artifact)      │
                                         │    - sticky PR comment     │
                                         │      (human-readable)      │
                                         │ • Computes next_action     │
                                         └─────────────┬──────────────┘
                                                       │
                              ┌────────────────────────┼────────────────────────┐
                              ▼                        ▼                        ▼
                       codex-fix                 claude-review            human-approval
                  (typecheck/lint/build       (design/copy choice,    (secret, dep change,
                   green path failures)        smoke regressions,      route rename,
                                               funnel-touching diff)   merge to main)
```

### 2.1 Phase 2 (opt-in, behind secrets)

```
              ┌──────────────────────────┐
              │ validation-summary.yml   │
              └─────────────┬────────────┘
                            │ POST validation-summary.json
                            ▼
              ┌──────────────────────────┐         ┌────────────┐
              │ n8n webhook              │ ──────▶ │ Slack #ops │
              │ AUDIOJONES_VALIDATION_   │         │ Email      │
              │ WEBHOOK_URL              │         │ Notion log │
              └──────────────────────────┘         └────────────┘
```

The Phase-1 artifact format is the Phase-2 webhook payload. Once
Phase 1 ships, Phase 2 is "set a secret and uncomment one step."

---

## 3. Minimal baseline implementation plan (Phase 1)

**Cost:** one new workflow, two new local scripts, one doc update.
**Secrets required:** none new. Uses the default `GITHUB_TOKEN`.
**Reversibility:** delete `validation-summary.yml`,
`scripts/validate-local.ts`, and `scripts/render-validation-summary.ts`
to revert.

### 3.1 Deliverables

1. **New workflow:** `.github/workflows/validation-summary.yml`
   - Trigger: `workflow_run` on completion of `ci.yml`,
     `build-and-lint.yml`, `smoke-preview.yml` for PR events
     (`pull_request` only, not `push`).
   - Aggregates conclusions, writes `validation-summary.json` as an
     artifact, posts a sticky PR comment.
   - Computes `next_action` per §6.
2. **New script:** `scripts/validate-local.ts`
   - Runs the four-command contract sequentially, captures stdout/
     stderr per step, writes `validation-summary.json` to repo root
     (gitignored), exits non-zero if any step failed.
   - Same JSON shape as the workflow artifact (single source of truth
     for the payload).
3. **New script:** `scripts/render-validation-summary.ts`
   - Reads `validation-summary.json`, emits the Markdown comment body.
     Used by both the workflow and (optionally) local CLI output.
4. **`package.json` additions** (only two; no other scripts modified):
   - `"validate": "tsx scripts/validate-local.ts"`
   - `"validate:summary": "tsx scripts/render-validation-summary.ts"`
5. **`.gitignore` addition:** `validation-summary.json` (root only).
6. **Doc updates:**
   - This file.
   - One bullet in `docs/CHANGELOG.md` under **Unreleased** →
     **Tooling**.
   - One pointer in `AGENTS.md` §4 ("Before committing" block) to
     `pnpm validate` as the local mirror.

### 3.2 What this plan deliberately does NOT do in Phase 1

- Does not consolidate `ci.yml` + `build-and-lint.yml` + `deploy.yml`.
  They overlap, but rewriting them is a separate change that requires
  re-validating env-secret coverage. Phase 1 only **reads** their
  conclusions.
- Does not change `deploy.yml`. Production deploy stays gated as-is.
- Does not enable `codex.yml`. That stays disabled.
- Does not change branch protection rules.
- Does not require a Vercel API token. The polling smoke already
  works off the GitHub Deployments API.
- Does not introduce a new dependency. Uses `tsx` (already devDep),
  `actions/github-script@v7`, and `actions/upload-artifact@v4`.

### 3.3 Branch / PR plan

- Branch: `chore/validation-summary-loop`.
- PR title: `chore(ops): add PR validation summary + local mirror`.
- PR body must include the §6 sample comment so reviewers know the
  format up front.

---

## 4. Phase 2 implementation plan (Slack / n8n notifications)

Phase 2 only ships after Phase 1 has run on at least 10 PRs without
false positives.

### 4.1 Deliverables

1. **New optional step** in `validation-summary.yml`:
   - Runs only if `secrets.AUDIOJONES_VALIDATION_WEBHOOK_URL` is set.
   - `POST`s `validation-summary.json` as the request body with
     `Content-Type: application/json`.
   - Includes a workflow-generated `X-AJ-Signature` HMAC header
     (HMAC-SHA256 over the body, using
     `secrets.AUDIOJONES_VALIDATION_WEBHOOK_SECRET`) so n8n can
     verify origin.
   - Step `continue-on-error: true` — webhook delivery must never
     block PR feedback.
2. **n8n workflow** (built outside this repo, documented here):
   - Webhook node → HMAC verify (Function node) → Switch on
     `next_action`:
     - `codex-fix` → Slack `#ai-dev` mention `@codex` with summary
       and failed-step logs.
     - `claude-review` → Slack `#ai-dev` mention `@claude` with the
       summary and diff URL.
     - `human-approval` → Slack `#ops` mention the on-call human and
       optionally Resend email.
     - `none` → no notification (success path).
   - Notion node: append row to "PR Validation Log" database with
     PR number, SHA, conclusion, next_action, preview URL, timestamp.
     Matches the weekly workflow-error-audit cadence already in the
     governance model.
3. **Secrets to add (Phase 2 only):**
   - `AUDIOJONES_VALIDATION_WEBHOOK_URL` — n8n webhook endpoint.
   - `AUDIOJONES_VALIDATION_WEBHOOK_SECRET` — HMAC shared secret.
   - These live in GitHub Actions Secrets and the n8n credentials
     store. Never in repo, per `docs/SECURITY.md`.
4. **Slack channels** (one-time setup, not in repo):
   - `#ai-dev` — Codex / Claude handoffs.
   - `#ops` — human-approval handoffs and Phase-2 health alerts.
5. **Doc updates:**
   - Append a §4.x "Operating the loop" section to this file once
     n8n is live, with the actual webhook ID and the on-call rotation
     pointer.

### 4.2 Phase 2 acceptance gate

Phase 2 is allowed to ship when:

- Phase 1 has produced 10+ comments with correct `next_action`
  classification (validated by sampling).
- Webhook delivery has been tested against an n8n staging endpoint
  with a fake PR.
- A documented kill switch exists: removing the secret disables the
  POST step automatically (per `if: secrets.X != ''`).

---

## 5. Exact GitHub Actions / workflow changes

> The blocks below are illustrative — file them verbatim during the
> Codex implementation step; do not paraphrase. Line lengths are kept
> wrappable for review.

### 5.1 New file: `.github/workflows/validation-summary.yml`

```yaml
name: PR Validation Summary

on:
  workflow_run:
    workflows:
      - CI
      - Build & Lint
      - Smoke Test (Preview)
    types: [completed]

permissions:
  contents: read
  pull-requests: write
  actions: read
  checks: read

jobs:
  summarize:
    # Only react to runs that were triggered by a PR event. Push-to-main
    # runs of these same workflows must not post comments.
    if: github.event.workflow_run.event == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - name: Resolve PR number
        id: pr
        uses: actions/github-script@v7
        with:
          script: |
            const run = context.payload.workflow_run;
            const prs = run.pull_requests || [];
            if (prs.length === 0) {
              core.setOutput('pr_number', '');
              core.setOutput('head_sha', run.head_sha);
              return;
            }
            core.setOutput('pr_number', String(prs[0].number));
            core.setOutput('head_sha', run.head_sha);

      - name: Skip when no PR is associated
        if: steps.pr.outputs.pr_number == ''
        run: echo "No PR for run ${{ github.event.workflow_run.id }}; nothing to summarise."

      - name: Build validation summary
        if: steps.pr.outputs.pr_number != ''
        id: summary
        uses: actions/github-script@v7
        env:
          PR_NUMBER: ${{ steps.pr.outputs.pr_number }}
          HEAD_SHA: ${{ steps.pr.outputs.head_sha }}
        with:
          script: |
            const fs = require('fs');
            const prNumber = Number(process.env.PR_NUMBER);
            const headSha = process.env.HEAD_SHA;

            // Aggregate the latest check runs for this SHA across the
            // three PR-relevant workflows. Workflow names are matched
            // against the list under `on.workflow_run.workflows`.
            const watched = new Set(['CI', 'Build & Lint', 'Smoke Test (Preview)']);
            const checks = await github.paginate(
              github.rest.checks.listForRef,
              { ...context.repo, ref: headSha, per_page: 100 },
            );

            const byWorkflow = {};
            for (const c of checks) {
              const wf = c.app && c.app.name === 'GitHub Actions' ? c.name : null;
              if (!wf) continue;
              // Group by the workflow that produced the check
              if (!byWorkflow[c.name]) byWorkflow[c.name] = c;
              else if (new Date(c.completed_at || 0) > new Date(byWorkflow[c.name].completed_at || 0)) {
                byWorkflow[c.name] = c;
              }
            }

            const steps = Object.values(byWorkflow).map((c) => ({
              name: c.name,
              status: c.status,
              conclusion: c.conclusion,
              url: c.html_url,
            }));

            const failed = steps.filter((s) => s.conclusion && s.conclusion !== 'success' && s.conclusion !== 'neutral' && s.conclusion !== 'skipped');
            const skipped = steps.filter((s) => s.conclusion === 'skipped' || s.conclusion === 'neutral');
            const allGreen = failed.length === 0 && steps.length > 0;

            // PR metadata
            const pr = await github.rest.pulls.get({ ...context.repo, pull_number: prNumber });
            const files = await github.paginate(github.rest.pulls.listFiles, {
              ...context.repo, pull_number: prNumber, per_page: 100,
            });

            // Classify next action. Heuristics — see §6.
            const touchesFunnel = files.some((f) =>
              /src\/app\/api\/applied-intelligence\/leads\//.test(f.filename) ||
              /src\/db\/leads\.ts/.test(f.filename) ||
              /src\/app\/api\/webhooks\//.test(f.filename),
            );
            const touchesDeps = files.some((f) => /^package\.json$|^pnpm-lock\.yaml$/.test(f.filename));
            const touchesRoutes = files.some((f) => /^src\/app\/.*\/(page|route)\.tsx?$/.test(f.filename));

            let nextAction = 'none';
            let nextActionReason = 'All checks green; ready for review or merge.';

            if (!allGreen) {
              const failedNames = failed.map((f) => f.name);
              const codeGateFailed = failedNames.some((n) =>
                /CI|Build & Lint/.test(n),
              );
              const smokeFailed = failedNames.some((n) => /Smoke Test/.test(n));
              if (codeGateFailed) {
                nextAction = 'codex-fix';
                nextActionReason = `Code gate failed: ${failedNames.join(', ')}. Codex should reproduce and fix locally before re-pushing.`;
              } else if (smokeFailed && touchesFunnel) {
                nextAction = 'human-approval';
                nextActionReason = 'Smoke regression on a PR that touches lead/funnel code. AGENTS.md §5.4 requires human audit.';
              } else if (smokeFailed) {
                nextAction = 'claude-review';
                nextActionReason = 'Preview smoke failed but code gates passed. Claude should classify env-vs-code per AGENTS.md §5.5.';
              } else {
                nextAction = 'claude-review';
                nextActionReason = 'Non-code check failed; needs classification.';
              }
            } else if (touchesDeps) {
              nextAction = 'human-approval';
              nextActionReason = 'Dependency or lockfile change — AGENTS.md §2.5/§2.6 require human approval.';
            } else if (touchesRoutes) {
              nextAction = 'claude-review';
              nextActionReason = 'Route file touched. Verify no rename without redirect plan per AGENTS.md §2.4.';
            }

            const payload = {
              schema_version: '1',
              repository: `${context.repo.owner}/${context.repo.repo}`,
              pr_number: prNumber,
              pr_url: pr.data.html_url,
              head_sha: headSha,
              head_ref: pr.data.head.ref,
              base_ref: pr.data.base.ref,
              triggering_workflow: context.payload.workflow_run.name,
              triggering_run_id: context.payload.workflow_run.id,
              generated_at: new Date().toISOString(),
              overall_status: allGreen ? 'pass' : 'fail',
              steps,
              failed_steps: failed,
              skipped_steps: skipped,
              changed_files: files.slice(0, 50).map((f) => ({
                path: f.filename, status: f.status, additions: f.additions, deletions: f.deletions,
              })),
              changed_files_truncated: files.length > 50,
              changed_files_total: files.length,
              preview: {
                // Populated by a follow-up step that downloads the
                // smoke-preview artifact if present. See §5.2.
                url: null,
                outcome: null,
              },
              next_action: nextAction,
              next_action_reason: nextActionReason,
            };

            fs.mkdirSync('out', { recursive: true });
            fs.writeFileSync('out/validation-summary.json', JSON.stringify(payload, null, 2));
            core.setOutput('payload_path', 'out/validation-summary.json');
            core.setOutput('next_action', nextAction);
            core.setOutput('overall_status', payload.overall_status);

      - name: Render Markdown comment body
        if: steps.pr.outputs.pr_number != ''
        run: |
          # Reuses the same renderer as the local CLI to guarantee
          # parity between `pnpm validate:summary` and the PR comment.
          # Requires repo to be checked out; do a sparse checkout of
          # only the renderer script.
          mkdir -p .scripts
          curl -sSL \
            -H "Authorization: Bearer ${{ github.token }}" \
            -H "Accept: application/vnd.github.raw" \
            "https://api.github.com/repos/${{ github.repository }}/contents/scripts/render-validation-summary.ts?ref=${{ steps.pr.outputs.head_sha }}" \
            -o .scripts/render-validation-summary.ts
          npx --yes tsx .scripts/render-validation-summary.ts \
            out/validation-summary.json > out/validation-summary.md

      - name: Upload validation summary artifact
        if: steps.pr.outputs.pr_number != ''
        uses: actions/upload-artifact@v4
        with:
          name: validation-summary-${{ steps.pr.outputs.head_sha }}
          path: out/validation-summary.*
          retention-days: 14

      - name: Upsert sticky PR comment
        if: steps.pr.outputs.pr_number != ''
        uses: actions/github-script@v7
        env:
          PR_NUMBER: ${{ steps.pr.outputs.pr_number }}
        with:
          script: |
            const fs = require('fs');
            const body = fs.readFileSync('out/validation-summary.md', 'utf8');
            const marker = '<!-- aj:validation-summary -->';
            const fullBody = `${marker}\n${body}`;
            const prNumber = Number(process.env.PR_NUMBER);
            const existing = await github.paginate(github.rest.issues.listComments, {
              ...context.repo, issue_number: prNumber, per_page: 100,
            });
            const mine = existing.find((c) => c.body && c.body.startsWith(marker));
            if (mine) {
              await github.rest.issues.updateComment({
                ...context.repo, comment_id: mine.id, body: fullBody,
              });
            } else {
              await github.rest.issues.createComment({
                ...context.repo, issue_number: prNumber, body: fullBody,
              });
            }

      # Phase 2 ONLY — kept commented in the Phase 1 PR.
      # - name: Notify n8n (Phase 2)
      #   if: steps.pr.outputs.pr_number != '' && secrets.AUDIOJONES_VALIDATION_WEBHOOK_URL != ''
      #   continue-on-error: true
      #   env:
      #     WEBHOOK_URL: ${{ secrets.AUDIOJONES_VALIDATION_WEBHOOK_URL }}
      #     WEBHOOK_SECRET: ${{ secrets.AUDIOJONES_VALIDATION_WEBHOOK_SECRET }}
      #   run: |
      #     SIG=$(openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" \
      #       -hex out/validation-summary.json | awk '{print $2}')
      #     curl -fsS -X POST "$WEBHOOK_URL" \
      #       -H "Content-Type: application/json" \
      #       -H "X-AJ-Signature: sha256=$SIG" \
      #       --data-binary @out/validation-summary.json
```

### 5.2 Minimal edit to `.github/workflows/smoke-preview.yml`

Two additions, both backwards-compatible:

1. After the existing `Wait for Vercel preview deployment` step that
   already writes `outcome`, `deployment_found`, `attempts_used`,
   `last_state`, `preview_url` to `$GITHUB_OUTPUT`, add a final step
   that writes those values to `out/smoke-preview.json` and uploads
   it as an artifact named `smoke-preview-${{ github.sha }}`. The
   summary workflow reads this artifact (via
   `actions/download-artifact@v4` filtered by workflow_run) to
   populate `payload.preview.url` and `payload.preview.outcome`.
2. No change to the polling logic, route list, or terminal-failure
   handling.

### 5.3 What we do NOT change in Phase 1

- `ci.yml` — untouched. Continues to run on every PR.
- `build-and-lint.yml` — untouched.
- `deploy.yml` — untouched.
- `smoke-prod.yml`, `smoke-test-incident-feed.yml`,
  `infrastructure-hardening.yml` — untouched. They run on schedules
  against production and have nothing to add to PR feedback.
- `codex.yml` — remains disabled.
- Branch protection — untouched. The summary comment is informational,
  not a required check.

---

## 6. Exact local scripts needed

### 6.1 `scripts/validate-local.ts`

Responsibilities:

- Run, in order, capturing stdout and stderr per step:
  1. `pnpm typecheck`
  2. `pnpm lint`
  3. `pnpm check:no-firebase`
  4. `pnpm build` *(skippable via `--no-build` for the inner loop;
     defaults to running)*
- For each step record `{ name, command, started_at, ended_at,
  duration_ms, exit_code, conclusion: 'success'|'failure', log_tail:
  last 50 lines of stderr+stdout }`.
- Compute `overall_status` (`pass` if all `success`, else `fail`).
- Read `git rev-parse HEAD`, `git rev-parse --abbrev-ref HEAD`, and
  `git status --porcelain` for local context.
- Write `validation-summary.json` to the repo root using the same
  schema as §7.
- Exit `0` only when `overall_status === 'pass'`.
- Honor `--json` to print the payload to stdout, `--no-build` to skip
  the build step, `--out <path>` to redirect the artifact.

### 6.2 `scripts/render-validation-summary.ts`

Responsibilities:

- Read `validation-summary.json` (path from argv or
  `./validation-summary.json`).
- Emit the canonical Markdown body shown in §8 to stdout.
- No mutation, no network, no env dependency.
- Pure function over the JSON so it can be unit-tested and reused by
  the workflow without re-implementing the format.

### 6.3 `package.json` script additions

Only these two lines — nothing else in `scripts` may move:

```jsonc
{
  "scripts": {
    // ...existing entries unchanged...
    "validate": "tsx scripts/validate-local.ts",
    "validate:summary": "tsx scripts/render-validation-summary.ts"
  }
}
```

### 6.4 `.gitignore`

Append:

```
# generated by scripts/validate-local.ts
/validation-summary.json
```

---

## 7. Notification payload format

A single schema covers the artifact, the local file, and the Phase-2
webhook body. Version it from day one so future consumers (n8n,
Notion, Slack templates) can degrade gracefully.

```json
{
  "schema_version": "1",
  "repository": "AJDIGITALllc/audiojones.com",
  "pr_number": 142,
  "pr_url": "https://github.com/AJDIGITALllc/audiojones.com/pull/142",
  "head_sha": "abc1234567890abcdef1234567890abcdef1234",
  "head_ref": "feat/lead-form-hardening",
  "base_ref": "main",
  "triggering_workflow": "Smoke Test (Preview)",
  "triggering_run_id": 12345678901,
  "generated_at": "2026-05-24T15:42:11Z",
  "overall_status": "fail",
  "steps": [
    { "name": "CI",                     "status": "completed", "conclusion": "success", "url": "https://github.com/..." },
    { "name": "Build & Lint",           "status": "completed", "conclusion": "success", "url": "https://github.com/..." },
    { "name": "Smoke Test (Preview)",   "status": "completed", "conclusion": "failure", "url": "https://github.com/..." }
  ],
  "failed_steps": [
    { "name": "Smoke Test (Preview)",   "status": "completed", "conclusion": "failure", "url": "https://github.com/..." }
  ],
  "skipped_steps": [],
  "changed_files": [
    { "path": "src/app/api/applied-intelligence/leads/route.ts", "status": "modified", "additions": 12, "deletions": 3 },
    { "path": "src/db/leads.ts",                                  "status": "modified", "additions": 4,  "deletions": 1 }
  ],
  "changed_files_truncated": false,
  "changed_files_total": 2,
  "preview": {
    "url": "https://audiojones-com-git-feat-lead-form-hardening.vercel.app",
    "outcome": "failed"
  },
  "next_action": "human-approval",
  "next_action_reason": "Smoke regression on a PR that touches lead/funnel code. AGENTS.md §5.4 requires human audit."
}
```

### 7.1 Field rules

- `overall_status` is `pass` only if **all** `steps[].conclusion` are
  in `{success, skipped, neutral}`.
- `preview.outcome` mirrors `smoke-preview.yml`'s existing values:
  `ready` / `skipped` / `failed`. `null` when no artifact was
  uploaded.
- `next_action` ∈ `{codex-fix, claude-review, human-approval, none}`.
- `next_action_reason` must always be present and human-readable.
- `changed_files` is capped at 50 entries; `changed_files_truncated`
  signals when the array was clipped.
- `schema_version` is a string. Bump to `"2"` on any breaking change.
- No PII, no secrets, no env values. The payload travels off-repo in
  Phase 2.

---

## 8. Review handoff format (PR comment body)

Single sticky comment per PR, replaced in place on each new run.
Marker: `<!-- aj:validation-summary -->`. Body template:

```markdown
### Validation summary — `feat/lead-form-hardening` @ `abc1234`

**Status:** ❌ fail  •  **Next action:** `human-approval`

> Smoke regression on a PR that touches lead/funnel code.
> AGENTS.md §5.4 requires human audit.

| Check                  | Result   | Link |
| ---------------------- | -------- | ---- |
| CI                     | ✅ pass  | [run](https://github.com/…) |
| Build & Lint           | ✅ pass  | [run](https://github.com/…) |
| Smoke Test (Preview)   | ❌ fail  | [run](https://github.com/…) |

**Preview:** [audiojones-com-git-feat-lead-form-hardening.vercel.app](…)  (outcome: `failed`)

**Changed files (2):**
- `src/app/api/applied-intelligence/leads/route.ts` (+12 / −3)
- `src/db/leads.ts` (+4 / −1)

**Handoff:**
- 👤 **Human** — funnel route changed; verify lead persistence before merge.
- 🤖 Codex — no action.
- 🧠 Claude — no action.

<sub>Generated by `.github/workflows/validation-summary.yml` at 2026-05-24T15:42:11Z. Schema v1. Re-run a check to refresh.</sub>
```

### 8.1 Handoff routing rules (must match §5.1 heuristics)

| Condition                                                                   | next_action      | Who acts                                                |
| --------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------- |
| Any of `CI` / `Build & Lint` failed                                         | `codex-fix`      | Codex reproduces locally with `pnpm validate`, pushes a fix |
| Smoke failed, code gates green, no funnel files touched                     | `claude-review`  | Claude classifies env-vs-code per AGENTS.md §5.5         |
| Smoke failed, code gates green, **funnel** files touched (`leads`, `webhooks`, `db/leads`) | `human-approval` | Human audits before any further automation              |
| All green AND `package.json` or `pnpm-lock.yaml` changed                    | `human-approval` | Human approves dep change (AGENTS.md §2.5/§2.6)          |
| All green AND any `src/app/**/page.tsx` or `src/app/**/route.ts` touched    | `claude-review`  | Claude verifies no route rename without redirect (§2.4) |
| All green, none of the above                                                | `none`           | Ready for normal review                                  |

These rules are intentionally conservative. False positives route to
the safer actor (Claude or human). False negatives (a real bug
classified as `none`) are caught by the normal human review that the
existing process already requires before merge.

---

## 9. Failure handling rules

The loop must never block PR feedback, leak secrets, or auto-resolve
ambiguity. The following are hard rules.

1. **The summary workflow itself must never fail the PR.** It runs on
   `workflow_run`, which is decoupled from the PR's required checks.
   If the summary step errors, the underlying CI checks are still the
   source of truth.
2. **No retry of the underlying CI.** If `CI` or `Build & Lint` fails,
   the summary reports it and stops. Re-running is a human/Codex
   decision. We do not auto-rerun on failure — that would mask real
   flakes.
3. **Smoke preview "skipped" is not a failure.** It already behaves
   correctly in `smoke-preview.yml`; the summary surfaces it as
   `preview.outcome: "skipped"` with `next_action: none` on the smoke
   row, and lets the other rules decide.
4. **Preview URL absence ≠ PR defect.** If the Vercel preview never
   appears within 5m, classify as `preview.outcome: "skipped"` and
   add a footnote in the comment: "Vercel preview not produced; smoke
   not run. Code validation is authoritative."
5. **Comment idempotency.** Use the `<!-- aj:validation-summary -->`
   marker. Update in place. Never create a second summary comment per
   PR.
6. **Truncation, not silence.** If logs exceed 50 lines per failed
   step, truncate with a clear marker (`… (truncated, see run log)`)
   plus the run URL. Never paste an unbounded log into the PR.
7. **Phase 2 webhook failure is silent and ignored.** `continue-on-
   error: true` on the POST step. Webhook outage must not block PR
   comments.
8. **Phase 2 payload must be signed.** No unsigned POSTs. n8n must
   verify `X-AJ-Signature` before acting; reject otherwise.
9. **No automatic merge, no automatic deploy, no automatic revert.**
   `next_action` always escalates to a human or named AI actor. The
   loop is a notifier, not an actor on production state.
10. **Secrets stay redacted.** The script that builds the payload
    must not include env-var values, even from failed-build logs.
    `log_tail` runs through a redactor that strips lines matching
    `(?i)(api_key|secret|token|password|bearer)\s*[:=]`.
11. **Stop conditions.** If a single PR generates more than 10 summary
    runs in 24h (flaky CI loop), the workflow posts a one-line
    "circuit breaker" comment and skips further updates until the PR
    is force-pushed. Prevents notification storms.

---

## 10. Acceptance criteria

Phase 1 is "done" when **all** of the following are observably true on
a PR opened after the change:

1. Within 2 minutes of the last of `CI` / `Build & Lint` /
   `Smoke Test (Preview)` completing, a single sticky comment
   appears on the PR with the §8 format.
2. The comment shows correct ✅/❌ rows for each watched workflow
   linked to the run.
3. `validation-summary.json` is downloadable as an artifact from the
   `PR Validation Summary` workflow run and matches the §7 schema
   exactly.
4. Re-running any underlying workflow updates the **same** comment
   rather than creating a new one.
5. `next_action` matches the §8.1 routing table for at least these
   four hand-crafted test PRs:
   - **A.** Pure docs change (only `docs/**`) — `next_action: none`.
   - **B.** TypeScript error introduced in `src/lib/` — `next_action:
     codex-fix` with `failed_steps` including `CI` or `Build & Lint`.
   - **C.** Modified `src/db/leads.ts` with a deliberate preview
     smoke failure — `next_action: human-approval`.
   - **D.** Bumped a dev dependency (lint or types) with all checks
     green — `next_action: human-approval`.
6. `pnpm validate` locally produces a `validation-summary.json` whose
   `steps[].name` set is a superset of `{typecheck, lint,
   check-no-firebase, build}` and whose schema matches §7 (minus the
   PR-only fields, which are `null` when run locally).
7. `pnpm validate:summary` prints the §8 comment body to stdout
   identical (modulo whitespace) to what the workflow posts.
8. No new secrets configured. `secrets.GITHUB_TOKEN` is sufficient.
9. No regression in any existing workflow: `ci.yml`,
   `build-and-lint.yml`, `smoke-preview.yml`, `deploy.yml`,
   `smoke-prod.yml`, `smoke-test-incident-feed.yml`,
   `infrastructure-hardening.yml` remain byte-identical except for
   the two additive steps documented in §5.2.
10. `pnpm typecheck && pnpm lint && pnpm check:no-firebase && pnpm
    build` continue to pass on the change itself.
11. Documentation merged: this file plus the one-bullet `CHANGELOG`
    entry and the one-pointer `AGENTS.md` update.

Phase 2 acceptance is defined in §4.2.

---

## Actionable Codex Implementation Prompt

> Paste the block below into Codex **after** the plan in this document
> has been approved. Codex must read this file end-to-end before
> beginning, and must not invent variations.

```
You are implementing Phase 1 of docs/ops/AUTOMATED_VALIDATION_REVIEW_LOOP.md
on the audiojones.com repository. Read that document end-to-end before
writing any code. Do not implement Phase 2. Do not modify any workflow,
script, or doc not listed below.

Branch: chore/validation-summary-loop (create from main).
PR title: chore(ops): add PR validation summary + local mirror
Open as DRAFT.

Hard constraints (enforced by AGENTS.md and CLAUDE.md — re-read both first):
- No Firebase. `pnpm check:no-firebase` must remain green.
- No new dependencies. Use only tsx (devDep), actions/github-script@v7,
  actions/upload-artifact@v4, actions/download-artifact@v4.
- No changes to package.json beyond the two added scripts in §6.3.
- No edits to ci.yml, build-and-lint.yml, deploy.yml, smoke-prod.yml,
  smoke-test-incident-feed.yml, infrastructure-hardening.yml, codex.yml.
- The only workflow edited is .github/workflows/smoke-preview.yml, and
  only with the two additive steps from §5.2.
- No secrets added. No Slack/n8n/webhook code in Phase 1.
- No auto-merge, auto-deploy, auto-rerun, or branch-protection change.
- Do not paste secret values or env-var values into any log, comment,
  or artifact. Implement the redactor described in §9.10.

Deliverables (exactly these files):
1. .github/workflows/validation-summary.yml — verbatim from §5.1.
2. .github/workflows/smoke-preview.yml — additive edits per §5.2; the
   existing polling logic stays byte-identical.
3. scripts/validate-local.ts — per §6.1.
4. scripts/render-validation-summary.ts — per §6.2.
5. package.json — add only the two scripts in §6.3.
6. .gitignore — append the entry in §6.4.
7. docs/CHANGELOG.md — one bullet under Unreleased → Tooling describing
   the new validation summary workflow + local mirror.
8. AGENTS.md — one pointer under §4 "Before committing" noting that
   `pnpm validate` runs the same contract locally and produces the
   same artifact CI posts on the PR.

Schema discipline:
- The payload in §7 is canonical. Both scripts/validate-local.ts and
  the workflow must emit exactly that shape (with PR-only fields null
  for local runs). schema_version is "1".

Comment discipline:
- Single sticky comment per PR using the marker <!-- aj:validation-summary -->.
- Template in §8. Routing rules in §8.1. Do not invent new statuses.

Failure handling:
- Implement every rule in §9 (1–11). The circuit breaker in §9.11 is
  required, not optional.

Validation before opening the PR (run locally, paste outputs into the
PR body):
  pnpm install --frozen-lockfile
  pnpm typecheck
  pnpm lint
  pnpm check:no-firebase
  pnpm build
  pnpm validate
  pnpm validate:summary

PR body must include:
- The §8 sample comment body so reviewers can compare.
- A short "What changed / What was intentionally not changed"
  section per AGENTS.md §5.6.
- The four acceptance-test scenarios from §10.5 (A/B/C/D) listed as
  a manual QA checklist for the reviewer to run after merge.

When the implementation is complete and the validation commands all
pass, push the branch and open the DRAFT pull request. Do NOT mark it
ready-for-review. Do NOT merge. Stop there and wait for human review.
```
