"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AI_USAGE_LEVELS,
  PRIMARY_CONSTRAINTS,
  REVENUE_RANGES,
  TIMELINE_OPTIONS,
} from "@/lib/leads/lead-schema";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
  role: string;

  annualRevenueRange: string;
  primaryConstraint: string;
  currentGrowthStage: string;
  biggestPain: string;
  whatHaveYouTried: string;

  crmUsed: string;
  analyticsUsed: string;
  projectManagementUsed: string;
  automationToolsUsed: string;
  contentSystemStatus: string;
  documentedSops: boolean;

  currentAiTools: string;
  aiUsageLevel: string;
  aiMainGoal: string;
  aiConcern: string;

  canIdentifyBestLeadSource: boolean | null;
  knowsCAC: boolean | null;
  knowsLTV: boolean | null;
  tracksConversionSource: boolean | null;
  attributionConfidence: number;
  desiredOutcome: string;

  budgetRange: string;
  timeline: string;
  preferredContactMethod: string;
  consentToContact: boolean;

  website_url: string; // honeypot
};

const INITIAL: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  companyName: "",
  website: "",
  role: "",
  annualRevenueRange: "",
  primaryConstraint: "",
  currentGrowthStage: "",
  biggestPain: "",
  whatHaveYouTried: "",
  crmUsed: "",
  analyticsUsed: "",
  projectManagementUsed: "",
  automationToolsUsed: "",
  contentSystemStatus: "",
  documentedSops: false,
  currentAiTools: "",
  aiUsageLevel: "",
  aiMainGoal: "",
  aiConcern: "",
  canIdentifyBestLeadSource: null,
  knowsCAC: null,
  knowsLTV: null,
  tracksConversionSource: null,
  attributionConfidence: 5,
  desiredOutcome: "",
  budgetRange: "",
  timeline: "",
  preferredContactMethod: "Email",
  consentToContact: false,
  website_url: "",
};

const STEPS = [
  "Business snapshot",
  "Growth constraint",
  "Current systems",
  "AI readiness",
  "Attribution",
  "Submit",
] as const;

function tracker(searchParams: URLSearchParams) {
  return {
    utmSource: searchParams.get("utm_source") || undefined,
    utmMedium: searchParams.get("utm_medium") || undefined,
    utmCampaign: searchParams.get("utm_campaign") || undefined,
    utmTerm: searchParams.get("utm_term") || undefined,
    utmContent: searchParams.get("utm_content") || undefined,
  };
}

