#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Release check starting ($(date -u +%Y-%m-%dT%H:%M:%SZ))"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "ERROR: pnpm is not installed or not on PATH"
  exit 1
fi

echo "==> Installing dependencies"
pnpm install --frozen-lockfile

echo "==> Running no-Firebase guardrail"
pnpm -s check:no-firebase

echo "==> Verifying required environment variables"
required_vars=(
  NEXT_PUBLIC_SITE_URL
)

missing=0
for key in "${required_vars[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    echo "ERROR: Missing required environment variable: $key"
    missing=1
  fi
done

if [[ "$missing" -ne 0 ]]; then
  cat <<'MSG'

Set missing variables locally before release check, for example:
  export NEXT_PUBLIC_SITE_URL="https://audiojones.com"

Then rerun this script.
MSG
  exit 1
fi

echo "==> Building production bundle"
pnpm -s build

echo "✅ Release check passed"
