import { useMemo, useState } from "react";
import InventoryRounded from "@mui/icons-material/InventoryRounded";
import HistoryOrderCard from "../../components/HistoryOrderCard";
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
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)", paddingBottom: "8px" }}>
      <h1 className="mb-4" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", color: "#040033" }}>
        History Orders
      </h1>

      <div className="flex items-center gap-6 mb-4" style={{ borderBottom: "1px solid #E8E8E5" }}>
        {(["Completed", "Cancelled"] as const).map((t) => {
          const active = tab === t;
          const count = t === "Completed" ? completed.length : cancelled.length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="pb-2.5 cursor-pointer relative"
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: active ? 700 : 500,
                fontSize: "14.5px",
                color: active ? "#040033" : "#9CA3AF",
              }}
            >
              {t} ({count})
              {active && <div className="absolute left-0 right-0 bottom-0 h-[2.5px] rounded-full" style={{ backgroundColor: "#1253FA" }} />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {shown.length === 0 ? (
          <EmptyState
            icon={<InventoryRounded sx={{ fontSize: 24, color: "#9CA3AF" }} />}
            title={`No ${tab.toLowerCase()} orders`}
            subtitle="Orders will show up here once they're finished."
          />
        ) : (
          shown.map((o) => <HistoryOrderCard key={o.id} order={o} />)
        )}
      </div>
    </div>
  );
}
