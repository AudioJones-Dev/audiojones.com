"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { mockLeadCapture } from "@/lib/ai-roi-diagnostic/mockLeadCapture";
import type {
  DiagnosticInput,
  DiagnosticResult,
} from "@/lib/ai-roi-diagnostic/types";

type DiagnosticEmailGateProps = {
  input: DiagnosticInput;
  result: DiagnosticResult;
};

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
        className="rounded-2xl border border-[var(--line-blue)] bg-bg-2 p-8"
        role="status"
        aria-live="polite"
      >
        <Eyebrow tone="blue">Report Saved</Eyebrow>
        <h3 className="mt-3 t-h3 text-fg-0">Your report summary is ready.</h3>
        <p className="mt-3 t-body text-fg-2">
          We&apos;ll send the full breakdown when delivery is enabled.
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
    <div className="rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6 sm:p-8">
      <Eyebrow tone="gold">Want the full breakdown?</Eyebrow>
      <h3 className="mt-3 t-h3 text-fg-0">Get your detailed AI ROI report.</h3>
      <p className="mt-3 t-body text-fg-2">
        Score explanation, estimated savings, risk factors, and your recommended
        next step.
      </p>

      <form
        className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2"
        onSubmit={handleSubmit}
        noValidate
      >
        <FormField id="firstName" label="First name" required>
          <Input
            id="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </FormField>
        <FormField id="companyName" label="Company" hint="Optional">
          <Input
            id="companyName"
            type="text"
            autoComplete="organization"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </FormField>
        <FormField
          id="email"
          label="Work email"
          required
          className="sm:col-span-2"
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>

        {error && (
          <p
            role="alert"
            aria-live="assertive"
            className="t-small text-[color:var(--danger)] sm:col-span-2"
          >
            {error}
          </p>
        )}

        <div className="sm:col-span-2">
          <Button type="submit" variant="glow" size="lg" disabled={submitting}>
            {submitting ? "Saving…" : "Send My Full Report"}
          </Button>
          <p className="mt-3 t-small text-fg-3">
            We won&apos;t spam you. Your report summary is ready, and we&apos;ll
            send the full breakdown when delivery is enabled.
          </p>
        </div>
      </form>
    </div>
  );
}
