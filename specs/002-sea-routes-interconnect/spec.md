# Feature Specification: Sea Routes & Corridor Interconnections

**Feature Branch**: `002-sea-routes-interconnect`
**Created**: 2026-03-19
**Status**: Draft
**Input**: User description: "Add sea/maritime trade routes as new lines on the map. Fix the existing corridor network so all lines are interconnected through hub stations like a real metro map."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interconnected Corridor Network (Priority: P1)

A user looks at the map and sees a fully connected metro network — not
isolated line segments. Every corridor connects to at least one other
corridor through a shared hub station. CDMX is the central hub where
the Central Spine, Bajío Express, and Pacific Gateway converge.
Monterrey connects the NAFTA Spine to the Gulf Corridor. Querétaro
links the Bajío Express to the NAFTA Spine (via San Luis Potosí).
Guadalajara connects the Pacific Gateway to the Bajío Express. A user
can trace a continuous route from any station to any other station by
transferring at interchange hubs, just like a real metro system.

**Why this priority**: Without interconnections, the map is a
collection of disconnected diagrams — it fails the core metaphor of a
metro map. This must be fixed before adding new lines.

**Independent Test**: Pick any two stations on different corridors
(e.g., Tijuana on Línea Naranja and Manzanillo on Línea Verde). Trace
a route between them using interchange stations. If a valid path
exists, the network is connected.

**Acceptance Scenarios**:

1. **Given** the updated map, **When** a user picks any two stations on
   different corridors, **Then** a path exists between them using at
   most 3 interchanges
2. **Given** the updated map, **When** a user looks at CDMX, **Then**
   it visually appears as a major interchange with at least 3 corridors
   passing through it
3. **Given** the updated map, **When** a user looks at Monterrey,
   **Then** it connects the NAFTA Spine northward to Laredo and
   eastward toward the Gulf Corridor
4. **Given** the updated map, **When** a user looks at Guadalajara,
   **Then** it connects the Pacific Gateway (to Manzanillo) and the
   Bajío Express (to Querétaro)

---

### User Story 2 - Pacific Maritime Routes (Priority: P2)

A user sees new maritime "lines" on the map representing Pacific
shipping lanes. These connect Mexico's Pacific ports (Manzanillo,
Lázaro Cárdenas, Ensenada, Salina Cruz) to major international
trading partners in Asia (Shanghai, Busan, Yokohama). The maritime
lines use a distinct visual style (wavy or dotted-wavy) to
differentiate them from land corridors. Hovering over a maritime line
shows carrier information (CMA CGM, MSC, Cosco), transit times, and
container volumes.

**Why this priority**: The Pacific routes represent Mexico's
fastest-growing trade relationship (Asia nearshoring). Manzanillo and
Lázaro Cárdenas are the two busiest container ports in Mexico.

**Independent Test**: View the map and identify at least 2 Pacific
maritime routes connecting Mexican ports to Asian ports. Verify
tooltips show transit times and carrier data.

**Acceptance Scenarios**:

1. **Given** the updated map, **When** a user views the Pacific coast,
   **Then** at least 2 maritime routes connect Mexican ports to Asian
   ports
2. **Given** the updated map, **When** a user hovers over a Pacific
   maritime route, **Then** the tooltip shows carriers, transit time
   (e.g., "15-20 days"), and primary cargo types
3. **Given** the map, **When** a user compares land and sea routes,
   **Then** maritime routes are visually distinct from land corridors
   (different line style)
4. **Given** the updated map, **When** Lázaro Cárdenas appears on the
   map, **Then** it is shown as a major hub station connecting both
   land corridors and Pacific maritime routes

---

### User Story 3 - Gulf & Atlantic Maritime Routes (Priority: P3)

A user sees Gulf/Atlantic maritime lines connecting Mexico's Gulf
ports (Veracruz, Altamira, Coatzacoalcos) to trading partners on the
US East Coast and in Europe (Houston, New Orleans, Rotterdam,
Hamburg). These share the same maritime visual style as Pacific routes
but use distinct colors.

**Why this priority**: The Gulf routes complete the picture of
Mexico's maritime trade. Veracruz is Mexico's largest Gulf port and
the primary automotive export gateway to Europe. Altamira handles
energy and petrochemical trade.

