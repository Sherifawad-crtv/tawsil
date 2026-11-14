import { useMemo } from "react";
import ScreenHeader from "../../components/ScreenHeader";
import TripCard from "../../components/TripCard";
import EmptyState from "../../components/EmptyState";
import InboxRounded from "../../components/icons/InboxRounded";
import { useDataStore } from "../../lib/store";
import { getInProgressOrders } from "../../lib/selectors";

export default function ActiveTripsList() {
  const { orders } = useDataStore();
  const trips = useMemo(() => getInProgressOrders(orders), [orders]);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title="Active Trips" subtitle={`${trips.length} in progress`} />
      <div className="w-full max-w-lg mx-auto px-4 pt-4 pb-8">
        {trips.length === 0 ? (
          <EmptyState
            icon={<InboxRounded sx={{ fontSize: 28, color: "#D8D9D4" }} />}
            title="No active trips"
            subtitle="Dispatched orders will appear here once they're on their way."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {trips.map((o) => (
              <TripCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
