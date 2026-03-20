import type { Station, DesignTokens, LabelPlacement } from "../types/index.ts";

/**
 * Label placement engine for zero-overlap typography.
 *
 * 8 candidate positions per station (N, NE, E, SE, S, SW, W, NW).
 * Priority order: E → W → NE → SE → NW → SW → N → S.
 * Processes stations in tier-descending order (mega first).
 * Collision detection via bounding box intersection.
 */

type Direction = "E" | "W" | "NE" | "SE" | "NW" | "SW" | "N" | "S";

const PRIORITY_ORDER: Direction[] = ["E", "W", "NE", "SE", "NW", "SW", "N", "S"];

const TIER_ORDER: Record<string, number> = { mega: 0, major: 1, standard: 2 };

interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Average character width multiplier per font size for Inter */
const CHAR_WIDTH_FACTOR = 0.55;

function estimateTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * CHAR_WIDTH_FACTOR;
}

function estimateTextHeight(fontSize: number): number {
  return fontSize * 1.2;
}

function bboxesOverlap(a: BBox, b: BBox, padding: number = 2): boolean {
  return !(
    a.x + a.width + padding < b.x ||
    b.x + b.width + padding < a.x ||
    a.y + a.height + padding < b.y ||
    b.y + b.height + padding < a.y
  );
}

function getCandidatePosition(
  cx: number,
  cy: number,
  offset: number,
  textWidth: number,
  textHeight: number,
  direction: Direction,
): { x: number; y: number; rotation: 0; anchor: "start" | "middle" | "end"; bbox: BBox } {
  const halfH = textHeight / 2;

  switch (direction) {
    case "E":
      return {
        x: cx + offset,
        y: cy + halfH * 0.5,
        rotation: 0,
        anchor: "start",
        bbox: { x: cx + offset, y: cy - halfH, width: textWidth, height: textHeight },
      };
    case "W":
      return {
        x: cx - offset,
        y: cy + halfH * 0.5,
        rotation: 0,
        anchor: "end",
        bbox: { x: cx - offset - textWidth, y: cy - halfH, width: textWidth, height: textHeight },
      };
    case "NE":
      return {
        x: cx + offset * 0.7,
        y: cy - offset * 0.5,
        rotation: 0,
        anchor: "start",
        bbox: { x: cx + offset * 0.7, y: cy - offset * 0.5 - textHeight, width: textWidth, height: textHeight },
      };
    case "SE":
      return {
        x: cx + offset * 0.7,
        y: cy + offset * 0.5 + textHeight,
        rotation: 0,
        anchor: "start",
        bbox: { x: cx + offset * 0.7, y: cy + offset * 0.5, width: textWidth, height: textHeight },
      };
    case "NW":
      return {
        x: cx - offset * 0.7,
        y: cy - offset * 0.5,
        rotation: 0,
        anchor: "end",
        bbox: { x: cx - offset * 0.7 - textWidth, y: cy - offset * 0.5 - textHeight, width: textWidth, height: textHeight },
      };
    case "SW":
      return {
        x: cx - offset * 0.7,
        y: cy + offset * 0.5 + textHeight,
        rotation: 0,
        anchor: "end",
        bbox: { x: cx - offset * 0.7 - textWidth, y: cy + offset * 0.5, width: textWidth, height: textHeight },
      };
    case "N":
      return {
        x: cx,
        y: cy - offset,
        rotation: 0,
        anchor: "middle",
        bbox: { x: cx - textWidth / 2, y: cy - offset - textHeight, width: textWidth, height: textHeight },
      };
    case "S":
      return {
        x: cx,
        y: cy + offset + textHeight,
        rotation: 0,
        anchor: "middle",
        bbox: { x: cx - textWidth / 2, y: cy + offset, width: textWidth, height: textHeight },
      };
  }
}

/** Abbreviate label text to first word + "..." */
function abbreviate(text: string): string {
  const firstWord = text.split(/[\s\/]/)[0];
  if (firstWord.length < text.length) {
    return firstWord + "...";
  }
  return text;
}

