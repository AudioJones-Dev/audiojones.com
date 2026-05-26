import "server-only";
import {
  auth as adminAuthFn,
  firestore as adminFirestoreFn,
  initializeApp as initializeAdminApp,
  type App,
} from "@/lib/disabled-sdk";

export type LegacyAdminApp = any;

export function getAdminApp(): LegacyAdminApp {
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
