"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { toAuthUser, type AuthUser } from "@/hooks/useAuth";

type Options = {
  redirectTo?: string; // e.g. "/login"
  requireAdmin?: boolean;
};

export function useRequireAuth(options?: Options) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      if (options?.redirectTo) router.replace(options.redirectTo);
      return;
    }

    const apply = (sessionUser: AuthUser | null) => {
      if (!sessionUser) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        if (options?.redirectTo) router.replace(options.redirectTo);
        return;
      }
      const admin = sessionUser.customClaims?.admin === true;
      setUser(sessionUser);
      setIsAdmin(admin);
      setLoading(false);
      if (options?.requireAdmin && !admin && options?.redirectTo) {
        router.replace(options.redirectTo);
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      apply(data.session ? toAuthUser(data.session.user, data.session) : null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      apply(session ? toAuthUser(session.user, session) : null);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.redirectTo, options?.requireAdmin]);

  return { user, loading, isAdmin };
}
