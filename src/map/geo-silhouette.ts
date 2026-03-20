/**
 * Octolinear Mexico + Southern US border silhouette for geographic context.
 * Inspired by the MTA New York subway map — geographic shapes rendered with
 * ONLY 0°/45°/90° segments, matching the Beck-style transit grid.
 *
 * Every segment: dx=0 OR dy=0 OR |dx|=|dy| (verified programmatically).
 *
 * Coordinates aligned to the SCHEMATIC grid so coastal cities sit on the coast
 * and interior cities are on land.
 */
import * as d3 from "d3";

// Mexico mainland outline (clockwise from NW border)
const MAINLAND_POINTS: [number, number][] = [
  // ── US-Mexico border (west to east) ──
  [190, 170],   // NW Sonora coast/border
  [280, 170],   // east to Nogales (horizontal)
  [280, 80],    // north to El Paso (vertical)
  [640, 80],    // east along border to Laredo (horizontal)
  [720, 160],   // SE to Reynosa (45°: dx=80, dy=80)
  [770, 160],   // east to Matamoros (horizontal)

  // ── Gulf coast (south) ──
  [770, 440],   // south (vertical)
  [740, 470],   // SW (45°: dx=30, dy=30)
  [740, 560],   // south to Altamira area (vertical)
  [770, 590],   // SE (45°: dx=30, dy=30)
  [770, 700],   // south (vertical)
  [800, 730],   // SE (45°: dx=30, dy=30)
  [800, 860],   // south past Veracruz (vertical)
  [770, 890],   // SW to Isthmus (45°: dx=30, dy=30)

  // ── Yucatán peninsula ──
  [860, 890],   // east along Tabasco (horizontal)
  [920, 830],   // NE to Campeche (45°: dx=60, dy=60)
  [940, 830],   // east (horizontal)
  [940, 750],   // north to Cancún tip (vertical)
  [900, 790],   // SW (45°: dx=40, dy=40)
  [880, 790],   // west (horizontal)
  [880, 860],   // south (vertical)
  [880, 900],   // south (vertical)

  // ── Southern coast (east to west) ──
  [770, 900],   // west (horizontal)
  [770, 960],   // south (vertical)
  [680, 960],   // west (horizontal)
  [560, 960],   // west (horizontal)
  [560, 940],   // north (vertical)
  [310, 940],   // west (horizontal)

  // ── Pacific coast (south to north) ──
  [140, 770],   // NW (45°: dx=170, dy=170)
  [120, 770],   // west (horizontal)
  [120, 700],   // north (vertical)
  [100, 680],   // NW (45°: dx=20, dy=20)
  [100, 500],   // north (vertical)
  [100, 400],   // north (vertical)
  [120, 400],   // east (horizontal)
  [120, 300],   // north (vertical)
  [190, 230],   // NE (45°: dx=70, dy=70)
  [190, 170],   // north back to start (vertical)
];

// Baja California peninsula — blocky MTA style
const BAJA_POINTS: [number, number][] = [
  [80, 130],    // Tijuana
  [80, 170],    // south (vertical)
  [50, 200],    // SW (45°: dx=30, dy=30)
  [20, 200],    // west (horizontal)
  [20, 380],    // south (vertical)
  [40, 400],    // SE (45°: dx=20, dy=20)
  [40, 560],    // south (vertical)
  [60, 560],    // east (horizontal) — Cabo
  [80, 540],    // NE (45°: dx=20, dy=20)
  [80, 400],    // north (vertical)
  [100, 380],   // NE (45°: dx=20, dy=20)
  [100, 200],   // north (vertical)
  [100, 130],   // north (vertical)
  [80, 130],    // west (horizontal) — close (actually need: back to start)
];

// Southern US states — thin strip above border
const US_BORDER_POINTS: [number, number][] = [
  [80, 80],     // SoCal
  [80, 40],     // north (vertical)
  [810, 40],    // east (horizontal)
  [810, 160],   // south (vertical)
  [770, 160],   // west (horizontal)
  [720, 160],   // west (horizontal)
  [640, 80],    // NW (45°: dx=80, dy=80)
  [280, 80],    // west (horizontal)
  [280, 170],   // south (vertical)
  [190, 170],   // west (horizontal)
  [190, 130],   // north (vertical)
  [120, 130],   // west (horizontal)
  [80, 130],    // west (horizontal)
  [80, 80],     // north (vertical)
];

// Border line
const BORDER_POINTS: [number, number][] = [
  [80, 130],
  [120, 130],
  [190, 130],
  [190, 170],
  [280, 170],
  [280, 80],
  [640, 80],
  [720, 160],
  [770, 160],
];

export function renderGeoSilhouette(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
): void {
  const geoGroup = svg.append("g")
    .attr("class", "geo-silhouette")
    .attr("opacity", 0.12);

  // Linear interpolation for blocky/angular MTA look
  const angularLine = d3.line<[number, number]>()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveLinearClosed);

  const openLine = d3.line<[number, number]>()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveLinear);

  // US border states — faint warm grey
  geoGroup.append("path")
    .datum(US_BORDER_POINTS)
    .attr("d", angularLine)
    .attr("fill", "#C8B8A8")
    .attr("stroke", "none");

  // Mexico mainland — warm earth tone
  geoGroup.append("path")
    .datum(MAINLAND_POINTS)
    .attr("d", angularLine)
    .attr("fill", "#A89070")
    .attr("stroke", "none");

  // Baja California peninsula
  geoGroup.append("path")
    .datum(BAJA_POINTS)
    .attr("d", angularLine)
    .attr("fill", "#A89070")
    .attr("stroke", "none");

  // US-Mexico border line — dashed
  geoGroup.append("path")
    .datum(BORDER_POINTS)
    .attr("d", openLine)
    .attr("fill", "none")
    .attr("stroke", "#8B7355")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", "4 3")
    .attr("opacity", 2);
}
