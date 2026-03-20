/**
 * Export the complete trade metro map as a single self-contained
 * node-link graph JSON with all data embedded.
 *
 * Compatible with D3, NetworkX (node_link_graph), Gephi, Cytoscape.
 *
 * Run with: npm run data:graph
 * Output:   data/processed/graph.json
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "../processed");
const rawDir = resolve(__dirname, "../raw");

function read<T>(dir: string, filename: string): T {
  return JSON.parse(readFileSync(resolve(dir, filename), "utf-8")) as T;
}

const stations = read<any[]>(dataDir, "stations.json");
const corridors = read<any[]>(dataDir, "corridors.json");
const maritime = read<any[]>(dataDir, "maritime.json");
const sources = read<any[]>(dataDir, "sources.json");
const headlines = read<any[]>(dataDir, "headlines.json");

// --- Nodes: every field from every station, nothing stripped ---
const sourceMap = new Map(sources.map((s: any) => [s.id, s]));

const nodes = stations.map((s: any) => {
  const stationSources = (s.sourceIds || [])
    .map((id: string) => sourceMap.get(id))
    .filter(Boolean);

  return {
    id: s.id,
    nameEs: s.nameEs,
    nameEn: s.nameEn,
    country: s.country,
    type: s.type,
    tier: s.tier,
    x: s.x,
    y: s.y,
    tradeValueUsd: s.tradeValueUsd,
    tradeValueYear: s.tradeValueYear,
    truckCrossingsPerYear: s.truckCrossingsPerYear,
    containerVolumeTeu: s.containerVolumeTeu,
    primaryCommodities: s.primaryCommodities,
    corridorIds: s.corridorIds,
    ...(s.destinationPorts && { destinationPorts: s.destinationPorts }),
    sources: stationSources,
  };
});

// --- Edges: one per consecutive station pair, with full route context ---
interface Edge {
  source: string;
  target: string;
  route: string;
  routeNameEs: string;
  routeNameEn: string;
  color: string;
  kind: "land" | "maritime";
  lineStyle: string;
  lineWeight: string;
  primaryCommodities: string[];
  evidence: string;
  [key: string]: unknown;
}

const edges: Edge[] = [];
const seen = new Set<string>();

function addEdges(route: any, kind: "land" | "maritime") {
  const routeSources = (route.sourceIds || [])
    .map((id: string) => sourceMap.get(id))
    .filter(Boolean);

  for (let i = 0; i < route.stationIds.length - 1; i++) {
    const source = route.stationIds[i];
    const target = route.stationIds[i + 1];
    const key = `${source}--${target}--${route.id}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const edge: Edge = {
      source,
      target,
      route: route.id,
      routeNameEs: route.nameEs,
      routeNameEn: route.nameEn,
      color: route.color,
      kind,
      lineStyle: route.lineStyle,
      lineWeight: route.lineWeight,
      primaryCommodities: route.primaryCommodities,
      evidence: route.evidence,
      sources: routeSources,
    };

    // Land-specific
    if (route.primaryMode) edge.primaryMode = route.primaryMode;
    if (route.status) edge.status = route.status;
    if (route.totalTradeValue) edge.totalTradeValue = route.totalTradeValue;

    // Maritime-specific
    if (route.carriers) edge.carriers = route.carriers;
    if (route.transitTimeDays) edge.transitTimeDays = route.transitTimeDays;
    if (route.ocean) edge.ocean = route.ocean;

    edges.push(edge);
  }
}

for (const c of corridors) addEdges(c, "land");
for (const m of maritime) addEdges(m, "maritime");

// --- Full routes as a reference list ---
const routes = [
  ...corridors.map((c: any) => ({
    ...c,
    kind: "land" as const,
    sources: (c.sourceIds || []).map((id: string) => sourceMap.get(id)).filter(Boolean),
  })),
  ...maritime.map((m: any) => ({
    ...m,
    kind: "maritime" as const,
    sources: (m.sourceIds || []).map((id: string) => sourceMap.get(id)).filter(Boolean),
  })),
];

// --- Assemble the complete graph ---
const graph = {
  directed: false,
  multigraph: true,
  graph: {
    name: "Mexico Trade Metro Map",
    description:
      "Schematic metro-style network of Mexico's land trade corridors and maritime shipping routes. " +
      "All data is research-backed with full provenance to authoritative sources.",
    version: "2.0.0",
    generated: new Date().toISOString().split("T")[0],
    stats: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      landCorridors: corridors.length,
      maritimeRoutes: maritime.length,
      megaHubs: nodes.filter((n: any) => n.tier === "mega").length,
      majorHubs: nodes.filter((n: any) => n.tier === "major").length,
      standardStations: nodes.filter((n: any) => n.tier === "standard").length,
      terminalRegions: nodes.filter((n: any) => n.type === "terminal-region").length,
      borderCrossings: nodes.filter((n: any) => n.type === "border-crossing").length,
      ports: nodes.filter((n: any) => n.type === "port").length,
      dataSources: sources.length,
    },
    headlines: headlines,
  },
  nodes,
  links: edges,
  routes,
  sources,
};

const outPath = resolve(dataDir, "graph.json");
writeFileSync(outPath, JSON.stringify(graph, null, 2) + "\n", "utf-8");

const kb = (Buffer.byteLength(JSON.stringify(graph)) / 1024).toFixed(1);
console.log(`✓ Exported ${outPath} (${kb} KB)`);
console.log(`  ${nodes.length} nodes, ${edges.length} edges, ${routes.length} routes, ${sources.length} sources`);
