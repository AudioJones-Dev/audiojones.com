# CHANGELOG.md — AudioJones.com

Notable repository-level changes. Routine code changes belong in PRs
and commit history, not here. Use this file for:

- Architecture changes (stack, deploy targets).
- Documentation reorganizations.
- Security incidents and rotations (no secret values).
- Decommissions and route removals.

Entries are reverse chronological. Format follows
[Keep a Changelog](https://keepachangelog.com/) loosely.

---

## Unreleased

### Security / Production Readiness (v1 Launch Bundle)
Validated and merged all four v1 launch-blocking PRs in approved order
(#97 → #102 → #96 → #95). Zero git conflicts. All checks clean on
merged state.

| PR | Change | Validation |
|---|---|---|
| #97 | Scrub leaked admin key; hard-block `/portal/*` + `/api/admin/*` | typecheck/lint/firebase ✅; secret grep 0 hits ✅ |
| #102 | Delete stale `src/app/favicon.ico` (was shadowing brand icon) | build ✅; favicon.ico absent from `.next/server/app/` ✅ |
| #96 | Self-host fonts (Google Fonts → `next/font/local`); first blog post | typecheck/lint/firebase ✅; all font TTF paths verified ✅ |
| #95 | OG image fix, metadata on 6 pages, FAQPage JSON-LD, a11y skip-link, robots cleanup | typecheck/lint/firebase ✅; `/og` route registered ✅ |

Full `pnpm build` on merged state: 0 errors, 212+ static pages generated.

**PR #103** (per-PR Vercel preview aliases) is BLOCKED pending:
- `*.preview.audiojones.com` added to Vercel project custom domains
- Wildcard DNS CNAME active
- Vercel firewall allowlist configured

**PR #104** (homepage V2 design) is DEFERRED until all above ship and production is verified.

#### GitHub housekeeping — run once (owner)

```bash
REPO="AudioJones-Dev/audiojones.com"

# 1. Labels
gh label create "P0: launch-blocker"  --color "B60205" --description "Must ship before launch"          --repo $REPO
gh label create "P1: launch-critical" --color "E4E669" --description "Required for launch, no exceptions" --repo $REPO
gh label create "P2: deferred"        --color "C5DEF5" --description "Post-launch polish"                --repo $REPO
gh label create "security"            --color "D93F0B" --description "Security fix"                      --repo $REPO
gh label create "seo/aeo"             --color "0075CA" --description "SEO / AEO / structured data"       --repo $REPO
gh label create "build"               --color "E4E669" --description "Build system / CI / tooling"       --repo $REPO
gh label create "design"              --color "7057FF" --description "Visual / UI / design system"       --repo $REPO
gh label create "content"             --color "0E8A16" --description "Content / copy changes"            --repo $REPO
gh label create "infra"               --color "1D76DB" --description "Infrastructure / CI / deployment"  --repo $REPO
gh label create "a11y"                --color "F9D0C4" --description "Accessibility"                     --repo $REPO
gh label create "needs-rebase"        --color "FBCA04" --description "Requires rebase before merge"      --repo $REPO
gh label create "blocked"             --color "E4E669" --description "Blocked on external dependency"    --repo $REPO
gh label create "ready-to-merge"      --color "0E8A16" --description "Rebased, CI green, approved"       --repo $REPO

# 2. Milestone
gh api repos/$REPO/milestones --method POST \
  -f title="v1.0 Launch" \
  -f description="All production blockers cleared. Site live at audiojones.com." \
  -f due_on="2026-06-01T00:00:00Z" \
  -f state="open"

# 3. Apply labels + milestone to PRs
gh pr edit 97  --add-label "P0: launch-blocker,security,needs-rebase"         --milestone "v1.0 Launch" --repo $REPO
gh pr edit 96  --add-label "P1: launch-critical,build,content,needs-rebase"   --milestone "v1.0 Launch" --repo $REPO
gh pr edit 95  --add-label "P1: launch-critical,seo/aeo,a11y,needs-rebase"    --milestone "v1.0 Launch" --repo $REPO
gh pr edit 102 --add-label "P1: launch-critical,build,needs-rebase"           --milestone "v1.0 Launch" --repo $REPO
gh pr edit 103 --add-label "P1: launch-critical,infra,blocked,needs-rebase"   --milestone "v1.0 Launch" --repo $REPO
gh pr edit 104 --add-label "P2: deferred,design"                                                        --repo $REPO

# 4. Promote drafts
gh pr ready 97  --repo $REPO
gh pr ready 102 --repo $REPO

# 5. Tracking issues
gh issue create \
  --title "[P0] Scrub leaked admin key and hard-block legacy admin routes — PR #97" \
  --label "P0: launch-blocker,security" --milestone "v1.0 Launch" \
  --body "Tracks PR #97. Merge prerequisites: promote from draft, rebase against main, all checks pass, owner approval." \
  --repo $REPO

gh issue create \
  --title "[P1] Fix stale favicon shadowing correct brand icon — PR #102" \
  --label "P1: launch-critical,build" --milestone "v1.0 Launch" \
  --body "Tracks PR #102. Single file deletion. Needs promotion + rebase post-#97." \
  --repo $REPO

gh issue create \
  --title "[P1] Self-host fonts to fix cold CI builds — PR #96" \
  --label "P1: launch-critical,build,content" --milestone "v1.0 Launch" \
  --body "Tracks PR #96. Replace next/font/google with next/font/local. Merge after #97." \
  --repo $REPO

gh issue create \
  --title "[P1] Production SEO/AEO audit fixes (OG image, metadata, FAQPage, a11y) — PR #95" \
  --label "P1: launch-critical,seo/aeo,a11y" --milestone "v1.0 Launch" \
  --body "Tracks PR #95. Highest conflict risk — merge last after #96. All conflicts confirmed auto-resolvable." \
  --repo $REPO

gh issue create \
  --title "[P1 BLOCKED] Per-PR Vercel preview domain isolation — PR #103" \
  --label "P1: launch-critical,infra,blocked" --milestone "v1.0 Launch" \
  --body "BLOCKED on: (1) *.preview.audiojones.com in Vercel project, (2) wildcard DNS CNAME, (3) firewall allowlist." \
  --repo $REPO

gh issue create \
  --title "[P2 DEFERRED] Homepage V2 signal-yellow accent unification — PR #104" \
  --label "P2: deferred,design" \
  --body "Deferred until PRs #97/#102/#96/#95 are live in production and verified." \
  --repo $REPO
```

### Documentation
- Established the canonical `docs/` hierarchy: `PRD.md`, `DESIGN.md`,
  `ROADMAP.md`, `SECURITY.md`, `DEPLOYMENT.md`, `DECISIONS.md`,
  `CHANGELOG.md`.
- Added `AGENTS.md` (root) as the durable contract for any AI coding
  agent operating in this repository, and `CLAUDE.md` (root) as the
  Claude-specific addendum.
- Stubbed superseded docs to single-line redirects without deleting:
  `AUDIOJONES_DESIGN.md`, `docs/design.md`, root `DEPLOYMENT.md`,
  `VERCEL_ENV_SETUP.md`, `docs/VERCEL_ENV_SOP.md`, root `secrets.md`,
  `docs/env.example`, `docs/env/env-template.md`.
- Rewrote `README.md` and `.github/copilot-instructions.md` to reflect
  the actual stack (Cloudflare → Vercel/Next.js → Sanity → NeonDB →
  Resend → n8n; Firebase intentionally excluded).
- Updated `package.json` `description` field to a one-line product
  summary.

---

## 2026-04-29 — Firebase removed from AudioJones.com

### Changed
- Migrated lead persistence to NeonDB
  (`applied_intelligence_leads`).
- Sanity confirmed as the only CMS.
- Resend wired for internal lead notifications; n8n moved to
  optional/best-effort.

### Removed
- Firebase Admin / Firestore / Storage code paths from the marketing
  surface.
- `FIREBASE_*` and `NEXT_PUBLIC_FIREBASE_*` env keys.

### Security
- Added `pnpm check:no-firebase` guardrail to fail CI on
  reintroduction of any Firebase import, package, or env key.

### Notes
Full context: [`docs/DECISIONS.md`](./DECISIONS.md) and
[`docs/architecture/stack-decision.md`](./architecture/stack-decision.md).

---

## How to add an entry

1. Add a section under **Unreleased** while the change is in flight.
2. When a release is cut (or at a logical milestone), promote the
   `Unreleased` section to a dated heading and start a fresh
   `Unreleased`.
3. Keep entries concise — one or two lines per bullet. Link to PRs or
   decision entries for detail.
4. **Never paste secret values** into a security entry, even as
   context. Reference only the rotation steps and affected systems.
