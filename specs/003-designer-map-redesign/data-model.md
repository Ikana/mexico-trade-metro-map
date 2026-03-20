# Data Model: Multi-Designer Map Redesign

**Feature**: 003-designer-map-redesign
**Date**: 2026-03-20

## Overview

This redesign is a **visual/rendering update only** — the underlying data model (Station, Corridor, MaritimeRoute) remains unchanged. The new entities introduced are purely rendering-side: design tokens and the label placement system.

## Existing Entities (Unchanged)

### Station
Source: `src/types/index.ts` → `data/processed/stations.json`

| Field | Type | Notes |
|-------|------|-------|
| id | string | Unique identifier |
| nameEs | string | **Primary map label** (per clarification) |
| nameEn | string | **Tooltip display name** (per clarification) |
| country | "MX" \| "US" \| "MX/US" \| "INTL" | |
| type | "city" \| "port" \| "border-crossing" \| "terminal-region" | **Maps to pictogram symbol** |
| tier | "mega" \| "major" \| "standard" | **Controls visual size multiplier** |
| x | number | Grid coordinate — **will be updated** for octolinear layout |
| y | number | Grid coordinate — **will be updated** for octolinear layout |
| tradeValueUsd | number \| null | Tooltip data |
| truckCrossingsPerYear | number \| null | Tooltip data |
| containerVolumeTeu | number \| null | Tooltip data |
| primaryCommodities | string[] | Tooltip data |
| corridorIds | string[] | Cross-reference |
| sourceIds | string[] | Data provenance |
| destinationPorts? | string[] | Terminal regions only |

**Changes in scope**: Only `x` and `y` values will be modified to achieve octolinear geometry. All other fields remain as-is.

### Corridor
Source: `src/types/index.ts` → `data/processed/corridors.json`

No structural changes. The `color` field in JSON may be updated to match the new WCAG AA + CVD-safe palette, but the `CORRIDOR_COLORS` lookup in `styles.ts` takes precedence at render time.

### MaritimeRoute
Source: `src/types/index.ts` → `data/processed/maritime.json`

No changes.

## New Entities (Rendering-Side Only)

### DesignTokens
New interface in `src/map/styles.ts`. Not persisted to JSON — compile-time constants.

```typescript
interface DesignTokens {
  colors: {
    corridors: Record<string, string>;      // 9 corridor hex colors
    maritime: Record<string, string>;        // 4 maritime hex colors
    background: string;                      // Map background (#FAF8F5)
    stationFill: string;                     // Station interior
    stationStroke: string;                   // Station outline
    labelColor: string;                      // Primary text color
    labelSecondary: string;                  // Secondary text color
    legendBackground: string;                // Legend panel background
  };
  typography: {
    fontFamily: string;                      // "Inter, ..." font stack
    sizes: {
      title: number;                         // 24px
      subtitle: number;                      // 14px
      corridorLabel: number;                 // 14px
      mega: number;                          // 13px
      major: number;                         // 11px
      standard: number;                      // 10px
      legend: number;                        // 11px
    };
    weights: {
      bold: number;                          // 700
      semibold: number;                      // 600
      regular: number;                       // 400
    };
  };
  spacing: {
    gridUnit: number;                        // 60px
    padding: { top; right; bottom; left };
    stationRadius: Record<Tier, number>;     // mega: 14, major: 9, standard: 6
    lineThickness: Record<Weight, number>;   // high: 8, medium: 5, low: 3
    labelOffset: number;                     // Distance from station to label
    interchangeRingGap: number;              // Extra radius for interchange ring
  };
  symbols: {
    city: string;                            // SVG path data
    port: string;                            // SVG path data
    borderCrossing: string;                  // SVG path data
    terminalRegion: string;                  // SVG path data
  };
  patterns: {
    solid: null;                             // No dash array
    dashed: string;                          // "8 4" for planned corridors
    dotDash: string;                         // "2 4 8 4" for maritime routes
  };
}
```

### LabelPlacement
Runtime-computed, not persisted. Used by the label collision avoidance system.

```typescript
interface LabelPlacement {
  stationId: string;
  x: number;                                // Computed label x
  y: number;                                // Computed label y
  rotation: 0 | -45;                        // Horizontal or 45° aligned
  anchor: "start" | "middle" | "end";       // SVG text-anchor
  bbox: { x: number; y: number; width: number; height: number };  // Bounding box for collision
}
```

## Data Flow (Updated)

```
stations.json (x,y UPDATED for octolinear layout)
corridors.json (unchanged)
maritime.json (unchanged)
        │
        ▼
DesignTokens (new structured token system)
        │
        ▼
renderMap() ──► Pictogram renderer (NEW)
            ──► Label placement engine (NEW)
            ──► Legend renderer (UPDATED)
        │
        ▼
SVG output with:
  - Octolinear corridor paths
  - Pictogram station symbols
  - Collision-free Spanish labels
  - Cultural color palette
  - Inter typography hierarchy
```

## Relationships

- Station.type → DesignTokens.symbols[type] (pictogram selection)
- Station.tier → DesignTokens.spacing.stationRadius[tier] (size scaling)
- Corridor.id → DesignTokens.colors.corridors[id] (color lookup)
- Corridor.lineWeight → DesignTokens.spacing.lineThickness[weight]
- Corridor.lineStyle → DesignTokens.patterns[style]
- Station.nameEs → map label text (primary)
- Station.nameEn → tooltip header text
