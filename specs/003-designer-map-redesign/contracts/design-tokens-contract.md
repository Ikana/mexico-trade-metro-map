# Contract: Design Tokens API

**Feature**: 003-designer-map-redesign
**Type**: Internal module interface

## Overview

The design tokens module (`src/map/styles.ts`) serves as the single source of truth for all visual parameters. All rendering code (renderer, legend, tooltips) MUST reference tokens rather than hardcoded values.

## Exported Interface

```typescript
// Primary export — complete token set
export const TOKENS: DesignTokens;

// Convenience re-exports for backward compatibility during migration
export const CORRIDOR_COLORS: Record<string, string>;  // → TOKENS.colors.corridors
export const MARITIME_COLORS: Record<string, string>;   // → TOKENS.colors.maritime
export const STATION_RADIUS: Record<string, number>;    // → TOKENS.spacing.stationRadius
export const LINE_THICKNESS: Record<string, number>;    // → TOKENS.spacing.lineThickness
export const FONT_FAMILY: string;                       // → TOKENS.typography.fontFamily

// New exports
export const STATION_SYMBOLS: Record<StationType, string>;  // SVG path data
export function getStationSymbol(type: StationType, tier: Tier): { path: string; scale: number };
```

## Constraints

- All corridor colors MUST pass WCAG AA (4.5:1) against `TOKENS.colors.background`
- All corridor colors MUST be distinguishable under simulated deuteranopia and protanopia
- Font family MUST include Inter as primary, with system font fallbacks
- Grid unit MUST remain 60px to preserve spatial relationships
- Station radius values MUST maintain tier ordering: mega > major > standard

## Consumers

| Module | Tokens Used |
|--------|------------|
| `renderer.ts` | All categories |
| `legend.ts` | colors, typography, spacing, symbols, patterns |
| `tooltips.ts` | colors.corridors, typography.fontFamily, typography.sizes |
| `responsive.ts` | spacing.gridUnit, spacing.padding |
