import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Item = { label: string; href: string; description?: string };

type Props = {
  heading?: string;
  items: ReadonlyArray<Item>;
};

/**
 * Footer-shaped "explore" block for placeholder + content pages so PageRank
 * keeps flowing across the primary-nav surface and users have somewhere to
 * go besides the back button. Internal-link semantics only — not a CTA
 * surface (those live in the page's hero per DESIGN.md §11.1).
 */
export function RelatedLinks({ heading = "Explore", items }: Props) {
  return (
    <section className="border-t border-[var(--line-2)] py-16 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Eyebrow>{heading}</Eyebrow>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group block rounded-2xl border border-[var(--line-2)] bg-bg-2 p-5 transition-colors hover:border-[var(--line-3)]"
              >
                <span className="t-h4 text-fg-0 transition-colors group-hover:text-aj-orange">
                  {item.label}
                </span>
                {item.description && (
                  <span className="mt-2 block t-small text-fg-2">
                    {item.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
