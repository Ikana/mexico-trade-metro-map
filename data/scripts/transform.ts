import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rawDir = resolve(__dirname, "../raw");
const outDir = resolve(__dirname, "../processed");

mkdirSync(outDir, { recursive: true });

function readJson<T>(filename: string): T {
  const path = resolve(rawDir, filename);
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function writeJson(filename: string, data: unknown): void {
  const path = resolve(outDir, filename);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log(`  ✓ ${filename}`);
}

console.log("Transforming raw data → processed JSON...\n");

const sources = readJson("sources.json");
const corridors = readJson("corridors-raw.json");
const stations = readJson("stations-raw.json");
const headlines = readJson("headlines-raw.json");

writeJson("sources.json", sources);
writeJson("corridors.json", corridors);
writeJson("stations.json", stations);
writeJson("headlines.json", headlines);

console.log("\nDone. Output in data/processed/");
