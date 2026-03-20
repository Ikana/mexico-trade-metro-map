export const CORRIDOR_COLORS: Record<string, string> = {
  "linea-roja": "#E63946",
  "linea-azul": "#457B9D",
  "linea-verde": "#2A9D8F",
  "linea-amarilla": "#E9C46A",
  "linea-morada": "#9B5DE5",
  "linea-naranja": "#F4A261",
  "linea-blanca": "#8D99AE",
  "linea-cafe": "#6B4226",
  "corredor-verde": "#457B9D",
};

export const STATION_RADIUS = {
  mega: 12,
  major: 8,
  standard: 5,
} as const;

export const LINE_THICKNESS = {
  high: 8,
  medium: 5,
  low: 3,
} as const;

export const DASH_PATTERN = "8 4";
export const DOT_DASH_PATTERN = "2 4 8 4";

export const MARITIME_COLORS: Record<string, string> = {
  "pacific-asia-express": "#00BCD4",
  "transpacific-gateway": "#009688",
  "gulf-europe": "#1A237E",
  "gulf-us-east": "#546E7A",
};

export const GRID_UNIT = 60;

export const FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const LABEL_SIZE = {
  mega: 13,
  major: 11,
  standard: 10,
} as const;

export const TITLE_SIZE = 22;
export const SUBTITLE_SIZE = 14;
export const LEGEND_LABEL_SIZE = 11;
export const HEADLINE_SIZE = 12;

export const MAP_PADDING = {
  top: 80,
  right: 40,
  bottom: 240,
  left: 40,
};

export const MAP_BG = "#FAFAFA";
export const STATION_FILL = "#FFFFFF";
export const STATION_STROKE_WIDTH = 2.5;
export const LABEL_COLOR = "#1A1A1A";
export const LEGEND_BG = "#F5F5F5";
