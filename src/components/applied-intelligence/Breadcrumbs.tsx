import Link from "next/link";

export type Crumb = { name: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-[var(--border-strong)] bg-bg-0"
    >
      <ol className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-4 font-mono text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)] sm:px-8">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={c.name} className="flex items-center gap-2">
              {c.href && !isLast ? (
                <Link
                  href={c.href}
                  className="transition hover:text-[var(--accent-blue)]"
                >
                  {c.name}
                </Link>
              ) : (
                <span className={isLast ? "text-[var(--text-primary)]" : ""}>
                  {c.name}
                </span>
              )}
              {!isLast && (
                <span aria-hidden className="text-[var(--border-strong)]">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
