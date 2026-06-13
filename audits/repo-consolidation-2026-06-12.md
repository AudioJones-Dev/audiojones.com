# AudioJones.com Repo Consolidation Audit

Generated: 2026-06-12

## Purpose

Aggregate the local and GitHub state for `C:\dev\audiojones-clean` and define
a non-destructive path back to one clean operating branch.

This report is an audit and cleanup plan only. It does not authorize or record
any branch deletion, worktree removal, PR closing, merge, push, force push, file
deletion, production deploy, or secret operation.

## Operating Rules For This Cleanup

- Use `origin/main` as the remote truth, not local `main`.
- Preserve all dirty work before cleanup.
- Treat PRD, AGENTS.md, DOX, and canonical docs as the current contract.
- Do not deepen `/portal/*`, `/api/admin/*`, Firebase, or stale `.specify`
  assumptions.
- Do not delete documentation. Supersede stale docs with redirect/archive notes
  after approval.
- Use `proceed` as the approval gate before irreversible cleanup.

## Evidence Commands

Observed commands:

```bash
git status --short --branch
git remote -v
git worktree list
git branch --all --verbose --no-abbrev
git ls-remote origin refs/heads/main
git rev-parse HEAD
git rev-parse origin/main
git log --oneline --decorate --max-count=12 HEAD..origin/main
gh repo view AudioJones-Dev/audiojones.com --json nameWithOwner,defaultBranchRef,pushedAt,url
gh pr list --repo AudioJones-Dev/audiojones.com --state open --limit 200 --json number,title,headRefName,baseRefName,isDraft,author,updatedAt,createdAt,mergeStateStatus,reviewDecision,url
pnpm check:no-firebase
```

Validation result:

```text
pnpm check:no-firebase
check-no-firebase: clean - no Firebase imports, packages, or env keys found.
```

## Current Local State

Facts:

- Working directory: `C:\dev\audiojones-clean`.
- Current branch: `codex/obsidian-add`.
- Current HEAD: `c93066a`.
- Remote `origin/main`: `a5bbf69`.
- GitHub default branch: `main`.
- GitHub repo: `AudioJones-Dev/audiojones.com`.
- GitHub pushed at: `2026-06-08T18:15:11Z`.
- Current checkout has 24 dirty paths.
- Local `main` is not a reliable cleanup base. It is at `e071706`, while
  `origin/main` is at `a5bbf69`.

Current checkout dirty sample:

```text
 M AGENTS.md
?? .github/AGENTS.md
?? .specify/AGENTS.md
?? apps/AGENTS.md
?? audits/
?? data/AGENTS.md
?? db/AGENTS.md
?? docs/AGENTS.md
?? env/AGENTS.md
?? packages/AGENTS.md
```

Interpretation:

- The active dirty work is a DOX/AGENTS hierarchy plus the audit records.
- This should be preserved as its own cleanup/control PR before destructive
  branch or worktree cleanup.

## Worktree Inventory

