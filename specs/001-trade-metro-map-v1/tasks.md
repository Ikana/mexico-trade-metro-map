# Tasks: Trade Metro Map V1

**Input**: Design documents from `/specs/001-trade-metro-map-v1/`
**Prerequisites**: plan.md (required), spec.md (required), research.md,
data-model.md, contracts/

**Tests**: Not explicitly requested in the spec. Test tasks are omitted.

**Organization**: Tasks grouped by user story for independent
implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2, US3)
- Exact file paths included in descriptions

---

## Phase 1: Setup

**Purpose**: Project initialization and tooling configuration

- [x] T001 Initialize TypeScript project with Vite: run `npm init`,
  install `vite`, `typescript`, `d3`, `d3-tube-map` as dependencies
  and `playwright` as a dev dependency (needed for PDF export and
  visual testing); create `tsconfig.json` and `vite.config.ts` at
  repository root
- [x] T002 [P] Create project directory structure per plan: `data/raw/`,
  `data/processed/`, `data/scripts/`, `src/map/`, `src/interactive/`,
  `src/export/`, `src/types/`, `public/`, `tests/unit/`, `tests/visual/`
- [x] T003 [P] Create TypeScript interfaces for all entities (Station,
  Corridor, DataSource, HeadlineStat) in `src/types/index.ts` per
  data-model.md
- [x] T004 [P] Create `public/index.html` single-page shell with
  viewport meta tag, bilingual `<title>`, and mount point `<div id="map">`
- [x] T005 [P] Add npm scripts to `package.json`: `dev`, `build`,
  `data:transform`, `data:validate`, `export:svg`, `export:pdf`

**Checkpoint**: Project builds and serves an empty page at localhost:5173

---

## Phase 2: Foundational (Data Pipeline)

**Purpose**: Curate and validate the trade data that all user stories
depend on. MUST complete before any map rendering.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Create `data/raw/sources.json` with provenance metadata for
  all 11 data sources from spec (BTS, ARTF, Laredo EDC, PDN Uno,
  Contecon, etc.) following the DataSource schema in contracts/
- [x] T007 Populate `data/raw/corridors-raw.json` with all 9 corridor
  definitions from spec: names (ES/EN), colors, station sequences,
  evidence statements, source references, status, and line weight
- [x] T008 Populate `data/raw/stations-raw.json` with all ~28 stations
  from spec: names (ES/EN), country, type, tier, trade stats (USD, TEU,
  truck crossings), commodity lists, and source references
- [x] T009 [P] Populate `data/raw/headlines-raw.json` with the 5
  headline statistics from spec ($872.8B, 73.6% truck, #1 partner,
  ~40% Laredo, 3.99M vehicles) with source references
- [x] T010 Create data transformation script `data/scripts/transform.ts`
  that reads raw JSON files, validates against JSON schemas from
  contracts/, adds schematic x/y coordinates to stations, and writes
  processed JSON to `data/processed/`
- [x] T011 Create JSON schema validation utility
  `data/scripts/validate.ts` implementing the 6 cross-file validation
  rules from contracts/data-schema.md (referential integrity for
  corridorIds, stationIds, sourceIds; border-crossing country check;
  planned corridor style check; orphan station check)
- [x] T012 [P] Create `data/processed/data-dictionary.md` documenting
  every field in the processed JSON files: column name, type, unit,
  description, and source reference. Include a "Currency Basis" note
  stating all USD values are nominal (not inflation-adjusted) per
  constitution Data Standards
- [x] T013 Run `data:transform` and `data:validate` to produce and
  verify `data/processed/corridors.json`, `data/processed/stations.json`,
  `data/processed/sources.json`, `data/processed/headlines.json`

**Checkpoint**: All processed data files exist, pass schema validation,
and pass cross-file integrity checks. Data pipeline is reproducible.

---

## Phase 3: User Story 1 — Static Schematic Map (Priority: P1) MVP

**Goal**: A publication-quality static SVG map showing 9 trade corridors,
~28 stations in 3 tiers, bilingual labels, and data-vintage annotation.
Exportable as SVG file and print-ready PDF.

**Independent Test**: Print or display the SVG. A first-time viewer
identifies the busiest corridor and traces a route from Manzanillo to
the US border within 30 seconds.

### Implementation for User Story 1

- [x] T014 [US1] Define the design system in `src/map/styles.ts`:
  corridor hex colors (9 colors), station radii per tier (mega=12px,
  major=8px, standard=5px), line thickness per weight (high=8px,
  medium=5px, low=3px), dashed pattern for planned lines, font stack,
  label sizes
