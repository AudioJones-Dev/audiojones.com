import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

/**
 * Client Authentication Helper
 *
 * Verifies a Supabase Auth JWT from the Authorization Bearer header, falling
 * back to the Supabase session cookies. Returns the verified email on
 * success, throws AuthError on failure.
 *
 * Any authenticated Supabase user can access client endpoints — no admin
 * role required (see requireAdmin.ts for the admin gate).
 */
export async function requireClient(request: NextRequest): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new AuthError('Authentication is not configured', 503);
  }

  // Primary: Authorization Bearer token.
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length);

    if (token) {
      const supabase = createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
        throw new AuthError('Invalid authentication token', 401);
      }
      if (!data.user.email) {
        throw new AuthError('Email not found in token', 401);
      }
      return data.user.email;
    }
  }

  // Fallback: Supabase session cookies on the request.
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {
        // Route handlers cannot persist refreshed cookies here; the
        // middleware owns session refresh.
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  if (!error && data.user?.email) {
    return data.user.email;
  }

  // No valid authentication found
  throw new AuthError('Authentication required - provide Bearer token or valid session', 401);
}

/**
 * Custom authentication error class for proper error handling
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Helper function to create standardized auth error responses
 */
export function createAuthErrorResponse(error: AuthError) {
  return Response.json(
    {
      ok: false,
      error: error.message === 'Authentication failed'
        ? 'unauthorized'
        : error.message.toLowerCase().replace(/\s+/g, '_')
    },
    { status: error.statusCode }
  );
}
