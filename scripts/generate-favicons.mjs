// Generates the Audio Jones V2 favicon set from a single SVG source.
// Run: node scripts/generate-favicons.mjs
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = join(ROOT, "public");
const APP_DIR = join(ROOT, "src", "app");

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#080808" rx="16"/>
  <rect x="22" y="48" width="12" height="32" fill="#E8FF5A" rx="3"/>
  <rect x="44" y="26" width="12" height="54" fill="#E8FF5A" rx="3"/>
  <rect x="66" y="38" width="12" height="42" fill="#E8FF5A" rx="3"/>
</svg>
`;

// At 16x16, the 16% rounded corners and 3px bar radius become invisible/blurry.
// Use a sharper-edged variant for the smallest sizes so the waveform stays
// crisp against #080808.
const SVG_TINY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
  <rect width="16" height="16" fill="#080808"/>
  <rect x="3" y="8" width="2" height="5" fill="#E8FF5A"/>
  <rect x="7" y="4" width="2" height="9" fill="#E8FF5A"/>
  <rect x="11" y="6" width="2" height="7" fill="#E8FF5A"/>
</svg>
`;

const targets = [
  { out: join(PUBLIC_DIR, "favicon-16x16.png"), size: 16, src: SVG_TINY },
  { out: join(PUBLIC_DIR, "favicon-32x32.png"), size: 32, src: SVG },
  { out: join(PUBLIC_DIR, "favicon-96x96.png"), size: 96, src: SVG },
  { out: join(PUBLIC_DIR, "apple-touch-icon.png"), size: 180, src: SVG },
  { out: join(PUBLIC_DIR, "android-chrome-192x192.png"), size: 192, src: SVG },
  { out: join(PUBLIC_DIR, "android-chrome-512x512.png"), size: 512, src: SVG },
  { out: join(PUBLIC_DIR, "icon.png"), size: 512, src: SVG },
];

async function buildIco() {
  // Multi-size ICO: 16, 32, 48. Built by hand because sharp doesn't write ICO.
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((s) =>
      sharp(Buffer.from(s === 16 ? SVG_TINY : SVG))
        .resize(s, s)
        .png()
        .toBuffer()
    )
  );

  // ICONDIR header: reserved(2) type(2) count(2)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);

  const entries = [];
  let offset = 6 + sizes.length * 16;
  for (let i = 0; i < sizes.length; i++) {
    const png = pngBuffers[i];
    const entry = Buffer.alloc(16);
    const dim = sizes[i] >= 256 ? 0 : sizes[i];
    entry.writeUInt8(dim, 0); // width
    entry.writeUInt8(dim, 1); // height
    entry.writeUInt8(0, 2); // colors (0 = >256)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += png.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });

  for (const t of targets) {
    const buf = await sharp(Buffer.from(t.src)).resize(t.size, t.size).png().toBuffer();
    await writeFile(t.out, buf);
    console.log(`wrote ${t.out} (${t.size}x${t.size}, ${buf.length} bytes)`);
  }

  await writeFile(join(PUBLIC_DIR, "icon.svg"), SVG);
  console.log(`wrote ${join(PUBLIC_DIR, "icon.svg")}`);

  const ico = await buildIco();
  await writeFile(join(PUBLIC_DIR, "favicon.ico"), ico);
  console.log(`wrote ${join(PUBLIC_DIR, "favicon.ico")} (${ico.length} bytes)`);

  // Mirror the ICO into src/app/favicon.ico so Next.js App Router auto-serves
  // the same V2 mark. Without this, the old version persists at /favicon.ico
  // because app/favicon.ico takes precedence over /public/favicon.ico at build.
  await writeFile(join(APP_DIR, "favicon.ico"), ico);
  console.log(`wrote ${join(APP_DIR, "favicon.ico")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
