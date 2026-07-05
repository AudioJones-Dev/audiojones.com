"use client";

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Shape kept compatible with the previous auth SDK so existing consumers
// (portal layout, usePersona, useFeatureFlag, AuthNav) compile unchanged.
export interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  emailVerified?: boolean;
  customClaims?: {
    admin?: boolean;
    role?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  getIdToken: () => Promise<string | undefined>;
}

export function toAuthUser(user: User, session: Session | null): AuthUser {
  const role =
    typeof user.app_metadata?.role === "string" ? user.app_metadata.role : undefined;
  return {
    uid: user.id,
    email: user.email ?? null,
    displayName:
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      null,
    photoURL: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    emailVerified: Boolean(user.email_confirmed_at),
    customClaims: {
      ...user.app_metadata,
      role,
      admin: role === "admin",
    },
    getIdToken: async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return session?.access_token;
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token;
    },
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      // Supabase not configured — behave as signed out.
      setUser(null);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session ? toAuthUser(data.session.user, data.session) : null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? toAuthUser(session.user, session) : null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, loading };
}
