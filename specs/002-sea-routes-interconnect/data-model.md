# Data Model: Sea Routes & Corridor Interconnections

**Date**: 2026-03-19
**Feature**: 002-sea-routes-interconnect

## New Entity: MaritimeRoute

Extends the Corridor concept for ocean shipping lanes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Unique slug (e.g., "pacific-asia-express") |
| nameEs | string | yes | Spanish name |
| nameEn | string | yes | English name |
| color | string | yes | Hex color code |
| lineNumber | number | yes | Display order (10+ to avoid land corridor conflicts) |
| ocean | "pacific" \| "gulf-atlantic" | yes | Which ocean basin |
| lineStyle | "dot-dash" | yes | Always dot-dash for maritime |
| lineWeight | "medium" | yes | Maritime routes use medium weight |
| stationIds | string[] | yes | Ordered: Mexican ports → terminal regions |
| carriers | string[] | yes | Shipping carriers (CMA CGM, MSC, Cosco) |
| transitTimeDays | string | yes | Transit time range (e.g., "15-20") |
| primaryCommodities | string[] | yes | Key cargo types |
| evidence | string | yes | Sourced evidence statement |
| sourceIds | string[] | yes | Data source references |

**Identity**: Unique by `id`.

## New Station Type: Terminal Region

Extends Station with `type: "terminal-region"`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | e.g., "terminal-asia" |
| nameEs | string | yes | e.g., "→ Asia" |
| nameEn | string | yes | e.g., "→ Asia" |
| country | "INTL" | yes | International (new enum value) |
| type | "terminal-region" | yes | New station type |
| tier | "standard" | yes | Standard visual size |
| x | number | yes | At map edge |
| y | number | yes | Positioned near connected ports |
| destinationPorts | string[] | yes | Individual port names for tooltip |
| corridorIds | string[] | yes | Maritime routes through this terminal |
| sourceIds | string[] | yes | Data sources |

## Modified Entities

### Station (additions)

- New `type` enum value: `"terminal-region"` added to existing
  `"city" | "port" | "border-crossing"`
- New `country` enum value: `"INTL"` for international terminals
- New optional field: `destinationPorts: string[]` (only for
  terminal-region type)

### Corridor (modifications)

- Línea Roja: stationIds extended with `"queretaro"`, `"cdmx"`
- Línea Verde: stationIds extended with `"cdmx"`,
  `"lazaro-cardenas"`
- Línea Azul: stationIds extended with `"guadalajara"`
- Línea Amarilla: stationIds extended with `"monterrey"`,
  `"altamira"`

## New Stations

| ID | Name | Type | Tier | Connected To |
|----|------|------|------|-------------|
| lazaro-cardenas | Lázaro Cárdenas | port | major | Línea Verde, Pacific maritime routes |
| altamira | Altamira | port | standard | Línea Amarilla, Gulf maritime routes |
| ensenada | Ensenada | port | standard | Línea Naranja, Pacific maritime routes |
| terminal-asia | → Asia | terminal-region | standard | Pacific maritime routes |
| terminal-europe | → Europa / Europe | terminal-region | standard | Gulf maritime routes |
| terminal-us-east | → Costa Este EEUU / US East Coast | terminal-region | standard | Gulf maritime routes |

## File Layout

```text
data/raw/
├── maritime-raw.json     # NEW: 4 maritime route definitions
├── stations-raw.json     # MODIFIED: +3 ports, +3 terminal regions
├── corridors-raw.json    # MODIFIED: extended stationIds
└── sources.json          # MODIFIED: +8 new sources

data/processed/
├── maritime.json         # NEW: processed maritime routes
├── stations.json         # MODIFIED
├── corridors.json        # MODIFIED
└── sources.json          # MODIFIED
```

## Relationships

```text
MaritimeRoute ──has many──▶ Station (Mexican ports + terminal regions)
TerminalRegion ──belongs to many──▶ MaritimeRoute
Station (port) ──belongs to many──▶ Corridor + MaritimeRoute
  (multi-modal interchange: Manzanillo, Veracruz, etc.)
```
