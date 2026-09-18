import type { OrderStatus } from "../../lib/types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "#d97706",
  Assigned: "#1253fa",
  "In Progress": "#22c55e",
  Completed: "#16803c",
  Cancelled: "#dc2626",
};

export default function StatusBreakdownBar({ data }: { data: { status: OrderStatus; count: number }[] }) {
  const total = Math.max(1, data.reduce((sum, d) => sum + d.count, 0));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-grey-light">
        {data.map(
          (d) =>
            d.count > 0 && (
              <div
                key={d.status}
                style={{ width: `${(d.count / total) * 100}%`, backgroundColor: STATUS_COLORS[d.status] }}
                title={`${d.status}: ${d.count}`}
              />
            )
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {data.map((d) => (
          <div key={d.status} className="flex items-center gap-1.5 text-caption-1-regular text-navy min-w-0">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[d.status] }} />
            <span className="truncate flex-1" style={{ fontFamily: "var(--font-sub)" }}>{d.status}</span>
            <span className="text-muted flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
