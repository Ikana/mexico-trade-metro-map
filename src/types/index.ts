export interface Station {
  id: string;
  nameEs: string;
  nameEn: string;
  country: "MX" | "US" | "MX/US" | "INTL";
  type: "city" | "port" | "border-crossing" | "terminal-region";
  tier: "mega" | "major" | "standard";
  x: number;
  y: number;
  tradeValueUsd: number | null;
  tradeValueYear: number | null;
  truckCrossingsPerYear: number | null;
  containerVolumeTeu: number | null;
  primaryCommodities: string[];
  corridorIds: string[];
  sourceIds: string[];
  destinationPorts?: string[];
}

export interface Corridor {
  id: string;
  nameEs: string;
  nameEn: string;
  color: string;
  lineNumber: number;
  status: "active" | "planned";
  lineStyle: "solid" | "dashed";
  lineWeight: "high" | "medium" | "low";
  primaryMode: "truck" | "rail" | "both";
  stationIds: string[];
  totalTradeValue: string | null;
  primaryCommodities: string[];
  evidence: string;
  sourceIds: string[];
}

export interface MaritimeRoute {
  id: string;
  nameEs: string;
  nameEn: string;
  color: string;
  lineNumber: number;
  ocean: "pacific" | "gulf-atlantic";
  lineStyle: "dot-dash";
  lineWeight: "medium";
  stationIds: string[];
  carriers: string[];
  transitTimeDays: string;
  primaryCommodities: string[];
  evidence: string;
  sourceIds: string[];
}

export interface DataSource {
  id: string;
  name: string;
  authority: string;
  url: string | null;
  accessDate: string;
  dataYear: number;
  coverage: string;
}

export interface HeadlineStat {
  id: string;
  text: string;
  value: string;
  sourceId: string;
}

export interface DesignTokens {
  colors: {
    corridors: Record<string, string>;
    maritime: Record<string, string>;
    background: string;
    stationFill: string;
    stationStroke: string;
    labelColor: string;
    labelSecondary: string;
    legendBackground: string;
    geoMexico: string;
    geoUsBorder: string;
    geoBorderLine: string;
  };
  typography: {
    fontFamily: string;
    sizes: {
      title: number;
      subtitle: number;
      corridorLabel: number;
      mega: number;
      major: number;
      standard: number;
      legend: number;
    };
    weights: {
      bold: number;
      semibold: number;
      regular: number;
    };
  };
  spacing: {
    gridUnit: number;
    padding: { top: number; right: number; bottom: number; left: number };
    stationRadius: Record<string, number>;
    lineThickness: Record<string, number>;
    labelOffset: number;
    interchangeRingGap: number;
    stationStrokeWidth: number;
  };
  symbols: {
    city: string;
    port: string;
    borderCrossing: string;
    terminalRegion: string;
  };
  patterns: {
    solid: null;
    dashed: string;
    dotDash: string;
  };
}

export interface LabelPlacement {
  stationId: string;
  x: number;
  y: number;
  rotation: 0;
  anchor: "start" | "middle" | "end";
  fontSize: number;
  fontWeight: number;
  labelText: string;
  bbox: { x: number; y: number; width: number; height: number };
}
