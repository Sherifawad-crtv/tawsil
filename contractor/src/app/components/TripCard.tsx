import { useNavigate } from "react-router";
import CalendarTodayRounded from "./icons/CalendarTodayRounded";
import AccessTimeRounded from "./icons/AccessTimeRounded";
import WarningRounded from "./icons/WarningRounded";
import StatusBadge from "./StatusBadge";
import { useDataStore } from "../lib/store";
import { byId } from "../lib/selectors";
import { formatEGP, formatDate, formatTime } from "../lib/format";
import { truckTypeLabel } from "../lib/constants";
import type { Order } from "../lib/types";

/** Same route dot-timeline + meta-chip grammar as the client app's ActivityScreen trip card. */
export default function TripCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const { drivers, trucks } = useDataStore();
  const driver = byId(drivers, order.driverId);
  const truck = byId(trucks, order.truckId);
  const unassigned = order.status === "Accepted" && !order.driverId;

  const pickup = order.waypoints[0];
  const dropoff = order.waypoints[order.waypoints.length - 1];
  const extraStops = order.waypoints.length - 2;

  return (
    <button
      onClick={() => navigate(`/orders/${order.id}`)}
      className="w-full text-left rounded-[20px] overflow-hidden bg-white cursor-pointer active:scale-[0.99] transition-transform"
      style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.04)", border: "1px solid #E8E8E5" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="px-2.5 py-1 rounded-xl truncate"
            style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "11px", color: "#040033", backgroundColor: "#F0F0EE" }}
          >
            #{order.id}
          </span>
          <StatusBadge status={order.status} size="sm" />
        </div>
        <span className="flex-shrink-0" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "#040033" }}>
          {formatEGP(order.priceEGP)}
        </span>
      </div>

      {unassigned && (
        <div className="mx-5 mb-3 flex items-center gap-1.5 rounded-xl px-3 py-2" style={{ backgroundColor: "#FCF2DE" }}>
          <WarningRounded sx={{ fontSize: 15, color: "#B45309" }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12px", color: "#B45309" }}>
            No Driver Assigned
          </span>
        </div>
      )}

      {/* Route */}
      {pickup && dropoff && (
        <div className="px-5 pb-4">
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-0.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#040033", border: "2px solid white", boxShadow: "0 0 0 1.5px #040033" }} />
              <div className="flex-1 w-px my-1.5" style={{ backgroundColor: "#E8E8E5" }} />
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#1253FA", border: "2px solid white", boxShadow: "0 0 0 1.5px #1253FA" }} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-2.5">
              <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>
                {pickup.address}
              </p>
              <div className="min-w-0">
                <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#040033" }}>
                  {dropoff.address}
                </p>
                {extraStops > 0 && (
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>
                    +{extraStops} stop{extraStops > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-3 px-5 py-3 flex-wrap" style={{ borderTop: "1px solid #F0F0EE" }}>
        <div className="flex items-center gap-1.5">
          <CalendarTodayRounded sx={{ fontSize: 12, color: "#9CA3AF" }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280" }}>{formatDate(order.pickupAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AccessTimeRounded sx={{ fontSize: 12, color: "#9CA3AF" }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280" }}>{formatTime(order.pickupAt)}</span>
        </div>
        <span className="px-2 py-0.5 rounded-lg" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#6B7280", backgroundColor: "#F0F0EE", textTransform: "uppercase" }}>
          {order.tripType}
        </span>
        <span className="px-2 py-0.5 rounded-lg" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#6B7280", backgroundColor: "#F0F0EE" }}>
          {truckTypeLabel(order)}
        </span>
      </div>

      {/* Driver + truck */}
      {driver && truck && (
        <div className="flex items-center justify-between gap-2 px-5 py-3" style={{ borderTop: "1px solid #F0F0EE" }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#040033" }}>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "9px", color: "white" }}>{driver.name[0]}</span>
            </div>
            <span className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12px", color: "#040033" }}>
              {driver.name}
            </span>
          </div>
          <span
            className="rounded-lg px-2 py-1 flex-shrink-0"
            style={{ backgroundColor: "#F5F5F3", fontFamily: "'Courier Prime', monospace", fontSize: "11px", fontWeight: 700, color: "#040033" }}
          >
            {truck.plateNumber}
          </span>
        </div>
      )}
    </button>
  );
}
