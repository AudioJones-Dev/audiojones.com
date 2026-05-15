import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';

// Server-side proxy that lets the portal UI call /api/admin/* without
// shipping the ADMIN_KEY to the browser. The proxy verifies the user's
// Firebase session cookie + admin claim, then forwards to the real route
// with admin-key injected from process.env.ADMIN_KEY (server-only).
//
// External / server-to-server callers continue to call /api/admin/*
// directly with their own admin-key header — that path is unchanged.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
]);

async function handler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized: admin session required' },
      { status: 401 },
    );
  }

  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return NextResponse.json(
      { error: 'Server misconfigured: ADMIN_KEY not set' },
      { status: 500 },
    );
  }

  const { path } = await ctx.params;
  const search = req.nextUrl.search;
  const targetUrl = new URL(
    `/api/admin/${path.join('/')}${search}`,
    req.nextUrl.origin,
  );

  const forwardHeaders = new Headers();
  forwardHeaders.set('admin-key', adminKey);
  const contentType = req.headers.get('content-type');
  if (contentType) forwardHeaders.set('content-type', contentType);
  const accept = req.headers.get('accept');
  if (accept) forwardHeaders.set('accept', accept);

  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : await req.arrayBuffer();

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers: forwardHeaders,
    body,
    redirect: 'manual',
  });

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return;
    responseHeaders.append(key, value);
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
