import { Link } from "react-router";
import { CloseCircleIcon, ForbiddenIcon, CheckCircleIcon, PhoneIcon, LetterIcon } from "@solar-icons/react/line-duotone";
import { Chip } from "../Chip";
import { ProgressBar } from "../boardui/ProgressBar";
import VehicleStatusBadge from "./VehicleStatusBadge";
import { useDataStore } from "../../lib/store";
import { byId, getTruckType } from "../../lib/selectors";
import { truckTypeLabel } from "../../lib/constants";
import { TRUCK_IMAGES } from "../../lib/truckImages";
import { formatDate, initials } from "../../lib/format";
import { driverForVehicle, ordersForVehicle, vehiclePerformance, vehicleStatus } from "../../lib/fleet";
import type { OrderStatus, Vehicle } from "../../lib/types";

// The stretch an order travels while it's on a vehicle. Cancelled isn't a
// step - a cancelled order isn't "current", so it never reaches this strip.
const ORDER_STEPS: OrderStatus[] = ["Pending", "Assigned", "In Progress", "Completed"];

/**
 * The right-hand panel for the selected vehicle. Everything on it comes
 * off the vehicle record and the order book: its class and papers, its
 * specs, the order it's on now, what it's done lately, and who drives it.
 */
export default function VehicleInspector({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const { orders, contractors, clients, drivers, toggleVehicleActive } = useDataStore();
  const truckType = getTruckType(vehicle.truckTypeId);
  const contractor = byId(contractors, vehicle.contractorId);
  const history = ordersForVehicle(orders, vehicle.id);
  const current = history.find((o) => o.status === "Assigned" || o.status === "In Progress");
  const client = current ? byId(clients, current.clientId) : undefined;
  const who = driverForVehicle(history, drivers);
  const perf = vehiclePerformance(history);
  const peak = Math.max(1, ...perf.monthly.map((m) => m.count));

  return (
    <section className="rounded-2xl bg-white border border-border p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <h3 className="text-title-3-semibold text-navy truncate" style={{ fontFamily: "var(--font-mono)" }}>
            {vehicle.plateNumber}
          </h3>
          <VehicleStatusBadge status={vehicleStatus(vehicle, orders)} />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-muted hover:text-navy cursor-pointer flex-shrink-0"
        >
          <CloseCircleIcon size={20} />
        </button>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Fact label="Truck type" value={truckTypeLabel(truckType)} />
          <Fact label="Capacity" value={`${truckType.capacityMinT}–${truckType.capacityMaxT} t`} />
          <Fact label="Contractor" value={contractor?.name ?? "—"} />
          <Fact label="License expiry" value={formatDate(vehicle.licenseExpiry)} />
        </div>
        <img src={TRUCK_IMAGES[truckType.baseClass]} alt="" className="h-28 w-44 object-contain flex-shrink-0" />
      </div>

      {current && (
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            {ORDER_STEPS.map((step) => {
              const reached = ORDER_STEPS.indexOf(step) <= ORDER_STEPS.indexOf(current.status);
              return (
                <div
                  key={step}
                  className="h-1.5 rounded-full flex-1"
                  style={{ backgroundColor: reached ? "var(--color-blue)" : "var(--color-border)" }}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            {ORDER_STEPS.map((step) => (
              <span
                key={step}
                className={`text-caption-2-regular ${step === current.status ? "text-navy font-semibold" : "text-muted"}`}
                style={{ fontFamily: "var(--font-sub)" }}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Block title="Specifications">
          <Row label="Max weight" value={vehicle.specs.maxWeightT ? `${vehicle.specs.maxWeightT} t` : "—"} />
          <Row label="Year" value={vehicle.specs.year ? String(vehicle.specs.year) : "—"} />
          <Row label="Length" value={vehicle.specs.lengthM ? `${vehicle.specs.lengthM} m` : "—"} />
          <Row label="Width" value={vehicle.specs.widthM ? `${vehicle.specs.widthM} m` : "—"} />
        </Block>

        <Block title="Current order">
          {current ? (
            <>
              <Link
                to={`/orders/${current.id}`}
                className="text-caption-1-semibold text-blue hover:underline"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {current.id}
              </Link>
              <Row label="Client" value={client?.name ?? "—"} />
              <Row label="Pickup" value={formatDate(current.pickupAt)} />
              <Row label="Weight" value={current.weightKg ? `${current.weightKg.toLocaleString()} kg` : "—"} />
              <div className="flex flex-wrap gap-1 pt-0.5">
                {current.cargoTypes.slice(0, 3).map((c) => (
                  <Chip key={c} className="text-caption-2-medium">{c}</Chip>
                ))}
              </div>
            </>
          ) : (
            <p className="text-caption-1-regular text-muted">Not on an order.</p>
          )}
        </Block>
      </div>

      <Block title="Performance · last 6 months">
        <ProgressBar
          direction="vertical"
          bars={perf.monthly.map((m) => ({ label: m.label, value: m.count }))}
          peak={peak}
        />
        <div className="grid grid-cols-2 gap-x-4 pt-1">
          <Row label="Orders" value={String(perf.total)} />
          <Row label="Completed" value={String(perf.completed)} />
          <Row label="Cancelled" value={String(perf.cancelled)} />
          <Row label="Last delivery" value={perf.lastCompletedAt ? formatDate(perf.lastCompletedAt) : "—"} />
        </div>
      </Block>

      {who && (
        <div className="flex items-center gap-3 rounded-2lg bg-grey-light px-3 py-2.5">
          <span
            className="flex items-center justify-center w-9 h-9 rounded-full bg-navy text-white text-caption-1-semibold flex-shrink-0"
            style={{ fontFamily: "var(--font-sub)" }}
          >
            {initials(who.driver.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-body-2-semibold text-navy truncate" style={{ fontFamily: "var(--font-sub)" }}>{who.driver.name}</p>
            <p className="text-caption-2-regular text-muted">{who.current ? "Driver on this order" : "Last driver"}</p>
          </div>
          <a href={`tel:${who.driver.phone.replace(/\s+/g, "")}`} aria-label="Call driver" className="text-muted hover:text-navy">
            <PhoneIcon size={16} />
          </a>
          <a href={`mailto:${who.driver.email}`} aria-label="Email driver" className="text-muted hover:text-navy">
            <LetterIcon size={16} />
          </a>
        </div>
      )}

      <div className="flex items-center justify-end pt-3 border-t border-border">
        <button
          type="button"
          onClick={() => toggleVehicleActive(vehicle.id)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2lg text-caption-1-semibold cursor-pointer ${
            vehicle.active ? "text-status-cancelled hover:bg-[#FDECEC]" : "text-status-completed hover:bg-[#E7F6EC]"
          }`}
          style={{ fontFamily: "var(--font-sub)" }}
        >
          {vehicle.active ? <><ForbiddenIcon size={13} /> Deactivate</> : <><CheckCircleIcon size={13} /> Reactivate</>}
        </button>
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-caption-2-regular text-muted">{label}</p>
      <p className="text-body-2-medium text-navy truncate" style={{ fontFamily: "var(--font-sub)" }}>{value}</p>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2lg border border-border p-3 flex flex-col gap-1.5 min-w-0">
      <p className="text-caption-2-semibold uppercase tracking-wide text-muted mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

/** Label stays whole; it's the value that gives way when a client name runs long. */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 min-w-0">
      <span className="text-caption-1-regular text-muted flex-shrink-0">{label}</span>
      <span className="text-caption-1-medium text-navy truncate" title={value} style={{ fontFamily: "var(--font-mono)" }}>{value}</span>
    </div>
  );
}
