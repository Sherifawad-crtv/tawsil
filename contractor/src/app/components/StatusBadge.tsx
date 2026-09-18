import CheckRounded from "@mui/icons-material/CheckRounded";
import HourglassEmptyRounded from "@mui/icons-material/HourglassEmptyRounded";
import LocalShippingRounded from "@mui/icons-material/LocalShippingRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import PersonAddAlt1Rounded from "@mui/icons-material/PersonAddAlt1Rounded";
import type { OrderStatus } from "../lib/types";

export const STATUS_STYLE: Record<OrderStatus, { bg: string; fg: string; icon: React.ElementType }> = {
  Pending: { bg: "#FEF3E2", fg: "#D97706", icon: HourglassEmptyRounded },
  Accepted: { bg: "#FEF3E2", fg: "#D97706", icon: CheckRounded },
  Assigned: { bg: "#EAF0FE", fg: "#1253FA", icon: PersonAddAlt1Rounded },
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
