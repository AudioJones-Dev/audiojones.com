import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

const pillars = [
  [
    "Capture",
    "Every inbound lead routed and timestamped — no missed signal in the gap between channel and CRM.",
  ],
  [
    "Qualify",
    "Intent scored against your ICP before a human touches it, so the team works the calls worth working.",
  ],
  [
    "Recover",
    "Stalled and ghosted leads re-engaged on a recovery cadence designed around your offer, not generic drip.",
  ],
] as const;

function RecoveryDiagram() {
  return (
    <svg
      viewBox="0 0 620 360"
      role="img"
      aria-label="Lead to agent to recovery route diagram"
      className="h-auto w-full"
    >
      <defs>
        <linearGradient id="responseosRoute" x1="72" x2="548" y1="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8FF5A" />
          <stop offset="100%" stopColor="#4DACFF" />
        </linearGradient>
      </defs>
      <rect x="18" y="28" width="584" height="304" rx="28" fill="rgba(5,7,15,0.72)" stroke="rgba(102,102,102,0.18)" />
      <path d="M108 180 H512" stroke="url(#responseosRoute)" strokeWidth="8" strokeLinecap="round" />
      <path d="M492 160 L520 180 L492 200" fill="none" stroke="#4DACFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      {[
        [108, "LEAD"],
        [310, "AGENT"],
        [512, "RECOVERY"],
      ].map(([x, label], index) => (
        <g key={label}>
          <circle cx={Number(x)} cy="180" r="46" fill={index === 0 ? "rgba(232,255,90,0.14)" : index === 1 ? "rgba(102,102,102,0.10)" : "rgba(77,172,255,0.14)"} stroke={index === 0 ? "#E8FF5A" : index === 1 ? "#666666" : "#4DACFF"} strokeOpacity=".72" />
          <circle cx={Number(x)} cy="180" r="10" fill={index === 0 ? "#E8FF5A" : index === 1 ? "#666666" : "#4DACFF"} />
          <text x={Number(x)} y="262" textAnchor="middle" fill="#666666" fontFamily="ui-monospace, monospace" fontSize="12" letterSpacing="3">
            {label}
          </text>
        </g>
      ))}
      <text x="310" y="82" textAnchor="middle" fill="#4DACFF" fontFamily="ui-monospace, monospace" fontSize="12" letterSpacing="4">
        AGENT LAYER
      </text>
      <text x="310" y="304" textAnchor="middle" fill="#E8E8E8" fontFamily="Inter, sans-serif" fontSize="16">
        capture - qualify - route - recover
      </text>
    </svg>
  );
}

export default function ResponseOSWedge() {
  return (
    <section className="aj-bg-grid-dark border-t border-[var(--line-2)] py-24 sm:py-40">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <Eyebrow>Flagship - Revenue Recovery Infrastructure</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            ResponseOS recovers the revenue your follow-up is losing.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            The leak is not just missed calls. It is scattered intent, slow
            response, weak qualification, and no recovery memory.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {pillars.map(([label, description]) => (
              <div key={label} className="aj-data-panel">
                <p className="aj-data-label">{label}</p>
                <p className="mt-3 text-sm leading-6 text-fg-2">
                  {description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/agents/responseos" className="aj-btn-signal">
              Explore ResponseOS
            </Link>
            <Link href="/roi-calculator" className="aj-btn-intel">
              Calculate Lost Revenue
            </Link>
          </div>
        </div>
        <div className="aj-card-signal">
          <div className="aj-card-inner">
            <RecoveryDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
