import { useNavigate } from "react-router";
import DescriptionRounded from "@mui/icons-material/DescriptionRounded";
import RouteRounded from "@mui/icons-material/RouteRounded";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import CalendarTodayRounded from "@mui/icons-material/CalendarTodayRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import StatusBadge from "./StatusBadge";
import { formatEGP, formatDate } from "../lib/format";
import { truckTypeLabel } from "../lib/constants";
import type { Order } from "../lib/types";

/** Same trip card used on Home's Active view and inside History - identical fields, only the surrounding page changes. */
export default function TripCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const unassigned = order.status === "Accepted" && !order.driverId;

  return (
    <button
      onClick={() => navigate(`/orders/${order.id}`)}
      className="w-full text-left rounded-[20px] bg-white p-4 flex flex-col gap-3 cursor-pointer active:scale-[0.99] transition-transform"
      style={{ boxShadow: "0 1px 3px rgba(4,0,51,0.06)", border: "1px solid #E8E8E5" }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <DescriptionRounded sx={{ fontSize: 16, color: "#9CA3AF", flexShrink: 0 }} />
          <span className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", fontWeight: 700, color: "#040033" }}>
            #{order.id}
          </span>
        </div>
        <StatusBadge status={order.status} size="sm" />
      </div>

      {unassigned && (
        <div
          className="flex items-center gap-1.5 rounded-xl px-3 py-2"
          style={{ backgroundColor: "#FCF2DE" }}
        >
          <WarningAmberRounded sx={{ fontSize: 15, color: "#B45309" }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12px", color: "#B45309" }}>
            No Driver Assigned
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-start gap-1.5 min-w-0">
          <RouteRounded sx={{ fontSize: 15, color: "#9CA3AF", flexShrink: 0, marginTop: "1px" }} />
          <div className="min-w-0">
            <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "10.5px", color: "#9CA3AF" }}>Trip Type</p>
            <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12.5px", color: "#040033" }}>
              {order.tripType}
            </p>
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

      <div className="flex items-center justify-between">
        <span
          className="rounded-full px-2.5 py-1"
          style={{ backgroundColor: "#E7F6EC", color: "#16803C", fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "12.5px" }}
        >
          {formatEGP(order.priceEGP)}
        </span>
        <div className="flex items-center gap-1.5">
          <CalendarTodayRounded sx={{ fontSize: 13, color: "#9CA3AF" }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11.5px", color: "#6B7280" }}>{formatDate(order.pickupAt)}</span>
        </div>
      </div>
    </button>
  );
}