| Branch | Head | Dirty paths | Path | Dirty sample |
| --- | --- | ---: | --- | --- |
| `codex/obsidian-add` | `c93066a` | 24 | `C:/dev/audiojones-clean` | `M AGENTS.md`; untracked child `AGENTS.md` files and `audits/` |
| `claude/admiring-banach-4f5900` | `db259cd` | 0 | `C:/dev/audiojones-clean/.claude/worktrees/admiring-banach-4f5900` |  |
| `feat/ai-roi-calculator-redesigned` | `c1f3182` | 0 | `C:/dev/audiojones-clean/.claude/worktrees/ai-roi-calculator-redesigned` |  |
| `claude/brave-khorana-cd6d2d` | `af12185` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/brave-khorana-cd6d2d` | `M docs/DESIGN.md` |
| `feat/visual-qa-harness` | `2a2ec37` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/busy-neumann-1170bb` | `M docs/DESIGN.md` |
| `claude/compassionate-dewdney-bcd579` | `eb41b55` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/compassionate-dewdney-bcd579` | `M docs/DESIGN.md` |
| `claude/cool-allen-61e81e` | `95514cc` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/cool-allen-61e81e` | `M docs/DESIGN.md` |
| `claude/cool-pasteur-c9599e` | `96d6c9e` | 0 | `C:/dev/audiojones-clean/.claude/worktrees/cool-pasteur-c9599e` |  |
| `claude/eager-sutherland-2b72bc` | `92ebf66` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/eager-sutherland-2b72bc` | `M docs/design.md` |
| `claude/inspiring-sammet-97b5f8` | `e40bf7a` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/inspiring-sammet-97b5f8` | `M docs/DESIGN.md` |
| `claude/jovial-mayer-92e0ab` | `e0ddca6` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/jovial-mayer-92e0ab` | `M docs/DESIGN.md` |
| `fix/favicon-signal-mark` | `6c8fbf6` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/mystifying-saha-2ef054` | `D docs/DESIGN.md` |
| `claude/practical-maxwell-3f1b02` | `61c4886` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/practical-maxwell-3f1b02` | `M docs/DESIGN.md` |
| `fix/nav-v2-header-link-contrast` | `f4ab950` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/practical-mcclintock-b8a8ba` | `M docs/DESIGN.md` |
| `claude/quirky-herschel-63c7f0` | `2a6c887` | 0 | `C:/dev/audiojones-clean/.claude/worktrees/quirky-herschel-63c7f0` |  |
| `pr-42-ai-roi-diagnostic` | `51247e1` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/silly-austin-80aeec` | `M next-env.d.ts` |
| `claude/silly-haibt-961892` | `ad9bd19` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/silly-haibt-961892` | `M docs/DESIGN.md` |
| `claude/sweet-raman-8d3af0` | `db259cd` | 8 | `C:/dev/audiojones-clean/.claude/worktrees/sweet-raman-8d3af0` | `.env.example`, blog pages, sitemap, Sanity docs/code |
| `claude/trusting-volhard-2b9b1d` | `2a6c887` | 8 | `C:/dev/audiojones-clean/.claude/worktrees/trusting-volhard-2b9b1d` | `AUDIOJONES_DESIGN.md`, `package.json`, `pnpm-lock.yaml`, `globals.css`, 3D assets |
| `claude/unruffled-visvesvaraya-b29a4e` | `00bd1dc` | 2 | `C:/dev/audiojones-clean/.claude/worktrees/unruffled-visvesvaraya-b29a4e` | untracked `.claude/`, `_workdir/` |
| `claude/upbeat-bouman-ffd2df` | `80cbe3a` | 2 | `C:/dev/audiojones-clean/.claude/worktrees/upbeat-bouman-ffd2df` | `M docs/DESIGN.md`, `M next-env.d.ts` |
| `claude/wonderful-lumiere-2dbf15` | `2a6c887` | 0 | `C:/dev/audiojones-clean/.claude/worktrees/wonderful-lumiere-2dbf15` |  |
| `main` | `e071706` | 1 | `C:/dev/audiojones-clean/.claude/worktrees/zen-khorana-b60e1d` | `M docs/DESIGN.md` |
| `(detached)` | `e071706` | 2 | `C:/Users/tyron.AUDIOJONES/.codex/worktrees/4702/audiojones-clean` | `docs/DESIGN.md`, `FounderGravityReport.tsx` |
| `(detached)` | `e071706` | 2 | `C:/Users/tyron.AUDIOJONES/.codex/worktrees/6ef5/audiojones-clean` | `docs/DESIGN.md`, `FounderGravityReport.tsx` |
| `(detached)` | `e071706` | 2 | `C:/Users/tyron.AUDIOJONES/.codex/worktrees/9ab2/audiojones-clean` | `docs/DESIGN.md`, `FounderGravityReport.tsx` |
| `(detached)` | `e071706` | 2 | `C:/Users/tyron.AUDIOJONES/.codex/worktrees/e540/audiojones-clean` | `docs/DESIGN.md`, `FounderGravityReport.tsx` |
| `(detached)` | `e071706` | 2 | `C:/Users/tyron.AUDIOJONES/.codex/worktrees/fc93/audiojones-clean` | `docs/DESIGN.md`, `FounderGravityReport.tsx` |

Worktree recommendation:

