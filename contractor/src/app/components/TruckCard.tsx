import { useMemo } from "react";
import { useNavigate } from "react-router";
import PersonRounded from "./icons/PersonRounded";
import EventRounded from "./icons/EventRounded";
import TaskAltRounded from "./icons/TaskAltRounded";
import DistanceRounded from "./icons/DistanceRounded";
import ExpiredPill from "./ExpiredPill";
import { MONO, PersonRow, Stat, StatusPill, TripProgress, fleetStatus } from "./fleetCard";
import { useDataStore } from "../lib/store";
import { byId } from "../lib/selectors";
import { truckTypeLabel } from "../lib/constants";
import { formatDate, isExpired } from "../lib/format";
import { VEHICLE_TILE_IMAGES } from "../lib/truckImages";
import type { Truck } from "../lib/types";

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
        <StatusPill status={fleetStatus(truck.active, trip)} />
      </div>

      <div className="mx-5 mt-2 flex items-center justify-center" style={{ height: "112px" }}>
        <img
          src={VEHICLE_TILE_IMAGES[truck.baseClass]}
          alt=""
          draggable={false}
          className="max-w-full max-h-full object-contain"
          style={{ filter: "drop-shadow(0 6px 7px rgba(4,0,51,0.16))" }}
        />
      </div>

      <PersonRow
        avatar={
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: driver ? "linear-gradient(135deg, #040033, #0A0070)" : "#F0F0EE" }}>
            {driver ? (
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "white" }}>{driver.name[0]}</span>
            ) : (
              <PersonRounded sx={{ fontSize: 17, color: "#626A76" }} />
            )}
          </div>
        }
        label="Driver"
        name={driver ? driver.name : "Not on a trip"}
        muted={!driver}
        tripId={trip?.id}
      />

      {trip && <TripProgress trip={trip} />}

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
