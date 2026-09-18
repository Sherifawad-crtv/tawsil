import { useMemo } from "react";
import ScreenHeader from "../../components/ScreenHeader";
import TripCard from "../../components/TripCard";
import EmptyState from "../../components/EmptyState";
import InboxRounded from "@mui/icons-material/InboxRounded";
import { useDataStore } from "../../lib/store";
import { getActiveOrders } from "../../lib/selectors";

export default function ActiveTripsList() {
  const { orders } = useDataStore();
  const active = useMemo(() => getActiveOrders(orders), [orders]);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title={`Active Trips (${active.length})`} />
      <div className="w-full max-w-lg mx-auto px-4 pb-8">
        {active.length === 0 ? (
          <EmptyState
            icon={<InboxRounded sx={{ fontSize: 24, color: "#9CA3AF" }} />}
            title="No Active trips"
            subtitle="You have no active trips right now. Accepted orders will appear here automatically."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {active.map((o) => (
              <TripCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
