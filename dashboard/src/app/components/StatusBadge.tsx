import type { OrderStatus } from "../lib/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-[#FEF3E2] text-status-pending",
  Assigned: "bg-blue-soft text-status-assigned",
  "In Progress": "bg-[#DCFCE7] text-status-progress",
  Completed: "bg-[#E7F6EC] text-status-completed",
  Cancelled: "bg-[#FDECEC] text-status-cancelled",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-body-medium ${STATUS_STYLES[status]}`}
      style={{ fontFamily: "var(--font-sub)" }}
    >
      {status}
    </span>
  );
}
