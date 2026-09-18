import { byId, getTruckType } from "../../lib/selectors";
import { truckTypeLabel } from "../../lib/constants";
import { TRUCK_IMAGES } from "../../lib/truckImages";
import { formatDate } from "../../lib/format";
import { vehicleStatus } from "../../lib/fleet";
import { useDataStore } from "../../lib/store";
import { getCurrentOrderForVehicle } from "../../lib/selectors";
import VehicleStatusBadge from "./VehicleStatusBadge";
import type { Vehicle } from "../../lib/types";

/**
 * One vehicle in the fleet board: plate and state up top, the three facts
 * that identify it, and its truck class drawn on the right. Selecting it
 * opens the inspector beside the grid.
 */
export default function VehicleCard({
  vehicle,
  selected,
  onSelect,
}: {
  vehicle: Vehicle;
  selected: boolean;
  onSelect: () => void;
}) {
  const { orders, contractors, drivers } = useDataStore();
  const truckType = getTruckType(vehicle.truckTypeId);
  const contractor = byId(contractors, vehicle.contractorId);
  const current = getCurrentOrderForVehicle(orders, vehicle.id);
  const driver = current?.driverId ? byId(drivers, current.driverId) : undefined;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`text-left w-full rounded-2xl bg-white p-4 flex flex-col gap-3 cursor-pointer transition-[border-color,box-shadow] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-blue ${
        selected ? "border border-navy shadow-xs" : "border border-border hover:border-grey"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-body-semibold text-navy truncate" style={{ fontFamily: "var(--font-mono)" }}>
          {vehicle.plateNumber}
        </span>
        <VehicleStatusBadge status={vehicleStatus(vehicle, orders)} />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-end">
        <div className="flex flex-col gap-2 min-w-0">
          <Fact label="Truck type" value={truckTypeLabel(truckType)} />
          <Fact label="License expiry" value={formatDate(vehicle.licenseExpiry)} />
          {current ? (
            <Fact label="On order" value={`${current.id}${driver ? ` · ${driver.name}` : ""}`} mono />
          ) : (
            <Fact label="Contractor" value={contractor?.name ?? "—"} />
          )}
        </div>
        <img
          src={TRUCK_IMAGES[truckType.baseClass]}
          alt=""
          className="h-20 w-36 object-contain object-right-bottom flex-shrink-0"
        />
      </div>
    </button>
  );
}

function Fact({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-caption-2-regular text-muted">{label}</p>
      <p
        className="text-caption-1-medium text-navy truncate"
        style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-sub)" }}
      >
        {value}
      </p>
    </div>
  );
}
