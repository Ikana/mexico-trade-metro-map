# Data Dictionary: Mexico Trade Metro Map

**Currency Basis**: All USD values are nominal (not inflation-adjusted).

## stations.json

| Field | Type | Unit | Description | Source |
|-------|------|------|-------------|--------|
| id | string | — | Unique slug identifier | Derived |
| nameEs | string | — | Station name in Spanish | Editorial |
| nameEn | string | — | Station name in English | Editorial |
| country | enum | — | MX, US, or MX/US (border crossings) | Geographic |
| type | enum | — | city, port, or border-crossing | Geographic |
| tier | enum | — | mega, major, or standard (editorial) | Editorial assignment |
| x | number | grid units | Schematic X coordinate (octolinear) | Editorial layout |
| y | number | grid units | Schematic Y coordinate (octolinear) | Editorial layout |
| tradeValueUsd | number/null | USD (nominal) | Annual trade value | BTS, Laredo EDC, TxDOT |
| tradeValueYear | number/null | year | Year of trade value figure | Per source |
| truckCrossingsPerYear | number/null | count | Annual truck crossings | BTS Border Crossing |
| containerVolumeTeu | number/null | TEU | Annual container throughput | Contecon, port authorities |
| primaryCommodities | string[] | — | Key commodity categories | Multiple sources |
| corridorIds | string[] | — | Corridors passing through station | Derived from corridors |
| sourceIds | string[] | — | Data sources backing stats | Provenance |

## corridors.json

| Field | Type | Unit | Description | Source |
|-------|------|------|-------------|--------|
| id | string | — | Unique slug identifier | Derived |
| nameEs | string | — | Corridor name in Spanish | Editorial |
| nameEn | string | — | Corridor name in English | Editorial |
| color | string | hex | Display color (#RRGGBB) | Design system |
| lineNumber | integer | — | Display order (1-9) | Editorial |
| status | enum | — | active or planned | Infrastructure reports |
| lineStyle | enum | — | solid or dashed | Derived from status |
| lineWeight | enum | — | high, medium, or low | Editorial (by volume) |
| primaryMode | enum | — | truck, rail, or both | BTS, ARTF |
| stationIds | string[] | — | Ordered station sequence | Editorial routing |
| totalTradeValue | string/null | narrative | Trade value summary | BTS, Laredo EDC |
| primaryCommodities | string[] | — | Key commodity categories | Multiple sources |
| evidence | string | — | Sourced evidence statement | Multiple sources |
| sourceIds | string[] | — | Data sources backing corridor | Provenance |

## sources.json

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| id | string | — | Unique slug identifier |
| name | string | — | Human-readable source name |
| authority | string | — | Issuing organization |
| url | string/null | — | URL (null for offline sources) |
| accessDate | string | ISO date | When data was accessed |
| dataYear | integer | year | Year the data covers |
| coverage | string | — | What the source covers |

## headlines.json

| Field | Type | Unit | Description | Source |
|-------|------|------|-------------|--------|
| id | string | — | Unique slug identifier | Derived |
| text | string | — | Full display text | Multiple |
| value | string | — | Highlighted numeric value | Multiple |
| sourceId | string | — | Reference to data source | Provenance |
