import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Clock, CalendarDays, Package } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import OrderRow from "../../components/OrderRow";
import { useDataStore } from "../../lib/store";
import { byId } from "../../lib/selectors";
import { formatEGP, formatDate } from "../../lib/format";

export default function MonthlyOrderDetail() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { monthlyOrders, clients, contractors, orders } = useDataStore();

  const contract = monthlyOrders.find((m) => m.id === contractId);
  if (!contract) {
    return (
      <div className="text-center py-20 text-sm text-muted">
        Monthly contract not found. <Link to="/monthly-orders" className="text-blue font-semibold">Back to Monthly Orders</Link>
      </div>
    );
  }

  const client = byId(clients, contract.clientId);
  const contractor = byId(contractors, contract.contractorId);
  const executed = new Set(contract.executedDates);
  const total = contract.dates.length;
  const executedCount = contract.executedDates.length;
  const remaining = total - executedCount;
  const pct = total > 0 ? Math.round((executedCount / total) * 100) : 0;
  const spawnedOrders = orders.filter((o) => o.monthlyOrderId === contract.id).sort((a, b) => Number(a.dayLabel) - Number(b.dayLabel));

  const margin = contract.clientPricePerDayEGP - contract.contractorPricePerDayEGP;

  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => navigate("/monthly-orders")} className="flex items-center gap-1.5 text-sm text-muted hover:text-navy cursor-pointer w-fit">
        <ArrowLeft size={15} /> Back to Monthly Orders
      </button>

      <div>
        <h1 className="text-2xl md:text-3xl text-navy" style={{ fontFamily: "var(--font-heading)" }}>{contract.id}</h1>
        <p className="mt-1.5 text-sm text-muted">{client?.name ?? "—"} · {contractor?.name ?? "Unassigned"}</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatTile icon={Clock} label="Daily Time" value={contract.dailyPickupTime} />
        <StatTile label="Total Days" value={String(total)} />
        <StatTile label="Executed" value={String(executedCount)} accent="green" />
        <StatTile label="Remaining" value={String(remaining)} accent={remaining <= 2 ? "amber" : undefined} />
      </div>

      <div className="rounded-[var(--radius-card)] bg-white border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>Progress</h3>
          <span className="text-xs text-muted" style={{ fontFamily: "var(--font-mono)" }}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-grey-light overflow-hidden mb-4">
          <div className="h-full bg-blue rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays size={14} className="text-muted" />
          <span className="text-xs text-muted uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>Execution Calendar</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {contract.dates.map((date, i) => (
            <div
              key={date}
              title={`${formatDate(date)} — ${executed.has(date) ? "Executed" : "Pending"}`}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-semibold ${
                executed.has(date) ? "bg-status-completed text-white" : "bg-grey-light text-muted"
              }`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] bg-white border border-border p-5">
        <h3 className="text-sm font-semibold text-navy mb-4" style={{ fontFamily: "var(--font-sub)" }}>Pricing Breakdown</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <PriceRow label="Client Price (gross, /day)" value={formatEGP(contract.clientPricePerDayEGP)} />
          <PriceRow label="Contractor Price (net, /day)" value={formatEGP(contract.contractorPricePerDayEGP)} />
          <PriceRow label="Company Margin (/day)" value={formatEGP(margin)} />
          <PriceRow label="VAT" value={`${contract.vatPercent}%`} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-navy mb-3" style={{ fontFamily: "var(--font-sub)" }}>Spawned Orders</h3>
        <div className="rounded-[var(--radius-card)] bg-white border border-border overflow-hidden">
          {spawnedOrders.length === 0 ? (
            <EmptyState icon={Package} title="No orders generated yet" note="This contract is still a Draft." />
          ) : (
            spawnedOrders.map((order) => <OrderRow key={order.id} order={order} />)
          )}
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, accent }: { icon?: React.ElementType; label: string; value: string; accent?: "green" | "amber" }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-white border border-border p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted uppercase tracking-wide mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
        {Icon && <Icon size={12} />}
        {label}
      </div>
      <div
        className="text-xl"
        style={{
          fontFamily: "var(--font-heading)",
          color: accent === "green" ? "#16803C" : accent === "amber" ? "#D97706" : "#040033",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className="text-navy font-semibold">{value}</span>
    </div>
  );
}
