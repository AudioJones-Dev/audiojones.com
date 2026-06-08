import SectionShell from "./SectionShell";

const POINTS = [
  "You are tracking activity, not causality.",
  "You are adding tools before clarifying systems.",
  "You are automating processes that should be redesigned.",
  "You are mistaking output for leverage.",
];

export default function ProblemReframe() {
  return (
    <SectionShell
      eyebrow="The reframe"
      title="Most companies don't fail at AI. They fail at signal architecture."
      intro="The data is noisy. The attribution is weak. The workflows are undocumented. The founder is making decisions under cognitive load. AI applied to that environment doesn't create leverage — it accelerates dysfunction."
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {POINTS.map((p) => (
          <li
            key={p}
            className="flex gap-3 rounded-lg border border-white/10 bg-[#0B1020] p-5"
          >
            <span
              aria-hidden
              className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8A96A]"
            />
            <span className="text-slate-200">{p}</span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
