export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/legacyAdmin';
import { requireAdmin } from '@/lib/server/requireAdmin';

export async function POST(req: NextRequest) {
  try {
    // Admin authentication using shared helper
    requireAdmin(req);
    const { email, admin = true } = await req.json();
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

    const auth = adminAuth();
    const user = await auth.getUserByEmail(email);
    const claims = { ...(user.customClaims || {}), admin };
    if (!admin) delete (claims as any).admin;

    await auth.setCustomUserClaims(user.uid, claims);
    return NextResponse.json({ ok: true, uid: user.uid, email, claims });
  } catch (e: any) {
    // If it's already a NextResponse (from requireAdmin), return it
    if (e instanceof NextResponse) {
      return e;
    }
    
    const status = /Unauthorized/.test(e?.message) ? 401 : 400;
    return NextResponse.json({ error: e?.message || 'failed' }, { status });
  }
}