import * as React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "glow" | "system-glow";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AsButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

type AsLinkProps = CommonProps & {
  href: string;
  external?: boolean;
};

/**
 * Glow variants use plain CSS classes (.btn-glow / .btn-glow-sys)
 * defined in globals.css — they must not be mixed with the Tailwind
 * base stack or the shadow/color cascade breaks.
 *
 * Tailwind variants (primary / secondary / ghost) keep their own base.
 */
function isGlowVariant(v: Variant): v is "glow" | "system-glow" {
  return v === "glow" || v === "system-glow";
}

function glowClass(variant: "glow" | "system-glow", extra?: string) {
  const base = variant === "glow" ? "btn-glow" : "btn-glow-sys";
  return [base, extra].filter(Boolean).join(" ");
}

function twStyles(variant: Exclude<Variant, "glow" | "system-glow">, size: Size, extra?: string) {
  const base =
    "inline-flex items-center justify-center gap-2 font-headline font-bold tracking-[-0.01em] " +
    "rounded select-none whitespace-nowrap " +
    "transition-[opacity,border-color,color,background-color,transform] " +
    "duration-[var(--dur-base)] ease-[var(--ease-out)] " +
    "focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--signal-yellow)] " +
    "active:translate-y-px disabled:opacity-50 disabled:pointer-events-none";

  // Heights satisfy iOS 44pt minimum touch-target on `md` and `lg`.
  // `sm` (32px) is reserved for inline link-styled affordances inside
  // dense UI surfaces (admin tables, breadcrumbs) — never on mobile CTAs.
  const sizeMap: Record<Size, string> = {
    sm: "h-8 px-4 text-[13px]",
    md: "h-11 px-6 text-[15px]",
    lg: "h-12 px-7 text-[16px]",
  };

  // V2 (§07): primary CTA leads with signal yellow on near-black text.
  // Secondary keeps a dark surface with a border-strong outline that
  // promotes to signal yellow on hover.
  const variantMap: Record<Exclude<Variant, "glow" | "system-glow">, string> = {
    primary:
      "bg-signal-yellow text-bg-base border border-signal-yellow shadow-[0_10px_40px_-10px_rgba(232,255,90,0.55)] hover:bg-signal-soft hover:border-signal-soft",
    secondary:
      "bg-transparent text-text-primary border border-border-strong hover:border-signal-yellow hover:text-signal-yellow",
    ghost:
      "bg-transparent text-fg-1 hover:text-fg-0 hover:bg-[rgba(232,255,90,0.06)]",
  };

  return [base, sizeMap[size], variantMap[variant], extra].filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: AsButtonProps) {
  const cls = isGlowVariant(variant)
    ? glowClass(variant, className)
    : twStyles(variant, size, className);

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
}: AsLinkProps) {
  const cls = isGlowVariant(variant)
    ? glowClass(variant, className)
    : twStyles(variant, size, className);

  if (external || /^https?:\/\//.test(href)) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={cls} href={href}>
      {children}
    </Link>
  );
}
