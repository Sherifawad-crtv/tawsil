import { ForbiddenIcon, CheckCircleIcon, CalendarIcon } from "@solar-icons/react/linear";
import { useDataStore } from "../lib/store";
import { getTruckType } from "../lib/selectors";
import { truckTypeLabel } from "../lib/constants";
import { formatDate } from "../lib/format";
import type { Vehicle } from "../lib/types";

export default function VehicleDetailPanel({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const { toggleVehicleActive } = useDataStore();
  const truckType = getTruckType(vehicle.truckTypeId);

  return (
    <div className="rounded-2lg bg-white shadow-card p-4 mt-2">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <div className="text-caption-1-regular text-muted uppercase tracking-wide mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Plate & Type</div>
          <div className="text-body-regular text-navy mb-1" style={{ fontFamily: "var(--font-mono)" }}>{vehicle.plateNumber}</div>
          <div className="text-body-regular text-muted">{truckTypeLabel(truckType)}</div>
        </div>
        <div>
          <div className="text-caption-1-regular text-muted uppercase tracking-wide mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Specifications</div>
          <div className="text-body-regular text-navy mb-0.5">Max Weight: {vehicle.specs.maxWeightT ? `${vehicle.specs.maxWeightT}t` : "—"}</div>
          <div className="text-body-regular text-navy mb-0.5">Year: {vehicle.specs.year ?? "—"}</div>
          <div className="text-body-regular text-navy">L×W: {vehicle.specs.lengthM ? `${vehicle.specs.lengthM}m` : "—"} × {vehicle.specs.widthM ? `${vehicle.specs.widthM}m` : "—"}</div>
        </div>
        <div>
          <div className="text-caption-1-regular text-muted uppercase tracking-wide mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>License Expiry</div>
          <div className="flex items-center gap-1.5 text-body-regular text-navy"><CalendarIcon size={13} className="text-muted" /> {formatDate(vehicle.licenseExpiry)}</div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <button onClick={onClose} className="text-caption-1-semibold text-muted hover:text-navy cursor-pointer" style={{ fontFamily: "var(--font-sub)" }}>
          Close
        </button>
        <button
          onClick={() => toggleVehicleActive(vehicle.id)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2lg text-caption-1-semibold cursor-pointer ${
            vehicle.active ? "text-status-cancelled hover:bg-[#FDECEC]" : "text-status-completed hover:bg-[#E7F6EC]"
          }`}
          style={{ fontFamily: "var(--font-sub)" }}
        >
          {vehicle.active ? <><ForbiddenIcon size={13} /> Deactivate</> : <><CheckCircleIcon size={13} /> Reactivate</>}
        </button>
      </div>
    </div>
  );
}
