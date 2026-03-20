# Feature Specification: Multi-Designer Map Redesign

**Feature Branch**: `003-designer-map-redesign`
**Created**: 2026-03-20
**Status**: Draft
**Input**: Redesign the Mexico Trade Metro Explorer map using Harry Beck's PRD and reference images, incorporating design principles from iconic transit and wayfinding designers: Massimo Vignelli, Lance Wyman, Margaret Calvert & Jock Kinneir, Otl Aicher, and Edward Johnston. Use the preview channel to iterate on the visual design.

## Context & Design Vision

The Mexico Trade Metro Explorer currently renders a schematic metro-style map of Mexico's 9 land trade corridors, 4 maritime routes, and 31 stations. While functional, user feedback indicates visual clutter in high-density regions (Bajío, Central Mexico). This redesign draws on the combined legacy of six iconic transit and wayfinding designers to produce a map that is not just clearer, but a genuine piece of information design craft.

### Designer Influence Matrix

| Designer | Era & Signature Work | Principle Applied to This Map |
|----------|---------------------|-------------------------------|
| **Harry Beck** | 1931 London Underground | Octolinear geometry (0/45/90 degrees), topology over geography, even station spacing |
| **Massimo Vignelli** | 1972 NYC Subway Map | Bold geometric discipline, limited harmonious color palette, strong grid hierarchy |
| **Lance Wyman** | 1968 Mexico City Metro | Cultural pictograms per station type, vibrant color rooted in Mexican visual identity |
| **Margaret Calvert & Jock Kinneir** | 1960s UK Road Signs | Humanist sans-serif typography, information hierarchy through weight and size, intuitive wayfinding |
| **Otl Aicher** | 1972 Munich Olympics | Systematic pictogram language, strict modular grid, functional minimalism |
| **Edward Johnston** | 1916 Johnston typeface | Bespoke transit typography balancing geometric purity with organic legibility |

## Clarifications

### Session 2026-03-20

- Q: What language should station labels use on the map? → A: Spanish primary on map labels, English in tooltips on hover
- Q: What accessibility scope beyond color contrast and color-blind support? → A: Color accessibility only (WCAG AA contrast + CVD support); keyboard navigation and screen reader support deferred to future iteration

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Redesigned Schematic Map (Priority: P1)

A trade analyst opens the Mexico Trade Metro Explorer and sees the redesigned map displaying all 9 land corridors and 31 stations in a clean, octolinear layout. The map immediately communicates network topology through bold corridor colors, clearly differentiated station types, and even spacing in dense regions. The analyst can identify the NAFTA Spine, Bajio Express, and Pacific Gateway corridors at a glance without visual confusion.

**Why this priority**: The core map rendering is the foundation. Nothing else works without a clear, well-designed base map. This delivers the primary value of reduced clutter and improved clarity.

**Independent Test**: Can be fully tested by loading the application and visually confirming that all corridors render with octolinear angles, stations are evenly spaced, and the layout is legible without zooming or panning.

**Acceptance Scenarios**:

1. **Given** the user loads the map, **When** all corridors render, **Then** every route segment uses only horizontal (0 degrees), vertical (90 degrees), or diagonal (45 degrees) angles with no arbitrary curves or organic paths
2. **Given** the Bajio region contains 5+ stations in close proximity, **When** the map renders, **Then** stations are evenly spaced on the grid with no overlapping labels
3. **Given** the user views the full map, **When** they scan for a specific corridor, **Then** each of the 9 corridors is distinguishable by a bold, unique color within 2 seconds of looking
4. **Given** interchange stations (CDMX, Monterrey, Guadalajara), **When** displayed, **Then** they are visually distinct from standard stations using larger interchange markers

---

### User Story 2 - Identify Station Types Through Visual Hierarchy (Priority: P1)

A logistics manager needs to quickly distinguish between border crossings, ports, cities, and terminal regions on the map. Each station type is represented by a distinct visual symbol inspired by Aicher's pictogram system and Wyman's cultural iconography, making the map self-explanatory without needing to consult a legend.

**Why this priority**: Station type differentiation is essential for the map to communicate meaningful trade infrastructure information. Ports vs. border crossings vs. inland hubs serve fundamentally different roles.

**Independent Test**: Can be tested by asking users to identify station types without a legend and measuring accuracy.

**Acceptance Scenarios**:

1. **Given** a border crossing station (e.g., Laredo), **When** displayed, **Then** it uses a distinct border-crossing symbol that differs from city and port symbols
2. **Given** a port station (e.g., Manzanillo), **When** displayed, **Then** it uses a port-specific symbol distinguishable from other station types
3. **Given** a mega-tier station (Laredo, CDMX, Monterrey), **When** displayed, **Then** it renders at a noticeably larger scale than major and standard tier stations
4. **Given** terminal regions (Asia, Europe, US East Coast), **When** displayed, **Then** they are visually distinct as off-map destinations, not inline stations

---

