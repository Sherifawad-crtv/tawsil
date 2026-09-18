import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { MeshBasicMaterial } from "three";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import countries110m from "world-atlas/countries-110m.json";
import { blueShade, type CoveragePoint } from "../../lib/coverage";
import { coverageCells } from "./coverageCells";

/**
 * A dotted globe, coloured and sized to sit into the page rather than on
 * top of it, turning slowly, with the coverage footprint painted onto the
 * dots themselves in blue - the more orders through a cell, the darker.
 * Not a separate raised layer: hex bins were tried and read as tubes.
 *
 * The finer order layers (route arcs, hub points, live pulses) are still
 * switched off, not deleted: lib/globeData.ts still shapes orders into
 * arcs, points and rings, so turning them back on means passing orders
 * back in and restoring the layer props.
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
const DOTS = "#c7c8c1";

// Framed over Egypt/MENA. Altitude is what decides whether the sphere fits:
// the camera sits at R*(1+altitude) and the silhouette subtends asin(R/d),
// against globe.gl's 50-degree vertical FOV. At 1.5 the sphere covers 94% of
// the canvas height, so its edges and its drop shadow were being clipped -
// which read as "cropped top and bottom". At 1.8 it covers 82%, leaving a
// real margin on both. Make the canvas bigger to make the globe bigger;
// don't pull the camera in.
const VIEW = { lat: 26.8, lng: 30.8, altitude: 1.8 };

// hexPolygons tessellates through h3-js, and h3 throws an H3LibraryError on
// a couple of this topology's simplified outlines. Checked each of the 177
// countries against polygonToCells directly: at the resolution below only
// North Korea (408) fails; Antarctica additionally fails at resolution 4, so
// add "010" here if the dot density is ever raised.
const H3_UNTESSELLATABLE = new Set(["408"]);

// Full turn roughly every 3 minutes. OrbitControls' default of 2 is a spin.
const ROTATE_SPEED = 0.35;

// Resolved once at module scope - the topology never changes, and feature()
// on 110m data is cheap but pointless to repeat per mount.
const COUNTRIES = (
  feature(
    countries110m as unknown as Topology,
    (countries110m as unknown as Topology).objects.countries
  ) as unknown as { features: { id?: string | number }[] }
).features.filter((f) => !H3_UNTESSELLATABLE.has(String(f.id)));

export default function OrdersGlobe({
  coverage = [],
  className,
  style,
}: {
  coverage?: CoveragePoint[];
  className?: string;
  style?: CSSProperties;
}) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

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

  // Coverage cells go into the same hexPolygons layer as the countries: a
  // cell-sized polygon tessellates to exactly its own dot, so each covered
  // dot gets its own shade. They sit a hair above the grey dots so blue wins
  // where the two grids coincide.
  const polygons = useMemo(() => [...COUNTRIES, ...coverageCells(coverage)], [coverage]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || size.width === 0) return;

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = ROTATE_SPEED;
    // Zoom off: scrolling in pushes the sphere past its container and clips
    // it. The framing above is the intended one.
    controls.enableZoom = false;

    globe.pointOfView(VIEW, 0);
  }, [size.width]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ ...style, filter: "drop-shadow(0 16px 30px rgba(4,0,51,0.16))" }}
    >
      {size.width > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={globeMaterial}
          showAtmosphere={false}
          hexPolygonsData={polygons}
          hexPolygonColor={(f: object) => {
            const c = (f as { properties?: { coverage?: number } }).properties?.coverage;
            return c === undefined ? DOTS : blueShade(c);
          }}
          hexPolygonAltitude={(f: object) =>
            (f as { properties?: { coverage?: number } }).properties?.coverage === undefined ? 0.004 : 0.006
          }
          hexPolygonResolution={3}
          hexPolygonMargin={0.42}
          hexPolygonUseDots
        />
      )}
    </div>
  );
}
