import * as d3 from "d3";
import type { Corridor, HeadlineStat } from "../types/index.ts";
import {
  CORRIDOR_COLORS,
  STATION_RADIUS,
  LINE_THICKNESS,
  DASH_PATTERN,
  FONT_FAMILY,
  LEGEND_LABEL_SIZE,
  HEADLINE_SIZE,
  STATION_FILL,
  STATION_STROKE_WIDTH,
  LABEL_COLOR,
  LEGEND_BG,
} from "./styles.ts";

export function renderLegend(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  corridors: Corridor[],
  headlines: HeadlineStat[],
): void {
  const svgNode = svg.node();
  if (!svgNode) return;
  const width = svgNode.viewBox.baseVal.width || 800;
  const height = svgNode.viewBox.baseVal.height || 600;

  const legendY = height - 140;
  const legendG = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(0, ${legendY})`);

  // Background
  legendG
    .append("rect")
    .attr("x", 20)
    .attr("y", 0)
    .attr("width", width - 40)
    .attr("height", 130)
    .attr("rx", 6)
    .attr("fill", LEGEND_BG)
    .attr("stroke", "#DDD")
    .attr("stroke-width", 1);

  // Corridor legend (left side)
  const corridorLegend = legendG
    .append("g")
    .attr("transform", "translate(40, 16)");

  corridorLegend
    .append("text")
    .attr("font-size", LEGEND_LABEL_SIZE + 1)
    .attr("font-weight", "bold")
    .attr("fill", LABEL_COLOR)
    .text("Líneas / Lines");

  const activeCols = corridors.filter((c) => c.status === "active");
  const plannedCols = corridors.filter((c) => c.status === "planned");

  const colsPerRow = 3;
  const colWidth = 180;
  const rowHeight = 16;

  activeCols.forEach((c, i) => {
    const col = i % colsPerRow;
    const row = Math.floor(i / colsPerRow);
    const x = col * colWidth;
    const y = 14 + row * rowHeight;

    corridorLegend
      .append("line")
      .attr("x1", x)
      .attr("y1", y + 4)
      .attr("x2", x + 20)
      .attr("y2", y + 4)
      .attr("stroke", CORRIDOR_COLORS[c.id] || c.color)
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round");

    corridorLegend
      .append("text")
      .attr("x", x + 26)
      .attr("y", y + 8)
      .attr("font-size", LEGEND_LABEL_SIZE - 1)
      .attr("fill", LABEL_COLOR)
      .text(`${c.nameEs} / ${c.nameEn}`);
  });

  // Planned lines
  plannedCols.forEach((c, i) => {
    const row = Math.ceil(activeCols.length / colsPerRow) + i;
    const y = 14 + row * rowHeight;

    corridorLegend
      .append("line")
      .attr("x1", 0)
      .attr("y1", y + 4)
      .attr("x2", 20)
      .attr("y2", y + 4)
      .attr("stroke", CORRIDOR_COLORS[c.id] || c.color)
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", DASH_PATTERN)
      .attr("stroke-linecap", "round");

    corridorLegend
      .append("text")
      .attr("x", 26)
      .attr("y", y + 8)
      .attr("font-size", LEGEND_LABEL_SIZE - 1)
      .attr("fill", LABEL_COLOR)
      .text(`${c.nameEs} / ${c.nameEn} (en construcción / planned)`);
  });

  // Station tier legend (right side)
  const tierX = width - 260;
  const tierLegend = legendG
    .append("g")
    .attr("transform", `translate(${tierX}, 16)`);

  tierLegend
    .append("text")
    .attr("font-size", LEGEND_LABEL_SIZE + 1)
    .attr("font-weight", "bold")
    .attr("fill", LABEL_COLOR)
    .text("Estaciones / Stations");

  const tiers = [
    { label: "Centro principal / Mega Hub", tier: "mega" as const },
    { label: "Centro mayor / Major Hub", tier: "major" as const },
    { label: "Estación / Standard", tier: "standard" as const },
  ] as const;

  tiers.forEach((t, i) => {
    const y = 20 + i * 22;
    const r = STATION_RADIUS[t.tier];

    tierLegend
      .append("circle")
      .attr("cx", r + 2)
      .attr("cy", y + 8)
      .attr("r", r)
      .attr("fill", STATION_FILL)
      .attr("stroke", "#666")
      .attr("stroke-width", STATION_STROKE_WIDTH);

    tierLegend
      .append("text")
      .attr("x", STATION_RADIUS.mega + 12)
      .attr("y", y + 12)
      .attr("font-size", LEGEND_LABEL_SIZE - 1)
      .attr("fill", LABEL_COLOR)
      .text(t.label);
  });

  // Headlines + data vintage (bottom)
  const headlineY = 95;
  const headlineG = legendG
    .append("g")
    .attr("transform", `translate(40, ${headlineY})`);

  const headlineText = headlines.map((h) => h.text).join("  •  ");

  headlineG
    .append("text")
    .attr("font-size", HEADLINE_SIZE)
    .attr("fill", "#555")
    .text(headlineText);

  headlineG
    .append("text")
    .attr("y", 18)
    .attr("font-size", HEADLINE_SIZE - 2)
    .attr("fill", "#888")
    .text("Data: BTS 2025, ARTF 2024, Laredo EDC 2024, Contecon 2025, TxDOT 2024, AMIA 2024");
}