### User Story 3 - Read Typography and Labels Clearly (Priority: P1)

A government official reviews the map and can read all station names, corridor labels, and data callouts without straining. Typography follows a clear hierarchy: map title, corridor names, mega-hub labels, standard station labels, each at a distinct size and weight. Labels align with the octolinear grid (horizontal or 45 degrees) and never overlap or clip.

**Why this priority**: Typography is the primary information carrier on any transit map. If labels are unreadable or overlapping, the map fails its core purpose regardless of how well the geometry works.

**Independent Test**: Can be tested by rendering the map at standard viewport sizes and verifying no label overlaps, all text is legible, and hierarchy is apparent.

**Acceptance Scenarios**:

1. **Given** the map renders at 1280x800 resolution, **When** all labels display, **Then** no two labels overlap or clip each other
2. **Given** station labels, **When** rendered, **Then** they align horizontally or at 45 degrees consistent with the octolinear grid
3. **Given** the typography hierarchy, **When** the user scans the map, **Then** they can distinguish at least 3 levels: title, corridor/hub names, and standard station names through font size and weight differences
4. **Given** a clean sans-serif typeface is used, **When** rendered, **Then** the font conveys geometric precision in the Johnston/Calvert tradition while remaining highly legible at small sizes

---

### User Story 4 - Navigate Maritime Routes Distinctly from Land Corridors (Priority: P2)

An economist studying trade flows can visually separate the 4 maritime shipping routes from the 9 land corridors. Maritime routes use a distinctive rendering style (dot-dash pattern) and connect to port stations and terminal regions, making ocean vs. land transport immediately obvious.

**Why this priority**: Maritime routes are a secondary data layer. They must be present but not compete visually with the primary land corridor network.

**Independent Test**: Can be tested by verifying maritime routes render with a distinct line style and connect only to port/terminal nodes.

**Acceptance Scenarios**:

1. **Given** the map displays maritime routes, **When** rendered alongside land corridors, **Then** maritime routes use a visually distinct dot-dash line style
2. **Given** maritime routes, **When** the user scans the map, **Then** they can distinguish ocean routes from land corridors within 1 second based on line style alone
3. **Given** maritime routes connect to terminal regions (Asia, Europe, US East Coast), **When** rendered, **Then** these connections extend to the map edge or to clearly marked off-map indicators

---

### User Story 5 - Interact with Stations and Corridors (Priority: P2)

A trade analyst hovers over or clicks on a station to see detailed trade data (trade value, commodities, truck crossings) in a tooltip. The interaction preserves existing functionality but adapts visually to the new design language. Tooltips match the redesigned aesthetic with the same typography and color discipline.

**Why this priority**: Interactivity is the differentiator between a static diagram and an explorer tool. It must work seamlessly with the new visual design.

**Independent Test**: Can be tested by hovering over each station type and corridor, verifying tooltips appear with correct data and consistent styling.

**Acceptance Scenarios**:

1. **Given** the user hovers over a station, **When** the tooltip appears, **Then** it displays the English station name (nameEn), type, trade value, and primary commodities
2. **Given** the user hovers over a corridor line, **When** the tooltip appears, **Then** it shows corridor name, primary mode, and trade value
3. **Given** the redesigned map aesthetic, **When** tooltips render, **Then** they use the same sans-serif typeface and color palette as the map

---

### User Story 6 - View Map with Cultural Color Identity (Priority: P3)

The map's color palette is informed by Mexican visual culture (drawing from Lance Wyman's Mexico 68 identity) while maintaining the functional clarity required by Vignelli's color discipline. Colors are bold, saturated, and culturally resonant, not generic transit pastels.

**Why this priority**: Color palette is important for identity and differentiation but can be iterated after the structural layout is established.

**Independent Test**: Can be tested by comparing the palette against WCAG contrast requirements and verifying cultural color references.

**Acceptance Scenarios**:

1. **Given** the 9 corridor colors, **When** displayed on the map background, **Then** each color passes WCAG AA contrast ratio (4.5:1 minimum) against the background
2. **Given** the color palette, **When** viewed as a set, **Then** no two corridor colors are confusable by users with common color vision deficiencies (deuteranopia, protanopia)
3. **Given** the overall color scheme, **When** the map is viewed, **Then** the palette evokes Mexican visual identity with warm, saturated tones rather than generic corporate or transit pastels

---

### Edge Cases

