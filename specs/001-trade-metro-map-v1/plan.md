# Implementation Plan: Trade Metro Map V1

**Branch**: `001-trade-metro-map-v1` | **Date**: 2026-03-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-trade-metro-map-v1/spec.md`

## Summary

Build a subway/metro-style schematic map of Mexico's land trade
corridors. The MVP is a publication-quality static SVG/PDF map with
9 color-coded trade routes, 25+ stations in 3 visual tiers, and
bilingual labeling. The interactive web version adds hover tooltips
with sourced trade statistics, deployed as a static site. All data
is research-backed with full provenance to authoritative sources
(BTS, ARTF, Laredo EDC, etc.).

## Technical Context

**Language/Version**: TypeScript 5.x (data pipeline + web app),
JSON (map data schema)
**Primary Dependencies**: D3.js v7 (SVG rendering + interactivity),
d3-tube-map (Beck-style schematic layout foundation), Vite (build
tooling)
**Storage**: JSON data files committed to repo (no database)
**Testing**: Vitest (unit tests for data transforms), Playwright
(visual regression for map output)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge);
static SVG/PDF for print
**Project Type**: Static web application + data visualization
**Performance Goals**: < 3s initial load, < 200ms tooltip response
**Constraints**: All data baked at build time; no runtime API calls;
static hosting only (GitHub Pages)
**Scale/Scope**: 9 corridors, ~28 stations, ~11 data sources;
single-page web app

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1
design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Data Provenance | PASS | Every station/corridor in spec traces to BTS, ARTF, Laredo EDC, or other primary source. Data dictionary planned (US3). Raw data preserved in `data/raw/`. |
| II. Research-Backed Claims | PASS | All figures cite primary sources with year. Derived metrics show calculation basis. Infrastructure status claims dated. |
| III. Publication-Grade Quality | PASS | SVG + PDF outputs specified (FR-005). Design system with defined colors per corridor. Bilingual labels required (FR-004). Data-vintage annotation (FR-010). |
| IV. Audience Clarity | PASS | Schematic layout (FR-003). Visual weight encodes volume (FR-012). Glossary for technical terms planned. |
| V. Reproducibility | PASS | Data transform scripts committed alongside data. Single build command regenerates all outputs. Dependencies declared in package.json + lockfile. |
| Data Standards | PASS | Canonical sources used. Data currency: 2024-2025 vintage. Units: USD, TEU, integer counts. CSV + JSON with data dictionary. |
| Publication Workflow | PASS | Peer review via PR process. Fact-check gate before publish. Version numbering on artifacts. License selection required before release. |

No violations. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-trade-metro-map-v1/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (data schema contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
data/
├── raw/                 # Original source files (CSV, XLSX, JSON)
│   └── sources.json     # Provenance metadata per raw file
├── processed/           # Cleaned/transformed data
│   ├── corridors.json   # Trade corridor definitions + stats
│   ├── stations.json    # Station data with tier assignments
│   └── data-dictionary.md
└── scripts/             # Data transformation scripts
    └── transform.ts     # Raw → processed pipeline

src/
├── map/
│   ├── renderer.ts      # D3 SVG rendering (lines, stations, labels)
│   ├── styles.ts        # Design system (colors, typography, sizing)
│   └── legend.ts        # Bilingual legend + data-vintage annotation
├── interactive/
│   ├── tooltips.ts      # Hover/tap tooltip with sourced stats
│   ├── responsive.ts    # Viewport adaptation (375px–2560px)
│   └── app.ts           # Entry point, binds data + renderer
├── export/
│   └── pdf.ts           # SVG-to-PDF export for print (A2+)
└── types/
    └── index.ts         # TypeScript interfaces for all entities

public/
├── index.html           # Single-page shell
└── fonts/               # Typography assets

tests/
├── unit/                # Data transform + schema validation tests
└── visual/              # Playwright visual regression snapshots
```

**Structure Decision**: Single project with clear separation between
data pipeline (`data/`), map rendering (`src/map/`), interactivity
(`src/interactive/`), and export (`src/export/`). No backend needed —
all data is baked into the build output as static JSON.

## Complexity Tracking

> No Constitution Check violations. No complexity justification needed.
