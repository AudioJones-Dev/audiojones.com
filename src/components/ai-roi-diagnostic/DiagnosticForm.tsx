"use client";

import { useMemo, useState } from "react";
import {
  BUSINESS_MODEL_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  FIELD_LIMITS,
  FREQUENCY_OPTIONS,
  IMPLEMENTATION_BUDGET_OPTIONS,
  INDUSTRY_OPTIONS,
  MARGIN_OPTIONS,
  MATURITY_OPTIONS,
  REVENUE_OPTIONS,
  SECURITY_OPTIONS,
  WORKFLOW_OPTIONS,
} from "@/lib/ai-roi-diagnostic/constants";
import type { DiagnosticInput } from "@/lib/ai-roi-diagnostic/types";

type DiagnosticFormProps = {
  value: DiagnosticInput;
  onChange: (next: DiagnosticInput) => void;
  onComplete: () => void;
};

type StepKey = 0 | 1 | 2 | 3 | 4;

const STEP_LABELS = [
  "Business",
  "Workflow",
  "Friction",
  "Investment",
  "Readiness",
];

const STEP_TITLES = [
  "Step 1: Business Profile",
  "Step 2: Workflow Bottleneck",
  "Step 3: Error & Friction Cost",
  "Step 4: AI Investment Estimate",
  "Step 5: AI Readiness Diagnostic",
];

const STEP_DESCRIPTIONS = [
  "Tell us about the business so the diagnostic can calibrate its assumptions.",
  "Describe the workflow you are considering automating.",
  "Estimate the friction, errors, and waiting costs in the current workflow.",
  "Estimate what you'd realistically invest to implement and maintain AI.",
  "Honest answers improve the readiness score and the recommendation quality.",
];

const inputBase =
  "w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-[#FF4500] focus:outline-none focus:ring-1 focus:ring-[#FF4500]";
const labelBase = "block text-sm font-medium text-white/85";
const helpBase = "mt-1 text-xs text-white/50";
const errorBase = "mt-1 text-xs text-[#ff8a65]";
const fieldsetBase = "grid gap-5 sm:grid-cols-2";

