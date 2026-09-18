import PersonAddAlt1Rounded from "@mui/icons-material/PersonAddAlt1Rounded";
import LocalShippingRounded from "@mui/icons-material/LocalShippingRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import type { OrderStatus } from "../lib/types";

export const STATUS_STYLE: Record<OrderStatus, { bg: string; fg: string; icon: React.ElementType }> = {
  Assigned: { bg: "#EAF0FE", fg: "#1253FA", icon: PersonAddAlt1Rounded },
  "In Progress": { bg: "#F3E8FF", fg: "#7C3AED", icon: LocalShippingRounded },
  Completed: { bg: "#E7F6EC", fg: "#16803C", icon: CheckCircleRounded },
  Cancelled: { bg: "#FDECEC", fg: "#DC2626", icon: CloseRounded },
};

export default function StatusBadge({ status, size = "md", prominent = false }: { status: OrderStatus; size?: "sm" | "md"; prominent?: boolean }) {
  const s = STATUS_STYLE[status];
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full whitespace-nowrap"
      style={{
        backgroundColor: s.bg,
        color: s.fg,
        fontFamily: "'Archivo', sans-serif",
        fontWeight: prominent ? 800 : 600,
        fontSize: size === "sm" ? (prominent ? "11.5px" : "11px") : "12px",
        padding: prominent ? "5px 11px" : size === "sm" ? "3px 8px" : "4px 10px",
        border: prominent ? `1.5px solid ${s.fg}` : "none",
      }}
    >
      <Icon sx={{ fontSize: size === "sm" ? 12 : 13 }} />
      {status}
    </span>
  );
}
