"use client";
import { useState } from "react";
import InputField from "@/components/InputField";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  function requireSupabase() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      throw new Error("Authentication is not configured.");
    }
    return supabase;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = requireSupabase();
      if (mode === "register") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, role: "client" },
          },
        });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
      router.push("/portal");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    setError(null);
    try {
      const supabase = requireSupabase();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/portal`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  }

  async function handleReset() {
    if (!email) {
      setError("Enter your email to reset password.");
      return;
    }
    try {
      const supabase = requireSupabase();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;
      setResetSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm mx-auto bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4"
    >
      {mode === "register" && (
        <InputField
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-accent-red text-sm">{error}</p>}
      {resetSent && <p className="text-accent-green text-sm">Reset email sent!</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-signal-yellow text-bg-base font-semibold py-2.5 hover:bg-signal-soft transition"
      >
        {loading ? "Processing..." : mode === "login" ? "Log In" : "Create Account"}
      </button>

      {mode === "login" && (
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-signal-yellow underline mt-1 self-end"
        >
          Forgot Password?
        </button>
      )}

      <div className="flex flex-col gap-2 mt-4">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          className="flex items-center justify-center gap-2 bg-white text-black rounded-full py-2 font-medium hover:opacity-90"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("apple")}
          className="flex items-center justify-center gap-2 bg-white text-black rounded-full py-2 font-medium hover:opacity-90"
        >
          Continue with Apple
        </button>
      </div>
    </form>
  );
}
