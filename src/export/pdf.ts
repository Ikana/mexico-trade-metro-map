/**
 * PDF Export: Renders the SVG map to an A2-size PDF using Playwright.
 * Run with: npm run export:pdf
 * Requires: npx playwright install chromium
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");
const svgPath = resolve(root, "dist/map.svg");

async function exportPdf() {
  const svgContent = readFileSync(svgPath, "utf-8");

  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; }
    svg { width: 100%; height: auto; }
  </style>
</head>
<body>${svgContent}</body>
</html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });

  mkdirSync(resolve(root, "dist"), { recursive: true });

  await page.pdf({
    path: resolve(root, "dist/map-a2.pdf"),
    width: "420mm",
    height: "594mm",
    printBackground: true,
    margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
  });

  await browser.close();
  console.log("✓ Exported dist/map-a2.pdf (A2: 420mm × 594mm)");
}

exportPdf().catch((err) => {
  console.error("PDF export failed:", err.message);
  console.error("Run: npx playwright install chromium");
  process.exit(1);
});
