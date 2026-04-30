"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "@/lib/legacy-stubs";
import { auth } from "@/lib/firebase/client";

type AuthUser = User & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getIdTokenResult: () => Promise<{ claims: Record<string, any> }>;
};

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
    const unsub = onAuthStateChanged(auth, async (u: AuthUser | null) => {
      if (!u) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        if (options?.redirectTo) router.replace(options.redirectTo);
        return;
      }
      let admin = false;
      try {
        const token = await u.getIdTokenResult();
        admin = !!token.claims?.admin;
      } catch {}
      setUser(u);
      setIsAdmin(admin);
      setLoading(false);
      if (options?.requireAdmin && !admin && options?.redirectTo) {
        router.replace(options.redirectTo);
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.redirectTo, options?.requireAdmin]);

  return { user, loading, isAdmin };
}

