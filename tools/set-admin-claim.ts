import "server-only";
export const runtime = "nodejs";

import { adminAuth } from "@/lib/server/legacyAdmin";

async function setAdminByEmail(email: string) {
  const auth = adminAuth();
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { admin: true });
  await auth.revokeRefreshTokens(user.uid);
  console.log(`✅ Set admin=true and revoked refresh tokens for ${email} (${user.uid})`);
  console.log("ℹ️ User must sign out/in (or refresh session cookie) to pick up the claim.");
}

async function setAdminByUid(uid: string) {
  const auth = adminAuth();
  await auth.setCustomUserClaims(uid, { admin: true });
  await auth.revokeRefreshTokens(uid);
  console.log(`✅ Set admin=true and revoked refresh tokens for uid=${uid}`);
}

(async () => {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: pnpm tsx tools/set-admin-claim.ts <email|uid>");
    process.exit(1);
  }
  if (arg.includes("@")) await setAdminByEmail(arg);
  else await setAdminByUid(arg);
})();