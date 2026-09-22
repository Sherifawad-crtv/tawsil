import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import CheckRounded from "./icons/CheckRounded";
import ChevronLeftRounded from "./icons/ChevronLeftRounded";
import CloseRounded from "./icons/CloseRounded";
import SearchField from "./SearchField";
import { Button } from "./Button";
import { useDataStore } from "../lib/store";
import { dispatchableTrucks, dispatchableDrivers } from "../lib/selectors";
import { truckTypeLabel } from "../lib/constants";
import { VEHICLE_TILE_IMAGES } from "../lib/truckImages";
import type { Truck, Driver, Order } from "../lib/types";

const AVATAR_COLORS = ["#1253FA", "#0A0070", "#16803C", "#B45309"];

function VehicleTile({ truck, selected, onSelect }: { truck: Truck; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="relative flex-shrink-0 rounded-[22px] bg-white overflow-hidden cursor-pointer active:scale-[0.97] transition-transform text-left"
      style={{
        scrollSnapAlign: "start",
        width: "220px",
        border: selected ? "2.5px solid #1253FA" : "2.5px solid transparent",
        boxShadow: selected ? "0 4px 20px rgba(18,83,250,0.18)" : "0 2px 14px rgba(0,0,0,0.04)",
      }}
    >
      <div className="w-full overflow-hidden" style={{ height: "128px", backgroundColor: "#F0F0EE" }}>
        <img src={VEHICLE_TILE_IMAGES[truck.baseClass]} alt="" className="w-full h-full object-cover object-left-bottom" />
      </div>
      <div className="p-3">
        <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "13px", color: "#040033" }}>{truck.plateNumber}</p>
        <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontSize: "11.5px", color: "#6B7280", marginTop: "1px" }}>
          {truckTypeLabel(truck)}
        </p>
      </div>
      {selected && (
        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#1253FA" }}>
          <CheckRounded sx={{ fontSize: 14, color: "white" }} />
        </div>
      )}
    </button>
  );
}

function DriverRow({ driver, selected, onSelect }: { driver: Driver; selected: boolean; onSelect: () => void }) {
  const color = AVATAR_COLORS[driver.name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 rounded-[20px] bg-white p-3.5 cursor-pointer active:scale-[0.99] transition-transform text-left"
      style={{
        border: selected ? "2px solid #1253FA" : "2px solid transparent",
        boxShadow: selected ? "0 2px 14px rgba(18,83,250,0.12)" : "0 2px 14px rgba(0,0,0,0.04)",
      }}
    >
      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: "white" }}>{driver.name[0]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", color: "#040033" }}>{driver.name}</p>
        <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11.5px", color: "#9CA3AF" }}>{driver.phone}</p>
      </div>
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ border: selected ? "none" : "2px solid #D8D9D4", backgroundColor: selected ? "#1253FA" : "transparent" }}
      >
        {selected && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "white" }} />}
      </div>
    </button>
  );
}

/**
 * Two-step dispatch flow for an unassigned order: pick a vehicle (big photo
 * tiles, side-scroll), then a driver - each step has its own search bar.
 * Same bottom-sheet chrome (grabber handle, rounded-t-28) as the rest of the app.
 */
