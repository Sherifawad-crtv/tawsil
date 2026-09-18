import { cellToBoundary, gridDisk, gridDistance, latLngToCell } from "h3-js";
import type { CoveragePoint } from "../../lib/coverage";

/**
 * Lives next to the globe, not in lib/coverage, on purpose: h3-js is heavy
 * and only the globe needs it. Importing it from lib/coverage pulled it
 * into the main bundle (+68KB gz on every page) since CommandCenter
 * imports that module eagerly. Here it stays in the lazy globe chunk.
 */

/** Same h3 resolution the globe's country dots are drawn at, so coverage lands on the same grid. */
export const COVERAGE_RES = 3;

export interface CoverageCell {
  type: "Feature";
  properties: { coverage: number };
  geometry: { type: "Polygon"; coordinates: number[][][] };
}

/**
 * The footprint as one GeoJSON polygon per h3 cell, each carrying its share
 * of the heaviest cell (0..1). Fed to the globe's hexPolygons layer, a
 * cell-sized polygon tessellates to exactly its own dot, so this is how
 * individual dots get coloured on the same grid as the country dots.
 *
 * Every point spreads over its neighbours, halving per ring out, and the
 * heaviest hubs reach three rings - at ~100km a cell, that's a bloom rather
 * than a pin, which is what a coverage map is meant to show.
 */
export function coverageCells(points: CoveragePoint[], res = COVERAGE_RES): CoverageCell[] {
  const weight = new Map<string, number>();
  const heaviest = Math.max(1, ...points.map((p) => p.weight));

  for (const p of points) {
    const origin = latLngToCell(p.lat, p.lng, res);
    const rings = 1 + Math.round(2 * (p.weight / heaviest));
    for (const cell of gridDisk(origin, rings)) {
      const d = gridDistance(origin, cell);
      weight.set(cell, (weight.get(cell) ?? 0) + p.weight * Math.pow(0.5, d));
    }
  }

  const top = Math.max(1, ...weight.values());
  return [...weight].map(([cell, w]) => ({
    type: "Feature",
    properties: { coverage: w / top },
    geometry: { type: "Polygon", coordinates: [cellToBoundary(cell, true)] },
  }));
}
