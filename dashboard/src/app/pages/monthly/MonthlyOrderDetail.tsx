import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeftIcon, ClockCircleIcon, CalendarDateIcon } from "@solar-icons/react/bold-duotone";
import OrdersTable from "../../components/OrdersTable";
import PageHeader from "../../components/PageHeader";
import MultiDateCalendar from "../../components/MultiDateCalendar";
import { ProgressBar } from "../../components/boardui/ProgressBar";
import { useDataStore } from "../../lib/store";
import { byId } from "../../lib/selectors";
import { formatEGP } from "../../lib/format";

export default function MonthlyOrderDetail() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { monthlyOrders, clients, contractors, orders } = useDataStore();

  const contract = monthlyOrders.find((m) => m.id === contractId);
  if (!contract) {
    return (
      <div className="text-center py-20 text-body-regular text-muted">
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
      <button onClick={() => navigate("/monthly-orders")} className="flex items-center gap-1.5 text-body-2-regular text-muted hover:text-navy cursor-pointer w-fit">
        <ArrowLeftIcon size={15} /> Back to Monthly Orders
      </button>

      <PageHeader title={contract.id} subtitle={`${client?.name ?? "—"} · ${contractor?.name ?? "Unassigned"}`} />

      <div className="grid sm:grid-cols-4 gap-4">
        <StatTile icon={ClockCircleIcon} label="Daily Time" value={contract.dailyPickupTime} />
        <StatTile label="Total Days" value={String(total)} />
        <StatTile label="Executed" value={String(executedCount)} accent="green" />
        <StatTile label="Remaining" value={String(remaining)} accent={remaining <= 2 ? "amber" : undefined} />
      </div>

      <div className="rounded-2xl bg-white border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>Progress</h3>
          <span className="text-caption-1-regular text-muted" style={{ fontFamily: "var(--font-mono)" }}>{pct}%</span>
        </div>
        <ProgressBar value={pct} className="mb-4" />
        <div className="flex items-center gap-2 mb-3">
          <CalendarDateIcon size={14} className="text-muted" />
          <span className="text-caption-1-regular text-muted uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>Execution Calendar</span>
        </div>
        <MultiDateCalendar
          ariaLabel="Execution calendar"
          selectedDates={new Set(contract.dates)}
          focusDate={contract.dates[0]}
          edgeClassNameFor={(iso) => (executed.has(iso) ? "bg-status-completed/35" : "bg-blue-soft")}
          legend={
            <div className="flex items-center gap-4 text-caption-1-regular text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-status-completed/35" /> Executed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-soft" /> Pending
              </span>
            </div>
          }
        />
      </div>

      <div className="rounded-2xl bg-white border border-border p-4">
        <h3 className="text-body-semibold text-navy mb-4" style={{ fontFamily: "var(--font-sub)" }}>Pricing Breakdown</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-body-2-regular">
          <PriceRow label="Client Price (gross, /day)" value={formatEGP(contract.clientPricePerDayEGP)} />
          <PriceRow label="Contractor Price (net, /day)" value={formatEGP(contract.contractorPricePerDayEGP)} />
          <PriceRow label="Company Margin (/day)" value={formatEGP(margin)} />
          <PriceRow label="VAT" value={`${contract.vatPercent}%`} />
        </div>
      </div>

      <div>
        <h3 className="text-body-semibold text-navy mb-3" style={{ fontFamily: "var(--font-sub)" }}>Spawned Orders</h3>
        <OrdersTable
          orders={spawnedOrders}
          emptyTitle="No orders generated yet"
          emptyNote="This contract is still a Draft."
        />
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, accent }: { icon?: React.ElementType; label: string; value: string; accent?: "green" | "amber" }) {
  return (
    <div className="rounded-2xl bg-white border border-border p-4">
      <div className="flex items-center gap-1.5 text-caption-1-regular text-muted uppercase tracking-wide mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
        {Icon && <Icon size={12} />}
        {label}
      </div>
      <div
        className="text-title-2-medium"
        style={{
          fontFamily: "var(--font-heading)",
          color: accent === "green" ? "var(--color-status-completed)" : accent === "amber" ? "var(--color-status-pending)" : "var(--color-navy)",
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
      <span className="text-navy text-body-2-semibold">{value}</span>
    </div>
  );
}
