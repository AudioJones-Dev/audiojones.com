// Legacy SDK stubs.
//
// Firebase has been intentionally removed from AudioJones.com. See
// docs/architecture/stack-decision.md for the rationale and approved stack
// (Cloudflare → Vercel/Next.js → Sanity → NeonDB → Resend → n8n; Supabase only
// where auth/storage/realtime is genuinely required).
//
// This module exists as a typed compatibility shim for in-progress admin/portal
// tooling that still references the old SDK shape. Every export here throws on
// use; importing them never pulls in any Firebase package. Migrate call sites
// off these symbols incrementally and delete this file once the last consumer
// is gone.
//
// IMPORTANT: this file MUST NOT import any package whose name starts with
// "firebase" or "@firebase". The repo guard `scripts/check-no-firebase.ts`
// enforces that across the source tree.

/* eslint-disable @typescript-eslint/no-explicit-any */

const REMOVED_MESSAGE =
  "Firebase has been removed from audiojones.com. See docs/architecture/stack-decision.md.";

function fail(): never {
  throw new Error(REMOVED_MESSAGE);
}

function throwingProxy(label = "firebase"): any {
  return new Proxy(
    function noop() {},
    {
      get(_target, prop) {
        if (prop === "then") return undefined;
        if (prop === Symbol.toPrimitive) return undefined;
        throw new Error(`${REMOVED_MESSAGE} (accessed ${label}.${String(prop)})`);
      },
      apply() {
        throw new Error(`${REMOVED_MESSAGE} (called ${label})`);
      },
      construct() {
        throw new Error(`${REMOVED_MESSAGE} (constructed ${label})`);
      },
    } as ProxyHandler<any>,
  ) as any;
}

// ---------------------------------------------------------------------------
// firebase-admin (CommonJS namespace + sub-modules)
// ---------------------------------------------------------------------------

// Used as `import * as admin from 'firebase-admin'` then `admin.firestore`,
// `admin.auth`, `admin.app.App`, `admin.apps`, etc.
export const apps: any[] = [];

export const credential: any = {
  cert: (..._args: any[]): any => fail(),
  applicationDefault: (..._args: any[]): any => fail(),
};

export function initializeApp(..._args: any[]): any {
  fail();
}

// Namespace-style accessor: `admin.firestore()` and `admin.auth()`.
export const firestore: any = Object.assign(
  function firestore(..._args: any[]): any {
    fail();
  },
  {
    FieldValue: throwingProxy("firestore.FieldValue"),
    Timestamp: throwingProxy("firestore.Timestamp"),
  },
);

export function auth(..._args: any[]): any {
  fail();
}

// firebase-admin/app
export function getApps(): any[] {
  return [];
}
export function getApp(..._args: any[]): any {
  fail();
}
export function cert(..._args: any[]): any {
  fail();
}

// firebase-admin/firestore
export function getFirestore(..._args: any[]): any {
  fail();
}
export const FieldValue: any = throwingProxy("FieldValue");
export const Timestamp: any = throwingProxy("Timestamp");

// ---------------------------------------------------------------------------
// firebase (client SDK)
// ---------------------------------------------------------------------------

// firebase/app
export function getAuth(..._args: any[]): any {
  fail();
}
export class GoogleAuthProvider {
  constructor() {
    fail();
  }
  static credential(..._args: any[]): any {
    fail();
  }
}

export function onAuthStateChanged(..._args: any[]): () => void {
  // Return a noop unsubscribe — auth state is never updated because there is
  // no auth provider.
  return () => {};
}
export function signInWithEmailAndPassword(..._args: any[]): any {
  fail();
}
export function signInWithPopup(..._args: any[]): any {
  fail();
}
export function signOut(..._args: any[]): any {
  fail();
}
export function createUserWithEmailAndPassword(..._args: any[]): any {
  fail();
}
export function updateProfile(..._args: any[]): any {
  fail();
}
export function sendPasswordResetEmail(..._args: any[]): any {
  fail();
}
export class OAuthProvider {
  constructor(_providerId: string) {
    fail();
  }
}

// firebase/storage
export function getStorage(..._args: any[]): any {
  fail();
}
export function ref(..._args: any[]): any {
  fail();
}
export function uploadBytesResumable(..._args: any[]): any {
  fail();
}
export function getDownloadURL(..._args: any[]): any {
  fail();
}

// firebase/firestore (client)
export function setDoc(..._args: any[]): any {
  fail();
}
export function doc(..._args: any[]): any {
  fail();
}

// firebase/functions
export function getFunctions(..._args: any[]): any {
  fail();
}

// firebase/analytics
export function getAnalytics(..._args: any[]): any {
  fail();
}

// ---------------------------------------------------------------------------
// Type aliases — opaque, kept for source compatibility.
// ---------------------------------------------------------------------------

export type App = any;
export type FirebaseApp = any;
export type Firestore = any;
export type User = { uid: string; email?: string | null; [key: string]: any };
