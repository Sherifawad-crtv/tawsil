import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { MeshBasicMaterial } from "three";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import countries110m from "world-atlas/countries-110m.json";
import { getGlobeArcs, getGlobePoints, getGlobeRings, getGlobeCenter } from "../../lib/globeData";
import type { Order } from "../../lib/types";

/**
 * The order book as a globe: one animated arc per live order, a point per
 * location sized by how much runs through it, and a pulse on everything
 * currently moving.
 *
 * Reads as ambient page furniture rather than a widget - landmasses are a
 * field of pale dots with no sphere, frame or fill behind them, so the only
 * saturated things on screen are the routes and hubs themselves.
 *
 * Deliberately texture-free. Every globe.gl example pulls a photographic
 * earth JPEG off a CDN at render time; that's a runtime network dependency
 * and it fights our flat palette. The dots come from a locally-bundled 110m
 * country topology instead.
 */

// The sphere is painted exactly the page background and left unlit, so it
// has no silhouette and no specular gradient - invisible, while still
// occluding the dots on the far side so only the near hemisphere reads.
const SPHERE = "#f5f5f3";
const DOTS = "#d8d9d4";
const POINT = "#0a0070";

// Resolved once at module scope - the topology never changes, and feature()
// on 110m data is cheap but pointless to repeat per mount.
//
// hexPolygons tessellates through h3-js, and h3 throws an H3LibraryError on
// a couple of this topology's simplified outlines. Checked each of the 177
// countries against polygonToCells directly: at the resolution below only
// North Korea (408) fails; Antarctica additionally fails at resolution 4, so
// add "010" here if the dot density is ever raised.
const H3_UNTESSELLATABLE = new Set(["408"]);

const COUNTRIES = (
  feature(
    countries110m as unknown as Topology,
    (countries110m as unknown as Topology).objects.countries
  ) as unknown as { features: { id?: string | number }[] }
).features.filter((f) => !H3_UNTESSELLATABLE.has(String(f.id)));

export default function OrdersGlobe({ orders, className }: { orders: Order[]; className?: string }) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const arcs = useMemo(() => getGlobeArcs(orders), [orders]);
  const points = useMemo(() => getGlobePoints(orders), [orders]);
  const rings = useMemo(() => getGlobeRings(orders), [orders]);
  const center = useMemo(() => getGlobeCenter(points), [points]);

  const maxCount = useMemo(() => Math.max(1, ...points.map((p) => p.count)), [points]);

  // Globe needs pixel dimensions, so track the container rather than passing
  // a percentage that three.js can't resolve.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const globeMaterial = useMemo(() => new MeshBasicMaterial({ color: SPHERE }), []);

  // Frame the camera on where the work actually is - on a full world view
  // Egypt is a speck and every arc overlaps in one spot.
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || size.width === 0) return;

    const controls = globe.controls();
    // Auto-rotate is off on purpose: framed this close on Egypt, spinning
    // just carries the whole network out of shot within a few seconds. Drag
    // to spin and scroll to zoom still work - flip autoRotate to true if a
    // slowly turning marble is wanted over a readable one.
    controls.autoRotate = false;
    controls.enableZoom = true;

    globe.pointOfView({ lat: center.lat, lng: center.lng, altitude: 1.0 }, 0);
  }, [size.width, center.lat, center.lng]);

  return (
    <div ref={wrapRef} className={className}>
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={globeMaterial}
          showAtmosphere={false}
          hexPolygonsData={COUNTRIES}
          hexPolygonColor={() => DOTS}
          hexPolygonResolution={3}
          hexPolygonMargin={0.42}
          hexPolygonUseDots
          hexPolygonAltitude={0.004}
          arcsData={arcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor={(a: object) => {
            const arc = a as { color: string };
            return [`${arc.color}00`, arc.color, `${arc.color}00`];
          }}
          arcStroke={0.3}
          arcAltitude={0.07}
          arcDashLength={0.4}
          arcDashGap={0.6}
          arcDashAnimateTime={2200}
          arcLabel={(a: object) => (a as { label: string }).label}
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => POINT}
          pointRadius={0.13}
          pointAltitude={(p: object) => 0.004 + ((p as { count: number }).count / maxCount) * 0.03}
          pointLabel={(p: object) => {
            const point = p as { name: string; count: number };
            return `${point.name} · ${point.count} stop${point.count === 1 ? "" : "s"}`;
          }}
          ringsData={rings}
          ringLat="lat"
          ringLng="lng"
          ringColor={(r: object) => {
            const ring = r as { color: string };
            return (t: number) => `${ring.color}${Math.round((1 - t) * 255).toString(16).padStart(2, "0")}`;
          }}
          ringMaxRadius={1.1}
          ringPropagationSpeed={0.7}
          ringRepeatPeriod={1400}
        />
      )}
    </div>
  );
}
