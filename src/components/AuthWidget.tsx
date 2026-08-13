"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { toAuthUser, type AuthUser } from "@/hooks/useAuth";

export default function AuthWidget() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
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

  const signIn = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) throw new Error("Authentication is not configured.");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      show({ title: "Sign-in failed", variant: "error" });
    }
  };

  const signOutUser = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) throw new Error("Authentication is not configured.");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      show({ title: "Sign-out failed", variant: "error" });
    }
  };

  if (loading) return <div className="text-white/70">Checking auth…</div>;

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {user.photoURL && (
            <img src={user.photoURL} alt="avatar" className="h-8 w-8 rounded-full" />
          )}
          <span className="text-white/90 text-sm">{user.displayName || user.email}</span>
          <button
            onClick={signOutUser}
            className="rounded-full px-4 py-2 bg-white text-black text-sm font-semibold"
          >
            Sign out
          </button>
        </>
      ) : (
        <button
          onClick={signIn}
          className="rounded-full px-4 py-2 bg-white text-black text-sm font-semibold"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