- Preserve current `codex/obsidian-add` dirty work first.
- Treat repeated `docs/DESIGN.md` changes as suspicious until inspected,
  because `docs/DESIGN.md` is now a redirect stub and the canonical design
  file is `docs/design/DESIGN.md`.
- Treat worktrees touching `package.json`, `pnpm-lock.yaml`, `.env.example`,
  lead capture, blog routing, sitemap, and Founder Gravity components as
  preservation candidates until reviewed.
- Only remove clean worktrees after their branches are confirmed merged or
  intentionally abandoned.

## Local Branch Buckets

Merged into `origin/main`:

- `claude/admiring-banach-4f5900`
- `claude/cool-allen-61e81e`
- `claude/cool-pasteur-c9599e`
- `claude/jovial-mayer-92e0ab`
- `claude/practical-mcclintock-b8a8ba`
- `claude/quirky-herschel-63c7f0`
- `claude/silly-austin-80aeec`
- `claude/sweet-raman-8d3af0`
- `claude/trusting-volhard-2b9b1d`
- `claude/wonderful-lumiere-2dbf15`
- `codex/doxframework`
- `codex/obsidian-add`
- `fix/favicon-signal-mark`
- `fix/nav-v2-header-link-contrast`
- `security/dependency-audit-triage`

Unmerged local branches:

- `archive/pr-58-codex-services-phase-1-2026-05-08`
- `chore/aeo-v1-6-phase-0-handoff`
- `chore/diagnostic-cta-unification-2026-05-07`
- `chore/fix-vercel-cli-deploy-invocation-2026-05-06`
- `chore/nav-consolidation-2026-05-07`
- `chore/repair-deploy-automation-2026-05-06`
- `chore/roi-calc-post-shipping-cleanup-2026-05-08`
- `chore/security-overrides-sweep`
- `claude/brave-khorana-cd6d2d`
- `claude/compassionate-dewdney-bcd579`
- `claude/eager-sutherland-2b72bc`
- `claude/hungry-bhaskara-0623a6`
- `claude/infallible-roentgen-88b171`
- `claude/inspiring-sammet-97b5f8`
- `claude/mystifying-saha-2ef054`
- `claude/practical-maxwell-3f1b02`
- `claude/production-readiness-audit-usk5f`
- `claude/silly-haibt-961892`
- `claude/unruffled-visvesvaraya-b29a4e`
- `claude/upbeat-bouman-ffd2df`
- `codex/build-roi-calculator-v1-full-stack-app`
- `codex/dopplerinstall`
- `docs/codex-brief-amendments-2026-05-07`
- `docs/services-rebrand-spec-2026-05-08`
- `docs/services-rebrand-spec-refresh-2026-05-11`
- `docs/strategy-seo-aeo-entity-plan`
- `docs/strategy-validation-corrections`
- `feat/ai-roi-calculator-redesigned`
- `feat/audiojones-design-md-system`
- `feat/homepage-redesign-no-spline-2026-05-12`
- `feat/nav-roi-calculator-2026-05-06`
- `feat/ui-redesign-applied-intelligence-2026-04-30`
- `feat/visual-qa-harness`
- `fix/ci-workflows-pnpm`
- `fix/infrastructure-hardening-workflow`
- `fix/pr33-pre-merge`
- `fix/site-audit-seo-aeo-pass`
- `main`
- `pr-42-ai-roi-diagnostic`
- `pr54-readonly`
- `pr58-readonly`
- `pr59-readonly`
- `wip/full-snapshot-2026-05-12`

Branch recommendation:

- Do not use local `main` for recovery. Recreate or fast-forward it from
  `origin/main` only after preserving the current working tree.
- Merged branches with dirty worktrees still need dirty-state review before
  removal.
- Unmerged branches with no open PR need either a preservation branch, an
  archive note, or explicit abandon approval.

## Open GitHub PR Summary

Facts:

- Open PRs: 56.
- Draft PRs: 20.
- Ready PRs: 36.
- Merge states: 14 clean, 35 dirty, 7 unstable.

Interpretation:

- This is too much concurrent surface area to merge linearly.
- The right strategy is triage, not bulk rebase.
- Dirty and unstable PRs should not be worked before deciding whether they
  still match the current PRD and stack rules.

