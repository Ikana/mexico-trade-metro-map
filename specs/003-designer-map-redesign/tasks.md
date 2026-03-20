# Tasks: Multi-Designer Map Redesign

**Input**: Design documents from `/specs/003-designer-map-redesign/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the spec. Visual validation via preview channel is the primary testing approach.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization — Inter font and design token foundation

- [x] T001 Add Inter font import via Google Fonts `<link>` tag in `index.html`, update body font-family to include Inter
- [x] T002 Add `DesignTokens` and `LabelPlacement` TypeScript interfaces to `src/types/index.ts`
- [x] T003 Refactor `src/map/styles.ts` to structured `DesignTokens` object: define `colors` (corridors, maritime, background, station, label), `typography` (Inter font stack, size scale, weight scale), `spacing` (grid unit, padding, radii, thickness), `patterns` (solid, dashed, dot-dash) categories. Export backward-compatible aliases (`CORRIDOR_COLORS`, `MARITIME_COLORS`, `STATION_RADIUS`, `LINE_THICKNESS`, `FONT_FAMILY`, etc.) mapping to token values
- [x] T004 Define WCAG AA + CVD-safe 9-corridor color palette in `src/map/styles.ts` `DesignTokens.colors.corridors` — derive from Wyman Mexico 68 warm/saturated tones, validate each color ≥ 4.5:1 contrast against `#FAF8F5` background, ensure minimum delta-E of 20 between any pair under simulated deuteranopia/protanopia
- [x] T005 Define 4 maritime route colors in `src/map/styles.ts` `DesignTokens.colors.maritime` — visually distinct from corridor palette, dot-dash rendering context
- [x] T006 Define SVG path data for 4 pictogram station symbols in `src/map/styles.ts` `DesignTokens.symbols`: city (filled circle), port (anchor-derived geometric shape), border-crossing (diamond/chevron), terminal-region (rounded rectangle with arrow). Each on 24×24 unit grid. Add `getStationSymbol(type, tier)` function returning `{ path: string; scale: number }` with tier multipliers (mega: 1.0, major: 0.7, standard: 0.5)

**Checkpoint**: Dev server renders existing map with Inter font and new color palette — layout unchanged, only visual tokens differ

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Octolinear grid layout — MUST complete before any rendering changes

**⚠️ CRITICAL**: No user story rendering work can begin until octolinear coordinates are finalized

- [x] T007 Analyze all current station coordinates in `data/processed/stations.json` and identify every corridor segment that violates the octolinear constraint (dx≠0 AND dy≠0 AND |dx|≠|dy|). Document violations per corridor
- [x] T008 Design new octolinear station layout: recalculate x,y coordinates for all 31 stations in `data/processed/stations.json` enforcing strict 0°/45°/90° angles between consecutive stations on every corridor. Anchor interchange hubs (CDMX, Monterrey, Guadalajara) first, even-space Bajío cluster (León, Celaya, Irapuato, Aguascalientes, Querétaro), place border crossings along top, terminal regions at periphery. Reference images: `references/Harry Beck/mexico_trade_metro_map_dashboard.png` and `references/Harry Beck/mexico_trade_metro_explorer.png`
- [x] T009 Validate octolinear layout: for every corridor in `data/processed/corridors.json` and maritime route in `data/processed/maritime.json`, verify each consecutive station pair satisfies dx=0 OR dy=0 OR |dx|=|dy|. Fix any violations
- [x] T010 Start dev server (`npm run dev`), open preview at localhost:5173, visually verify the new coordinates render a clean Beck-style schematic with no organic curves, even spacing in Bajío region, and clear corridor paths. Iterate coordinates if needed

**Checkpoint**: All 31 stations positioned on octolinear grid, all corridor segments at 0°/45°/90° angles, verified via preview

---

## Phase 3: User Story 1 — View Redesigned Schematic Map (Priority: P1) 🎯 MVP

**Goal**: Clean octolinear map with bold corridor colors, even station spacing, and interchange markers

**Independent Test**: Load application, visually confirm all corridors render at 0°/45°/90° angles, stations evenly spaced, layout legible without zoom

### Implementation for User Story 1