**Independent Test**: View the map and identify Gulf/Atlantic maritime
routes. Verify Veracruz connects to both land (Central Spine) and sea
(Europe/US East Coast) routes.

**Acceptance Scenarios**:

1. **Given** the updated map, **When** a user views the Gulf coast,
   **Then** at least 2 maritime routes connect Gulf ports to US East
   Coast and European ports
2. **Given** the updated map, **When** a user hovers over Veracruz,
   **Then** it shows as an interchange connecting the Central Spine
   land corridor and Gulf maritime routes
3. **Given** the updated map, **When** a user hovers over a Gulf
   maritime route, **Then** the tooltip shows destination ports,
   carriers, and primary cargo (automotive, petrochemicals)

---

### Edge Cases

- How does the map handle international destination ports (Shanghai,
  Rotterdam) that are off the map's geographic scope? Group them into
  2-3 regional terminal stations per ocean side (e.g., "→ Asia",
  "→ Europe", "→ US East Coast"). Individual port names appear in
  tooltips
- How are maritime routes visually distinguished from land corridors?
  Use a distinct line style (wavy or dot-dash pattern) and a separate
  section in the legend labeled "Rutas Marítimas / Maritime Routes"
- What happens when a port serves both land and maritime routes
  (e.g., Manzanillo, Veracruz)? Show it as a multi-modal interchange
  station with the interchange ring visual
- How do we handle Lázaro Cárdenas, which was not on the V1 map but
  is Mexico's #2 container port? Add it as a new major hub station
  on the Pacific coast, connected to both land and maritime corridors

## Requirements *(mandatory)*

### Functional Requirements

**Interconnections:**

- **FR-001**: The map MUST show CDMX as a central interchange where at
  least 3 corridors converge (Central Spine, route to Bajío/Querétaro,
  route to Guadalajara/Pacific)
- **FR-002**: The map MUST extend the NAFTA Spine corridor (Línea Roja)
  southward from San Luis Potosí through Querétaro to CDMX, creating a
  continuous north-south backbone
- **FR-003**: The map MUST extend the Pacific Gateway corridor (Línea
  Verde) from Guadalajara to CDMX, connecting Pacific trade to the
  central hub
- **FR-004**: The map MUST connect Monterrey to the Gulf Corridor
  (Línea Amarilla) via a new segment or route extension, so Gulf
  border crossings are reachable from the NAFTA Spine
- **FR-005**: Guadalajara MUST connect to the Bajío Express corridor,
  serving as the western terminus linking Pacific trade to the Bajío
  manufacturing region
- **FR-006**: Every corridor MUST share at least one station with
  another corridor, ensuring no isolated lines exist
- **FR-007**: The map MUST display interchange stations (multi-corridor
  stops) with a visually distinct interchange symbol (ring/circle)

**New Stations & Ports:**

- **FR-008**: The map MUST add Lázaro Cárdenas as a major hub station
  on the Pacific coast (~2.2M TEU capacity, Mexico's #2 container
  port). Source: Pro Mexico Industry, Pacific Ports
- **FR-009**: The map MUST add Altamira as a standard station on the
  Gulf coast (~880K TEU, Mexico's #4 container port, energy/petrochem
  focus). Source: Unisco, Mexico Business News
- **FR-010**: The map MUST add Ensenada as a standard station on the
  Pacific coast (~300K TEU, Baja California deepwater port, Asia
  gateway). Source: Hutchison Ports, FreightAmigo

**Maritime Routes:**

- **FR-011**: The map MUST display at least 2 Pacific maritime routes
  connecting Mexican Pacific ports to Asian destination ports
- **FR-012**: The map MUST display at least 2 Gulf/Atlantic maritime
  routes connecting Mexican Gulf ports to US East Coast and European
  destination ports
- **FR-013**: Maritime routes MUST use a dot-dash line pattern
  (distinct from solid land corridors and dashed planned corridors)
  to indicate sea transport
- **FR-014**: Maritime routes MUST have distinct colors that do not
  conflict with existing land corridor colors
