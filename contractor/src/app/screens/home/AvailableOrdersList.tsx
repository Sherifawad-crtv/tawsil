import { useMemo, useState } from "react";
import ScreenHeader from "../../components/ScreenHeader";
import SegmentedControl from "../../components/SegmentedControl";
import TripCard from "../../components/TripCard";
import EmptyState from "../../components/EmptyState";
import InboxRounded from "../../components/icons/InboxRounded";
import { useDataStore } from "../../lib/store";
import { getAvailableOrders } from "../../lib/selectors";

export default function AvailableOrdersList() {
  const { orders } = useDataStore();
  const [filter, setFilter] = useState<"On Demand" | "Monthly">("On Demand");
  const available = useMemo(() => getAvailableOrders(orders), [orders]);
  const filtered = useMemo(() => available.filter((o) => o.tripType === filter), [available, filter]);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title={`Available Orders (${available.length})`} />
      <div className="w-full max-w-lg mx-auto px-4 pb-8">
        <div className="mb-3">
          <SegmentedControl
            ariaLabel="Available order type"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "On Demand", label: "On Demand" },
              { value: "Monthly", label: "Monthly" },
            ]}
          />
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<InboxRounded sx={{ fontSize: 24, color: "#9CA3AF" }} />}
            title="No Available orders"
            subtitle="You have no orders right now. New orders will appear here automatically."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((o) => (
              <TripCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
