import Link from "next/link";

export type Crumb = { name: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-white/5 bg-[#0B1020]"
    >
      <ol className="mx-auto flex max-w-6xl items-center gap-2 px-5 py-4 text-xs text-slate-400 sm:px-8">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={c.name} className="flex items-center gap-2">
              {c.href && !isLast ? (
                <Link href={c.href} className="hover:text-white">
                  {c.name}
                </Link>
              ) : (
                <span className={isLast ? "text-slate-200" : ""}>{c.name}</span>
              )}
              {!isLast && <span aria-hidden>›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