- [x] T015 [US1] Assign schematic x/y coordinates for all ~28 stations
  in `data/raw/stations-raw.json` using an octolinear grid (only 0, 45,
  90 degree angles). Place CDMX as central hub, Laredo/Nuevo Laredo at
  top, border crossings along top edge, Pacific ports at left,
  Gulf ports at right. Re-run `data:transform` after coordinate changes
- [x] T016 [US1] Implement the core SVG renderer in `src/map/renderer.ts`
  using D3.js: load processed JSON data, draw corridor lines between
  consecutive station pairs (polylines following octolinear grid),
  apply color and thickness from styles, draw dashed lines for planned
  corridors
- [x] T017 [US1] Add station rendering to `src/map/renderer.ts`: draw
  circles at station coordinates sized by tier, fill with white and
  stroke with corridor color, handle multi-corridor stations (interchange
  dots)
- [x] T018 [US1] Add label rendering to `src/map/renderer.ts`: place
  station name labels in Spanish adjacent to station dots, handle label
  collision avoidance for dense areas (Bajío cluster, border crossings)
- [x] T019 [US1] Implement bilingual legend in `src/map/legend.ts`:
  show all 9 corridors with color swatch, Spanish name, and English name;
  show station tier legend (mega/major/standard); include line style
  legend (solid=active, dashed=planned)
- [x] T020 [US1] Add data-vintage annotation to `src/map/legend.ts`:
  display "Data: BTS 2025, ARTF 2024, Laredo EDC 2024" and headline
  statistics ($872.8B total trade, 73.6% truck, etc.) in a footer area
- [x] T021 [US1] Add map title and framing to `src/map/renderer.ts`:
  bilingual title "Mapa Metropolitano de Comercio de México / Mexico
  Trade Metro Map", border/frame for poster presentation
- [x] T022 [US1] Implement SVG export in `src/export/pdf.ts`: serialize
  the rendered SVG DOM to a standalone `.svg` file with embedded styles
  and fonts, write to `dist/map.svg` during build
- [x] T023 [US1] Implement PDF export in `src/export/pdf.ts`: use
  Playwright to render the map page and export to `dist/map-a2.pdf` at
  A2 dimensions (420mm x 594mm) with embedded fonts
- [x] T024 [US1] Wire up build pipeline in `vite.config.ts`: ensure
  `npm run build` produces `dist/index.html` (interactive), `dist/map.svg`
  (static), and `dist/map-a2.pdf` (print)
- [x] T025 [US1] Visual review and layout iteration (validates FR-003
  schematic readability): verify all 9 corridors are legible, schematic
  layout prioritizes readability over geographic accuracy, no label
  overlaps, station sizes reflect tiers, CDMX hub connects to all
  relevant corridors, border crossings show combined names. Adjust
  coordinates in station data as needed

**Checkpoint**: Static SVG map is complete and visually verified. PDF
exports at A2 size. This is the MVP — can be shared and published.

---

## Phase 4: User Story 2 — Interactive Web Map (Priority: P2)

**Goal**: Browser-based interactive version with hover/tap tooltips
showing sourced trade statistics for stations and corridors. Responsive
from 375px to 2560px.

**Independent Test**: Hover over Laredo station → tooltip shows "$339B
trade value, 5.8M truck crossings/yr" with BTS source citation.

### Implementation for User Story 2

- [x] T026 [US2] Create app entry point `src/interactive/app.ts`: import
  processed data JSON, initialize D3 renderer from `src/map/renderer.ts`,
  mount to `#map` div, handle window resize events
- [x] T027 [US2] Implement station tooltips in `src/interactive/tooltips.ts`:
  on hover (desktop) or tap (mobile), show tooltip with station name,
  trade value (USD), truck crossings or TEU, primary commodities, and
  source citation with data year
- [x] T028 [US2] Implement corridor tooltips in
  `src/interactive/tooltips.ts`: on line hover/tap, show corridor name,
  primary commodities, total trade value, and evidence statement with
  source citation
- [x] T029 [US2] Implement responsive layout in
  `src/interactive/responsive.ts`: scale SVG viewBox to fit viewport
  width (375px–2560px), adjust label sizes and tooltip positioning for
  mobile (<768px), ensure touch targets are at least 44px for mobile taps
- [x] T030 [US2] Add data attribution footer to `public/index.html` and
  `src/interactive/app.ts`: list all data sources with names, authorities,
  data years, and links; display below the map
- [x] T031 [US2] Style tooltips and page chrome: apply design system
  typography and colors to tooltips, footer, and page background; ensure
  tooltips don't overflow viewport on mobile

