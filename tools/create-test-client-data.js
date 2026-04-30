#!/usr/bin/env node

// tools/create-test-client-data.js
//
// Disabled: Firestore-based test data seeding has been removed alongside
// Firebase. See docs/architecture/stack-decision.md. Replacement seeding
// against NeonDB will be added when the client portal data model is migrated.

console.error(
  "create-test-client-data is disabled: Firebase has been removed from audiojones.com.\n" +
    "Reimplement against NeonDB if test data is needed.",
);
process.exit(2);
