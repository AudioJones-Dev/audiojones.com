"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_AFTER_HOURS_CAPTURE_RATE,
  DEFAULT_BURDEN_MULTIPLIER,
  DEFAULT_MISSED_CALL_RECOVERABILITY,
  DEFAULT_QUALIFIED_OPPORTUNITY_RATE,
  DEFAULT_QUOTE_RECOVERABILITY,
  DEFAULT_RESPONSE_CLOSE_RATE_LIFT,
  SCOPE_LABELS,
  SCOPE_RECOVERABILITY_PRESETS,
} from "@/lib/roi-calculator/assumptions";
import { staticLaborBenchmarkProvider } from "@/lib/roi-calculator/labor/benchmark-provider";
import { getPreset } from "@/lib/roi-calculator/presets";
import { calculateRevenueLeakScorecard, resolveScorecardContextSync } from "@/lib/roi-calculator/scorecard";
import type {
  LaborScopeEntry,
  LaborScopeKey,
  LaborWorkerType,
  RevenueLeakScorecardInput,
  RevenueLeakScorecardResult,
  WebsiteConversionInput,
} from "@/lib/roi-calculator/types";

const PRESET = getPreset("revenue_leak");

const SCOPE_ORDER: LaborScopeKey[] = [
  "calls",
  "customer_communication",
  "scheduling",
  "dispatch",
  "crm_admin",
  "quote_followup",
  "billing",
  "operations_admin",
];

const WORKER_TYPES: { value: LaborWorkerType; label: string }[] = [
  { value: "employee", label: "Employee" },
  { value: "manager", label: "Manager" },
  { value: "contractor", label: "Contractor" },
  { value: "owner", label: "Owner / founder" },
];

const initialInput: RevenueLeakScorecardInput = {
  calculationVersion: "v2-geo-economic",
  preset: "revenue_leak",
  zipCode: "",
  industry: "",
  companySize: "",
  monthlyRevenue: "",
  laborScopes: [
    { scope: "calls", hoursPerWeek: 10, workerType: "employee" },
    { scope: "quote_followup", hoursPerWeek: 4, workerType: "owner" },
  ],
  burdenMultiplier: DEFAULT_BURDEN_MULTIPLIER,
  ownerHourlyValue: undefined,
  service: { name: "", averageSaleValue: 2500, grossProfitPerSale: undefined, grossMarginPercent: undefined },
  leakage: {
    monthlyInboundOpportunities: 60,
    currentCloseRate: 30,
    missedCallsPerMonth: 12,
    afterHoursCallsPerMonth: 6,
    unfollowedQuotesPerMonth: 5,
    historicalQuoteCloseRate: undefined,
    leadsAffectedPerMonth: 15,
    inputBasis: "estimated",
  },
  errorsPerMonth: 4,
  costPerError: 150,
  preventableErrorRate: 50,
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
  "Business",
  "Operational work",
  "Sales economics",
  "Revenue leakage",
  "Readiness + lead capture",
] as const;

const STEP_EVENTS = [
  "roi_location_completed",
  "roi_labor_scope_completed",
  "roi_sales_economics_completed",
  "roi_scenario_completed",
] as const;

const DISCLAIMER =
  "These estimates are scenario-based economic models, not guarantees of savings, revenue, bookings, or profit. Actual outcomes depend on lead quality, implementation quality, staffing, customer demand, business operations, pricing, margins, market conditions, and execution.";

const selectClass = "min-h-12 w-full rounded-md border border-[var(--line-2)] bg-bg-3 px-4 py-3 text-base text-fg-0 outline-none focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]";
const inputClass = selectClass;
const secondaryButtonClass = "min-h-11 rounded-md border border-[var(--line-2)] px-5 py-3 text-sm font-semibold text-fg-1 transition hover:border-[var(--line-3)] hover:text-fg-0 focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]";

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

/**
 * Funnel events go to the GTM data layer, mirroring the Founder Gravity
 * flow. Metadata is limited to step and classification fields — no
 * financial inputs leave the browser through analytics.
 */
