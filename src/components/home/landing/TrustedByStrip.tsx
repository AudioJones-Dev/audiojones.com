import Image from "next/image";

type Client = { name: string; src: string; width: number; height?: number; keepColors?: boolean };

const CLIENTS: Client[] = [
  { name: "ALMB Group", src: "/assets/clients/trusted/almbg.webp", width: 206 },
  { name: "Bigg Zound", src: "/assets/clients/trusted/bigg-zound.webp", width: 147 },
  { name: "Circle House", src: "/assets/clients/trusted/circle-house.webp", width: 120 },
  { name: "Florida Ramp & Lift", src: "/assets/clients/florida-ramp-lift-logo.webp", width: 800, height: 271, keepColors: true },
  { name: "Inner Circle", src: "/assets/clients/trusted/inner-circle.webp", width: 164 },
  { name: "Potieri", src: "/assets/clients/trusted/potieri.webp", width: 463 },
  { name: "Troy Gramling", src: "/assets/clients/trusted/troy-gramling.webp", width: 663 },
  { name: "Youth Concept Gallery", src: "/assets/clients/trusted/youth-concept-gallery.webp", width: 196 },
];

export default function TrustedByStrip() {
  return (
    <section
      className="border-t border-b border-[var(--line-1)] bg-bg-0"
      aria-label="Trusted by"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 px-5 py-10 sm:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-fg-3">
          Trusted by founder-led businesses
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14">
          {CLIENTS.map((c) => (
            <li key={c.name} title={c.name}>
              <Image
                src={c.src}
                alt={c.name}
                width={c.width}
                height={c.height ?? 120}
                className="h-10 w-auto max-w-[160px] object-contain opacity-70 transition-opacity duration-200 hover:opacity-100"
                style={c.keepColors ? undefined : { filter: "brightness(0) invert(1)" }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
