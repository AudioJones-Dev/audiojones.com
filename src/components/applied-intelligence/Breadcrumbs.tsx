import Link from "next/link";

export type Crumb = { name: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-border-subtle bg-surface-1"
    >
      <ol className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-4 text-xs text-text-muted sm:px-8">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={c.name} className="flex items-center gap-2">
              {c.href && !isLast ? (
                <Link href={c.href} className="hover:text-white">
                  {c.name}
                </Link>
              ) : (
                <span className={isLast ? "text-text-primary" : ""}>{c.name}</span>
              )}
              {!isLast && <span aria-hidden>›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
