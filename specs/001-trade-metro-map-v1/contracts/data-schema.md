# Data Schema Contracts: Trade Metro Map V1

**Date**: 2026-03-19

These contracts define the JSON schemas for the processed data files
that the map renderer consumes. The data pipeline MUST produce files
conforming to these schemas. The renderer MUST NOT accept data that
fails validation.

## stations.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "nameEs", "nameEn", "country", "type",
                 "tier", "x", "y", "corridorIds", "sourceIds"],
    "properties": {
      "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
      "nameEs": { "type": "string" },
      "nameEn": { "type": "string" },
      "country": { "enum": ["MX", "US", "MX/US"] },
      "type": { "enum": ["city", "port", "border-crossing"] },
      "tier": { "enum": ["mega", "major", "standard"] },
      "x": { "type": "number" },
      "y": { "type": "number" },
      "tradeValueUsd": { "type": ["number", "null"] },
      "tradeValueYear": { "type": ["number", "null"] },
      "truckCrossingsPerYear": { "type": ["number", "null"] },
      "containerVolumeTeu": { "type": ["number", "null"] },
      "primaryCommodities": {
        "type": "array",
        "items": { "type": "string" }
      },
      "corridorIds": {
        "type": "array",
        "items": { "type": "string" },
        "minItems": 1
      },
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

## corridors.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "nameEs", "nameEn", "color", "lineNumber",
                 "status", "lineStyle", "lineWeight", "primaryMode",
                 "stationIds", "evidence", "sourceIds"],
    "properties": {
      "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
      "nameEs": { "type": "string" },
      "nameEn": { "type": "string" },
      "color": { "type": "string", "pattern": "^#[0-9a-fA-F]{6}$" },
      "lineNumber": { "type": "integer", "minimum": 1 },
      "status": { "enum": ["active", "planned"] },
      "lineStyle": { "enum": ["solid", "dashed"] },
      "lineWeight": { "enum": ["high", "medium", "low"] },
      "primaryMode": { "enum": ["truck", "rail", "both"] },
      "stationIds": {
        "type": "array",
        "items": { "type": "string" },
        "minItems": 2
      },
      "totalTradeValue": { "type": ["string", "null"] },
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

## sources.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "name", "authority", "accessDate",
                 "dataYear", "coverage"],
    "properties": {
      "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
      "name": { "type": "string" },
      "authority": { "type": "string" },
      "url": { "type": ["string", "null"] },
      "accessDate": {
        "type": "string",
        "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
      },
      "dataYear": { "type": "integer" },
      "coverage": { "type": "string" }
    },
    "additionalProperties": false
  }
}
```

## headlines.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "text", "value", "sourceId"],
    "properties": {
      "id": { "type": "string" },
      "text": { "type": "string" },
      "value": { "type": "string" },
      "sourceId": { "type": "string" }
    },
    "additionalProperties": false
  }
}
```

## Validation Rules (cross-file)

1. Every `corridorIds` entry in a station MUST match an `id` in
   corridors.json
2. Every `stationIds` entry in a corridor MUST match an `id` in
   stations.json
3. Every `sourceIds` entry MUST match an `id` in sources.json
4. Every station with `type: "border-crossing"` MUST have
   `country: "MX/US"`
5. Every corridor with `status: "planned"` MUST have
   `lineStyle: "dashed"`
6. Every station MUST appear in at least one corridor's
   `stationIds` list
