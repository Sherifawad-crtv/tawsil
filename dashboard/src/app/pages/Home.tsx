import { useState } from "react";
import { Clock3, Truck, PackageCheck, PackagePlus, CalendarPlus, AlertTriangle } from "lucide-react";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import StubModal from "../components/StubModal";
import { HOME_METRICS, ATTENTION_ORDERS } from "../lib/mockData";
import type { AttentionOrder } from "../lib/types";

function formatDuration(minutes: number) {
  if (minutes <= 0) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function AttentionRow({ order }: { order: AttentionOrder }) {
  const flagged = order.reason === "stalled-pending" && order.minutesInStatus >= 120;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 border-b border-border last:border-b-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {flagged && <AlertTriangle size={16} className="text-status-pending flex-shrink-0" />}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-sm font-semibold text-navy"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {order.id}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <div className="mt-1 text-sm text-navy/80 truncate">{order.clientName}</div>
          <div className="mt-0.5 text-xs text-muted truncate">{order.detail}</div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-muted" style={{ fontFamily: "var(--font-mono)" }}>
          <Clock3 size={13} />
          {formatDuration(order.minutesInStatus)}
        </div>
        <button
          className="px-3.5 py-2 rounded-[var(--radius-control)] bg-navy text-white text-xs font-semibold cursor-pointer active:scale-95 transition-transform hover:bg-royal"
          style={{ fontFamily: "var(--font-sub)" }}
        >
          {order.action}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [stub, setStub] = useState<null | "order" | "monthly">(null);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl text-navy" style={{ fontFamily: "var(--font-heading)" }}>
          Home
        </h1>
        <p className="mt-1 text-sm text-muted">
          What needs your attention right now.
        </p>
      </div>

      {/* Metrics strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Pending Orders" value={HOME_METRICS.pendingOrders} icon={Clock3} accent="amber" />
        <MetricCard label="Active Orders" value={HOME_METRICS.activeOrders} icon={Truck} accent="navy" />
        <MetricCard label="Available Drivers" value={HOME_METRICS.availableDrivers} icon={Truck} accent="blue" />
        <MetricCard label="Completed Today" value={HOME_METRICS.completedToday} icon={PackageCheck} accent="green" />
      </div>

      {/* Attention-needed list */}
      <div>
        <h2 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wide" style={{ fontFamily: "var(--font-sub)" }}>
          Needs Attention
        </h2>
        <div className="rounded-[var(--radius-card)] bg-white border border-border overflow-hidden shadow-[0_2px_12px_rgba(4,0,51,0.04)]">
          {ATTENTION_ORDERS.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted">Nothing needs attention right now.</div>
          ) : (
            ATTENTION_ORDERS.map((order) => <AttentionRow key={order.id} order={order} />)
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wide" style={{ fontFamily: "var(--font-sub)" }}>
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => setStub("order")}
            className="flex items-center gap-4 rounded-[var(--radius-card)] bg-blue text-white p-5 text-left cursor-pointer active:scale-[0.98] transition-transform shadow-[0_4px_20px_rgba(18,83,250,0.25)] hover:brightness-110"
          >
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <PackagePlus size={22} />
            </div>
            <div>
              <div className="text-base" style={{ fontFamily: "var(--font-heading)" }}>New Order</div>
              <div className="text-xs text-white/80 mt-0.5">Start the multi-step order creation flow</div>
            </div>
          </button>

          <button
            onClick={() => setStub("monthly")}
            className="flex items-center gap-4 rounded-[var(--radius-card)] bg-white border border-border p-5 text-left cursor-pointer active:scale-[0.98] transition-transform hover:border-blue/40"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-soft text-blue flex items-center justify-center flex-shrink-0">
              <CalendarPlus size={22} />
            </div>
            <div>
              <div className="text-base text-navy" style={{ fontFamily: "var(--font-heading)" }}>New Monthly Order</div>
              <div className="text-xs text-muted mt-0.5">Set up a recurring contract</div>
            </div>
          </button>
        </div>
      </div>

      {stub && (
        <StubModal
          title={stub === "order" ? "New Order" : "New Monthly Order"}
          note={
            stub === "order"
              ? "The 5-step order creation modal (Client → Trip basics → Cargo → Waypoints → Review) is built in Section 2."
              : "The 4-step monthly contract flow (Parties → Schedule → Cargo & route → Review) is built in Section 6."
          }
          onClose={() => setStub(null)}
        />
      )}
    </div>
  );
}
