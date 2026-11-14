import { useMemo } from "react";
import { useNavigate } from "react-router";
import PhoneRounded from "./icons/PhoneRounded";
import PersonOffRounded from "./icons/PersonOffRounded";
import LocalShippingRounded from "./icons/LocalShippingRounded";
import EventRounded from "./icons/EventRounded";
import TaskAltRounded from "./icons/TaskAltRounded";
import DistanceRounded from "./icons/DistanceRounded";
import ExpiredPill from "./ExpiredPill";
import { MONO, PersonRow, Stat, StatusPill, TripProgress, fleetStatus } from "./fleetCard";
import { useDataStore } from "../lib/store";
import { byId } from "../lib/selectors";
import { truckTypeLabel } from "../lib/constants";
import { formatDate, formatDateTime, isExpired } from "../lib/format";
import { VEHICLE_TILE_IMAGES } from "../lib/truckImages";
import type { Driver } from "../lib/types";

/**
 * Fleet card for one driver, laid out like the truck card: name and phone with a
 * live status pill, a picture panel (the truck they're driving, or their
 * initial), the current truck, progress of the current trip and a footer of
 * licence expiry and lifetime figures.
 */
export default function DriverCard({ driver, interactive = true }: { driver: Driver; interactive?: boolean }) {
  const navigate = useNavigate();
  const { orders, trucks } = useDataStore();
  const expired = isExpired(driver.licenseExpiry);

  const { trip, truck, tripsDone, kmDone } = useMemo(() => {
    const mine = orders.filter((o) => o.driverId === driver.id);
    const current = mine.find((o) => o.status === "In Progress") ?? mine.find((o) => o.status === "Assigned");
    const done = mine.filter((o) => o.status === "Completed");
    return {
      trip: current,
      truck: byId(trucks, current?.truckId),
      tripsDone: done.length,
      kmDone: done.reduce((sum, o) => sum + (o.km ?? 0), 0),
    };
  }, [orders, trucks, driver.id]);

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => navigate(`/drivers/${driver.id}`) : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === "Enter" || e.key === " ") navigate(`/drivers/${driver.id}`); } : undefined}
      className={`w-full text-left rounded-[20px] overflow-hidden bg-white ${interactive ? "cursor-pointer active:scale-[0.99] transition-transform" : ""}`}
      style={{
        border: expired ? "1.5px solid #DC2626" : "1.5px solid transparent",
        boxShadow: expired ? "none" : "0 2px 14px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <div className="min-w-0">
          <p className="truncate" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "#040033" }}>{driver.name}</p>
          <div className="flex items-center gap-1.5" style={{ marginTop: "2px" }}>
            <PhoneRounded sx={{ fontSize: 12, color: "#626A76" }} />
            <span style={{ fontFamily: MONO, fontSize: "11px", color: "#626A76" }}>{driver.phone}</span>
          </div>
        </div>
        <StatusPill status={fleetStatus(driver.active, trip)} />
      </div>

      <div className="mx-4 mt-3 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#F5F5F3", height: "128px" }}>
        {truck ? (
          <img src={VEHICLE_TILE_IMAGES[truck.baseClass]} alt="" draggable={false} className="max-w-[88%] max-h-[100px] object-contain" />
        ) : (
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #040033, #0A0070)" }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "32px", color: "white" }}>{driver.name[0]}</span>
          </div>
        )}
      </div>

      <PersonRow
        avatar={
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: truck ? "#EAF0FE" : "#F0F0EE" }}>
            <LocalShippingRounded sx={{ fontSize: 17, color: truck ? "#1253FA" : "#626A76" }} />
          </div>
        }
        label={truck ? truck.plateNumber : "Truck"}
        name={truck ? truckTypeLabel(truck) : "Not on a trip"}
        muted={!truck}
        tripId={trip?.id}
      />

      {trip && <TripProgress trip={trip} />}

      <div className="flex items-center justify-between gap-2 px-5 py-3 mt-3" style={{ borderTop: "1px solid #F0F0EE" }}>
        <Stat icon={<EventRounded sx={{ fontSize: 14, color: expired ? "#DC2626" : "#626A76" }} />} color={expired ? "#DC2626" : undefined}>
          {formatDate(driver.licenseExpiry)}
        </Stat>
        {expired && <ExpiredPill />}
        <Stat icon={<TaskAltRounded sx={{ fontSize: 14, color: "#626A76" }} />}>{tripsDone} {tripsDone === 1 ? "trip" : "trips"}</Stat>
        <Stat icon={<DistanceRounded sx={{ fontSize: 14, color: "#626A76" }} />}>{kmDone.toLocaleString()} km</Stat>
      </div>

      {!driver.active && driver.deactivatedAt && (
        <div className="flex items-center gap-1.5 px-5 py-2.5" style={{ backgroundColor: "#FDECEC" }}>
          <PersonOffRounded sx={{ fontSize: 14, color: "#DC2626" }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "11.5px", color: "#DC2626" }}>
            Deactivated {formatDateTime(driver.deactivatedAt)}
          </span>
        </div>
      )}
    </div>
  );
}
