"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ctaLinks } from "@/config/links";
import { calculateRoiResult } from "@/lib/roi-calculator/calculations";
import type { RoiCalculatorInput, RoiCalculatorResult } from "@/lib/roi-calculator/types";

const initialInput: RoiCalculatorInput = {
  industry: "",
  companySize: "",
  monthlyRevenue: "",
  workflowType: "",
  taskFrequency: "",
  hoursPerWeek: 8,
  hourlyCost: 85,
  errorFrequency: "",
  monthlyReworkCost: 1500,
  delayPain: "",
  implementationBudget: 12000,
  timelineExpectation: "",
  internalOwner: "",
  processClarity: 3,
  dataQuality: 3,
  sopMaturity: 3,
  toolFragmentation: 3,
  teamAdoption: 3,
  name: "",
  email: "",
  company: "",
  phone: "",
  message: "",
};

const steps = [
  "Business profile",
  "Workflow bottleneck",
  "Error and friction cost",
  "Investment and readiness",
  "Lead capture",
] as const;

const selectClass = "min-h-12 w-full rounded-md border border-[var(--line-2)] bg-bg-3 px-4 py-3 text-base text-fg-0 outline-none focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]";
const inputClass = selectClass;
const secondaryButtonClass = "min-h-11 rounded-md border border-[var(--line-2)] px-5 py-3 text-sm font-semibold text-fg-1 transition hover:border-[var(--line-3)] hover:text-fg-0 focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]";
const DIAGNOSTIC_RESULT_STORAGE_KEY = "audiojones:diagnostic-result";

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function storeDiagnosticResult(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      DIAGNOSTIC_RESULT_STORAGE_KEY,
      JSON.stringify(payload),
    );
  } catch {
    // The persisted lead and client email remain the source of truth.
  }
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-fg-1">{label}</span>
      {children}
      {error ? <span className="text-sm text-[var(--danger)]">{error}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  error,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Field label={label} error={error}>
      <select className={selectClass} value={value} onChange={(event) => onChange(event.currentTarget.value)}>
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function NumberField({
  label,
  value,
  onChange,
  error,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  min?: number;
}) {
  return (
    <Field label={label} error={error}>
      <input
        className={inputClass}
        type="number"
        inputMode="decimal"
        min={min}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </Field>
  );
}

function RatingField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <Field label={label}>
      <select className={selectClass} value={value} onChange={(event) => onChange(Number(event.currentTarget.value))}>
        <option value={1}>1 — unclear</option>
        <option value={2}>2 — inconsistent</option>
        <option value={3}>3 — workable</option>
        <option value={4}>4 — strong</option>
        <option value={5}>5 — system-ready</option>
      </select>
    </Field>
  );
}