- What happens when the viewport is narrower than 768px? Labels should reflow or abbreviate to avoid overlap, maintaining legibility on tablet-sized screens.
- How does the map handle a corridor with only 2 stations? It should still render as a complete, styled line segment with proper terminus markers.
- What if a station belongs to 4+ corridors? The interchange marker must accommodate visual indication of all connecting lines without becoming cluttered.
- How are planned/dashed corridors (Corredor Verde) distinguished from active ones? Planned corridors render with a dashed line style distinct from both solid land corridors and dot-dash maritime routes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The map MUST render all trade route segments using only horizontal (0 degrees), vertical (90 degrees), and diagonal (45 degrees) angles with no curves, arcs, or arbitrary angles
- **FR-002**: The map MUST display all 31 stations from the existing dataset with distinct visual symbols for each station type (city, port, border-crossing, terminal-region)
- **FR-003**: The map MUST render all 9 land corridors with distinct bold colors, each identifiable at a glance
- **FR-004**: The map MUST render all 4 maritime routes with a dot-dash line style visually distinct from land corridors
- **FR-005**: Station labels MUST display Spanish names (nameEs) on the map using a clean sans-serif typeface, aligned horizontally or at 45 degrees to match the octolinear grid
- **FR-006**: No station labels or corridor labels MUST overlap at the default viewport size (1280x800)
- **FR-007**: Interchange stations (stations served by 2+ corridors) MUST be visually distinct from single-corridor stations using larger or compound markers
- **FR-008**: Station visual size MUST reflect the tier hierarchy: mega > major > standard
- **FR-009**: The map background MUST use a clean, light background (off-white or light cream) to maximize contrast
- **FR-010**: The map MUST maintain a consistent grid-based spacing system, with evenly distributed stations in dense regions (Bajio, Central Mexico)
- **FR-011**: Existing interactive features (hover tooltips, data display) MUST continue to function with the redesigned map elements
- **FR-012**: The map MUST include a legend identifying corridor colors, station type symbols, and line style meanings (solid for land, dot-dash for maritime, dashed for planned)
- **FR-013**: Typography MUST establish a clear hierarchy with at least 3 distinct levels (title, corridor/hub labels, standard station labels) differentiated by size and weight
- **FR-014**: The color palette MUST meet WCAG AA contrast requirements (4.5:1) for all corridor colors against the map background
- **FR-015**: The color palette MUST be distinguishable by users with common color vision deficiencies (support deuteranopia and protanopia)
- **FR-016**: The map MUST use pictogram-style symbols for station types, inspired by Aicher/Wyman pictogram systems, that communicate function without text
- **FR-017**: The map MUST render planned corridors (status: "planned") with a dashed line style distinct from active corridors and maritime routes
- **FR-018**: Terminal regions (Asia, Europe, US East Coast) MUST render as off-map destination indicators at the map periphery

### Key Entities

- **Station**: A trade location on the map, characterized by type (city/port/border-crossing/terminal-region), tier (mega/major/standard), grid position, and associated trade data
- **Corridor**: A named trade route connecting an ordered sequence of stations, characterized by color, line weight, transport mode, and active/planned status
- **Maritime Route**: An ocean shipping lane connecting ports to international terminal regions, characterized by dot-dash line style, ocean (Pacific/Gulf), and transit time
- **Interchange**: A station where 2+ corridors intersect, visually distinguished as a network junction point
- **Design Token**: A configurable visual parameter (color, size, spacing, font) that encodes the multi-designer aesthetic and can be adjusted during preview iteration

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify any specific trade corridor on the map within 3 seconds of viewing (down from current baseline)
- **SC-002**: Users can correctly identify station types (port, border crossing, city) without consulting a legend with 85%+ accuracy
- **SC-003**: No label overlaps exist at viewports of 1280x800 or larger
- **SC-004**: All 9 corridor colors pass WCAG AA contrast ratio (4.5:1) against the background
- **SC-005**: All 9 corridor colors remain distinguishable under simulated deuteranopia and protanopia conditions
- **SC-006**: The Bajio/Central Mexico region shows at least 30% more visual whitespace between stations compared to the current layout
- **SC-007**: 90% of test users rate the redesigned map as "clearer" or "much clearer" than the current version in A/B comparison
- **SC-008**: All existing interactive features (tooltips, data display, export) continue to function without regression
- **SC-009**: The map loads and renders completely within 2 seconds on standard hardware
- **SC-010**: The map renders correctly across modern browsers (Chrome, Firefox, Safari, Edge, latest 2 versions)

## Assumptions

- The existing dataset (31 stations, 9 corridors, 4 maritime routes) will not change during this redesign. This is purely a visual/rendering update
- The schematic grid coordinates in stations.json may need adjustment to achieve proper octolinear layout, and such coordinate changes are in scope
- The existing D3.js/SVG rendering pipeline will be retained and enhanced, not replaced
- The preview channel will be used for iterative visual refinement during implementation
- Typography will use a web-safe or freely available sans-serif font (e.g., Inter, Work Sans, or similar) that channels the Johnston/Calvert spirit without requiring proprietary font licenses
- Color-blind accessibility testing will use simulated filters, not clinical testing
- Accessibility scope is limited to color contrast (WCAG AA) and color vision deficiency support; keyboard navigation, ARIA/screen reader support, and reduced-motion preferences are out of scope for this iteration
- The six designer influences serve as aesthetic direction, not literal replication. The goal is a synthesis that serves the Mexico trade use case
