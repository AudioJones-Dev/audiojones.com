const ROWS = [
  {
    letter: "S",
    word: "Signal",
    meaning: "Identify the real bottleneck.",
    question:
      "What actually moves revenue, cost, margin, speed, or quality?",
  },
  {
    letter: "T",
    word: "Translation",
    meaning: "Convert AI capability into workflow design.",
    question:
      "Where does AI fit into the operation without creating more noise?",
  },
  {
    letter: "E",
    word: "Evidence",
    meaning: "Measure before-and-after performance.",
    question: "Did the system actually improve anything?",
  },
  {
    letter: "P",
    word: "Profit",
    meaning: "Compound what works.",
    question: "Does this create repeatable financial leverage?",
  },
];

export default function Step2Framework() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-left">
        <thead className="bg-[#101827] text-xs uppercase tracking-[0.16em] text-slate-400">
          <tr>
            <th className="px-6 py-4">Layer</th>
            <th className="px-6 py-4">Meaning</th>
            <th className="px-6 py-4">Business question</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 bg-[#0B1020]">
          {ROWS.map((r) => (
            <tr key={r.letter}>
              <td className="px-6 py-5">
                <p className="text-2xl font-semibold text-[#3B5BFF]">
                  {r.letter}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {r.word}
                </p>
              </td>
              <td className="px-6 py-5 text-slate-200">{r.meaning}</td>
              <td className="px-6 py-5 text-slate-400">{r.question}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