export default function DiagnosticForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utm, setUtm] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUtm(tracker(new URLSearchParams(window.location.search)));
  }, []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const canAdvance = useMemo(() => {
    if (step === 0) {
      return state.firstName.trim().length > 0 && /\S+@\S+\.\S+/.test(state.email);
    }
    if (step === 5) {
      return state.consentToContact;
    }
    return true;
  }, [step, state]);

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/applied-intelligence/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...state,
          attributionConfidence: Number(state.attributionConfidence) || undefined,
          canIdentifyBestLeadSource:
            state.canIdentifyBestLeadSource ?? undefined,
          knowsCAC: state.knowsCAC ?? undefined,
          knowsLTV: state.knowsLTV ?? undefined,
          tracksConversionSource: state.tracksConversionSource ?? undefined,
          sourcePage: "/applied-intelligence/diagnostic",
          ...utm,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.message || data?.error || "Submission failed.");
      }
      router.push("/applied-intelligence/diagnostic/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        background:
          "linear-gradient(#0B0F1A, #0B0F1A) padding-box, linear-gradient(145deg, transparent 28%, rgba(255,69,0,0.95), rgba(59,91,255,0.9) 68%, rgba(200,169,106,0.75)) border-box",
        border: "1px solid transparent",
        borderRadius: "24px",
        boxShadow:
          "0 24px 80px rgba(0,0,0,0.35), 0 0 48px rgba(59,91,255,0.08), 0 0 32px rgba(255,69,0,0.06)",
      }}
      className="p-6 sm:p-10"
    >
      <ol className="mb-8 grid grid-cols-2 gap-2 text-xs uppercase tracking-wider text-slate-400 sm:grid-cols-6">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`rounded-md border px-3 py-2 text-center ${
              i === step
                ? "border-[#3B5BFF] bg-[#3B5BFF]/10 text-white"
                : i < step
                  ? "border-[#22C55E]/40 text-[#22C55E]"
                  : "border-white/10"
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 && <Step1 state={state} update={update} />}
      {step === 1 && <Step2 state={state} update={update} />}
      {step === 2 && <Step3 state={state} update={update} />}
      {step === 3 && <Step4 state={state} update={update} />}
      {step === 4 && <Step5 state={state} update={update} />}
      {step === 5 && <Step6 state={state} update={update} />}

      {/* Honeypot */}
      <input
        type="text"
        name="website_url"
        autoComplete="off"
        tabIndex={-1}
        value={state.website_url}
        onChange={(e) => update("website_url", e.target.value)}
        className="hidden"
        aria-hidden
      />

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-md border border-[#EF4444]/40 bg-[#EF4444]/10 p-3 text-sm text-[#EF4444]"
        >
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || submitting}
          className="rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#C8A96A]/50 hover:bg-white/5 disabled:opacity-40"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canAdvance}
            className="rounded-md bg-[#3B5BFF] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#FF4500] disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!canAdvance || submitting}
            className="rounded-md bg-[#3B5BFF] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#FF4500] disabled:opacity-40"
          >
            {submitting ? "Submitting…" : "Submit diagnostic"}
          </button>
        )}
      </div>
    </div>
  );
}

type StepProps = {
  state: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-200">
        {label}
        {required && <span className="ml-1 text-[#EF4444]">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-white/10 bg-[#05070F] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#FF4500] focus:ring-2 focus:ring-[#FF4500]/10";

function Step1({ state, update }: StepProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="First name" required>
        <input
          className={inputCls}
          value={state.firstName}
          onChange={(e) => update("firstName", e.target.value)}
        />
      </Field>
      <Field label="Last name">
        <input
          className={inputCls}
          value={state.lastName}
          onChange={(e) => update("lastName", e.target.value)}
        />
      </Field>
      <Field label="Email" required>
        <input
          type="email"
          className={inputCls}
          value={state.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </Field>
      <Field label="Phone">
        <input
          type="tel"
          className={inputCls}
          value={state.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </Field>
      <Field label="Company name">
        <input
          className={inputCls}
          value={state.companyName}
          onChange={(e) => update("companyName", e.target.value)}
        />
      </Field>
      <Field label="Website">
        <input
          type="url"
          className={inputCls}
          placeholder="https://"
          value={state.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </Field>
      <Field label="Your role">
        <input
          className={inputCls}
          placeholder="Founder, CEO, COO…"
          value={state.role}
          onChange={(e) => update("role", e.target.value)}
        />
      </Field>
      <Field label="Annual revenue">
        <select
          className={inputCls}
          value={state.annualRevenueRange}
          onChange={(e) => update("annualRevenueRange", e.target.value)}
        >
          <option value="">Select…</option>
          {REVENUE_RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

function Step2({ state, update }: StepProps) {
  return (
    <div className="grid gap-4">
      <Field label="Primary constraint">
        <select
          className={inputCls}
          value={state.primaryConstraint}
          onChange={(e) => update("primaryConstraint", e.target.value)}
        >
          <option value="">Select…</option>
          {PRIMARY_CONSTRAINTS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Current growth stage">
        <input
          className={inputCls}
          placeholder="e.g. plateaued at $1.2M, or scaling past $3M"
          value={state.currentGrowthStage}
          onChange={(e) => update("currentGrowthStage", e.target.value)}
        />
      </Field>
      <Field label="Biggest pain right now">
        <textarea
          rows={3}
          className={inputCls}
          value={state.biggestPain}
          onChange={(e) => update("biggestPain", e.target.value)}
        />
      </Field>
      <Field label="What have you tried so far?">
        <textarea
          rows={3}
          className={inputCls}
          value={state.whatHaveYouTried}
          onChange={(e) => update("whatHaveYouTried", e.target.value)}
        />
      </Field>
    </div>
  );
}

function Step3({ state, update }: StepProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="CRM in use">
        <input
          className={inputCls}
          value={state.crmUsed}
          onChange={(e) => update("crmUsed", e.target.value)}
        />
      </Field>
      <Field label="Analytics in use">
        <input
          className={inputCls}
          value={state.analyticsUsed}
          onChange={(e) => update("analyticsUsed", e.target.value)}
        />
      </Field>
      <Field label="Project management">
        <input
          className={inputCls}
          value={state.projectManagementUsed}
          onChange={(e) => update("projectManagementUsed", e.target.value)}
        />
      </Field>
      <Field label="Automation tools">
        <input
          className={inputCls}
          value={state.automationToolsUsed}
          onChange={(e) => update("automationToolsUsed", e.target.value)}
        />
      </Field>
      <Field label="Content system status">
        <input
          className={inputCls}
          placeholder="e.g. ad-hoc, calendar, full pipeline"
          value={state.contentSystemStatus}
          onChange={(e) => update("contentSystemStatus", e.target.value)}
        />
      </Field>
      <Field label="Documented SOPs?">
        <select
          className={inputCls}
          value={state.documentedSops ? "yes" : "no"}
          onChange={(e) => update("documentedSops", e.target.value === "yes")}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </Field>
    </div>
  );
}

function Step4({ state, update }: StepProps) {
  return (
    <div className="grid gap-4">
      <Field label="Current AI tools">
        <input
          className={inputCls}
          value={state.currentAiTools}
          onChange={(e) => update("currentAiTools", e.target.value)}
        />
      </Field>
      <Field label="AI usage level">
        <select
          className={inputCls}
          value={state.aiUsageLevel}
          onChange={(e) => update("aiUsageLevel", e.target.value)}
        >
          <option value="">Select…</option>
          {AI_USAGE_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Main goal for AI">
        <textarea
          rows={2}
          className={inputCls}
          value={state.aiMainGoal}
          onChange={(e) => update("aiMainGoal", e.target.value)}
        />
      </Field>
      <Field label="Biggest concern about AI">
        <textarea
          rows={2}
          className={inputCls}
          value={state.aiConcern}
          onChange={(e) => update("aiConcern", e.target.value)}
        />
      </Field>
    </div>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex gap-2">
        {([
          ["Yes", true],
          ["No", false],
        ] as const).map(([l, v]) => (
          <button
            key={l}
            type="button"
            onClick={() => onChange(v)}
            className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition ${
              value === v
                ? "border-[#3B5BFF] bg-[#3B5BFF]/15 text-white"
                : "border-white/10 text-slate-300 hover:border-white/30"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </Field>
  );
}

function Step5({ state, update }: StepProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <YesNo
        label="Can you identify your best lead source?"
        value={state.canIdentifyBestLeadSource}
        onChange={(v) => update("canIdentifyBestLeadSource", v)}
      />
      <YesNo
        label="Do you track conversion source?"
        value={state.tracksConversionSource}
        onChange={(v) => update("tracksConversionSource", v)}
      />
      <YesNo
        label="Do you know your CAC?"
        value={state.knowsCAC}
        onChange={(v) => update("knowsCAC", v)}
      />
      <YesNo
        label="Do you know your LTV?"
        value={state.knowsLTV}
        onChange={(v) => update("knowsLTV", v)}
      />
      <Field label={`Attribution confidence: ${state.attributionConfidence} / 10`}>
        <input
          type="range"
          min={1}
          max={10}
          value={state.attributionConfidence}
          onChange={(e) =>
            update("attributionConfidence", Number(e.target.value))
          }
          className="w-full accent-[#3B5BFF]"
        />
      </Field>
      <Field label="Desired outcome from this engagement">
        <textarea
          rows={2}
          className={inputCls}
          value={state.desiredOutcome}
          onChange={(e) => update("desiredOutcome", e.target.value)}
        />
      </Field>
    </div>
  );
}

function Step6({ state, update }: StepProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Budget range">
        <input
          className={inputCls}
          placeholder="e.g. $5K–$15K, $25K+"
          value={state.budgetRange}
          onChange={(e) => update("budgetRange", e.target.value)}
        />
      </Field>
      <Field label="Timeline">
        <select
          className={inputCls}
          value={state.timeline}
          onChange={(e) => update("timeline", e.target.value)}
        >
          <option value="">Select…</option>
          {TIMELINE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Preferred contact method">
        <select
          className={inputCls}
          value={state.preferredContactMethod}
          onChange={(e) => update("preferredContactMethod", e.target.value)}
        >
          <option value="Email">Email</option>
          <option value="Phone">Phone</option>
          <option value="Either">Either</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 rounded-md border border-white/10 bg-[#05070F] p-4">
          <input
            type="checkbox"
            checked={state.consentToContact}
            onChange={(e) => update("consentToContact", e.target.checked)}
            className="mt-1 h-4 w-4 accent-[#3B5BFF]"
          />
          <span className="text-sm text-slate-300">
            I consent to Audio Jones contacting me about this diagnostic
            request. I understand my information will be reviewed for fit
            before any next steps.
          </span>
        </label>
      </div>
    </div>
  );
}
