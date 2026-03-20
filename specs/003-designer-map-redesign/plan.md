# Implementation Plan: Multi-Designer Map Redesign

**Branch**: `003-designer-map-redesign` | **Date**: 2026-03-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-designer-map-redesign/spec.md`

## Summary

Redesign the Mexico Trade Metro Explorer's SVG map rendering to synthesize design principles from six iconic transit/wayfinding designers (Beck, Vignelli, Wyman, Calvert & Kinneir, Aicher, Johnston). The implementation refactors the rendering pipeline around a structured design token system, recalculates station coordinates for strict octolinear (0°/45°/90°) geometry, introduces pictogram-style station type symbols, applies a WCAG AA + CVD-safe Mexican-cultural color palette, switches to Inter typography with clear hierarchy, and adds a collision-free label placement engine. Existing interactivity (tooltips with English names, data display) is preserved. The preview channel is used for iterative visual refinement.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: D3.js v7 (SVG rendering), Vite 8.x (build/HMR), Inter font (Google Fonts)
**Storage**: JSON data files (`data/processed/*.json`) — no database
**Testing**: Playwright (visual regression), manual preview channel iteration
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)
**Project Type**: Single-page web application (data visualization)
**Performance Goals**: Full map render < 2 seconds on standard hardware; SVG + PDF export
**Constraints**: 31 stations, 9 corridors, 4 maritime routes — small fixed dataset; all corridor colors WCAG AA (4.5:1) compliant; CVD-safe palette
**Scale/Scope**: Single viewport map visualization, ~6 source files modified

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| **I. Data Provenance** | ✅ PASS | No data changes — existing sourced data preserved. Station x,y coordinate updates are rendering layout, not trade data. |
| **II. Research-Backed Claims** | ✅ PASS | No new statistics or claims introduced. Redesign is purely visual. |
| **III. Publication-Grade Quality** | ✅ PASS | SVG vector output retained. Inter font + design token system enforces consistent styling. Bilingual labeling: Spanish on map (nameEs), English in tooltips (nameEn). Data-date annotation preserved in legend. |
| **IV. Audience Clarity** | ✅ PASS | Schematic layout follows Beck tradition (spec FR-001). Visual weight encodes tier hierarchy (FR-008). Pictograms communicate station type without text (FR-016). |
| **V. Reproducibility** | ✅ PASS | All rendering code committed. Design tokens are code constants. Station coordinate changes committed to stations.json. `npm run dev` regenerates everything. |

**Pre-Phase 0 gate: PASSED** — no violations.

### Post-Phase 1 Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| **III. Publication-Grade Quality** | ✅ PASS | Inter font loaded via Google Fonts CDN with system fallbacks. DesignTokens system ensures no unstyled outputs. Legend updated for new symbols. |
| **IV. Audience Clarity** | ✅ PASS | Label placement engine eliminates overlaps. 4 distinct pictograms self-explanatory per SC-002 (85%+ accuracy target). |

**Post-Phase 1 gate: PASSED** — no violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-designer-map-redesign/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: font, color, pictogram, grid, label research
├── data-model.md        # Phase 1: entity model and data flow
├── quickstart.md        # Phase 1: developer setup guide
├── contracts/
│   └── design-tokens-contract.md  # Design tokens API contract
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── map/
│   ├── styles.ts          # MODIFY: Refactor to DesignTokens system
│   ├── renderer.ts        # MODIFY: Pictograms, octolinear paths, label engine
│   ├── legend.ts          # MODIFY: Updated symbols, line styles, typography
│   └── labels.ts          # NEW: Label placement collision avoidance engine
├── interactive/
│   ├── app.ts             # MODIFY: Load Inter font, minor init updates
│   ├── tooltips.ts        # MODIFY: English names (nameEn) in header, styled typography
│   └── responsive.ts      # MINOR: Adjust for new spacing constants
├── types/
│   └── index.ts           # MINOR: Add DesignTokens, LabelPlacement interfaces
└── export/
    ├── svg.ts             # VERIFY: Works with updated SVG structure
    └── pdf.ts             # VERIFY: Works with updated SVG structure

data/
└── processed/
    └── stations.json      # MODIFY: Update x,y coordinates for octolinear layout

index.html                 # MODIFY: Add Inter font <link> import

references/
└── Harry Beck/            # READ-ONLY: Design reference images + PRD
```

**Structure Decision**: Retain existing single-project structure. Add one new file (`src/map/labels.ts`) for the label placement engine. All other changes are modifications to existing files. No new directories needed.

## Implementation Phases

### Phase A: Design Token Foundation + Font (Priority: P0)

**Goal**: Establish the visual foundation before any rendering changes.

1. **Add Inter font to `index.html`** via Google Fonts `<link>` tag
2. **Refactor `src/map/styles.ts`**:
   - Create `DesignTokens` interface with structured categories (colors, typography, spacing, symbols, patterns)
   - Define new WCAG AA + CVD-safe corridor color palette (9 colors + 4 maritime)
   - Set Inter as primary font with system fallbacks
   - Define typography scale (title 24px bold, corridor 14px semibold, mega 13px bold, major 11px regular, standard 10px regular)
   - Define SVG path data for 4 pictogram symbols (city, port, border-crossing, terminal-region)
   - Export backward-compatible aliases (`CORRIDOR_COLORS`, etc.) for incremental migration
3. **Verify**: Dev server renders existing map with new font and colors without layout breakage

### Phase B: Octolinear Grid Layout (Priority: P0)

**Goal**: Recalculate all station coordinates to enforce Beck-style geometry.

1. **Analyze current station coordinates** and identify all non-octolinear segments
2. **Design new octolinear layout** using reference images as guide:
   - Anchor interchange hubs (CDMX, Monterrey, Guadalajara) first
   - Even-space Bajío cluster (León, Celaya, Irapuato, Aguascalientes, Querétaro)
   - Place border crossings along top edge
   - Place terminal regions at periphery
3. **Update `data/processed/stations.json`** with new x,y values
4. **Validate**: Every segment between consecutive stations on each corridor follows dx=0, dy=0, or |dx|=|dy|
5. **Preview**: Compare rendered map against reference images via preview channel

### Phase C: Pictogram Station Symbols (Priority: P1)

**Goal**: Replace generic circles with type-specific pictogram symbols.

1. **Create `getStationSymbol()` function** in styles.ts that returns SVG path data + scale for (type, tier) combinations
2. **Update `renderer.ts` station drawing**:
   - Replace `circle` elements with `path` elements using pictogram SVG data
   - Scale pictograms by tier (mega: 1.0×, major: 0.7×, standard: 0.5×)
   - Preserve interchange ring for multi-route stations (render around pictogram, not circle)
   - Terminal regions: keep rounded-rect + arrow indicator
3. **Update colors**: Station stroke color from corridor's primary color
4. **Preview**: Verify all 4 station types are visually distinct at all 3 tier sizes

### Phase D: Label Placement Engine (Priority: P1)

**Goal**: Eliminate all label overlaps with octolinear-aligned typography.

1. **Create `src/map/labels.ts`**:
   - `computeLabelPlacements(stations, tokens)` → `LabelPlacement[]`
   - 8 candidate positions per station (N, NE, E, SE, S, SW, W, NW)
   - Priority order: E, W, NE, SE, NW, SW, N, S
   - Collision detection via bounding box intersection
   - Process stations in tier-descending order (mega first)
   - Support 0° and -45° rotation for octolinear alignment
   - Abbreviation fallback for unresolvable collisions
2. **Update `renderer.ts`**:
   - Replace inline label positioning with `computeLabelPlacements()` results
   - Labels display `station.nameEs` (Spanish primary)
   - Font weight: bold for mega, semibold for major, regular for standard
3. **Validate at 1280×800**: Zero overlaps (FR-006, SC-003)

### Phase E: Corridor & Maritime Route Rendering (Priority: P1)

**Goal**: Apply Vignelli color discipline and distinct line styles.

1. **Update corridor rendering** in `renderer.ts`:
   - Apply new palette from DesignTokens
   - Verify octolinear paths render as clean straight segments (no curves from D3 line generator — already linear, but confirm)
   - Planned corridors (Corredor Verde): dashed "8 4" pattern
   - Line weight from tokens
2. **Update maritime route rendering**:
   - Dot-dash "2 4 8 4" pattern (preserved)
   - New maritime palette from tokens
   - Ensure visual distinction from both solid land corridors and dashed planned corridors
3. **Preview**: Side-by-side comparison of 9 corridors — all distinguishable by color + weight

### Phase F: Legend Redesign (Priority: P1)

**Goal**: Updated legend reflecting all new visual elements.

1. **Update `src/map/legend.ts`**:
   - Corridor section: colored line samples with Spanish corridor names
   - Line style section: solid (active), dashed (planned), dot-dash (maritime) with labels
   - Station type section: pictogram samples for city, port, border-crossing, terminal-region
   - Station tier section: mega, major, standard size examples
   - Typography: Inter font, clear hierarchy
   - Data vintage annotation (constitution requirement)
2. **Layout**: Three-column layout at bottom of SVG (preserved)

### Phase G: Tooltip Styling Update (Priority: P2)

**Goal**: Tooltips use English names and match new design language.

1. **Update `src/interactive/tooltips.ts`**:
   - Station tooltip header: `station.nameEn` (English primary in tooltip)
   - Subheader: `station.nameEs` in smaller text if different
   - Apply Inter font family
   - Match tooltip background/border to new color palette
   - Corridor tooltip: corridor name + colored indicator using new palette
   - Maritime tooltip: preserved with updated styling
2. **Verify**: All existing tooltip data fields (trade value, commodities, truck crossings, container volume, sources) still display correctly

### Phase H: Visual Validation & Cross-Browser (Priority: P2)

**Goal**: Final quality pass using preview channel.

1. **Preview channel iteration**:
   - Load map at 1280×800 — verify zero label overlaps
   - Check all 9 corridor colors distinguishable at a glance
   - Verify pictogram symbols recognizable without legend
   - Compare against reference images in `references/Harry Beck/`
   - Test simulated deuteranopia/protanopia (browser dev tools or d3-color)
2. **Cross-browser**: Chrome, Firefox, Safari, Edge
3. **SVG/PDF export**: Verify `npm run export:svg` and `npm run export:pdf` work with updated SVG structure
4. **Performance**: Map renders < 2 seconds (SC-009)

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Font | Inter (Google Fonts) | Geometric + humanist, Johnston/Calvert spirit, free, excellent small-size legibility |
| Color derivation | Wyman Mexico 68 → WCAG AA + CVD validated | Cultural identity + accessibility |
| Pictogram approach | D3 SVG paths (not icon font) | No font loading dependency, consistent rendering, scalable |
| Label algorithm | Priority-based 8-position + collision detect | Deterministic, fast for 31 stations, respects octolinear grid |
| Grid coordinates | Manual octolinear layout | Algorithmic layout is NP-hard for transit maps; manual craft yields better results |
| Token architecture | Structured TypeScript interface | Enables rapid preview iteration, single source of truth |
| Backward compat | Re-export aliases from styles.ts | Incremental migration, no big-bang refactor risk |

## Complexity Tracking

> No constitution violations. No complexity justifications needed.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | — | — |
