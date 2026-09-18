import { lazy, Suspense, useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import { useDataStore } from "../../lib/store";
import { getGlobeArcs, getGlobePoints } from "../../lib/globeData";

// three.js is ~200KB gzipped - kept out of the main bundle so every other
// page loads exactly as fast as it did before this view existed.
const OrdersGlobe = lazy(() => import("../../components/globe/OrdersGlobe"));

export default function CommandCenter() {
  const { orders } = useDataStore();

  const liveCount = useMemo(() => getGlobeArcs(orders).length, [orders]);
  const locationCount = useMemo(() => getGlobePoints(orders).length, [orders]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Command Center"
        subtitle="The whole operation, live."
      />

      <div
        className="relative rounded-2xl overflow-hidden border border-border"
        style={{ backgroundColor: "#040033", minHeight: "560px" }}
      >
        <Suspense fallback={<GlobeSkeleton />}>
          {/* Explicit height: the globe sizes itself off this container, and a
              height-less flex child would measure as zero. */}
          <OrdersGlobe orders={orders} className="w-full h-[560px]" />
        </Suspense>

        {/* Overlaid readout - the globe is the backdrop, the numbers are the point. */}
        <div className="absolute top-5 left-5 pointer-events-none">
          <p className="text-caption-1-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)" }}>
            Live Routes
          </p>
          <p className="text-title-1-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            {liveCount}
          </p>
          <p className="mt-3 text-caption-1-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono)" }}>
            Locations
          </p>
          <p className="text-title-2-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            {locationCount}
          </p>
        </div>

        <div className="absolute bottom-5 left-5 flex items-center gap-4 pointer-events-none">
          <LegendDot color="#d97706" label="Pending" />
          <LegendDot color="#1253fa" label="Assigned" />
          <LegendDot color="#22c55e" label="In Progress" />
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-caption-1-regular" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-sub)" }}>
        {label}
      </span>
    </span>
  );
}

function GlobeSkeleton() {
  return (
    <div className="flex items-center justify-center" style={{ height: "560px" }}>
      <div
        className="rounded-full animate-pulse"
        style={{ width: "280px", height: "280px", backgroundColor: "rgba(18,83,250,0.12)" }}
      />
    </div>
  );
}
