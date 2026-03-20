import * as d3 from "d3";
import type { Corridor, MaritimeRoute, HeadlineStat } from "../types/index.ts";
import { TOKENS } from "./styles.ts";

export function renderLegend(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  corridors: Corridor[],
  headlines: HeadlineStat[],
  maritime: MaritimeRoute[] = [],
): void {
  const svgNode = svg.node();
  if (!svgNode) return;
  const width = svgNode.viewBox.baseVal.width || 800;
  const height = svgNode.viewBox.baseVal.height || 600;

  const legendY = height - 220;
  const legendG = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(0, ${legendY})`);

  // Background — warm legend panel
  legendG
    .append("rect")
    .attr("x", 20)
    .attr("y", 0)
    .attr("width", width - 40)
    .attr("height", 210)
    .attr("rx", 6)
    .attr("fill", TOKENS.colors.legendBackground)
    .attr("stroke", "#DDD")
    .attr("stroke-width", 1);

  // === COLUMN 1: Corridor Legend (left side) ===
  const corridorLegend = legendG
    .append("g")
    .attr("transform", "translate(40, 16)");

  corridorLegend
    .append("text")
    .attr("font-size", TOKENS.typography.sizes.legend + 1)
    .attr("font-weight", TOKENS.typography.weights.bold)
    .attr("fill", TOKENS.colors.labelColor)
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
    const color = TOKENS.colors.corridors[c.id] || c.color;

    corridorLegend
      .append("line")
      .attr("x1", x)
      .attr("y1", y + 4)
      .attr("x2", x + 20)
      .attr("y2", y + 4)
      .attr("stroke", color)
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round");

    corridorLegend
      .append("text")
      .attr("x", x + 26)
      .attr("y", y + 8)
      .attr("font-size", TOKENS.typography.sizes.legend - 1)
      .attr("fill", TOKENS.colors.labelColor)
      .text(`${c.nameEs} / ${c.nameEn}`);
  });

  // Planned lines — dashed
  plannedCols.forEach((c, i) => {
    const row = Math.ceil(activeCols.length / colsPerRow) + i;
    const y = 14 + row * rowHeight;
    const color = TOKENS.colors.corridors[c.id] || c.color;

    corridorLegend
      .append("line")
      .attr("x1", 0)
      .attr("y1", y + 4)
      .attr("x2", 20)
      .attr("y2", y + 4)
      .attr("stroke", color)
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", TOKENS.patterns.dashed)
      .attr("stroke-linecap", "round");

    corridorLegend
      .append("text")
      .attr("x", 26)
      .attr("y", y + 8)
      .attr("font-size", TOKENS.typography.sizes.legend - 1)
      .attr("fill", TOKENS.colors.labelColor)
      .text(`${c.nameEs} / ${c.nameEn} (planificado / planned)`);
  });

  // Maritime routes — dot-dash
  if (maritime.length > 0) {
    const maritimeStartRow =
      Math.ceil(activeCols.length / colsPerRow) + plannedCols.length;
    const mLabelY = 14 + maritimeStartRow * rowHeight + 4;

    corridorLegend
      .append("text")
      .attr("y", mLabelY)
      .attr("font-size", TOKENS.typography.sizes.legend)
      .attr("font-weight", TOKENS.typography.weights.bold)
      .attr("fill", TOKENS.colors.labelColor)
      .text("Rutas Marítimas / Maritime Routes");

    maritime.forEach((m, i) => {
      const y = mLabelY + 10 + i * rowHeight;
      const color = TOKENS.colors.maritime[m.id] || m.color;

      corridorLegend
        .append("line")
        .attr("x1", 0)
        .attr("y1", y + 4)
        .attr("x2", 20)
        .attr("y2", y + 4)
        .attr("stroke", color)
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", TOKENS.patterns.dotDash)
        .attr("stroke-linecap", "round");

      corridorLegend
        .append("text")
        .attr("x", 26)
        .attr("y", y + 8)
        .attr("font-size", TOKENS.typography.sizes.legend - 1)
        .attr("fill", TOKENS.colors.labelColor)
        .text(`${m.nameEs} / ${m.nameEn}`);
    });
  }

  // === COLUMN 2: Station Types + Tiers (center-right) ===
  const tierX = width - 340;
  const stationLegend = legendG
    .append("g")
    .attr("transform", `translate(${tierX}, 16)`);

  stationLegend
    .append("text")
    .attr("font-size", TOKENS.typography.sizes.legend + 1)
    .attr("font-weight", TOKENS.typography.weights.bold)
    .attr("fill", TOKENS.colors.labelColor)
    .text("Estaciones / Stations");

  // Station type symbols
  const stationTypes = [
    { label: "Ciudad / City", type: "city" as const },
    { label: "Puerto / Port", type: "port" as const },
    { label: "Cruce fronterizo / Border", type: "border-crossing" as const },
    { label: "Destino / Terminal", type: "terminal-region" as const },
  ];

  stationTypes.forEach((st, i) => {
    const y = 20 + i * 22;
    const r = 6;
    const cx = r + 4;
    const cy = y + 8;
    const strokeColor = "#666";

    if (st.type === "city") {
      stationLegend
        .append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", r)
        .attr("fill", TOKENS.colors.stationFill)
        .attr("stroke", strokeColor)
        .attr("stroke-width", 2);
    } else if (st.type === "port") {
      // Diamond with wave
      stationLegend
        .append("path")
        .attr("d", `M${cx},${cy - r} L${cx + r},${cy} L${cx},${cy + r} L${cx - r},${cy} Z`)
        .attr("fill", TOKENS.colors.stationFill)
        .attr("stroke", strokeColor)
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round");
    } else if (st.type === "border-crossing") {
      // Diamond with line
      stationLegend
        .append("path")
        .attr("d", `M${cx},${cy - r} L${cx + r},${cy} L${cx},${cy + r} L${cx - r},${cy} Z`)
        .attr("fill", TOKENS.colors.stationFill)
        .attr("stroke", strokeColor)
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "miter");
      stationLegend
        .append("line")
        .attr("x1", cx - r * 0.5)
        .attr("y1", cy)
        .attr("x2", cx + r * 0.5)
        .attr("y2", cy)
        .attr("stroke", strokeColor)
        .attr("stroke-width", 1.5);
    } else {
      // Terminal rect
      stationLegend
        .append("rect")
        .attr("x", cx - r - 1)
        .attr("y", cy - r + 1)
        .attr("width", r * 2 + 2)
        .attr("height", r * 2 - 2)
        .attr("rx", 3)
        .attr("fill", TOKENS.colors.stationFill)
        .attr("stroke", strokeColor)
        .attr("stroke-width", 2);
    }

    stationLegend
      .append("text")
      .attr("x", 20)
      .attr("y", y + 12)
      .attr("font-size", TOKENS.typography.sizes.legend - 1)
      .attr("fill", TOKENS.colors.labelColor)
      .text(st.label);
  });

  // Tier sizes
  const tierStartY = 20 + stationTypes.length * 22 + 8;

  stationLegend
    .append("text")
    .attr("y", tierStartY)
    .attr("font-size", TOKENS.typography.sizes.legend)
    .attr("font-weight", TOKENS.typography.weights.semibold)
    .attr("fill", TOKENS.colors.labelColor)
    .text("Tamaño / Size");

  const tiers = [
    { label: "Centro principal / Mega Hub", tier: "mega" as const },
    { label: "Centro mayor / Major Hub", tier: "major" as const },
    { label: "Estación / Standard", tier: "standard" as const },
  ] as const;

  tiers.forEach((t, i) => {
    const y = tierStartY + 8 + i * 20;
    const r = TOKENS.spacing.stationRadius[t.tier] || 6;

    stationLegend
      .append("circle")
      .attr("cx", TOKENS.spacing.stationRadius.mega + 2)
      .attr("cy", y + 8)
      .attr("r", r)
      .attr("fill", TOKENS.colors.stationFill)
      .attr("stroke", "#666")
      .attr("stroke-width", 2);

    stationLegend
      .append("text")
      .attr("x", TOKENS.spacing.stationRadius.mega + 18)
      .attr("y", y + 12)
      .attr("font-size", TOKENS.typography.sizes.legend - 1)
      .attr("fill", TOKENS.colors.labelColor)
      .text(t.label);
  });

  // === BOTTOM: Headlines + data vintage ===
  const headlineY = 175;
  const headlineG = legendG
    .append("g")
    .attr("transform", `translate(40, ${headlineY})`);

  const headlineText = headlines.map((h) => h.text).join("  \u2022  ");

  headlineG
    .append("text")
    .attr("font-size", 12)
    .attr("fill", TOKENS.colors.labelSecondary)
    .text(headlineText);

  headlineG
    .append("text")
    .attr("y", 18)
    .attr("font-size", 10)
    .attr("fill", "#888")
    .text("Data: BTS 2025, ARTF 2024, Laredo EDC 2024, Contecon 2025, TxDOT 2024, AMIA 2024");
}
