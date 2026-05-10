"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  applySchema,
  REVENUE_RANGES,
  GROWTH_STAGES,
  TEAM_SIZES,
  TIMELINE_OPTIONS,
  BUDGET_RANGES,
  type ApplyInput,
} from "@/lib/apply/apply-schema";

// ─── Native control helpers ───────────────────────────────────────────────────
// DESIGN.md §17.5 marks the shared `<Select>` and `<Button>` as 🔴 critical
// for lead-capture critical paths because of the React 19
// value+defaultValue antipattern in Select.tsx and a real-iPhone-Safari
// state-propagation issue surfaced during PR #47. This form is the primary
// engagement-application surface — every conversion failure is a lost
// founder-led-business lead — so we use native `<select>` and
// `<button type="submit">` directly, mirroring the pattern proven in
// `RoiCalculator.tsx` and `DiagnosticForm.tsx`.

const SELECT_BASE =
  "h-11 w-full rounded-md border bg-bg-2 px-4 pr-10 t-body text-fg-0 " +
  "transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)] " +
  "focus:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)] " +
  "disabled:opacity-50 disabled:pointer-events-none " +
  "appearance-none bg-no-repeat";

const SELECT_BORDER_DEFAULT =
  "border-[var(--line-2)] hover:border-[var(--line-3)] focus:border-aj-blue-bright";
const SELECT_BORDER_INVALID = "border-[color:var(--danger)]";

const SELECT_CHEVRON: React.CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1L6 6L11 1' stroke='%2394A3B8' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
  backgroundPosition: "right 14px center",
  backgroundSize: "12px 8px",
};

const SUBMIT_BUTTON_CLASS =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md px-7 " +
  "font-body font-medium tracking-tight text-[16px] text-white " +
  "bg-aj-blue-bright shadow-[0_10px_40px_-10px_rgba(59,91,255,0.7)] " +
  "transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)] " +
  "hover:opacity-90 active:translate-y-px " +
  "focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)] " +
  "disabled:opacity-50 disabled:pointer-events-none";

type SelectOption = { value: string; label: string };

type NativeSelectProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<SelectOption>;
  placeholder: string;
  invalid?: boolean;
};

// Single source of truth: only `value` is passed (no `defaultValue`), which
// avoids the controlled+uncontrolled React 19 antipattern that triggered the
// real-device Safari state-loss in PR #47.
function NativeSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  invalid,
}: NativeSelectProps) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      aria-invalid={invalid || undefined}
      className={[
        SELECT_BASE,
        invalid ? SELECT_BORDER_INVALID : SELECT_BORDER_DEFAULT,
      ].join(" ")}
      style={SELECT_CHEVRON}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

const opt = <T extends string>(arr: ReadonlyArray<T>): ReadonlyArray<SelectOption> =>
  arr.map((v) => ({ value: v, label: v }));

// ─── State ────────────────────────────────────────────────────────────────────

type FieldErrors = Partial<Record<keyof ApplyInput, string>>;

const initialState: ApplyInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  companyName: "",
  website: "",
  annualRevenueRange: undefined as unknown as ApplyInput["annualRevenueRange"],
  currentGrowthStage: undefined,
  primaryConstraint: "",
  teamSize: undefined,
  desiredOutcome: "",
  timeline: undefined as unknown as ApplyInput["timeline"],
  budgetRange: undefined,
  notes: "",
  source: "direct",
  consentToContact: false,
  hp: "",
};

