#!/usr/bin/env node

// Disabled: Firestore runbook seeding has been removed alongside Firebase.
// See docs/architecture/stack-decision.md. Reimplement against NeonDB if
// runbook seeding is reintroduced.

console.error(
  "seedRunbooks is disabled: Firebase has been removed from audiojones.com.",
);
process.exit(2);
