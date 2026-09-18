import { lazy, Suspense, useMemo } from "react";
import { ArrowUpIcon, BoxIcon, RoutingIcon, MapPointIcon, BusIcon } from "@solar-icons/react/linear";
import PageHeader from "../../components/PageHeader";
import InsightCard from "../../components/InsightCard";
import StatusBreakdownBar from "../../components/charts/StatusBreakdownBar";
import LocationBarList from "../../components/charts/LocationBarList";
import OrderVolumeChartCard from "../../components/charts/OrderVolumeChartCard";
import { useDataStore } from "../../lib/store";
import { useRole } from "../../lib/RoleContext";
import {
  getHomeMetrics,
  getOrdersByStatus,
  getOrderVolumeWeekOverWeek,
  getProblemsByLocation,
} from "../../lib/selectors";
import { getGlobePoints } from "../../lib/globeData";

// three.js is heavy - kept out of the main bundle so every other page loads
// exactly as fast as it did before this view existed.
const OrdersGlobe = lazy(() => import("../../components/globe/OrdersGlobe"));

export default function CommandCenter() {
  const { orders, drivers, contractors, clients } = useDataStore();
  const { role } = useRole();

  const metrics = useMemo(() => getHomeMetrics(orders, drivers), [orders, drivers]);
  const statusData = useMemo(() => getOrdersByStatus(orders), [orders]);
  const volumeData = useMemo(() => getOrderVolumeWeekOverWeek(orders), [orders]);
  const locations = useMemo(() => getProblemsByLocation(orders, role), [orders, role]);
  const topPoints = useMemo(() => getGlobePoints(orders).slice(0, 3), [orders]);

  const completed = statusData.find((s) => s.status === "Completed")?.count ?? 0;
  const completionRate = orders.length > 0 ? Math.round((completed / orders.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Command Center" subtitle="The whole operation, live." />

      {/*
        Globe is the backdrop on the right, oversized and running off the
        panel's edge rather than sitting inside it; overflow-hidden is what
        crops it. The card grid sits above it on the left.
      */}
      <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: "720px" }}>
        <div
          className="absolute pointer-events-none hidden lg:block"
          style={{ top: "50%", right: "-22%", transform: "translateY(-50%)", width: "980px", height: "980px" }}
        >
          <Suspense fallback={null}>
            <OrdersGlobe className="w-full h-full" />
          </Suspense>
        </div>

        {/* Floating readouts over the globe. Positioned by eye rather than
            projected from lat/lng - the globe is static, so anchoring them
            to real coordinates is possible if that's wanted later. */}
        <div className="absolute inset-0 hidden lg:block pointer-events-none">
          {topPoints[0] && <Pill top="12%" left="67%" icon={MapPointIcon} tint="#eaf0fe" color="#1253fa" title={shortName(topPoints[0].name)} value={`${topPoints[0].count} stops`} />}
          {topPoints[1] && <Pill top="44%" left="78%" icon={BusIcon} tint="#fef3e2" color="#d97706" title={shortName(topPoints[1].name)} value={`${topPoints[1].count} stops`} />}
          {topPoints[2] && <Pill top="74%" left="69%" icon={RoutingIcon} tint="#e7f6ec" color="#16803c" title={shortName(topPoints[2].name)} value={`${topPoints[2].count} stops`} />}
        </div>

        <div className="relative w-full lg:w-[62%] flex flex-col gap-3 p-1">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-5">
              <InsightCard title="Orders by Status" subtitle={`${orders.length} total orders`}>
                <StatusBreakdownBar data={statusData} />
              </InsightCard>
            </div>

            <div className="col-span-12 sm:col-span-7 flex flex-col gap-3">
              <SolidStat
                value={orders.length.toLocaleString()}
                caption="Orders placed across every channel"
                background="#1253fa"
              />
              <SolidStat
                value={`${metrics.activeOrders}`}
                caption="Active orders moving right now"
                background="#0a0070"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-4">
              <InsightCard title="Completion" subtitle="Share of orders delivered">
                <Donut percent={completionRate} />
              </InsightCard>
            </div>

            <div className="col-span-12 sm:col-span-3">
              <InsightCard title="Network">
                <div className="flex flex-col gap-3 py-1">
                  <CountRow icon={BusIcon} label="Contractors" value={contractors.length} />
                  <CountRow icon={BoxIcon} label="Clients" value={clients.length} />
                </div>
              </InsightCard>
            </div>

            <div className="col-span-12 sm:col-span-5">
              <InsightCard title="Top Locations" subtitle="Where volume concentrates">
                {locations.length === 0 ? (
                  <p className="py-4 text-center text-body-2-regular text-muted">Nothing to show yet.</p>
                ) : (
                  <LocationBarList data={locations} />
                )}
              </InsightCard>
            </div>
          </div>

          <OrderVolumeChartCard data={volumeData} />
        </div>
      </div>
    </div>
  );
}

/** Saved-location names carry their city as a suffix; the pill only has room for the place. */
function shortName(name: string) {
  return name.split("—")[0].trim();
}

/** Solid brand-filled stat, the counterpart to the reference's two colored tiles. */
function SolidStat({ value, caption, background }: { value: string; caption: string; background: string }) {
  return (
    <section className="flex items-center gap-3 rounded-2xl p-4" style={{ backgroundColor: background }}>
      <span
        className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
        style={{ backgroundColor: "rgba(255,255,255,0.16)" }}
      >
        <ArrowUpIcon size={20} strokeWidth={2.25} color="#ffffff" />
      </span>
      <div className="min-w-0">
        <p className="text-title-2-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          {value}
        </p>
        <p className="text-caption-1-regular" style={{ color: "rgba(255,255,255,0.7)" }}>
          {caption}
        </p>
      </div>
    </section>
  );
}

function CountRow({ icon: Icon, label, value }: { icon: typeof BusIcon; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-grey-light flex-shrink-0">
        <Icon size={16} strokeWidth={2.25} className="text-royal" />
      </span>
      <div className="min-w-0">
        <p className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>{value}</p>
        <p className="text-caption-1-regular text-muted">{label}</p>
      </div>
    </div>
  );
}

function Donut({ percent }: { percent: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;

  return (
    <div className="flex items-center justify-center py-1">
      <div className="relative" style={{ width: "96px", height: "96px" }}>
        <svg width="96" height="96" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#f0f0ee" strokeWidth="11" />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#1253fa"
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference - filled}`}
            transform="rotate(-90 48 48)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
            {percent}%
          </span>
          <span className="text-caption-2-regular text-muted">delivered</span>
        </div>
      </div>
    </div>
  );
}

function Pill({
  top,
  left,
  icon: Icon,
  tint,
  color,
  title,
  value,
}: {
  top: string;
  left: string;
  icon: typeof BusIcon;
  tint: string;
  color: string;
  title: string;
  value: string;
}) {
  return (
    <div
      className="absolute flex items-center gap-2 rounded-xl bg-white border border-border px-2.5 py-2"
      style={{ top, left, boxShadow: "0 4px 14px rgba(4,0,51,0.10)", maxWidth: "190px" }}
    >
      <span
        className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
        style={{ backgroundColor: tint }}
      >
        <Icon size={14} strokeWidth={2.25} color={color} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-caption-2-regular text-muted">{title}</p>
        <p className="text-caption-1-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>{value}</p>
      </div>
    </div>
  );
}
