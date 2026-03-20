# Research: Multi-Designer Map Redesign

**Feature**: 003-designer-map-redesign
**Date**: 2026-03-20

## R1: Optimal Sans-Serif Font for Transit Map Typography

**Decision**: Use **Inter** (Google Fonts, SIL Open Font License) as primary typeface.

**Rationale**: Inter is a geometric humanist sans-serif designed for screens. Its proportions balance the geometric precision of Edward Johnston's typeface with the humanist warmth of Margaret Calvert's Transport font. It has excellent legibility at small sizes (10px station labels), supports full Latin character set including Spanish diacritics (é, í, ñ, ú), and is freely available via Google Fonts or self-hosted.

**Alternatives considered**:
- **Work Sans**: Slightly too geometric, reduced legibility at small sizes.
- **DM Sans**: Excellent at display sizes but less optimized for 10–13px range.
- **Source Sans Pro**: Good legibility but lacks the geometric character befitting a transit map.
- **Johnston / New Johnston**: Proprietary to TfL, not licensable.
- **Atkinson Hyperlegible**: Excellent accessibility but too informal for the transit map genre.

## R2: Color Palette Strategy — Mexican Visual Identity + WCAG AA + CVD Safe

**Decision**: Derive a 9-color corridor palette from Lance Wyman's Mexico 68 identity chromatic vocabulary, validated against WCAG AA (4.5:1 on #FAF8F5 background) and simulated deuteranopia/protanopia filters. Assign colors to corridors by semantic association where possible (red = spine/primary, blue = industrial/Bajío, green = Pacific, etc.).

**Rationale**: The existing palette (#E63946 red, #457B9D blue, etc.) already draws loosely from warm/saturated tones but lacks systematic CVD validation. Several pairs (green #2A9D8F vs blue #457B9D, and brown #6B4226 vs orange #F4A261) risk confusion under protanopia. The redesign will shift these while preserving cultural resonance.

**Approach**:
1. Start from Wyman-inspired base hues (warm red, terracotta orange, Aztec gold, Pacific teal, indigo, emerald, magenta, earth brown, steel blue)
2. Test all pairs under simulated CVD using d3-color or online tools
3. Adjust lightness/saturation to maintain minimum 4.5:1 contrast against #FAF8F5
4. Ensure minimum delta-E of 20 between any two corridor colors under simulated CVD

**Alternatives considered**:
- Generic transit palette (too corporate, loses Mexican identity)
- Material Design palette (recognizable as Google aesthetic, not original)
- Vignelli's 1972 NYC palette directly (too few warm tones for 9 corridors + maritime)

## R3: Pictogram Design System for Station Types

**Decision**: Create 4 distinct SVG pictogram symbols following Otl Aicher's modular grid approach, rendered as D3-generated SVG paths. Each symbol is built on a consistent base grid (e.g., 24×24 unit grid scaled by tier multiplier).

**Station type symbols**:
- **City** (●): Filled circle — universal metro convention
- **Port** (⚓): Anchor-derived geometric shape — simplified wave + vertical post
- **Border-crossing** (⬡): Diamond/chevron pointing up — evokes customs gate/barrier
- **Terminal-region** (→): Rounded rectangle with arrow — off-map destination indicator

**Rationale**: Aicher's Munich Olympics pictograms succeed because they use a strict grid, consistent stroke weight, and geometric reduction. Each symbol must be recognizable at 10px (standard tier) and beautiful at 24px (mega tier). Using D3-generated SVG paths rather than external icon fonts ensures consistency and eliminates font loading dependencies.

**Alternatives considered**:
- Lance Wyman's Mexico City Metro cultural pictograms (each station unique — too complex for 4 categories)
- Font Awesome / icon library (generic, not transit-authentic)
- Unicode symbols (rendering varies by platform)

## R4: Octolinear Grid Coordinate System for Beck-Style Layout

**Decision**: Retain the existing integer (x, y) grid coordinate system in stations.json but recalculate all 31 station positions to enforce strict 0°/45°/90° angles between consecutive stations on each corridor. Use a constraint-based manual layout approach informed by the Harry Beck reference images.

**Rationale**: The current coordinates (x: -2 to 14, y: 0 to 16) already approximate a schematic layout but contain several organic/arbitrary-angle segments. The Beck redesign requires every segment between consecutive stations to follow dx=0, dy=0, or |dx|=|dy| (yielding exactly 0°, 45°, or 90° angles). This is a manual design task — algorithmic auto-layout for transit maps is an NP-hard problem and typically produces inferior results to human-designed layouts.

**Approach**:
1. Start from current coordinates as baseline
2. Identify all segments that violate octolinear constraint
3. Adjust station positions iteratively, prioritizing:
   - Even spacing in dense Bajío/Central Mexico cluster
   - Interchange stations (CDMX, Monterrey, Guadalajara) as anchor points
   - Terminal regions at map periphery
4. Validate: every corridor path contains only 0°/45°/90° segments

**Alternatives considered**:
- Algorithmic force-directed layout → unpredictable results, hard to constrain
- Geographic-to-schematic interpolation → loses design craft quality
- Complete redesign from scratch ignoring current coordinates → unnecessary rework

## R5: Label Placement Strategy for Zero-Overlap Typography

**Decision**: Implement a priority-based label placement algorithm with 8 candidate positions per station (N, NE, E, SE, S, SW, W, NW) and collision detection. Labels align horizontally or at 45° per the octolinear grid.

**Rationale**: The current label placement uses simple heuristics (right-aligned default, edge-aware adjustments). The redesign's strict octolinear grid and even spacing will help, but 31 stations with varying label lengths still risk overlap, especially in the Bajío cluster. A systematic placement algorithm assigns each label to the first non-colliding position from a priority-ordered candidate list.

**Approach**:
1. Pre-compute bounding boxes for all labels (using font metrics)
2. For each station (sorted by tier descending — mega first), try positions in priority order
3. Priority order: E (default), W, NE, SE, NW, SW, N, S
4. 45° labels: rotate text by -45° and adjust anchor point
5. Record placed labels in spatial index; reject positions that overlap
6. Fallback: abbreviate long labels if no position fits

**Alternatives considered**:
- D3-labeler plugin (simulated annealing) → overkill for 31 stations, hard to constrain to octolinear angles
- Manual label positions in data file → brittle, hard to maintain
- CSS overflow hidden → hides information rather than solving placement

## R6: Design Token Architecture for Iterative Preview Refinement

**Decision**: Refactor `styles.ts` into a structured design token system organized by category (color, typography, spacing, symbols) with a single `DesignTokens` interface. All rendering code references tokens, enabling rapid iteration via the preview channel.

**Rationale**: The current `styles.ts` is a flat collection of exported constants. The redesign introduces significantly more visual parameters (pictogram paths, label rotation angles, color variants for CVD testing). A structured token system makes it easy to swap palettes, test typography variations, and iterate using the preview channel without touching rendering logic.

**Token categories**:
- `colors`: corridor palette, maritime palette, background, station fill/stroke, label color
- `typography`: font family, size scale (title/corridor/mega/major/standard/legend), weights
- `spacing`: grid unit, padding, station radius by tier, line thickness by weight, label offset
- `symbols`: SVG path data for each station type pictogram, scaled by tier multiplier
- `patterns`: dash arrays for solid, dashed (planned), dot-dash (maritime)

**Alternatives considered**:
- CSS custom properties (doesn't work for SVG attributes set via D3)
- External JSON config file (adds complexity, delays iteration)
- Keep flat constants (works but becomes unwieldy with 40+ tokens)
