import { useEffect, useRef, useState, type ReactNode } from "react";
import { hasMapsKey, loadGoogleMaps, mapsRejected, onMapsRejected } from "../lib/googleMaps";
import { resolveStops } from "../lib/stopCoords";
import { drivingPath } from "../lib/routePath";
import type { Waypoint } from "../lib/types";

const NAVY = "#040033";
const BLUE = "#1253FA";

type PinKind = "first" | "stop" | "last";

/** Quiet basemap: no business or transit clutter, so the route is what you read. */
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#F5F5F3" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#DCE6F2" }] },
];

/** HTML pin on the map: a round navy dot (first stop), a small ring (stops between), a square blue block (last stop). */
function createPin(maps: typeof google.maps, map: google.maps.Map, position: google.maps.LatLngLiteral, kind: PinKind) {
  const size = kind === "stop" ? 16 : 24;
  class Pin extends maps.OverlayView {
    private el?: HTMLDivElement;
    onAdd() {
      const el = document.createElement("div");
      Object.assign(el.style, {
        position: "absolute",
        width: size + "px",
        height: size + "px",
        boxSizing: "border-box",
        borderRadius: kind === "last" ? "6px" : "999px",
        backgroundColor: kind === "first" ? NAVY : kind === "last" ? BLUE : "#FFFFFF",
        border: kind === "stop" ? "3px solid " + BLUE : "4px solid #FFFFFF",
        boxShadow: "0 2px 8px rgba(4,0,51,0.3)",
        pointerEvents: "none",
      });
      this.el = el;
      this.getPanes()?.markerLayer.appendChild(el);
    }
    draw() {
      const point = this.getProjection()?.fromLatLngToDivPixel(new maps.LatLng(position));
      if (!point || !this.el) return;
      this.el.style.left = point.x - size / 2 + "px";
      this.el.style.top = point.y - size / 2 + "px";
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

/**
 * Google map of an order's route: first stop (round navy pin), the stops between
 * (small rings) and the last stop (square blue pin), joined by the route line.
 * `fallback` is shown while it loads, and stays if there is no key or Google
 * refuses the request.
 */
export default function RouteMap({
  stops,
  fallback,
  padding = { top: 80, right: 40, bottom: 70, left: 40 },
}: {
  stops: Waypoint[];
  fallback: ReactNode;
  padding?: google.maps.Padding;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(!hasMapsKey || mapsRejected());
  const stopsKey = stops.map((s) => s.address + "|" + (s.lat ?? "") + "|" + (s.lng ?? "")).join(";");

  useEffect(() => onMapsRejected(() => setFailed(true)), []);

  useEffect(() => {
    if (failed || !ref.current) return;
    let cancelled = false;
    const overlays: { setMap(map: google.maps.Map | null): void }[] = [];

    (async () => {
      try {
        const maps = await loadGoogleMaps();
        const points = await resolveStops(maps, stops);
        if (cancelled || !ref.current) return;
        if (!points) throw new Error("No stop positions");

        const map = new maps.Map(ref.current, {
          center: points[0],
          zoom: 11,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          clickableIcons: false,
          styles: MAP_STYLE,
        });

        // The road route when Google can compute it; otherwise a faint dashed line between the stops
        const road = await drivingPath(maps, points);
        if (cancelled) return;
        const path = road ?? points;

        const bounds = new maps.LatLngBounds();
        path.forEach((p) => bounds.extend(p));
        points.forEach((p) => bounds.extend(p));

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
        points.forEach((p, i) => {
          const kind: PinKind = i === 0 ? "first" : i === points.length - 1 ? "last" : "stop";
          overlays.push(createPin(maps, map, p, kind));
        });

        map.fitBounds(bounds, padding);
        maps.event.addListenerOnce(map, "idle", () => {
          if ((map.getZoom() ?? 0) > 15) map.setZoom(15);
        });
        setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      overlays.forEach((o) => o.setMap(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopsKey, failed]);

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0">{fallback}</div>
      {!failed && <div ref={ref} className="absolute inset-0" style={{ opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }} />}
    </div>
  );
}
