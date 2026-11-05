import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import { HeatLayer } from "leaflet.heat";
import "leaflet/dist/leaflet.css";
import type { AreaCoverage, CoveragePoint } from "../../lib/coverage";

/**
 * Operations' coverage view: a dark map with a heat layer over everywhere
 * this period's orders touched, a dot at each stop, and a side panel with the
 * zones-covered count, the colour legend and the busiest zones. No money and
 * no per-zone counts - Operations sees where work went, not what it was worth.
 *
 * Tiles are CARTO's dark basemap, fetched at render time from their CDN like
 * the order map's light one.
 */

const TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const SURFACE = "#16171c";
const PANEL = "#1c1d23";
const LINE = "rgba(255,255,255,0.08)";
const DIM = "#9ca3af";
const ACCENT = "#6d7bff";

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

const EGYPT_CENTER: [number, number] = [27, 30.8];

function HeatOverlay({ points }: { points: CoveragePoint[] }) {
  const map = useMap();

  const heat = useMemo(() => {
    const max = Math.max(1, ...points.map((p) => p.weight));
    // sqrt keeps the quiet corners visible next to Cairo's traffic.
    return points.map((p) => [p.lat, p.lng, Math.sqrt(p.weight / max)] as [number, number, number]);
  }, [points]);

  useEffect(() => {
    const layer = new HeatLayer(heat, { radius: 34, blur: 26, maxZoom: 9, minOpacity: 0.35, gradient: HEAT_GRADIENT });
    // leaflet.heat's bundled types are written against a different copy of
    // Leaflet's types than ours, so the class doesn't read as an L.Layer.
    const asLayer = layer as unknown as L.Layer;
    map.addLayer(asLayer);
    return () => {
      map.removeLayer(asLayer);
    };
  }, [map, heat]);

  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 8 });
  }, [map, points]);

  return null;
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
        <MapContainer
          center={EGYPT_CENTER}
          zoom={6}
          zoomControl={false}
          scrollWheelZoom={false}
          className="absolute inset-0"
          style={{ background: SURFACE }}
        >
          <TileLayer url={TILES} attribution={ATTRIBUTION} subdomains="abcd" maxZoom={19} />
          <ZoomControl position="bottomright" />
          <HeatOverlay points={footprint} />
          {footprint.map((p, i) => (
            <CircleMarker
              key={i}
              center={[p.lat, p.lng]}
              radius={4}
              pathOptions={{ color: "#ffffff", weight: 1.5, fillColor: ACCENT, fillOpacity: 1 }}
            />
          ))}
        </MapContainer>
      </div>

      <aside className="flex flex-col gap-5 p-5" style={{ backgroundColor: PANEL, borderLeft: `1px solid ${LINE}` }}>
        <div>
          <p className="text-caption-1-regular uppercase tracking-wide" style={{ color: DIM, fontFamily: "var(--font-mono)" }}>
            Zones covered
          </p>
          <p className="mt-1 flex items-baseline gap-1.5 text-white" style={{ fontFamily: "var(--font-heading)" }}>
            <span style={{ fontSize: "3rem", lineHeight: 1 }}>{areas.length}</span>
            <span className="text-body-2-regular" style={{ color: DIM }}>zones</span>
          </p>
          <p className="mt-1.5 text-caption-1-regular" style={{ color: DIM }}>
            Distinct areas touched by orders · {periodTitle}
          </p>
        </div>

        <div style={{ borderTop: `1px solid ${LINE}` }} className="pt-5">
          <p className="text-body-semibold text-white" style={{ fontFamily: "var(--font-sub)" }}>Color legend</p>
          <div className="mt-3 h-2.5 rounded-full" style={{ background: LEGEND_BAR }} />
          <div className="mt-1.5 flex justify-between text-caption-1-regular" style={{ color: DIM }}>
            <span>Fewer orders</span>
            <span>More orders</span>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${LINE}` }} className="pt-5">
          <p className="text-body-semibold text-white" style={{ fontFamily: "var(--font-sub)" }}>Busiest zones</p>
          {busiest.length === 0 ? (
            <p className="mt-3 text-body-2-regular" style={{ color: DIM }}>No orders in this period.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {busiest.map((a, i) => (
                <li
                  key={a.area}
                  className="rounded-xl px-3 py-2"
                  style={{ border: `1px solid ${i === 0 ? ACCENT : "transparent"}`, backgroundColor: i === 0 ? "rgba(109,123,255,0.08)" : "transparent" }}
                >
                  <div className="text-body-2-regular text-white truncate">{a.area}</div>
                  <div className="mt-1.5 h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
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