- [x] T011 [US1] Update corridor rendering in `src/map/renderer.ts`: replace `CORRIDOR_COLORS[corridor.id]` lookup with `TOKENS.colors.corridors[corridor.id]`, apply new WCAG AA palette. Confirm D3 line generator produces straight segments between octolinear-aligned stations (no curve interpolation)
- [x] T012 [US1] Update map background color in `src/map/renderer.ts` from `#FAFAFA` to `TOKENS.colors.background` (`#FAF8F5` warm cream)
- [x] T013 [US1] Update interchange station rendering in `src/map/renderer.ts`: increase interchange ring radius for mega-tier hubs, make interchange markers visually prominent (larger ring, thicker stroke) to distinguish CDMX, Monterrey, Guadalajara as network junctions
- [x] T014 [US1] Update title and subtitle in `src/map/renderer.ts`: use Inter font from `TOKENS.typography.fontFamily`, title at `TOKENS.typography.sizes.title` (24px bold), subtitle at `TOKENS.typography.sizes.subtitle` (14px regular)
- [x] T015 [US1] Preview at 1280×800: verify all 9 corridors distinguishable by color within 2 seconds, interchange stations visually distinct, Bajío region has 30%+ more whitespace than current layout. Screenshot and compare against reference images

**Checkpoint**: User Story 1 complete — clean octolinear map with new palette, interchange markers, even spacing. Independently testable.

---

## Phase 4: User Story 2 — Identify Station Types Through Visual Hierarchy (Priority: P1)

**Goal**: Distinct pictogram symbols per station type, tier-based sizing, terminal region indicators

**Independent Test**: Ask users to identify station types without legend — 85%+ accuracy target

### Implementation for User Story 2

- [x] T016 [US2] Replace generic station circle/rect drawing in `src/map/renderer.ts` with pictogram rendering: use `getStationSymbol(station.type, station.tier)` from `src/map/styles.ts` to get SVG path + scale. Render `<path>` elements instead of `<circle>` for city, port, and border-crossing types. Keep `<rect>` with arrow for terminal-region but style with token values
- [x] T017 [US2] Implement tier-based size scaling in `src/map/renderer.ts`: mega stations render at full pictogram size (1.0×), major at 0.7×, standard at 0.5×. Apply `transform: scale()` centered on station coordinates
- [x] T018 [US2] Update interchange ring in `src/map/renderer.ts` to wrap around pictogram bounding box (not just circle radius). Adjust ring radius based on pictogram dimensions per tier
- [x] T019 [US2] Style terminal regions (Asia, Europe, US East Coast) in `src/map/renderer.ts` as off-map destination indicators: rounded rectangle with directional arrow, positioned at map periphery, visually distinct from inline stations
- [x] T020 [US2] Preview all 4 station types at all 3 tiers: verify border-crossing ≠ city ≠ port ≠ terminal-region at every size. Mega > major > standard visually obvious

**Checkpoint**: User Story 2 complete — all station types visually distinct through pictograms + tier sizing. Independently testable.

---

## Phase 5: User Story 3 — Read Typography and Labels Clearly (Priority: P1)

**Goal**: Zero-overlap label placement with clear 3-level typography hierarchy, octolinear-aligned labels

**Independent Test**: Render at 1280×800, verify no overlaps, all text legible, 3+ hierarchy levels apparent

### Implementation for User Story 3

- [x] T021 [US3] Create label placement engine in `src/map/labels.ts`: implement `computeLabelPlacements(stations: Station[], tokens: DesignTokens): LabelPlacement[]`. 8 candidate positions per station (N, NE, E, SE, S, SW, W, NW), priority order E→W→NE→SE→NW→SW→N→S. Process stations tier-descending (mega first). Collision detection via bounding box intersection. Support 0° and -45° rotation for octolinear alignment
- [x] T022 [US3] Implement bounding box estimation in `src/map/labels.ts`: approximate text width from character count × average char width per font size tier. Height from `TOKENS.typography.sizes[tier]`. Account for rotation when computing collision boxes for -45° labels
- [x] T023 [US3] Implement abbreviation fallback in `src/map/labels.ts`: if no position available for a label after trying all 8 candidates, truncate to first word + "..." and retry. Log abbreviated labels for manual review
- [x] T024 [US3] Replace inline label positioning logic in `src/map/renderer.ts` with call to `computeLabelPlacements()`. Render labels using returned x, y, rotation, anchor values. Apply typography hierarchy: mega → `TOKENS.typography.weights.bold` + `TOKENS.typography.sizes.mega` (13px), major → `TOKENS.typography.weights.semibold` + `TOKENS.typography.sizes.major` (11px), standard → `TOKENS.typography.weights.regular` + `TOKENS.typography.sizes.standard` (10px). All labels display `station.nameEs` (Spanish primary)
- [x] T025 [US3] Preview at 1280×800: verify zero label overlaps (FR-006, SC-003), all labels aligned horizontally or at 45°, 3 hierarchy levels visually distinct (title, corridor/hub, standard). Test at 1024×768 to identify edge-case overlaps

**Checkpoint**: User Story 3 complete — collision-free Spanish labels with clear typography hierarchy. Independently testable.

---

## Phase 6: User Story 4 — Navigate Maritime Routes Distinctly (Priority: P2)

