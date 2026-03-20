import * as d3 from "d3";
import type { Station, Corridor, MaritimeRoute, DataSource } from "../types/index.ts";
import { TOKENS } from "../map/styles.ts";

const TOOLTIP_CLASS = "trade-tooltip";

/** Escape HTML entities to prevent XSS when interpolating into innerHTML */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createTooltipElement(): HTMLDivElement {
  let el = document.querySelector(`.${TOOLTIP_CLASS}`) as HTMLDivElement;
  if (el) return el;

  el = document.createElement("div");
  el.className = TOOLTIP_CLASS;
  Object.assign(el.style, {
    position: "fixed",
    pointerEvents: "none",
    background: TOKENS.colors.stationFill,
    border: `1px solid ${TOKENS.colors.legendBackground}`,
    borderRadius: "6px",
    padding: "12px 16px",
    fontSize: "13px",
    lineHeight: "1.5",
    maxWidth: "320px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
    zIndex: "1000",
    display: "none",
    fontFamily: TOKENS.typography.fontFamily,
    color: TOKENS.colors.labelColor,
  });
  document.body.appendChild(el);
  return el;
}

function showTooltip(el: HTMLDivElement, html: string, event: MouseEvent | TouchEvent): void {
  el.innerHTML = html;
  el.style.display = "block";

  const x = "touches" in event ? event.touches[0].clientX : event.clientX;
  const y = "touches" in event ? event.touches[0].clientY : event.clientY;

  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = x + 12;
  let top = y - 12;

  if (left + rect.width > vw - 8) left = x - rect.width - 12;
  if (top + rect.height > vh - 8) top = y - rect.height - 12;
  if (top < 8) top = 8;

  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
}

function hideTooltip(el: HTMLDivElement): void {
  el.style.display = "none";
}

