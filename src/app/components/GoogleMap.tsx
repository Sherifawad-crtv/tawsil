import { useEffect, useRef, useState, type ReactNode } from "react";
import mapBackdrop from "../../assets/map-backdrop.svg";
import { hasMapsKey, loadGoogleMaps, mapsRejected, onMapsRejected } from "../lib/googleMaps";
import { drivingPath } from "../lib/routePath";

const NAVY = "#040033";
const BLUE = "#1253FA";

export type LatLng = { lat: number; lng: number };
export const toLatLng = ([lat, lng]: [number, number]): LatLng => ({ lat, lng });

const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#F5F5F3" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#DCE6F2" }] },
];

type PinSpec = { position: LatLng; html: string; size: number };

const BORDER = "3px solid white";
const SHADOW = "0 2px 8px rgba(0,0,0,0.25)";
/** Start of the route: a round dot. */
const startDot = () => ({
  size: 16,
  html: `<div style="width:16px;height:16px;border-radius:50%;background:${NAVY};border:${BORDER};box-sizing:border-box;box-shadow:${SHADOW}"></div>`,
});
/** Arrival: a square block, so it reads differently from the start at a glance. */
const endSquare = () => ({
  size: 16,
  html: `<div style="width:16px;height:16px;border-radius:4px;background:${BLUE};border:${BORDER};box-sizing:border-box;box-shadow:${SHADOW}"></div>`,
});
const startNumbered = () => ({
  size: 28,
  html: `<div style="width:28px;height:28px;border-radius:50%;box-sizing:border-box;display:flex;align-items:center;justify-content:center;background:white;border:3px solid ${NAVY};box-shadow:0 2px 10px rgba(0,0,0,0.2);font-family:'Archivo Black',sans-serif;font-size:11px;color:${NAVY}">1</div>`,
});
const endNumbered = () => ({
  size: 28,
  html: `<div style="width:28px;height:28px;border-radius:8px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;background:${BLUE};border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.2);font-family:'Archivo Black',sans-serif;font-size:11px;color:white">2</div>`,
});
const vehicleDot = () => ({
  size: 18,
  html: `<div style="width:18px;height:18px;border-radius:50%;background:${BLUE};border:4px solid white;box-sizing:border-box;box-shadow:0 0 0 4px rgba(18,83,250,0.25),0 2px 12px rgba(18,83,250,0.5)"></div>`,
});

function createPin(maps: typeof google.maps, map: google.maps.Map, spec: PinSpec) {
  class Pin extends maps.OverlayView {
    private el?: HTMLDivElement;
    onAdd() {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.pointerEvents = "none";
      el.innerHTML = spec.html;
      this.el = el;
      this.getPanes()?.markerLayer.appendChild(el);
    }
    draw() {
      const point = this.getProjection()?.fromLatLngToDivPixel(new maps.LatLng(spec.position));
      if (!point || !this.el) return;
      this.el.style.left = point.x - spec.size / 2 + "px";
      this.el.style.top = point.y - spec.size / 2 + "px";
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
 * Google map of one trip: pickup, drop-off, the real driving route between them
 * and optionally the vehicle. `interactive` lets one finger pan and pinch; off,
 * the map is a picture and the page scrolls over it. The static backdrop shows
 * while it loads and stays if there is no key or Google refuses the request.
 */
export default function GoogleMap({
  start,
  end,
  vehicle,
  pins = "dots",
  interactive = true,
  padding = { top: 60, right: 50, bottom: 60, left: 50 },
  fallback,
}: {
  start: LatLng;
  end: LatLng;
  vehicle?: LatLng;
  pins?: "dots" | "numbered";
  interactive?: boolean;
  padding?: google.maps.Padding;
  fallback?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(!hasMapsKey || mapsRejected());
  const key = [start, end, vehicle].map((p) => (p ? p.lat + "," + p.lng : "-")).join("|") + pins + interactive;

  useEffect(() => onMapsRejected(() => setFailed(true)), []);

  useEffect(() => {
    if (failed || !ref.current) return;
    let cancelled = false;
    const overlays: { setMap(map: google.maps.Map | null): void }[] = [];

    (async () => {
      try {
        const maps = await loadGoogleMaps();
        if (cancelled || !ref.current) return;
        const map = new maps.Map(ref.current, {
          center: start,
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: interactive,
          gestureHandling: interactive ? "greedy" : "none",
          keyboardShortcuts: false,
          clickableIcons: false,
          styles: MAP_STYLE,
        });

        const road = await drivingPath(maps, [start, end]);
        if (cancelled) return;
        const path = road ?? [start, end];

        const bounds = new maps.LatLngBounds();
        path.forEach((p) => bounds.extend(p));
        [start, end, ...(vehicle ? [vehicle] : [])].forEach((p) => bounds.extend(p));

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

        const startPin = pins === "numbered" ? startNumbered() : startDot();
        const endPin = pins === "numbered" ? endNumbered() : endSquare();
        overlays.push(createPin(maps, map, { position: start, ...startPin }), createPin(maps, map, { position: end, ...endPin }));
        if (vehicle) overlays.push(createPin(maps, map, { position: vehicle, ...vehicleDot() }));

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
  }, [key, failed]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: "#F0F0EE" }}>
      <div className="absolute inset-0">
        {fallback ?? <img src={mapBackdrop} alt="" draggable={false} className="w-full h-full object-cover" />}
      </div>
      {!failed && <div ref={ref} className="absolute inset-0" style={{ opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }} />}
    </div>
  );
}
