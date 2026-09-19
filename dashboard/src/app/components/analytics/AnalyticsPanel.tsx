import { BoxIcon, CheckCircleIcon, ForbiddenIcon, ChartSquareIcon } from "@solar-icons/react/linear";
import MetricCard from "../MetricCard";
import InsightCard from "../InsightCard";
import StatusBreakdownBar from "../charts/StatusBreakdownBar";
import { SegmentedBar } from "../boardui/SegmentedBar";
import { ProgressBar } from "../boardui/ProgressBar";
import WaypointAnalyticsTable from "../WaypointAnalyticsTable";
import { entityAnalytics } from "../../lib/analytics";
import type { Order } from "../../lib/types";

// One categorical colour per cargo-mix slice, off the ported chart-N ramp -
// there's no status meaning to a cargo type the way there is for an order
// status, so this is a plain series palette, not a semantic one.
const CARGO_COLORS = [
  "var(--color-chart-1-active)",
  "var(--color-chart-2-active)",
  "var(--color-chart-3-active)",
  "var(--color-chart-4-active)",
  "var(--color-chart-5-active)",
  "var(--color-chart-7-active)",
  "var(--color-chart-neutral)", // "Other", always last
];

/**
 * A real Analytics tab: what this entity's own orders actually show, not a
 * single table. Every figure comes from entityAnalytics, which reads only
 * fields this data model has - no on-time/SLA rate is shown because no
 * order carries the timestamp that would back one.
 */
export default function AnalyticsPanel({ orders, filenamePrefix }: { orders: Order[]; filenamePrefix: string }) {
  const stats = entityAnalytics(orders);

  if (orders.length === 0) {
    return <p className="py-10 text-center text-body-2-regular text-muted">No orders yet - analytics will fill in once there are some.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard label="Total Orders" value={stats.total} icon={BoxIcon} accent="navy" />
        <MetricCard label="Completed" value={stats.completed} icon={CheckCircleIcon} accent="green" />
        <MetricCard label="Cancelled" value={stats.cancelled} icon={ForbiddenIcon} accent="amber" />
        <MetricCard label="Completion Rate" value={`${stats.completionRate}%`} icon={ChartSquareIcon} accent="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <InsightCard title="Status mix" subtitle="Every order this entity has ever raised">
          <StatusBreakdownBar data={stats.statusMix} />
        </InsightCard>

        <InsightCard title="Cargo mix" subtitle="What's actually being moved">
          <SegmentedBar
            showPercent={false}
            segments={stats.cargoMix.map((c, i) => ({ key: c.label, label: c.label, value: c.count, color: CARGO_COLORS[i % CARGO_COLORS.length] }))}
          />
        </InsightCard>
      </div>

      <InsightCard title="Orders per month" subtitle="Last 6 months, by when the order was raised">
        <ProgressBar direction="vertical" bars={stats.monthly.map((m) => ({ label: m.label, value: m.count }))} />
      </InsightCard>

      <div className="flex flex-col gap-3">
        <h3 className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>Waypoints</h3>
        <WaypointAnalyticsTable orders={orders} filenamePrefix={filenamePrefix} />
      </div>
    </div>
  );
}
