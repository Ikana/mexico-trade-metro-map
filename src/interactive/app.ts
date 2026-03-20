import { renderMap } from "../map/renderer.ts";
import { renderLegend } from "../map/legend.ts";
import { bindTooltips } from "./tooltips.ts";
import { makeResponsive } from "./responsive.ts";
import * as d3 from "d3";
import type {
  Station,
  Corridor,
  MaritimeRoute,
  DataSource,
  HeadlineStat,
} from "../types/index.ts";
import stationsData from "../../data/processed/stations.json";
import corridorsData from "../../data/processed/corridors.json";
import maritimeData from "../../data/processed/maritime.json";
import sourcesData from "../../data/processed/sources.json";
import headlinesData from "../../data/processed/headlines.json";

const stations = stationsData as Station[];
const corridors = corridorsData as Corridor[];
const maritime = maritimeData as MaritimeRoute[];
const sources = sourcesData as DataSource[];
const headlines = headlinesData as HeadlineStat[];

const container = document.getElementById("map");
if (container) {
  const svgEl = renderMap(container, { stations, corridors, maritime });
  const svg = d3.select(svgEl);
  renderLegend(svg, corridors, headlines, maritime);
  bindTooltips(svgEl, stations, corridors, sources, maritime);
  makeResponsive(svgEl);

  // Data attribution footer
  const footer = document.createElement("footer");
  footer.style.cssText =
    "max-width:1400px;margin:1rem auto;padding:0 1rem;font-size:12px;color:#888;line-height:1.6";

  const sourceList = sources
    .map((s) => {
      const link = s.url
        ? `<a href="${s.url}" target="_blank" rel="noopener" style="color:#457B9D">${s.name}</a>`
        : s.name;
      return `${link} (${s.authority}, ${s.dataYear})`;
    })
    .join(" · ");

  footer.innerHTML = `<p><strong>Data sources:</strong> ${sourceList}</p>`;
  document.body.appendChild(footer);
}
