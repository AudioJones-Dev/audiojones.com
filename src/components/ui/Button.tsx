import * as React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

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

function styles(variant: Variant, size: Size, extra?: string) {
  const base =
    "inline-flex items-center justify-center gap-2 font-body font-medium tracking-tight " +
    "rounded-md select-none whitespace-nowrap " +
    "transition-[opacity,border-color,color,background-color,transform] " +
    "duration-[var(--dur-base)] ease-[var(--ease-out)] " +
    "focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)] " +
    "active:translate-y-px disabled:opacity-50 disabled:pointer-events-none";

  const sizeMap: Record<Size, string> = {
    md: "h-10 px-5 text-[15px]",
    lg: "h-12 px-7 text-[16px]",
  };

  const variantMap: Record<Variant, string> = {
    primary:
      "bg-aj-blue-bright text-white shadow-[0_10px_40px_-10px_rgba(59,91,255,0.7)] hover:opacity-90",
    secondary:
      "bg-transparent text-fg-0 border border-[var(--line-2)] hover:border-[var(--line-blue)] hover:text-aj-blue-bright",
    ghost:
      "bg-transparent text-fg-1 hover:text-fg-0 hover:bg-[rgba(255,255,255,0.04)]",
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
  return (
    <button className={styles(variant, size, className)} {...rest}>
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
  const cls = styles(variant, size, className);
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
