import { useState } from "react";
import { useNavigate } from "react-router";
import { ClockCircleIcon, BusIcon, CheckCircleIcon, AddSquareIcon, CalendarAddIcon, DangerTriangleIcon } from "@solar-icons/react/linear";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import OrderFormModal from "../components/orders/OrderFormModal";
import MonthlyOrderFormModal from "../components/monthly/MonthlyOrderFormModal";
import { getHomeMetrics, getAttentionOrders, getAttentionOrdersForRole, canCreateOrders } from "../lib/selectors";
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
        <MetricCard label="Completed Today" value={metrics.completedToday} icon={CheckCircleIcon} accent="green" />
      </div>

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
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex items-center gap-3 rounded-[var(--radius-card)] bg-blue text-white p-3.5 text-left cursor-pointer active:scale-[0.98] transition-transform shadow-[0_4px_20px_rgba(18,83,250,0.25)] hover:brightness-110"
            >
              <div className="w-9 h-9 rounded-[var(--radius-control)] bg-white/15 flex items-center justify-center flex-shrink-0">
                <AddSquareIcon size={18} />
              </div>
              <div>
                <div className="text-sm" style={{ fontFamily: "var(--font-heading)" }}>New Order</div>
                <div className="text-xs text-white/80 mt-0.5">Start the multi-step order creation flow</div>
              </div>
            </button>

            <button
              onClick={() => setShowMonthlyModal(true)}
              className="flex items-center gap-3 rounded-[var(--radius-card)] bg-white border border-border p-3.5 text-left cursor-pointer active:scale-[0.98] transition-transform hover:border-blue/40"
            >
              <div className="w-9 h-9 rounded-[var(--radius-control)] bg-blue-soft text-blue flex items-center justify-center flex-shrink-0">
                <CalendarAddIcon size={18} />
              </div>
              <div>
                <div className="text-sm text-navy" style={{ fontFamily: "var(--font-heading)" }}>New Monthly Order</div>
                <div className="text-xs text-muted mt-0.5">Set up a recurring contract</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {showOrderModal && <OrderFormModal mode="create" onClose={() => setShowOrderModal(false)} />}
      {showMonthlyModal && <MonthlyOrderFormModal onClose={() => setShowMonthlyModal(false)} />}
    </div>
  );
}