## Open PR Inventory

| PR | State | Merge | Head | Title | URL |
| --- | --- | --- | --- | --- | --- |
| #160 | draft | CLEAN | `fix/mailerlite-env-naming` | fix(env): align MailerLite naming on MAILERLITE_TOKEN | https://github.com/AudioJones-Dev/audiojones.com/pull/160 |
| #159 | draft | CLEAN | `claude/founder-intelligence-rebrand` | brand: rebrand site to Founder Intelligence Systems | https://github.com/AudioJones-Dev/audiojones.com/pull/159 |
| #158 | ready | UNSTABLE | `chore/security-overrides-sweep` | chore(security): override sweep and Next 16.2.5 dependency audit | https://github.com/AudioJones-Dev/audiojones.com/pull/158 |
| #157 | ready | UNSTABLE | `dependabot/npm_and_yarn/next-16.2.6` | chore(deps): bump next from 16.2.3 to 16.2.6 | https://github.com/AudioJones-Dev/audiojones.com/pull/157 |
| #148 | ready | DIRTY | `claude/adoring-clarke-jnYTC` | fix(javi,roi): harden widget focus/error handling and ROI client validation | https://github.com/AudioJones-Dev/audiojones.com/pull/148 |
| #146 | ready | DIRTY | `claude/audiojones-seo-aeo-strategy-KUCGZ` | docs: SEO/AEO content integration strategy | https://github.com/AudioJones-Dev/audiojones.com/pull/146 |
| #145 | ready | DIRTY | `docs/strategy-seo-aeo-entity-plan` | chore: update strategy branch, funnel, and repo hygiene | https://github.com/AudioJones-Dev/audiojones.com/pull/145 |
| #144 | ready | DIRTY | `docs/strategy-validation-corrections` | docs(strategy): add niche validation corrections from Perplexity audit | https://github.com/AudioJones-Dev/audiojones.com/pull/144 |
| #142 | ready | CLEAN | `codex/generate-high-converting-blog-images` | Add branded visual graphics to Insights articles | https://github.com/AudioJones-Dev/audiojones.com/pull/142 |
| #141 | ready | CLEAN | `codex/design-ci-failure-aggregation-system` | docs: add CI failure aggregation implementation plan | https://github.com/AudioJones-Dev/audiojones.com/pull/141 |
| #140 | ready | CLEAN | `codex/debug-code-base` | Remove runtime Google font fetch from RootLayout to fix Turbopack build errors | https://github.com/AudioJones-Dev/audiojones.com/pull/140 |
| #139 | ready | CLEAN | `codex/add-founder-media-system-to-audiojones.com` | feat: Add Founder Media System PRD and initial service surface | https://github.com/AudioJones-Dev/audiojones.com/pull/139 |
| #138 | ready | CLEAN | `claude/validation-summary-loop-p1-OW2ES` | chore(ops): add PR validation summary and local mirror | https://github.com/AudioJones-Dev/audiojones.com/pull/138 |
| #137 | ready | CLEAN | `claude/validation-notification-loop-Dga3h` | docs(ops): plan automated PR validation and review handoff loop | https://github.com/AudioJones-Dev/audiojones.com/pull/137 |
| #136 | ready | DIRTY | `claude/kind-newton-xcmBe` | docs(design): consolidate to one DESIGN.md, sync to V2 brand tokens | https://github.com/AudioJones-Dev/audiojones.com/pull/136 |
| #135 | ready | CLEAN | `claude/audiojones-project-source-docs-ID9tf` | docs(project): add consolidated project source and changelog | https://github.com/AudioJones-Dev/audiojones.com/pull/135 |
| #134 | ready | DIRTY | `claude/lucid-goldberg-4dht6` | chore(meta): set explicit sizes on apple-touch-icon link | https://github.com/AudioJones-Dev/audiojones.com/pull/134 |
| #133 | ready | DIRTY | `claude/brave-darwin-XciQU` | chore(site): add SVG app icon | https://github.com/AudioJones-Dev/audiojones.com/pull/133 |
| #131 | ready | DIRTY | `claude/inspiring-sammet-97b5f8` | fix(css): remove redundant Google Fonts import breaking dev server | https://github.com/AudioJones-Dev/audiojones.com/pull/131 |
| #130 | ready | CLEAN | `claude/focused-ride-WobvE` | chore(hubspot): add CLI tooling and CRM architecture plan | https://github.com/AudioJones-Dev/audiojones.com/pull/130 |
| #129 | ready | DIRTY | `claude/practical-maxwell-3f1b02` | fix(css): hoist Google Fonts import above tailwindcss in globals.css | https://github.com/AudioJones-Dev/audiojones.com/pull/129 |
| #127 | ready | CLEAN | `feat/visual-qa-harness` | chore(qa): add advisory visual QA screenshot harness | https://github.com/AudioJones-Dev/audiojones.com/pull/127 |
| #124 | ready | DIRTY | `claude/eager-sutherland-2b72bc` | chore(ui): polish V2 production brand inconsistencies | https://github.com/AudioJones-Dev/audiojones.com/pull/124 |
| #123 | ready | DIRTY | `claude/silly-haibt-961892` | chore(ui): align cookie banner with V2 brand system | https://github.com/AudioJones-Dev/audiojones.com/pull/123 |
| #122 | ready | CLEAN | `claude/vigilant-brahmagupta-9Jd3p` | docs: add voice and brand capture guide | https://github.com/AudioJones-Dev/audiojones.com/pull/122 |
| #121 | ready | DIRTY | `claude/audiojones-conversion-strategy-Snswa` | docs(strategy): 2026 conversion strategy | https://github.com/AudioJones-Dev/audiojones.com/pull/121 |
| #114 | ready | DIRTY | `claude/roi-calculator-lead-capture-0i3DW` | feat(roi-calculator): production lead capture and Signal ROI Snapshot delivery | https://github.com/AudioJones-Dev/audiojones.com/pull/114 |
| #106 | ready | CLEAN | `claude/vibrant-glowing-card-JCEVw` | feat(agents): vibrant glowing card for ResponseOS featured callout | https://github.com/AudioJones-Dev/audiojones.com/pull/106 |
| #105 | ready | UNSTABLE | `claude/add-social-card-Oueuf` | feat: add SocialCard component | https://github.com/AudioJones-Dev/audiojones.com/pull/105 |
| #100 | ready | DIRTY | `codex/add-second-blog-about-ai-operational-challenges` | Add static essay and surface it in listings and sitemap | https://github.com/AudioJones-Dev/audiojones.com/pull/100 |
| #98 | ready | UNSTABLE | `claude/update-first-blog-post-ZbhmW` | content(blog): seed first post - Break the Loop | https://github.com/AudioJones-Dev/audiojones.com/pull/98 |
| #97 | draft | DIRTY | `claude/audit-v1-launch-readiness-AoGZR` | security: scrub leaked admin key and hard-block legacy portal/admin | https://github.com/AudioJones-Dev/audiojones.com/pull/97 |
| #96 | ready | DIRTY | `codex/add-blog-post-break-the-loop` | Add local Break the Loop blog post and self-host fonts | https://github.com/AudioJones-Dev/audiojones.com/pull/96 |
| #95 | ready | DIRTY | `claude/production-readiness-audit-usk5f` | Production-readiness and SEO/AEO audit fixes | https://github.com/AudioJones-Dev/audiojones.com/pull/95 |
| #94 | ready | DIRTY | `feat/book-a-call-embed` | feat(book-a-call): embed scheduler via NEXT_PUBLIC_BOOKING_URL | https://github.com/AudioJones-Dev/audiojones.com/pull/94 |
| #85 | draft | DIRTY | `security/remove-hardcoded-admin-api-key` | security: remove hard-coded admin API key from client-exposed code | https://github.com/AudioJones-Dev/audiojones.com/pull/85 |
| #84 | draft | DIRTY | `chore/add-gitleaks-secret-scanning` | chore: add gitleaks secret scanning | https://github.com/AudioJones-Dev/audiojones.com/pull/84 |
| #83 | draft | UNSTABLE | `chore/aeo-v1-6-phase-0-handoff` | docs: add AEO v1.6 phase 0 handoff | https://github.com/AudioJones-Dev/audiojones.com/pull/83 |
| #82 | draft | DIRTY | `claude/fix-mobile-brand-colors-9DNkn` | fix(brand): mobile V1 orange purge and V2 favicon | https://github.com/AudioJones-Dev/audiojones.com/pull/82 |
| #81 | draft | DIRTY | `claude/fix-favicon-reversion-WIEcz` | fix(brand): replace orange favicon set with V2 signal-yellow waveform | https://github.com/AudioJones-Dev/audiojones.com/pull/81 |
| #80 | draft | DIRTY | `claude/update-card-branding-UfUKt` | feat(home): retrofit Signal/Noise and Agent Layer cards to Brand 2.0 | https://github.com/AudioJones-Dev/audiojones.com/pull/80 |
| #79 | draft | DIRTY | `claude/fix-insights-colors-r385q` | fix(insights): swap V1 amber/blue to Brand 2.0 signal yellow | https://github.com/AudioJones-Dev/audiojones.com/pull/79 |
| #77 | draft | DIRTY | `claude/fix-stats-nav-o33xM` | fix(home,nav): stat attribution and remove Workshops from nav | https://github.com/AudioJones-Dev/audiojones.com/pull/77 |
| #75 | draft | DIRTY | `claude/audit-logo-system-rWrdJ` | brand: V2 logo system, signal-yellow favicon, theme-color align | https://github.com/AudioJones-Dev/audiojones.com/pull/75 |
| #74 | draft | DIRTY | `claude/build-case-studies-page-HYlIY` | feat(case-studies): publish first case study and reusable template | https://github.com/AudioJones-Dev/audiojones.com/pull/74 |
| #73 | draft | DIRTY | `claude/fix-hero-orange-colors-X6HD1` | fix(brand): purge V1 orange from hero and component layer | https://github.com/AudioJones-Dev/audiojones.com/pull/73 |
| #72 | draft | DIRTY | `claude/update-accent-color-U70Kb` | feat(brand): swap legacy orange accent for Signal Yellow | https://github.com/AudioJones-Dev/audiojones.com/pull/72 |
| #70 | ready | DIRTY | `codex/add-social-card-update-code` | Add branded social icon card to footer and centralize social links | https://github.com/AudioJones-Dev/audiojones.com/pull/70 |
| #68 | ready | DIRTY | `codex/implement-services-page-rebrand` | feat(services): rebrand services to Applied Intelligence Services | https://github.com/AudioJones-Dev/audiojones.com/pull/68 |
| #66 | draft | DIRTY | `claude/add-growth-models-page-jh1KV` | feat(services): add services growth-models engagement page | https://github.com/AudioJones-Dev/audiojones.com/pull/66 |
| #64 | draft | UNSTABLE | `claude/responsive-qa-harness` | chore(qa): Playwright responsive QA harness | https://github.com/AudioJones-Dev/audiojones.com/pull/64 |
| #63 | ready | DIRTY | `claude/seo-audit-2026-05-10` | seo(audit): robots cleanup, breadcrumb JSON-LD, internal links | https://github.com/AudioJones-Dev/audiojones.com/pull/63 |
| #61 | draft | UNSTABLE | `claude/apply-form-native-controls` | fix(apply): native controls on apply page | https://github.com/AudioJones-Dev/audiojones.com/pull/61 |
| #60 | draft | DIRTY | `claude/review-production-readiness-HXr2H` | chore(prod-readiness): unblock marketing launch | https://github.com/AudioJones-Dev/audiojones.com/pull/60 |
| #41 | draft | DIRTY | `claude/add-workshops-nav-page-5j0cb` | feat(nav,workshops): add Workshops tab and page | https://github.com/AudioJones-Dev/audiojones.com/pull/41 |
| #13 | ready | CLEAN | `codex/add-vercel-environment-validation-script` | Add Vercel environment validation script | https://github.com/AudioJones-Dev/audiojones.com/pull/13 |

