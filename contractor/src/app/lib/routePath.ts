/**
 * The real driving route through the stops (first to last, in order) from the
 * Google Routes API, as the points of the road path. Returns null when it can't
 * be computed (Routes API not enabled for the key, offline, no route), in which
 * case the map draws a plain dashed line between the stops instead.
 */
export async function drivingPath(maps: typeof google.maps, points: google.maps.LatLngLiteral[]): Promise<google.maps.LatLngLiteral[] | null> {
  if (points.length < 2) return null;
  try {
    const { Route } = (await maps.importLibrary("routes")) as google.maps.RoutesLibrary;
    const { routes } = await Route.computeRoutes({
      origin: points[0],
      destination: points[points.length - 1],
      intermediates: points.slice(1, -1).map((location) => ({ location })),
      travelMode: "DRIVING",
      fields: ["path"],
    });
    const path = routes?.[0]?.path;
    if (!path || path.length < 2) return null;
    return path.map((p) => ({ lat: p.lat, lng: p.lng }));
  } catch {
    return null;
  }
}
