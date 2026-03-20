# Research: Sea Routes & Corridor Interconnections

**Date**: 2026-03-19
**Feature**: 002-sea-routes-interconnect

## Decision 1: Corridor Interconnection Strategy

**Decision**: Extend existing corridor stationIds to create shared hub
stations rather than creating new "connector" corridors.

**Rationale**: The V1 corridors are correct routes — they just need to
be extended to reach shared hubs. Adding connector corridors would clutter
the map with extra colors/names. The metro-map metaphor works by having
lines share stations, not by adding transfer corridors between them.

**Specific extensions**:
- Línea Roja: extend south from SLP → Querétaro → CDMX
- Línea Verde: extend east from Guadalajara → CDMX, add Lázaro Cárdenas
- Línea Azul: add Guadalajara as western terminus
- Línea Amarilla: extend west from Reynosa → Monterrey, add Altamira
- Línea Morada: already connects Coatzacoalcos (reachable via Línea Café
  extension or proximity to Veracruz)

**Result**: CDMX becomes 4-corridor hub (Roja, Verde, Azul via Querétaro,
Café). Monterrey becomes 3-corridor hub (Roja, Amarilla, Corredor Verde).
Guadalajara becomes 2-corridor hub (Verde, Azul).

**Alternatives considered**:
- New "connector" corridors between hubs: adds visual clutter, more colors
- Merging corridors: loses the distinct identity of each trade route

## Decision 2: Maritime Route Data Model

**Decision**: Create a new `MaritimeRoute` type that extends the Corridor
interface with maritime-specific fields (carriers, transitTimeDays, ocean).
Store in separate `maritime-raw.json` and `maritime.json` files.

**Rationale**: Maritime routes have fundamentally different attributes than
land corridors (carriers, transit times, no truck/rail mode split).
Keeping them in a separate file makes the data pipeline clearer and avoids
polluting the land corridor schema with nullable maritime fields.

**Alternatives considered**:
- Same file as corridors with nullable maritime fields: messy, breaks
  existing validation rules
- Completely separate rendering pipeline: over-engineered, they share
  90% of the rendering logic

## Decision 3: Terminal Region Representation

**Decision**: Model terminal regions as a special station type
(`type: "terminal-region"`) with a `regionLabel` field (e.g., "→ Asia")
and a `destinationPorts` array for tooltip display.

**Rationale**: Terminal regions behave like stations on the map (they
have coordinates, appear at line endpoints) but represent grouped
international destinations. Using the existing Station type with a new
`type` value keeps the renderer simple — it just needs to handle the
visual differently for terminal-region stations.

**Alternatives considered**:
- Separate entity type: requires parallel rendering logic for minimal
  benefit
- Hard-coded edge labels (not data-driven): violates Data Provenance
  constitution principle

## Decision 4: Schematic Layout for Maritime Routes

**Decision**: Maritime routes extend from Mexican port stations to
terminal region stations placed at the map edges. Pacific routes go
left, Gulf/Atlantic routes go right. Routes use octolinear segments
(same grid as land corridors) with dot-dash line style.

**Rationale**: Keeping maritime routes on the same octolinear grid
maintains visual consistency with the Beck-style land corridors. The
dot-dash pattern is the only visual differentiator needed — the layout
rules are identical.

## Decision 5: Coordinate Adjustments

**Decision**: The V1 coordinate grid must be expanded to accommodate:
- New stations (Lázaro Cárdenas, Altamira, Ensenada)
- Terminal regions at map edges
- Extended corridors reaching CDMX

**Approach**: Expand the grid width to accommodate Pacific terminal
regions on the far left and Gulf/Atlantic terminals on the far right.
Shift existing stations if needed to maintain octolinear alignment
after corridor extensions.