**Goal**: Maritime routes visually separated from land corridors via dot-dash pattern + distinct colors

**Independent Test**: Verify maritime routes render with distinct line style, distinguishable from land corridors within 1 second

### Implementation for User Story 4

- [x] T026 [US4] Update maritime route rendering in `src/map/renderer.ts`: apply `TOKENS.colors.maritime[route.id]` colors and `TOKENS.patterns.dotDash` ("2 4 8 4") pattern. Ensure visual distinction from solid land corridors and dashed planned corridors
- [x] T027 [US4] Update planned corridor (Corredor Verde) rendering in `src/map/renderer.ts`: apply `TOKENS.patterns.dashed` ("8 4") pattern, distinct from both solid active corridors and dot-dash maritime. Use `TOKENS.colors.corridors["corredor-verde"]` color
- [x] T028 [US4] Render terminal region connections in `src/map/renderer.ts`: maritime routes extending to terminal regions (Asia, Europe, US East Coast) should visually connect to map edge or off-map indicators with clean dot-dash terminus
- [x] T029 [US4] Preview: verify 3 distinct line styles (solid active, dashed planned, dot-dash maritime) clearly distinguishable side-by-side. Ocean routes immediately separable from land corridors

**Checkpoint**: User Story 4 complete — maritime routes visually distinct. Independently testable.

---

## Phase 7: User Story 5 — Interact with Stations and Corridors (Priority: P2)

**Goal**: Tooltips show English names, match new design language, all existing data fields preserved

**Independent Test**: Hover over each station type and corridor, verify tooltips appear with correct data and consistent styling

### Implementation for User Story 5

- [x] T030 [US5] Update station tooltip header in `src/interactive/tooltips.ts`: display `station.nameEn` (English) as primary tooltip heading, show `station.nameEs` (Spanish) as smaller subheading if different from English name. Apply `TOKENS.typography.fontFamily` (Inter) to tooltip container
- [x] T031 [US5] Update corridor tooltip in `src/interactive/tooltips.ts`: apply new palette colors from `TOKENS.colors.corridors[corridor.id]` for the colored square indicator. Use Inter font
- [x] T032 [US5] Update maritime tooltip in `src/interactive/tooltips.ts`: apply `TOKENS.colors.maritime[route.id]` for dot-dash color sample indicator. Use Inter font
- [x] T033 [US5] Style tooltip container in `src/interactive/tooltips.ts`: update background, border, and shadow to match redesigned map aesthetic. Ensure tooltip typography matches map's Inter font stack and color discipline
- [x] T034 [US5] Verify all existing tooltip data fields render correctly: trade value, commodities, truck crossings, container volume, destination ports (terminal regions), source attribution, carrier info (maritime). Test hover on every station type and corridor

**Checkpoint**: User Story 5 complete — styled tooltips with English names and preserved data. Independently testable.

---

## Phase 8: User Story 6 — View Map with Cultural Color Identity (Priority: P3)

**Goal**: Color palette evokes Mexican visual identity, passes WCAG AA + CVD validation

**Independent Test**: Compare palette against WCAG contrast requirements, verify cultural color references, test under CVD simulation

### Implementation for User Story 6

- [x] T035 [US6] Validate corridor color palette in `src/map/styles.ts` against WCAG AA: compute contrast ratio for each of 9 corridor colors against `#FAF8F5` background, verify all ≥ 4.5:1. Adjust any failing colors while preserving warm/saturated Mexican visual identity
- [x] T036 [US6] Validate CVD safety: simulate deuteranopia and protanopia on all 9 corridor colors + 4 maritime colors. Verify no two corridors become confusable. Adjust problematic pairs by shifting hue or lightness
- [x] T037 [US6] Preview full map and evaluate cultural color identity: palette should read as warm, saturated, distinctly Mexican (Wyman Mexico 68 influence) rather than generic corporate or transit pastels. Compare against reference images for overall visual warmth

**Checkpoint**: User Story 6 complete — culturally resonant, accessible color palette. Independently testable.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Legend update, cross-browser validation, export verification, final visual QA

