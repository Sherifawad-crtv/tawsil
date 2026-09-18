import { SegmentedBar } from "../boardui/SegmentedBar";
import type { OrderStatus } from "../../lib/types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "#d97706",
  Assigned: "#1253fa",
  "In Progress": "#22c55e",
  Completed: "#16803c",
  Cancelled: "#dc2626",
};

export default function StatusBreakdownBar({ data }: { data: { status: OrderStatus; count: number }[] }) {
  return (
    <SegmentedBar
      showPercent={false}
      segments={data.map((d) => ({ key: d.status, label: d.status, value: d.count, color: STATUS_COLORS[d.status] }))}
    />
  );
}
