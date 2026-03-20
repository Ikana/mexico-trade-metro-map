/**
 * SVG Export: Renders the map to a standalone SVG file.
 * Run with: npm run export:svg
 */
import { JSDOM } from "jsdom";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

// We'll use a simpler approach: read the processed data and generate SVG
// directly using string templates since JSDOM + D3 is complex.
// For the interactive version, the renderer runs in the browser.

const stations = JSON.parse(
  readFileSync(resolve(root, "data/processed/stations.json"), "utf-8"),
);
const corridors = JSON.parse(
  readFileSync(resolve(root, "data/processed/corridors.json"), "utf-8"),
);
const headlines = JSON.parse(
  readFileSync(resolve(root, "data/processed/headlines.json"), "utf-8"),
);
const maritime = JSON.parse(
  readFileSync(resolve(root, "data/processed/maritime.json"), "utf-8"),
);

// Import style constants
const GRID = 60;
const PAD = { top: 80, right: 40, bottom: 240, left: 40 };
const COLORS: Record<string, string> = {
  "linea-roja": "#E63946",
  "linea-azul": "#457B9D",
  "linea-verde": "#2A9D8F",
  "linea-amarilla": "#E9C46A",
  "linea-morada": "#9B5DE5",
  "linea-naranja": "#F4A261",
  "linea-blanca": "#8D99AE",
  "linea-cafe": "#6B4226",
  "corredor-verde": "#457B9D",
};
const MARITIME_COLORS: Record<string, string> = {
  "pacific-asia-express": "#00BCD4",
  "transpacific-gateway": "#009688",
  "gulf-europe": "#1A237E",
  "gulf-us-east": "#546E7A",
};
const DOT_DASH = "2 4 8 4";
const RADIUS: Record<string, number> = { mega: 12, major: 8, standard: 5 };
const THICKNESS: Record<string, number> = { high: 8, medium: 5, low: 3 };
const FONT_SIZE: Record<string, number> = { mega: 13, major: 11, standard: 10 };

const stationMap = new Map(stations.map((s: any) => [s.id, s]));
const minX = Math.min(...stations.map((s: any) => s.x));
const maxX = Math.max(...stations.map((s: any) => s.x));
const maxY = Math.max(...stations.map((s: any) => s.y));
const width = PAD.left + (maxX - minX + 1) * GRID + PAD.right;
const height = PAD.top + (maxY + 1) * GRID + PAD.bottom;

function sx(s: any): number {
  return PAD.left + (s.x - minX) * GRID;
}
function sy(s: any): number {
  return PAD.top + s.y * GRID;
}

let svgContent = "";

// Background
svgContent += `<rect width="${width}" height="${height}" fill="#FAFAFA"/>`;

// Title
svgContent += `<text x="${width / 2}" y="32" text-anchor="middle" font-size="22" font-weight="bold" fill="#1A1A1A">Mapa Metropolitano de Comercio de México</text>`;
svgContent += `<text x="${width / 2}" y="54" text-anchor="middle" font-size="14" fill="#666">Mexico Trade Metro Map</text>`;

// Corridor lines
for (const c of corridors) {
  const points = c.stationIds
    .map((id: string) => stationMap.get(id))
    .filter(Boolean);
  if (points.length < 2) continue;

  const d = points.map((s: any, i: number) => `${i === 0 ? "M" : "L"}${sx(s)},${sy(s)}`).join(" ");
  const dash = c.lineStyle === "dashed" ? ` stroke-dasharray="8 4"` : "";
  svgContent += `<path d="${d}" fill="none" stroke="${COLORS[c.id] || c.color}" stroke-width="${THICKNESS[c.lineWeight]}" stroke-linecap="round" stroke-linejoin="round"${dash}/>`;
}

// Maritime routes
for (const m of maritime) {
  const points = m.stationIds
    .map((id: string) => stationMap.get(id))
    .filter(Boolean);
  if (points.length < 2) continue;

  const d = points.map((s: any, i: number) => `${i === 0 ? "M" : "L"}${sx(s)},${sy(s)}`).join(" ");
  svgContent += `<path d="${d}" fill="none" stroke="${MARITIME_COLORS[m.id] || m.color}" stroke-width="${THICKNESS[m.lineWeight]}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${DOT_DASH}"/>`;
}

