import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  isAdminKey,
} from '@/lib/server/adminSession';

// Establishes / clears the admin portal session.
//
// POST { key }  — validates the key against the server-only ADMIN_KEY and, on
//                 success, sets an httpOnly session cookie. The key is read
//                 from the request body and never returned to the client.
// DELETE        — clears the session cookie (logout).

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  let providedKey = '';
  try {
    const body = await req.json();
    if (body && typeof body.key === 'string') providedKey = body.key;
  } catch {
    providedKey = '';
  }

  if (!isAdminKey(providedKey, adminKey)) {
    return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(
    ADMIN_SESSION_COOKIE,
    createSessionToken(adminKey),
    sessionCookieOptions(SESSION_MAX_AGE_SECONDS),
  );
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, '', sessionCookieOptions(0));
  return res;
}
