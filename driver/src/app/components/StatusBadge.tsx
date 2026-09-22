import HourglassEmptyRounded from "@mui/icons-material/HourglassEmptyRounded";
import LocalShippingRounded from "@mui/icons-material/LocalShippingRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import type { OrderStatus } from "../lib/types";

// Same colors as the Contractor app's status vocabulary: Assigned is this
// app's "Pending" bucket (an order sitting unstarted), so it takes
// Contractor's Pending orange rather than its own blue. In Progress is
// green - a lighter green than Completed's so the two stay distinct.
export const STATUS_STYLE: Record<OrderStatus, { bg: string; fg: string; icon: React.ElementType }> = {
  Assigned: { bg: "#FEF3E2", fg: "#D97706", icon: HourglassEmptyRounded },
  "In Progress": { bg: "#DCFCE7", fg: "#22C55E", icon: LocalShippingRounded },
  Completed: { bg: "#E7F6EC", fg: "#16803C", icon: CheckCircleRounded },
  Cancelled: { bg: "#FDECEC", fg: "#DC2626", icon: CloseRounded },
};

/** Text-only uppercase pill - same badge language as the client and contractor apps' trip status chips. */
export default function StatusBadge({ status, size = "md" }: { status: OrderStatus; size?: "sm" | "md" }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className="rounded-xl whitespace-nowrap"
      style={{
        backgroundColor: s.bg,
        color: s.fg,
        fontFamily: "'Courier Prime', monospace",
        fontSize: size === "sm" ? "9px" : "10px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        padding: size === "sm" ? "3px 8px" : "4px 10px",
      }}
    >
      {status}
    </span>
  );
}