export function computeLabelPlacements(
  stations: Station[],
  tokens: DesignTokens,
  gridUnit: number,
  minX: number,
): LabelPlacement[] {
  const tierSizes: Record<string, number> = {
    mega: tokens.typography.sizes.mega,
    major: tokens.typography.sizes.major,
    standard: tokens.typography.sizes.standard,
  };
  const tierWeights: Record<string, number> = {
    mega: tokens.typography.weights.bold,
    major: tokens.typography.weights.semibold,
    standard: tokens.typography.weights.regular,
  };

  // Sort stations: mega first, then major, then standard
  const sorted = [...stations].sort(
    (a, b) => (TIER_ORDER[a.tier] ?? 2) - (TIER_ORDER[b.tier] ?? 2),
  );

  const placements: LabelPlacement[] = [];
  const placedBBoxes: BBox[] = [];

  // Build station bboxes indexed by station ID for efficient exclusion.
  // Account for actual symbol shape: terminal-region and port are wider than circles.
  const stationBBoxMap = new Map<string, BBox>();
  for (const s of stations) {
    const cx = tokens.spacing.padding.left + (s.x - minX) * gridUnit;
    const cy = tokens.spacing.padding.top + s.y * gridUnit;
    const r = tokens.spacing.stationRadius[s.tier] || 6;
    let halfW = r;
    let halfH = r;
    if (s.type === "terminal-region") {
      halfW = r * 1.2 + 2; // rect is wider with rx offset
      halfH = r * 1.2;
    } else if (s.type === "port" || s.type === "border-crossing") {
      halfW = r * 1.1; // diamond extends slightly beyond r
      halfH = r * 1.1;
    }
    stationBBoxMap.set(s.id, { x: cx - halfW, y: cy - halfH, width: halfW * 2, height: halfH * 2 });
  }
  const stationBBoxEntries = Array.from(stationBBoxMap.entries());

  /** Check if candidate bbox collides with any station symbol (excluding own) */
  function collidesWithStations(candidate: BBox, ownId: string): boolean {
    return stationBBoxEntries.some(
      ([id, b]) => id !== ownId && bboxesOverlap(candidate, b, 1),
    );
  }

  for (const station of sorted) {
    const cx = tokens.spacing.padding.left + (station.x - minX) * gridUnit;
    const cy = tokens.spacing.padding.top + station.y * gridUnit;
    const r = tokens.spacing.stationRadius[station.tier] || 6;
    const fontSize = tierSizes[station.tier] || tokens.typography.sizes.standard;
    const fontWeight = tierWeights[station.tier] || tokens.typography.weights.regular;
    const offset = r + tokens.spacing.labelOffset;

    let labelText = station.nameEs;
    let placed = false;

    // Try each direction in priority order
    for (const dir of PRIORITY_ORDER) {
      const textWidth = estimateTextWidth(labelText, fontSize);
      const textHeight = estimateTextHeight(fontSize);
      const candidate = getCandidatePosition(cx, cy, offset, textWidth, textHeight, dir);

      const collidesWithLabels = placedBBoxes.some((b) => bboxesOverlap(candidate.bbox, b));
      const hitsStation = collidesWithStations(candidate.bbox, station.id);

      if (!collidesWithLabels && !hitsStation) {
        placements.push({
          stationId: station.id,
          x: candidate.x,
          y: candidate.y,
          rotation: candidate.rotation,
          anchor: candidate.anchor,
          fontSize,
          fontWeight,
          labelText,
          bbox: candidate.bbox,
        });
        placedBBoxes.push(candidate.bbox);
        placed = true;
        break;
      }
    }

    // Fallback: abbreviate and retry (with full collision checks)
    if (!placed) {
      labelText = abbreviate(station.nameEs);
      for (const dir of PRIORITY_ORDER) {
        const textWidth = estimateTextWidth(labelText, fontSize);
        const textHeight = estimateTextHeight(fontSize);
        const candidate = getCandidatePosition(cx, cy, offset, textWidth, textHeight, dir);

        const collidesWithLabels = placedBBoxes.some((b) => bboxesOverlap(candidate.bbox, b));
        const hitsStation = collidesWithStations(candidate.bbox, station.id);

        if (!collidesWithLabels && !hitsStation) {
          placements.push({
            stationId: station.id,
            x: candidate.x,
            y: candidate.y,
            rotation: candidate.rotation,
            anchor: candidate.anchor,
            fontSize,
            fontWeight,
            labelText,
            bbox: candidate.bbox,
          });
          placedBBoxes.push(candidate.bbox);
          placed = true;
          break;
        }
      }
    }

    // Last resort: place at default E position (may overlap)
    if (!placed) {
      const textWidth = estimateTextWidth(labelText, fontSize);
      const textHeight = estimateTextHeight(fontSize);
      const candidate = getCandidatePosition(cx, cy, offset, textWidth, textHeight, "E");
      placements.push({
        stationId: station.id,
        x: candidate.x,
        y: candidate.y,
        rotation: candidate.rotation,
        anchor: candidate.anchor,
        fontSize,
        fontWeight,
        labelText,
        bbox: candidate.bbox,
      });
      placedBBoxes.push(candidate.bbox);
    }
  }

  return placements;
}
