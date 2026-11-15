import { useMemo, useState } from "react";
import InboxRounded from "../../components/icons/InboxRounded";
import PageTitle from "../../components/PageTitle";
import SegmentedControl from "../../components/SegmentedControl";
import TripCard from "../../components/TripCard";
import EmptyState from "../../components/EmptyState";
import { useDataStore } from "../../lib/store";
import { getAvailableOrders } from "../../lib/selectors";

type Kind = "On Demand" | "Monthly";

/** Orders tab: new orders open to the contractor, split by trip type. */
export default function OrdersList() {
  const { orders } = useDataStore();
  const [kind, setKind] = useState<Kind>("On Demand");

  const available = useMemo(() => getAvailableOrders(orders), [orders]);
  const shown = useMemo(() => available.filter((o) => o.tripType === kind), [available, kind]);
  const countOf = (k: Kind) => available.filter((o) => o.tripType === k).length;

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 20px), 20px)" }}>
      <PageTitle title="Orders" subtitle={`${available.length} open ${available.length === 1 ? "order" : "orders"}`} />

      <div className="mb-5">
        <SegmentedControl
          ariaLabel="Order type"
          value={kind}
          onChange={setKind}
          options={[
            { value: "On Demand", label: "On Demand", count: countOf("On Demand") },
            { value: "Monthly", label: "Monthly", count: countOf("Monthly") },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3">
        {shown.length === 0 ? (
          <EmptyState
            icon={<InboxRounded sx={{ fontSize: 28, color: "#D8D9D4" }} />}
            title={`No ${kind.toLowerCase()} orders`}
            subtitle="New orders will appear here automatically."
          />
        ) : (
          shown.map((o) => <TripCard key={o.id} order={o} />)
        )}
      </div>
    </div>
  );
}
