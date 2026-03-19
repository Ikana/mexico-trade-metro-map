# BRIEF: Mexico Trade Metro Map

## Vision
A subway/metro-style schematic map of Mexico's land trade corridors. Think London Tube map, but for freight: lines represent major trade routes, stations represent cities/ports/border crossings, and station size reflects trade volume. The map should make Mexico's trade infrastructure instantly legible to anyone, from logistics operators to investors to policymakers.

## Inspiration
- **Wallenius Wilhelmsen Ocean trade maps** by Cameron Booth (transitmap.net): subway-style shipping route maps commissioned by a global shipping company. Exactly this concept, but for maritime routes. See: https://www.walleniuswilhelmsen.com/what-we-do/ocean-transportation/trade-maps
- **London Underground map** (Harry Beck, 1931): the original schematic transit map that sacrificed geographic accuracy for clarity

## Scope
- **Geography:** Mexico + US border crossings (the full trade picture)
- **Mode:** Land-based: trucking corridors and rail lines
- **Data era:** Current (2024-2025 data)
- **Output:** SVG/PDF poster-quality map, plus a web-interactive version

## Proposed "Lines" (Trade Routes)

### Primary Lines (highest volume)
1. 🔴 **Línea Roja / The NAFTA Spine** : Monterrey - Nuevo Laredo/Laredo
   - The #1 corridor. Laredo = $339B in total trade (2024). 2.6M+ truck crossings/year
   - Extends south through Saltillo to San Luis Potosí

2. 🔵 **Línea Azul / Bajío Express** : Querétaro - Celaya - Irapuato - León - Aguascalientes
   - Auto/aerospace manufacturing triangle
   - Connects to Hwy 57 (north to Laredo) and Hwy 45D (north to El Paso)
   - Ferromex + CPKC intermodal services

3. 🟢 **Línea Verde / Pacific Gateway** : Guadalajara - Manzanillo
   - Asia-facing trade. Manzanillo = Mexico's busiest container port
   - Electronics, auto parts, consumer goods

4. 🟡 **Línea Amarilla / Gulf Corridor** : Matamoros - Brownsville + Reynosa - McAllen
   - Gulf Coast workhorse, textiles, electronics, medical devices
   - Lower wait times than Laredo, expanding fast

5. 🟣 **Línea Morada / Interoceanic** : Coatzacoalcos (Gulf) - Salina Cruz (Pacific)
   - The Isthmus of Tehuantepec corridor, Mexico's "canal alternative"
   - Rail + highway modernization underway
   - Breakbulk alternative to Panama Canal

### Secondary Lines
6. 🟠 **Línea Naranja / Frontera Oeste** : Tijuana - Tecate - Mexicali - Nogales
   - California/Arizona crossings, maquiladora belt
   - Nogales = seasonal agriculture powerhouse (table grapes, produce)

7. ⚪ **Línea Blanca / El Paso Corridor** : Ciudad Juárez - El Paso
   - $73B+ freight value, strong auto/electronics presence
   - Connects south through Chihuahua

8. 🟤 **Línea Café / Central Spine** : CDMX hub radiating outward
   - The hub connecting all other lines
   - Toluca intermodal terminal (CPKC's Puerta México)
   - CDMX - Puebla - Veracruz (Gulf port access via Ferrosur)

### Emerging/Planned
9. 🔵⚪ **Green Corridors Guideway** : Nuevo León - Colombia Bridge (Laredo)
   - Under construction, separating freight from passenger rail
   - Expected to boost capacity ~40%

## Key "Stations" (sized by trade volume)

### Mega Hubs (largest)
- **Laredo/Nuevo Laredo** : $339B trade, #1 US inland port
- **CDMX** : national distribution hub, largest consumption market
- **Monterrey** : industrial nerve center of northern Mexico

### Major Hubs
- **Guadalajara** : electronics + tech manufacturing
- **Querétaro** : aerospace (Bombardier, GE) + auto
- **El Paso/Cd. Juárez** : $73B freight
- **Manzanillo** : #1 container port (Pacific)
- **Brownsville/Matamoros** : Gulf access + expanding port

### Standard Stations
- Saltillo, San Luis Potosí, Aguascalientes, León, Celaya
- Nogales, Tijuana, Mexicali, Reynosa/McAllen
- Puebla, Toluca, Veracruz, Lázaro Cárdenas
- Coatzacoalcos, Salina Cruz

## Data Sources
- **BTS Transborder Freight Data** (2025): https://data.bts.gov/stories/s/kijm-95mr
  - US-Mexico freight: $872.8B in 2025, up 3.9% YoY
  - 73.6% by truck, 10.9% by rail
- **BTS Border Crossing Data**: https://data.bts.gov/stories/s/jswi-2e7b
  - Port-level truck/rail container crossings
- **ARTF (Mexico rail regulator)**: tonnage by corridor
  - Foreign trade = 76% of total rail tonnage
- **SCT/SICT Mexico**: highway traffic counts, corridor data
- **Ferromex / CPKC (ex-KCS Mexico)**: rail network maps and freight volumes

## Design Principles
1. **Schematic, not geographic**: Distort geography for clarity (like Beck's Tube map)
2. **Volume = visual weight**: Bigger stations = more trade. Thicker lines = more freight
3. **Bilingual**: Station names in Spanish, legend bilingual
4. **Color-coded by corridor**, not by mode (truck vs rail share shown as a secondary layer)
5. **Border crossings as "interchanges"**: where Mexico lines connect to US lines
6. **Clean enough for a slide deck**, detailed enough for a wall poster

## Technical Approach
- **Phase 1**: Data collection + route validation (BTS data, ARTF, SCT)
- **Phase 2**: Schematic layout design (SVG, possibly D3.js for interactive version)
- **Phase 3**: Visual design + polish (colors, typography, bilingual labels)
- **Phase 4**: Interactive web version (hover for stats, click for corridor details)

## Why This Matters
- **Nearshoring is exploding**: Mexico surpassed China as #1 US trade partner in 2023
- **No one has made this visualization**: existing maps are either geographic (hard to read) or text-based (boring)
- **Perfect for Desteia**: US-Mexico supply chain is literally the company's domain
- **Multiple audiences**: logistics operators, investors, policymakers, media

## References
- Wallenius Wilhelmsen trade maps: https://www.walleniuswilhelmsen.com/what-we-do/ocean-transportation/trade-maps
- Cameron Booth / Transit Maps: https://transitmap.net/project-wallenius-wilhelmsen/
- BNSF Mexico network: https://www.bnsf.com/ship-with-bnsf/maps-and-shipping-locations/mexico/network-map.html
- BTS 2025 Transborder Report: https://www.bts.gov/newsroom/transborder-freight-data-annual-report-2025-0
- NovaLink trade routes guide: https://novalinkmx.com/2025/06/12/trade-routes-in-mexico/
- Mexico infrastructure 2026: https://www.thenearshorecompany.com/mexicos-infrastructure-boom-projects-2026/
- Interoceanic Corridor: https://www.morethanshipping.com/a-new-land-bridge-era-begins-mexicos-interoceanic-corridor/

---
*March 2026*
