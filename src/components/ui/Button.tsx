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

type AsLinkProps = CommonProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children" | "href"
  > & {
    href: string;
    external?: boolean;
  };

/**
 * Legacy glow variants use plain CSS classes (.btn-glow / .btn-glow-sys)
 * defined in globals.css. The portable design-system migration keeps
 * those class names but renders them as flat signal/data buttons.
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
    "focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--aj-signal)] " +
    "active:translate-y-px disabled:opacity-50 disabled:pointer-events-none";

  // Heights satisfy iOS 44pt minimum touch-target on `md` and `lg`.
  // `sm` (32px) is reserved for inline link-styled affordances inside
  // dense UI surfaces (admin tables, breadcrumbs) — never on mobile CTAs.
  const sizeMap: Record<Size, string> = {
    sm: "h-8 px-4 text-[13px]",
    md: "h-11 px-6 text-[15px]",
    lg: "h-12 px-7 text-[16px]",
  };

  // Portable design system: primary CTA leads with flat signal yellow.
  // Secondary keeps a dark surface with a strong border and no glow.
  const variantMap: Record<Exclude<Variant, "glow" | "system-glow">, string> = {
    primary:
      "bg-aj-signal text-aj-signal-ink border border-aj-signal hover:bg-transparent hover:text-aj-signal",
    secondary:
      "bg-transparent text-aj-text border border-aj-border-strong hover:border-aj-signal hover:text-aj-signal",
    ghost:
      "bg-transparent text-aj-text hover:text-aj-signal hover:bg-transparent",
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
  ...rest
}: AsLinkProps) {
  const cls = isGlowVariant(variant)
    ? glowClass(variant, className)
    : twStyles(variant, size, className);

  if (external || /^https?:\/\//.test(href)) {
    return (
      <a
        className={cls}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link className={cls} href={href} {...rest}>
      {children}
    </Link>
  );
}
