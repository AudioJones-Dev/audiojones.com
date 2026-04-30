// Firebase has been intentionally removed from audiojones.com.
// Kept as a thin re-export so legacy admin routes still resolve `getFirestoreDb`
// and `getFirebaseApp`. All accessors throw at runtime.
// See docs/architecture/stack-decision.md.
import "server-only";
import {
  getAdminApp,
  getFirestoreDb,
  type FirebaseAdminApp,
} from "@/lib/server/firebaseAdmin";

export function getFirebaseApp(): FirebaseAdminApp {
  return getAdminApp();
}

export { getFirestoreDb };
