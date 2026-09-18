import { useNavigate } from "react-router";
import DescriptionRounded from "@mui/icons-material/DescriptionRounded";
import RouteRounded from "@mui/icons-material/RouteRounded";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import CalendarTodayRounded from "@mui/icons-material/CalendarTodayRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../lib/format";
import { truckTypeLabel } from "../lib/constants";
import type { Order } from "../lib/types";

/**
 * Uber-standard urgency split (Section 5.1): Pending (Assigned, not started -
 * needs a decision) reads urgent - heavier orange border, bolder badge.
 * Active (In Progress, already committed) reads calm - thin neutral border,
 * settled green tint. Same card, same fields, only the emphasis differs by
 * state. Colors match the status vocabulary: orange for Pending, green for
 * In Progress, same as the rest of the app's palette.
 */
export default function TripCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const pending = order.status === "Assigned";

  return (
    <div
      className="w-full rounded-[20px] bg-white overflow-hidden flex flex-col"
      style={{
        border: pending ? "2px solid #D97706" : "1px solid #E8E8E5",
        boxShadow: pending ? "0 2px 10px rgba(217,119,6,0.14)" : "0 1px 3px rgba(4,0,51,0.05)",
      }}
    >
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <DescriptionRounded sx={{ fontSize: 16, color: "#9CA3AF", flexShrink: 0 }} />
            <span className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", fontWeight: 700, color: "#040033" }}>
              #{order.id}
            </span>
          </div>
          <StatusBadge status={order.status} size="sm" prominent={pending} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-1.5 min-w-0">
            <RouteRounded sx={{ fontSize: 15, color: "#9CA3AF", flexShrink: 0, marginTop: "1px" }} />
            <div className="min-w-0">
              <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "10.5px", color: "#9CA3AF" }}>Trip Type</p>
              <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12.5px", color: "#040033" }}>{order.tripType}</p>
            </div>
          </div>
          <div className="flex items-start gap-1.5 min-w-0">
            <LocalShippingOutlined sx={{ fontSize: 15, color: "#9CA3AF", flexShrink: 0, marginTop: "1px" }} />
            <div className="min-w-0">
              <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "10.5px", color: "#9CA3AF" }}>Truck Type</p>
              <p className="whitespace-normal break-words" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12.5px", color: "#040033" }}>
                {truckTypeLabel(order)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <CalendarTodayRounded sx={{ fontSize: 13, color: "#9CA3AF" }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11.5px", color: "#6B7280" }}>{formatDate(order.pickupAt)}</span>
        </div>
      </div>

      {/* Section 5.2: the card's bottom edge IS the primary tap target for its next action - not a generic "tap anywhere" card. */}
      <button
        onClick={() => navigate(`/orders/${order.id}`)}
        className="w-full flex items-center justify-center gap-1.5 py-3 cursor-pointer active:brightness-95 transition-[filter]"
        style={{
          backgroundColor: pending ? "#D97706" : "#DCFCE7",
          minHeight: "44px",
        }}
      >
        <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "13px", color: pending ? "white" : "#22C55E" }}>
          {pending ? "View & Respond" : "Continue Trip"}
        </span>
        <ChevronRightRounded sx={{ fontSize: 16, color: pending ? "white" : "#22C55E" }} />
      </button>
    </div>
  );
}
