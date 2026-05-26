export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/legacyAdmin';
import { requireAdmin } from '@/lib/server/requireAdmin';

const FORBIDDEN_CLAIMS = new Set([
  'aud','iss','sub','iat','exp','auth_time','uid','email','email_verified','legacyAuth'
]);

function bad(status: number, message: string) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    // Admin authentication using shared helper
    requireAdmin(req);

    // --- Verify caller is an admin (retired auth custom claim) ---
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!token) return bad(401, 'Missing Bearer token');

    const decoded = await adminAuth().verifyIdToken(token, true);
    if (!decoded.admin) return bad(403, 'Admin claim required');

    // --- Parse body ---
    const body = await req.json().catch(() => null) as {
      email?: string;
      uid?: string;
      claims?: Record<string, unknown>;
    } | null;

    if (!body) return bad(400, 'Invalid JSON body');
    const { email, uid, claims } = body;

    if ((!email && !uid) || (email && uid)) {
      return bad(400, 'Provide exactly one of: email OR uid');
    }
    if (!claims || typeof claims !== 'object' || Array.isArray(claims)) {
      return bad(400, 'claims must be an object');
    }

    // --- Validate claims keys ---
    for (const k of Object.keys(claims)) {
      if (FORBIDDEN_CLAIMS.has(k)) {
        return bad(400, `Claim key "${k}" is not allowed`);
      }
    }

    // --- Resolve user ---
    const auth = adminAuth();
    const userRecord = email
      ? await auth.getUserByEmail(email)
      : await auth.getUser(uid!);

    const previous = userRecord.customClaims || {};

    // --- Set claims ---
    await auth.setCustomUserClaims(userRecord.uid, claims);

    return NextResponse.json({
      ok: true,
      uid: userRecord.uid,
      email: userRecord.email ?? null,
      previousClaims: previous,
      newClaims: claims,
    });
  } catch (e: any) {
    // If it's already a NextResponse (from requireAdmin), return it
    if (e instanceof NextResponse) {
      return e;
    }
    
    const msg = e?.message || 'Unexpected error';
    const status = /auth\/(id-token|argument|user-not-found)/i.test(msg) ? 400 : 500;
    return bad(status, msg);
  }
}