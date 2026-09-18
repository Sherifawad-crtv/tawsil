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
      <PageHeader title="Command Center" subtitle="The whole operation, live." />

      {/*
        No card, no border, no fill: the globe is bled into the page
        background and sits behind the readout rather than being an object
        boxed on top of it. Oversized and pulled right so it runs past the
        content's edge instead of terminating in a visible frame.
      */}
      <div className="relative" style={{ height: "520px" }}>
        <div className="absolute inset-y-0 right-[-14%] left-[22%] pointer-events-auto">
          <Suspense fallback={null}>
            <OrdersGlobe orders={orders} className="w-full h-full" />
          </Suspense>
        </div>

        <div className="relative pointer-events-none pt-4">
          <p
            className="text-caption-1-semibold uppercase tracking-wide text-muted"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Live Routes
          </p>
          <p className="text-title-1-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
            {liveCount}
          </p>

          <p
            className="mt-4 text-caption-1-semibold uppercase tracking-wide text-muted"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Locations
          </p>
          <p className="text-title-2-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
            {locationCount}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <LegendDot color="#d97706" label="Pending" />
            <LegendDot color="#1253fa" label="Assigned" />
            <LegendDot color="#22c55e" label="In Progress" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-caption-1-regular text-muted" style={{ fontFamily: "var(--font-sub)" }}>
        {label}
      </span>
    </span>
  );
}
