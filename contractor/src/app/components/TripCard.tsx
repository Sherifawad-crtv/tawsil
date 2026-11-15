import { useState } from "react";
import { useNavigate } from "react-router";
import CalendarTodayRounded from "./icons/CalendarTodayRounded";
import AccessTimeRounded from "./icons/AccessTimeRounded";
import LocalShippingRounded from "./icons/LocalShippingRounded";
import PersonRounded from "./icons/PersonRounded";
import StatusBadge from "./StatusBadge";
import DispatchSheet from "./DispatchSheet";
import { useDataStore } from "../lib/store";
import { byId } from "../lib/selectors";
import { formatEGP, formatDate, formatTime } from "../lib/format";
import { truckTypeLabel } from "../lib/constants";
import { TRIP_PROGRESS } from "../lib/tripProgress";
import type { Order } from "../lib/types";

/**
 * Trip card, same route timeline and chips as the client app's. Every section
 * is always drawn at a fixed height (stops line, progress, driver row), so all
 * cards are exactly the same size whatever the order holds.
 */
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
      {/* Header: order id and status, one line */}
      <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-3">
        <span
          className="px-2.5 py-1 rounded-xl truncate min-w-0"
          style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "11px", color: "#040033", backgroundColor: "#F0F0EE" }}
        >
          #{order.id}
        </span>
        <span className="flex-shrink-0">
          <StatusBadge status={order.status} size="sm" />
        </span>
      </div>

      {/* Route */}
      {pickup && dropoff && (
        <div className="px-5 pb-3">
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-0.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#040033", border: "2px solid white", boxShadow: "0 0 0 1.5px #040033" }} />
              <div className="flex-1 w-px my-1.5" style={{ backgroundColor: "#E8E8E5" }} />
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#1253FA", border: "2px solid white", boxShadow: "0 0 0 1.5px #1253FA" }} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-2.5">
              <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", lineHeight: "18px", color: "#040033" }}>
                {pickup.address}
              </p>
              <div className="min-w-0">
                <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", lineHeight: "18px", color: "#040033" }}>
                  {dropoff.address}
                </p>
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", lineHeight: "14px", color: "#626A76" }}>
                  {extraStops > 0 ? `+${extraStops} stop${extraStops > 1 ? "s" : ""}` : "Direct"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trip progress: every status has a stage, so this is always drawn */}
      <div className="px-5 pb-4">
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F0F0EE" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${(stage?.pct ?? 0) * 100}%`,
              background: "linear-gradient(90deg, #040033, #1253FA)",
              transition: "width 1s ease",
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5" style={{ lineHeight: "14px" }}>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#626A76" }}>{stage?.label ?? order.status}</span>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#1253FA" }}>{Math.round((stage?.pct ?? 0) * 100)}%</span>
        </div>
      </div>

      {/* Meta: two fixed lines (date, time and price; then the tags) so the card height never depends on the text */}
      <div className="flex flex-col gap-2 px-5 py-3" style={{ borderTop: "1px solid #F0F0EE" }}>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <CalendarTodayRounded sx={{ fontSize: 12, color: "#626A76" }} />
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280" }}>{formatDate(order.pickupAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AccessTimeRounded sx={{ fontSize: 12, color: "#626A76" }} />
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: "10px", color: "#6B7280" }}>{formatTime(order.pickupAt)}</span>
          </div>
          <span className="ml-auto flex-shrink-0" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "#040033" }}>
            {formatEGP(order.priceEGP)}
          </span>
        </div>
        <div className="flex items-center gap-2 min-w-0 whitespace-nowrap">
          <span className="px-2 py-0.5 rounded-lg flex-shrink-0" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#6B7280", backgroundColor: "#F0F0EE", textTransform: "uppercase" }}>
            {order.tripType}
          </span>
          <span className="px-2 py-0.5 rounded-lg truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "9px", color: "#6B7280", backgroundColor: "#F0F0EE" }}>
            {truckTypeLabel(order)}
          </span>
        </div>
      </div>

      {/* Driver row: fixed height; shows the driver and plate, or "no driver" with the dispatch button */}
      <div className="flex items-center justify-between gap-2 px-5" style={{ borderTop: "1px solid #F0F0EE", height: "56px" }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: driver ? "#040033" : "#F0F0EE" }}
          >
            {driver ? (
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "9px", color: "white" }}>{driver.name[0]}</span>
            ) : (
              <PersonRounded sx={{ fontSize: 15, color: "#626A76" }} />
            )}
          </div>
          <span className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12px", color: driver ? "#040033" : "#626A76" }}>
            {driver ? driver.name : "No driver yet"}
          </span>
        </div>
        {unassigned ? (
          <button
            onClick={(e) => { e.stopPropagation(); setDispatchOpen(true); }}
            className="h-8 px-3 rounded-xl flex items-center gap-1.5 flex-shrink-0 cursor-pointer active:scale-[0.97] transition-transform"
            style={{ backgroundColor: "#1253FA", boxShadow: "0 4px 14px rgba(18,83,250,0.3)", border: "none" }}
          >
            <LocalShippingRounded sx={{ fontSize: 13, color: "white" }} />
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12px", color: "white" }}>Dispatch Now</span>
          </button>
        ) : (
          truck && (
            <span
              className="rounded-lg px-2 py-1 flex-shrink-0"
              style={{ backgroundColor: "#F5F5F3", fontFamily: "'Courier Prime', monospace", fontSize: "11px", fontWeight: 700, color: "#040033" }}
            >
              {truck.plateNumber}
            </span>
          )
        )}
      </div>

      {dispatchOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <DispatchSheet order={order} onClose={() => setDispatchOpen(false)} />
        </div>
      )}
    </div>
  );
}
