import { useMemo, useState } from "react";
import { Plus, Package } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import OrderRow from "../../components/OrderRow";
import OrderFormModal from "../../components/orders/OrderFormModal";
import { useDataStore } from "../../lib/store";
import { byId } from "../../lib/selectors";
import type { OrderStatus, TripType } from "../../lib/types";

const STATUS_OPTIONS: (OrderStatus | "All")[] = ["All", "Pending", "Assigned", "In Progress", "Completed", "Cancelled"];
const TRIP_OPTIONS: (TripType | "All")[] = ["All", "On Demand", "Daily", "Monthly"];

export default function OrdersList() {
  const { orders, clients, contractors } = useDataStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "All">("All");
  const [tripType, setTripType] = useState<TripType | "All">("All");
  const [sortBy, setSortBy] = useState<"pickup" | "status">("pickup");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = orders.filter((o) => {
      if (status !== "All" && o.status !== status) return false;
      if (tripType !== "All" && o.tripType !== tripType) return false;
      if (q) {
        const client = byId(clients, o.clientId);
        const contractor = byId(contractors, o.contractorId);
        const haystack = `${o.id} ${client?.name ?? ""} ${contractor?.name ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) =>
      sortBy === "pickup"
        ? new Date(b.pickupAt).getTime() - new Date(a.pickupAt).getTime()
        : a.status.localeCompare(b.status)
    );
    return list;
  }, [orders, clients, contractors, search, status, tripType, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} total orders`}
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-[var(--radius-control)] bg-blue text-white text-sm font-semibold cursor-pointer hover:brightness-110"
            style={{ fontFamily: "var(--font-sub)" }}
          >
            <Plus size={16} /> New Order
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by Order ID, client, or contractor…" />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus | "All")}
          className="px-3 py-1.5 rounded-[var(--radius-control)] border border-border bg-white text-sm text-navy cursor-pointer"
          style={{ fontFamily: "var(--font-sub)" }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
          ))}
        </select>
        <select
          value={tripType}
          onChange={(e) => setTripType(e.target.value as TripType | "All")}
          className="px-3 py-1.5 rounded-[var(--radius-control)] border border-border bg-white text-sm text-navy cursor-pointer"
          style={{ fontFamily: "var(--font-sub)" }}
        >
          {TRIP_OPTIONS.map((t) => (
            <option key={t} value={t}>{t === "All" ? "All Trip Types" : t}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "pickup" | "status")}
          className="px-3 py-1.5 rounded-[var(--radius-control)] border border-border bg-white text-sm text-navy cursor-pointer"
          style={{ fontFamily: "var(--font-sub)" }}
        >
          <option value="pickup">Sort: Pickup Date</option>
          <option value="status">Sort: Status</option>
        </select>
      </div>

      <div className="rounded-[var(--radius-card)] bg-white border border-border overflow-hidden shadow-[0_2px_12px_rgba(4,0,51,0.04)]">
        {filtered.length === 0 ? (
          <EmptyState icon={Package} title="No orders match your filters" />
        ) : (
          filtered.map((order) => <OrderRow key={order.id} order={order} />)
        )}
      </div>

      {showCreate && <OrderFormModal mode="create" onClose={() => setShowCreate(false)} />}
    </div>
  );
}
