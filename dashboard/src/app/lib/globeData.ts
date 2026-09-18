import type { Order, OrderStatus } from "./types";

/**
 * Shapes the order book into the three layers the globe draws. Everything
 * here comes from real waypoint coordinates already on the orders - nothing
 * is synthesised for the visual.
 */

export interface GlobeArc {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  status: OrderStatus;
  label: string;
}

export interface GlobePoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  /** How many orders touch this location - drives the point's height. */
  count: number;
}

export interface GlobeRing {
  id: string;
  lat: number;
  lng: number;
  color: string;
}

/** Same status palette as StatusBadge, as literal hexes (three.js can't read CSS vars). */
const ARC_COLOR: Record<OrderStatus, string> = {
  Pending: "#d97706",
  Assigned: "#1253fa",
  "In Progress": "#22c55e",
  Completed: "#16803c",
  Cancelled: "#dc2626",
};

/** Statuses worth drawing a route for - finished and dead orders would just be noise. */
const LIVE_STATUSES: OrderStatus[] = ["Pending", "Assigned", "In Progress"];

/** Two coordinates are "the same place" within ~100m, which is enough to collapse a depot onto one point. */
function coordKey(lat: number, lng: number) {
  return `${lat.toFixed(3)},${lng.toFixed(3)}`;
}

/**
 * One arc per live order, from its first pickup to its last dropoff. Orders
 * with multi-stop routes still draw a single origin-to-destination line -
 * the globe is a health read, not a routing tool.
 */
export function getGlobeArcs(orders: Order[]): GlobeArc[] {
  const arcs: GlobeArc[] = [];

  for (const order of orders) {
    if (!LIVE_STATUSES.includes(order.status)) continue;

    const pickup = order.waypoints.find((w) => w.type === "Pickup");
    const dropoffs = order.waypoints.filter((w) => w.type === "Dropoff");
    const dropoff = dropoffs[dropoffs.length - 1];
    if (!pickup || !dropoff) continue;

    arcs.push({
      id: order.id,
      startLat: pickup.lat,
      startLng: pickup.lng,
      endLat: dropoff.lat,
      endLng: dropoff.lng,
      color: ARC_COLOR[order.status],
      status: order.status,
      label: `${order.id} · ${pickup.name} → ${dropoff.name}`,
    });
  }

  return arcs;
}

/**
 * Every distinct location the order book touches, with how many orders run
 * through it. Collapses the many waypoints sharing a depot into one point.
 */
export function getGlobePoints(orders: Order[]): GlobePoint[] {
  const byCoord = new Map<string, GlobePoint>();

  for (const order of orders) {
    for (const wp of order.waypoints) {
      const key = coordKey(wp.lat, wp.lng);
      const existing = byCoord.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        byCoord.set(key, { id: key, lat: wp.lat, lng: wp.lng, name: wp.name, count: 1 });
      }
    }
  }

  return [...byCoord.values()].sort((a, b) => b.count - a.count);
}

/** A pulse on the pickup of everything currently moving. */
export function getGlobeRings(orders: Order[]): GlobeRing[] {
  const rings: GlobeRing[] = [];

  for (const order of orders) {
    if (order.status !== "In Progress") continue;
    const pickup = order.waypoints.find((w) => w.type === "Pickup");
    if (!pickup) continue;
    rings.push({ id: order.id, lat: pickup.lat, lng: pickup.lng, color: ARC_COLOR["In Progress"] });
  }

  return rings;
}

/** Mean of the plotted points - where the camera should look on first paint. */
export function getGlobeCenter(points: GlobePoint[]) {
  if (points.length === 0) return { lat: 26.8, lng: 30.8 }; // Egypt
  const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
  return { lat, lng };
}
