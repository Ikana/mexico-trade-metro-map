# Tasks: Sea Routes & Corridor Interconnections

**Input**: Design documents from `/specs/002-sea-routes-interconnect/`
**Prerequisites**: plan.md (required), spec.md (required), research.md,
data-model.md, contracts/

**Tests**: Not explicitly requested. Test tasks omitted.

**Organization**: Tasks grouped by user story for independent
implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2, US3)
- Exact file paths included in descriptions

---

## Phase 1: Setup

**Purpose**: Extend type definitions and styles for new features

- [x] T001 Add `MaritimeRoute` and `TerminalRegion` types to
  `src/types/index.ts`: MaritimeRoute extends Corridor with `ocean`,
  `carriers`, `transitTimeDays` fields; add `"terminal-region"` to
  Station type enum and `"INTL"` to country enum; add optional
  `destinationPorts: string[]` field to Station
- [x] T002 [P] Add maritime styles to `src/map/styles.ts`: dot-dash
  pattern constant (`DOT_DASH_PATTERN = "2 4 8 4"`), 4 maritime route
  colors (cyan `#00BCD4` for Pacific-Asia, teal `#009688` for
  Transpacific, navy `#1A237E` for Gulf-Europe, steel blue `#546E7A`
  for Gulf-US), terminal region station styling
- [x] T003 [P] Add 8 new data sources to `data/raw/sources.json`:
  CMA CGM/FreightWaves, Cosco/Lading Cargo, Pro Mexico Industry,
  Pacific Ports, Unisco Altamira, FreightAmigo Gulf, Hutchison/
  FreightAmigo Ensenada, iContainers Mexico

**Checkpoint**: Types compile, styles defined, sources registered.

---

## Phase 2: Foundational (Data Changes)

**Purpose**: Update raw data files that all user stories depend on.
MUST complete before rendering changes.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Modify corridor stationIds in `data/raw/corridors-raw.json`
  to create interconnections: extend Línea Roja south adding
  `"queretaro"`, `"cdmx"`; extend Línea Verde adding `"cdmx"`,
  `"lazaro-cardenas"`; add `"guadalajara"` to Línea Azul; extend
  Línea Amarilla adding `"monterrey"`, `"altamira"`; add `"ensenada"`
  to Línea Naranja
- [x] T005 Add 6 new stations to `data/raw/stations-raw.json`:
  Lázaro Cárdenas (major hub, port, ~2.2M TEU), Altamira (standard,
  port, ~880K TEU), Ensenada (standard, port, ~300K TEU), plus 3
  terminal regions: `terminal-asia` ("→ Asia", destinationPorts:
  Shanghai/Busan/Yokohama), `terminal-europe` ("→ Europa / Europe",
  destinationPorts: Rotterdam/Hamburg), `terminal-us-east`
  ("→ Costa Este EEUU / US East Coast", destinationPorts:
  Houston/New Orleans)
- [x] T006 Update existing station `corridorIds` in
  `data/raw/stations-raw.json` to reflect corridor extensions: add
  `"linea-roja"` to Querétaro and CDMX corridorIds; add
  `"linea-verde"` to CDMX corridorIds; add `"linea-azul"` to
  Guadalajara corridorIds; add `"linea-amarilla"` to Monterrey
  corridorIds
- [x] T007 Reassign schematic x/y coordinates in
  `data/raw/stations-raw.json` for all stations: expand grid to
  accommodate terminal regions at edges (Pacific terminals at x=-2,
  Gulf/Atlantic terminals at x=14), reposition existing stations as
  needed to maintain octolinear alignment with extended corridors
- [x] T008 Create `data/raw/maritime-raw.json` with 4 maritime route
  definitions: Pacific-Asia Express (Ensenada → Manzanillo →
  Lázaro Cárdenas → terminal-asia), Transpacific Gateway
  (Lázaro Cárdenas → Manzanillo → terminal-asia), Gulf-Europe
  (Veracruz → Altamira → terminal-europe), Gulf-US East Coast
  (Veracruz → Altamira → Coatzacoalcos → terminal-us-east). Include
  carriers, transit times, commodities, evidence, sourceIds
