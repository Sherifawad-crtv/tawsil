import { useState } from "react";
import { useNavigate } from "react-router";
import { ClockCircleIcon, BusIcon, CheckCircleIcon, AddIcon, CalendarAddIcon, DangerTriangleIcon } from "@solar-icons/react/linear";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import InsightCard from "../components/InsightCard";
import OrderVolumeChartCard from "../components/charts/OrderVolumeChartCard";
import StatusBreakdownBar from "../components/charts/StatusBreakdownBar";
import ProblemsHourlyChart from "../components/charts/ProblemsHourlyChart";
import LocationBarList from "../components/charts/LocationBarList";
import OrderFormModal from "../components/orders/OrderFormModal";
import MonthlyOrderFormModal from "../components/monthly/MonthlyOrderFormModal";
import {
  getHomeMetrics,
  getAttentionOrders,
  getAttentionOrdersForRole,
  canCreateOrders,
  getOrderVolumeWeekOverWeek,
  getOrdersByStatus,
  getProblemsByHour,
  getProblemsByLocation,
} from "../lib/selectors";
import { formatDuration } from "../lib/format";
import { useDataStore } from "../lib/store";
import { useRole } from "../lib/RoleContext";
import type { AttentionOrder } from "../lib/types";

function AttentionRow({ order }: { order: AttentionOrder }) {
  const navigate = useNavigate();
  const flagged = order.reason === "stalled-pending" && order.minutesInStatus >= 120;
  const target = order.reason === "monthly-renewal" ? `/monthly-orders/${order.id}` : `/orders/${order.id}`;
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 px-4 py-2.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-grey-light/60 transition-colors"
      onClick={() => navigate(target)}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {flagged && <DangerTriangleIcon size={15} className="text-status-pending flex-shrink-0" />}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[13px] font-semibold text-navy"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {order.id}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <div className="mt-0.5 text-[13px] text-navy/80 truncate">{order.clientName}</div>
          <div className="mt-0.5 text-xs text-muted truncate">{order.detail}</div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-muted" style={{ fontFamily: "var(--font-mono)" }}>
          <ClockCircleIcon size={12} />
          {formatDuration(order.minutesInStatus)}
        </div>
        <button
          className="px-3 py-1.5 rounded-[var(--radius-control)] bg-navy text-white text-[12px] font-semibold cursor-pointer active:scale-95 transition-transform hover:bg-royal"
          style={{ fontFamily: "var(--font-sub)" }}
        >
          {order.action}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const { orders, clients, drivers, monthlyOrders } = useDataStore();
  const { role } = useRole();
  const metrics = getHomeMetrics(orders, drivers);
  const attentionOrders = getAttentionOrdersForRole(getAttentionOrders(orders, monthlyOrders, clients), role);
  const showAttention = role !== "Sales";
  const showQuickActions = canCreateOrders(role);

  const volumeData = getOrderVolumeWeekOverWeek(orders);
  const statusData = getOrdersByStatus(orders);
  const completedDelta = metrics.completedToday - metrics.completedYesterday;

  const hourlyProblems = showAttention ? getProblemsByHour(orders, role) : [];
  const locationProblems = showAttention ? getProblemsByLocation(orders, role) : [];
  const totalProblems = hourlyProblems.reduce((sum, d) => sum + d.count, 0);

  const subtitle =
    role === "Sales"
      ? "Your orders at a glance."
      : role === "Supply"
        ? "Orders waiting on allocation."
        : role === "Operations"
          ? "What needs follow-up right now."
          : "What needs your attention right now.";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl text-navy" style={{ fontFamily: "var(--font-heading)" }}>
          Home
        </h1>
        <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>
      </div>

      {/* Metrics strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Pending Orders" value={metrics.pendingOrders} icon={ClockCircleIcon} accent="amber" />
        <MetricCard label="Active Orders" value={metrics.activeOrders} icon={BusIcon} accent="navy" />
        <MetricCard label="Available Drivers" value={metrics.availableDrivers} icon={BusIcon} accent="blue" />
        <MetricCard
          label="Completed Today"
          value={metrics.completedToday}
          icon={CheckCircleIcon}
          accent="green"
          delta={`${completedDelta >= 0 ? "+" : ""}${completedDelta} vs yesterday`}
          deltaColor={completedDelta > 0 ? "positive" : completedDelta < 0 ? "negative" : "neutral"}
        />
      </div>

      {/* Volume trend + status mix */}
      <div className="grid lg:grid-cols-2 gap-3">
        <OrderVolumeChartCard data={volumeData} />

        <InsightCard title="Orders by Status" subtitle={`${orders.length} total orders`}>
          <StatusBreakdownBar data={statusData} />
        </InsightCard>
      </div>

      {/* Problem hotspots - when and where issues cluster, not shown to Sales */}
      {showAttention && (
        <div className="grid lg:grid-cols-2 gap-3">
          <InsightCard title="When Problems Happen" subtitle="Open issues by time of day">
            {totalProblems === 0 ? (
              <div className="py-6 text-center text-xs text-muted">No open problems right now.</div>
            ) : (
              <ProblemsHourlyChart data={hourlyProblems} />
            )}
          </InsightCard>

          <InsightCard title="Where Problems Happen" subtitle="Top pickup locations with open issues">
            {locationProblems.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted">No open problems right now.</div>
            ) : (
              <LocationBarList data={locationProblems} />
            )}
          </InsightCard>
        </div>
      )}

      {/* Attention-needed list - not shown to Sales, which only tracks orders */}
      {showAttention && (
        <div>
          <h2 className="text-xs font-semibold text-navy mb-2 uppercase tracking-wide" style={{ fontFamily: "var(--font-sub)" }}>
            {role === "Supply" ? "Pending Allocation" : role === "Operations" ? "Needs Follow-up" : "Needs Attention"}
          </h2>
          <div className="rounded-[var(--radius-card)] bg-white border border-border overflow-hidden shadow-[0_2px_12px_rgba(4,0,51,0.04)]">
            {attentionOrders.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-muted">Nothing needs attention right now.</div>
            ) : (
              attentionOrders.map((order) => <AttentionRow key={order.id} order={order} />)
            )}
          </div>
        </div>
      )}

      {/* Quick actions - order creation is Sales' job */}
      {showQuickActions && (
        <div>
          <h2 className="text-xs font-semibold text-navy mb-2 uppercase tracking-wide" style={{ fontFamily: "var(--font-sub)" }}>
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex items-center gap-1.5 pl-2.5 pr-3 py-[7px] rounded-[var(--radius-control)] bg-blue text-white text-xs font-semibold cursor-pointer active:scale-95 transition-transform hover:brightness-110"
              style={{ fontFamily: "var(--font-sub)" }}
            >
              <AddIcon size={14} /> New Order
            </button>

            <button
              onClick={() => setShowMonthlyModal(true)}
              className="flex items-center gap-1.5 pl-2.5 pr-3 py-[7px] rounded-[var(--radius-control)] bg-white border border-border text-xs font-semibold text-navy cursor-pointer active:scale-95 transition-transform hover:border-blue/40"
              style={{ fontFamily: "var(--font-sub)" }}
            >
              <CalendarAddIcon size={14} /> New Monthly Order
            </button>
          </div>
        </div>
      )}

      {showOrderModal && <OrderFormModal mode="create" onClose={() => setShowOrderModal(false)} />}
      {showMonthlyModal && <MonthlyOrderFormModal onClose={() => setShowMonthlyModal(false)} />}
    </div>
  );
}
