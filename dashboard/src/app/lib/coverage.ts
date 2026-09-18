import type { Order } from "./types";

/**
 * Where the order book actually goes, by area. Nothing here is synthesised:
 * every waypoint on an order already carries the saved location's address
 * and coordinates, and the area is read off the address.
 */

/** The three brand blues, light to dark. Darker = more coverage, everywhere they're used. */
const BLUE_RAMP = ["#94b2fd", "#1253fa", "#0a0070"] as const;

/**
 * Colour for a share of the maximum, 0..1, on the ramp above. A plain RGB
 * lerp between three fixed stops: with only three anchors this close in hue
 * there's nothing a perceptual space would do differently that anyone
 * could see, and it keeps three.js and the SVG on the same numbers.
 */
export function blueShade(t: number) {
  const x = Math.min(1, Math.max(0, t)) * (BLUE_RAMP.length - 1);
  const i = Math.min(BLUE_RAMP.length - 2, Math.floor(x));
  const f = x - i;
  const a = hex(BLUE_RAMP[i]);
  const b = hex(BLUE_RAMP[i + 1]);
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * f));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function hex(h: string) {
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/**
 * The area of an address as this data writes it: "<area>, <governorate>",
 * sometimes with a street in front ("Industrial Zone 3, 6th of October
 * City, Giza", "Cairo-Ismailia Rd, Cairo"). Middle segment when there are
 * three; otherwise the first, unless it's a road, in which case the
 * governorate is the best area on offer.
 */
function areaOf(address: string) {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 3) return parts[parts.length - 2];
  if (parts.length === 2 && /\b(rd|road|st|street)\b/i.test(parts[0])) return parts[1];
  return parts[0] ?? "Unknown";
}

export interface AreaCoverage {
  area: string;
  /** Orders that touch this area. */
  orders: number;
  /**
   * This area's slice of all area-touches, 0..1. Not "of all orders": an
   * order from Sadat City to Amreya covers both, so per-order shares would
   * sum past 100% and a pie of them would be a lie. Across all areas these
   * sum to exactly 1.
   */
  share: number;
}

/**
 * Orders per area, largest first. An order touching an area through any
 * of its waypoints counts once for that area - a Nasr City pickup with two
 * Nasr City drop-offs is one order covering Nasr City, not three.
 */
export function coverageByArea(orders: Order[]): AreaCoverage[] {
  const counts = new Map<string, number>();
  for (const order of orders) {
    const areas = new Set(order.waypoints.map((w) => areaOf(w.address)));
    for (const area of areas) counts.set(area, (counts.get(area) ?? 0) + 1);
  }
  const touches = Math.max(1, [...counts.values()].reduce((a, b) => a + b, 0));
  return [...counts.entries()]
    .map(([area, n]) => ({ area, orders: n, share: n / touches }))
    .sort((a, b) => b.orders - a.orders);
}

export interface CoveragePoint {
  lat: number;
  lng: number;
  /** Orders through this exact spot - the globe bins these and sums them. */
  weight: number;
}

/** Every distinct coordinate the order book touches, weighted by traffic. */
export function coveragePoints(orders: Order[]): CoveragePoint[] {
  const byCoord = new Map<string, CoveragePoint>();
  for (const order of orders) {
    for (const wp of order.waypoints) {
      const key = `${wp.lat.toFixed(3)},${wp.lng.toFixed(3)}`;
      const p = byCoord.get(key);
      if (p) p.weight += 1;
      else byCoord.set(key, { lat: wp.lat, lng: wp.lng, weight: 1 });
    }
  }
  return [...byCoord.values()];
}
