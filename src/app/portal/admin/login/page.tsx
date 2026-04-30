"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase/client";
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "@/lib/legacy-stubs";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        router.replace("/portal/admin");
      }
    });
    return () => unsub();
  }, [router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/portal/admin");
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.replace("/portal/admin");
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur rounded-xl border border-white/10 p-8 space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-white">AudioJones Admin</h1>
          <p className="text-slate-300 text-sm">Sign in to manage ops, automation, and portal.</p>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-100 text-sm rounded-md p-3">
            {error}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleEmailSignIn}>
          <div className="space-y-2">
            <label className="text-sm text-slate-200" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 transition text-white font-medium py-2 rounded-md"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-slate-400 text-xs">or</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full border border-slate-600 hover:border-slate-400 transition text-white py-2 rounded-md"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}