**Checkpoint**: Interactive map works in Chrome, Firefox, Safari on
desktop and mobile. Tooltips show sourced data. Page is responsive.

---

## Phase 5: User Story 3 — Underlying Data Access (Priority: P3)

**Goal**: Publish curated dataset alongside the map with full provenance
documentation so researchers can verify and reuse the data.

**Independent Test**: Pick any station's trade value from the map, trace
it through the data dictionary to the original BTS/ARTF source record.

### Implementation for User Story 3

- [x] T032 [P] [US3] Finalize `data/processed/data-dictionary.md` with
  complete field descriptions, units, source references, and example
  values for every field in stations.json, corridors.json, sources.json,
  and headlines.json
- [x] T033 [P] [US3] Add a "Data" page or section to the web app in
  `src/interactive/app.ts`: link to download processed JSON files and
  data dictionary; display provenance summary table
- [x] T034 [US3] Verify reproducibility: delete `data/processed/*.json`,
  run `npm run data:transform`, run `npm run data:validate`, confirm
  output matches previous version exactly (byte-for-byte or semantic
  equivalence)

**Checkpoint**: Data files are accessible, documented, and reproducible.
Any figure on the map can be traced to its source.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass across all user stories

- [x] T035 [P] Select and apply a license (constitution requires license
  before public release): add `LICENSE` file at repository root
- [x] T036 [P] Add version number to published map artifacts: embed
  version in SVG metadata, PDF properties, and web page footer
- [x] T037 [P] Create a glossary of technical terms used on the map
  (intermodal, TEU, maquiladora, breakbulk) in the web page footer or
  a linked page
- [x] T038 Perform fact-check gate: verify all 5 headline statistics and
  all station-level trade figures against their cited primary sources
- [x] T039 Cross-browser and viewport testing: verify interactive map
  in Chrome, Firefox, Safari, Edge on desktop; Chrome and Safari on
  mobile. Test responsive layout at key breakpoints (375px, 768px,
  1440px, 2560px) per FR-008
- [x] T040 Performance validation: confirm < 3s initial load on standard
  broadband, < 200ms tooltip response, measure with Lighthouse

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001-T005)
- **User Story 1 (Phase 3)**: Depends on Foundational (T006-T013)
- **User Story 2 (Phase 4)**: Depends on User Story 1 (reuses renderer)
- **User Story 3 (Phase 5)**: Depends on Foundational (data pipeline);
  can run in parallel with US2
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Requires processed data from Phase 2. No dependency on
  other stories. This is the MVP.
- **US2 (P2)**: Requires the SVG renderer from US1 (T016-T018). Builds
  interactivity on top of the static map.
- **US3 (P3)**: Requires only the data pipeline from Phase 2. Can run
  in parallel with US2 after US1 is complete.

### Within User Story 1

- T014 (styles) before T016 (renderer) — renderer uses style tokens
- T015 (coordinates) before T016 (renderer) — renderer needs positions
- T016 (lines) before T017 (stations) — stations render on top of lines
- T017 (stations) before T018 (labels) — labels position relative to dots
- T019 (legend) + T020 (annotations) can run in parallel after T018
- T021 (title) after T018
- T022 (SVG export) + T023 (PDF export) after T021
- T024 (build wiring) after T022 + T023
- T025 (visual review) is the final gate

### Parallel Opportunities

```text
# Phase 1 — all [P] tasks in parallel:
T002, T003, T004, T005 (after T001)

# Phase 2 — after T006-T008:
T009 (headlines), T012 (data dictionary) in parallel

# Phase 3 (US1) — after T018:
T019 (legend) and T020 (annotations) in parallel

# Phase 5 (US3) — independent of US2:
T032, T033 in parallel
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Data Pipeline (T006-T013)
3. Complete Phase 3: Static Map (T014-T025)
4. **STOP and VALIDATE**: Print the SVG, verify legibility and accuracy
5. Share/publish the static map

### Incremental Delivery

1. Setup + Data Pipeline → Foundation ready
2. Static Map (US1) → MVP: sharable SVG/PDF map
3. Interactive Web (US2) → Deploy to GitHub Pages
4. Data Access (US3) → Publish curated dataset
5. Polish → Fact-check, license, cross-browser testing

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Each user story is independently completable and testable
- Commit after each task or logical group
- The schematic layout (T015) is the most iterative task — expect
  multiple coordinate adjustments during T025 visual review
- Data pipeline (Phase 2) is the foundation everything depends on;
  get it right first
