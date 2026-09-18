import { useState } from "react";
import { useNavigate } from "react-router";
import { ClockCircleIcon, BusIcon, CheckCircleIcon, AddIcon, CalendarAddIcon, DangerTriangleIcon } from "@solar-icons/react/linear";
import MetricCard from "../components/MetricCard";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { Button } from "../components/Button";
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
  canActOnAttention,
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

function AttentionRow({
  order,
  canAct,
  onEdit,
}: {
  order: AttentionOrder;
  /** Whether this role owns the row's nudge (assign / follow up / renew). */
  canAct: boolean;
  /** Offered instead when the role can only edit. Absent for monthly
   *  contracts, which have no edit form. */
  onEdit?: () => void;
}) {
  const navigate = useNavigate();
  const flagged = order.reason === "stalled-pending" && order.minutesInStatus >= 120;
  const target = order.reason === "monthly-renewal" ? `/monthly-orders/${order.id}` : `/orders/${order.id}`;
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 px-4 py-2.5 border-b border-border last:border-b-0 cursor-pointer hover:bg-grey-light transition-colors"
      onClick={() => navigate(target)}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {flagged && <DangerTriangleIcon size={15} className="text-status-pending flex-shrink-0" />}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-body-2-semibold text-navy"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {order.id}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <div className="mt-0.5 text-body-2-regular text-navy/80 truncate">{order.clientName}</div>
          <div className="mt-0.5 text-caption-1-regular text-muted truncate">{order.detail}</div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-caption-1-regular text-muted" style={{ fontFamily: "var(--font-mono)" }}>
          <ClockCircleIcon size={12} />
          {formatDuration(order.minutesInStatus)}
        </div>
        {canAct ? (
          <Button size="small">{order.action}</Button>
        ) : onEdit ? (
          <Button
            size="small"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            Edit
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default function Home() {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const { orders, clients, drivers, monthlyOrders } = useDataStore();
  const { role } = useRole();
  const metrics = getHomeMetrics(orders, drivers);
  const attentionOrders = getAttentionOrdersForRole(getAttentionOrders(orders, monthlyOrders, clients), role);
  const showQuickActions = canCreateOrders(role);

  const editingOrder = editingOrderId ? orders.find((o) => o.id === editingOrderId) : undefined;

  const volumeData = getOrderVolumeWeekOverWeek(orders);
  const statusData = getOrdersByStatus(orders);
  const completedDelta = metrics.completedToday - metrics.completedYesterday;

  const hourlyProblems = getProblemsByHour(orders, role);
  const locationProblems = getProblemsByLocation(orders, role);
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
      <PageHeader
        title="Home"
        subtitle={subtitle}
        action={
          showQuickActions ? (
            <div className="flex flex-wrap gap-2">
              <Button leadingIcon={AddIcon} onClick={() => setShowOrderModal(true)}>
                New Order
              </Button>
              <Button variant="secondary" leadingIcon={CalendarAddIcon} onClick={() => setShowMonthlyModal(true)}>
                New Monthly Order
              </Button>
            </div>
          ) : undefined
        }
      />

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

      {/* Problem hotspots - when and where issues cluster */}
      <div className="grid lg:grid-cols-2 gap-3">
        <InsightCard title="When Problems Happen" subtitle="Open issues by time of day">
          {totalProblems === 0 ? (
            <div className="py-6 text-center text-body-2-regular text-muted">No open problems right now.</div>
          ) : (
            <ProblemsHourlyChart data={hourlyProblems} />
          )}
        </InsightCard>

        <InsightCard title="Where Problems Happen" subtitle="Top pickup locations with open issues">
          {locationProblems.length === 0 ? (
            <div className="py-6 text-center text-body-2-regular text-muted">No open problems right now.</div>
          ) : (
            <LocationBarList data={locationProblems} />
          )}
        </InsightCard>
      </div>

      {/* Attention-needed list */}
      <div>
        <h2 className="text-caption-1-semibold text-navy mb-2 uppercase tracking-wide" style={{ fontFamily: "var(--font-sub)" }}>
          {role === "Supply" ? "Pending Allocation" : role === "Operations" ? "Needs Follow-up" : "Needs Attention"}
        </h2>
        <div className="rounded-2xl bg-white border border-border overflow-hidden">
          {attentionOrders.length === 0 ? (
            <div className="px-5 py-10 text-center text-body-regular text-muted">Nothing needs attention right now.</div>
          ) : (
            attentionOrders.map((item) => (
              <AttentionRow
                key={item.id}
                order={item}
                canAct={canActOnAttention(role)}
                onEdit={
                  item.reason === "monthly-renewal" ? undefined : () => setEditingOrderId(item.id)
                }
              />
            ))
          )}
        </div>
      </div>

      {showOrderModal && <OrderFormModal mode="create" onClose={() => setShowOrderModal(false)} />}
      {editingOrder && (
        <OrderFormModal mode="edit" initialOrder={editingOrder} onClose={() => setEditingOrderId(null)} />
      )}
      {showMonthlyModal && <MonthlyOrderFormModal onClose={() => setShowMonthlyModal(false)} />}
    </div>
  );
}
