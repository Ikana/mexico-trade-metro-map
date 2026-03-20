# Quickstart: Sea Routes & Corridor Interconnections

**Date**: 2026-03-19

## What Changed from V1

1. **Corridor interconnections**: Extended 4 existing corridors to share
   hub stations (CDMX, Monterrey, Guadalajara, Querétaro)
2. **3 new port stations**: Lázaro Cárdenas, Altamira, Ensenada
3. **4 maritime routes**: 2 Pacific (Asia), 2 Gulf/Atlantic (Europe, US)
4. **3 terminal regions**: → Asia, → Europe, → US East Coast
5. **Maritime visual style**: dot-dash line pattern, 2 new color pairs

## Development

```bash
git checkout 002-sea-routes-interconnect
npm install   # no new dependencies

# Edit data files, then regenerate + validate:
npm run data:transform
npm run data:validate

# Dev server:
npm run dev
```

## Verify Interconnections

After updating data files, run validation — Rule 11 now checks that
every land corridor shares at least one station with another corridor.

```bash
npm run data:validate
# Should show: ✓ Rule 11: No isolated corridors
```

## Verify Maritime Routes

Check that maritime routes render with dot-dash pattern and tooltips
show carrier/transit time info:

```bash
npm run dev
# Hover over a maritime line → should show carriers, transit times
# Hover over terminal region → should show destination port names
```

## Export

```bash
npm run export:svg    # Updated SVG with maritime routes
npm run export:pdf    # Updated A2 PDF
```
