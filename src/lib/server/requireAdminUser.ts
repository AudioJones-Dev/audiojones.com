import "server-only";

import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthError } from "./requireClient";

// Supabase-user admin gate. Distinct from requireAdmin.ts, which gates
// machine callers via the ADMIN_KEY header.

/**
 * Admin check: email is on the ADMIN_EMAILS allowlist (comma-separated,
 * server-only env) OR the Supabase user carries app_metadata.role === "admin".
 */
export function isAdminUser(user: User): boolean {
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const email = user.email?.toLowerCase();
  if (email && allowlist.includes(email)) return true;

  return user.app_metadata?.role === "admin";
}

/**
 * Verifies a Supabase user from an Authorization Bearer token (when a
 * request is provided) or from the session cookies, then enforces the
 * admin check. Throws AuthError (401 unauthenticated / 403 not admin).
 */
export async function requireAdminUser(request?: NextRequest): Promise<User> {
  const user = await getVerifiedUser(request);
  if (!user) {
    throw new AuthError("Authentication required", 401);
  }
  if (!isAdminUser(user)) {
    throw new AuthError("Admin access required", 403);
  }
  return user;
}

/**
 * Resolves and verifies the current Supabase user (no admin check).
 * Returns null when unauthenticated or when Supabase is not configured.
 * Verification always goes through supabase.auth.getUser() — never trust
 * getSession() on the server.
 */
export async function getVerifiedUser(request?: NextRequest): Promise<User | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  // Prefer an explicit Bearer token when the caller passed the request.
  const authHeader = request?.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length);
    if (token) {
      const supabase = createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await supabase.auth.getUser(token);
      return !error && data.user ? data.user : null;
    }
  }

  // Cookie-based session.
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  return !error && data.user ? data.user : null;
}