export default function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<ApplyInput>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pull UTM + source from URL on mount; fail silently if not present.
  useEffect(() => {
    if (!searchParams) return;
    const sourceRaw = searchParams.get("source") ?? "direct";
    const validSources = ["diagnostic", "homepage-cta", "direct", "other"] as const;
    const source = (validSources as readonly string[]).includes(sourceRaw)
      ? (sourceRaw as ApplyInput["source"])
      : "other";
    setForm((f) => ({
      ...f,
      source,
      utmSource: searchParams.get("utm_source") ?? undefined,
      utmMedium: searchParams.get("utm_medium") ?? undefined,
      utmCampaign: searchParams.get("utm_campaign") ?? undefined,
      utmTerm: searchParams.get("utm_term") ?? undefined,
      utmContent: searchParams.get("utm_content") ?? undefined,
    }));
  }, [searchParams]);

  function update<K extends keyof ApplyInput>(key: K, value: ApplyInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setSubmitError(null);

    const parsed = applySchema.safeParse(form);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof ApplyInput | undefined;
        if (k && !next[k]) next[k] = issue.message;
      }
      setErrors(next);
      const firstKey = parsed.error.issues[0]?.path[0];
      if (typeof firstKey === "string") {
        const el = document.getElementById(firstKey);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus();
      }
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as
        | { ok: true; leadId: string; provider: string }
        | { ok: false; error: string; code: string };
      if (!data.ok) {
        setSubmitError(data.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push("/apply/thank-you");
    } catch {
      setSubmitError("Network error. Please try again in a moment.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto flex w-full max-w-[640px] flex-col gap-12"
      aria-label="Apply for an Audio Jones engagement"
    >
      {/* Honeypot — visually hidden, not focusable */}
      <div
        aria-hidden
        className="absolute h-px w-px overflow-hidden"
        style={{ clip: "rect(0 0 0 0)", clipPath: "inset(50%)" }}
      >
        <label>
          Leave this field empty
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.hp ?? ""}
            onChange={(e) => update("hp", e.currentTarget.value)}
          />
        </label>
      </div>

      {/* ── Section 1: About you ── */}
      <section className="flex flex-col gap-5">
        <Eyebrow>About you</Eyebrow>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField id="firstName" label="First name" required error={errors.firstName}>
            <Input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e) => update("firstName", e.currentTarget.value)}
              invalid={!!errors.firstName}
            />
          </FormField>
          <FormField id="lastName" label="Last name" error={errors.lastName}>
            <Input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) => update("lastName", e.currentTarget.value)}
            />
          </FormField>
          <FormField id="email" label="Email" required error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.currentTarget.value)}
              invalid={!!errors.email}
            />
          </FormField>
          <FormField id="phone" label="Phone" hint="Optional" error={errors.phone}>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone ?? ""}
              onChange={(e) => update("phone", e.currentTarget.value)}
            />
          </FormField>
          <FormField id="role" label="Role / title" hint="Founder, CEO, COO, …" error={errors.role}>
            <Input
              id="role"
              name="role"
              value={form.role ?? ""}
              onChange={(e) => update("role", e.currentTarget.value)}
            />
          </FormField>
          <FormField id="companyName" label="Company name" required error={errors.companyName}>
            <Input
              id="companyName"
              name="companyName"
              autoComplete="organization"
              value={form.companyName}
              onChange={(e) => update("companyName", e.currentTarget.value)}
              invalid={!!errors.companyName}
            />
          </FormField>
          <FormField id="website" label="Website" hint="Optional" error={errors.website} className="md:col-span-2">
            <Input
              id="website"
              name="website"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://"
              value={form.website ?? ""}
              onChange={(e) => update("website", e.currentTarget.value)}
              invalid={!!errors.website}
            />
          </FormField>
        </div>
      </section>

      {/* ── Section 2: Business context ── */}
      <section className="flex flex-col gap-5">
        <Eyebrow>Business context</Eyebrow>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField id="annualRevenueRange" label="Annual revenue" required error={errors.annualRevenueRange}>
            <NativeSelect
              id="annualRevenueRange"
              name="annualRevenueRange"
              placeholder="Select range"
              options={opt(REVENUE_RANGES)}
              value={(form.annualRevenueRange as string) ?? ""}
              onChange={(value) =>
                update("annualRevenueRange", value as ApplyInput["annualRevenueRange"])
              }
              invalid={!!errors.annualRevenueRange}
            />
          </FormField>
          <FormField id="currentGrowthStage" label="Current stage" error={errors.currentGrowthStage}>
            <NativeSelect
              id="currentGrowthStage"
              name="currentGrowthStage"
              placeholder="Select stage"
              options={opt(GROWTH_STAGES)}
              value={(form.currentGrowthStage as string) ?? ""}
              onChange={(value) =>
                update(
                  "currentGrowthStage",
                  (value || undefined) as ApplyInput["currentGrowthStage"],
                )
              }
            />
          </FormField>
          <FormField id="teamSize" label="Team size" error={errors.teamSize}>
            <NativeSelect
              id="teamSize"
              name="teamSize"
              placeholder="Select size"
              options={opt(TEAM_SIZES)}
              value={(form.teamSize as string) ?? ""}
              onChange={(value) =>
                update(
                  "teamSize",
                  (value || undefined) as ApplyInput["teamSize"],
                )
              }
            />
          </FormField>
          <FormField
            id="primaryConstraint"
            label="Primary constraint"
            hint="What's blocking growth right now? (optional)"
            error={errors.primaryConstraint}
            className="md:col-span-2"
          >
            <Input
              id="primaryConstraint"
              name="primaryConstraint"
              value={form.primaryConstraint ?? ""}
              onChange={(e) => update("primaryConstraint", e.currentTarget.value)}
            />
          </FormField>
        </div>
      </section>

      {/* ── Section 3: Engagement scope ── */}
      <section className="flex flex-col gap-5">
        <Eyebrow>Engagement scope</Eyebrow>
        <FormField
          id="desiredOutcome"
          label="What outcome are you looking for?"
          required
          hint="Be specific. The clearer the outcome, the better the diagnosis."
          error={errors.desiredOutcome}
        >
          <Textarea
            id="desiredOutcome"
            name="desiredOutcome"
            value={form.desiredOutcome}
            onChange={(e) => update("desiredOutcome", e.currentTarget.value)}
            invalid={!!errors.desiredOutcome}
          />
        </FormField>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField id="timeline" label="Timeline" required error={errors.timeline}>
            <NativeSelect
              id="timeline"
              name="timeline"
              placeholder="Select timeline"
              options={opt(TIMELINE_OPTIONS)}
              value={(form.timeline as string) ?? ""}
              onChange={(value) =>
                update("timeline", value as ApplyInput["timeline"])
              }
              invalid={!!errors.timeline}
            />
          </FormField>
          <FormField id="budgetRange" label="Budget range" hint="Optional" error={errors.budgetRange}>
            <NativeSelect
              id="budgetRange"
              name="budgetRange"
              placeholder="Select range"
              options={opt(BUDGET_RANGES)}
              value={(form.budgetRange as string) ?? ""}
              onChange={(value) =>
                update(
                  "budgetRange",
                  (value || undefined) as ApplyInput["budgetRange"],
                )
              }
            />
          </FormField>
        </div>
      </section>

      {/* ── Section 4: Anything else ── */}
      <section className="flex flex-col gap-5">
        <Eyebrow>Anything else</Eyebrow>
        <FormField
          id="notes"
          label="Notes"
          hint="Anything I should know before reviewing — context, constraints, what you've already tried."
          error={errors.notes}
        >
          <Textarea
            id="notes"
            name="notes"
            value={form.notes ?? ""}
            onChange={(e) => update("notes", e.currentTarget.value)}
          />
        </FormField>
        <FormField id="consentToContact" label="" error={errors.consentToContact}>
          <Checkbox
            id="consentToContact"
            name="consentToContact"
            required
            label="I consent to Audio Jones contacting me about this application."
            hint="Your information is reviewed for fit before any next step. No spam."
            checked={form.consentToContact}
            onChange={(e) => update("consentToContact", e.currentTarget.checked)}
            invalid={!!errors.consentToContact}
          />
        </FormField>
      </section>

      {submitError && (
        <div
          role="alert"
          className="rounded-md border border-[color:var(--danger)] bg-[rgba(239,68,68,0.06)] p-4 t-small text-[color:var(--danger)]"
        >
          {submitError}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className={SUBMIT_BUTTON_CLASS} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit application"}
        </button>
        <p className="t-small text-fg-3">
          Reviewed personally by Audio Jones. Typical response: 1–3 business days.
        </p>
      </div>
    </form>
  );
}
