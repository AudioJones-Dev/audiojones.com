import {
  getAuth,
  getStorage,
  getFunctions,
  getFirestore,
  GoogleAuthProvider,
  type LegacyClientApp,
} from "@/lib/disabled-sdk";

let _googleProvider: GoogleAuthProvider | null = null;

export function getLegacyAuthApp(): LegacyClientApp {
  throw new Error(
    "The retired auth/data SDK has been removed from audiojones.com. See docs/architecture/stack-decision.md.",
  );
}

const handler = (label: string): ProxyHandler<object> => ({
  get(_target, prop) {
    if (prop === "then") return undefined;
    throw new Error(
      `The retired auth/data SDK has been removed from audiojones.com (accessed ${label}.${String(prop)}). See docs/architecture/stack-decision.md.`,
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
export const googleProvider: any = new Proxy(
  {},
  {
    get(_target, prop) {
      if (!_googleProvider) {
        _googleProvider = new GoogleAuthProvider();
      }
      return (_googleProvider as unknown as Record<string | symbol, unknown>)[prop];
    },
  },
);

export { getAuth, getStorage, getFunctions, getFirestore, GoogleAuthProvider };
