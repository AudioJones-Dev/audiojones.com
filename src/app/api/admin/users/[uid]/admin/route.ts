import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/legacyAdmin';

interface RouteParams {
  params: Promise<{
    uid: string;
  }>;
}

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

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.res!;

  try {
    const { uid } = await params;
    const body = await req.json();
    const { admin } = body;

    if (typeof admin !== 'boolean') {
      return NextResponse.json({ error: 'admin field must be boolean' }, { status: 400 });
    }

    // Get current user claims
    const userRecord = await adminAuth().getUser(uid);
    const currentClaims = userRecord.customClaims || {};

    // Update admin claim
    const newClaims = {
      ...currentClaims,
      admin,
    };

    // Set the custom claims
    await adminAuth().setCustomUserClaims(uid, newClaims);

    return NextResponse.json({ 
      ok: true, 
      message: `User ${uid} admin status updated to ${admin}`,
      claims: newClaims
    });
  } catch (err: any) {
    console.error('Failed to update user admin status:', err);
    return NextResponse.json({ 
      error: 'Failed to update user admin status', 
      details: err?.message 
    }, { status: 500 });
  }
}