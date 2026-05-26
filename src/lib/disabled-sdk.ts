/* eslint-disable @typescript-eslint/no-explicit-any */

const REMOVED_MESSAGE =
  "The retired auth/data SDK has been removed from audiojones.com. See docs/architecture/stack-decision.md.";

function fail(): never {
  throw new Error(REMOVED_MESSAGE);
}

function throwingProxy(label = "disabledSdk"): any {
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

export const apps: any[] = [];

export const credential: any = {
  cert: (..._args: any[]): any => fail(),
  applicationDefault: (..._args: any[]): any => fail(),
};

export function initializeApp(..._args: any[]): any {
  fail();
}

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

export function getApps(): any[] {
  return [];
}

export function getApp(..._args: any[]): any {
  fail();
}

export function cert(..._args: any[]): any {
  fail();
}

export function getFirestore(..._args: any[]): any {
  fail();
}

export const FieldValue: any = throwingProxy("FieldValue");
export const Timestamp: any = throwingProxy("Timestamp");

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

export function setDoc(..._args: any[]): any {
  fail();
}

export function doc(..._args: any[]): any {
  fail();
}

export function getFunctions(..._args: any[]): any {
  fail();
}

export function getAnalytics(..._args: any[]): any {
  fail();
}

export type App = any;
export type LegacyClientApp = any;
export type Firestore = any;
export type User = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  emailVerified?: boolean;
  getIdToken: () => Promise<string>;
  [key: string]: any;
};