## PR Triage Recommendations

### A. Preserve and land first

1. Current DOX/AGENTS work on `codex/obsidian-add`.
   - Reason: defines the cleanup contract and child boundaries.
   - Action: review, validate, commit to a dedicated cleanup PR.

2. `audits/site-audit` outputs.
   - Reason: recent `2026-06-08` evidence with actionable SEO/AEO/CRO fixes.
   - Action: keep as audit record; use it to create implementation issues or
     a fix-roadmap PR.

### B. Clean PRs that can be reviewed without rebase first

Review these before spending time on dirty branches:

- #160 `fix/mailerlite-env-naming` - clean draft, env naming decision.
- #159 `claude/founder-intelligence-rebrand` - clean draft, strategic naming
  decision required before merge.
- #142 `codex/generate-high-converting-blog-images` - clean ready, content and
  asset review.
- #141 `codex/design-ci-failure-aggregation-system` - clean ready, docs/ops
  review.
- #140 `codex/debug-code-base` - clean ready, verify still needed after current
  main.
- #139 `codex/add-founder-media-system-to-audiojones.com` - clean ready, PRD
  and services scope review.
- #138 and #137 validation-loop PRs - clean ready, likely docs/ops
  consolidation candidates.
- #135 `claude/audiojones-project-source-docs-ID9tf` - clean ready, docs
  consolidation candidate.
