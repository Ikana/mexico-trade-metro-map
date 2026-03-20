# Quickstart: Multi-Designer Map Redesign

**Feature**: 003-designer-map-redesign

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
cd /Users/roderik/Code/mexico-trade-metro-map
npm install
```

## Development

```bash
# Start dev server with hot reload
npm run dev
# → Opens at http://localhost:5173

# Transform raw data to processed JSON
npm run data:transform

# Validate data files
npm run data:validate
```

## Key Files to Modify

| File | Purpose | Priority |
|------|---------|----------|
| `data/processed/stations.json` | Update x,y coordinates for octolinear layout | P0 |
| `src/map/styles.ts` | Refactor to DesignTokens system, new palette, Inter font | P0 |
| `src/map/renderer.ts` | Pictogram symbols, label placement engine | P1 |
| `src/map/legend.ts` | Update legend for new symbols + line styles | P1 |
| `src/interactive/tooltips.ts` | English names in tooltip header, styled typography | P2 |
| `index.html` | Add Inter font import | P0 |

## Preview Workflow

Use the Claude Preview channel to iterate on visual design:

1. Start dev server (`npm run dev`)
2. Open preview at localhost:5173
3. Modify design tokens in `styles.ts`
4. Preview auto-reloads via Vite HMR
5. Screenshot and compare against reference images in `references/Harry Beck/`

## Verification

```bash
# Build production bundle
npm run build

# Export SVG for print review
npm run export:svg

# Export PDF
npm run export:pdf

# Run tests
npm test
```

## Reference Materials

- Harry Beck PRD: `references/Harry Beck/product_requirements_document.md`
- Dashboard mockup: `references/Harry Beck/mexico_trade_metro_map_dashboard.png`
- Explorer mockup: `references/Harry Beck/mexico_trade_metro_explorer.png`
