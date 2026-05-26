export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/legacyAdmin';

/**
 * GET /api/admin/whoami
 * Reads retired auth token from `Authorization: Bearer <token>`
 * and returns uid, email, and custom claims (e.g., { admin: true }).
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : null;

    if (!token) {
      return NextResponse.json({ error: 'Missing Bearer token' }, { status: 401 });
    }

    // verify token, force refresh of revoked/changed claims
    const decoded = await adminAuth().verifyIdToken(token, true);

    const { uid, email, picture, name, iat, exp, auth_time, legacyAuth, ...rest } = decoded;

    return NextResponse.json({
      ok: true,
      uid,
      email: email || null,
      name: name || null,
      picture: picture || null,
      auth_time,
      iat,
      exp,
      provider: legacyAuth?.sign_in_provider || null,
      claims: rest, // includes custom claims like { admin: true }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Invalid token' }, { status: 401 });
  }
}