import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ctaLinks } from "@/config/links";
import { buildReportContent, type MapScore, type ReportContent } from "@/lib/roi-calculator/report-content";
import { verifyReportToken } from "@/lib/roi-calculator/report-token";
import { getRoiCalculatorLead } from "@/lib/roi-calculator/roi-calculator-storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Your Signal ROI Snapshot",
  description: "Personalized AI ROI snapshot from Audio Jones.",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ leadId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function getTokenParam(searchParams: Record<string, string | string[] | undefined>): string | null {
  const raw = searchParams.t;
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw ?? null;
}

export default async function ReportPage({ params, searchParams }: PageProps) {
  const { leadId } = await params;
  const search = await searchParams;
  const token = getTokenParam(search);

  if (!verifyReportToken(leadId, token)) {
    notFound();
  }

  const lead = await getRoiCalculatorLead(leadId);
  if (!lead) {
    notFound();
  }

  const content = buildReportContent(lead.input, lead.result, ctaLinks);

  return (
    <main className="min-h-screen bg-bg-0 text-fg-0">
      <article className="mx-auto max-w-[820px] px-5 py-16 sm:px-8 sm:py-24">
        <header className="border-b border-[var(--line-1)] pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--signal-yellow)]">
            Audio Jones · {content.title}
          </p>
          <h1 className="mt-4 t-h1">{content.headline}</h1>
          <p className="mt-5 t-lead text-fg-2">
            A directional read on where your workflow is leaking revenue, what your readiness looks like, and what to do next.
          </p>
          <p className="mt-6 text-xs text-fg-3">
            Generated {new Date(lead.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })} · Reference ID {leadId}
          </p>
        </header>

        <ExecutiveSnapshot content={content} />
        <RevenueLeak content={content} />
        <BottleneckDiagnosis content={content} />
        <SignalVsNoise content={content} />
        <MapLens content={content} />
        <NextMove content={content} />
        <CtaBlock content={content} />

        <footer className="mt-16 border-t border-[var(--line-1)] pt-8 text-xs text-fg-3">
          <p>
            This snapshot is directional. The next move is to pressure-test the math against your real workflow. Audio Jones · AJ Digital LLC ·
            Applied Intelligence Systems.
          </p>
        </footer>
      </article>
    </main>
  );
}

function SectionShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 rounded-lg border border-[var(--line-2)] bg-bg-2 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--signal-yellow)]">{eyebrow}</p>
      <h2 className="mt-3 t-h3">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ExecutiveSnapshot({ content }: { content: ReportContent }) {
  const e = content.executiveSnapshot;
  return (
    <SectionShell eyebrow="1 · Executive Snapshot" title={e.summary}>
      <dl className="grid gap-4 sm:grid-cols-2">
        <Stat label="Estimated annual savings" value={money(e.annualSavings)} accent />
        <Stat label="Estimated monthly savings" value={money(e.monthlySavings)} />
        <Stat label="Readiness" value={`${e.readinessScore}/100`} sub={`${e.confidenceTier} confidence`} />
        <Stat label="Estimated payback" value={e.paybackMonths ? `${e.paybackMonths} mo.` : "TBD"} sub="Based on stated budget" />
      </dl>
    </SectionShell>
  );
}

function RevenueLeak({ content }: { content: ReportContent }) {
  const r = content.revenueLeak;
  return (
    <SectionShell eyebrow="2 · Estimated Revenue Leak" title={`~${money(r.annual)} of opportunity per year`}>
      <ul className="grid gap-3">
        {r.breakdown.map((item) => (
          <li key={item.label} className="flex flex-col gap-1 rounded-md border border-[var(--line-1)] bg-bg-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-fg-0">{item.label}</p>
              <p className="mt-1 text-sm text-fg-2">{item.note}</p>
            </div>
            <p className="text-lg font-semibold text-fg-0 sm:ml-6">{money(item.amount)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-fg-3">Directional, not a promise. Figures assume a reasonable automation capture rate against the inputs you provided.</p>
    </SectionShell>
  );
}

function BottleneckDiagnosis({ content }: { content: ReportContent }) {
  const b = content.bottleneckDiagnosis;
  return (
    <SectionShell eyebrow="3 · Current Bottleneck Diagnosis" title="Where the cost is concentrated">
      <div className="grid gap-3">
        {b.paragraphs.map((p, i) => (
          <p key={i} className="text-fg-1 leading-7">
            {p}
          </p>
        ))}
      </div>
    </SectionShell>
  );
}

function SignalVsNoise({ content }: { content: ReportContent }) {
  const s = content.signalVsNoise;
  return (
    <SectionShell eyebrow="4 · Signal vs. Noise" title={s.verdict}>
      <p className="text-fg-1 leading-7">{s.paragraph}</p>
    </SectionShell>
  );
}

function MapLens({ content }: { content: ReportContent }) {
  const m = content.mapLens;
  return (
    <SectionShell eyebrow="5 · M.A.P. Attribution Lens" title="Measurement · Attribution · Prediction">
      <div className="grid gap-3">
        <MapRow score={m.measurement} />
        <MapRow score={m.attribution} />
        <MapRow score={m.prediction} />
      </div>
      <p className="mt-4 text-sm text-fg-3">{m.summary}</p>
    </SectionShell>
  );
}

function MapRow({ score }: { score: MapScore }) {
  return (
    <div className="grid gap-2 rounded-md border border-[var(--line-1)] bg-bg-3 p-4 sm:grid-cols-[160px_1fr] sm:items-start sm:gap-6">
      <div>
        <p className="text-sm font-semibold text-fg-0">{score.label}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--signal-yellow)]">{score.band}</p>
      </div>
      <p className="text-sm leading-6 text-fg-1">{score.reading}</p>
    </div>
  );
}

function NextMove({ content }: { content: ReportContent }) {
  return (
    <SectionShell eyebrow="6 · Recommended Next Move" title={content.nextMove.headline}>
      <p className="text-fg-1 leading-7">{content.nextMove.paragraph}</p>
    </SectionShell>
  );
}

function CtaBlock({ content }: { content: ReportContent }) {
  return (
    <section
      className="mt-12 rounded-lg border p-8"
      style={{
        background: "linear-gradient(135deg, rgba(232,255,90,0.16), rgba(232,255,90,0.04))",
        borderColor: "rgba(232,255,90,0.45)",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--signal-yellow)]">7 · Next step</p>
      <h2 className="mt-3 t-h2">Ready to separate the signal from the noise?</h2>
      <p className="mt-4 text-fg-1 leading-7">
        Bring this snapshot to a Signal Audit and we&rsquo;ll pressure-test the math against your real workflow.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href={content.cta.primary.href} className="btn-glow">
          {content.cta.primary.label}
        </Link>
        <Link
          href={content.cta.secondary.href}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--line-2)] px-5 py-3 text-sm font-semibold text-fg-1 transition hover:border-[var(--line-3)] hover:text-fg-0"
        >
          {content.cta.secondary.label}
        </Link>
      </div>
    </section>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="rounded-md border border-[var(--line-1)] bg-bg-3 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-3">{label}</p>
      <p className={`mt-2 t-h3 ${accent ? "text-[var(--signal-yellow)]" : ""}`}>{value}</p>
      {sub ? <p className="mt-2 text-sm text-fg-2">{sub}</p> : null}
    </div>
  );
}
