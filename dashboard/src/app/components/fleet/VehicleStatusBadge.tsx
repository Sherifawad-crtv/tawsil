import type { VehicleStatus } from "../../lib/fleet";

// Assigned and In Progress reuse the order-status colours they come from;
// Available borrows the active green; Inactive is the muted grey.
const STYLES: Record<VehicleStatus, string> = {
  Available: "bg-[#E7F6EC] text-status-completed",
  Assigned: "bg-blue-soft text-status-assigned",
  "In Progress": "bg-[#DCFCE7] text-status-progress",
  Inactive: "bg-[#F0F0EE] text-muted",
};

export default function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-body-medium whitespace-nowrap ${STYLES[status]}`}
      style={{ fontFamily: "var(--font-sub)" }}
    >
      {status}
    </span>
  );
}