function formatUsd(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

function formatCount(value: number): string {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return value.toLocaleString();
}

function sourceLabel(sourceIds: string[], sources: DataSource[]): string {
  const names = sourceIds
    .map((id) => sources.find((s) => s.id === id))
    .filter(Boolean)
    .map((s) => `${esc(s!.authority)} (${esc(String(s!.dataYear))})`);
  return names.length > 0
    ? `<div style="color:${TOKENS.colors.labelSecondary};font-size:11px;margin-top:4px">Source: ${names.join(", ")}</div>`
    : "";
}

function stationTooltipHtml(station: Station, sources: DataSource[]): string {
  // English name as primary heading in tooltips
  let html = `<div style="font-weight:${TOKENS.typography.weights.bold};font-size:14px;margin-bottom:2px">${esc(station.nameEn)}</div>`;
  // Spanish subheading if different
  if (station.nameEn !== station.nameEs) {
    html += `<div style="color:${TOKENS.colors.labelSecondary};font-size:12px;margin-bottom:6px">${esc(station.nameEs)}</div>`;
  } else {
    html += `<div style="margin-bottom:4px"></div>`;
  }

  const details: string[] = [];
  if (station.tradeValueUsd) {
    details.push(`Trade value: ${formatUsd(station.tradeValueUsd)} (${station.tradeValueYear})`);
  }
  if (station.truckCrossingsPerYear) {
    details.push(`Truck crossings: ${formatCount(station.truckCrossingsPerYear)}/yr`);
  }
  if (station.containerVolumeTeu) {
    details.push(`Container volume: ${formatCount(station.containerVolumeTeu)} TEU`);
  }
  if (station.primaryCommodities.length > 0) {
    details.push(`Commodities: ${station.primaryCommodities.map(esc).join(", ")}`);
  }
  if (station.destinationPorts && station.destinationPorts.length > 0) {
    details.push(`Destinations: ${station.destinationPorts.map(esc).join(", ")}`);
  }

  html += details.map((d) => `<div>${d}</div>`).join("");
  html += sourceLabel(station.sourceIds, sources);
  return html;
}

function corridorTooltipHtml(corridor: Corridor, sources: DataSource[]): string {
  const color = TOKENS.colors.corridors[corridor.id] || corridor.color;
  let html = `<div style="font-weight:${TOKENS.typography.weights.bold};font-size:14px;margin-bottom:4px">`;
  html += `<span style="display:inline-block;width:12px;height:12px;background:${color};border-radius:2px;margin-right:6px;vertical-align:middle"></span>`;
  html += `${esc(corridor.nameEs)} / ${esc(corridor.nameEn)}</div>`;

  if (corridor.totalTradeValue) {
    html += `<div>Trade: ${esc(corridor.totalTradeValue)}</div>`;
  }
  if (corridor.primaryCommodities.length > 0) {
    html += `<div>Commodities: ${corridor.primaryCommodities.map(esc).join(", ")}</div>`;
  }
  if (corridor.status === "planned") {
    html += `<div style="color:${color};font-weight:${TOKENS.typography.weights.semibold}">Under construction</div>`;
  }

  html += sourceLabel(corridor.sourceIds, sources);
  return html;
}

function maritimeTooltipHtml(route: MaritimeRoute, sources: DataSource[]): string {
  const color = TOKENS.colors.maritime[route.id] || route.color;
  let html = `<div style="font-weight:${TOKENS.typography.weights.bold};font-size:14px;margin-bottom:4px">`;
  html += `<span style="display:inline-block;width:16px;height:3px;background:${color};margin-right:6px;vertical-align:middle;border-top:1px dashed ${color};border-bottom:1px dashed ${color}"></span>`;
  html += `${esc(route.nameEs)} / ${esc(route.nameEn)}</div>`;
  html += `<div>Carriers: ${route.carriers.map(esc).join(", ")}</div>`;
  html += `<div>Transit: ${esc(String(route.transitTimeDays))} days</div>`;
  if (route.primaryCommodities.length > 0) {
    html += `<div>Cargo: ${route.primaryCommodities.map(esc).join(", ")}</div>`;
  }
  html += sourceLabel(route.sourceIds, sources);
  return html;
}

export function bindTooltips(
  svg: SVGSVGElement,
  stations: Station[],
  corridors: Corridor[],
  sources: DataSource[],
  maritime: MaritimeRoute[] = [],
): void {
  const tooltip = createTooltipElement();
  const stationMap = new Map(stations.map((s) => [s.id, s]));
  const corridorMap = new Map(corridors.map((c) => [c.id, c]));
  const maritimeMap = new Map(maritime.map((m) => [m.id, m]));

  // Station tooltips
  d3.select(svg)
    .selectAll<SVGGElement, unknown>("g.station")
    .on("mouseenter", function (event: MouseEvent) {
      const id = this.getAttribute("data-station-id");
      if (!id) return;
      const station = stationMap.get(id);
      if (!station) return;
      showTooltip(tooltip, stationTooltipHtml(station, sources), event);
    })
    .on("mousemove", function (event: MouseEvent) {
      const id = this.getAttribute("data-station-id");
      if (!id) return;
      const station = stationMap.get(id);
      if (!station) return;
      showTooltip(tooltip, stationTooltipHtml(station, sources), event);
    })
    .on("mouseleave", () => hideTooltip(tooltip))
    .on("touchstart", function (event: TouchEvent) {
      event.preventDefault();
      const id = this.getAttribute("data-station-id");
      if (!id) return;
      const station = stationMap.get(id);
      if (!station) return;
      showTooltip(tooltip, stationTooltipHtml(station, sources), event);
    })
    .on("touchend", () => hideTooltip(tooltip));

  // Corridor tooltips
  d3.select(svg)
    .selectAll<SVGPathElement, unknown>("g.corridors path")
    .on("mouseenter", function (event: MouseEvent) {
      const id = this.getAttribute("data-corridor-id");
      if (!id) return;
      const corridor = corridorMap.get(id);
      if (!corridor) return;
      showTooltip(tooltip, corridorTooltipHtml(corridor, sources), event);
      d3.select(this).attr("opacity", 0.7);
    })
    .on("mousemove", function (event: MouseEvent) {
      const id = this.getAttribute("data-corridor-id");
      if (!id) return;
      const corridor = corridorMap.get(id);
      if (!corridor) return;
      showTooltip(tooltip, corridorTooltipHtml(corridor, sources), event);
    })
    .on("mouseleave", function () {
      hideTooltip(tooltip);
      d3.select(this).attr("opacity", 1);
    })
    .on("touchstart", function (event: TouchEvent) {
      event.preventDefault();
      const id = this.getAttribute("data-corridor-id");
      if (!id) return;
      const corridor = corridorMap.get(id);
      if (!corridor) return;
      showTooltip(tooltip, corridorTooltipHtml(corridor, sources), event);
    })
    .on("touchend", () => hideTooltip(tooltip));

  // Maritime route tooltips
  d3.select(svg)
    .selectAll<SVGPathElement, unknown>("g.maritime-routes path")
    .on("mouseenter", function (event: MouseEvent) {
      const id = this.getAttribute("data-corridor-id");
      if (!id) return;
      const route = maritimeMap.get(id);
      if (!route) return;
      showTooltip(tooltip, maritimeTooltipHtml(route, sources), event);
      d3.select(this).attr("opacity", 0.7);
    })
    .on("mousemove", function (event: MouseEvent) {
      const id = this.getAttribute("data-corridor-id");
      if (!id) return;
      const route = maritimeMap.get(id);
      if (!route) return;
      showTooltip(tooltip, maritimeTooltipHtml(route, sources), event);
    })
    .on("mouseleave", function () {
      hideTooltip(tooltip);
      d3.select(this).attr("opacity", 1);
    })
    .on("touchstart", function (event: TouchEvent) {
      event.preventDefault();
      const id = this.getAttribute("data-corridor-id");
      if (!id) return;
      const route = maritimeMap.get(id);
      if (!route) return;
      showTooltip(tooltip, maritimeTooltipHtml(route, sources), event);
    })
    .on("touchend", () => hideTooltip(tooltip));
}
