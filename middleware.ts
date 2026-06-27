import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";
  const pathname = url.pathname;

  // DEV LOGGING - Track all incoming requests
  if (process.env.NODE_ENV === "development") {
    console.log("[middleware:incoming]", { host, pathname });
  }

  if (host === "audiojones.com") {
    url.protocol = "https:";
    url.hostname = "www.audiojones.com";
    return NextResponse.redirect(url, 308);
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
  // Trailing slash so the pre-auth login endpoint /api/admin-auth (which
  // establishes the session) is not itself gated by this check.
  const isAdminAPI = pathname.startsWith('/api/admin/')
  
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
