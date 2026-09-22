import { useState } from "react";
import { useNavigate } from "react-router";
import CalendarTodayRounded from "./icons/CalendarTodayRounded";
import AccessTimeRounded from "./icons/AccessTimeRounded";
import LocalShippingRounded from "./icons/LocalShippingRounded";
import StatusBadge from "./StatusBadge";
import DispatchSheet from "./DispatchSheet";
import { useDataStore } from "../lib/store";
import { byId } from "../lib/selectors";
import { formatEGP, formatDate, formatTime } from "../lib/format";
import { truckTypeLabel } from "../lib/constants";
import type { Order, OrderStatus } from "../lib/types";

/** Trip-lifecycle progress, same gradient bar as the client app's Active Trip card on its Home screen. */
const TRIP_PROGRESS: Partial<Record<OrderStatus, { pct: number; label: string }>> = {
  Assigned: { pct: 0.2, label: "Driver Assigned" },
  "In Progress": { pct: 0.65, label: "In Transit" },
  Completed: { pct: 1, label: "Delivered" },
};

/** Same route dot-timeline + meta-chip grammar as the client app's ActivityScreen trip card. */
export default function TripCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const { drivers, trucks } = useDataStore();
  const driver = byId(drivers, order.driverId);
  const truck = byId(trucks, order.truckId);
  const unassigned = order.status === "Accepted" && !order.driverId;
  const [dispatchOpen, setDispatchOpen] = useState(false);

  const pickup = order.waypoints[0];
  const dropoff = order.waypoints[order.waypoints.length - 1];
  const extraStops = order.waypoints.length - 2;
  const stage = TRIP_PROGRESS[order.status];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/orders/${order.id}`)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate(`/orders/${order.id}`); }}
      className="w-full text-left rounded-[20px] overflow-hidden bg-white cursor-pointer active:scale-[0.99] transition-transform"
      style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.04)" }}
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

      {/* Trip progress */}
      {stage && (
        <div className="px-5 pb-4">
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F0F0EE" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${stage.pct * 100}%`,
                background: "linear-gradient(90deg, #040033, #1253FA)",
                transition: "width 1s ease",
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#9CA3AF" }}>{stage.label}</span>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA" }}>{Math.round(stage.pct * 100)}%</span>
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

      {/* Dispatch CTA - same bottom-of-card button language as the client app's Reorder CTA. */}
      {unassigned && (
        <div className="px-5 pb-4 pt-1">
          <button
            onClick={(e) => { e.stopPropagation(); setDispatchOpen(true); }}
            className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] transition-transform"
            style={{ backgroundColor: "#040033", border: "none" }}
          >
            <LocalShippingRounded sx={{ fontSize: 14, color: "white" }} />
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "white" }}>
              Dispatch Now
            </span>
          </button>
        </div>
      )}

      {dispatchOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <DispatchSheet order={order} onClose={() => setDispatchOpen(false)} />
        </div>
      )}
    </div>
  );
}