- #130 `claude/focused-ride-WobvE` - clean ready, HubSpot/CRM docs and tooling
  review.
- #127 `feat/visual-qa-harness` - clean ready, QA utility review.
- #122 `claude/vigilant-brahmagupta-9Jd3p` - clean ready, voice/brand capture
  docs review.
- #106 `claude/vibrant-glowing-card-JCEVw` - clean ready, UI/brand review.
- #13 `codex/add-vercel-environment-validation-script` - old clean PR; likely
  needs supersession review before merge.

### C. Dependency/security cluster

- #158 and #157 both touch dependency/security posture and are unstable.
- Do not merge both blindly.
- Recommended path: decide one dependency lane, rebase it onto `origin/main`,
  run `pnpm typecheck`, `pnpm lint`, `pnpm check:no-firebase`, and
  `pnpm build`.

Security-related PRs needing explicit verification before close or merge:

- #97 legacy portal/admin hard-block.
- #85 hard-coded admin API key removal.
- #84 gitleaks scanning.

Current main already includes security-related merges, but this report does
not prove these PRs are fully superseded. Compare patch-by-patch before close.

### D. Brand/favicon/nav cluster

Likely superseded or overlapping PRs:

- #72, #73, #75, #77, #79, #80, #81, #82.
- #123, #124, #133, #134, #136 may overlap with later design/favicon/nav work.