- [x] T009 Update `data/scripts/transform.ts` to read
  `maritime-raw.json` and write `data/processed/maritime.json`
  alongside existing outputs
- [x] T010 Update `data/scripts/validate.ts` to add rules 7-11 from
  contracts: maritime stationIds referential integrity, maritime
  sourceIds integrity, terminal-region requires INTL + destinationPorts,
  terminal-regions must appear in maritime routes, no isolated land
  corridors (FR-006)
- [x] T011 Run `npm run data:transform` and `npm run data:validate`
  to verify all data files pass including new rules 7-11

**Checkpoint**: All data files valid. Corridors interconnected.
Maritime routes defined. No isolated corridors (Rule 11 passes).

---

## Phase 3: User Story 1 — Interconnected Corridor Network (P1) MVP

**Goal**: All land corridors share hub stations. CDMX is the central
hub. A user can trace a route between any two stations.

**Independent Test**: Pick Tijuana and Manzanillo — trace a path:
Tijuana → (Línea Naranja) → ... → Guadalajara → (Línea Verde) →
Manzanillo. If the path exists, the network is connected.

### Implementation for User Story 1

- [x] T012 [US1] Update `src/map/renderer.ts` to render interchange
  symbols: for stations with 3+ corridors, draw a larger interchange
  ring (r + 4 instead of r + 3) with thicker stroke; ensure corridor
  lines properly overlap at shared stations
- [x] T013 [US1] Update `src/map/renderer.ts` label placement logic
  to handle hub stations where multiple corridors converge: CDMX
  labels must not overlap with 3+ converging lines; adjust label
  offsets for Monterrey, Guadalajara, Querétaro as new interchanges
- [x] T014 [US1] Update `src/export/svg.ts` to render the updated
  corridor data with extended stationIds and new station positions
- [x] T015 [US1] Visual review of interconnected network: verify CDMX
  shows as 3+ corridor hub, Monterrey connects Roja and Amarilla,
  Guadalajara connects Verde and Azul, no corridors are visually
  isolated. Adjust station coordinates as needed

**Checkpoint**: All land corridors interconnected. CDMX is the clear
central hub. This is the MVP for this feature.

---

## Phase 4: User Story 2 — Pacific Maritime Routes (P2)

**Goal**: 2 Pacific maritime routes visible on the map with dot-dash
styling, connecting Mexican Pacific ports to "→ Asia" terminal.

**Independent Test**: View the map, identify 2 dot-dash lines on the
Pacific (left) side connecting Manzanillo/Lázaro Cárdenas/Ensenada
to "→ Asia". Hover to see CMA CGM, MSC, Cosco carrier info.

### Implementation for User Story 2

- [x] T016 [US2] Update `src/map/renderer.ts` to render maritime
  routes: load `maritime.json`, draw lines with dot-dash pattern
  from styles, use maritime route colors, render terminal region
  stations with directional arrow label style (e.g., "→ Asia")
- [x] T017 [US2] Update `src/interactive/tooltips.ts` to handle
  maritime route tooltips: show carriers (array), transit time range,
  primary commodities, and source citations. For terminal region
  station tooltips, show `destinationPorts` list
- [x] T018 [US2] Update `src/interactive/app.ts` to import
  `data/processed/maritime.json` and pass to renderer and tooltip
  binder
- [x] T019 [US2] Update `src/map/legend.ts` to add "Rutas Marítimas /
  Maritime Routes" section: show dot-dash line swatches with Pacific
  route colors and names (bilingual)
- [x] T020 [US2] Update `src/export/svg.ts` to render Pacific maritime
  routes in the static SVG export with dot-dash styling

