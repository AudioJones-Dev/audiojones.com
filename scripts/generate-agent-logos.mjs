import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.join(process.cwd(), "public", "assets", "agent-logos");

const brand = {
  bg: "#080808",
  surface: "#0F0F0F",
  surface2: "#161616",
  signal: "#E8FF5A",
  text: "#E8E8E8",
  muted: "#666666",
  border: "#2A2A2A",
  blue: "#4DACFF",
  red: "#FF4545",
  amber: "#FFB340",
  green: "#3DFFB0",
  white: "#FFFFFF",
};

const agents = [
  {
    id: "responseos",
    name: "ResponseOS",
    label: "REVENUE RECOVERY",
    accent: brand.signal,
    secondary: brand.green,
    description: "Capture, qualify, route, recover",
    motif: "response",
  },
  {
    id: "signalos",
    name: "SignalOS",
    label: "SIGNAL CLARITY",
    accent: brand.signal,
    secondary: brand.blue,
    description: "Separate signal from noise",
    motif: "signal",
  },
  {
    id: "contentos",
    name: "ContentOS",
    label: "AUTHORITY ENGINE",
    accent: brand.signal,
    secondary: brand.amber,
    description: "Turn expertise into proof",
    motif: "content",
  },
  {
    id: "podcastos",
    name: "PodcastOS",
    label: "MEDIA OPERATIONS",
    accent: brand.signal,
    secondary: brand.blue,
    description: "Recording to market system",
    motif: "podcast",
  },
  {
    id: "clientos",
    name: "ClientOS",
    label: "DELIVERY OPS",
    accent: brand.signal,
    secondary: brand.green,
    description: "Onboarding and handoff control",
    motif: "client",
  },
  {
    id: "salesos",
    name: "SalesOS",
    label: "PIPELINE CONTROL",
    accent: brand.signal,
    secondary: brand.red,
    description: "Qualify, book, follow up",
    motif: "sales",
  },
];