Recommended path:

- Compare each patch against current `origin/main`.
- Preserve any unique approved asset or copy changes.
- Close superseded PRs only after recording the replacement commit/PR.

### E. Content/blog cluster

PRs #96, #98, #100, #142 and several dirty worktrees touch blog/content.

Current PRD says content is authored in Sanity CMS and rendered through App
Router pages. Any PR that adds static local content should be reviewed against
that Sanity decision before merge.

Recommended path:

- Pick one content architecture.
- If Sanity is canonical, convert valuable copy/assets into Sanity migration or
  seed instructions instead of merging static duplicate surfaces.

### F. Booking/lead-capture/conversion cluster

High-risk PRs:

- #94 booking embed.
- #114 ROI lead capture.
- #148 Javi/ROI hardening.
- #60 production readiness.
- #61 apply native controls.
- #63 SEO audit fixes.
- #95 production-readiness plus SEO/AEO.

Reason:

- These touch conversion paths, forms, lead capture, or route behavior.
- Per AGENTS.md, these require route/schema/env/downstream inspection before
  changing.

Recommended path:

- Start with the current live audit findings.
- Fix `robots.txt`/`book-a-call`, topic 404s, sitemap canonical host, and FAQ
  schema as small PRs.
- Rebase only the PRs that still map cleanly to those fixes.

## Documentation Freshness Findings

Current sources that appear aligned:

- `AGENTS.md`
- `docs/PRD.md`
- `docs/ROADMAP.md`
- `docs/DECISIONS.md`
- `docs/architecture/stack-decision.md`
- `docs/design/DESIGN.md`
- `audits/site-audit/README.md`
- `audits/site-audit/fix-roadmap.md`

Stale or conflict-prone sources:

- `specs/main/*`
- `.specify/specs/*`
- `.specify/plans/*`
- `.specify/tasks/*`

Observed stale themes:

- Firebase as a planned stack dependency.
- Client/admin portal work inside or near the marketing site.
- Whop/MailerLite automation plans tied to old Firebase assumptions.
- `/portal` and `/client` routing assumptions.
- Static content assumptions that may conflict with Sanity CMS.

Recommendation:

- Do not delete these docs.
- Add archive/supersession notes that point to the current PRD, stack decision,
  and AGENTS contract.
- Move any still-valid client/admin portal requirements to a separate app/repo
  spec before implementation.

## Site Audit Findings To Carry Forward

The recent `audits/site-audit` run found:

- `robots.txt` blocks `/book-a-call` because `Disallow: /book` also matches it.
- Five internally linked `/blog/topic/*` URLs return 404.
- Sitemap/canonical host behavior does not match final
  `https://www.audiojones.com` destination.
- FAQ/direct-answer and FAQPage JSON-LD coverage is uneven.
- Several conversion pages need tighter first-screen ICP, problem, outcome, and
  CTA framing.

Recommended first implementation PRs after cleanup:

1. Fix `robots.txt` for `/book-a-call`.
2. Repair or remove `/blog/topic/*` links.
3. Align sitemap and canonical host behavior.
4. Add compact FAQ/direct-answer blocks to diagnostic, services, pricing,
   workshops, and agent pages.
5. Tighten `/apply` and `/roi-calculator` title/meta intent.

## Recommended Cleanup Plan

### Phase 0: Freeze and preserve

- No delete/close/merge/push until the current DOX audit work is committed.
- Create or use a branch based on `origin/main` for cleanup documentation.
- Preserve dirty worktrees with one of:
  - commit to named branch,
  - patch file,
  - explicit abandon approval.

### Phase 1: Land the cleanup control layer

- Commit the DOX/AGENTS hierarchy and this audit report.
- Run at minimum `pnpm check:no-firebase`.
- For final PR readiness, run `pnpm typecheck`, `pnpm lint`, and `pnpm build`.

### Phase 2: PR triage

- Review clean ready PRs first.
- For every PR, assign one state:
  - `merge-review`
  - `superseded`
  - `archive-docs`
  - `rebase-needed`
  - `security-review`
  - `strategic-decision`
  - `abandon-after-approval`

### Phase 3: Dirty worktree triage

- Inspect each dirty worktree diff.
- Special attention:
  - `claude/sweet-raman-8d3af0`
  - `claude/trusting-volhard-2b9b1d`
  - detached Codex worktrees with Founder Gravity changes
  - any worktree modifying `package.json`, `pnpm-lock.yaml`, `.env.example`,
    lead capture, sitemap, booking, or Sanity

### Phase 4: Documentation supersession

- Add clear archive notes to stale `.specify` and `specs` documents.
- Update `docs/ROADMAP.md` with what is actually current after PR triage.
- Update `docs/PRD.md` only if the strategic naming decision changes from
  Applied Intelligence Systems to Founder Intelligence Systems.

### Phase 5: Converge to one main

After approval only:

- Bring local `main` back to `origin/main`.
- Remove clean merged worktrees.
- Delete local branches that are merged or explicitly abandoned.
- Close superseded GitHub PRs with a note pointing to the replacement.
- Keep only `main` plus active, named branches with open PRs.

## Human Approval Gates

Require explicit approval before:

- Closing any PR.
- Removing any worktree.
- Deleting any branch.
- Discarding any dirty file.
- Force pushing.
- Rewriting local `main`.
- Marking security PRs superseded.
- Changing public brand naming from Applied Intelligence Systems to Founder
  Intelligence Systems.
- Archiving or superseding old `.specify` and `specs` docs.

## Immediate Next Action

Recommended next command sequence after reviewing this report:

```bash
git status --short --branch
pnpm check:no-firebase
pnpm typecheck
pnpm lint
pnpm build
```

If those pass, create a draft PR for the DOX/audit control layer. After that,
begin PR triage with clean PRs #160, #159, #142, #141, #140, #139, #138,
#137, #135, #130, #127, #122, #106, and #13.
