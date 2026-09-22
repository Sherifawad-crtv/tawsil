import CheckRounded from "./icons/CheckRounded";
import HourglassEmptyRounded from "./icons/HourglassEmptyRounded";
import LocalShippingRounded from "./icons/LocalShippingRounded";
import CheckCircleRounded from "./icons/CheckCircleRounded";
import CloseRounded from "./icons/CloseRounded";
import PersonAddRounded from "./icons/PersonAddRounded";
import type { OrderStatus } from "../lib/types";

export const STATUS_STYLE: Record<OrderStatus, { bg: string; fg: string; icon: React.ElementType }> = {
  Pending: { bg: "#FEF3E2", fg: "#D97706", icon: HourglassEmptyRounded },
  Accepted: { bg: "#FEF3E2", fg: "#D97706", icon: CheckRounded },
  Assigned: { bg: "#EAF0FE", fg: "#1253FA", icon: PersonAddRounded },
  // Green, not navy - a lighter green than Completed's so the two stay
  // visually distinct wherever they appear side by side.
  "In Progress": { bg: "#DCFCE7", fg: "#22C55E", icon: LocalShippingRounded },
  Completed: { bg: "#E7F6EC", fg: "#16803C", icon: CheckCircleRounded },
  Cancelled: { bg: "#FDECEC", fg: "#DC2626", icon: CloseRounded },
};

export default function StatusBadge({ status, size = "md" }: { status: OrderStatus; size?: "sm" | "md" }) {
  const s = STATUS_STYLE[status];
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap"
      style={{
        backgroundColor: s.bg,
        color: s.fg,
        fontFamily: "'Archivo', sans-serif",
        fontSize: size === "sm" ? "11px" : "12px",
        padding: size === "sm" ? "3px 8px" : "4px 10px",
      }}
    >
      <Icon sx={{ fontSize: size === "sm" ? 12 : 13 }} />
      {status}
    </span>
  );
}