function esc(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function markMotif(agent, scale = 1, offsetX = 0, offsetY = 0) {
  const a = agent.accent;
  const s = agent.secondary;
  const t = `transform="translate(${offsetX} ${offsetY}) scale(${scale})"`;

  const sharedBars = `
    <rect x="42" y="78" width="20" height="80" rx="10" fill="${a}"/>
    <rect x="84" y="48" width="20" height="110" rx="10" fill="${a}"/>
    <rect x="126" y="26" width="20" height="132" rx="10" fill="${a}"/>
    <circle cx="94" cy="188" r="18" fill="${a}"/>
  `;

  const motifs = {
    response: `
      ${sharedBars}
      <path d="M45 175h112c17 0 31-14 31-31v-6" fill="none" stroke="${s}" stroke-width="10" stroke-linecap="round"/>
      <path d="M168 123l20 15-20 15" fill="none" stroke="${s}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="168" cy="78" r="10" fill="${s}"/>
    `,
    signal: `
      ${sharedBars}
      <circle cx="94" cy="94" r="68" fill="none" stroke="${s}" stroke-width="6" stroke-opacity="0.8"/>
      <circle cx="94" cy="94" r="42" fill="none" stroke="${s}" stroke-width="5" stroke-opacity="0.55"/>
      <path d="M94 94l68-50" stroke="${s}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="162" cy="44" r="9" fill="${s}"/>
    `,
    content: `
      ${sharedBars}
      <rect x="148" y="46" width="58" height="86" rx="6" fill="none" stroke="${s}" stroke-width="7"/>
      <path d="M162 68h30M162 88h30M162 108h20" stroke="${s}" stroke-width="7" stroke-linecap="round"/>
      <path d="M160 150h35" stroke="${s}" stroke-width="7" stroke-linecap="round"/>
    `,
    podcast: `
      ${sharedBars}
      <path d="M170 52v56c0 15-12 27-27 27s-27-12-27-27V52c0-15 12-27 27-27s27 12 27 27Z" fill="none" stroke="${s}" stroke-width="8"/>
      <path d="M104 103c0 23 17 42 39 42s39-19 39-42M143 145v28M124 173h38" fill="none" stroke="${s}" stroke-width="8" stroke-linecap="round"/>
    `,
    client: `
      ${sharedBars}
      <circle cx="168" cy="58" r="15" fill="none" stroke="${s}" stroke-width="7"/>
      <circle cx="190" cy="128" r="15" fill="none" stroke="${s}" stroke-width="7"/>
      <circle cx="142" cy="150" r="15" fill="none" stroke="${s}" stroke-width="7"/>
      <path d="M173 73l12 40M176 135l-20 9" stroke="${s}" stroke-width="7" stroke-linecap="round"/>
    `,
    sales: `
      ${sharedBars}
      <path d="M150 42h62l-24 38v47l-14 12V80l-24-38Z" fill="none" stroke="${s}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M148 158h58" stroke="${s}" stroke-width="7" stroke-linecap="round"/>
      <path d="M186 140l20 18-20 18" fill="none" stroke="${s}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    `,
  };

  return `<g ${t}>${motifs[agent.motif]}</g>`;
}

function markSvg(agent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" fill="none" role="img" aria-label="${esc(agent.name)} agent mark">
  <title>${esc(agent.name)} agent mark</title>
  <rect x="10" y="10" width="220" height="220" rx="14" fill="none" stroke="${brand.border}" stroke-width="2" stroke-dasharray="8 10"/>
  ${markMotif(agent, 1, 0, 0)}
</svg>
`;
}

function lockupSvg(agent, variant = "white") {
  const fill = variant === "dark" ? brand.bg : brand.white;
  const muted = variant === "dark" ? brand.muted : brand.text;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 260" fill="none" role="img" aria-label="${esc(agent.name)} logo">
  <title>${esc(agent.name)} logo</title>
  ${markMotif(agent, 0.78, 26, 30)}
  <line x1="228" y1="54" x2="228" y2="206" stroke="${brand.border}" stroke-width="2"/>
  <text x="270" y="119" fill="${fill}" font-family="Syne, 'Space Grotesk', Arial, sans-serif" font-size="72" font-weight="800" letter-spacing="-1.4">${esc(agent.name)}</text>
  <text x="273" y="157" fill="${agent.accent}" font-family="'DM Mono', 'Courier New', monospace" font-size="18" font-weight="400" letter-spacing="4.4">${esc(agent.label)}</text>
  <text x="273" y="194" fill="${muted}" font-family="'DM Sans', Arial, sans-serif" font-size="22" font-weight="300" letter-spacing="0">${esc(agent.description)}</text>
</svg>
`;
}

function badgeSvg(agent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 160" fill="none" role="img" aria-label="${esc(agent.name)} badge">
  <title>${esc(agent.name)} badge</title>
  <rect x="4" y="4" width="632" height="152" rx="10" fill="none" stroke="${brand.border}" stroke-width="2"/>
  <rect x="28" y="42" width="44" height="76" rx="4" fill="${agent.accent}"/>
  <rect x="84" y="66" width="44" height="52" rx="4" fill="${agent.secondary}"/>
  <text x="160" y="75" fill="${brand.white}" font-family="Syne, 'Space Grotesk', Arial, sans-serif" font-size="44" font-weight="800" letter-spacing="-0.8">${esc(agent.name)}</text>
  <text x="162" y="112" fill="${agent.accent}" font-family="'DM Mono', 'Courier New', monospace" font-size="15" letter-spacing="3.6">${esc(agent.label)}</text>
</svg>
`;
}

async function writeAsset(filePath, svg, width) {
  await fs.writeFile(filePath, svg, "utf8");
  await sharp(Buffer.from(svg)).resize({ width }).png().toFile(filePath.replace(/\.svg$/, ".transparent.png"));
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const index = [];
  for (const agent of agents) {
    const agentDir = path.join(outDir, agent.id);
    await fs.mkdir(agentDir, { recursive: true });

    await writeAsset(path.join(agentDir, `${agent.id}-mark.svg`), markSvg(agent), 1024);
    await writeAsset(path.join(agentDir, `${agent.id}-lockup-white.svg`), lockupSvg(agent, "white"), 1840);
    await writeAsset(path.join(agentDir, `${agent.id}-lockup-dark.svg`), lockupSvg(agent, "dark"), 1840);
    await writeAsset(path.join(agentDir, `${agent.id}-badge.svg`), badgeSvg(agent), 1280);

    index.push(`- ${agent.name}: \`./${agent.id}/\``);
  }

  await fs.writeFile(
    path.join(outDir, "README.md"),
    `# Audio Jones Agent Logos

Generated from the Audio Jones 2.0 brand direction in \`AudioJones-BrandKit-Canva.pdf\`.

## Brand Rules Applied

- Transparent SVG and PNG exports for marketing use.
- Dark-first Audio Jones 2.0 palette.
- Primary signal color: \`#E8FF5A\`.
- Accent-only colors: blue \`#4DACFF\`, red \`#FF4545\`, amber \`#FFB340\`, green \`#3DFFB0\`.
- Typography intent: Syne for logo names, DM Mono for system labels, DM Sans for supporting text.
- No emoji, no light-background lockups as the default, no purple/blue gradients.

## Agents

${index.join("\n")}

Each folder includes:

- \`*-mark.svg\` and \`*-mark.transparent.png\`
- \`*-lockup-white.svg\` and \`*-lockup-white.transparent.png\`
- \`*-lockup-dark.svg\` and \`*-lockup-dark.transparent.png\`
- \`*-badge.svg\` and \`*-badge.transparent.png\`
`,
    "utf8",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
