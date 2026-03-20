# Data Schema Contracts: Sea Routes & Corridor Interconnections

**Date**: 2026-03-19

Extends V1 contracts with maritime route schema and modified station
types.

## maritime.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "nameEs", "nameEn", "color", "lineNumber",
                 "ocean", "lineStyle", "lineWeight", "stationIds",
                 "carriers", "transitTimeDays", "primaryCommodities",
                 "evidence", "sourceIds"],
    "properties": {
      "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
      "nameEs": { "type": "string" },
      "nameEn": { "type": "string" },
      "color": { "type": "string", "pattern": "^#[0-9a-fA-F]{6}$" },
      "lineNumber": { "type": "integer", "minimum": 10 },
      "ocean": { "enum": ["pacific", "gulf-atlantic"] },
      "lineStyle": { "enum": ["dot-dash"] },
      "lineWeight": { "enum": ["medium"] },
      "stationIds": {
        "type": "array",
        "items": { "type": "string" },
        "minItems": 2
      },
      "carriers": {
        "type": "array",
        "items": { "type": "string" },
        "minItems": 1
      },
      "transitTimeDays": { "type": "string" },
      "primaryCommodities": {
        "type": "array",
        "items": { "type": "string" }
      },
      "evidence": { "type": "string" },
      "sourceIds": {
        "type": "array",
        "items": { "type": "string" },
        "minItems": 1
      }
    },
    "additionalProperties": false
  }
}
```

## stations.json (modifications)

- `type` enum expanded: `["city", "port", "border-crossing", "terminal-region"]`
- `country` enum expanded: `["MX", "US", "MX/US", "INTL"]`
- New optional field: `destinationPorts` (string array, required when
  `type` is `"terminal-region"`)

## Validation Rules (new, in addition to V1 rules)

7. Every `stationIds` entry in a maritime route MUST match an `id` in
   stations.json
8. Every maritime route `sourceIds` entry MUST match an `id` in
   sources.json
9. Every station with `type: "terminal-region"` MUST have
   `country: "INTL"` and a non-empty `destinationPorts` array
10. Every `terminal-region` station MUST appear in at least one
    maritime route's `stationIds`
11. Every land corridor MUST share at least one station with another
    corridor (no isolated corridors — FR-006)