function clampNumber(
  value: number,
  field: keyof typeof FIELD_LIMITS,
): number {
  const { min, max } = FIELD_LIMITS[field];
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export default function DiagnosticForm({
  value,
  onChange,
  onComplete,
}: DiagnosticFormProps) {
  const [step, setStep] = useState<StepKey>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof DiagnosticInput>(
    key: K,
    next: DiagnosticInput[K],
  ) => {
    onChange({ ...value, [key]: next });
  };

  const updateNumber = (
    key: keyof typeof FIELD_LIMITS,
    raw: string,
  ) => {
    const parsed = raw === "" ? 0 : Number(raw);
    update(key as keyof DiagnosticInput, clampNumber(parsed, key) as never);
  };

  const validateStep = (which: StepKey): boolean => {
    const next: Record<string, string> = {};
    if (which === 0) {
      if (!value.industry) next.industry = "Select your industry.";
      if (!value.companySize) next.companySize = "Select your company size.";
      if (!value.monthlyRevenueRange)
        next.monthlyRevenueRange = "Select a revenue range.";
    }
    if (which === 1) {
      if (!value.workflowType) next.workflowType = "Choose a workflow.";
      if (!value.taskFrequency)
        next.taskFrequency = "Select task frequency.";
      if (!value.timePerTaskMinutes || value.timePerTaskMinutes < 1)
        next.timePerTaskMinutes = "Enter time per task in minutes.";
      if (!value.peopleInvolved || value.peopleInvolved < 1)
        next.peopleInvolved = "At least one person.";
      if (!value.hourlyLaborCost || value.hourlyLaborCost < 1)
        next.hourlyLaborCost = "Enter an hourly labor cost.";
    }
    if (which === 4) {
      if (!value.sopMaturity) next.sopMaturity = "Select an option.";
      if (!value.dataQuality) next.dataQuality = "Select an option.";
      if (!value.processClarity) next.processClarity = "Select an option.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    if (step === 4) {
      onComplete();
      return;
    }
    setStep((prev) => (prev + 1) as StepKey);
  };

  const goBack = () => {
    setStep((prev) => Math.max(0, prev - 1) as StepKey);
  };

  const progressPct = useMemo(
    () => Math.round(((step + 1) / STEP_LABELS.length) * 100),
    [step],
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-10">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/60">
          <span>
            Step {step + 1} of {STEP_LABELS.length}
          </span>
          <span aria-hidden>{progressPct}%</span>
        </div>
        <div
          className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Diagnostic progress: ${progressPct}% complete`}
        >
          <div
            className="h-full bg-[#FF4500] transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <ol className="mt-3 hidden gap-2 text-xs text-white/50 sm:flex">
          {STEP_LABELS.map((label, idx) => (
            <li
              key={label}
              className={
                idx === step
                  ? "font-semibold text-white"
                  : idx < step
                    ? "text-white/70"
                    : "text-white/40"
              }
            >
              {idx + 1}. {label}
              {idx < STEP_LABELS.length - 1 ? " ›" : ""}
            </li>
          ))}
        </ol>
      </div>

      <h2 className="text-2xl font-black text-white">{STEP_TITLES[step]}</h2>
      <p className="mt-2 text-sm text-white/65">{STEP_DESCRIPTIONS[step]}</p>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          goNext();
        }}
      >
        {step === 0 && (
          <fieldset className={fieldsetBase}>
            <legend className="sr-only">Business Profile</legend>
            <div>
              <label htmlFor="industry" className={labelBase}>
                Industry *
              </label>
              <select
                id="industry"
                className={inputBase}
                value={value.industry}
                onChange={(e) => update("industry", e.target.value)}
                aria-invalid={Boolean(errors.industry)}
                aria-describedby={errors.industry ? "industry-error" : undefined}
              >
                <option value="">Select industry…</option>
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <p id="industry-error" className={errorBase}>
                  {errors.industry}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="companySize" className={labelBase}>
                Company size *
              </label>
              <select
                id="companySize"
                className={inputBase}
                value={value.companySize}
                onChange={(e) => update("companySize", e.target.value)}
                aria-invalid={Boolean(errors.companySize)}
                aria-describedby={
                  errors.companySize ? "companySize-error" : undefined
                }
              >
                <option value="">Select company size…</option>
                {COMPANY_SIZE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.companySize && (
                <p id="companySize-error" className={errorBase}>
                  {errors.companySize}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="monthlyRevenueRange" className={labelBase}>
                Monthly revenue *
              </label>
              <select
                id="monthlyRevenueRange"
                className={inputBase}
                value={value.monthlyRevenueRange}
                onChange={(e) =>
                  update("monthlyRevenueRange", e.target.value)
                }
                aria-invalid={Boolean(errors.monthlyRevenueRange)}
                aria-describedby={
                  errors.monthlyRevenueRange
                    ? "monthlyRevenueRange-error"
                    : undefined
                }
              >
                <option value="">Select revenue range…</option>
                {REVENUE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.monthlyRevenueRange && (
                <p id="monthlyRevenueRange-error" className={errorBase}>
                  {errors.monthlyRevenueRange}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="grossMarginRange" className={labelBase}>
                Gross margin
              </label>
              <select
                id="grossMarginRange"
                className={inputBase}
                value={value.grossMarginRange}
                onChange={(e) => update("grossMarginRange", e.target.value)}
              >
                <option value="">Select margin range…</option>
                {MARGIN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="businessModel" className={labelBase}>
                Business model
              </label>
              <select
                id="businessModel"
                className={inputBase}
                value={value.businessModel}
                onChange={(e) => update("businessModel", e.target.value)}
              >
                <option value="">Select business model…</option>
                {BUSINESS_MODEL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className={fieldsetBase}>
            <legend className="sr-only">Workflow Bottleneck</legend>

            <div>
              <label htmlFor="workflowType" className={labelBase}>
                Workflow type *
              </label>
              <select
                id="workflowType"
                className={inputBase}
                value={value.workflowType}
                onChange={(e) => update("workflowType", e.target.value)}
                aria-invalid={Boolean(errors.workflowType)}
                aria-describedby={
                  errors.workflowType ? "workflowType-error" : undefined
                }
              >
                <option value="">Select workflow…</option>
                {WORKFLOW_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.workflowType && (
                <p id="workflowType-error" className={errorBase}>
                  {errors.workflowType}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="taskFrequency" className={labelBase}>
                How often is it run? *
              </label>
              <select
                id="taskFrequency"
                className={inputBase}
                value={value.taskFrequency}
                onChange={(e) => update("taskFrequency", e.target.value)}
                aria-invalid={Boolean(errors.taskFrequency)}
                aria-describedby={
                  errors.taskFrequency ? "taskFrequency-error" : undefined
                }
              >
                <option value="">Select frequency…</option>
                {FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.taskFrequency && (
                <p id="taskFrequency-error" className={errorBase}>
                  {errors.taskFrequency}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="timePerTaskMinutes" className={labelBase}>
                Time per task (minutes) *
              </label>
              <input
                id="timePerTaskMinutes"
                type="number"
                inputMode="numeric"
                className={inputBase}
                min={FIELD_LIMITS.timePerTaskMinutes.min}
                max={FIELD_LIMITS.timePerTaskMinutes.max}
                value={value.timePerTaskMinutes}
                onChange={(e) =>
                  updateNumber("timePerTaskMinutes", e.target.value)
                }
                aria-invalid={Boolean(errors.timePerTaskMinutes)}
                aria-describedby={
                  errors.timePerTaskMinutes
                    ? "timePerTaskMinutes-error"
                    : "timePerTaskMinutes-help"
                }
              />
              <p id="timePerTaskMinutes-help" className={helpBase}>
                Average minutes a person spends on one instance of the task.
              </p>
              {errors.timePerTaskMinutes && (
                <p id="timePerTaskMinutes-error" className={errorBase}>
                  {errors.timePerTaskMinutes}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="peopleInvolved" className={labelBase}>
                People involved *
              </label>
              <input
                id="peopleInvolved"
                type="number"
                inputMode="numeric"
                className={inputBase}
                min={FIELD_LIMITS.peopleInvolved.min}
                max={FIELD_LIMITS.peopleInvolved.max}
                value={value.peopleInvolved}
                onChange={(e) => updateNumber("peopleInvolved", e.target.value)}
                aria-invalid={Boolean(errors.peopleInvolved)}
                aria-describedby={
                  errors.peopleInvolved ? "peopleInvolved-error" : undefined
                }
              />
              {errors.peopleInvolved && (
                <p id="peopleInvolved-error" className={errorBase}>
                  {errors.peopleInvolved}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="hourlyLaborCost" className={labelBase}>
                Hourly labor cost (USD) *
              </label>
              <input
                id="hourlyLaborCost"
                type="number"
                inputMode="numeric"
                className={inputBase}
                min={FIELD_LIMITS.hourlyLaborCost.min}
                max={FIELD_LIMITS.hourlyLaborCost.max}
                value={value.hourlyLaborCost}
                onChange={(e) =>
                  updateNumber("hourlyLaborCost", e.target.value)
                }
                aria-invalid={Boolean(errors.hourlyLaborCost)}
                aria-describedby={
                  errors.hourlyLaborCost ? "hourlyLaborCost-error" : undefined
                }
              />
              {errors.hourlyLaborCost && (
                <p id="hourlyLaborCost-error" className={errorBase}>
                  {errors.hourlyLaborCost}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="manualHandoffs" className={labelBase}>
                Manual handoffs per task
              </label>
              <input
                id="manualHandoffs"
                type="number"
                inputMode="numeric"
                className={inputBase}
                min={FIELD_LIMITS.manualHandoffs.min}
                max={FIELD_LIMITS.manualHandoffs.max}
                value={value.manualHandoffs}
                onChange={(e) => updateNumber("manualHandoffs", e.target.value)}
              />
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className={fieldsetBase}>
            <legend className="sr-only">Error and Friction Cost</legend>

            <div>
              <label htmlFor="errorRate" className={labelBase}>
                Error rate (%)
              </label>
              <input
                id="errorRate"
                type="number"
                inputMode="numeric"
                className={inputBase}
                min={FIELD_LIMITS.errorRate.min}
                max={FIELD_LIMITS.errorRate.max}
                value={value.errorRate}
                onChange={(e) => updateNumber("errorRate", e.target.value)}
              />
              <p className={helpBase}>
                What % of tasks need rework, correction, or escalation.
              </p>
            </div>

            <div>
              <label htmlFor="reworkTimeHours" className={labelBase}>
                Rework time per error (hours)
              </label>
              <input
                id="reworkTimeHours"
                type="number"
                inputMode="numeric"
                step="0.5"
                className={inputBase}
                min={FIELD_LIMITS.reworkTimeHours.min}
                max={FIELD_LIMITS.reworkTimeHours.max}
                value={value.reworkTimeHours}
                onChange={(e) =>
                  updateNumber("reworkTimeHours", e.target.value)
                }
              />
            </div>

            <div>
              <label htmlFor="customerWaitTimeHours" className={labelBase}>
                Customer wait time (hours)
              </label>
              <input
                id="customerWaitTimeHours"
                type="number"
                inputMode="numeric"
                className={inputBase}
                min={FIELD_LIMITS.customerWaitTimeHours.min}
                max={FIELD_LIMITS.customerWaitTimeHours.max}
                value={value.customerWaitTimeHours}
                onChange={(e) =>
                  updateNumber("customerWaitTimeHours", e.target.value)
                }
              />
              <p className={helpBase}>
                Average time customers wait before this workflow completes.
              </p>
            </div>

            <div>
              <label htmlFor="toolCount" className={labelBase}>
                Tools used in this workflow
              </label>
              <input
                id="toolCount"
                type="number"
                inputMode="numeric"
                className={inputBase}
                min={FIELD_LIMITS.toolCount.min}
                max={FIELD_LIMITS.toolCount.max}
                value={value.toolCount}
                onChange={(e) => updateNumber("toolCount", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="approvalBottleneck"
                className="flex cursor-pointer items-center gap-3 rounded-md border border-white/15 bg-black/30 px-3 py-3 text-sm text-white/85"
              >
                <input
                  id="approvalBottleneck"
                  type="checkbox"
                  className="h-4 w-4 accent-[#FF4500]"
                  checked={value.approvalBottleneck}
                  onChange={(e) =>
                    update("approvalBottleneck", e.target.checked)
                  }
                />
                This workflow has an approval bottleneck (one or more people
                must sign off before it can move forward).
              </label>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className={fieldsetBase}>
            <legend className="sr-only">AI Investment Estimate</legend>

            <div>
              <label htmlFor="implementationBudgetRange" className={labelBase}>
                Implementation budget
              </label>
              <select
                id="implementationBudgetRange"
                className={inputBase}
                value={value.implementationBudgetRange}
                onChange={(e) =>
                  update("implementationBudgetRange", e.target.value)
                }
              >
                <option value="">Select implementation budget…</option>
                {IMPLEMENTATION_BUDGET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <p className={helpBase}>
                One-time spend to design and ship the AI workflow.
              </p>
            </div>

            <div>
              <label htmlFor="monthlySoftwareBudget" className={labelBase}>
                Monthly software budget (USD)
              </label>
              <input
                id="monthlySoftwareBudget"
                type="number"
                inputMode="numeric"
                className={inputBase}
                min={FIELD_LIMITS.monthlySoftwareBudget.min}
                max={FIELD_LIMITS.monthlySoftwareBudget.max}
                value={value.monthlySoftwareBudget}
                onChange={(e) =>
                  updateNumber("monthlySoftwareBudget", e.target.value)
                }
              />
            </div>

            <div>
              <label htmlFor="internalTrainingHours" className={labelBase}>
                Internal training hours
              </label>
              <input
                id="internalTrainingHours"
                type="number"
                inputMode="numeric"
                className={inputBase}
                min={FIELD_LIMITS.internalTrainingHours.min}
                max={FIELD_LIMITS.internalTrainingHours.max}
                value={value.internalTrainingHours}
                onChange={(e) =>
                  updateNumber("internalTrainingHours", e.target.value)
                }
              />
            </div>

            <div>
              <label htmlFor="humanQaHoursPerWeek" className={labelBase}>
                Human QA hours per week
              </label>
              <input
                id="humanQaHoursPerWeek"
                type="number"
                inputMode="numeric"
                className={inputBase}
                min={FIELD_LIMITS.humanQaHoursPerWeek.min}
                max={FIELD_LIMITS.humanQaHoursPerWeek.max}
                value={value.humanQaHoursPerWeek}
                onChange={(e) =>
                  updateNumber("humanQaHoursPerWeek", e.target.value)
                }
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="adoptionTimelineMonths" className={labelBase}>
                Adoption timeline (months)
              </label>
              <input
                id="adoptionTimelineMonths"
                type="number"
                inputMode="numeric"
                className={inputBase}
                min={FIELD_LIMITS.adoptionTimelineMonths.min}
                max={FIELD_LIMITS.adoptionTimelineMonths.max}
                value={value.adoptionTimelineMonths}
                onChange={(e) =>
                  updateNumber("adoptionTimelineMonths", e.target.value)
                }
              />
              <p className={helpBase}>
                Realistic time before the team uses the system without help.
              </p>
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <fieldset className={fieldsetBase}>
              <legend className="sr-only">Operational Readiness</legend>

              <MaturitySelect
                id="sopMaturity"
                label="SOP maturity *"
                value={value.sopMaturity}
                onChange={(v) => update("sopMaturity", v)}
                error={errors.sopMaturity}
              />
              <MaturitySelect
                id="dataQuality"
                label="Data quality *"
                value={value.dataQuality}
                onChange={(v) => update("dataQuality", v)}
                error={errors.dataQuality}
              />
              <MaturitySelect
                id="processClarity"
                label="Process clarity *"
                value={value.processClarity}
                onChange={(v) => update("processClarity", v)}
                error={errors.processClarity}
              />
              <MaturitySelect
                id="kpiTracking"
                label="KPI tracking"
                value={value.kpiTracking}
                onChange={(v) => update("kpiTracking", v)}
              />
              <MaturitySelect
                id="leadershipBuyIn"
                label="Leadership buy-in"
                value={value.leadershipBuyIn}
                onChange={(v) => update("leadershipBuyIn", v)}
              />
              <MaturitySelect
                id="teamAdoptionRisk"
                label="Team adoption readiness"
                value={value.teamAdoptionRisk}
                onChange={(v) => update("teamAdoptionRisk", v)}
              />
              <MaturitySelect
                id="existingAutomation"
                label="Existing automation maturity"
                value={value.existingAutomation}
                onChange={(v) => update("existingAutomation", v)}
              />

              <div>
                <label htmlFor="securityConstraints" className={labelBase}>
                  Security / compliance constraints
                </label>
                <select
                  id="securityConstraints"
                  className={inputBase}
                  value={value.securityConstraints}
                  onChange={(e) =>
                    update(
                      "securityConstraints",
                      e.target.value as DiagnosticInput["securityConstraints"],
                    )
                  }
                >
                  <option value="">Select level…</option>
                  {SECURITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[#FF4500] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#ff5a1f]"
          >
            {step === 4 ? "See My Diagnostic" : "Next →"}
          </button>
        </div>
      </form>
    </div>
  );
}

type MaturitySelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (next: DiagnosticInput["sopMaturity"]) => void;
  error?: string;
};

function MaturitySelect({
  id,
  label,
  value,
  onChange,
  error,
}: MaturitySelectProps) {
  return (
    <div>
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
      <select
        id={id}
        className={inputBase}
        value={value}
        onChange={(e) =>
          onChange(e.target.value as DiagnosticInput["sopMaturity"])
        }
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="">Select level…</option>
        {MATURITY_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className={errorBase}>
          {error}
        </p>
      )}
    </div>
  );
}
