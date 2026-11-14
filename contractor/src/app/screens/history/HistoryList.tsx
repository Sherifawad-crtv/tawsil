import { useMemo, useState } from "react";
import InboxRounded from "../../components/icons/InboxRounded";
import PageTitle from "../../components/PageTitle";
import SegmentedControl from "../../components/SegmentedControl";
import TripCard from "../../components/TripCard";
import EmptyState from "../../components/EmptyState";
import { useDataStore } from "../../lib/store";
import { getHistoryOrders } from "../../lib/selectors";

export default function HistoryList() {
  const { orders } = useDataStore();
  const [tab, setTab] = useState<"Completed" | "Cancelled">("Completed");

  const history = useMemo(() => getHistoryOrders(orders), [orders]);
  const completed = useMemo(() => history.filter((o) => o.status === "Completed"), [history]);
  const cancelled = useMemo(() => history.filter((o) => o.status === "Cancelled"), [history]);
  const shown = tab === "Completed" ? completed : cancelled;

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 20px), 20px)" }}>
      <PageTitle title="History" subtitle="Completed and cancelled orders" />

      <div className="mb-5">
        <SegmentedControl
          ariaLabel="Order history"
          value={tab}
          onChange={setTab}
          options={[
            { value: "Completed", label: "Completed", count: completed.length },
            { value: "Cancelled", label: "Cancelled", count: cancelled.length },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3">
        {shown.length === 0 ? (
          <EmptyState
            icon={<InboxRounded sx={{ fontSize: 28, color: "#D8D9D4" }} />}
            title={`No ${tab.toLowerCase()} orders`}
            subtitle="Orders will show up here once they're finished."
          />
        ) : (
          shown.map((o) => <TripCard key={o.id} order={o} />)
        )}
      </div>
    </div>
  );
}
