import { lazy, Suspense, useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import { useDataStore } from "../../lib/store";
import { getGlobeArcs, getGlobePoints } from "../../lib/globeData";

// three.js is heavy - kept out of the main bundle so every other page loads
// exactly as fast as it did before this view existed.
const OrdersGlobe = lazy(() => import("../../components/globe/OrdersGlobe"));

export default function CommandCenter() {
  const { orders } = useDataStore();

  const liveCount = useMemo(() => getGlobeArcs(orders).length, [orders]);
  const locationCount = useMemo(() => getGlobePoints(orders).length, [orders]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Command Center" subtitle="The whole operation, live." />

      {/* Readout sits above the globe rather than on top of it, so nothing
          overlaps once the sphere is centred at full size. */}
      <div className="flex items-end gap-10 flex-wrap">
        <Stat label="Live Routes" value={liveCount} size="lg" />
        <Stat label="Locations" value={locationCount} />
        <div className="flex items-center gap-4 pb-1">
          <LegendDot color="#d97706" label="Pending" />
          <LegendDot color="#1253fa" label="Assigned" />
          <LegendDot color="#22c55e" label="In Progress" />
        </div>
      </div>

      {/* No card and no clipping: the globe is centred in the full content
          width with room around it, sitting straight on the page. */}
      <Suspense fallback={<div style={{ height: "600px" }} />}>
        <OrdersGlobe orders={orders} className="w-full" style={{ height: "600px" }} />
      </Suspense>
    </div>
  );
}

function Stat({ label, value, size = "md" }: { label: string; value: number; size?: "md" | "lg" }) {
  return (
    <div>
      <p
        className="text-caption-1-semibold uppercase tracking-wide text-muted"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </p>
      <p
        className={size === "lg" ? "text-title-1-semibold text-navy" : "text-title-2-semibold text-navy"}
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {value}
      </p>
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
