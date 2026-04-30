// src/app/api/admin/users/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/firebaseAdmin';

/** Validate Bearer token and require the `admin` custom claim */
async function requireAdmin(req: NextRequest) {
  const authz = req.headers.get('authorization') || '';
  const match = authz.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { ok: false, res: NextResponse.json({ error: 'Missing Authorization Bearer token' }, { status: 401 }) };
  }

  try {
    const decoded = await adminAuth().verifyIdToken(match[1], true); // checks revocation
    if (!decoded.admin && !(decoded.customClaims && (decoded.customClaims as any).admin)) {
      return { ok: false, res: NextResponse.json({ error: 'Forbidden: admin claim required' }, { status: 403 }) };
    }
    return { ok: true, decoded };
  } catch (err: any) {
    return { ok: false, res: NextResponse.json({ error: 'Invalid token', details: err?.message }, { status: 401 }) };
  }
}

/** GET: Return a small page of users (admin only) */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.res!;

  try {
    const list = await adminAuth().listUsers(50);
    const users = list.users.map((u: any) => ({
      uid: u.uid,
      email: u.email ?? null,
      disabled: u.disabled,
      customClaims: u.customClaims ?? {},
      createdAt: u.metadata?.creationTime ?? null,
      lastSignIn: u.metadata?.lastSignInTime ?? null,
    }));

    // no-store to avoid caching sensitive data
    return NextResponse.json({ ok: true, count: users.length, users }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to list users', details: err?.message }, { status: 500 });
  }
}

/** POST (optional): look up a specific user by email or uid (admin only)
 *  body: { email?: string, uid?: string }
 */
export async function POST(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.res!;

  try {
    const { email, uid } = await req.json();
    if (!email && !uid) {
      return NextResponse.json({ error: 'Provide email or uid' }, { status: 400 });
    }
    const userRecord = email
      ? await adminAuth().getUserByEmail(email)
      : await adminAuth().getUser(uid);

    return NextResponse.json({
      ok: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email ?? null,
        disabled: userRecord.disabled,
        customClaims: userRecord.customClaims ?? {},
        createdAt: userRecord.metadata?.creationTime ?? null,
        lastSignIn: userRecord.metadata?.lastSignInTime ?? null,
      },
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err: any) {
    return NextResponse.json({ error: 'Lookup failed', details: err?.message }, { status: 400 });
  }
}

