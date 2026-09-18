import type { Order } from "./types";

/**
 * Where an order's vehicle is on the map.
 *
 * There is no telemetry in this data model - nothing on an order or a
 * vehicle records a GPS fix. Until there is, the position is a stand-in
 * derived from the order itself: parked at the pickup while Assigned, at
 * the final drop-off once Completed, and while In Progress it moves along
 * the route on a loop so the operator's view actually moves. Swapping in a
 * real feed means replacing vehiclePosition and nothing else.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/** Pickup first, then the drop-offs in order - the line the truck drives. */
export function routeOf(order: Order): LatLng[] {
  const pickup = order.waypoints.filter((w) => w.type === "Pickup");
  const dropoffs = order.waypoints.filter((w) => w.type === "Dropoff");
  return [...pickup, ...dropoffs].map((w) => ({ lat: w.lat, lng: w.lng }));
}

/** How long one pass of the route takes in the stand-in. */
const LOOP_MS = 6 * 60 * 1000;

export function vehiclePosition(order: Order, now = Date.now()): { position: LatLng; live: boolean } | null {
  const route = routeOf(order);
  if (route.length === 0) return null;

  switch (order.status) {
    case "Assigned":
      return { position: route[0], live: false };
    case "Completed":
      return { position: route[route.length - 1], live: false };
    case "In Progress": {
      if (route.length === 1) return { position: route[0], live: true };
      const started = [...order.statusHistory].reverse().find((h) => h.toStatus === "In Progress")?.timestamp;
      const elapsed = now - new Date(started ?? order.pickupAt).getTime();
      const t = ((elapsed % LOOP_MS) + LOOP_MS) / LOOP_MS % 1;
      return { position: along(route, t), live: true };
    }
    default:
      return null;
  }
}

/** Point a fraction `t` (0..1) of the way along a polyline, by distance. */
function along(route: LatLng[], t: number): LatLng {
  const legs: number[] = [];
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    const d = distance(route[i - 1], route[i]);
    legs.push(d);
    total += d;
  }
  let target = t * total;
  for (let i = 0; i < legs.length; i++) {
    if (target <= legs[i] || i === legs.length - 1) {
      const f = legs[i] === 0 ? 0 : Math.min(1, target / legs[i]);
      const a = route[i];
      const b = route[i + 1];
      return { lat: a.lat + (b.lat - a.lat) * f, lng: a.lng + (b.lng - a.lng) * f };
    }
    target -= legs[i];
  }
  return route[route.length - 1];
}

/** Equirectangular - plenty for a few hundred km, and it never needs to be a real distance. */
function distance(a: LatLng, b: LatLng) {
  const x = (b.lng - a.lng) * Math.cos(((a.lat + b.lat) / 2) * (Math.PI / 180));
  const y = b.lat - a.lat;
  return Math.hypot(x, y);
}
