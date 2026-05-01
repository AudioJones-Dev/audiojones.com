import Image from "next/image";

const CLIENTS = [
  { name: "ALMB Group",               src: "/assets/trusted-by/almbg logo.png" },
  { name: "Bigg Zound",               src: "/assets/trusted-by/bigg zound logo.png" },
  { name: "Circle House",             src: "/assets/trusted-by/circle house logo.png" },
  { name: "Florida Ramp & Lift",      src: "/assets/trusted-by/florida ramp and lift logo.png" },
  { name: "Inner Circle",             src: "/assets/trusted-by/inner circle logo.png" },
  { name: "Potieri",                  src: "/assets/trusted-by/potieri logo.png" },
  { name: "Troy Gramling",            src: "/assets/trusted-by/troy gramling logo.png" },
  { name: "Youth Concept Gallery",    src: "/assets/trusted-by/youth concept gallery logo.png" },
];

export default function TrustedByStrip() {
  return (
    <div
      className="border-t border-b border-[var(--line-1)] bg-bg-0"
      aria-label="Trusted by"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-7 flex flex-col items-center gap-6">
        <p
          className="text-center text-fg-3 uppercase tracking-[0.2em] font-semibold"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
          }}
        >
          Trusted by founder-led businesses
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {CLIENTS.map((c) => (
            <div
              key={c.name}
              className="relative opacity-40 hover:opacity-70 transition-opacity duration-200"
              style={{ height: "28px", width: "auto" }}
              title={c.name}
            >
              <Image
                src={c.src}
                alt={c.name}
                height={28}
                width={100}
                className="h-7 w-auto object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
