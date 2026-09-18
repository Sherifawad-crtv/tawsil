import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import InboxRounded from "@mui/icons-material/InboxRounded";
import SegmentedControl from "../../components/SegmentedControl";
import TripCard from "../../components/TripCard";
import EmptyState from "../../components/EmptyState";
import { useDataStore } from "../../lib/store";
import { getPendingOrders, getActiveOrders } from "../../lib/selectors";

/** Segmented Pending | Active, same pattern as Contractor's Home - confirmed with the user over the doc's one open question (only "Active Trips" was shown in the screenshot, no toggle visible). */
export default function OrdersTab() {
  const location = useLocation();
  const initialTab = (location.state as { tab?: "pending" | "active" } | null)?.tab ?? "pending";
  const [tab, setTab] = useState<"pending" | "active">(initialTab);
  const { orders } = useDataStore();

  const pending = useMemo(() => getPendingOrders(orders), [orders]);
  const active = useMemo(() => getActiveOrders(orders), [orders]);
  const shown = tab === "pending" ? pending : active;

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)", paddingBottom: "8px" }}>
      <h1 className="mb-4" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", color: "#040033" }}>
        Orders
      </h1>

      <div className="mb-4">
        <SegmentedControl
          ariaLabel="Orders view"
          value={tab}
          onChange={setTab}
          options={[
            { value: "pending", label: `Pending (${pending.length})` },
            { value: "active", label: `Active (${active.length})` },
          ]}
        />
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={<InboxRounded sx={{ fontSize: 24, color: "#9CA3AF" }} />}
          title={tab === "pending" ? "No pending orders" : "No active orders"}
          subtitle={tab === "pending" ? "Newly assigned orders will appear here." : "Trips you've started will appear here."}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {shown.map((o) => (
            <TripCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
