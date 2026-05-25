import Image from "next/image";

type InsightVisualBreakProps = {
  src: string;
  alt: string;
  caption: string;
};

export default function InsightVisualBreak({ src, alt, caption }: InsightVisualBreakProps) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={675}
        className="h-auto w-full"
        sizes="(min-width: 1200px) 920px, 100vw"
      />
      <figcaption className="border-t border-white/10 px-5 py-3 text-sm text-white/68">
        {caption}
      </figcaption>
    </figure>
  );
}
