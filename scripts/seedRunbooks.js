#!/usr/bin/env node

// Disabled: Firestore runbook seeding has been removed alongside Retired auth.
// See docs/architecture/stack-decision.md. Reimplement against NeonDB if
// runbook seeding is reintroduced.

console.error(
  "seedRunbooks is disabled: Retired auth has been removed from audiojones.com.",
);
process.exit(2);
