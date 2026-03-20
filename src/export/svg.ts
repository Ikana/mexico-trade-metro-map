/**
 * SVG Export: Renders the map to a standalone SVG file.
 * Run with: npm run export:svg
 *
 * Imports design tokens from src/map/styles.ts for visual consistency
 * with the interactive renderer.
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { TOKENS } from "../map/styles.ts";
import { computeLabelPlacements } from "../map/labels.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

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

// ── Layout derived from tokens ──
const GRID = TOKENS.spacing.gridUnit;
const PAD = TOKENS.spacing.padding;

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

// Count routes per station for interchange detection
const routeCountPerStation = new Map<string, number>();
for (const c of corridors) {
  for (const sid of c.stationIds) {
    routeCountPerStation.set(sid, (routeCountPerStation.get(sid) || 0) + 1);
  }
}
for (const m of maritime) {
  for (const sid of m.stationIds) {
    routeCountPerStation.set(sid, (routeCountPerStation.get(sid) || 0) + 1);
  }
}

let svgContent = "";

// Background — warm cream
svgContent += `<rect width="${width}" height="${height}" fill="${TOKENS.colors.background}"/>`;

// Geographic silhouette — faint Mexico outline for spatial context
svgContent += renderGeoSilhouetteSvg();

// Title — Inter bold, centered
svgContent += `<text x="${width / 2}" y="32" text-anchor="middle" font-size="24" font-weight="${TOKENS.typography.weights.bold}" fill="${TOKENS.colors.labelColor}">Mapa Metropolitano de Comercio de México</text>`;
svgContent += `<text x="${width / 2}" y="56" text-anchor="middle" font-size="14" font-weight="${TOKENS.typography.weights.regular}" fill="${TOKENS.colors.labelSecondary}">Mexico Trade Metro Map</text>`;

// Corridor lines
for (const c of corridors) {
  const points = c.stationIds
    .map((id: string) => stationMap.get(id))
    .filter(Boolean);
  if (points.length < 2) continue;

  const d = points.map((s: any, i: number) => `${i === 0 ? "M" : "L"}${sx(s)},${sy(s)}`).join(" ");
  const color = TOKENS.colors.corridors[c.id] || c.color;
  const thickness = TOKENS.spacing.lineThickness[c.lineWeight] || 5;
  let dashAttr = "";
  if (c.lineStyle === "dashed") dashAttr = ` stroke-dasharray="${TOKENS.patterns.dashed}"`;
  svgContent += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round" stroke-linejoin="round"${dashAttr}/>`;
}

// Maritime routes — dot-dash pattern
for (const m of maritime) {
  const points = m.stationIds
    .map((id: string) => stationMap.get(id))
    .filter(Boolean);
  if (points.length < 2) continue;

  const d = points.map((s: any, i: number) => `${i === 0 ? "M" : "L"}${sx(s)},${sy(s)}`).join(" ");
  const color = TOKENS.colors.maritime[m.id] || m.color;
  const thickness = TOKENS.spacing.lineThickness[m.lineWeight] || 3;
  svgContent += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${TOKENS.patterns.dotDash}"/>`;
}

// Stations — pictogram rendering
for (const s of stations) {
  const cx = sx(s);
  const cy = sy(s);
  const r = TOKENS.spacing.stationRadius[s.tier] || 6;
  const routeCount = routeCountPerStation.get(s.id) || 0;

  // Determine primary color from first corridor/maritime route
  const corridorsForStation = corridors.filter((c: any) => c.stationIds.includes(s.id));
  const maritimeForStation = maritime.filter((m: any) => m.stationIds.includes(s.id));
  const allRoutes = [...corridorsForStation, ...maritimeForStation];
  const primaryColor = allRoutes.length > 0
    ? (TOKENS.colors.corridors[allRoutes[0].id] || TOKENS.colors.maritime[allRoutes[0].id] || allRoutes[0].color)
    : "#333333";

  // Interchange ring for multi-route stations
  if (routeCount > 1) {
    const ringR = routeCount >= 3 ? r + TOKENS.spacing.interchangeRingGap + 2 : r + TOKENS.spacing.interchangeRingGap;
    const ringStroke = routeCount >= 3 ? 2.5 : 2;
    svgContent += `<circle cx="${cx}" cy="${cy}" r="${ringR}" fill="none" stroke="#222" stroke-width="${ringStroke}"/>`;
  }

  // Station symbol by type — r is already tier-specific from TOKENS
  const sw = TOKENS.spacing.stationStrokeWidth;

  if (s.type === "terminal-region") {
    const sc = r * 1.2;
    svgContent += `<rect x="${cx - sc - 2}" y="${cy - sc}" width="${sc * 2 + 4}" height="${sc * 2}" rx="4" fill="${TOKENS.colors.stationFill}" stroke="${primaryColor}" stroke-width="${sw}"/>`;
    svgContent += `<path d="M${cx + sc * 0.2},${cy - sc * 0.4} L${cx + sc * 0.7},${cy} L${cx + sc * 0.2},${cy + sc * 0.4}" fill="none" stroke="${primaryColor}" stroke-width="${sw * 0.6}" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else if (s.type === "port") {
    const sc = r * 1.1;
    svgContent += `<path d="M${cx},${cy - sc} L${cx + sc},${cy} L${cx},${cy + sc} L${cx - sc},${cy} Z" fill="${TOKENS.colors.stationFill}" stroke="${primaryColor}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    svgContent += `<path d="M${cx - sc * 0.4},${cy} Q${cx - sc * 0.2},${cy - sc * 0.25} ${cx},${cy} Q${cx + sc * 0.2},${cy + sc * 0.25} ${cx + sc * 0.4},${cy}" fill="none" stroke="${primaryColor}" stroke-width="${sw * 0.48}" stroke-linecap="round"/>`;
  } else if (s.type === "border-crossing") {
    const sc = r;
    svgContent += `<path d="M${cx},${cy - sc} L${cx + sc},${cy} L${cx},${cy + sc} L${cx - sc},${cy} Z" fill="${TOKENS.colors.stationFill}" stroke="${primaryColor}" stroke-width="${sw}" stroke-linejoin="miter"/>`;
    svgContent += `<line x1="${cx - sc * 0.5}" y1="${cy}" x2="${cx + sc * 0.5}" y2="${cy}" stroke="${primaryColor}" stroke-width="${sw * 0.6}"/>`;
  } else {
    svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${TOKENS.colors.stationFill}" stroke="${primaryColor}" stroke-width="${sw}"/>`;
  }
}

// Labels — use the same collision-avoidance engine as the interactive renderer
const labelPlacements = computeLabelPlacements(stations, TOKENS, GRID, minX);
const labelMap = new Map(labelPlacements.map((lp) => [lp.stationId, lp]));

for (const s of stations) {
  const placement = labelMap.get(s.id);
  if (!placement) continue;

  svgContent += `<text x="${placement.x}" y="${placement.y}" text-anchor="${placement.anchor}" font-size="${placement.fontSize}" font-weight="${placement.fontWeight}" fill="${TOKENS.colors.labelColor}">${escapeXml(placement.labelText)}</text>`;
}

// ── Legend ──
const legendY = height - 220;
svgContent += `<rect x="20" y="${legendY}" width="${width - 40}" height="210" rx="6" fill="${TOKENS.colors.legendBackground}" stroke="#DDD" stroke-width="1"/>`;

// Legend column 1: Corridor lines
let legendContent = `<g transform="translate(40, ${legendY + 16})">`;
legendContent += `<text font-size="12" font-weight="${TOKENS.typography.weights.bold}" fill="${TOKENS.colors.labelColor}">Líneas / Lines</text>`;

const activeCols = corridors.filter((c: any) => c.status === "active");
const colW = 180;
activeCols.forEach((c: any, i: number) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = col * colW;
  const y = 14 + row * 16;
  const color = TOKENS.colors.corridors[c.id] || c.color;
  legendContent += `<line x1="${x}" y1="${y + 4}" x2="${x + 20}" y2="${y + 4}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
  legendContent += `<text x="${x + 26}" y="${y + 8}" font-size="10" fill="${TOKENS.colors.labelColor}">${escapeXml(c.nameEs)} / ${escapeXml(c.nameEn)}</text>`;
});

const plannedCols = corridors.filter((c: any) => c.status === "planned");
plannedCols.forEach((c: any, i: number) => {
  const row = Math.ceil(activeCols.length / 3) + i;
  const y = 14 + row * 16;
  const color = TOKENS.colors.corridors[c.id] || c.color;
  legendContent += `<line x1="0" y1="${y + 4}" x2="20" y2="${y + 4}" stroke="${color}" stroke-width="3" stroke-dasharray="${TOKENS.patterns.dashed}" stroke-linecap="round"/>`;
  legendContent += `<text x="26" y="${y + 8}" font-size="10" fill="${TOKENS.colors.labelColor}">${escapeXml(c.nameEs)} / ${escapeXml(c.nameEn)} (planificado / planned)</text>`;
});

// Maritime routes in legend
if (maritime.length > 0) {
  const mStartRow = Math.ceil(activeCols.length / 3) + plannedCols.length;
  const mLabelY = 14 + mStartRow * 16 + 4;
  legendContent += `<text y="${mLabelY}" font-size="11" font-weight="${TOKENS.typography.weights.bold}" fill="${TOKENS.colors.labelColor}">Rutas Marítimas / Maritime Routes</text>`;
  maritime.forEach((m: any, i: number) => {
    const y = mLabelY + 10 + i * 16;
    const color = TOKENS.colors.maritime[m.id] || m.color;
    legendContent += `<line x1="0" y1="${y + 4}" x2="20" y2="${y + 4}" stroke="${color}" stroke-width="3" stroke-dasharray="${TOKENS.patterns.dotDash}" stroke-linecap="round"/>`;
    legendContent += `<text x="26" y="${y + 8}" font-size="10" fill="${TOKENS.colors.labelColor}">${escapeXml(m.nameEs)} / ${escapeXml(m.nameEn)}</text>`;
  });
}
legendContent += `</g>`;
svgContent += legendContent;

// Legend column 2: Station types + tiers
const tierX = width - 340;
let tierContent = `<g transform="translate(${tierX}, ${legendY + 16})">`;
tierContent += `<text font-size="12" font-weight="${TOKENS.typography.weights.bold}" fill="${TOKENS.colors.labelColor}">Estaciones / Stations</text>`;

// Station type symbols
const stationTypes = [
  { label: "Ciudad / City", type: "city" },
  { label: "Puerto / Port", type: "port" },
  { label: "Cruce fronterizo / Border", type: "border-crossing" },
  { label: "Destino / Terminal", type: "terminal-region" },
];

stationTypes.forEach((st, i) => {
  const y = 20 + i * 22;
  const r = 6;
  const cxL = r + 4;
  const cyL = y + 8;
  const strokeColor = "#666";

  if (st.type === "city") {
    tierContent += `<circle cx="${cxL}" cy="${cyL}" r="${r}" fill="${TOKENS.colors.stationFill}" stroke="${strokeColor}" stroke-width="2"/>`;
  } else if (st.type === "port") {
    tierContent += `<path d="M${cxL},${cyL - r} L${cxL + r},${cyL} L${cxL},${cyL + r} L${cxL - r},${cyL} Z" fill="${TOKENS.colors.stationFill}" stroke="${strokeColor}" stroke-width="2" stroke-linejoin="round"/>`;
  } else if (st.type === "border-crossing") {
    tierContent += `<path d="M${cxL},${cyL - r} L${cxL + r},${cyL} L${cxL},${cyL + r} L${cxL - r},${cyL} Z" fill="${TOKENS.colors.stationFill}" stroke="${strokeColor}" stroke-width="2" stroke-linejoin="miter"/>`;
    tierContent += `<line x1="${cxL - r * 0.5}" y1="${cyL}" x2="${cxL + r * 0.5}" y2="${cyL}" stroke="${strokeColor}" stroke-width="1.5"/>`;
  } else {
    tierContent += `<rect x="${cxL - r - 1}" y="${cyL - r + 1}" width="${r * 2 + 2}" height="${r * 2 - 2}" rx="3" fill="${TOKENS.colors.stationFill}" stroke="${strokeColor}" stroke-width="2"/>`;
  }

  tierContent += `<text x="20" y="${y + 12}" font-size="10" fill="${TOKENS.colors.labelColor}">${st.label}</text>`;
});

// Tier sizes
const tierStartY = 20 + stationTypes.length * 22 + 8;
tierContent += `<text y="${tierStartY}" font-size="11" font-weight="${TOKENS.typography.weights.semibold}" fill="${TOKENS.colors.labelColor}">Tamaño / Size</text>`;

const tiers = [
  { label: "Centro principal / Mega Hub", r: TOKENS.spacing.stationRadius.mega },
  { label: "Centro mayor / Major Hub", r: TOKENS.spacing.stationRadius.major },
  { label: "Estación / Standard", r: TOKENS.spacing.stationRadius.standard },
];
tiers.forEach((t, i) => {
  const y = tierStartY + 8 + i * 20;
  tierContent += `<circle cx="${TOKENS.spacing.stationRadius.mega + 2}" cy="${y + 8}" r="${t.r}" fill="${TOKENS.colors.stationFill}" stroke="#666" stroke-width="2"/>`;
  tierContent += `<text x="${TOKENS.spacing.stationRadius.mega + 18}" y="${y + 12}" font-size="10" fill="${TOKENS.colors.labelColor}">${t.label}</text>`;
});
tierContent += `</g>`;
svgContent += tierContent;

// Headlines + data vintage
const headlineY = legendY + 175;
const hlText = headlines.map((h: any) => h.text).join("  \u2022  ");
svgContent += `<text x="40" y="${headlineY}" font-size="12" fill="${TOKENS.colors.labelSecondary}">${escapeXml(hlText)}</text>`;
svgContent += `<text x="40" y="${headlineY + 18}" font-size="10" fill="#888">Data: BTS 2025, ARTF 2024, Laredo EDC 2024, Contecon 2025, TxDOT 2024, AMIA 2024</text>`;

// Wrap in SVG document with Inter font
const fontFamily = TOKENS.typography.fontFamily;
const svgDoc = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" font-family='${fontFamily}'>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap');
</style>
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

function renderGeoSilhouetteSvg(): string {
  // Octolinear Mexico + southern US silhouette (MTA-style angular shapes)
  // All segments: dx=0 OR dy=0 OR |dx|=|dy| — matches geo-silhouette.ts
  const mainland = "190,170 280,170 280,80 640,80 720,160 770,160 770,440 740,470 740,560 770,590 770,700 800,730 800,860 770,890 860,890 920,830 940,830 940,750 900,790 880,790 880,860 880,900 770,900 770,960 680,960 560,960 560,940 310,940 140,770 120,770 120,700 100,680 100,500 100,400 120,400 120,300 190,230 190,170";
  const baja = "80,130 80,170 50,200 20,200 20,380 40,400 40,560 60,560 80,540 80,400 100,380 100,200 100,130 80,130";
  const usBorder = "80,80 80,40 810,40 810,160 770,160 720,160 640,80 280,80 280,170 190,170 190,130 120,130 80,130 80,80";
  const borderLine = "80,130 120,130 190,130 190,170 280,170 280,80 640,80 720,160 770,160";

  let svg = `<g class="geo-silhouette" opacity="0.12">`;
  svg += `<polygon points="${usBorder}" fill="#C8B8A8" stroke="none"/>`;
  svg += `<polygon points="${mainland}" fill="#A89070" stroke="none"/>`;
  svg += `<polygon points="${baja}" fill="#A89070" stroke="none"/>`;
  svg += `<polyline points="${borderLine}" fill="none" stroke="#8B7355" stroke-width="1.5" stroke-dasharray="4 3" opacity="1"/>`;
  svg += `</g>`;
  return svg;
}
