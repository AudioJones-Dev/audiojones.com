import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

// Server-only admin session, bound to ADMIN_KEY.
//
// The portal proves admin access once by presenting ADMIN_KEY to
// /api/admin-auth, which issues this token in an httpOnly cookie. The raw
// ADMIN_KEY is never placed in the browser bundle or in a JS-readable cookie;
// the cookie holds only an HMAC bound to ADMIN_KEY plus an expiry. Rotating
// ADMIN_KEY invalidates every outstanding session.

export const ADMIN_SESSION_COOKIE = 'aj_admin';

const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours
export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_TTL_MS / 1000);

function sign(adminKey: string, payload: string): string {
  return createHmac('sha256', adminKey).update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function createSessionToken(
  adminKey: string,
  now: number = Date.now(),
): string {
  const exp = String(now + SESSION_TTL_MS);
  return `${exp}.${sign(adminKey, exp)}`;
}

export function isValidSessionToken(
  token: string | undefined | null,
  adminKey: string,
  now: number = Date.now(),
): boolean {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expMs = Number(exp);
  if (!Number.isFinite(expMs) || now > expMs) return false;
  return safeEqual(sig, sign(adminKey, exp));
}

// Constant-time comparison of a caller-supplied key against ADMIN_KEY.
export function isAdminKey(provided: string, adminKey: string): boolean {
  if (!provided) return false;
  return safeEqual(provided, adminKey);
}
