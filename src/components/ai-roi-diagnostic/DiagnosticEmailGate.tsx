"use client";

import { useState } from "react";
import { mockLeadCapture } from "@/lib/ai-roi-diagnostic/mockLeadCapture";
import type {
  DiagnosticInput,
  DiagnosticResult,
} from "@/lib/ai-roi-diagnostic/types";

type DiagnosticEmailGateProps = {
  input: DiagnosticInput;
  result: DiagnosticResult;
};

const inputBase =
  "w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-[#FF4500] focus:outline-none focus:ring-1 focus:ring-[#FF4500]";
const labelBase = "block text-sm font-medium text-white/85";

export default function DiagnosticEmailGate({
  input,
  result,
}: DiagnosticEmailGateProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (submitted) {
    return (
      <div
        className="rounded-2xl border border-[#FF4500]/30 bg-black/40 p-8"
        role="status"
        aria-live="polite"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FF4500]">
          Report Saved
        </p>
        <h3 className="mt-2 text-2xl font-black text-white">
          Your report is ready.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          For now, this MVP stores your diagnostic locally and prepares the
          report data for the future email/PDF workflow. We&apos;ll follow up
          when delivery is enabled.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !email.trim()) {
      setError("First name and email are required.");
      return;
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailValid) {
      setError("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      await mockLeadCapture({
        firstName: firstName.trim(),
        email: email.trim(),
        companyName: companyName.trim() || undefined,
        input,
        result,
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong saving your report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#FF4500]">
        Want the full breakdown?
      </p>
      <h3 className="mt-2 text-2xl font-black text-white">
        Get your detailed AI ROI report.
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
        Score explanation, estimated savings, risk factors, and your
        recommended next step.
      </p>

      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName" className={labelBase}>
            First name
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            required
            className={inputBase}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="companyName" className={labelBase}>
            Company (optional)
          </label>
          <input
            id="companyName"
            type="text"
            autoComplete="organization"
            className={inputBase}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className={labelBase}>
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className={inputBase}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && (
          <p
            role="alert"
            aria-live="assertive"
            className="sm:col-span-2 text-sm text-[#ff8a65]"
          >
            {error}
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#FF4500] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#ff5a1f] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting ? "Saving…" : "Send My Full Report"}
          </button>
          <p className="mt-3 text-xs text-white/50">
            We won&apos;t spam you. This MVP stores your report data locally
            until email delivery is enabled.
          </p>
        </div>
      </form>
    </div>
  );
}
