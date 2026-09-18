import { useEffect } from "react";
import { Circle, CircleMarker, MapContainer, Polyline, TileLayer, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLng } from "../../lib/tracking";

/**
 * The operator's map for one order: the route from pickup to the last
 * drop-off, each stop as a marker, and the vehicle as a blue dot with a
 * soft radius around it.
 *
 * Tiles are CARTO's Positron - the pale grey basemap the brief showed -
 * fetched at render time from their CDN. The overlays are drawn in our
 * own palette: navy for the pickup, blue for drop-offs, route and vehicle.
 */

const TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const NAVY = "#040033";
const BLUE = "#1253fa";

export default function OrderMap({
  route,
  vehicle,
  className,
}: {
  route: LatLng[];
  vehicle: LatLng | null;
  className?: string;
}) {
  const center = route[0] ?? { lat: 30.0444, lng: 31.2357 };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={11}
      zoomControl={false}
      scrollWheelZoom={false}
      className={className}
      style={{ background: "#f0f0ee" }}
    >
      <TileLayer url={TILES} attribution={ATTRIBUTION} subdomains="abcd" maxZoom={19} />
      <ZoomControl position="topright" />
      <FitToRoute route={route} />

      {route.length > 1 && (
        <Polyline
          positions={route.map((p) => [p.lat, p.lng])}
          pathOptions={{ color: BLUE, weight: 3, opacity: 0.9, dashArray: "6 8", lineCap: "round" }}
        />
      )}

      {route.map((p, i) => (
        <CircleMarker
          key={i}
          center={[p.lat, p.lng]}
          radius={7}
          pathOptions={{ color: "#ffffff", weight: 2.5, fillColor: i === 0 ? NAVY : BLUE, fillOpacity: 1 }}
        />
      ))}

      {vehicle && (
        <>
          <Circle
            center={[vehicle.lat, vehicle.lng]}
            radius={2500}
            pathOptions={{ color: BLUE, weight: 0, fillColor: BLUE, fillOpacity: 0.12 }}
          />
          <CircleMarker
            center={[vehicle.lat, vehicle.lng]}
            radius={9}
            pathOptions={{ color: "#ffffff", weight: 3, fillColor: BLUE, fillOpacity: 1 }}
          />
        </>
      )}
    </MapContainer>
  );
}

/** Frame every stop once, with room for the floating card; the operator pans from there. */
function FitToRoute({ route }: { route: LatLng[] }) {
  const map = useMap();
  const key = route.map((p) => `${p.lat},${p.lng}`).join("|");
  useEffect(() => {
    if (route.length === 0) return;
    const bounds = L.latLngBounds(route.map((p) => [p.lat, p.lng] as [number, number]));
    // Extra room top-left: that corner holds the floating vehicle card, and
    // a stop framed under it is a stop the operator can't see.
    map.fitBounds(bounds, { paddingTopLeft: [330, 210], paddingBottomRight: [72, 72], maxZoom: 13 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key]);
  return null;
}