function track(event: string, metadata: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  win.dataLayer?.push({ event, ...metadata });
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
  placeholder,
}: {
  label: string;
  hint?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  placeholder?: string;
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
          placeholder={placeholder}
          value={value == null || !Number.isFinite(value) ? "" : value}
          onChange={(event) => {
            const raw = event.currentTarget.value;
            onChange(raw === "" ? undefined : Number(raw));
          }}
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

function computePreview(input: RevenueLeakScorecardInput): RevenueLeakScorecardResult | null {
  try {
    return calculateRevenueLeakScorecard(input, resolveScorecardContextSync(input, staticLaborBenchmarkProvider));
  } catch {
    return null;
  }
}

export default function RoiCalculator() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<RevenueLeakScorecardInput>(initialInput);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<RevenueLeakScorecardResult | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeWebsite, setIncludeWebsite] = useState(false);
  const started = useRef(false);
  const progress = Math.round(((result ? steps.length : step + 1) / steps.length) * 100);

  const preview = useMemo(() => computePreview(input), [input]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    track("roi_calculator_started", { preset: PRESET.key });
  }

  function update<K extends keyof RevenueLeakScorecardInput>(key: K, value: RevenueLeakScorecardInput[K]) {
    markStarted();
    setInput((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  }

  function updateService<K extends keyof RevenueLeakScorecardInput["service"]>(key: K, value: RevenueLeakScorecardInput["service"][K]) {
    markStarted();
    setInput((current) => ({ ...current, service: { ...current.service, [key]: value } }));
    setErrors((current) => {
      const next = { ...current };
      delete next[`service.${key as string}`];
      return next;
    });
  }

  function updateLeakage<K extends keyof RevenueLeakScorecardInput["leakage"]>(key: K, value: RevenueLeakScorecardInput["leakage"][K]) {
    markStarted();
    setInput((current) => ({ ...current, leakage: { ...current.leakage, [key]: value } }));
    setErrors((current) => {
      const next = { ...current };
      delete next[`leakage.${key as string}`];
      return next;
    });
  }

  function updateWebsite<K extends keyof WebsiteConversionInput>(key: K, value: WebsiteConversionInput[K]) {
    markStarted();
    setInput((current) => ({
      ...current,
      website: {
        monthlyWebsiteVisitors: 0,
        currentConversionRate: 0,
        modeledConversionRate: 0,
        qualifiedLeadRate: 0,
        ...current.website,
        [key]: value,
      },
    }));
  }

  function toggleScope(scope: LaborScopeKey) {
    markStarted();
    setInput((current) => {
      const exists = current.laborScopes.some((entry) => entry.scope === scope);
      return {
        ...current,
        laborScopes: exists
          ? current.laborScopes.filter((entry) => entry.scope !== scope)
          : [...current.laborScopes, { scope, hoursPerWeek: 4, workerType: "employee" }],
      };
    });
    setErrors((current) => {
      const next = { ...current };
      delete next.laborScopes;
      return next;
    });
  }

  function updateScope(scope: LaborScopeKey, patch: Partial<LaborScopeEntry>) {
    markStarted();
    setInput((current) => ({
      ...current,
      laborScopes: current.laborScopes.map((entry) => (entry.scope === scope ? { ...entry, ...patch } : entry)),
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next.laborScopes;
      return next;
    });
  }

  function validateCurrentStep() {
    const next: Record<string, string> = {};
    const percentOk = (value: number | undefined) => value == null || (Number.isFinite(value) && value >= 0 && value <= 100);
    const nonNegative = (value: number | undefined) => value != null && Number.isFinite(value) && value >= 0;

    if (step === 0) {
      if (!/^\d{5}(-\d{4})?$/.test(input.zipCode.trim())) next.zipCode = "Enter a 5-digit US ZIP code.";
      if (!input.industry) next.industry = "This field is required.";
      if (!input.companySize) next.companySize = "This field is required.";
      if (!input.monthlyRevenue) next.monthlyRevenue = "This field is required.";
    }
    if (step === 1) {
      if (input.laborScopes.length === 0) next.laborScopes = "Select at least one type of operational work.";
      for (const entry of input.laborScopes) {
        if (!Number.isFinite(entry.hoursPerWeek) || entry.hoursPerWeek < 0 || entry.hoursPerWeek > 168) {
          next.laborScopes = "Hours per week must be between 0 and 168 for each scope.";
        }
        if (!percentOk(entry.recoverabilityPercent)) next.laborScopes = "Addressability must be between 0 and 100%.";
      }
      if (input.laborScopes.length > 0 && input.laborScopes.every((entry) => entry.hoursPerWeek <= 0)) {
        next.laborScopes = "Enter hours for at least one scope.";
      }
      const burden = input.burdenMultiplier ?? DEFAULT_BURDEN_MULTIPLIER;
      if (burden < 1 || burden > 2) next.burdenMultiplier = "Burden multiplier must be between 1.0 and 2.0.";
      if (input.ownerHourlyValue != null && (input.ownerHourlyValue < 0 || input.ownerHourlyValue > 5000)) next.ownerHourlyValue = "Enter a value between $0 and $5,000.";
    }
    if (step === 2) {
      if (!input.service.name.trim()) next["service.name"] = "This field is required.";
      if (!nonNegative(input.service.averageSaleValue) || (input.service.averageSaleValue ?? 0) <= 0) next["service.averageSaleValue"] = "Enter your average sale value.";
      if (input.service.grossProfitPerSale != null && input.service.grossProfitPerSale < 0) next["service.grossProfitPerSale"] = "Gross profit cannot be negative.";
      if (
        input.service.grossProfitPerSale != null &&
        input.service.averageSaleValue != null &&
        input.service.grossProfitPerSale > input.service.averageSaleValue
      ) {
        next["service.grossProfitPerSale"] = "Gross profit cannot exceed the sale value.";
      }
      if (!percentOk(input.service.grossMarginPercent)) next["service.grossMarginPercent"] = "Margin must be between 0 and 100%.";
      if (!nonNegative(input.leakage.monthlyInboundOpportunities)) next["leakage.monthlyInboundOpportunities"] = "Enter a valid number.";
      if (!percentOk(input.leakage.currentCloseRate) || input.leakage.currentCloseRate == null) next["leakage.currentCloseRate"] = "Close rate must be between 0 and 100%.";
    }
    if (step === 3) {
      for (const key of ["missedCallsPerMonth", "afterHoursCallsPerMonth", "unfollowedQuotesPerMonth", "leadsAffectedPerMonth"] as const) {
        if (!nonNegative(input.leakage[key])) next[`leakage.${key}`] = "Enter a valid number.";
      }
      for (const key of [
        "historicalQuoteCloseRate",
        "responseCloseRateLift",
        "qualifiedOpportunityRate",
        "missedCallRecoverabilityPercent",
        "afterHoursCaptureRatePercent",
        "quoteRecoverabilityPercent",
      ] as const) {
        if (!percentOk(input.leakage[key])) next[`leakage.${key}`] = "Must be between 0 and 100%.";
      }
      if (includeWebsite && input.website) {
        if (!nonNegative(input.website.monthlyWebsiteVisitors)) next.website = "Enter a valid visitor count.";
        if (!percentOk(input.website.currentConversionRate) || !percentOk(input.website.modeledConversionRate) || !percentOk(input.website.qualifiedLeadRate)) {
          next.website = "Website rates must be between 0 and 100%.";
        }
      }
    }
    if (step === 4) {
      if (!nonNegative(input.errorsPerMonth)) next.errorsPerMonth = "Enter a valid number.";
      if (!nonNegative(input.costPerError)) next.costPerError = "Enter a valid amount.";
      if (!percentOk(input.preventableErrorRate)) next.preventableErrorRate = "Rate must be between 0 and 100%.";
      if (!nonNegative(input.avoidedHireMonthlyCost)) next.avoidedHireMonthlyCost = "Enter a valid amount.";
      if (!percentOk(input.headcountAvoidanceRate)) next.headcountAvoidanceRate = "Rate must be between 0 and 100%.";
      if (!nonNegative(input.implementationBudget)) next.implementationBudget = "Enter a valid amount.";
      if (!input.timelineExpectation) next.timelineExpectation = "This field is required.";
      if (!input.internalOwner) next.internalOwner = "This field is required.";
      if (!input.name.trim()) next.name = "This field is required.";
      if (!input.company.trim()) next.company = "This field is required.";
      if (!/^\S+@\S+\.\S+$/.test(input.email)) next.email = "Enter a valid email address.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;
    const event = STEP_EVENTS[step];
    if (event) track(event, { step: step + 1 });
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

    try {
      const params = new URLSearchParams(window.location.search);
      const utm = Object.fromEntries(
        ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
          .map((key) => [key, params.get(key) ?? undefined])
          .filter(([, value]) => value),
      );

      const payload: RevenueLeakScorecardInput = includeWebsite ? input : { ...input, website: undefined };
      const response = await fetch("/api/roi-calculator/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          calculationVersion: "v2-geo-economic",
          email: input.email,
          input: payload,
          source: "roi-calculator-page",
          utm,
          hp: "",
        }),
      });
      const body = (await response.json()) as {
        ok: boolean;
        data?: { leadId?: string; result?: RevenueLeakScorecardResult };
        error?: { message?: string };
      };
      if (!response.ok || !body.ok || !body.data?.result) {
        throw new Error(body.error?.message ?? "Unable to submit the scorecard.");
      }
      // The server's result is authoritative; the preview only guided input.
      setLeadId(body.data.leadId ?? null);
      setResult(body.data.result);
      track("roi_lead_submitted", { confidence: body.data.result.confidenceTier, primaryScenario: body.data.result.primaryLeakageScenario });
      track("roi_result_viewed", { confidence: body.data.result.confidenceTier, geographyTier: body.data.result.geography.tier });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit the scorecard.");
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
    setIncludeWebsite(false);
    setShowAdvanced(false);
  }

  const grossProfitHint =
    preview?.economics.grossProfitBasis === "revenue_only"
      ? "Revenue-based estimate. Profit impact may be materially lower. Enter gross profit or margin to tighten it."
      : preview?.economics.grossProfitBasis === "derived"
        ? `Derived from sale value × margin: ${money(preview.economics.grossProfitPerSale)} gross profit per sale.`
        : undefined;

  return (
    <section id="diagnostic" className="scroll-mt-24 border-t border-[var(--line-1)] bg-bg-1 py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-lg border border-[var(--line-2)] bg-bg-2 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">{PRESET.label}</p>
          <h2 className="mt-4 t-h2">Measure the economic value of operational friction and missed opportunity.</h2>
          <p className="mt-4 text-fg-2 leading-7">
            Priced against your actual workload, sales economics, and local labor market — not generic AI ROI assumptions.
          </p>
          <div className="mt-8 h-2 rounded-full bg-bg-4" aria-hidden>
            <div className="h-full rounded-full bg-[var(--signal)]" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-sm text-fg-2">{result ? "Results ready" : `Step ${step + 1} of ${steps.length}: ${steps[step]}`}</p>
          <dl className="mt-8 grid gap-4 text-sm">
            <div className="rounded-md border border-[var(--line-1)] bg-bg-3 p-4">
              <dt className="text-fg-2">Live modeled opportunity range</dt>
              <dd className="mt-1 t-h4">
                {preview ? `${money(preview.modeledOpportunityRange.low)}–${money(preview.modeledOpportunityRange.high)}` : "—"}
              </dd>
              <dd className="mt-1 text-xs text-fg-3">per year · base {preview ? money(preview.modeledOpportunityRange.base) : "—"}</dd>
            </div>
            <div className="rounded-md border border-[var(--line-1)] bg-bg-3 p-4">
              <dt className="text-fg-2">Labor market</dt>
              <dd className="mt-1 font-semibold text-fg-0">{preview?.geography.resolved ? preview.geography.label : "Enter a ZIP code"}</dd>
              <dd className="mt-1 text-xs text-fg-3">
                {preview?.geography.tier === "msa" ? "Metro benchmark" : preview?.geography.tier === "state" ? "Statewide benchmark" : "National benchmark"}
              </dd>
            </div>
            <div className="rounded-md border border-[var(--line-1)] bg-bg-3 p-4">
              <dt className="text-fg-2">Readiness preview</dt>
              <dd className="mt-1 t-h4">{preview ? `${preview.readinessScore}/100` : "—"}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-6 text-fg-3">
            These are modeled estimates based on your inputs and the assumptions shown — not forecasts or guarantees.
          </p>
        </aside>

        <div className="rounded-lg border border-[var(--line-2)] bg-bg-2 p-6 sm:p-10">
          {result ? (
            <ResultsPanel result={result} leadId={leadId} onRestart={restart} />
          ) : (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">{steps[step]}</p>
              <div className="mt-6 grid gap-5">
                {step === 0 ? (
                  <>
                    <Field label="ZIP code" hint="Used to price your operational work against local labor benchmarks. You do not need to know your metro area." error={errors.zipCode}>
                      <input
                        className={inputClass}
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={10}
                        value={input.zipCode}
                        onChange={(event) => update("zipCode", event.currentTarget.value)}
                      />
                    </Field>
                    {preview?.geography.resolved ? (
                      <p className="text-sm leading-6 text-fg-3">
                        Resolved to <strong className="text-fg-2">{preview.geography.label}</strong>
                        {preview.geography.tier === "msa" ? " (metro benchmark available)." : " (statewide benchmark — no metro data for this ZIP yet)."}
                      </p>
                    ) : null}
                    <SelectField label="Industry" value={input.industry} onChange={(value) => update("industry", value)} error={errors.industry} options={[
                      { value: "home-services", label: "Home services / trades" },
                      { value: "professional-services", label: "Professional services" },
                      { value: "local-services", label: "Local services" },
                      { value: "healthcare", label: "Healthcare / wellness" },
                      { value: "real-estate", label: "Real estate" },
                      { value: "ecommerce", label: "Ecommerce" },
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
                    <div className="grid gap-2">
                      <span className="text-sm font-semibold text-fg-1">Where does your team spend time every week?</span>
                      <span className="text-xs text-fg-3">Select every scope that applies, then enter hours and who does the work. Owner hours are priced separately from team hours.</span>
                      {errors.laborScopes ? <span className="text-sm text-[var(--danger)]">{errors.laborScopes}</span> : null}
                    </div>
                    <div className="grid gap-3">
                      {SCOPE_ORDER.map((scope) => {
                        const entry = input.laborScopes.find((item) => item.scope === scope);
                        const scopeResult = preview?.laborCapacity.scopes.find((item) => item.scope === scope);
                        return (
                          <div key={scope} className={`rounded-md border p-4 ${entry ? "border-[var(--line-2)] bg-bg-3" : "border-[var(--line-1)]"}`}>
                            <label className="flex items-center gap-3">
                              <input type="checkbox" checked={Boolean(entry)} onChange={() => toggleScope(scope)} className="h-4 w-4" />
                              <span className="text-sm font-semibold text-fg-0">{SCOPE_LABELS[scope]}</span>
                            </label>
                            {entry ? (
                              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                <NumberField
                                  label="Hours / week"
                                  value={entry.hoursPerWeek}
                                  onChange={(value) => updateScope(scope, { hoursPerWeek: value ?? 0 })}
                                  max={168}
                                  step={0.5}
                                />
                                <Field label="Who does it">
                                  <select className={selectClass} value={entry.workerType} onChange={(event) => updateScope(scope, { workerType: event.currentTarget.value as LaborWorkerType })}>
                                    {WORKER_TYPES.map((type) => (
                                      <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                  </select>
                                </Field>
                                <NumberField
                                  label="Addressable"
                                  hint={`Preset ${SCOPE_RECOVERABILITY_PRESETS[scope]}%`}
                                  value={entry.recoverabilityPercent}
                                  onChange={(value) => updateScope(scope, { recoverabilityPercent: value })}
                                  placeholder={String(SCOPE_RECOVERABILITY_PRESETS[scope])}
                                  max={100}
                                  suffix="%"
                                />
                                {scopeResult ? (
                                  <p className="text-xs leading-5 text-fg-3 sm:col-span-3">
                                    Priced at {money(scopeResult.loadedHourlyCost)}/hr loaded ({scopeResult.benchmark.occupationLabel}, {scopeResult.benchmark.geographyLabel}) → {money(scopeResult.annualAddressableValue)}/yr addressable.
                                  </p>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                    <NumberField
                      label="Employer burden multiplier"
                      hint={`Market wage × this = loaded labor cost. Default ${DEFAULT_BURDEN_MULTIPLIER} covers payroll taxes, benefits, and paid time. Change it if your loaded cost differs.`}
                      value={input.burdenMultiplier}
                      onChange={(value) => update("burdenMultiplier", value ?? DEFAULT_BURDEN_MULTIPLIER)}
                      error={errors.burdenMultiplier}
                      min={1}
                      max={2}
                      step={0.05}
                      suffix="×"
                    />
                    {input.laborScopes.some((entry) => entry.workerType === "owner") ? (
                      <NumberField
                        label="Owner hourly value (optional)"
                        hint="What an owner hour is worth redirected to sales, evaluations, or leadership. Shown as a separate reading, never added to the modeled figure."
                        value={input.ownerHourlyValue}
                        onChange={(value) => update("ownerHourlyValue", value)}
                        error={errors.ownerHourlyValue}
                        suffix="$"
                        placeholder="e.g. 200"
                      />
                    ) : null}
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <Field label="Primary product or service" error={errors["service.name"]}>
                      <input className={inputClass} value={input.service.name} onChange={(event) => updateService("name", event.currentTarget.value)} placeholder="e.g. HVAC replacement" />
                    </Field>
                    <NumberField
                      label="Average sale value"
                      hint="Revenue from one closed sale of that product or service."
                      value={input.service.averageSaleValue}
                      onChange={(value) => updateService("averageSaleValue", value)}
                      error={errors["service.averageSaleValue"]}
                      suffix="$"
                    />
                    <NumberField
                      label="Gross profit per sale"
                      hint="Preferred. What is left after direct labor and materials on that sale."
                      value={input.service.grossProfitPerSale}
                      onChange={(value) => updateService("grossProfitPerSale", value)}
                      error={errors["service.grossProfitPerSale"]}
                      suffix="$"
                      placeholder="Leave blank if unknown"
                    />
                    <NumberField
                      label="Average gross margin (if gross profit is unknown)"
                      value={input.service.grossMarginPercent}
                      onChange={(value) => updateService("grossMarginPercent", value)}
                      error={errors["service.grossMarginPercent"]}
                      max={100}
                      suffix="%"
                      placeholder="e.g. 45"
                    />
                    {grossProfitHint ? <p className="text-sm leading-6 text-fg-3">{grossProfitHint}</p> : null}
                    <NumberField
                      label="Monthly inbound opportunities"
                      hint="Calls, forms, and messages from prospects in a typical month. The leakage scenarios can never add up to more than this."
                      value={input.leakage.monthlyInboundOpportunities}
                      onChange={(value) => updateLeakage("monthlyInboundOpportunities", value ?? 0)}
                      error={errors["leakage.monthlyInboundOpportunities"]}
                    />
                    <NumberField
                      label="Current close rate"
                      hint="Share of qualified opportunities you currently win."
                      value={input.leakage.currentCloseRate}
                      onChange={(value) => updateLeakage("currentCloseRate", value ?? 0)}
                      error={errors["leakage.currentCloseRate"]}
                      max={100}
                      suffix="%"
                    />
                    {preview && preview.economics.grossProfitPerSale > 0 ? (
                      <p className="text-sm leading-6 text-fg-3">
                        Expected gross profit per qualified opportunity:{" "}
                        <strong className="text-fg-2">{money(preview.economics.expectedGrossProfitPerQualifiedLead)}</strong>{" "}
                        ({input.leakage.currentCloseRate}% × {money(preview.economics.grossProfitPerSale)}).
                      </p>
                    ) : null}
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <NumberField
                      label="Missed calls per month"
                      hint="Business-hours calls nobody answered or returned."
                      value={input.leakage.missedCallsPerMonth}
                      onChange={(value) => updateLeakage("missedCallsPerMonth", value ?? 0)}
                      error={errors["leakage.missedCallsPerMonth"]}
                    />
                    <NumberField
                      label="After-hours calls per month"
                      hint="Calls that arrive outside business hours and go to voicemail or nowhere."
                      value={input.leakage.afterHoursCallsPerMonth}
                      onChange={(value) => updateLeakage("afterHoursCallsPerMonth", value ?? 0)}
                      error={errors["leakage.afterHoursCallsPerMonth"]}
                    />
                    <NumberField
                      label="Quotes not followed up per month"
                      hint="Estimates sent and never chased."
                      value={input.leakage.unfollowedQuotesPerMonth}
                      onChange={(value) => updateLeakage("unfollowedQuotesPerMonth", value ?? 0)}
                      error={errors["leakage.unfollowedQuotesPerMonth"]}
                    />
                    <NumberField
                      label="Historical quote close rate (optional)"
                      hint="Share of followed-up quotes that close. Defaults to your overall close rate."
                      value={input.leakage.historicalQuoteCloseRate}
                      onChange={(value) => updateLeakage("historicalQuoteCloseRate", value)}
                      error={errors["leakage.historicalQuoteCloseRate"]}
                      max={100}
                      suffix="%"
                      placeholder={String(input.leakage.currentCloseRate)}
                    />
                    <NumberField
                      label="Leads that get a slow response per month"
                      hint="Answered eventually, but hours or days later."
                      value={input.leakage.leadsAffectedPerMonth}
                      onChange={(value) => updateLeakage("leadsAffectedPerMonth", value ?? 0)}
                      error={errors["leakage.leadsAffectedPerMonth"]}
                    />
                    <Field label="Where do these numbers come from?" hint="Measured counts raise the confidence tier; estimates lower it.">
                      <select className={selectClass} value={input.leakage.inputBasis} onChange={(event) => updateLeakage("inputBasis", event.currentTarget.value as "measured" | "estimated")}>
                        <option value="estimated">Best estimates</option>
                        <option value="measured">Call logs, CRM, or phone system reports</option>
                      </select>
                    </Field>
                    <button type="button" className="text-left text-sm font-semibold text-[var(--metric)]" onClick={() => setShowAdvanced((current) => !current)}>
                      {showAdvanced ? "Hide" : "Adjust"} recoverability assumptions
                    </button>
                    {showAdvanced ? (
                      <div className="grid gap-4 rounded-md border border-[var(--line-1)] bg-bg-3 p-4 sm:grid-cols-2">
                        <NumberField label="Qualified opportunity rate" hint={`Preset ${DEFAULT_QUALIFIED_OPPORTUNITY_RATE}%`} value={input.leakage.qualifiedOpportunityRate} onChange={(value) => updateLeakage("qualifiedOpportunityRate", value)} error={errors["leakage.qualifiedOpportunityRate"]} max={100} suffix="%" placeholder={String(DEFAULT_QUALIFIED_OPPORTUNITY_RATE)} />
                        <NumberField label="Missed-call recoverability" hint={`Preset ${DEFAULT_MISSED_CALL_RECOVERABILITY}%`} value={input.leakage.missedCallRecoverabilityPercent} onChange={(value) => updateLeakage("missedCallRecoverabilityPercent", value)} error={errors["leakage.missedCallRecoverabilityPercent"]} max={100} suffix="%" placeholder={String(DEFAULT_MISSED_CALL_RECOVERABILITY)} />
                        <NumberField label="After-hours capture rate" hint={`Preset ${DEFAULT_AFTER_HOURS_CAPTURE_RATE}%`} value={input.leakage.afterHoursCaptureRatePercent} onChange={(value) => updateLeakage("afterHoursCaptureRatePercent", value)} error={errors["leakage.afterHoursCaptureRatePercent"]} max={100} suffix="%" placeholder={String(DEFAULT_AFTER_HOURS_CAPTURE_RATE)} />
                        <NumberField label="Quote recoverability" hint={`Preset ${DEFAULT_QUOTE_RECOVERABILITY}%`} value={input.leakage.quoteRecoverabilityPercent} onChange={(value) => updateLeakage("quoteRecoverabilityPercent", value)} error={errors["leakage.quoteRecoverabilityPercent"]} max={100} suffix="%" placeholder={String(DEFAULT_QUOTE_RECOVERABILITY)} />
                        <NumberField label="Speed-to-lead close-rate lift" hint={`Preset +${DEFAULT_RESPONSE_CLOSE_RATE_LIFT} points`} value={input.leakage.responseCloseRateLift} onChange={(value) => updateLeakage("responseCloseRateLift", value)} error={errors["leakage.responseCloseRateLift"]} max={100} suffix="pts" placeholder={String(DEFAULT_RESPONSE_CLOSE_RATE_LIFT)} />
                      </div>
                    ) : null}
                    <label className="flex items-center gap-3 text-sm text-fg-1">
                      <input type="checkbox" className="h-4 w-4" checked={includeWebsite} onChange={(event) => setIncludeWebsite(event.currentTarget.checked)} />
                      Include website conversion (optional)
                    </label>
                    {includeWebsite ? (
                      <div className="grid gap-4 rounded-md border border-[var(--line-1)] bg-bg-3 p-4 sm:grid-cols-2">
                        {errors.website ? <p className="text-sm text-[var(--danger)] sm:col-span-2">{errors.website}</p> : null}
                        <NumberField label="Monthly website visitors" value={input.website?.monthlyWebsiteVisitors} onChange={(value) => updateWebsite("monthlyWebsiteVisitors", value ?? 0)} />
                        <NumberField label="Qualified lead rate" hint="Share of website leads that are real opportunities." value={input.website?.qualifiedLeadRate} onChange={(value) => updateWebsite("qualifiedLeadRate", value ?? 0)} max={100} suffix="%" />
                        <NumberField label="Current conversion rate" value={input.website?.currentConversionRate} onChange={(value) => updateWebsite("currentConversionRate", value ?? 0)} max={100} step={0.1} suffix="%" />
                        <NumberField label="Modeled conversion rate" value={input.website?.modeledConversionRate} onChange={(value) => updateWebsite("modeledConversionRate", value ?? 0)} max={100} step={0.1} suffix="%" />
                      </div>
                    ) : null}
                  </>
                ) : null}

                {step === 4 ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <NumberField label="Errors / rework per month" value={input.errorsPerMonth} onChange={(value) => update("errorsPerMonth", value ?? 0)} error={errors.errorsPerMonth} />
                      <NumberField label="Cost per error" value={input.costPerError} onChange={(value) => update("costPerError", value ?? 0)} error={errors.costPerError} suffix="$" />
                      <NumberField label="Preventable share" value={input.preventableErrorRate} onChange={(value) => update("preventableErrorRate", value ?? 0)} error={errors.preventableErrorRate} max={100} suffix="%" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <NumberField
                        label="Monthly cost of a hire you'd avoid"
                        hint="Use 0 if not applicable. Netted against addressable labor so the same hours are not counted twice."
                        value={input.avoidedHireMonthlyCost}
                        onChange={(value) => update("avoidedHireMonthlyCost", value ?? 0)}
                        error={errors.avoidedHireMonthlyCost}
                        suffix="$"
                      />
                      <NumberField label="Share of that hire you could avoid" value={input.headcountAvoidanceRate} onChange={(value) => update("headcountAvoidanceRate", value ?? 0)} error={errors.headcountAvoidanceRate} max={100} suffix="%" />
                    </div>
                    <NumberField label="Implementation budget estimate" value={input.implementationBudget} onChange={(value) => update("implementationBudget", value ?? 0)} error={errors.implementationBudget} suffix="$" />
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
                    {submitting ? "Calculating…" : "See My Revenue Leaks"}
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

function ResultsPanel({ result, leadId, onRestart }: { result: RevenueLeakScorecardResult; leadId: string | null; onRestart: () => void }) {
  const preset = getPreset(result.preset);
  const totalAddressableHours = result.laborCapacity.addressableHoursPerWeek;
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">{preset.resultHeading}</p>
      <h2 className="mt-3 t-h2">{result.recommendation}</h2>
      <p className="mt-4 text-fg-2 leading-7">{result.recommendedNextAction}</p>
      <p className="mt-2 text-sm text-fg-3">
        Priced against {result.geography.label} ·{" "}
        {result.geography.tier === "msa" ? "metro" : result.geography.tier === "state" ? "statewide" : "national"} labor benchmarks · {result.confidenceTier} confidence
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ScoreCard
          label="Operational labor exposure"
          value={`${money(result.laborCapacity.annualCurrentLaborValue)}/yr`}
          description={`${result.laborCapacity.hoursPerWeek} team hours/week on operational work at local loaded labor cost.`}
        />
        <ScoreCard
          label="Addressable operational capacity"
          value={`${money(result.laborCapacity.annualAddressableLaborValue)}/yr`}
          description={`${totalAddressableHours} hours/week a system could take over, at the addressability rates shown below.`}
        />
        <ScoreCard
          label="Revenue leakage opportunity"
          value={`${money(result.revenueLeakage.total)}/yr`}
          description={`Gross-profit value of ${result.primaryLeakageScenario === "None identified" ? "missed and unworked opportunities" : `leaks led by ${result.primaryLeakageScenario.toLowerCase()}`}.`}
        />
        <ScoreCard
          label="Owner capacity"
          value={`${result.ownerCapacity.addressableHoursPerWeek} h/week`}
          description={`Potentially redirected. Replacement cost ${money(result.ownerCapacity.replacementCostValue)}/yr${result.ownerCapacity.founderCapacityValue != null ? `; founder-capacity reading ${money(result.ownerCapacity.founderCapacityValue)}/yr (not added to the total)` : ""}.`}
        />
      </div>

      <div className="mt-6 rounded-md border border-[var(--line-1)] bg-bg-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--metric)]">Revenue leakage breakdown (annual gross profit)</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <BreakdownItem label="Missed calls" value={money(result.revenueLeakage.missedCalls)} />
          <BreakdownItem label="After-hours demand" value={money(result.revenueLeakage.afterHours)} />
          <BreakdownItem label="Quote follow-up" value={money(result.revenueLeakage.quoteFollowup)} />
          <BreakdownItem label="Delayed response (conversion upside)" value={money(result.conversionOpportunity.speedToLead)} />
          {result.conversionOpportunity.websiteConversion != null ? (
            <BreakdownItem label="Website conversion (conversion upside)" value={money(result.conversionOpportunity.websiteConversion)} />
          ) : null}
          <BreakdownItem label="Preventable errors (cost avoidance)" value={money(result.costAvoidance.errors)} />
          <BreakdownItem label="Avoided hire counted (cost avoidance)" value={money(result.costAvoidance.avoidedHireCounted)} />
        </dl>
      </div>

      <div className="mt-6 rounded-lg border border-[var(--line-2)] bg-bg-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--metric)]">Modeled economic opportunity</p>
        <p className="mt-3 t-h3">
          {money(result.modeledOpportunityRange.low)}–{money(result.modeledOpportunityRange.high)}/yr
        </p>
        <p className="mt-2 text-sm leading-6 text-fg-2">
          Base estimate {money(result.modeledOpportunityRange.base)}/yr, combined only after the overlap controls below.
          {result.paybackMonths ? ` Estimated payback on your budget: ${result.paybackMonths} months.` : ""}
        </p>
        {result.overlapControls.length > 0 ? (
          <ul className="mt-3 grid gap-1 text-xs leading-5 text-fg-3">
            {result.overlapControls.map((note) => (
              <li key={note}>• {note}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-4 rounded-md border border-[var(--line-1)] bg-bg-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--metric)]">Confidence: {result.confidenceTier}</p>
        <ul className="mt-3 grid gap-1 text-sm leading-6 text-fg-2">
          {result.confidenceReasons.map((reason) => (
            <li key={reason}>• {reason}</li>
          ))}
        </ul>
      </div>

      <details className="mt-4 rounded-md border border-[var(--line-1)] bg-bg-3 p-5">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.14em] text-[var(--metric)]">
          Assumptions and data provenance ({result.assumptions.length})
        </summary>
        <dl className="mt-4 grid gap-3 text-sm">
          {result.assumptions.map((assumption) => (
            <div key={assumption.id}>
              <dt className="text-fg-1">
                {assumption.label}: <strong className="text-fg-0">{assumption.value}</strong>
                {assumption.userOverridable ? <span className="ml-2 text-xs text-fg-3">adjustable</span> : null}
              </dt>
              <dd className="mt-1 text-xs leading-5 text-fg-3">
                {assumption.description}
                {assumption.sourceDate ? ` Data vintage: ${assumption.sourceDate}.` : ""}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-fg-3">Benchmark version {result.benchmarkVersion}. Benchmark data is periodic, not real-time.</p>
      </details>

      <p className="mt-6 text-sm leading-6 text-fg-3">{DISCLAIMER}</p>
      {leadId ? <p className="mt-4 text-sm text-fg-3">Submission ID: {leadId}</p> : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          className="btn-glow"
          href={preset.cta.href}
          onClick={() => track("roi_diagnostic_cta_clicked", { primaryScenario: result.primaryLeakageScenario })}
        >
          {preset.cta.label}
        </Link>
        <button
          type="button"
          className={secondaryButtonClass}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRestart();
          }}
        >
          Restart scorecard
        </button>
      </div>
      <p className="mt-3 text-sm text-fg-2">{preset.cta.support}</p>
    </div>
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