**Checkpoint**: 2 Pacific maritime routes visible with distinct dot-dash
styling. Tooltips show carrier and transit time data.

---

## Phase 5: User Story 3 — Gulf/Atlantic Maritime Routes (P3)

**Goal**: 2 Gulf/Atlantic maritime routes visible, connecting Veracruz,
Altamira, Coatzacoalcos to "→ Europe" and "→ US East Coast" terminals.

**Independent Test**: View the map, identify 2 dot-dash lines on the
Gulf (right) side. Hover over Veracruz to confirm it shows as a
multi-modal interchange (land + maritime).

### Implementation for User Story 3

- [x] T021 [US3] Verify Gulf/Atlantic maritime routes render correctly
  (they share the same rendering pipeline from US2 — this task confirms
  the Gulf routes + terminal regions display properly)
- [x] T022 [US3] Update `src/map/legend.ts` to include Gulf/Atlantic
  maritime routes in the legend section (navy and steel blue colors)
- [x] T023 [US3] Verify Veracruz and Coatzacoalcos show as multi-modal
  interchange stations (both land corridor and maritime route pass
  through them)
- [x] T024 [US3] Update `src/export/svg.ts` to include Gulf/Atlantic
  maritime routes in static export

**Checkpoint**: All 4 maritime routes visible. Gulf ports show as
multi-modal interchanges. Full map is complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass

- [x] T025 [P] Update `data/processed/data-dictionary.md` to document
  new fields: `destinationPorts`, `carriers`, `transitTimeDays`,
  `ocean`, `"terminal-region"` type, `"INTL"` country, maritime.json
  schema
- [x] T026 [P] Update headline statistics or add maritime-specific
  annotations to `src/map/legend.ts` data-vintage footer: add
  maritime source attributions
- [x] T027 Perform fact-check gate: verify all new maritime route data
  (carriers, transit times, TEU volumes) against cited sources
- [x] T028 Visual review of complete map: verify all 9 land corridors
  + 4 maritime routes render without overlaps, labels are legible,
  interchange symbols are clear, maritime routes are visually distinct
  from land corridors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001-T003)
- **User Story 1 (Phase 3)**: Depends on Foundational (T004-T011)
- **User Story 2 (Phase 4)**: Depends on US1 (renderer changes) +
  Foundational (maritime data)
- **User Story 3 (Phase 5)**: Depends on US2 (maritime rendering
  pipeline). Shares renderer — mostly verification tasks.
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Requires data changes from Phase 2. No dependency on
  other stories. This is the MVP.
- **US2 (P2)**: Requires renderer from US1 + maritime data from Phase 2.
- **US3 (P3)**: Requires maritime rendering pipeline from US2. Mostly
  verification — Gulf routes use the same code path as Pacific routes.

### Parallel Opportunities

```text
# Phase 1 — all [P] tasks in parallel:
T002, T003 (after T001)

# Phase 6 — parallel polish:
T025, T026 in parallel
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Data Changes (T004-T011)
3. Complete Phase 3: Interconnections (T012-T015)
4. **STOP and VALIDATE**: Verify all corridors are connected

### Incremental Delivery

1. Setup + Data → Foundation ready
2. Interconnections (US1) → MVP: connected metro network
3. Pacific Maritime (US2) → Asia shipping routes visible
4. Gulf Maritime (US3) → Complete maritime picture
5. Polish → Fact-check, documentation, visual review

---

## Notes

- Most effort is in Phase 2 (data changes) — the rendering changes
  are relatively small since the V1 pipeline handles the heavy lifting
- US3 is lightweight because the maritime rendering pipeline from US2
  handles both Pacific and Gulf routes — US3 is mostly verification
- The coordinate adjustment task (T007) is the most iterative — expect
  multiple rounds during visual reviews (T015, T028)
- Rule 11 (no isolated corridors) is the key new validation — it
  mechanically verifies the interconnection requirement
