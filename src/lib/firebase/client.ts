// Firebase has been intentionally removed from audiojones.com.
// This module remains as a no-op shim so legacy admin/auth components still
// type-check. Every accessor throws when actually used at runtime — see
// docs/architecture/stack-decision.md for the approved replacement stack.
//
// Components that previously authenticated via Firebase Auth should be
// reworked against Supabase Auth (only if auth is genuinely required) before
// being re-enabled.

import {
  getAuth,
  getStorage,
  getFunctions,
  getFirestore,
  GoogleAuthProvider,
  type FirebaseApp,
} from "@/lib/legacy-stubs";

let _googleProvider: GoogleAuthProvider | null = null;

export function getFirebaseApp(): FirebaseApp {
  throw new Error(
    "Firebase has been removed from audiojones.com. See docs/architecture/stack-decision.md.",
  );
}

const handler = (label: string): ProxyHandler<object> => ({
  get(_target, prop) {
    if (prop === "then") return undefined;
    throw new Error(
      `Firebase has been removed from audiojones.com (accessed ${label}.${String(prop)}). See docs/architecture/stack-decision.md.`,
    );
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth: any = new Proxy({}, handler("auth"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const storage: any = new Proxy({}, handler("storage"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const functions: any = new Proxy({}, handler("functions"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db: any = new Proxy({}, handler("db"));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const googleProvider: any = new Proxy({}, {
  get(_target, prop) {
    if (!_googleProvider) {
      // GoogleAuthProvider construction throws via the legacy-stubs shim.
      _googleProvider = new GoogleAuthProvider();
    }
    return (_googleProvider as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Keep the original named accessors used to be present.
export { getAuth, getStorage, getFunctions, getFirestore, GoogleAuthProvider };
