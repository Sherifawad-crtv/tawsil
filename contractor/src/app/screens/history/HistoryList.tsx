import { useMemo, useState } from "react";
import InventoryRounded from "../../components/icons/InventoryRounded";
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
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)", paddingBottom: "8px" }}>
      <h1 className="mb-4" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", color: "#040033" }}>
        History Orders
      </h1>

      {/* Pill-segmented tabs with count badges - same grammar as the client app's Activity tabs. */}
      <div className="flex rounded-2xl p-1 mb-6" style={{ backgroundColor: "#E8E8E5" }}>
        {(["Completed", "Cancelled"] as const).map((t) => {
          const active = tab === t;
          const count = t === "Completed" ? completed.length : cancelled.length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              style={{
                backgroundColor: active ? "white" : "transparent",
                boxShadow: active ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                border: "none",
              }}
            >
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: active ? 700 : 500, fontSize: "13px", color: active ? "#040033" : "#6B7280", transition: "color 0.3s" }}>
                {t}
              </span>
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  fontSize: "10px",
                  color: active ? "#1253FA" : "#9CA3AF",
                  backgroundColor: active ? "rgba(18,83,250,0.08)" : "rgba(107,114,128,0.06)",
                  transition: "all 0.3s",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        {shown.length === 0 ? (
          <EmptyState
            icon={<InventoryRounded sx={{ fontSize: 24, color: "#9CA3AF" }} />}
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