- [x] T038 Update legend in `src/map/legend.ts`: add pictogram symbol samples for all 4 station types (city, port, border-crossing, terminal-region). Add tier size examples (mega, major, standard). Show 3 line styles (solid active, dashed planned, dot-dash maritime) with Spanish labels. Use Inter font and new color palette from tokens. Preserve data-date annotation (constitution requirement)
- [x] T039 Update legend layout in `src/map/legend.ts`: three-column bottom layout — corridors (left), station types + tiers (center), line styles + data vintage (right). Ensure legend fits within `MAP_PADDING.bottom` space
- [x] T040 Edge case: verify viewport < 768px behavior — labels should abbreviate or reflow to avoid overlap. Test in preview at 768×1024 tablet viewport
- [x] T041 Edge case: verify corridors with only 2 stations render as complete styled line segments with proper terminus markers
- [x] T042 Edge case: verify stations with 4+ corridors (e.g., CDMX) — interchange marker accommodates all connecting lines without clutter
- [x] T043 Cross-browser verification: test map rendering in Chrome, Firefox, Safari, and Edge (latest 2 versions). Verify SVG pictograms, Inter font, dot-dash patterns render consistently
- [x] T044 Verify SVG export (`npm run export:svg`) produces correct output with new pictograms, colors, and Inter font embedded
- [x] T045 Verify PDF export (`npm run export:pdf`) produces correct output with new visual design
- [x] T046 Performance check: verify full map loads and renders < 2 seconds on standard hardware (SC-009). Profile if needed
- [x] T047 Final visual QA via preview channel: load at 1280×800, confirm zero overlaps, all corridors distinguishable, pictograms recognizable, typography hierarchy clear. Compare side-by-side against reference images. Screenshot final result

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion (needs tokens + font). **BLOCKS all user stories**
- **User Stories (Phases 3–8)**: All depend on Phase 2 (octolinear grid)
  - US1 (Phase 3): Can start immediately after Phase 2
  - US2 (Phase 4): Can start after Phase 2 — benefits from US1 corridor rendering but independent
  - US3 (Phase 5): Can start after Phase 2 — independent (new labels.ts file)
  - US4 (Phase 6): Can start after Phase 2 — independent
  - US5 (Phase 7): Can start after Phase 2 — benefits from US1/US6 colors
  - US6 (Phase 8): Can start after Phase 1 (palette validation only) — independent
- **Polish (Phase 9)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependencies on other stories
- **US2 (P1)**: After Phase 2 — no dependencies on other stories (modifies renderer.ts but different section than US1)
- **US3 (P1)**: After Phase 2 — no dependencies (creates new labels.ts, then updates renderer.ts label section)
- **US4 (P2)**: After Phase 2 — no dependencies (modifies renderer.ts maritime section)
- **US5 (P2)**: After Phase 2 — independent (modifies tooltips.ts only)
- **US6 (P3)**: After Phase 1 — independent (validates colors in styles.ts)

**Recommended execution order**: Phase 1 → Phase 2 → US1 → US3 → US2 → US4 → (US5 ∥ US6) → Polish

### Within Each User Story

- Rendering changes before preview validation
- Preview validation as final task per story

### Parallel Opportunities

**Phase 1** (all in `src/map/styles.ts` and `index.html` — sequential due to same file):
- T001 (index.html) can run parallel with T002 (types/index.ts)
- T004, T005, T006 all modify styles.ts — sequential

**Phase 3–8** (user stories can partially overlap):
- US5 (tooltips.ts) can run fully parallel with US1/US2/US3/US4 (renderer.ts, labels.ts, styles.ts)
- US6 (color validation) can run parallel with US3 (label engine) and US4 (maritime)
- US1 + US3 both touch renderer.ts but different sections — serial recommended
- US2 + US4 both touch renderer.ts but different sections — serial recommended

---

## Parallel Example: Phases 6–8

```bash
# These three user stories can be worked in parallel:
# Agent A: US4 — Maritime routes in renderer.ts (maritime section)
# Agent B: US5 — Tooltip styling in tooltips.ts (completely separate file)
# Agent C: US6 — Color validation in styles.ts (read-only + minor adjustments)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (tokens + font) — ~6 tasks
2. Complete Phase 2: Foundational (octolinear grid) — ~4 tasks
3. Complete Phase 3: User Story 1 (schematic map) — ~5 tasks
4. **STOP and VALIDATE**: Preview Beck-style map with new colors, even spacing, interchange markers
5. This alone delivers the core value: reduced clutter + improved clarity

### Incremental Delivery

1. Setup + Foundational → Octolinear grid ready
2. Add US1 → Clean schematic map (MVP!)
3. Add US3 → Zero-overlap labels with typography hierarchy
4. Add US2 → Pictogram station symbols
5. Add US4 → Maritime route distinction
6. Add US5 + US6 → Tooltips + color validation
7. Polish → Legend, edge cases, cross-browser, exports

### Single Developer Strategy

Recommended sequential path: T001–T010 (setup + grid) → T011–T015 (US1) → T021–T025 (US3) → T016–T020 (US2) → T026–T029 (US4) → T030–T037 (US5+US6) → T038–T047 (polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Preview channel is the primary validation tool — use after each story checkpoint
- No automated test tasks included (not requested) — validation is visual via preview
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
