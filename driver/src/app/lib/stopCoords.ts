import type { Waypoint } from "./types";

export type Coords = { lat: number; lng: number };

/** Approximate positions for the demo addresses; real orders should carry lat/lng on each waypoint. */
const KNOWN: Record<string, Coords> = {
  "Main Warehouse, 6th of October City": { lat: 29.9285, lng: 30.9188 },
  "Obour Industrial Zone, Block 12": { lat: 30.218, lng: 31.478 },
  "10th of Ramadan Warehouse, Gate 3": { lat: 30.297, lng: 31.741 },
  "Sadat City Distribution Center": { lat: 30.372, lng: 30.536 },
  "Al Ameriya Cold Storage, Alexandria": { lat: 30.97, lng: 29.76 },
  "Carrefour City Stars Hub": { lat: 30.073, lng: 31.345 },
  "Metro Market, Nasr City": { lat: 30.056, lng: 31.339 },
  "B.Tech Warehouse, Maadi": { lat: 29.96, lng: 31.258 },
  "Client Site, New Cairo": { lat: 30.03, lng: 31.47 },
  "Regional DC, Sheikh Zayed": { lat: 30.017, lng: 30.983 },
};

/**
 * Position of every stop, in order: the waypoint's own lat/lng, else the demo
 * table, else a Google geocode of the address. Returns null if fewer than two
 * stops could be placed.
 */
export async function resolveStops(maps: typeof google.maps, stops: Waypoint[]): Promise<Coords[] | null> {
  let geocoder: google.maps.Geocoder | undefined;
  const placed: Coords[] = [];
  for (const stop of stops) {
    const direct = stop.lat !== undefined && stop.lng !== undefined ? { lat: stop.lat, lng: stop.lng } : KNOWN[stop.address];
    if (direct) {
      placed.push(direct);
      continue;
    }
    try {
      geocoder ??= new maps.Geocoder();
      const { results } = await geocoder.geocode({ address: `${stop.address}, Egypt` });
      const loc = results[0]?.geometry.location;
      if (loc) placed.push({ lat: loc.lat(), lng: loc.lng() });
    } catch {
      // Geocoding unavailable for this key: skip the stop.
    }
  }
  return placed.length >= 2 ? placed : null;
}