export default function DispatchSheet({ order, onClose }: { order: Order; onClose: () => void }) {
  const { trucks, drivers, orders, assignOrder } = useDataStore();
  const [step, setStep] = useState<"vehicle" | "driver">("vehicle");
  const [truckQuery, setTruckQuery] = useState("");
  const [driverQuery, setDriverQuery] = useState("");
  const [truckId, setTruckId] = useState<string | undefined>(undefined);
  const [driverId, setDriverId] = useState<string | undefined>(undefined);

  const trucksAvailable = useMemo(() => dispatchableTrucks(trucks, orders), [trucks, orders]);
  const filteredTrucks = useMemo(() => {
    const q = truckQuery.trim().toLowerCase();
    if (!q) return trucksAvailable;
    return trucksAvailable.filter((t) => t.plateNumber.toLowerCase().includes(q) || truckTypeLabel(t).toLowerCase().includes(q));
  }, [trucksAvailable, truckQuery]);

  const driversAvailable = useMemo(() => dispatchableDrivers(drivers, orders), [drivers, orders]);
  const filteredDrivers = useMemo(() => {
    const q = driverQuery.trim().toLowerCase();
    if (!q) return driversAvailable;
    return driversAvailable.filter((d) => d.name.toLowerCase().includes(q) || d.phone.toLowerCase().includes(q));
  }, [driversAvailable, driverQuery]);

  function handleAssign() {
    if (!truckId || !driverId) return;
    assignOrder(order.id, truckId, driverId);
    onClose();
  }

  // Portaled straight to <body> - nested inside TripCard's own active:scale
  // press-state, this sheet's `position: fixed` would re-anchor to that
  // scaled ancestor (any transformed ancestor becomes the containing block
  // for a fixed descendant) instead of the viewport, making it visibly
  // drift/scale on every tap inside it.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(4,0,51,0.5)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg flex flex-col"
        style={{
          backgroundColor: "#F5F5F3",
          borderRadius: "28px 28px 0 0",
          maxHeight: "88vh",
          paddingBottom: "max(env(safe-area-inset-bottom, 16px), 16px)",
        }}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: "#D8D9D4" }} />
        </div>

        <div className="flex items-center justify-between gap-2 px-5 pt-2 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {step === "driver" && (
              <button
                onClick={() => setStep("vehicle")}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform flex-shrink-0"
                style={{ backgroundColor: "#F0F0EE" }}
                aria-label="Back"
              >
                <ChevronLeftRounded sx={{ fontSize: 18, color: "#040033" }} />
              </button>
            )}
            <div className="min-w-0">
              <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "18px", color: "#040033" }}>
                {step === "vehicle" ? "Select Vehicle" : "Select Driver"}
              </p>
              <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11.5px", color: "#9CA3AF" }}>
                Dispatching #{order.id} · Step {step === "vehicle" ? "1" : "2"} of 2
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform flex-shrink-0"
            style={{ backgroundColor: "#F0F0EE" }}
            aria-label="Close"
          >
            <CloseRounded sx={{ fontSize: 15, color: "#040033" }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {step === "vehicle" ? (
            <div className="flex flex-col gap-4 pb-2">
              <div className="px-5">
                <SearchField value={truckQuery} onChange={setTruckQuery} placeholder="Search by plate or truck type" />
              </div>
              {filteredTrucks.length === 0 ? (
                <p className="px-5 py-8 text-center" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>
                  No available trucks match your search.
                </p>
              ) : (
                <div
                  className="flex gap-3 px-5 pb-2 overflow-x-auto"
                  style={{ scrollSnapType: "x mandatory", scrollPaddingLeft: "20px", scrollPaddingRight: "20px" }}
                >
                  {filteredTrucks.map((t) => (
                    <VehicleTile key={t.id} truck={t} selected={truckId === t.id} onSelect={() => setTruckId(t.id)} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3 px-5 pb-2">
              <SearchField value={driverQuery} onChange={setDriverQuery} placeholder="Search by name or phone" />
              {filteredDrivers.length === 0 ? (
                <p className="py-8 text-center" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#9CA3AF" }}>
                  No available drivers match your search.
                </p>
              ) : (
                filteredDrivers.map((d) => (
                  <DriverRow key={d.id} driver={d} selected={driverId === d.id} onSelect={() => setDriverId(d.id)} />
                ))
              )}
            </div>
          )}
        </div>

        <div className="px-5 pt-3 flex-shrink-0">
          {step === "vehicle" ? (
            <Button disabled={!truckId} onClick={() => setStep("driver")}>Next: Choose Driver</Button>
          ) : (
            <Button disabled={!driverId} onClick={handleAssign}>Assign Driver &amp; Truck</Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
