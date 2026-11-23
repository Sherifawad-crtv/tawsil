import { useEffect, useRef, useState } from "react";
import { hasMapsKey, loadGoogleMaps, mapsRejected, onMapsRejected } from "../../lib/googleMaps";
import { drivingPath } from "../../lib/routePath";
import type { LatLng } from "../../lib/tracking";

/**
 * The operator's map for one order, on Google Maps: the road route from pickup to
 * the last drop-off, each stop as a pin, and the vehicle as a blue dot with a soft
 * radius around it. The pins follow the other apps: round navy for the first stop,
 * small rings between, a square blue block for the last.
 */

const NAVY = "#040033";
const BLUE = "#1253FA";

/** Quiet basemap: no business or transit clutter, so the route is what you read. */
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#F5F5F3" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#DCE6F2" }] },
];

type PinKind = "first" | "stop" | "last" | "vehicle";

/** HTML pin on the map. Its position can be moved after it is added (the vehicle does). */
function createPin(maps: typeof google.maps, map: google.maps.Map, start: google.maps.LatLngLiteral, kind: PinKind) {
  const size = kind === "stop" ? 16 : kind === "vehicle" ? 20 : 24;
  class Pin extends maps.OverlayView {
    private el?: HTMLDivElement;
    position = start;
    onAdd() {
      const el = document.createElement("div");
      Object.assign(el.style, {
        position: "absolute",
        width: size + "px",
        height: size + "px",
        boxSizing: "border-box",
        borderRadius: kind === "last" ? "6px" : "999px",
        backgroundColor: kind === "first" ? NAVY : kind === "last" || kind === "vehicle" ? BLUE : "#FFFFFF",
        border: kind === "stop" ? "3px solid " + BLUE : "4px solid #FFFFFF",
        boxShadow: "0 2px 8px rgba(4,0,51,0.3)",
        pointerEvents: "none",
      });
      this.el = el;
      this.getPanes()?.markerLayer.appendChild(el);
    }
    draw() {
      const point = this.getProjection()?.fromLatLngToDivPixel(new maps.LatLng(this.position));
      if (!point || !this.el) return;
      this.el.style.left = point.x - size / 2 + "px";
      this.el.style.top = point.y - size / 2 + "px";
    }
    move(next: google.maps.LatLngLiteral) {
      this.position = next;
      this.draw();
    }
    onRemove() {
      this.el?.remove();
      this.el = undefined;
    }
  }
  const pin = new Pin();
  pin.setMap(map);
  return pin;
}

export default function OrderMap({
  route,
  vehicle,
  className,
  clearTopLeft = [72, 72],
  clearBottomRight = [72, 72],
}: {
  route: LatLng[];
  vehicle: LatLng | null;
  className?: string;
  /**
   * Pixels to keep clear when framing the route, for whatever the page lays
   * over the map - a side panel, a pinned card. A stop framed under an
   * overlay is a stop the operator can't see.
   */
  clearTopLeft?: [number, number];
  clearBottomRight?: [number, number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const vehiclePin = useRef<{ move(p: google.maps.LatLngLiteral): void; setMap(m: google.maps.Map | null): void } | null>(null);
  const vehicleRadius = useRef<google.maps.Circle | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(!hasMapsKey || mapsRejected());
  const routeKey = route.map((p) => `${p.lat},${p.lng}`).join("|");

  useEffect(() => onMapsRejected(() => setFailed(true)), []);

  // The map itself: base map, route and stops. Redone only when the route changes.
  useEffect(() => {
    if (failed || !ref.current || route.length === 0) return;
    let cancelled = false;
    const overlays: { setMap(map: google.maps.Map | null): void }[] = [];

    (async () => {
      try {
        const maps = await loadGoogleMaps();
        if (cancelled || !ref.current) return;
        const map = new maps.Map(ref.current, {
          center: route[0],
          zoom: 8,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: maps.ControlPosition.RIGHT_TOP },
          gestureHandling: "greedy",
          clickableIcons: false,
          styles: MAP_STYLE,
        });
        mapRef.current = map;

        // The road route when Google can compute it; otherwise a faint dashed line between the stops.
        const road = await drivingPath(maps, route);
        if (cancelled) return;
        const path = road ?? route;

        const bounds = new maps.LatLngBounds();
        path.forEach((p) => bounds.extend(p));
        route.forEach((p) => bounds.extend(p));

        if (road) {
          overlays.push(
            new maps.Polyline({ map, path, strokeColor: "#FFFFFF", strokeOpacity: 1, strokeWeight: 9, zIndex: 1 }),
            new maps.Polyline({ map, path, strokeColor: BLUE, strokeOpacity: 1, strokeWeight: 5, zIndex: 2 }),
          );
        } else {
          overlays.push(
            new maps.Polyline({
              map,
              path,
              strokeOpacity: 0,
              zIndex: 2,
              icons: [{ icon: { path: "M 0,-1 0,1", strokeColor: BLUE, strokeOpacity: 0.8, scale: 3 }, offset: "0", repeat: "14px" }],
            }),
          );
        }
        route.forEach((p, i) => {
          const kind: PinKind = i === 0 ? "first" : i === route.length - 1 ? "last" : "stop";
          overlays.push(createPin(maps, map, p, kind));
        });

        // Frame every stop once, clear of the overlays; the operator pans from there.
        map.fitBounds(bounds, { top: clearTopLeft[1], left: clearTopLeft[0], bottom: clearBottomRight[1], right: clearBottomRight[0] });
        maps.event.addListenerOnce(map, "idle", () => {
          if ((map.getZoom() ?? 0) > 13) map.setZoom(13);
        });
        setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      overlays.forEach((o) => o.setMap(null));
      vehiclePin.current?.setMap(null);
      vehiclePin.current = null;
      vehicleRadius.current?.setMap(null);
      vehicleRadius.current = null;
      mapRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey, failed]);

  // The vehicle moves without rebuilding the map.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const maps = window.google.maps;
    if (!vehicle) {
      vehiclePin.current?.setMap(null);
      vehiclePin.current = null;
      vehicleRadius.current?.setMap(null);
      vehicleRadius.current = null;
      return;
    }
    if (!vehiclePin.current) {
      vehiclePin.current = createPin(maps, map, vehicle, "vehicle");
      vehicleRadius.current = new maps.Circle({
        map,
        center: vehicle,
        radius: 2500,
        strokeWeight: 0,
        fillColor: BLUE,
        fillOpacity: 0.12,
        clickable: false,
        zIndex: 0,
      });
    } else {
      vehiclePin.current.move(vehicle);
      vehicleRadius.current?.setCenter(vehicle);
    }
  }, [ready, vehicle?.lat, vehicle?.lng]);

  return (
    <div className={`relative ${className ?? ""}`} style={{ backgroundColor: "#F0F0EE" }}>
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center text-caption-1-regular text-muted" style={{ fontFamily: "var(--font-mono)" }}>
          Map unavailable
        </div>
      ) : (
        <div ref={ref} className="absolute inset-0" style={{ opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }} />
      )}
    </div>
  );
}
