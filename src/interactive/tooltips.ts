import * as d3 from "d3";
import type { Station, Corridor, DataSource } from "../types/index.ts";

const TOOLTIP_CLASS = "trade-tooltip";

function createTooltipElement(): HTMLDivElement {
  let el = document.querySelector(`.${TOOLTIP_CLASS}`) as HTMLDivElement;
  if (el) return el;

  el = document.createElement("div");
  el.className = TOOLTIP_CLASS;
  Object.assign(el.style, {
    position: "fixed",
    pointerEvents: "none",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "12px 16px",
    fontSize: "13px",
    lineHeight: "1.5",
    maxWidth: "320px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    zIndex: "1000",
    display: "none",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#1a1a1a",
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
    .map((s) => `${s!.authority} (${s!.dataYear})`);
  return names.length > 0
    ? `<div style="color:#888;font-size:11px;margin-top:4px">Source: ${names.join(", ")}</div>`
    : "";
}

function stationTooltipHtml(station: Station, sources: DataSource[]): string {
  let html = `<div style="font-weight:bold;font-size:14px;margin-bottom:4px">${station.nameEs}</div>`;
  if (station.nameEn !== station.nameEs) {
    html += `<div style="color:#666;font-size:12px;margin-bottom:6px">${station.nameEn}</div>`;
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
    details.push(`Commodities: ${station.primaryCommodities.join(", ")}`);
  }

  html += details.map((d) => `<div>${d}</div>`).join("");
  html += sourceLabel(station.sourceIds, sources);
  return html;
}

function corridorTooltipHtml(corridor: Corridor, sources: DataSource[]): string {
  let html = `<div style="font-weight:bold;font-size:14px;margin-bottom:4px">`;
  html += `<span style="display:inline-block;width:12px;height:12px;background:${corridor.color};border-radius:2px;margin-right:6px;vertical-align:middle"></span>`;
  html += `${corridor.nameEs} / ${corridor.nameEn}</div>`;

  if (corridor.totalTradeValue) {
    html += `<div>Trade: ${corridor.totalTradeValue}</div>`;
  }
  if (corridor.primaryCommodities.length > 0) {
    html += `<div>Commodities: ${corridor.primaryCommodities.join(", ")}</div>`;
  }
  if (corridor.status === "planned") {
    html += `<div style="color:#9B5DE5;font-weight:bold">Under construction</div>`;
  }

  html += sourceLabel(corridor.sourceIds, sources);
  return html;
}

export function bindTooltips(
  svg: SVGSVGElement,
  stations: Station[],
  corridors: Corridor[],
  sources: DataSource[],
): void {
  const tooltip = createTooltipElement();
  const stationMap = new Map(stations.map((s) => [s.id, s]));
  const corridorMap = new Map(corridors.map((c) => [c.id, c]));

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
}
