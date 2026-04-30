// Firebase has been intentionally removed from audiojones.com.
// This module is a no-op shim kept so admin/portal tooling that has not yet
// been migrated to NeonDB / Supabase still type-checks. Any call into one of
// these accessors throws at runtime — see docs/architecture/stack-decision.md.
import "server-only";
import {
  auth as adminAuthFn,
  firestore as adminFirestoreFn,
  initializeApp as initializeAdminApp,
  type App,
} from "@/lib/legacy-stubs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FirebaseAdminApp = any;

export function getAdminApp(): FirebaseAdminApp {
  return initializeAdminApp() as never;
}

export function adminAuth(): ReturnType<typeof adminAuthFn> {
  return adminAuthFn();
}
export const getAdminAuth = adminAuth;

export function getFirestoreDb(): ReturnType<typeof adminFirestoreFn> {
  return adminFirestoreFn();
}

export const getDb = getFirestoreDb;

export type { App };
