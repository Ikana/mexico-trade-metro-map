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
