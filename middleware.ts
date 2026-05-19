import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LEGACY_PORTAL = /^\/portal(\/|$)/;
const LEGACY_ADMIN_API = /^\/api\/admin(\/|$)/;

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";
  const pathname = url.pathname;

  // Hard-block the legacy /portal/* and /api/admin/* surface on Vercel
  // production + preview deployments. These routes are decommission-queue
  // (docs/PRD.md §1, docs/SECURITY.md §4.2) and previously shipped a
  // browser-exposed admin key. Returning 404 keeps them invisible to
  // crawlers and scanners. Local `pnpm dev` keeps the redirect-to-login
  // behaviour below for ongoing legacy work.
  if (
    process.env.NODE_ENV === "production" &&
    (LEGACY_PORTAL.test(pathname) || LEGACY_ADMIN_API.test(pathname))
  ) {
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // DEV LOGGING - Track all incoming requests
  if (process.env.NODE_ENV === "development") {
    console.log("[middleware:incoming]", { host, pathname });
  }

  // Handle admin subdomain routing
  if (host.startsWith("admin.")) {
    // Admin homepage -> portal/admin
    if (pathname === "/") {
      url.pathname = "/portal/admin";
      if (process.env.NODE_ENV === "development") {
        console.log("[middleware:rewrite]", { from: "/", to: url.pathname });
      }
      return NextResponse.rewrite(url);
    }

    // Admin docs -> ops/docs
    if (pathname.startsWith("/docs")) {
      const originalPath = pathname;
      url.pathname = `/ops${pathname}`;
      if (process.env.NODE_ENV === "development") {
        console.log("[middleware:rewrite]", { from: originalPath, to: url.pathname });
      }
      return NextResponse.rewrite(url);
    }
  }

  // Existing admin auth logic
  const isAdminUI = pathname.startsWith('/portal/admin')
  const isAdminAPI = pathname.startsWith('/api/admin')
  
  if (isAdminUI || isAdminAPI) {
    // Check if we have auth signal
    const hasIdToken =
      request.cookies.get('idToken')?.value ||
      request.headers.get('authorization')?.startsWith('Bearer ')
    
    // Allow admin API routes with admin-key header (they handle their own auth)
    const hasAdminKey = request.headers.get('admin-key') || request.headers.get('X-Admin-Key')

    if (!hasIdToken && !hasAdminKey) {
      // For pages → redirect to login
      if (isAdminUI) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('next', pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // For API → 401 JSON (unless has admin-key)
      if (isAdminAPI) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized: missing token/cookie or admin-key' }),
          {
            status: 401,
            headers: {
              'content-type': 'application/json',
            },
          },
        )
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|.*\\..*).*)"],
};