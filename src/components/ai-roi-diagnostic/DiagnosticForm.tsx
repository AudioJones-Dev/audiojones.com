"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
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

const STEP_LABELS = ["Business", "Workflow", "Friction", "Investment", "Readiness"];

const STEP_TITLES = [
  "Business Profile",
  "Workflow Bottleneck",
  "Error & Friction Cost",
  "AI Investment Estimate",
  "AI Readiness Diagnostic",
];

const STEP_DESCRIPTIONS = [
  "Tell us about the business so the diagnostic can calibrate its assumptions.",
  "Describe the workflow you are considering automating.",
  "Estimate the friction, errors, and waiting costs in the current workflow.",
  "Estimate what you'd realistically invest to implement and maintain AI.",
  "Honest answers improve the readiness score and the recommendation quality.",
];

const opt = <T extends string>(arr: ReadonlyArray<T>) =>
  arr.map((v) => ({ value: v, label: v }));

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

  const updateNumber = (key: keyof typeof FIELD_LIMITS, raw: string) => {
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
      if (!value.taskFrequency) next.taskFrequency = "Select task frequency.";
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
    <div className="rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6 sm:p-10">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between t-small text-fg-2">
          <span className="font-semibold uppercase tracking-[0.18em]">
            Step {step + 1} of {STEP_LABELS.length}
          </span>
          <span aria-hidden>{progressPct}%</span>
        </div>
        <div
          className="mt-2 h-1 w-full overflow-hidden rounded-full bg-bg-3"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Diagnostic progress: ${progressPct}% complete`}
        >
          <div
            className="h-full bg-aj-orange transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <ol className="mt-3 hidden gap-2 t-small text-fg-3 sm:flex">
          {STEP_LABELS.map((label, idx) => (
            <li
              key={label}
              className={
                idx === step
                  ? "font-semibold text-fg-0"
                  : idx < step
                    ? "text-fg-2"
                    : "text-fg-3"
              }
            >
              {idx + 1}. {label}
              {idx < STEP_LABELS.length - 1 ? " ›" : ""}
            </li>
          ))}
        </ol>
      </div>

      <Eyebrow tone="gold">Step {step + 1}</Eyebrow>
      <h2 className="mt-3 t-h3 text-fg-0">{STEP_TITLES[step]}</h2>
      <p className="mt-2 t-body text-fg-2">{STEP_DESCRIPTIONS[step]}</p>

      <form
        className="mt-7"
        onSubmit={(e) => {
          e.preventDefault();
          goNext();
        }}
        noValidate
      >
        {step === 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField id="industry" label="Industry" required error={errors.industry}>
              <Select
                id="industry"
                placeholder="Select industry"
                options={opt(INDUSTRY_OPTIONS)}
                value={value.industry}
                onChange={(e) => update("industry", e.target.value)}
                invalid={!!errors.industry}
              />
            </FormField>
            <FormField id="companySize" label="Company size" required error={errors.companySize}>
              <Select
                id="companySize"
                placeholder="Select company size"
                options={opt(COMPANY_SIZE_OPTIONS)}
                value={value.companySize}
                onChange={(e) => update("companySize", e.target.value)}
                invalid={!!errors.companySize}
              />
            </FormField>
            <FormField
              id="monthlyRevenueRange"
              label="Monthly revenue"
              required
              error={errors.monthlyRevenueRange}
            >
              <Select
                id="monthlyRevenueRange"
                placeholder="Select revenue range"
                options={opt(REVENUE_OPTIONS)}
                value={value.monthlyRevenueRange}
                onChange={(e) => update("monthlyRevenueRange", e.target.value)}
                invalid={!!errors.monthlyRevenueRange}
              />
            </FormField>
            <FormField id="grossMarginRange" label="Gross margin" hint="Optional">
              <Select
                id="grossMarginRange"
                placeholder="Select margin range"
                options={opt(MARGIN_OPTIONS)}
                value={value.grossMarginRange}
                onChange={(e) => update("grossMarginRange", e.target.value)}
              />
            </FormField>
            <FormField
              id="businessModel"
              label="Business model"
              hint="Optional"
              className="sm:col-span-2"
            >
              <Select
                id="businessModel"
                placeholder="Select business model"
                options={opt(BUSINESS_MODEL_OPTIONS)}
                value={value.businessModel}
                onChange={(e) => update("businessModel", e.target.value)}
              />
            </FormField>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField id="workflowType" label="Workflow type" required error={errors.workflowType}>
              <Select
                id="workflowType"
                placeholder="Select workflow"
                options={opt(WORKFLOW_OPTIONS)}
                value={value.workflowType}
                onChange={(e) => update("workflowType", e.target.value)}
                invalid={!!errors.workflowType}
              />
            </FormField>
            <FormField
              id="taskFrequency"
              label="How often is it run?"
              required
              error={errors.taskFrequency}
            >
              <Select
                id="taskFrequency"
                placeholder="Select frequency"
                options={opt(FREQUENCY_OPTIONS)}
                value={value.taskFrequency}
                onChange={(e) => update("taskFrequency", e.target.value)}
                invalid={!!errors.taskFrequency}
              />
            </FormField>
            <FormField
              id="timePerTaskMinutes"
              label="Time per task (minutes)"
              required
              hint="Average minutes a person spends on one instance of the task."
              error={errors.timePerTaskMinutes}
            >
              <Input
                id="timePerTaskMinutes"
                type="number"
                inputMode="numeric"
                min={FIELD_LIMITS.timePerTaskMinutes.min}
                max={FIELD_LIMITS.timePerTaskMinutes.max}
                value={value.timePerTaskMinutes}
                onChange={(e) => updateNumber("timePerTaskMinutes", e.target.value)}
                invalid={!!errors.timePerTaskMinutes}
              />
            </FormField>
            <FormField
              id="peopleInvolved"
              label="People involved"
              required
              error={errors.peopleInvolved}
            >
              <Input
                id="peopleInvolved"
                type="number"
                inputMode="numeric"
                min={FIELD_LIMITS.peopleInvolved.min}
                max={FIELD_LIMITS.peopleInvolved.max}
                value={value.peopleInvolved}
                onChange={(e) => updateNumber("peopleInvolved", e.target.value)}
                invalid={!!errors.peopleInvolved}
              />
            </FormField>
            <FormField
              id="hourlyLaborCost"
              label="Hourly labor cost (USD)"
              required
              error={errors.hourlyLaborCost}
            >
              <Input
                id="hourlyLaborCost"
                type="number"
                inputMode="numeric"
                min={FIELD_LIMITS.hourlyLaborCost.min}
                max={FIELD_LIMITS.hourlyLaborCost.max}
                value={value.hourlyLaborCost}
                onChange={(e) => updateNumber("hourlyLaborCost", e.target.value)}
                invalid={!!errors.hourlyLaborCost}
              />
            </FormField>
            <FormField id="manualHandoffs" label="Manual handoffs per task">
              <Input
                id="manualHandoffs"
                type="number"
                inputMode="numeric"
                min={FIELD_LIMITS.manualHandoffs.min}
                max={FIELD_LIMITS.manualHandoffs.max}
                value={value.manualHandoffs}
                onChange={(e) => updateNumber("manualHandoffs", e.target.value)}
              />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              id="errorRate"
              label="Error rate (%)"
              hint="What percent of tasks need rework, correction, or escalation."
            >
              <Input
                id="errorRate"
                type="number"
                inputMode="numeric"
                min={FIELD_LIMITS.errorRate.min}
                max={FIELD_LIMITS.errorRate.max}
                value={value.errorRate}
                onChange={(e) => updateNumber("errorRate", e.target.value)}
              />
            </FormField>
            <FormField id="reworkTimeHours" label="Rework time per error (hours)">
              <Input
                id="reworkTimeHours"
                type="number"
                inputMode="decimal"
                step="0.5"
                min={FIELD_LIMITS.reworkTimeHours.min}
                max={FIELD_LIMITS.reworkTimeHours.max}
                value={value.reworkTimeHours}
                onChange={(e) => updateNumber("reworkTimeHours", e.target.value)}
              />
            </FormField>
            <FormField
              id="customerWaitTimeHours"
              label="Customer wait time (hours)"
              hint="Average time customers wait before this workflow completes."
            >
              <Input
                id="customerWaitTimeHours"
                type="number"
                inputMode="numeric"
                min={FIELD_LIMITS.customerWaitTimeHours.min}
                max={FIELD_LIMITS.customerWaitTimeHours.max}
                value={value.customerWaitTimeHours}
                onChange={(e) =>
                  updateNumber("customerWaitTimeHours", e.target.value)
                }
              />
            </FormField>
            <FormField id="toolCount" label="Tools used in this workflow">
              <Input
                id="toolCount"
                type="number"
                inputMode="numeric"
                min={FIELD_LIMITS.toolCount.min}
                max={FIELD_LIMITS.toolCount.max}
                value={value.toolCount}
                onChange={(e) => updateNumber("toolCount", e.target.value)}
              />
            </FormField>
            <div className="sm:col-span-2">
              <Checkbox
                id="approvalBottleneck"
                label="This workflow has an approval bottleneck"
                hint="One or more people must sign off before it can move forward."
                checked={value.approvalBottleneck}
                onChange={(e) => update("approvalBottleneck", e.target.checked)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              id="implementationBudgetRange"
              label="Implementation budget"
              hint="One-time spend to design and ship the AI workflow."
            >
              <Select
                id="implementationBudgetRange"
                placeholder="Select implementation budget"
                options={opt(IMPLEMENTATION_BUDGET_OPTIONS)}
                value={value.implementationBudgetRange}
                onChange={(e) =>
                  update("implementationBudgetRange", e.target.value)
                }
              />
            </FormField>
            <FormField id="monthlySoftwareBudget" label="Monthly software budget (USD)">
              <Input
                id="monthlySoftwareBudget"
                type="number"
                inputMode="numeric"
                min={FIELD_LIMITS.monthlySoftwareBudget.min}
                max={FIELD_LIMITS.monthlySoftwareBudget.max}
                value={value.monthlySoftwareBudget}
                onChange={(e) =>
                  updateNumber("monthlySoftwareBudget", e.target.value)
                }
              />
            </FormField>
            <FormField id="internalTrainingHours" label="Internal training hours">
              <Input
                id="internalTrainingHours"
                type="number"
                inputMode="numeric"
                min={FIELD_LIMITS.internalTrainingHours.min}
                max={FIELD_LIMITS.internalTrainingHours.max}
                value={value.internalTrainingHours}
                onChange={(e) =>
                  updateNumber("internalTrainingHours", e.target.value)
                }
              />
            </FormField>
            <FormField id="humanQaHoursPerWeek" label="Human QA hours per week">
              <Input
                id="humanQaHoursPerWeek"
                type="number"
                inputMode="numeric"
                min={FIELD_LIMITS.humanQaHoursPerWeek.min}
                max={FIELD_LIMITS.humanQaHoursPerWeek.max}
                value={value.humanQaHoursPerWeek}
                onChange={(e) =>
                  updateNumber("humanQaHoursPerWeek", e.target.value)
                }
              />
            </FormField>
            <FormField
              id="adoptionTimelineMonths"
              label="Adoption timeline (months)"
              hint="Realistic time before the team uses the system without help."
              className="sm:col-span-2"
            >
              <Input
                id="adoptionTimelineMonths"
                type="number"
                inputMode="numeric"
                min={FIELD_LIMITS.adoptionTimelineMonths.min}
                max={FIELD_LIMITS.adoptionTimelineMonths.max}
                value={value.adoptionTimelineMonths}
                onChange={(e) =>
                  updateNumber("adoptionTimelineMonths", e.target.value)
                }
              />
            </FormField>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <MaturitySelect
              id="sopMaturity"
              label="SOP maturity"
              required
              value={value.sopMaturity}
              onChange={(v) => update("sopMaturity", v)}
              error={errors.sopMaturity}
            />
            <MaturitySelect
              id="dataQuality"
              label="Data quality"
              required
              value={value.dataQuality}
              onChange={(v) => update("dataQuality", v)}
              error={errors.dataQuality}
            />
            <MaturitySelect
              id="processClarity"
              label="Process clarity"
              required
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
            <FormField
              id="securityConstraints"
              label="Security / compliance constraints"
            >
              <Select
                id="securityConstraints"
                placeholder="Select level"
                options={opt(SECURITY_OPTIONS)}
                value={value.securityConstraints}
                onChange={(e) =>
                  update(
                    "securityConstraints",
                    e.target.value as DiagnosticInput["securityConstraints"],
                  )
                }
              />
            </FormField>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={step === 0}
          >
            ← Back
          </Button>
          <Button type="submit" variant="glow" size="lg">
            {step === 4 ? "See My Diagnostic" : "Next →"}
          </Button>
        </div>
      </form>
    </div>
  );
}

type MaturitySelectProps = {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (next: DiagnosticInput["sopMaturity"]) => void;
  error?: string;
};

function MaturitySelect({
  id,
  label,
  required,
  value,
  onChange,
  error,
}: MaturitySelectProps) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <Select
        id={id}
        placeholder="Select level"
        options={opt(MATURITY_OPTIONS)}
        value={value}
        onChange={(e) =>
          onChange(e.target.value as DiagnosticInput["sopMaturity"])
        }
        invalid={!!error}
      />
    </FormField>
  );
}
