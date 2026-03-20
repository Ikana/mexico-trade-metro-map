# Implementation Plan: Sea Routes & Corridor Interconnections

**Branch**: `002-sea-routes-interconnect` | **Date**: 2026-03-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-sea-routes-interconnect/spec.md`

## Summary

Extend the Mexico Trade Metro Map with two major changes: (1) interconnect
all existing land corridors through shared hub stations so the map reads as
a connected metro network, and (2) add 4 maritime shipping routes (2 Pacific,
2 Gulf/Atlantic) with 3 new port stations. This modifies existing data files
and renderers — no new dependencies or architecture changes needed.

## Technical Context

**Language/Version**: TypeScript 5.x (same as V1)
**Primary Dependencies**: D3.js v7, Vite (same as V1)
**Storage**: JSON data files (same as V1)
**Testing**: Vitest, Playwright (same as V1)
**Target Platform**: Modern browsers + static SVG/PDF (same as V1)
**Project Type**: Static web application + data visualization
**Performance Goals**: Same as V1 (< 3s load, < 200ms tooltips)
**Constraints**: All data baked at build time; static hosting
**Scale/Scope**: 9 land corridors (modified), 4 maritime routes (new),
~31 stations (was ~25), ~5 terminal region stations (new),
~19 data sources (was ~11)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Data Provenance | PASS | New maritime routes cite CMA CGM, MSC, Cosco, FreightWaves, Pro Mexico Industry. New ports cite TEU volumes with year. |
| II. Research-Backed Claims | PASS | Transit times (15-20 days), TEU volumes (Lázaro Cárdenas 2.2M, Altamira 880K, Ensenada 300K), carrier names all sourced. |
| III. Publication-Grade Quality | PASS | Maritime routes use distinct dot-dash line style. New legend section for maritime routes. Bilingual labels maintained. |
| IV. Audience Clarity | PASS | Grouped terminal regions ("→ Asia") simplify international destinations. Interchange symbols clarify multi-corridor hubs. |
| V. Reproducibility | PASS | Same data pipeline: raw JSON → transform → validate → processed JSON. New data follows existing schema patterns. |
| Data Standards | PASS | Same units (USD, TEU). New sources documented with access dates. |
| Publication Workflow | PASS | Same PR-based review process. |

No violations. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-sea-routes-interconnect/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (changes to existing V1 structure)

```text
data/
├── raw/
│   ├── sources.json          # ADD 8 new maritime/port sources
│   ├── corridors-raw.json    # MODIFY stationIds for interconnections
│   ├── stations-raw.json     # ADD 3 ports + ~5 terminal regions
│   ├── headlines-raw.json    # No changes
│   └── maritime-raw.json     # NEW: 4 maritime route definitions
└── scripts/
    ├── transform.ts          # MODIFY: handle maritime routes
    └── validate.ts           # MODIFY: add maritime validation rules

src/
├── map/
│   ├── renderer.ts           # MODIFY: draw maritime lines (dot-dash),
│   │                         #   terminal region stations, interchange
│   │                         #   symbols for multi-corridor hubs
│   ├── styles.ts             # MODIFY: add maritime colors, dot-dash
│   │                         #   pattern, terminal region styling
│   └── legend.ts             # MODIFY: add maritime routes section
├── interactive/
│   ├── tooltips.ts           # MODIFY: maritime route tooltips with
│   │                         #   carriers, transit times
│   └── app.ts                # MODIFY: load maritime data
├── export/
│   └── svg.ts                # MODIFY: render maritime routes in export
└── types/
    └── index.ts              # MODIFY: add MaritimeRoute, TerminalRegion
```

**Structure Decision**: No new directories. All changes modify existing
V1 files or add one new data file (maritime-raw.json). The existing
project structure accommodates this feature cleanly.

## Complexity Tracking

> No Constitution Check violations. No complexity justification needed.
