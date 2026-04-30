// tools/grant-admin.ts
//
// Firebase Auth has been removed from audiojones.com. This script previously
// stamped Firebase custom claims to elevate users; the equivalent operation
// against the new stack will be a row in NeonDB or a Supabase Auth claim. Until
// that admin model is finalized, the script exits with guidance instead of
// silently failing.

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx tools/grant-admin.ts <email>");
    process.exit(1);
  }

  console.error(
    `Cannot grant admin to ${email}: Firebase Auth has been removed from audiojones.com.\n` +
      "See docs/architecture/stack-decision.md. The replacement admin model is being\n" +
      "implemented against NeonDB / Supabase Auth.",
  );
  process.exit(2);
}

main();
