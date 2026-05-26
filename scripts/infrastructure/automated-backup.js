#!/usr/bin/env node

// Disabled: Firestore-based automated backup has been removed alongside
// Retired auth. See docs/architecture/stack-decision.md. Backup of NeonDB is
// handled by Neon's branch/snapshot feature; reimplement here only if
// additional offsite backup is needed.

console.error(
  "automated-backup is disabled: Retired auth has been removed from audiojones.com.",
);
process.exit(2);
