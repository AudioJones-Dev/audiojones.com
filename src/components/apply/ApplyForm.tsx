"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  applySchema,
  APPLY_OFFERS,
  APPLY_SOURCES,
  REVENUE_RANGES,
  GROWTH_STAGES,
  TEAM_SIZES,
  TIMELINE_OPTIONS,
  BUDGET_RANGES,
  type ApplyInput,
} from "@/lib/apply/apply-schema";

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
  offer: undefined,
  desiredOutcome: "",
  timeline: undefined as unknown as ApplyInput["timeline"],
  budgetRange: undefined,
  notes: "",
  source: "direct",
  consentToContact: false,
  hp: "",
};

const opt = <T extends string>(arr: ReadonlyArray<T>) =>
  arr.map((v) => ({ value: v, label: v }));

export default function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<ApplyInput>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pull UTM + source + offer from URL on mount; fail silently if not present.
  useEffect(() => {
    if (!searchParams) return;
    const sourceRaw = searchParams.get("source") ?? "direct";
    const source = (APPLY_SOURCES as readonly string[]).includes(sourceRaw)
      ? (sourceRaw as ApplyInput["source"])
      : "other";
    const offerRaw = searchParams.get("offer");
    const offer = APPLY_OFFERS.find((o) => o.id === offerRaw)?.id;
    setForm((f) => ({
      ...f,
      source,
      offer,
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
    setSubmitError(null);

    const parsed = applySchema.safeParse(form);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof ApplyInput | undefined;
        if (k && !next[k]) next[k] = issue.message;
      }
      setErrors(next);
      // Scroll the first error into view
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
            onChange={(e) => update("hp", e.target.value)}
          />
        </label>
      </div>

      {/* ── Section 0: Engagement ── */}
      <section className="flex flex-col gap-5">
        <Eyebrow>Engagement</Eyebrow>
        <FormField
          id="offer"
          label="What are you applying for?"
          hint={
            form.offer
              ? "Prefilled from the offer you clicked. Change it if you landed on the wrong one."
              : "Optional — pick one if you already know, or leave it open."
          }
          error={errors.offer}
        >
          <Select
            id="offer"
            name="offer"
            options={[
              // A real option, not the disabled placeholder — the field is
              // optional, so a visitor who lands here prefilled must be able
              // to clear it again.
              { value: "", label: "Not sure yet" },
              ...APPLY_OFFERS.map((o) => ({ value: o.id, label: o.label })),
            ]}
            value={form.offer ?? ""}
            onChange={(e) =>
              update("offer", (e.target.value || undefined) as ApplyInput["offer"])
            }
          />
        </FormField>
      </section>

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
              onChange={(e) => update("firstName", e.target.value)}
              invalid={!!errors.firstName}
            />
          </FormField>
          <FormField id="lastName" label="Last name" error={errors.lastName}>
            <Input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
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
              onChange={(e) => update("email", e.target.value)}
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
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </FormField>
          <FormField id="role" label="Role / title" hint="Founder, CEO, COO, …" error={errors.role}>
            <Input
              id="role"
              name="role"
              value={form.role ?? ""}
              onChange={(e) => update("role", e.target.value)}
            />
          </FormField>
          <FormField id="companyName" label="Company name" required error={errors.companyName}>
            <Input
              id="companyName"
              name="companyName"
              autoComplete="organization"
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
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
              onChange={(e) => update("website", e.target.value)}
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
            <Select
              id="annualRevenueRange"
              name="annualRevenueRange"
              placeholder="Select range"
              options={opt(REVENUE_RANGES)}
              value={(form.annualRevenueRange as string) ?? ""}
              onChange={(e) =>
                update(
                  "annualRevenueRange",
                  e.target.value as ApplyInput["annualRevenueRange"],
                )
              }
              invalid={!!errors.annualRevenueRange}
            />
          </FormField>
          <FormField id="currentGrowthStage" label="Current stage" error={errors.currentGrowthStage}>
            <Select
              id="currentGrowthStage"
              name="currentGrowthStage"
              placeholder="Select stage"
              options={opt(GROWTH_STAGES)}
              value={(form.currentGrowthStage as string) ?? ""}
              onChange={(e) =>
                update(
                  "currentGrowthStage",
                  (e.target.value || undefined) as ApplyInput["currentGrowthStage"],
                )
              }
            />
          </FormField>
          <FormField id="teamSize" label="Team size" error={errors.teamSize}>
            <Select
              id="teamSize"
              name="teamSize"
              placeholder="Select size"
              options={opt(TEAM_SIZES)}
              value={(form.teamSize as string) ?? ""}
              onChange={(e) =>
                update(
                  "teamSize",
                  (e.target.value || undefined) as ApplyInput["teamSize"],
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
              onChange={(e) => update("primaryConstraint", e.target.value)}
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
            onChange={(e) => update("desiredOutcome", e.target.value)}
            invalid={!!errors.desiredOutcome}
          />
        </FormField>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField id="timeline" label="Timeline" required error={errors.timeline}>
            <Select
              id="timeline"
              name="timeline"
              placeholder="Select timeline"
              options={opt(TIMELINE_OPTIONS)}
              value={(form.timeline as string) ?? ""}
              onChange={(e) =>
                update(
                  "timeline",
                  e.target.value as ApplyInput["timeline"],
                )
              }
              invalid={!!errors.timeline}
            />
          </FormField>
          <FormField id="budgetRange" label="Budget range" hint="Optional" error={errors.budgetRange}>
            <Select
              id="budgetRange"
              name="budgetRange"
              placeholder="Select range"
              options={opt(BUDGET_RANGES)}
              value={(form.budgetRange as string) ?? ""}
              onChange={(e) =>
                update(
                  "budgetRange",
                  (e.target.value || undefined) as ApplyInput["budgetRange"],
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
            onChange={(e) => update("notes", e.target.value)}
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
            onChange={(e) => update("consentToContact", e.target.checked)}
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
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit application"}
        </Button>
        <p className="t-small text-fg-3">
          Reviewed personally by Audio Jones. Typical response: 1–3 business days.
        </p>
      </div>
    </form>
  );
}
