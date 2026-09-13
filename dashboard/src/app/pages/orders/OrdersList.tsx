import { useMemo, useState } from "react";
import { AddIcon, BoxIcon } from "@solar-icons/react/linear";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import OrderRow from "../../components/OrderRow";
import OrderFormModal from "../../components/orders/OrderFormModal";
import { Button } from "../../components/Button";
import { selectClass } from "../../lib/selectClass";
import { useDataStore } from "../../lib/store";
import { useRole } from "../../lib/RoleContext";
import { byId, getOrdersForRole, canCreateOrders } from "../../lib/selectors";
import type { OrderStatus, TripType } from "../../lib/types";

const STATUS_OPTIONS_BY_ROLE: Record<string, (OrderStatus | "All")[]> = {
  Supply: ["Pending"],
  Operations: ["All", "Assigned", "In Progress"],
  Sales: ["All", "Pending", "Assigned", "In Progress", "Completed", "Cancelled"],
  Admin: ["All", "Pending", "Assigned", "In Progress", "Completed", "Cancelled"],
};
const TRIP_OPTIONS: (TripType | "All")[] = ["All", "On Demand", "Daily", "Monthly"];

export default function OrdersList() {
  const { orders, clients, contractors } = useDataStore();
  const { role } = useRole();
  const statusOptions = STATUS_OPTIONS_BY_ROLE[role];
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "All">(statusOptions[0]);
  const [tripType, setTripType] = useState<TripType | "All">("All");
  const [sortBy, setSortBy] = useState<"pickup" | "status">("pickup");
  const [showCreate, setShowCreate] = useState(false);

  const roleOrders = useMemo(() => getOrdersForRole(orders, role), [orders, role]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = roleOrders.filter((o) => {
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
  }, [roleOrders, clients, contractors, search, status, tripType, sortBy]);

  const subtitle =
    role === "Supply"
      ? `${roleOrders.length} orders awaiting allocation`
      : role === "Operations"
        ? `${roleOrders.length} orders in progress`
        : `${roleOrders.length} total orders`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orders"
        subtitle={subtitle}
        action={
          canCreateOrders(role) ? (
            <Button leadingIcon={AddIcon} onClick={() => setShowCreate(true)}>
              New Order
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by Order ID, client, or contractor…" />
        {statusOptions.length > 1 && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus | "All")}
            className={selectClass}
            style={{ fontFamily: "var(--font-sub)" }}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
            ))}
          </select>
        )}
        <select
          value={tripType}
          onChange={(e) => setTripType(e.target.value as TripType | "All")}
          className={selectClass}
          style={{ fontFamily: "var(--font-sub)" }}
        >
          {TRIP_OPTIONS.map((t) => (
            <option key={t} value={t}>{t === "All" ? "All Trip Types" : t}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "pickup" | "status")}
          className={selectClass}
          style={{ fontFamily: "var(--font-sub)" }}
        >
          <option value="pickup">Sort: Pickup Date</option>
          <option value="status">Sort: Status</option>
        </select>
      </div>

      <div className="rounded-2xl bg-tile overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={BoxIcon} title="No orders match your filters" />
        ) : (
          filtered.map((order) => <OrderRow key={order.id} order={order} />)
        )}
      </div>

      {showCreate && <OrderFormModal mode="create" onClose={() => setShowCreate(false)} />}
    </div>
  );
}
