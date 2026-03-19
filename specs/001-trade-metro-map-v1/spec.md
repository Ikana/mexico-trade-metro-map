# Feature Specification: Trade Metro Map V1

**Feature Branch**: `001-trade-metro-map-v1`
**Created**: 2026-03-19
**Status**: Draft
**Input**: User description: "First version of the Mexico Trade Metro Map — a subway-style schematic visualization of Mexico's land trade corridors with research-backed data"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Static Schematic Map (Priority: P1)

A user (logistics operator, investor, policymaker, or journalist) opens
the map as an SVG or PDF and immediately grasps the structure of
Mexico's major trade corridors. Trade routes appear as color-coded
"metro lines," cities and border crossings appear as "stations," and
station size reflects relative trade volume. The user can identify the
highest-volume corridor (Línea Roja / NAFTA Spine through Laredo) at a
glance and trace how it connects to other routes through hub stations
like CDMX and Monterrey.

**Why this priority**: The core value proposition is the map itself.
Without a legible, publication-quality static map, nothing else matters.
This is the MVP that can be shared, printed, embedded in slide decks,
and published.

**Independent Test**: Print or display the SVG/PDF. A person unfamiliar
with Mexico trade should be able to answer "Which is the busiest trade
corridor?" and "How do goods move from Manzanillo to the US border?"
within 30 seconds of looking at the map.

**Acceptance Scenarios**:

1. **Given** the rendered map, **When** a user looks at it for the first
   time, **Then** they can identify at least 3 distinct trade corridors
   by color and name within 30 seconds
2. **Given** the rendered map, **When** a user compares station sizes,
   **Then** Laredo/Nuevo Laredo appears visually largest, followed by
   CDMX and Monterrey, reflecting their trade volume rankings
3. **Given** the rendered map, **When** a user reads station labels,
   **Then** city names appear in Spanish and the legend is bilingual
   (Spanish/English)
4. **Given** the rendered map at poster size (A2/A1), **When** printed,
   **Then** all text remains legible and lines remain crisp (vector
   quality, no rasterization artifacts)

---

### User Story 2 - Explore Interactive Web Map (Priority: P2)

