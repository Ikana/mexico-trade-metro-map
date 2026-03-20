import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { Station, Corridor, MaritimeRoute, DataSource, HeadlineStat } from "../../src/types/index.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "../processed");

function readJson<T>(filename: string): T {
  const path = resolve(dataDir, filename);
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

let errors = 0;

function fail(rule: string, detail: string): void {
  console.error(`  ✗ [${rule}] ${detail}`);
  errors++;
}

function pass(rule: string): void {
  console.log(`  ✓ ${rule}`);
}

console.log("Validating processed data...\n");

const sources = readJson<DataSource[]>("sources.json");
const corridors = readJson<Corridor[]>("corridors.json");
const stations = readJson<Station[]>("stations.json");
const headlines = readJson<HeadlineStat[]>("headlines.json");
const maritime = readJson<MaritimeRoute[]>("maritime.json");

const sourceIds = new Set(sources.map((s) => s.id));
const stationIds = new Set(stations.map((s) => s.id));
const corridorIds = new Set(corridors.map((c) => c.id));

// Rule 1: Every corridorIds entry in a station must match a corridor id
let rule1ok = true;
for (const station of stations) {
  for (const cid of station.corridorIds) {
    if (!corridorIds.has(cid)) {
      fail("Rule 1", `Station "${station.id}" references unknown corridor "${cid}"`);
      rule1ok = false;
    }
  }
}
if (rule1ok) pass("Rule 1: All station corridorIds reference valid corridors");

// Rule 2: Every stationIds entry in a corridor must match a station id
let rule2ok = true;
for (const corridor of corridors) {
  for (const sid of corridor.stationIds) {
    if (!stationIds.has(sid)) {
      fail("Rule 2", `Corridor "${corridor.id}" references unknown station "${sid}"`);
      rule2ok = false;
    }
  }
}
if (rule2ok) pass("Rule 2: All corridor stationIds reference valid stations");

// Rule 3: Every sourceIds entry must match a source id
let rule3ok = true;
for (const station of stations) {
  for (const sid of station.sourceIds) {
    if (!sourceIds.has(sid)) {
      fail("Rule 3", `Station "${station.id}" references unknown source "${sid}"`);
      rule3ok = false;
    }
  }
}
for (const corridor of corridors) {
  for (const sid of corridor.sourceIds) {
    if (!sourceIds.has(sid)) {
      fail("Rule 3", `Corridor "${corridor.id}" references unknown source "${sid}"`);
      rule3ok = false;
    }
  }
}
for (const headline of headlines) {
  if (!sourceIds.has(headline.sourceId)) {
    fail("Rule 3", `Headline "${headline.id}" references unknown source "${headline.sourceId}"`);
    rule3ok = false;
  }
}
if (rule3ok) pass("Rule 3: All sourceIds reference valid sources");

// Rule 4: Border crossings must have country MX/US
let rule4ok = true;
for (const station of stations) {
  if (station.type === "border-crossing" && station.country !== "MX/US") {
    fail("Rule 4", `Border crossing "${station.id}" has country "${station.country}" instead of "MX/US"`);
    rule4ok = false;
  }
}
if (rule4ok) pass("Rule 4: All border crossings have country MX/US");

// Rule 5: Planned corridors must have dashed line style
let rule5ok = true;
for (const corridor of corridors) {
  if (corridor.status === "planned" && corridor.lineStyle !== "dashed") {
    fail("Rule 5", `Planned corridor "${corridor.id}" has lineStyle "${corridor.lineStyle}" instead of "dashed"`);
    rule5ok = false;
  }
}
if (rule5ok) pass("Rule 5: All planned corridors have dashed line style");

// Rule 6: Every station must appear in at least one corridor or maritime route
const stationsInRoutes = new Set<string>();
for (const corridor of corridors) {
  for (const sid of corridor.stationIds) {
    stationsInRoutes.add(sid);
  }
}
for (const route of maritime) {
  for (const sid of route.stationIds) {
    stationsInRoutes.add(sid);
  }
}
let rule6ok = true;
for (const station of stations) {
  if (!stationsInRoutes.has(station.id)) {
    fail("Rule 6", `Station "${station.id}" is not referenced by any corridor or maritime route`);
    rule6ok = false;
  }
}
if (rule6ok) pass("Rule 6: All stations appear in at least one corridor or maritime route");

// Rule 7: Maritime route stationIds must reference valid stations
let rule7ok = true;
for (const route of maritime) {
  for (const sid of route.stationIds) {
    if (!stationIds.has(sid)) {
      fail("Rule 7", `Maritime route "${route.id}" references unknown station "${sid}"`);
      rule7ok = false;
    }
  }
}
if (rule7ok) pass("Rule 7: All maritime stationIds reference valid stations");

// Rule 8: Maritime route sourceIds must reference valid sources
let rule8ok = true;
for (const route of maritime) {
  for (const sid of route.sourceIds) {
    if (!sourceIds.has(sid)) {
      fail("Rule 8", `Maritime route "${route.id}" references unknown source "${sid}"`);
      rule8ok = false;
    }
  }
}
if (rule8ok) pass("Rule 8: All maritime sourceIds reference valid sources");

// Rule 9: Terminal regions must have country INTL and destinationPorts
let rule9ok = true;
for (const station of stations) {
  if (station.type === "terminal-region") {
    if (station.country !== "INTL") {
      fail("Rule 9", `Terminal region "${station.id}" has country "${station.country}" instead of "INTL"`);
      rule9ok = false;
    }
    if (!station.destinationPorts || station.destinationPorts.length === 0) {
      fail("Rule 9", `Terminal region "${station.id}" missing destinationPorts`);
      rule9ok = false;
    }
  }
}
if (rule9ok) pass("Rule 9: All terminal regions have INTL country and destinationPorts");

// Rule 10: Terminal regions must appear in at least one maritime route
const terminalsInMaritime = new Set<string>();
for (const route of maritime) {
  for (const sid of route.stationIds) {
    const s = stations.find((st) => st.id === sid);
    if (s?.type === "terminal-region") terminalsInMaritime.add(sid);
  }
}
let rule10ok = true;
for (const station of stations) {
  if (station.type === "terminal-region" && !terminalsInMaritime.has(station.id)) {
    fail("Rule 10", `Terminal region "${station.id}" not in any maritime route`);
    rule10ok = false;
  }
}
if (rule10ok) pass("Rule 10: All terminal regions appear in at least one maritime route");

// Rule 11: No isolated land corridors (every corridor shares a station with another)
let rule11ok = true;
for (const corridor of corridors) {
  const myStations = new Set(corridor.stationIds);
  const hasShared = corridors.some(
    (other) => other.id !== corridor.id && other.stationIds.some((sid) => myStations.has(sid)),
  );
  if (!hasShared) {
    fail("Rule 11", `Corridor "${corridor.id}" shares no stations with any other corridor`);
    rule11ok = false;
  }
}
if (rule11ok) pass("Rule 11: No isolated corridors");

console.log(`\n${errors === 0 ? "✓ All validations passed" : `✗ ${errors} error(s) found`}`);
process.exit(errors > 0 ? 1 : 0);
