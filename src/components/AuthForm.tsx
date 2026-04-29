"use client";
import { useState } from "react";
import InputField from "@/components/InputField";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  setDoc,
  doc,
} from "@/lib/legacy-stubs";
import { auth, db } from "@/lib/firebase/client";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
        await setDoc(doc(db, "users", cred.user.uid), {
          email,
          name,
          role: "client",
          createdAt: new Date(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/portal");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          email: cred.user.email,
          name: cred.user.displayName,
          role: "client",
          updatedAt: new Date(),
        },
        { merge: true }
      );
      router.push("/portal");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleApple() {
    try {
      const provider = new OAuthProvider("apple.com");
      const cred = await signInWithPopup(auth, provider);
      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          email: cred.user.email,
          name: cred.user.displayName,
          role: "client",
          updatedAt: new Date(),
        },
        { merge: true }
      );
      router.push("/portal");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleReset() {
    if (!email) {
      setError("Enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message);
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
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {resetSent && <p className="text-green-400 text-sm">Reset email sent!</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] text-black font-semibold py-2.5 hover:opacity-90 transition"
      >
        {loading ? "Processing..." : mode === "login" ? "Log In" : "Create Account"}
      </button>

      {mode === "login" && (
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-[#FFD700] underline mt-1 self-end"
        >
          Forgot Password?
        </button>
      )}

      <div className="flex flex-col gap-2 mt-4">
        <button
          type="button"
          onClick={handleGoogle}
          className="flex items-center justify-center gap-2 bg-white text-black rounded-full py-2 font-medium hover:opacity-90"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="h-4 w-4" />
          Continue with Google
        </button>
        <button
          type="button"
          onClick={handleApple}
          className="flex items-center justify-center gap-2 bg-white text-black rounded-full py-2 font-medium hover:opacity-90"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="" className="h-4 w-4" />
          Continue with Apple
        </button>
      </div>
    </form>
  );
}

