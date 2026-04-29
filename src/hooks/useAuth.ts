"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, type User } from "@/lib/legacy-stubs";

interface AuthUser extends Partial<User> {
  uid: string;
  email?: string | null;
  customClaims?: {
    admin?: boolean;
    role?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Get fresh token to access custom claims
        const tokenResult = await u.getIdTokenResult();
        const authUser: AuthUser = {
          ...u,
          customClaims: tokenResult.claims
        };
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading };
}

