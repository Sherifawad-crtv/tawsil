import { useMemo } from "react";
import ScreenHeader from "../../components/ScreenHeader";
import TripCard from "../../components/TripCard";
import EmptyState from "../../components/EmptyState";
import InboxRounded from "../../components/icons/InboxRounded";
import { useDataStore } from "../../lib/store";
import { getUnassignedOrders } from "../../lib/selectors";

export default function NeedsDispatchList() {
  const { orders } = useDataStore();
  const waiting = useMemo(() => getUnassignedOrders(orders), [orders]);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title="Needs Dispatch" subtitle={`${waiting.length} waiting for a driver`} />
      <div className="w-full max-w-lg mx-auto px-4 pt-4 pb-8">
        {waiting.length === 0 ? (
          <EmptyState
            icon={<InboxRounded sx={{ fontSize: 28, color: "#D8D9D4" }} />}
            title="Nothing to dispatch"
            subtitle="Accepted orders without a driver will appear here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {waiting.map((o) => (
              <TripCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
