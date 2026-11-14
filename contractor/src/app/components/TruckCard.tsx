import { useMemo } from "react";
import { useNavigate } from "react-router";
import LocalShippingRounded from "./icons/LocalShippingRounded";
import PersonRounded from "./icons/PersonRounded";
import EventRounded from "./icons/EventRounded";
import TaskAltRounded from "./icons/TaskAltRounded";
import DistanceRounded from "./icons/DistanceRounded";
import ExpiredPill from "./ExpiredPill";
import { useDataStore } from "../lib/store";
import { byId } from "../lib/selectors";
import { truckTypeLabel } from "../lib/constants";
import { formatDate, formatTime, isExpired } from "../lib/format";
import { TRIP_PROGRESS } from "../lib/tripProgress";
import { VEHICLE_TILE_IMAGES } from "../lib/truckImages";
import type { Truck } from "../lib/types";

const MONO = "'Courier Prime', monospace";

/**
 * Fleet card for one truck: type and plate, live status, photo, current driver,
 * progress of the current trip and a footer of lifetime figures. Tapping opens
 * the truck; pass `interactive={false}` to show it as a header on that screen.
 */
export default function TruckCard({ truck, interactive = true }: { truck: Truck; interactive?: boolean }) {
  const navigate = useNavigate();
  const { orders, drivers } = useDataStore();
  const expired = isExpired(truck.licenseExpiry);

  const { trip, driver, tripsDone, kmDone } = useMemo(() => {
    const mine = orders.filter((o) => o.truckId === truck.id);
    const current = mine.find((o) => o.status === "In Progress") ?? mine.find((o) => o.status === "Assigned");
    const done = mine.filter((o) => o.status === "Completed");
    return {
      trip: current,
      driver: byId(drivers, current?.driverId),
      tripsDone: done.length,
      kmDone: done.reduce((sum, o) => sum + (o.km ?? 0), 0),
    };
  }, [orders, drivers, truck.id]);

  const status = !truck.active
    ? { label: "Inactive", bg: "#FDECEC", fg: "#DC2626" }
    : trip?.status === "In Progress"
      ? { label: "On Route", bg: "#DCFCE7", fg: "#22C55E" }
      : trip
        ? { label: "Assigned", bg: "#EAF0FE", fg: "#1253FA" }
        : { label: "Available", bg: "#E7F6EC", fg: "#16803C" };

  const stage = trip ? TRIP_PROGRESS[trip.status] : undefined;
  const endTime = trip?.hours ? new Date(new Date(trip.pickupAt).getTime() + trip.hours * 3600_000).toISOString() : undefined;

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => navigate(`/trucks/${truck.id}`) : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === "Enter" || e.key === " ") navigate(`/trucks/${truck.id}`); } : undefined}
      className={`w-full text-left rounded-[20px] overflow-hidden bg-white ${interactive ? "cursor-pointer active:scale-[0.99] transition-transform" : ""}`}
      style={{
        border: expired ? "1.5px solid #DC2626" : "1.5px solid transparent",
        boxShadow: expired ? "none" : "0 2px 14px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <div className="min-w-0">
          <p className="truncate" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "#040033" }}>{truckTypeLabel(truck)}</p>
          <p style={{ fontFamily: MONO, fontSize: "11px", color: "#626A76", marginTop: "2px" }}>{truck.plateNumber}</p>
        </div>
        <span
          className="rounded-xl whitespace-nowrap flex-shrink-0"
          style={{ backgroundColor: status.bg, color: status.fg, fontFamily: MONO, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 10px" }}
        >
          {status.label}
        </span>
      </div>

      <div className="mx-4 mt-3 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#F5F5F3", height: "128px" }}>
        <img src={VEHICLE_TILE_IMAGES[truck.baseClass]} alt="" draggable={false} className="max-w-[88%] max-h-[100px] object-contain" />
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pt-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: driver ? "linear-gradient(135deg, #040033, #0A0070)" : "#F0F0EE" }}
          >
            {driver ? (
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "white" }}>{driver.name[0]}</span>
            ) : (
              <PersonRounded sx={{ fontSize: 17, color: "#626A76" }} />
            )}
          </div>
          <div className="min-w-0">
            <p style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76" }}>Driver</p>
            <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", color: driver ? "#040033" : "#626A76" }}>
              {driver ? driver.name : "Not on a trip"}
            </p>
          </div>
        </div>
        {trip && <span className="flex-shrink-0" style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76" }}>#{trip.id}</span>}
      </div>

      {stage && trip && (
        <div className="px-5 pt-3.5">
          <div className="relative">
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F0F0EE" }}>
              <div className="h-full rounded-full" style={{ width: `${stage.pct * 100}%`, background: "linear-gradient(90deg, #040033, #1253FA)" }} />
            </div>
            <div
              className="absolute w-5 h-5 rounded-full flex items-center justify-center"
              style={{ left: `${stage.pct * 100}%`, top: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", boxShadow: "0 0 0 1.5px #1253FA" }}
            >
              <LocalShippingRounded sx={{ fontSize: 11, color: "#1253FA" }} />
            </div>
          </div>
          <div className="flex justify-between mt-1.5">
            <span style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76" }}>{formatTime(trip.pickupAt)}</span>
            <span style={{ fontFamily: MONO, fontSize: "10px", color: "#626A76" }}>{endTime ? formatTime(endTime) : stage.label}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 px-5 py-3 mt-3" style={{ borderTop: "1px solid #F0F0EE" }}>
        <Stat icon={<EventRounded sx={{ fontSize: 14, color: expired ? "#DC2626" : "#626A76" }} />} color={expired ? "#DC2626" : undefined}>
          {formatDate(truck.licenseExpiry)}
        </Stat>
        {expired && <ExpiredPill />}
        <Stat icon={<TaskAltRounded sx={{ fontSize: 14, color: "#626A76" }} />}>{tripsDone} {tripsDone === 1 ? "trip" : "trips"}</Stat>
        <Stat icon={<DistanceRounded sx={{ fontSize: 14, color: "#626A76" }} />}>{kmDone.toLocaleString()} km</Stat>
      </div>
    </div>
  );
}

function Stat({ icon, children, color }: { icon: React.ReactNode; children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      {icon}
      <span className="whitespace-nowrap" style={{ fontFamily: MONO, fontSize: "11px", color: color ?? "#6B7280" }}>{children}</span>
    </div>
  );
}
