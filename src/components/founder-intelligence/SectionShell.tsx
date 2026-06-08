import type { ReactNode } from "react";

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
  variant?: "default" | "alt";
  className?: string;
};

export default function SectionShell({
  id,
  eyebrow,
  title,
  intro,
  children,
  variant = "default",
  className = "",
}: Props) {
  const bg = variant === "alt" ? "bg-[#0B1020]" : "bg-[#05070F]";
  return (
    <section
      id={id}
      className={`${bg} border-t border-white/5 py-20 sm:py-24 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {(eyebrow || title || intro) && (
          <header className="mb-12 max-w-3xl">
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A96A]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {title}
              </h2>
            )}
            {intro && (
              <p className="mt-4 text-lg text-slate-300">{intro}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