- **FR-015**: International destinations MUST appear as grouped
  terminal stations at the map edge (2-3 per ocean side), labeled by
  region (e.g., "→ Asia", "→ Europe", "→ US East Coast"). Individual
  destination port names (Shanghai, Busan, Rotterdam, etc.) appear in
  tooltips, not as separate stations
- **FR-016**: Maritime route tooltips MUST show carriers, transit
  times, primary cargo types, and source citations
- **FR-017**: The legend MUST include a separate "Rutas Marítimas /
  Maritime Routes" section with maritime line styles and colors

### Key Entities

- **Maritime Route**: A named shipping lane connecting a Mexican port
  to an international destination. Attributes: name (Spanish), name
  (English), color, ocean (Pacific/Gulf-Atlantic), carriers, transit
  time range, primary cargo types, source citations
- **Terminal Region**: A grouped off-map destination shown as a
  terminal station at the map edge. Attributes: region label (e.g.,
  "→ Asia"), ocean (Pacific/Gulf-Atlantic), individual port names
  (for tooltip display), direction
- **Interchange Station**: A station where 2+ corridors meet, shown
  with interchange visual. Extends existing Station entity with a
  count of converging corridors

## New Maritime Routes & Data *(mandatory)*

### Pacific Maritime Routes (Research-Backed)

| # | Color | Name (ES) | Name (EN) | Mexican Ports | Destinations | Evidence |
|---|-------|-----------|-----------|---------------|--------------|----------|
| P1 | Cyan | Ruta Pacífico-Asia | Pacific-Asia Express | Manzanillo, Lázaro Cárdenas, Ensenada | Shanghai, Busan, Yokohama | CMA CGM M2X service: Tianjin → Qingdao → Busan → Ensenada → Manzanillo → Lázaro Cárdenas. MSC loop: Qingdao → Ningbo → Shanghai → Busan → Manzanillo → Lázaro Cárdenas. Cosco TLP5: 15-20 day transit. Source: FreightWaves, Lading Cargo |
| P2 | Teal | Ruta Transpacífica | Transpacific Gateway | Lázaro Cárdenas, Manzanillo | Shanghai, Ningbo, Qingdao | Direct China-Mexico route. Import bookings from China skyrocketed 2023-2025. Chinese FDI in Mexico up 11% YoY to $135B. Source: FreightWaves |

### Gulf/Atlantic Maritime Routes (Research-Backed)

| # | Color | Name (ES) | Name (EN) | Mexican Ports | Destinations | Evidence |
|---|-------|-----------|-----------|---------------|--------------|----------|
| G1 | Navy | Ruta Golfo-Europa | Gulf-Europe Line | Veracruz, Altamira | Rotterdam, Hamburg | Veracruz = primary automotive export gateway to Europe. Auto parts + finished vehicles via Hwy 150D from Puebla. Source: iContainers, FreightAmigo |
| G2 | Steel Blue | Ruta Golfo-EEUU | Gulf-US East Coast | Veracruz, Altamira, Coatzacoalcos | Houston, New Orleans | Gulf Coast energy corridor. Altamira = 37% of Mexico's Gulf container traffic. Petrochemicals, energy products. Source: Unisco, Mexico Business News |

### New Port Stations

| Station | TEU Volume | Rank | Type | Evidence |
|---------|-----------|------|------|----------|
| Lázaro Cárdenas | ~2.2M TEU (2025) | #2 in Mexico | Major Hub | 13% YoY growth Jan-May 2025, 27% of Mexico's container cargo. Source: Pro Mexico Industry, Pacific Ports |
| Altamira | ~880K TEU | #4 in Mexico | Standard | 37% of Gulf container traffic. Energy/petrochem focus. 6 new terminals under construction. Source: Unisco, Mexico Business News |
| Ensenada | ~300K TEU | Baja California | Standard | Only deepwater port in Baja. Cosco TLP5 + CMA CGM M2X call here. Source: Hutchison Ports |

### Corridor Interconnection Changes

