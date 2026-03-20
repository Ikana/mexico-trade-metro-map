import * as d3 from "d3";
import type { Station, Corridor, MaritimeRoute } from "../types/index.ts";
import { TOKENS, getStationSymbol } from "./styles.ts";
import { computeLabelPlacements } from "./labels.ts";
import { renderGeoSilhouette } from "./geo-silhouette.ts";

export interface MapData {
  stations: Station[];
  corridors: Corridor[];
  maritime?: MaritimeRoute[];
}

function stationX(s: Station, minX: number): number {
  return TOKENS.spacing.padding.left + (s.x - minX) * TOKENS.spacing.gridUnit;
}

function stationY(s: Station): number {
  return TOKENS.spacing.padding.top + s.y * TOKENS.spacing.gridUnit;
}

export function renderMap(
  container: HTMLElement | SVGSVGElement,
  data: MapData,
): SVGSVGElement {
  const stationMap = new Map(data.stations.map((s) => [s.id, s]));
  const maritime = data.maritime || [];

  const minX = Math.min(...data.stations.map((s) => s.x));
  const maxX = Math.max(...data.stations.map((s) => s.x));
  const maxY = Math.max(...data.stations.map((s) => s.y));
  const width =
    TOKENS.spacing.padding.left + (maxX - minX + 1) * TOKENS.spacing.gridUnit + TOKENS.spacing.padding.right;
  const height = TOKENS.spacing.padding.top + (maxY + 1) * TOKENS.spacing.gridUnit + TOKENS.spacing.padding.bottom;

  d3.select(container).selectAll("svg").remove();

  const svg = d3
    .select(container)
    .append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .style("font-family", TOKENS.typography.fontFamily);

  // Background — warm cream
  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", TOKENS.colors.background);

  // Geographic silhouette — faint Mexico outline for spatial context
  renderGeoSilhouette(svg);

  // Title — Inter bold, centered
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 32)
    .attr("text-anchor", "middle")
    .attr("font-size", TOKENS.typography.sizes.title)
    .attr("font-weight", TOKENS.typography.weights.bold)
    .attr("fill", TOKENS.colors.labelColor)
    .text("Mapa Metropolitano de Comercio de México");

  // Subtitle
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 56)
    .attr("text-anchor", "middle")
    .attr("font-size", TOKENS.typography.sizes.subtitle)
    .attr("font-weight", TOKENS.typography.weights.regular)
    .attr("fill", TOKENS.colors.labelSecondary)
    .text("Mexico Trade Metro Map");

  // Draw corridor lines
  const linesGroup = svg.append("g").attr("class", "corridors");

  for (const corridor of data.corridors) {
    const points = corridor.stationIds
      .map((id) => stationMap.get(id))
      .filter((s): s is Station => s !== undefined);

    if (points.length < 2) continue;

    const lineGen = d3
      .line<Station>()
      .x((s) => stationX(s, minX))
      .y((s) => stationY(s));

    const color = TOKENS.colors.corridors[corridor.id] || corridor.color;
    const path = linesGroup
      .append("path")
      .datum(points)
      .attr("d", lineGen)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", TOKENS.spacing.lineThickness[corridor.lineWeight])
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("data-corridor-id", corridor.id);

    if (corridor.lineStyle === "dashed") {
      path.attr("stroke-dasharray", TOKENS.patterns.dashed);
    }
  }

  // Draw maritime routes — dot-dash pattern
  const maritimeGroup = svg.append("g").attr("class", "maritime-routes");

  for (const route of maritime) {
    const points = route.stationIds
      .map((id) => stationMap.get(id))
      .filter((s): s is Station => s !== undefined);

    if (points.length < 2) continue;

    const lineGen = d3
      .line<Station>()
      .x((s) => stationX(s, minX))
      .y((s) => stationY(s));

    maritimeGroup
      .append("path")
      .datum(points)
      .attr("d", lineGen)
      .attr("fill", "none")
      .attr("stroke", TOKENS.colors.maritime[route.id] || route.color)
      .attr("stroke-width", TOKENS.spacing.lineThickness[route.lineWeight])
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("stroke-dasharray", TOKENS.patterns.dotDash)
      .attr("data-corridor-id", route.id);
  }

  // Count corridors + maritime per station for interchange detection
  const routeCountPerStation = new Map<string, number>();
  for (const c of data.corridors) {
    for (const sid of c.stationIds) {
      routeCountPerStation.set(sid, (routeCountPerStation.get(sid) || 0) + 1);
    }
  }
  for (const r of maritime) {
    for (const sid of r.stationIds) {
      routeCountPerStation.set(sid, (routeCountPerStation.get(sid) || 0) + 1);
    }
  }

  // Draw stations
  const stationsGroup = svg.append("g").attr("class", "stations");

  for (const station of data.stations) {
    const cx = stationX(station, minX);
    const cy = stationY(station);
    const r = TOKENS.spacing.stationRadius[station.tier] || 6;
    const routeCount = routeCountPerStation.get(station.id) || 0;

    // Determine primary color from first corridor
    const corridorsForStation = data.corridors.filter((c) =>
      c.stationIds.includes(station.id),
    );
    const maritimeForStation = maritime.filter((m) =>
      m.stationIds.includes(station.id),
    );
    const allRoutes = [...corridorsForStation, ...maritimeForStation];
    const primaryColor =
      allRoutes.length > 0
        ? TOKENS.colors.corridors[allRoutes[0].id] ||
          TOKENS.colors.maritime[allRoutes[0].id] ||
          allRoutes[0].color
        : TOKENS.colors.stationStroke;

    const g = stationsGroup
      .append("g")
      .attr("class", "station")
      .attr("data-station-id", station.id);

    // Interchange ring for multi-route stations — visually prominent
    if (routeCount > 1) {
      const ringGap = TOKENS.spacing.interchangeRingGap;
      const ringR = routeCount >= 3 ? r + ringGap + 2 : r + ringGap;
      const ringStroke = routeCount >= 3 ? 2.5 : 2;
      g.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", ringR)
        .attr("fill", "none")
        .attr("stroke", "#222")
        .attr("stroke-width", ringStroke);
    }

    // Station symbol rendering — uses getStationSymbol() for tier-based scaling.
    // Multi-element symbols (port wave, border gate line, terminal arrow) are rendered
    // inline rather than from single token paths to preserve visual detail.
    const symbol = getStationSymbol(station.type, station.tier);

    if (station.type === "terminal-region") {
      // Terminal region: rounded rectangle with arrow indicator
      const s = symbol.scale * r * 1.2;
      g.append("rect")
        .attr("x", cx - s - 2)
        .attr("y", cy - s)
        .attr("width", s * 2 + 4)
        .attr("height", s * 2)
        .attr("rx", 4)
        .attr("fill", TOKENS.colors.stationFill)
        .attr("stroke", primaryColor)
        .attr("stroke-width", 2.5);
      g.append("path")
        .attr("d", `M${cx + s * 0.2},${cy - s * 0.4} L${cx + s * 0.7},${cy} L${cx + s * 0.2},${cy + s * 0.4}`)
        .attr("fill", "none")
        .attr("stroke", primaryColor)
        .attr("stroke-width", 1.5)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round");
    } else if (station.type === "port") {
      // Port: diamond shape with wave indicator (Aicher-inspired)
      const s = symbol.scale * r * 1.1;
      g.append("path")
        .attr("d", `M${cx},${cy - s} L${cx + s},${cy} L${cx},${cy + s} L${cx - s},${cy} Z`)
        .attr("fill", TOKENS.colors.stationFill)
        .attr("stroke", primaryColor)
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round");
      g.append("path")
        .attr("d", `M${cx - s * 0.4},${cy} Q${cx - s * 0.2},${cy - s * 0.25} ${cx},${cy} Q${cx + s * 0.2},${cy + s * 0.25} ${cx + s * 0.4},${cy}`)
        .attr("fill", "none")
        .attr("stroke", primaryColor)
        .attr("stroke-width", 1.2)
        .attr("stroke-linecap", "round");
    } else if (station.type === "border-crossing") {
      // Border crossing: diamond with gate line (customs gate)
      const s = symbol.scale * r * 1.0;
      g.append("path")
        .attr("d", `M${cx},${cy - s} L${cx + s},${cy} L${cx},${cy + s} L${cx - s},${cy} Z`)
        .attr("fill", TOKENS.colors.stationFill)
        .attr("stroke", primaryColor)
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "miter");
      g.append("line")
        .attr("x1", cx - s * 0.5)
        .attr("y1", cy)
        .attr("x2", cx + s * 0.5)
        .attr("y2", cy)
        .attr("stroke", primaryColor)
        .attr("stroke-width", 1.5);
    } else {
      // City: filled circle (universal metro convention)
      // r already encodes tier-based sizing from TOKENS.spacing.stationRadius
      g.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", r)
        .attr("fill", TOKENS.colors.stationFill)
        .attr("stroke", primaryColor)
        .attr("stroke-width", 2.5);
    }

  }

  // Label placement using collision-avoidance engine
  const labelPlacements = computeLabelPlacements(data.stations, TOKENS, TOKENS.spacing.gridUnit, minX);
  const labelMap = new Map(labelPlacements.map((lp) => [lp.stationId, lp]));

  for (const station of data.stations) {
    const g = stationsGroup.select(`g[data-station-id="${station.id}"]`);
    const placement = labelMap.get(station.id);
    if (!placement) continue;

    g.append("text")
      .attr("x", placement.x)
      .attr("y", placement.y)
      .attr("text-anchor", placement.anchor)
      .attr("font-size", placement.fontSize)
      .attr("font-weight", placement.fontWeight)
      .attr("fill", TOKENS.colors.labelColor)
      .text(placement.labelText);
  }

  return svg.node() as SVGSVGElement;
}
