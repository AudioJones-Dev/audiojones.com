import type { ReactNode } from "react";

interface VibrantCardProps {
  children: ReactNode;
  className?: string;
}

export default function VibrantCard({
  children,
  className = "",
}: VibrantCardProps) {
  return (
    <div className={`aj-vibrant-card ${className}`.trim()}>
      <svg
        className="aj-vibrant-card__filter"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id="aj-vibrant-turbulence"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves="2"
              seed="4"
            />
            <feDisplacementMap in="SourceGraphic" scale="32" />
          </filter>
        </defs>
      </svg>

      <div className="aj-vibrant-card__halo" aria-hidden />
      <div className="aj-vibrant-card__glow" aria-hidden />
      <div className="aj-vibrant-card__border" aria-hidden />
      <div className="aj-vibrant-card__surface">{children}</div>
    </div>
  );
}