| Change | Stations Added/Modified | Rationale |
|--------|------------------------|-----------|
| Extend Línea Roja south to CDMX | Add Querétaro, CDMX to stationIds | Creates north-south backbone from Laredo to CDMX |
| Extend Línea Verde to CDMX | Add CDMX to stationIds | Connects Pacific trade to central hub |
| Connect Guadalajara to Bajío | Add Guadalajara to Línea Azul stationIds | Links Pacific to manufacturing corridor |
| Add Lázaro Cárdenas to Línea Verde | Add Lázaro Cárdenas to stationIds | Mexico's #2 port joins the Pacific Gateway |
| Connect Monterrey to Gulf | Extend Línea Amarilla or add segment via Monterrey | Connects Gulf crossings to NAFTA Spine hub |
| Add Altamira to Gulf infrastructure | Add to Línea Amarilla or new segment | Gulf energy port joins the network |
| Connect Línea Café to network | Already connects at CDMX via extensions above | Central Spine auto-connects when others reach CDMX |

### Data Sources (New)

| Source | Authority | Coverage | URL |
|--------|-----------|----------|-----|
| CMA CGM M2X Service | CMA CGM / FreightWaves | Asia-Mexico Pacific shipping routes | https://www.freightwaves.com/news/new-shipping-routes-highlight-growing-asia-to-mexico-trade |
| Cosco TLP5 Route | Cosco / Lading Cargo | Asia-Mexico transit times, carriers | https://ladingcargo.com/blog/shipping-giants-unveil-express-routes-linking-asia-and-mexico/ |
| Lázaro Cárdenas Port Data | Pro Mexico Industry | Container volumes, growth rates | https://www.promexicoindustry.com/en/article/port-of-lzaro-crdenas-grows-13-in-container-traffic-through-may-2025 |
| Lázaro Cárdenas Tonnage | Pacific Ports | Annual tonnage, logistics leadership | https://pacificports.org/lazaro-cardenas-port-exceeds-24-6-million-tons-and-consolidates-its-logistics-leadership-in-2025/ |
| Altamira Port Profile | Unisco | Gulf container traffic share | https://www.unisco.com/international-ports/altamira-mexico |
| Gulf Ports Overview | FreightAmigo | Top 5 Gulf ports, trade routes | https://www.freightamigo.com/en/blog/global-trade/top-5-mexican-ports-gateways-to-global-trade-in-the-gulf-of-mexico/ |
| Ensenada Port | Hutchison Ports / FreightAmigo | TEU capacity, Asia services | https://www.freightamigo.com/en/blog/global-trade/top-5-ports-in-mexico-gateways-to-global-trade/ |
| Mexico Shipping Routes | iContainers | Gulf-Europe, Gulf-US routes | https://www.icontainers.com/ocean-freight/mexico/ |

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every corridor on the map shares at least one station
  with another corridor — zero isolated lines remain
- **SC-002**: A user can trace a route from any station to any other
  station using at most 3 interchanges
- **SC-003**: At least 4 maritime routes appear on the map (2 Pacific,
  2 Gulf/Atlantic) with visually distinct styling from land corridors
- **SC-004**: CDMX visually reads as the central hub with 3+ corridors
  converging, matching its role as Mexico's primary distribution center
- **SC-005**: All new port data (Lázaro Cárdenas, Altamira, Ensenada)
  traces to cited primary sources in the data dictionary
- **SC-006**: Maritime route tooltips display carrier names, transit
  times, and cargo types with source citations

## Clarifications

### Session 2026-03-19

- Q: Which visual style should maritime routes use to distinguish from land corridors? → A: Dot-dash pattern (alternating dots and dashes, e.g., "2 4 8 4" stroke-dasharray).
- Q: How should international destination ports appear on the map? → A: Grouped terminals, 2-3 per ocean side, labeled by region (e.g., "→ Asia", "→ Europe", "→ US East Coast"). Individual port names appear in tooltips.

## Assumptions

- Maritime routes are shown schematically (not geographically) —
  they connect Mexican port stations to edge-of-map international
  terminal stations
- International destination ports are simplified to major hubs
  (Shanghai, Busan, Yokohama for Pacific; Rotterdam, Hamburg, Houston,
  New Orleans for Gulf/Atlantic) — not every individual port call
- Maritime route "lines" share the same data model as land corridors
  but with additional fields (carriers, transit time, ocean)
- The existing V1 station coordinates will need adjustment to
  accommodate new stations and interconnections without overlap
- Corridor extensions (e.g., Línea Roja to CDMX) add new station
  entries to existing corridor stationIds — they do not create new
  corridors
