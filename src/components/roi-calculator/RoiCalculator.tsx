"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  leadsPerMonth: 60,
  averageDealValue: 1500,
  currentCloseRate: 18,
  speedToLeadLift: 6,
  errorsPerMonth: 8,
  costPerError: 250,
  preventableErrorRate: 60,
  ownerHoursPerWeek: 6,
  ownerHourlyValue: 250,
  ownerRecoverableRate: 50,
  avoidedHireMonthlyCost: 0,
  headcountAvoidanceRate: 0,
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
  "Manual work",
  "Revenue leakage",
  "Error + owner bottleneck",
  "Readiness + lead capture",
] as const;

const selectClass = "min-h-12 w-full rounded-md border border-[var(--line-2)] bg-bg-3 px-4 py-3 text-base text-fg-0 outline-none focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]";
const inputClass = selectClass;
const secondaryButtonClass = "min-h-11 rounded-md border border-[var(--line-2)] px-5 py-3 text-sm font-semibold text-fg-1 transition hover:border-[var(--line-3)] hover:text-fg-0 focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]";

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-fg-1">{label}</span>
      {hint ? <span className="text-xs text-fg-3">{hint}</span> : null}
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
  hint,
  value,
  onChange,
  error,
  min = 0,
  max,
  step,
  suffix,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <Field label={label} hint={hint} error={error}>
      <div className="relative">
        <input
          className={`${inputClass} ${suffix ? "pr-12" : ""}`}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-fg-3">
            {suffix}
          </span>
        ) : null}
      </div>
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
      ["leadsPerMonth", "averageDealValue", "currentCloseRate", "speedToLeadLift"],
      [
        "errorsPerMonth",
        "costPerError",
        "preventableErrorRate",
        "ownerHoursPerWeek",
        "ownerHourlyValue",
        "ownerRecoverableRate",
      ],
      ["implementationBudget", "timelineExpectation", "internalOwner", "name", "email", "company"],
    ];

    for (const key of requiredByStep[step] ?? []) {
      const value = input[key];
      if (typeof value === "string" && value.trim().length === 0) next[key] = "This field is required.";
      if (typeof value === "number" && (!Number.isFinite(value) || value < 0)) next[key] = "Enter a valid number.";
    }
    if (step === 1 && input.hoursPerWeek < 1) next.hoursPerWeek = "Enter at least 1 hour per week.";
    if (step === 1 && input.hourlyCost < 1) next.hourlyCost = "Enter an hourly cost of at least $1.";
    if (step === 2 && input.currentCloseRate > 100) next.currentCloseRate = "Close rate cannot exceed 100%.";
    if (step === 2 && input.speedToLeadLift > 100) next.speedToLeadLift = "Lift cannot exceed 100%.";
    if (step === 3 && input.preventableErrorRate > 100) next.preventableErrorRate = "Rate cannot exceed 100%.";
    if (step === 3 && input.ownerRecoverableRate > 100) next.ownerRecoverableRate = "Rate cannot exceed 100%.";
    if (step === 4 && input.headcountAvoidanceRate > 100) next.headcountAvoidanceRate = "Rate cannot exceed 100%.";
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
      setResult(computed);
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
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">Operational Waste Recovery Calculator</p>
          <h2 className="mt-4 t-h2">Estimate the operational waste hiding inside your business.</h2>
          <p className="mt-4 text-fg-2 leading-7">
            Quantify the recovery hiding inside manual work, slow follow-up, rework, and founder bottlenecks — before adding another AI tool.
          </p>
          <div className="mt-8 h-2 rounded-full bg-bg-4" aria-hidden>
            <div className="h-full rounded-full bg-[var(--signal)]" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-sm text-fg-2">{result ? "Results ready" : `Step ${step + 1} of ${steps.length}: ${steps[step]}`}</p>
          <dl className="mt-8 grid gap-4 text-sm">
            <div className="rounded-md border border-[var(--line-1)] bg-bg-3 p-4">
              <dt className="text-fg-2">Live estimated annual recovery</dt>
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
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">Your operational waste recovery signal</p>
              <h2 className="mt-3 t-h2">{result.recommendation}</h2>
              <p className="mt-4 text-fg-2 leading-7">{result.recommendedNextAction}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <ScoreCard
                  label="Annual recovery"
                  value={money(result.annualSavings)}
                  description="Directional upside from manual labor recovery, revenue leakage, error reduction, owner capacity, and avoided headcount."
                />
                <ScoreCard label="Readiness" value={`${result.readinessScore}/100`} description={`${result.confidenceTier} confidence tier for AI execution.`} />
                <ScoreCard label="Payback" value={result.paybackMonths ? `${result.paybackMonths} mo.` : "TBD"} description="Estimated time to recoup implementation budget." />
              </div>
              <div className="mt-8 rounded-md border border-[var(--line-1)] bg-bg-3 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--metric)]">Monthly recovery breakdown</p>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
                  <BreakdownItem label="Manual labor recovery" value={money(result.savingsBreakdown.manualLaborRecovery)} />
                  <BreakdownItem label="Revenue recovery" value={money(result.savingsBreakdown.revenueRecovery)} />
                  <BreakdownItem label="Error reduction" value={money(result.savingsBreakdown.errorReduction)} />
                  <BreakdownItem label="Owner capacity unlocked" value={money(result.savingsBreakdown.ownerCapacityUnlocked)} />
                  <BreakdownItem label="Headcount avoidance" value={money(result.savingsBreakdown.headcountAvoidance)} />
                </dl>
              </div>
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
                    <SelectField label="Primary repetitive workflow" value={input.workflowType} onChange={(value) => update("workflowType", value)} error={errors.workflowType} options={[
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
                    <NumberField
                      label="Hours spent per week"
                      hint="Total hours your team spends on this repetitive workflow."
                      value={input.hoursPerWeek}
                      onChange={(value) => update("hoursPerWeek", value)}
                      error={errors.hoursPerWeek}
                      min={1}
                    />
                    <NumberField
                      label="Estimated hourly cost"
                      hint="Fully loaded cost per hour for the person doing the work."
                      value={input.hourlyCost}
                      onChange={(value) => update("hourlyCost", value)}
                      error={errors.hourlyCost}
                      min={1}
                      suffix="$"
                    />
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <NumberField
                      label="Leads per month"
                      hint="Inbound leads, demos, or applications you receive in a typical month."
                      value={input.leadsPerMonth}
                      onChange={(value) => update("leadsPerMonth", value)}
                      error={errors.leadsPerMonth}
                    />
                    <NumberField
                      label="Average deal value"
                      hint="Revenue from a single closed deal (one-time or first contract value)."
                      value={input.averageDealValue}
                      onChange={(value) => update("averageDealValue", value)}
                      error={errors.averageDealValue}
                      suffix="$"
                    />
                    <NumberField
                      label="Current close rate"
                      hint="Share of leads you currently close."
                      value={input.currentCloseRate}
                      onChange={(value) => update("currentCloseRate", value)}
                      error={errors.currentCloseRate}
                      max={100}
                      suffix="%"
                    />
                    <NumberField
                      label="Expected close-rate lift from faster follow-up"
                      hint="How many percentage points faster response could add to your close rate."
                      value={input.speedToLeadLift}
                      onChange={(value) => update("speedToLeadLift", value)}
                      error={errors.speedToLeadLift}
                      max={100}
                      suffix="%"
                    />
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <NumberField
                      label="Errors or rework events per month"
                      hint="Mistakes, redo's, or missed handoffs you catch in a typical month."
                      value={input.errorsPerMonth}
                      onChange={(value) => update("errorsPerMonth", value)}
                      error={errors.errorsPerMonth}
                    />
                    <NumberField
                      label="Average cost per error"
                      hint="Labor, refund, or churn cost per incident."
                      value={input.costPerError}
                      onChange={(value) => update("costPerError", value)}
                      error={errors.costPerError}
                      suffix="$"
                    />
                    <NumberField
                      label="Share of errors that are preventable"
                      hint="How much of that rework a better system would eliminate."
                      value={input.preventableErrorRate}
                      onChange={(value) => update("preventableErrorRate", value)}
                      error={errors.preventableErrorRate}
                      max={100}
                      suffix="%"
                    />
                    <NumberField
                      label="Owner hours/week spent in the weeds"
                      hint="Hours the founder/owner spends on work only they currently do."
                      value={input.ownerHoursPerWeek}
                      onChange={(value) => update("ownerHoursPerWeek", value)}
                      error={errors.ownerHoursPerWeek}
                    />
                    <NumberField
                      label="Owner hourly value"
                      hint="What an hour of the owner's time is worth at strategic work."
                      value={input.ownerHourlyValue}
                      onChange={(value) => update("ownerHourlyValue", value)}
                      error={errors.ownerHourlyValue}
                      suffix="$"
                    />
                    <NumberField
                      label="Share of owner hours that are recoverable"
                      hint="How much of that time a system could take off their plate."
                      value={input.ownerRecoverableRate}
                      onChange={(value) => update("ownerRecoverableRate", value)}
                      error={errors.ownerRecoverableRate}
                      max={100}
                      suffix="%"
                    />
                  </>
                ) : null}

                {step === 4 ? (
                  <>
                    <NumberField
                      label="Monthly cost of a hire you'd avoid"
                      hint="Fully loaded monthly cost of the next role you'd otherwise have to add. Use 0 if not applicable."
                      value={input.avoidedHireMonthlyCost}
                      onChange={(value) => update("avoidedHireMonthlyCost", value)}
                      error={errors.avoidedHireMonthlyCost}
                      suffix="$"
                    />
                    <NumberField
                      label="Share of that hire you could avoid with automation"
                      hint="0% if you'd still need to hire; 100% if automation fully replaces the need."
                      value={input.headcountAvoidanceRate}
                      onChange={(value) => update("headcountAvoidanceRate", value)}
                      error={errors.headcountAvoidanceRate}
                      max={100}
                      suffix="%"
                    />
                    <NumberField
                      label="Implementation budget estimate"
                      value={input.implementationBudget}
                      onChange={(value) => update("implementationBudget", value)}
                      error={errors.implementationBudget}
                      suffix="$"
                    />
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
                    {submitting ? "Calculating…" : "See My Recovery"}
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

function BreakdownItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-fg-2">{label}</dt>
      <dd className="mt-1 font-semibold text-fg-0">{value}</dd>
    </div>
  );
}