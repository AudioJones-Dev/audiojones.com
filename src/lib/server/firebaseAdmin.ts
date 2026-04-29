// src/lib/server/firebaseAdmin.ts
import 'server-only';

import * as admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;

/**
 * Cached credential loader - only loads env vars when actually needed
 */
function loadFirebaseCredentials() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(`Missing Firebase credentials. Required env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY`);
  }

  // Vercel stores newlines as \n; convert to real newlines
  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n')
  };
}

/** Get (singleton) Firebase Admin app for server code */
export function getAdminApp(): admin.app.App {
  if (!adminApp) {
    if (!admin.apps.length) {
      const credentials = loadFirebaseCredentials();
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(credentials),
      });
    } else {
      adminApp = admin.apps[0];
    }
  }
  return adminApp!;
}

/** Firebase Admin Auth accessor (server only) */
export function adminAuth() {
  return getAdminApp().auth();
}

/** Back-compat alias for existing imports */
export const getAdminAuth = adminAuth;

/** Firebase Admin Firestore accessor (server only) */
export function getFirestoreDb() {
  return admin.firestore(getAdminApp());
}

let cachedDb: admin.firestore.Firestore | null = null;
function resolveDb(): admin.firestore.Firestore {
  if (!cachedDb) cachedDb = getFirestoreDb();
  return cachedDb;
}

// Proxy defers Firestore + credential resolution until a property is actually
// read. Holding a reference (e.g. `this.db = getDb()` in a singleton
// constructor) does not initialize Firebase Admin, so Next.js page-data
// collection at build time does not require server-side Firebase env vars.
const dbProxy = new Proxy({} as admin.firestore.Firestore, {
  get(_target, prop) {
    const db = resolveDb();
    const value = (db as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === 'function' ? (value as Function).bind(db) : value;
  },
});

export function getDb(): admin.firestore.Firestore {
  return dbProxy;
}
