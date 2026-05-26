export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function GET() {
  const required = ['GOOGLE_CLOUD_PROJECT', 'LEGACY_AUTH_CLIENT_EMAIL', 'LEGACY_AUTH_PRIVATE_KEY'] as const;
  const missing = required.filter((k) => !process.env[k]);

  return NextResponse.json({
    ok: true,
    service: 'admin-ping',
    time: new Date().toISOString(),
    legacyAuthAdminEnv: missing.length === 0 ? 'ok' : { missing },
  });
}