export default function RoiCalculator() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<RoiCalculatorInput>(initialInput);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<RoiCalculatorResult | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const progress = Math.round(((result ? steps.length : step + 1) / steps.length) * 100);

  const preview = useMemo(() => calculateRoiResult(input), [input]);

  function update<K extends keyof RoiCalculatorInput>(key: K, value: RoiCalculatorInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  }

  function validateCurrentStep() {
    const next: Record<string, string> = {};
    const requiredByStep: (keyof RoiCalculatorInput)[][] = [
      ["industry", "companySize", "monthlyRevenue"],
      ["workflowType", "taskFrequency", "hoursPerWeek", "hourlyCost"],
      ["errorFrequency", "monthlyReworkCost", "delayPain"],
      ["implementationBudget", "timelineExpectation", "internalOwner"],
      ["name", "email", "company"],
    ];

    for (const key of requiredByStep[step] ?? []) {
      const value = input[key];
      if (typeof value === "string" && value.trim().length === 0) next[key] = "This field is required.";
      if (typeof value === "number" && (!Number.isFinite(value) || value < 0)) next[key] = "Enter a valid number.";
    }
    if (step === 1 && input.hoursPerWeek < 1) next.hoursPerWeek = "Enter at least 1 hour per week.";
    if (step === 1 && input.hourlyCost < 1) next.hourlyCost = "Enter an hourly cost of at least $1.";
    if (step === 4 && !/^\S+@\S+\.\S+$/.test(input.email)) next.email = "Enter a valid email address.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function backStep() {
    setSubmitError(null);
    setStep((current) => Math.max(current - 1, 0));
  }

  async function submitLead() {
    if (!validateCurrentStep()) return;
    setSubmitting(true);
    setSubmitError(null);
    const computed = calculateRoiResult(input);

    try {
      const params = new URLSearchParams(window.location.search);
      const utm = Object.fromEntries(
        ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
          .map((key) => [key, params.get(key) ?? undefined])
          .filter(([, value]) => value),
      );

      const response = await fetch("/api/roi-calculator/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: input.email,
          input,
          result: computed,
          source: "roi-calculator-page",
          utm,
          hp: "",
        }),
      });
      const payload = (await response.json()) as { ok: boolean; data?: { leadId?: string }; error?: { message?: string } };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error?.message ?? "Unable to submit ROI calculator lead.");
      }
      setLeadId(payload.data?.leadId ?? null);
      storeDiagnosticResult({
        type: "roi-calculator",
        leadId: payload.data?.leadId ?? null,
        recommendation: computed.recommendation,
        recommendedNextAction: computed.recommendedNextAction,
        annualSavings: computed.annualSavings,
        monthlySavings: computed.monthlySavings,
        readinessScore: computed.readinessScore,
        confidenceTier: computed.confidenceTier,
        paybackMonths: computed.paybackMonths,
        email: input.email,
        submittedAt: new Date().toISOString(),
      });
      setResult(computed);
      router.push("/applied-intelligence/diagnostic/thank-you?source=roi-calculator");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit ROI calculator lead.");
    } finally {
      setSubmitting(false);
    }
  }

  function restart() {
    setInput(initialInput);
    setStep(0);
    setErrors({});
    setResult(null);
    setLeadId(null);
    setSubmitError(null);
  }

  return (
    <section id="diagnostic" className="scroll-mt-24 border-t border-[var(--line-1)] bg-bg-1 py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-lg border border-[var(--line-2)] bg-bg-2 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">ROI Calculator</p>
          <h2 className="mt-4 t-h2">Estimate the business case before you buy the tool.</h2>
          <p className="mt-4 text-fg-2 leading-7">
            The calculator uses simple, explainable assumptions: labor recapture, rework reduction, delay cost recovery, and readiness drag.
          </p>
          <div className="mt-8 h-2 rounded-full bg-bg-4" aria-hidden>
            <div className="h-full rounded-full bg-[var(--signal)]" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-sm text-fg-2">{result ? "Results ready" : `Step ${step + 1} of ${steps.length}: ${steps[step]}`}</p>
          <dl className="mt-8 grid gap-4 text-sm">
            <div className="rounded-md border border-[var(--line-1)] bg-bg-3 p-4">
              <dt className="text-fg-2">Live estimated annual savings</dt>
              <dd className="mt-1 t-h4">{money(preview.annualSavings)}</dd>
            </div>
            <div className="rounded-md border border-[var(--line-1)] bg-bg-3 p-4">
              <dt className="text-fg-2">Readiness preview</dt>
              <dd className="mt-1 t-h4">{preview.readinessScore}/100</dd>
            </div>
          </dl>
        </aside>

        <div className="rounded-lg border border-[var(--line-2)] bg-bg-2 p-6 sm:p-10">
          {result ? (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">Your ROI signal</p>
              <h2 className="mt-3 t-h2">{result.recommendation}</h2>
              <p className="mt-4 text-fg-2 leading-7">{result.recommendedNextAction}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <ScoreCard label="Annual savings" value={money(result.annualSavings)} description="Directional upside from labor, rework, and cycle-time recovery." />
                <ScoreCard label="Readiness" value={`${result.readinessScore}/100`} description={`${result.confidenceTier} confidence tier for AI execution.`} />
                <ScoreCard label="Payback" value={result.paybackMonths ? `${result.paybackMonths} mo.` : "TBD"} description="Estimated time to recoup implementation budget." />
              </div>
              <dl className="mt-8 grid gap-3 rounded-md border border-[var(--line-1)] bg-bg-3 p-5 text-sm sm:grid-cols-3">
                <div><dt className="text-fg-2">Labor savings</dt><dd className="mt-1 font-semibold text-fg-0">{money(result.savingsBreakdown.laborSavings)}</dd></div>
                <div><dt className="text-fg-2">Rework savings</dt><dd className="mt-1 font-semibold text-fg-0">{money(result.savingsBreakdown.reworkSavings)}</dd></div>
                <div><dt className="text-fg-2">Delay recovery</dt><dd className="mt-1 font-semibold text-fg-0">{money(result.savingsBreakdown.delayRecovery)}</dd></div>
              </dl>
              {leadId ? <p className="mt-4 text-sm text-fg-3">Submission ID: {leadId}</p> : null}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="btn-glow" href={ctaLinks.signalDiagnostic}>Take Signal Diagnostic</Link>
                <button
                  type="button"
                  className={secondaryButtonClass}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    restart();
                  }}
                >
                  Restart calculator
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">{steps[step]}</p>
              <div className="mt-6 grid gap-5">
                {step === 0 ? (
                  <>
                    <SelectField label="Industry" value={input.industry} onChange={(value) => update("industry", value)} error={errors.industry} options={[
                      { value: "professional-services", label: "Professional services" },
                      { value: "local-services", label: "Local services" },
                      { value: "ecommerce", label: "Ecommerce" },
                      { value: "healthcare", label: "Healthcare / wellness" },
                      { value: "real-estate", label: "Real estate" },
                      { value: "other", label: "Other" },
                    ]} />
                    <SelectField label="Company size" value={input.companySize} onChange={(value) => update("companySize", value)} error={errors.companySize} options={[
                      { value: "1-5", label: "1–5 people" },
                      { value: "6-20", label: "6–20 people" },
                      { value: "21-75", label: "21–75 people" },
                      { value: "76-plus", label: "76+ people" },
                    ]} />
                    <SelectField label="Monthly revenue range" value={input.monthlyRevenue} onChange={(value) => update("monthlyRevenue", value)} error={errors.monthlyRevenue} options={[
                      { value: "under-25k", label: "Under $25k" },
                      { value: "25k-100k", label: "$25k–$100k" },
                      { value: "100k-500k", label: "$100k–$500k" },
                      { value: "500k-plus", label: "$500k+" },
                    ]} />
                  </>
                ) : null}

                {step === 1 ? (
                  <>
                    <SelectField label="Workflow type" value={input.workflowType} onChange={(value) => update("workflowType", value)} error={errors.workflowType} options={[
                      { value: "lead-routing", label: "Lead routing / qualification" },
                      { value: "client-onboarding", label: "Client onboarding" },
                      { value: "reporting", label: "Reporting / analysis" },
                      { value: "support", label: "Support / operations" },
                      { value: "content", label: "Content or campaign production" },
                      { value: "other", label: "Other repetitive workflow" },
                    ]} />
                    <SelectField label="Task frequency" value={input.taskFrequency} onChange={(value) => update("taskFrequency", value)} error={errors.taskFrequency} options={[
                      { value: "daily", label: "Daily" },
                      { value: "weekly", label: "Weekly" },
                      { value: "monthly", label: "Monthly" },
                      { value: "occasional", label: "Occasional" },
                    ]} />
                    <NumberField label="Hours spent per week" value={input.hoursPerWeek} onChange={(value) => update("hoursPerWeek", value)} error={errors.hoursPerWeek} min={1} />
                    <NumberField label="Estimated hourly cost" value={input.hourlyCost} onChange={(value) => update("hourlyCost", value)} error={errors.hourlyCost} min={1} />
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <SelectField label="Error/rework frequency" value={input.errorFrequency} onChange={(value) => update("errorFrequency", value)} error={errors.errorFrequency} options={[
                      { value: "high", label: "High — frequent mistakes or rework" },
                      { value: "medium", label: "Medium — noticeable each month" },
                      { value: "low", label: "Low — occasional" },
                      { value: "unknown", label: "Unknown / not tracked" },
                    ]} />
                    <NumberField label="Estimated monthly rework cost" value={input.monthlyReworkCost} onChange={(value) => update("monthlyReworkCost", value)} error={errors.monthlyReworkCost} />
                    <SelectField label="Delay/cycle-time pain" value={input.delayPain} onChange={(value) => update("delayPain", value)} error={errors.delayPain} options={[
                      { value: "severe", label: "Severe — delays cost revenue" },
                      { value: "moderate", label: "Moderate — delays slow delivery" },
                      { value: "light", label: "Light — mostly annoyance" },
                      { value: "unclear", label: "Unclear / not measured" },
                    ]} />
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <NumberField label="Implementation budget estimate" value={input.implementationBudget} onChange={(value) => update("implementationBudget", value)} error={errors.implementationBudget} />
                    <SelectField label="Timeline expectation" value={input.timelineExpectation} onChange={(value) => update("timelineExpectation", value)} error={errors.timelineExpectation} options={[
                      { value: "30-days", label: "Within 30 days" },
                      { value: "quarter", label: "This quarter" },
                      { value: "6-months", label: "Next 6 months" },
                      { value: "exploring", label: "Exploring only" },
                    ]} />
                    <SelectField label="Internal owner/readiness" value={input.internalOwner} onChange={(value) => update("internalOwner", value)} error={errors.internalOwner} options={[
                      { value: "clear-owner", label: "Clear owner is assigned" },
                      { value: "founder-led", label: "Founder will own it" },
                      { value: "shared", label: "Shared ownership" },
                      { value: "unclear", label: "No clear owner yet" },
                    ]} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <RatingField label="Process clarity" value={input.processClarity} onChange={(value) => update("processClarity", value)} />
                      <RatingField label="Data quality" value={input.dataQuality} onChange={(value) => update("dataQuality", value)} />
                      <RatingField label="SOP maturity" value={input.sopMaturity} onChange={(value) => update("sopMaturity", value)} />
                      <RatingField label="Tool fragmentation" value={input.toolFragmentation} onChange={(value) => update("toolFragmentation", value)} />
                      <RatingField label="Team adoption readiness" value={input.teamAdoption} onChange={(value) => update("teamAdoption", value)} />
                    </div>
                  </>
                ) : null}

                {step === 4 ? (
                  <>
                    <Field label="Name" error={errors.name}><input className={inputClass} value={input.name} onChange={(event) => update("name", event.currentTarget.value)} /></Field>
                    <Field label="Email" error={errors.email}><input className={inputClass} type="email" inputMode="email" autoComplete="email" value={input.email} onChange={(event) => update("email", event.currentTarget.value)} /></Field>
                    <Field label="Company" error={errors.company}><input className={inputClass} value={input.company} onChange={(event) => update("company", event.currentTarget.value)} /></Field>
                    <Field label="Phone (optional)"><input className={inputClass} type="tel" inputMode="tel" autoComplete="tel" value={input.phone ?? ""} onChange={(event) => update("phone", event.currentTarget.value)} /></Field>
                    <Field label="Context (optional)"><textarea className={`${inputClass} min-h-28`} value={input.message ?? ""} onChange={(event) => update("message", event.currentTarget.value)} /></Field>
                    {submitError ? <p className="rounded-md border border-[var(--danger)]/60 bg-bg-3 p-4 text-sm text-fg-1">{submitError}</p> : null}
                  </>
                ) : null}
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  className={secondaryButtonClass}
                  disabled={step === 0 || submitting}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    backStep();
                  }}
                >
                  Back
                </button>
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    className="btn-glow w-full sm:w-auto"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      nextStep();
                    }}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-glow w-full sm:w-auto disabled:cursor-wait disabled:opacity-60"
                    disabled={submitting}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void submitLead();
                    }}
                  >
                    {submitting ? "Calculating…" : "See My ROI"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ScoreCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="rounded-lg border border-[var(--line-2)] bg-bg-3 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--metric)]">{label}</p>
      <p className="mt-3 t-h3">{value}</p>
      <p className="mt-3 text-sm leading-6 text-fg-2">{description}</p>
    </div>
  );
}
