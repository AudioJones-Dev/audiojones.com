import Link from "next/link";
import SectionShell from "./SectionShell";

const ROWS = [
  {
    letter: "M",
    word: "Meaningful",
    question: "Does this data point actually matter to the business?",
  },
  {
    letter: "A",
    word: "Actionable",
    question: "Can we use this insight to make a decision?",
  },
  {
    letter: "P",
    word: "Profitable",
    question: "Does this improve revenue, margin, or efficiency?",
  },
];

export default function FrameworkFeature() {
  return (
    <SectionShell
      eyebrow="M.A.P Attribution Framework"
      title="A metric only earns the right to drive strategy if it passes M.A.P."
      intro="Most attribution stops at activity. M.A.P keeps you honest by forcing every data point through three filters before it becomes a business input."
    >
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-[#101827] text-xs uppercase tracking-[0.16em] text-slate-400">
            <tr>
              <th className="px-6 py-4">Letter</th>
              <th className="px-6 py-4">Meaning</th>
              <th className="px-6 py-4">Core question</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-[#0B1020]">
            {ROWS.map((r) => (
              <tr key={r.letter}>
                <td className="px-6 py-5 text-2xl font-semibold text-[#C8A96A]">
                  {r.letter}
                </td>
                <td className="px-6 py-5 font-semibold text-white">{r.word}</td>
                <td className="px-6 py-5 text-slate-300">{r.question}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <Link
          href="/frameworks/map-attribution"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B5BFF] hover:text-[#5B7AFF]"
        >
          Explore the M.A.P framework →
        </Link>
      </div>
    </SectionShell>
  );
}
