import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

function hasSupabaseSessionCookie(request: NextRequest): boolean {
  // @supabase/ssr stores the session as sb-<project-ref>-auth-token
  // (possibly chunked with a numeric suffix).
  return request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));
}

function buildRoutingResponse(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";
  const pathname = url.pathname;

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

  // Existing admin auth logic. The login page itself must stay reachable.
  const isAdminLogin = pathname === '/portal/admin/login'
  const isAdminUI = pathname.startsWith('/portal/admin') && !isAdminLogin
  // Trailing slash so the pre-auth login endpoint /api/admin-auth (which
  // establishes the session) is not itself gated by this check.
  const isAdminAPI = pathname.startsWith('/api/admin/')

  if (isAdminUI || isAdminAPI) {
    // Check if we have auth signal
    const hasIdToken =
      request.cookies.get('idToken')?.value ||
      request.headers.get('authorization')?.startsWith('Bearer ') ||
      hasSupabaseSessionCookie(request)

    // Allow admin API routes with admin-key header (they handle their own auth)
    const hasAdminKey = request.headers.get('admin-key') || request.headers.get('X-Admin-Key')

    if (!hasIdToken && !hasAdminKey) {
      // For pages → redirect to login
      if (isAdminUI) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/portal/admin/login'
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

export async function middleware(request: NextRequest) {
  const response = buildRoutingResponse(request);

  // Refresh the Supabase session (per @supabase/ssr guidance) so server
  // components always see a valid token. No-op when Supabase env vars are
  // not configured.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anonKey && hasSupabaseSessionCookie(request)) {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });
    // getUser() validates against Supabase Auth and rotates expired tokens.
    await supabase.auth.getUser();
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|static|.*\\..*).*)"],
};
