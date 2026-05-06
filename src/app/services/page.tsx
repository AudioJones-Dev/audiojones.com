import { ctaLinks } from "@/config/links";

type WhopPrice = {
  id?: string;
  amount?: number; // cents
  currency?: string;
  interval?: string; // month, year, one_time
};

type WhopProduct = {
  id: string;
  name?: string;
  description?: string;
  url?: string; // checkout or landing URL if provided by API
  prices?: WhopPrice[];
};

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/whop/products`, {
      cache: "no-store",
      // For local dev without NEXT_PUBLIC_BASE_URL, fall back to relative
      next: { revalidate: 0 },
    });
    if (!res.ok) return [] as WhopProduct[];
    const data = await res.json();
    return (data?.data || []) as WhopProduct[];
  } catch {
    return [] as WhopProduct[];
  }
}

function formatPrice(p?: WhopPrice) {
  if (!p || p.amount == null) return "";
  const amt = (p.amount / 100).toFixed(0);
  const cur = (p.currency || "usd").toUpperCase();
  const cycle = p.interval === "year" ? "/yr" : p.interval === "month" ? "/mo" : "";
  return `$${amt} ${cycle}`.trim();
}

export default async function ServicesPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#111] text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Services & Offers</h1>
          <p className="mt-4 text-white/75 max-w-2xl mx-auto">
            AI branding systems, podcast production, and automation packages designed to grow your authority.
          </p>
          <a
            href={ctaLinks.signalDiagnostic}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full px-6 font-bold text-black bg-gradient-to-r from-[#FF4500] to-[#FFD700] hover:opacity-90 transition"
          >
            Find the Right Offer
          </a>
        </header>

        {products.length === 0 ? (
          <p className="text-center text-white/70">Offers will appear here once Whop products are available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((prod) => {
              const primary = prod.prices?.[0];
              const price = formatPrice(primary);
              return (
                <div key={prod.id} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-2">{prod.name || "Untitled Offer"}</h3>
                  {price && <div className="text-3xl font-extrabold bg-gradient-to-r from-[#FF4500] to-[#FFD700] bg-clip-text text-transparent">{price}</div>}
                  <p className="mt-3 text-sm text-white/75 line-clamp-4">{prod.description || "Includes strategy, production, and automation systems tailored to your goals."}</p>
                  <div className="mt-6 flex gap-3">
                    <a
                      href={prod.url || "/book"}
                      className="inline-flex h-11 items-center justify-center rounded-full px-6 font-bold text-black bg-gradient-to-r from-[#FF4500] to-[#FFD700] hover:opacity-90 transition"
                      target={prod.url ? "_blank" : undefined}
                    >
                      {prod.url ? "Select" : "Book a Call"}
                    </a>
                    <a
                      href="/book"
                      className="inline-flex h-11 items-center justify-center rounded-full px-6 font-semibold border border-white/20 hover:border-white/40"
                    >
                      Consult First
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
