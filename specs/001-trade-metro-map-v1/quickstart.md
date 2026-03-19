# Quickstart: Trade Metro Map V1

**Date**: 2026-03-19

## Prerequisites

- Node.js 20+ and npm
- Git

## Setup

```bash
git clone <repo-url>
cd mexico-trade-metro-map
git checkout 001-trade-metro-map-v1
npm install
```

## Development

```bash
# Start dev server with hot reload
npm run dev

# Open http://localhost:5173 in your browser
```

## Build

```bash
# Build the static site + generate SVG/PDF exports
npm run build

# Output goes to dist/
# - dist/index.html       (interactive web map)
# - dist/map.svg           (static vector map)
# - dist/map-a2.pdf        (print-ready PDF, A2 size)
```

## Data Pipeline

```bash
# Regenerate processed data from raw sources
npm run data:transform

# Validate processed data against JSON schemas
npm run data:validate
```

## Testing

```bash
# Run unit tests (data transforms, schema validation)
npm run test

# Run visual regression tests (requires built map)
npm run test:visual
```

## Project Structure

```text
data/raw/          → Original source files (do not modify)
data/processed/    → Generated JSON (regenerate with data:transform)
data/scripts/      → Transformation scripts
src/map/           → SVG rendering (layout, styles, legend)
src/interactive/   → Tooltips, responsiveness, app entry
src/export/        → PDF export
src/types/         → TypeScript interfaces
public/            → Static assets (HTML shell, fonts)
tests/             → Unit + visual regression tests
```

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server at localhost:5173 |
| `npm run build` | Production build → dist/ |
| `npm run data:transform` | Raw data → processed JSON |
| `npm run data:validate` | Validate JSON against schemas |
| `npm run test` | Unit tests |
| `npm run test:visual` | Visual regression tests |
| `npm run export:svg` | Export static SVG map |
| `npm run export:pdf` | Export A2 print PDF |
