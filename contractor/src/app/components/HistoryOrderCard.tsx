import { useNavigate } from "react-router";
import RouteRounded from "./icons/RouteRounded";
import LocalShippingRounded from "./icons/LocalShippingRounded";
import CalendarTodayRounded from "./icons/CalendarTodayRounded";
import StatusBadge from "./StatusBadge";
import { useDataStore } from "../lib/store";
import { byId } from "../lib/selectors";
import { formatEGP, formatDate } from "../lib/format";
import { truckTypeLabel } from "../lib/constants";
import type { Order } from "../lib/types";

export default function HistoryOrderCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const { drivers, trucks } = useDataStore();
  const driver = byId(drivers, order.driverId);
  const truck = byId(trucks, order.truckId);

  return (
    <button
      onClick={() => navigate(`/orders/${order.id}`)}
      className="w-full text-left rounded-[20px] bg-white p-4 flex flex-col gap-3 cursor-pointer active:scale-[0.99] transition-transform"
      style={{ border: "1px solid #E8E8E5", boxShadow: "0 1px 3px rgba(4,0,51,0.06)" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", fontWeight: 700, color: "#040033" }}>
          #{order.id}
        </span>
        <StatusBadge status={order.status} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-start gap-1.5 min-w-0">
          <RouteRounded sx={{ fontSize: 15, color: "#9CA3AF", flexShrink: 0, marginTop: "1px" }} />
          <div className="min-w-0">
            <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "10.5px", color: "#9CA3AF" }}>Trip Type</p>
            <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12.5px", color: "#040033" }}>{order.tripType}</p>
          </div>
        </div>
        <div className="flex items-start gap-1.5 min-w-0">
          <LocalShippingRounded sx={{ fontSize: 15, color: "#9CA3AF", flexShrink: 0, marginTop: "1px" }} />
          <div className="min-w-0">
            <p style={{ fontFamily: "'Archivo', sans-serif", fontSize: "10.5px", color: "#9CA3AF" }}>Truck Type</p>
            {/* Wraps instead of clipping mid-word - loses zero information, unlike the previous truncation bug. */}
            <p className="whitespace-normal break-words" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12.5px", color: "#040033" }}>
              {truckTypeLabel(order)}
            </p>
          </div>
        </div>
      </div>

      {driver && truck && (
        <div className="flex items-center justify-between gap-2 rounded-2xl px-3 py-2.5" style={{ backgroundColor: "#F5F5F3" }}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#0A0070" }}>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "11px", color: "white" }}>{driver.name[0]}</span>
            </div>
            <span className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12.5px", color: "#040033" }}>
              {driver.name}
            </span>
          </div>
          <span
            className="rounded-lg px-2 py-1 flex-shrink-0"
            style={{ backgroundColor: "white", fontFamily: "'Courier Prime', monospace", fontSize: "11px", fontWeight: 700, color: "#040033" }}
          >
            {truck.plateNumber}
          </span>
        </div>
      )}

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