// Stations
for (const s of stations) {
  const cx = sx(s);
  const cy = sy(s);
  const r = RADIUS[s.tier];
  const corridorsForStation = corridors.filter((c: any) => c.stationIds.includes(s.id));
  const color = corridorsForStation.length > 0 ? (COLORS[corridorsForStation[0].id] || corridorsForStation[0].color) : "#999";

  // Interchange ring
  if (corridorsForStation.length > 1) {
    svgContent += `<circle cx="${cx}" cy="${cy}" r="${r + 3}" fill="none" stroke="#333" stroke-width="1.5"/>`;
  }

  svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFF" stroke="${color}" stroke-width="2.5"/>`;

  // Label
  const fs = FONT_SIZE[s.tier];
  let anchor = "start";
  let lx = cx + r + 6;
  let ly = cy + fs / 3;

  if (s.x >= maxX - 1) {
    anchor = "end";
    lx = cx - r - 6;
  }
  if (s.y <= 2 && s.type === "border-crossing") {
    anchor = "middle";
    lx = cx;
    ly = cy + r + fs + 2;
  }

  const weight = s.tier === "mega" ? ' font-weight="bold"' : "";
  svgContent += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" font-size="${fs}"${weight} fill="#1A1A1A">${escapeXml(s.nameEs)}</text>`;
}

// Legend background
const legendY = height - 140;
svgContent += `<rect x="20" y="${legendY}" width="${width - 40}" height="130" rx="6" fill="#F5F5F5" stroke="#DDD" stroke-width="1"/>`;

// Legend: corridor lines
let legendContent = `<g transform="translate(40, ${legendY + 16})">`;
legendContent += `<text font-size="12" font-weight="bold" fill="#1A1A1A">Líneas / Lines</text>`;

const activeCols = corridors.filter((c: any) => c.status === "active");
const colW = 180;
activeCols.forEach((c: any, i: number) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = col * colW;
  const y = 14 + row * 16;
  const dash = c.lineStyle === "dashed" ? ` stroke-dasharray="8 4"` : "";
  legendContent += `<line x1="${x}" y1="${y + 4}" x2="${x + 20}" y2="${y + 4}" stroke="${COLORS[c.id] || c.color}" stroke-width="3" stroke-linecap="round"${dash}/>`;
  legendContent += `<text x="${x + 26}" y="${y + 8}" font-size="10" fill="#1A1A1A">${escapeXml(c.nameEs)} / ${escapeXml(c.nameEn)}</text>`;
});

const plannedCols = corridors.filter((c: any) => c.status === "planned");
plannedCols.forEach((c: any, i: number) => {
  const row = Math.ceil(activeCols.length / 3) + i;
  const y = 14 + row * 16;
  legendContent += `<line x1="0" y1="${y + 4}" x2="20" y2="${y + 4}" stroke="${COLORS[c.id] || c.color}" stroke-width="3" stroke-dasharray="8 4" stroke-linecap="round"/>`;
  legendContent += `<text x="26" y="${y + 8}" font-size="10" fill="#1A1A1A">${escapeXml(c.nameEs)} / ${escapeXml(c.nameEn)} (en construcción / planned)</text>`;
});
legendContent += `</g>`;
svgContent += legendContent;

// Station tier legend
const tierX = width - 260;
let tierContent = `<g transform="translate(${tierX}, ${legendY + 16})">`;
tierContent += `<text font-size="12" font-weight="bold" fill="#1A1A1A">Estaciones / Stations</text>`;
[
  { label: "Centro principal / Mega Hub", r: 12 },
  { label: "Centro mayor / Major Hub", r: 8 },
  { label: "Estación / Standard", r: 5 },
].forEach((t, i) => {
  const y = 20 + i * 22;
  tierContent += `<circle cx="${t.r + 2}" cy="${y + 8}" r="${t.r}" fill="#FFF" stroke="#666" stroke-width="2.5"/>`;
  tierContent += `<text x="26" y="${y + 12}" font-size="10" fill="#1A1A1A">${t.label}</text>`;
});
tierContent += `</g>`;
svgContent += tierContent;

// Headlines
const hlText = headlines.map((h: any) => h.text).join("  •  ");
svgContent += `<text x="40" y="${legendY + 111}" font-size="12" fill="#555">${escapeXml(hlText)}</text>`;
svgContent += `<text x="40" y="${legendY + 127}" font-size="10" fill="#888">Data: BTS 2025, ARTF 2024, Laredo EDC 2024, Contecon 2025, TxDOT 2024, AMIA 2024</text>`;

const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const svgDoc = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" font-family='${fontFamily}'>
${svgContent}
</svg>
`;

mkdirSync(resolve(root, "dist"), { recursive: true });
writeFileSync(resolve(root, "dist/map.svg"), svgDoc, "utf-8");
console.log(`✓ Exported dist/map.svg (${width}x${height})`);

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
