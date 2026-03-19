# Research: Trade Metro Map V1

**Date**: 2026-03-19
**Feature**: 001-trade-metro-map-v1

## Decision 1: Map Rendering Approach

**Decision**: Use D3.js v7 with hand-crafted schematic coordinates,
informed by d3-tube-map's data format for Beck-style layout.

**Rationale**: Beck-style schematic maps require editorial control
over station placement — automated layout tools (LOOM, Mixed Integer
Programming solvers) produce geographically-influenced layouts that
don't achieve the Tube-map aesthetic. d3-tube-map provides a proven
JSON schema and D3 rendering pipeline specifically for this style.
D3.js gives full control over SVG output, which is critical for
print-quality export.

**Alternatives considered**:
- **LOOM suite** (ad-freiburg/loom): Generates geographically correct
  or schematic maps, but requires significant preprocessing and
  produces algorithmically-optimized layouts rather than
  editorially-curated ones. Better for transit systems with hundreds
  of stations; overkill for 28 stations.
- **juliuste/transit-map**: Uses Mixed Integer Programming to
  generate schematic layouts. Academic quality but slow, complex
  dependency chain, and removes editorial control over aesthetics.
- **Raw SVG (no library)**: Maximum control but rebuilds rendering
  primitives that D3 already provides (scales, selections, transitions).
- **MetroFlow**: Pre-alpha, HTML Canvas based (not SVG), not suitable
  for print export.

**Sources**:
- d3-tube-map: https://github.com/johnwalley/d3-tube-map
- LOOM: https://github.com/ad-freiburg/loom
- transit-map: https://github.com/juliuste/transit-map

## Decision 2: Static SVG + PDF Export

**Decision**: Render the map as inline SVG in the browser. For PDF
export, use client-side SVG serialization + jsPDF or a build-time
Puppeteer/Playwright PDF capture.

**Rationale**: The map is a single SVG element. For the static
artifact (poster), a build-time approach (Playwright renders the
page, exports PDF) is more reliable than client-side PDF generation,
which can lose font embedding or color fidelity. The build script
produces both the SVG file and PDF as artifacts.

**Alternatives considered**:
- **d3-save-pdf (client-side)**: Fork of NYTimes d3-save-svg. Works
  for simple charts but unreliable for complex multi-layer SVGs with
  embedded fonts and precise typography.
- **wkhtmltopdf (server-side)**: Requires Qt WebKit, heavy dependency.
  Playwright is already in the stack for visual testing and produces
  better output.
- **Inkscape CLI**: Could convert SVG→PDF but adds a non-JS dependency.

## Decision 3: Data Pipeline

**Decision**: TypeScript scripts in `data/scripts/` transform raw
source files (CSV/JSON from BTS, etc.) into processed JSON files
that the map renderer consumes. The pipeline runs as a build step.

**Rationale**: Keeps the data transformation reproducible and
version-controlled (Constitution Principle V). TypeScript ensures
type safety between the data pipeline output and the renderer's
expected input. No separate language runtime needed — the same
toolchain builds both data and app.

**Alternatives considered**:
- **Python + pandas**: More natural for data work, but adds a second
  language runtime. The data transforms here are simple
  (filtering, reshaping, joining) — not statistical computing.
- **Shell scripts + jq**: Fragile for anything beyond trivial
  transforms. No type safety.

## Decision 4: Build Tooling + Hosting

**Decision**: Vite for development and production builds. Deploy as
a static site to GitHub Pages.

**Rationale**: Vite handles TypeScript compilation, asset bundling,
and dev server with hot reload. GitHub Pages is free, requires no
infrastructure, and integrates with the repo's CI. The site is a
single page with no routing — Vite's defaults work perfectly.

**Alternatives considered**:
- **Webpack**: Heavier configuration, slower builds. No advantage
  for a single-page project.
- **Parcel**: Zero-config like Vite but less ecosystem support and
  slower adoption.
- **Netlify/Vercel**: More features (serverless functions, forms)
  but unnecessary for a static visualization.

## Decision 5: Schematic Layout Strategy

**Decision**: Hand-craft station coordinates on an octolinear grid
(horizontal, vertical, 45° diagonals only). Store coordinates in
the station data JSON. Iterate visually.

**Rationale**: Beck's Tube map innovation was the editorial choice
of where to place stations for maximum readability, sacrificing
geographic accuracy. This is a design problem, not an algorithmic
one. With only 28 stations across 9 lines, manual placement is
feasible and produces better results than any automated solver.
The octolinear constraint (only 0°, 45°, 90° angles) is enforced
in the data schema.

**Alternatives considered**:
- **Force-directed layout (D3 force simulation)**: Produces organic
  but non-schematic layouts. Does not respect the octolinear
  constraint. Used in d3metro but results look nothing like a
  Tube map.
- **Geographic projection + simplification**: Start from real
  coordinates and simplify. Produces geographic maps, not schematic
  ones. Defeats the core design principle.

## Decision 6: Typography + Design System

**Decision**: Use a clean sans-serif font stack (system fonts for
web, embedded font for SVG/PDF export). Define a color palette
matching the corridor colors from the spec. Station sizes defined
as fixed pixel radii per tier.

**Rationale**: System fonts load instantly (no web font latency).
For PDF/SVG export, embed a specific font (e.g., Inter or similar
open-source sans-serif) to ensure cross-platform consistency. The
color palette is already defined by the 9 corridor colors in the
spec — no design decisions needed beyond ensuring sufficient
contrast and accessibility.

**Design tokens** (preliminary):
- Mega hub station radius: 12px
- Major hub station radius: 8px
- Standard station radius: 5px
- Line thickness (high volume): 8px
- Line thickness (medium volume): 5px
- Line thickness (low volume / planned): 3px (dashed for planned)