A user opens the interactive web version of the map in a browser. They
can hover over a station to see a tooltip with key trade statistics
(e.g., "Laredo/Nuevo Laredo — $339B trade value, 5.8M truck
crossings/yr"). They can hover over a line to see corridor-level stats.
The map is responsive and works on both desktop and mobile screens.

**Why this priority**: The interactive version adds depth — it lets
users explore the data behind the visualization. But it depends on the
static map design being complete first (same layout, same visual
language).

**Independent Test**: Open the web version in a browser. Hover over
Laredo station and verify the tooltip shows trade value and truck
crossing count with source attribution. Hover over the Línea Verde line
and verify it shows Manzanillo port container volume.

**Acceptance Scenarios**:

1. **Given** the web map is loaded, **When** a user hovers over any
   station, **Then** a tooltip displays the station name, trade value
   (USD), and primary freight mode with source citation
2. **Given** the web map is loaded, **When** a user hovers over any
   line, **Then** a tooltip displays the corridor name, primary
   commodities, and volume metrics
3. **Given** a mobile device (< 768px width), **When** the user taps a
   station, **Then** the tooltip appears without obscuring the map
   layout
4. **Given** the web map, **When** a user views it, **Then** a data
   attribution footer shows all source datasets and their vintage year

---

### User Story 3 - Access Underlying Data (Priority: P3)

A researcher or data journalist wants to verify the numbers behind the
map or build their own analysis. They can access the project's curated
dataset — cleaned, structured, and documented — with full provenance
tracing every figure back to its primary source.

**Why this priority**: Fulfills the constitution's Data Provenance and
Reproducibility principles. Makes the project credible for professional
and academic use. But it adds no visual value to the map itself.

**Independent Test**: Download the data files. Pick any station's trade
value from the map and trace it through the data dictionary back to the
original BTS or ARTF source record.

**Acceptance Scenarios**:

1. **Given** the published data files, **When** a researcher opens the
   data dictionary, **Then** every column has a description, unit, and
   source reference
2. **Given** any trade figure on the map, **When** a user traces it to
   the raw data, **Then** the original source file, dataset name, and
   access date are documented
3. **Given** the data transformation scripts, **When** a user runs them
   against the raw data, **Then** the output matches the published
   derived data files exactly

---

### Edge Cases

- What happens when a data source has not been updated for the current
  year? Display the most recent available year and annotate the data
  vintage on the map (e.g., "ARTF 2024")
- How does the map handle corridors with no reliable volume data? Show
  the line with a dashed style and annotate "data pending" rather than
  omitting the corridor entirely
- What happens when two sources disagree on a figure (e.g., BTS vs
  state-level data)? Use the primary federal source (BTS/ARTF) and note
  the discrepancy in the data dictionary
- How does the map handle the emerging Green Corridors Guideway (under
  construction)? Show it as a dashed/planned line with a distinct
  annotation, separate from operational corridors

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The map MUST display at least 8 trade corridors as
  color-coded lines, each with a distinct name and color as defined in
  the project brief
- **FR-002**: The map MUST display stations (cities, ports, border
  crossings) sized proportionally to their trade volume, with at least
  three visual tiers: mega hub, major hub, standard station
- **FR-003**: The map MUST use schematic (non-geographic) layout that
  prioritizes readability over geographic accuracy
- **FR-004**: Station labels MUST appear in Spanish; the legend and any
  explanatory text MUST be bilingual (Spanish/English)
- **FR-005**: The static map MUST be available as SVG (scalable) and PDF
  (print-ready at A2 or larger)
- **FR-006**: Every data point displayed on the map MUST trace to a
  cited primary source with dataset name, year, and access date
- **FR-007**: The interactive web version MUST show station-level and
  corridor-level statistics on hover/tap with source attribution
- **FR-008**: The interactive web version MUST be responsive, supporting
  viewports from 375px (mobile) to 2560px (large desktop)
- **FR-009**: A curated, documented dataset MUST be published alongside
  the map, with a data dictionary and provenance metadata
- **FR-010**: The map MUST include a visible data-vintage annotation
  showing the year(s) of the underlying data
- **FR-011**: The map MUST show the emerging/planned Green Corridors
  Guideway as a visually distinct planned line (dashed or similar)
- **FR-012**: Visual weight (line thickness) MUST encode relative
  freight volume so that higher-volume corridors appear thicker

### Key Entities

- **Trade Corridor (Line)**: A named freight route connecting multiple
  stations. Attributes: name (Spanish), name (English), color, primary
  transport mode (truck/rail/both), total trade value, primary
  commodities, operational status (active/planned)
- **Station**: A city, port, or border crossing on one or more
  corridors. Attributes: name (Spanish), name (English), country
  (MX/US), type (city/port/border-crossing), trade value (USD), truck
  crossings per year (if border), container volume TEU (if port), hub
  tier (mega/major/standard). Border-crossing stations appear as a
  single combined station with both city names (e.g.,
  "Laredo / Nuevo Laredo"), not as two separate linked stations
- **Data Source**: A reference to an authoritative dataset. Attributes:
  name, issuing authority, URL, access date, data year, geographic
  coverage
## Trade Corridors & Data *(mandatory)*

### Lines (Research-Backed)

| # | Color | Name (ES) | Name (EN) | Key Stations | Trade Volume / Evidence |
|---|-------|-----------|-----------|--------------|------------------------|
| 1 | Red | Línea Roja | NAFTA Spine | Monterrey → Saltillo → SLP → Nuevo Laredo/Laredo | Laredo = $339B trade (2024), 5.8M truck crossings/yr, ~40% of all US-MX freight. Source: BTS Transborder 2025, Laredo EDC |
| 2 | Blue | Línea Azul | Bajío Express | Querétaro → Celaya → Irapuato → León → Aguascalientes | Mexico's auto heartland: 3.99M vehicles produced nationally (2024, record), 87% exported. Querétaro = 80+ aerospace firms. Source: AMIA, Co-Production Intl |
| 3 | Green | Línea Verde | Pacific Gateway | Guadalajara → Manzanillo | Manzanillo = ~3.9M TEU (2025), Mexico's #1 container port 20+ yrs, handles 66% of import cargo. $3B expansion to 10M TEU by 2030. Source: Contecon, Mexico Business News |
| 4 | Yellow | Línea Amarilla | Gulf Corridor | Reynosa/McAllen → Matamoros/Brownsville | Gulf Coast maquiladora belt: textiles, electronics, medical devices. Lower wait times than Laredo, rapidly expanding. Source: BTS Border Crossing Data 2025 |
| 5 | Purple | Línea Morada | Interoceanic | Coatzacoalcos (Gulf) ↔ Salina Cruz (Pacific) | Isthmus of Tehuantepec, 87.7% complete, full ops expected June 2026. Hyundai Glovis pilot: 900 vehicles crossed in ~9 hrs by rail. Source: BNamericas, Automotive Logistics |
| 6 | Orange | Línea Naranja | Western Border | Tijuana → Tecate → Mexicali → Nogales | CA/AZ maquiladora belt. Nogales = seasonal agriculture powerhouse. Source: BTS Border Crossing Data 2025 |
| 7 | White | Línea Blanca | El Paso Corridor | Cd. Juárez ↔ El Paso → Chihuahua | $105.6B trade (2024), ~19% of TX cross-border commerce. 300+ maquiladoras, 300K+ workers. ~994K commercial crossings/yr. Source: PDN Uno, TxDOT |
| 8 | Brown | Línea Café | Central Spine | CDMX → Toluca → Puebla → Veracruz | National distribution hub. CPKC Puerta México intermodal (Toluca). Ferrosur rail to Gulf via Puebla-Veracruz. Source: CPKC, Ferrosur |
| 9 | Blue-White (dashed) | Corredor Verde | Green Corridors Guideway | Nuevo León → Colombia Bridge (Laredo) | Under construction. Separates freight from passenger rail. Expected +40% capacity. Source: Mexico Business News |

### Station Tiers (by trade volume)

**Mega Hubs** (largest visual weight):
- Laredo/Nuevo Laredo — $339B trade, #1 US inland port (BTS 2025)
- CDMX — National distribution hub, largest consumption market
- Monterrey — Industrial nerve center of northern Mexico

**Major Hubs**:
- El Paso/Cd. Juárez — $105.6B trade (TxDOT 2024)
- Guadalajara — Electronics, tech manufacturing
- Querétaro — Aerospace (80+ firms) + automotive
- Manzanillo — ~3.9M TEU, #1 container port (2025)
- Brownsville/Matamoros — Gulf access, expanding port

**Standard Stations**:
- Saltillo, San Luis Potosí, Aguascalientes, León, Celaya
- Nogales, Tijuana, Mexicali, Reynosa/McAllen
- Puebla, Toluca, Veracruz, Lázaro Cárdenas
- Coatzacoalcos, Salina Cruz, Chihuahua

### Data Sources

| Source | Authority | Coverage | URL |
|--------|-----------|----------|-----|
| Transborder Freight Data 2025 | BTS (US DOT) | US-MX total trade by mode | https://www.bts.gov/newsroom/transborder-freight-data-annual-report-2025-0 |
| Border Crossing/Entry Data | BTS / CBP | Port-level truck/rail crossings | https://data.bts.gov/stories/s/jswi-2e7b |
| Port Laredo Trade Data | Laredo EDC | Laredo trade value, crossings | https://www.laredoedc.org/site-selection/international-trade/ |
| El Paso Border Data | PDN Uno / TxDOT | El Paso commercial crossings | https://pdnuno.com/data/crossings/cargo-trucks |
| Manzanillo Port Volumes | Contecon / WorldCargo News | Container TEU throughput | https://www.worldcargonews.com/ports-terminals/2026/01/manzanillo-handles-almost-4m-teu-in-2025/ |
| CIIT Status | BNamericas / Automotive Logistics | Interoceanic corridor completion | https://www.automotivelogistics.media/supply-chain/mexicos-interoceanic-corridor-of-the-isthmus-of-tehuantepec-set-for-completion-in-2026/2586327 |
| Mexico Auto Production | AMIA / Tecma | Vehicle production by region | https://www.tecma.com/record-vehicle-output-highlights-strength-of-mexicos-automotive-manufacturing-regions/ |
| Bajío Manufacturing | Co-Production Intl | Aerospace/auto firms by state | https://www.co-production.net/manufacturing-in-mexico/strategic-manufacturing-locations/el-bajio-mexico.html |
| Rail Tonnage | ARTF (Mexico) | Tonnage by corridor | Via ARTF annual reports |
| Highway Traffic | SCT/SICT Mexico | Highway traffic counts | Via SCT statistical yearbook |
| Rail Network | Ferromex / CPKC | Rail maps, freight volumes | Operator publications |

### Headline Statistics (for map annotation)

- US-Mexico freight: **$872.8B** in 2025, up 3.9% YoY (BTS 2025)
- **73.6%** by truck, **10.9%** by rail (BTS 2025)
- Mexico surpassed China as **#1 US trade partner** in 2023 (US Census)
- Laredo handles **~40%** of all US-MX freight (BTS/Laredo EDC)
- Mexico produced **3.99M vehicles** in 2024, a record (AMIA)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 8 out of 10 first-time viewers can identify the busiest
  trade corridor and at least 2 other corridors within 30 seconds of
  seeing the static map
- **SC-002**: Every data point on the map can be traced to a primary
  source within the published data dictionary in under 2 minutes
- **SC-003**: The static map renders legibly at both screen resolution
  and A2 print size without loss of quality
- **SC-004**: The interactive version loads in under 3 seconds on a
  standard broadband connection and displays tooltips within 200ms of
  hover
- **SC-005**: A domain expert (logistics/trade professional) reviewing
  the map finds zero factual errors in corridor routing, station
  placement, or cited statistics
- **SC-006**: The curated dataset can be regenerated from raw source
  files using the documented transformation steps, producing identical
  output

## Clarifications

### Session 2026-03-19

- Q: How should heterogeneous volume metrics (USD, TEU, qualitative) be normalized for station sizing? → A: Use fixed editorial tiers (mega/major/standard) as curated in the spec; no cross-metric mathematical normalization.
- Q: Should border crossings appear as one combined station or two linked stations? → A: Single combined station with both city names (e.g., "Laredo / Nuevo Laredo").
- Q: Where should the interactive web version be hosted? → A: Static site (GitHub Pages or similar), no backend required. Data baked in at build time.

## Assumptions

- The map covers land-based trade only (truck and rail); air and
  maritime are out of scope except where ports serve as corridor
  endpoints (Manzanillo, Veracruz, Lázaro Cárdenas)
- Station sizing uses fixed editorial tiers (mega/major/standard) as
  curated in the Trade Corridors & Data section, not mathematical
  normalization across heterogeneous metrics
- The schematic layout will distort geography significantly (Beck-style)
  — exact geographic positions are explicitly not a goal
- The first version targets English-speaking audiences with bilingual
  labels; a fully Spanish-language version is a future enhancement
- Data will use the most recent full-year figures available as of March
  2026 (primarily 2024-2025 data)
- The interactive web version is a static site (GitHub Pages or similar)
  with no backend; all data is baked in at build time
