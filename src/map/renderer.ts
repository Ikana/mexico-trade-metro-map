import * as d3 from "d3";
import type { Station, Corridor } from "../types/index.ts";
import {
  CORRIDOR_COLORS,
  STATION_RADIUS,
  LINE_THICKNESS,
  DASH_PATTERN,
  GRID_UNIT,
  FONT_FAMILY,
  LABEL_SIZE,
  TITLE_SIZE,
  SUBTITLE_SIZE,
  MAP_PADDING,
  MAP_BG,
  STATION_FILL,
  STATION_STROKE_WIDTH,
  LABEL_COLOR,
} from "./styles.ts";

export interface MapData {
  stations: Station[];
  corridors: Corridor[];
}

function stationX(s: Station): number {
  return MAP_PADDING.left + s.x * GRID_UNIT;
}

function stationY(s: Station): number {
  return MAP_PADDING.top + s.y * GRID_UNIT;
}

export function renderMap(
  container: HTMLElement | SVGSVGElement,
  data: MapData,
): SVGSVGElement {
  const stationMap = new Map(data.stations.map((s) => [s.id, s]));

  const maxX = Math.max(...data.stations.map((s) => s.x));
  const maxY = Math.max(...data.stations.map((s) => s.y));
  const width = MAP_PADDING.left + (maxX + 1) * GRID_UNIT + MAP_PADDING.right;
  const height = MAP_PADDING.top + (maxY + 1) * GRID_UNIT + MAP_PADDING.bottom;

  d3.select(container).selectAll("svg").remove();

  const svg = d3
    .select(container)
    .append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .style("font-family", FONT_FAMILY);

  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", MAP_BG);

  // Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 32)
    .attr("text-anchor", "middle")
    .attr("font-size", TITLE_SIZE)
    .attr("font-weight", "bold")
    .attr("fill", LABEL_COLOR)
    .text("Mapa Metropolitano de Comercio de México");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 54)
    .attr("text-anchor", "middle")
    .attr("font-size", SUBTITLE_SIZE)
    .attr("fill", "#666")
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
      .x((s) => stationX(s))
      .y((s) => stationY(s));

    const path = linesGroup
      .append("path")
      .datum(points)
      .attr("d", lineGen)
      .attr("fill", "none")
      .attr("stroke", CORRIDOR_COLORS[corridor.id] || corridor.color)
      .attr("stroke-width", LINE_THICKNESS[corridor.lineWeight])
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("data-corridor-id", corridor.id);

    if (corridor.lineStyle === "dashed") {
      path.attr("stroke-dasharray", DASH_PATTERN);
    }
  }

  // Draw stations
  const stationsGroup = svg.append("g").attr("class", "stations");

  for (const station of data.stations) {
    const cx = stationX(station);
    const cy = stationY(station);
    const r = STATION_RADIUS[station.tier];

    const corridorsForStation = data.corridors.filter((c) =>
      c.stationIds.includes(station.id),
    );
    const primaryColor =
      corridorsForStation.length > 0
        ? CORRIDOR_COLORS[corridorsForStation[0].id] ||
          corridorsForStation[0].color
        : "#999";

    const g = stationsGroup
      .append("g")
      .attr("class", "station")
      .attr("data-station-id", station.id);

    // Interchange ring for multi-corridor stations
    if (corridorsForStation.length > 1) {
      g.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", r + 3)
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5);
    }

    g.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", r)
      .attr("fill", STATION_FILL)
      .attr("stroke", primaryColor)
      .attr("stroke-width", STATION_STROKE_WIDTH);

    // Label
    const fontSize = LABEL_SIZE[station.tier];
    const labelOffset = r + 6;

    // Simple label placement: right side by default, left for stations
    // at the right edge, above for dense areas
    let textAnchor: string = "start";
    let lx = cx + labelOffset;
    let ly = cy + fontSize / 3;

    // Stations on the right edge: place label to the left
    if (station.x >= maxX - 1) {
      textAnchor = "end";
      lx = cx - labelOffset;
    }

    // Border crossings along top: label below
    if (station.y <= 2 && station.type === "border-crossing") {
      textAnchor = "middle";
      lx = cx;
      ly = cy + r + fontSize + 2;
    }

    g.append("text")
      .attr("x", lx)
      .attr("y", ly)
      .attr("text-anchor", textAnchor)
      .attr("font-size", fontSize)
      .attr("font-weight", station.tier === "mega" ? "bold" : "normal")
      .attr("fill", LABEL_COLOR)
      .text(station.nameEs);
  }

  return svg.node() as SVGSVGElement;
}
