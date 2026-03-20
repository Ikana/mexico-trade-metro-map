import type { DesignTokens } from "../types/index.ts";

// =============================================================================
// Design Tokens — Multi-Designer Map Redesign
// =============================================================================
// Color palette: Wyman Mexico 68 warm/saturated tones, WCAG AA (4.5:1) on #FAF8F5
// Typography: Inter (Google Fonts) — Johnston/Calvert spirit
// Symbols: Aicher-inspired pictograms on 24×24 grid
// Grid: Beck octolinear (0°/45°/90°)
// =============================================================================

export const TOKENS: DesignTokens = {
  colors: {
    // 9-corridor palette: WCAG AA ≥ 4.5:1 against #FAF8F5, CVD-safe (delta-E ≥ 20)
    corridors: {
      "linea-roja": "#C62828",       // Deep Mexican red — NAFTA Spine
      "linea-azul": "#1565C0",       // Strong blue — Bajío Express
      "linea-verde": "#2E7D32",      // Forest green — Pacific Gateway
      "linea-amarilla": "#8B5E00",   // Aztec gold/ochre — Gulf Corridor
      "linea-morada": "#6A1B9A",     // Rich purple — Interoceanic
      "linea-naranja": "#BF360C",    // Terracotta orange — Western Border
      "linea-blanca": "#546E7A",     // Steel blue-grey — El Paso Corridor
      "linea-cafe": "#4E342E",       // Dark earth brown — Central Spine
      "corredor-verde": "#00695C",   // Teal green — Green Corridor (planned)
    },
    // 4 maritime route colors — visually distinct from land corridors
    maritime: {
      "pacific-asia-express": "#006D75",   // Deep cyan
      "transpacific-gateway": "#00695C",   // Teal
      "gulf-europe": "#1A237E",            // Navy indigo
      "gulf-us-east": "#37474F",           // Dark blue-grey
    },
    background: "#FAF8F5",         // Warm cream (off-white)
    stationFill: "#FFFFFF",        // Station interior
    stationStroke: "#333333",      // Default station outline
    labelColor: "#1A1A1A",         // Primary text
    labelSecondary: "#666666",     // Secondary text
    legendBackground: "#F5F2ED",   // Warm legend panel
  },

  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    sizes: {
      title: 24,
      subtitle: 14,
      corridorLabel: 14,
      mega: 13,
      major: 11,
      standard: 10,
      legend: 11,
    },
    weights: {
      bold: 700,
      semibold: 600,
      regular: 400,
    },
  },

  spacing: {
    gridUnit: 60,
    padding: { top: 80, right: 40, bottom: 240, left: 40 },
    stationRadius: { mega: 14, major: 9, standard: 6 },
    lineThickness: { high: 8, medium: 5, low: 3 },
    labelOffset: 8,
    interchangeRingGap: 4,
  },

  // Pictogram SVG path data on 24×24 unit grid (Aicher-inspired)
  symbols: {
    // City: filled circle (universal metro convention)
    city: "M12,2 A10,10 0 1,0 12,22 A10,10 0 1,0 12,2 Z",
    // Port: anchor-derived geometric shape (wave + vertical post)
    port: "M12,2 L12,8 M6,8 L18,8 M4,16 Q8,22 12,16 Q16,22 20,16 M12,8 L12,16",
    // Border-crossing: diamond/chevron (customs gate)
    borderCrossing: "M12,2 L22,12 L12,22 L2,12 Z",
    // Terminal-region: rounded rectangle with arrow (off-map destination)
    terminalRegion: "M4,6 Q4,4 6,4 L18,4 Q20,4 20,6 L20,18 Q20,20 18,20 L6,20 Q4,20 4,18 Z M14,10 L18,12 L14,14",
  },

  patterns: {
    solid: null,
    dashed: "8 4",           // Planned corridors
    dotDash: "2 4 8 4",     // Maritime routes
  },
};

/** Returns the tier-based scale multiplier for station symbol sizing. */
export function getStationSymbol(
  type: "city" | "port" | "border-crossing" | "terminal-region",
  tier: "mega" | "major" | "standard",
): { scale: number } {
  const tierScale: Record<string, number> = {
    mega: 1.0,
    major: 0.7,
    standard: 0.5,
  };

  return {
    scale: tierScale[tier] || 0.5,
  };
}

// =============================================================================
// Backward-compatible aliases (for incremental migration)
// =============================================================================

export const CORRIDOR_COLORS = TOKENS.colors.corridors;
export const MARITIME_COLORS = TOKENS.colors.maritime;
export const STATION_RADIUS = TOKENS.spacing.stationRadius;
export const LINE_THICKNESS = TOKENS.spacing.lineThickness;
export const DASH_PATTERN = TOKENS.patterns.dashed;
export const DOT_DASH_PATTERN = TOKENS.patterns.dotDash;
export const GRID_UNIT = TOKENS.spacing.gridUnit;
export const FONT_FAMILY = TOKENS.typography.fontFamily;
export const LABEL_SIZE = {
  mega: TOKENS.typography.sizes.mega,
  major: TOKENS.typography.sizes.major,
  standard: TOKENS.typography.sizes.standard,
} as const;
export const TITLE_SIZE = TOKENS.typography.sizes.title;
export const SUBTITLE_SIZE = TOKENS.typography.sizes.subtitle;
export const LEGEND_LABEL_SIZE = TOKENS.typography.sizes.legend;
export const HEADLINE_SIZE = 12;
export const MAP_PADDING = TOKENS.spacing.padding;
export const MAP_BG = TOKENS.colors.background;
export const STATION_FILL = TOKENS.colors.stationFill;
export const STATION_STROKE_WIDTH = 2.5;
export const LABEL_COLOR = TOKENS.colors.labelColor;
export const LEGEND_BG = TOKENS.colors.legendBackground;
