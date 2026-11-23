import { useEffect, useMemo, useRef, useState } from "react";
import { hasMapsKey, loadGoogleMaps, mapsRejected, onMapsRejected } from "../../lib/googleMaps";
import { createHeatOverlay } from "./heatLayer";
import type { AreaCoverage, CoveragePoint } from "../../lib/coverage";

/**
 * Operations' coverage view: a light Google map with a heat layer over everywhere
 * this period's orders touched, a dot at each stop, and a side panel with the
 * zones-covered count, the colour legend and the busiest zones. No money and
 * no per-zone counts - Operations sees where work went, not what it was worth.
 */

const SURFACE = "#f0f0ee";
const PANEL = "#ffffff";
const LINE = "#e8e8e5";
const DIM = "#626a76";
const ACCENT = "#1253fa";

/** Quiet basemap, so the heat is what you read. */
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#F5F5F3" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#DCE6F2" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#d3d6dc" }] },
];

/** Low to high, same stops on the map and in the legend. */
const HEAT_GRADIENT: Record<number, string> = {
  0.15: "#4ade80",
  0.4: "#d9f03d",
  0.6: "#fbbf24",
  0.8: "#f97316",
  1: "#ef4444",
};
// Sorted numerically: Object.entries puts the integer-like key "1" first.
const LEGEND_BAR = `linear-gradient(90deg, ${Object.entries(HEAT_GRADIENT)
  .sort(([a], [b]) => Number(a) - Number(b))
  .map(([stop, colour]) => `${colour} ${Number(stop) * 100}%`)
  .join(", ")})`;

const EGYPT_CENTER = { lat: 27, lng: 30.8 };

/** The Google map with the heat layer and a small blue dot at each stop. */
function CoverageMap({ footprint }: { footprint: CoveragePoint[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(!hasMapsKey || mapsRejected());

  const heat = useMemo(() => {
    const max = Math.max(1, ...footprint.map((p) => p.weight));
    // sqrt keeps the quiet corners visible next to Cairo's traffic.
    return footprint.map((p) => ({ lat: p.lat, lng: p.lng, intensity: Math.sqrt(p.weight / max) }));
  }, [footprint]);

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
          center: EGYPT_CENTER,
          zoom: 6,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: maps.ControlPosition.RIGHT_BOTTOM },
          gestureHandling: "cooperative",
          clickableIcons: false,
          styles: MAP_STYLE,
        });

        overlays.push(createHeatOverlay(maps, map, heat, HEAT_GRADIENT));

        class Dot extends maps.OverlayView {
          private el?: HTMLDivElement;
          constructor(private at: google.maps.LatLngLiteral) {
            super();
          }
          onAdd() {
            const el = document.createElement("div");
            Object.assign(el.style, {
              position: "absolute",
              width: "10px",
              height: "10px",
              boxSizing: "border-box",
              borderRadius: "999px",
              backgroundColor: ACCENT,
              border: "1.5px solid #ffffff",
              pointerEvents: "none",
            });
            this.el = el;
            this.getPanes()?.markerLayer.appendChild(el);
          }
          draw() {
            const pt = this.getProjection()?.fromLatLngToDivPixel(new maps.LatLng(this.at));
            if (!pt || !this.el) return;
            this.el.style.left = pt.x - 5 + "px";
            this.el.style.top = pt.y - 5 + "px";
          }
          onRemove() {
            this.el?.remove();
            this.el = undefined;
          }
        }
        footprint.forEach((p) => {
          const dot = new Dot({ lat: p.lat, lng: p.lng });
          dot.setMap(map);
          overlays.push(dot);
        });

        if (footprint.length > 0) {
          const bounds = new maps.LatLngBounds();
          footprint.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
          map.fitBounds(bounds, 48);
          maps.event.addListenerOnce(map, "idle", () => {
            if ((map.getZoom() ?? 0) > 8) map.setZoom(8);
          });
        }
        setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      overlays.forEach((o) => o.setMap(null));
      setReady(false);
    };
  }, [heat, footprint, failed]);

  return failed ? (
    <div className="absolute inset-0 flex items-center justify-center text-caption-1-regular" style={{ color: DIM, fontFamily: "var(--font-mono)", backgroundColor: SURFACE }}>
      Map unavailable
    </div>
  ) : (
    <div ref={ref} className="absolute inset-0" style={{ backgroundColor: SURFACE, opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }} />
  );
}

export default function OpsCoverageMap({
  footprint,
  areas,
  periodTitle,
}: {
  footprint: CoveragePoint[];
  areas: AreaCoverage[];
  periodTitle: string;
}) {
  const busiest = areas.slice(0, 5);
  const top = busiest[0]?.orders ?? 1;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] rounded-2xl overflow-hidden"
      style={{ backgroundColor: SURFACE, border: `1px solid ${LINE}` }}
    >
      <div className="relative h-[360px] md:h-auto md:min-h-[540px]">
        <CoverageMap footprint={footprint} />
      </div>

      <aside className="flex flex-col gap-5 p-5" style={{ backgroundColor: PANEL, borderLeft: `1px solid ${LINE}` }}>
        <div>
          <p className="text-caption-1-regular uppercase tracking-wide" style={{ color: DIM, fontFamily: "var(--font-mono)" }}>
            Zones covered
          </p>
          <p className="mt-1 flex items-baseline gap-1.5 text-navy" style={{ fontFamily: "var(--font-heading)" }}>
            <span style={{ fontSize: "3rem", lineHeight: 1 }}>{areas.length}</span>
            <span className="text-body-2-regular" style={{ color: DIM }}>zones</span>
          </p>
          <p className="mt-1.5 text-caption-1-regular" style={{ color: DIM }}>
            Distinct areas touched by orders · {periodTitle}
          </p>
        </div>

        <div style={{ borderTop: `1px solid ${LINE}` }} className="pt-5">
          <p className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>Color legend</p>
          <div className="mt-3 h-2.5 rounded-full" style={{ background: LEGEND_BAR }} />
          <div className="mt-1.5 flex justify-between text-caption-1-regular" style={{ color: DIM }}>
            <span>Fewer orders</span>
            <span>More orders</span>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${LINE}` }} className="pt-5">
          <p className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>Busiest zones</p>
          {busiest.length === 0 ? (
            <p className="mt-3 text-body-2-regular" style={{ color: DIM }}>No orders in this period.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {busiest.map((a, i) => (
                <li
                  key={a.area}
                  className="rounded-xl px-3 py-2"
                  style={{ border: `1px solid ${i === 0 ? ACCENT : "transparent"}`, backgroundColor: i === 0 ? "rgba(18,83,250,0.06)" : "transparent" }}
                >
                  <div className="text-body-2-regular text-navy truncate">{a.area}</div>
                  <div className="mt-1.5 h-1 rounded-full" style={{ backgroundColor: "#f0f0ee" }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.max(8, (a.orders / top) * 100)}%`, backgroundColor: ACCENT }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
