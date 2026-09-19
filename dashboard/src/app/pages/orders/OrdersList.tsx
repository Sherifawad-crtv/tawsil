import { useMemo, useState } from "react";
import { AddIcon } from "@solar-icons/react/line-duotone";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import OrdersTable from "../../components/OrdersTable";
import OrderFormModal from "../../components/orders/OrderFormModal";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";
import { useDataStore } from "../../lib/store";
import { useRole } from "../../lib/RoleContext";
import { byId, getOrdersForRole, canCreateOrders } from "../../lib/selectors";
import type { OrderStatus, Role, TripType } from "../../lib/types";

// Keyed by Role, not string, so adding a role without a row here is a
// compile error rather than a blank page: Executive was missing, and
// statusOptions[0] on undefined took the whole app down.
const ALL_STATUSES: (OrderStatus | "All")[] = ["All", "Pending", "Assigned", "In Progress", "Completed", "Cancelled"];
const STATUS_OPTIONS_BY_ROLE: Record<Role, (OrderStatus | "All")[]> = {
  Supply: ["Pending"],
  Operations: ["All", "Assigned", "In Progress"],
  Sales: ALL_STATUSES,
  Admin: ALL_STATUSES,
  Executive: ALL_STATUSES,
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
          <Select
            aria-label="Filter by status"
            value={status}
            onChange={(v) => setStatus(v as OrderStatus | "All")}
            options={statusOptions.map((s) => ({ value: s, label: s === "All" ? "All Statuses" : s }))}
          />
        )}
        <Select
          aria-label="Filter by trip type"
          value={tripType}
          onChange={(v) => setTripType(v as TripType | "All")}
          options={TRIP_OPTIONS.map((t) => ({ value: t, label: t === "All" ? "All Trip Types" : t }))}
        />
        <Select
          aria-label="Sort orders"
          value={sortBy}
          onChange={(v) => setSortBy(v as "pickup" | "status")}
          options={[
            { value: "pickup", label: "Sort: Pickup Date" },
            { value: "status", label: "Sort: Status" },
          ]}
        />
      </div>

      <OrdersTable orders={filtered} emptyTitle="No orders match your filters" />

      {showCreate && <OrderFormModal mode="create" onClose={() => setShowCreate(false)} />}
    </div>
  );
}
