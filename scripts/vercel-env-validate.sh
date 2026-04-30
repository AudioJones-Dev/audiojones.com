#!/usr/bin/env bash
set -euo pipefail

# 🧩 Audio Jones — Vercel Environment Validation Script
# Purpose: Verify all required Vercel environment variables are properly set and authenticated.
# Compatible: Jules, Codex, VS Code Terminal, PowerShell, Git Bash

# Step 1: Print currently loaded Vercel environment variables
echo "🔍 Checking for required environment variables..."
echo "----------------------------------------------"
echo "VERCEL_TEAM_ID: ${VERCEL_TEAM_ID-}"
echo "VERCEL_TOKEN: ${VERCEL_TOKEN-}"
echo "VERCEL_PROJECT_ID: ${VERCEL_PROJECT_ID-}"
echo "----------------------------------------------"

# Step 2: Validate token and team ID with the Vercel API
echo "🧪 Validating Vercel API token and team ID..."
curl -s -H "Authorization: Bearer ${VERCEL_TOKEN-}" \
  "https://api.vercel.com/v9/projects?teamId=${VERCEL_TEAM_ID-}" \
  | jq '.projects[] | {name: .name, id: .id, latestDeployments: .latestDeployments[0].state}' \
  || echo "⚠️ Unable to fetch projects. Check your token and team ID."

# Step 3: Verify the Audio Jones project connection
echo "----------------------------------------------"
echo "🎯 Checking for 'audiojones.com' project..."
curl -s -H "Authorization: Bearer ${VERCEL_TOKEN-}" \
  "https://api.vercel.com/v9/projects/audiojones.com?teamId=${VERCEL_TEAM_ID-}" \
  | jq '{name: .name, id: .id, environment: .targets.production, framework: .framework}' \
  || echo "⚠️ Project not found or not linked to this team."

# Step 4: Optional — list environment variables for current project
echo "----------------------------------------------"
echo "📦 Listing environment variables for audiojones.com..."
curl -s -H "Authorization: Bearer ${VERCEL_TOKEN-}" \
  "https://api.vercel.com/v9/projects/audiojones.com/env?teamId=${VERCEL_TEAM_ID-}" \
  | jq '.envs[] | {key: .key, value: .value, target: .target}' \
  || echo "⚠️ Could not list project env variables."

echo "✅ Validation complete. Review above results for missing or invalid credentials."
