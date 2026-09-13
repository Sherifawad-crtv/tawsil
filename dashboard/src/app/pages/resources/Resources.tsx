import { useMemo, useState } from "react";
import { Star, Users, Truck } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Tabs from "../../components/Tabs";
import ActiveBadge from "../../components/ActiveBadge";
import EmptyState from "../../components/EmptyState";
import DriverDetailPanel from "../../components/DriverDetailPanel";
import VehicleDetailPanel from "../../components/VehicleDetailPanel";
import { useDataStore } from "../../lib/store";
import { byId, getTruckType, getCurrentOrderForDriver, getCurrentOrderForVehicle } from "../../lib/selectors";
import { truckTypeLabel } from "../../lib/constants";

const TABS = ["Drivers", "Vehicles"];
type StatusFilter = "All" | "Active" | "Inactive";

export default function Resources() {
  const { drivers, vehicles, contractors, orders } = useDataStore();
  const [tab, setTab] = useState("Drivers");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [contractorFilter, setContractorFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredDrivers = useMemo(
    () =>
      drivers.filter((d) => {
        if (statusFilter === "Active" && !d.active) return false;
        if (statusFilter === "Inactive" && d.active) return false;
        if (contractorFilter !== "All" && d.contractorId !== contractorFilter) return false;
        return true;
      }),
    [drivers, statusFilter, contractorFilter]
  );

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter((v) => {
        if (statusFilter === "Active" && !v.active) return false;
        if (statusFilter === "Inactive" && v.active) return false;
        if (contractorFilter !== "All" && v.contractorId !== contractorFilter) return false;
        return true;
      }),
    [vehicles, statusFilter, contractorFilter]
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Resources" subtitle={`${drivers.length} drivers · ${vehicles.length} vehicles fleet-wide`} />

      <Tabs tabs={TABS} active={tab} onChange={(t) => { setTab(t); setExpanded(null); }} />

      <div className="flex items-center gap-3 flex-wrap">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className="px-3 py-1.5 rounded-[var(--radius-control)] border border-border bg-white text-sm text-navy cursor-pointer" style={{ fontFamily: "var(--font-sub)" }}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select value={contractorFilter} onChange={(e) => setContractorFilter(e.target.value)} className="px-3 py-1.5 rounded-[var(--radius-control)] border border-border bg-white text-sm text-navy cursor-pointer" style={{ fontFamily: "var(--font-sub)" }}>
          <option value="All">All Contractors</option>
          {contractors.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {tab === "Drivers" &&
        (filteredDrivers.length === 0 ? (
          <EmptyState icon={Users} title="No drivers match your filters" />
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredDrivers.map((driver) => {
              const contractor = byId(contractors, driver.contractorId);
              const currentOrder = getCurrentOrderForDriver(orders, driver.id);
              return (
                <div key={driver.id} className="rounded-[var(--radius-card)] bg-white border border-border p-4">
                  <button onClick={() => setExpanded(expanded === driver.id ? null : driver.id)} className="w-full flex items-center justify-between gap-4 cursor-pointer text-left">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-navy">{driver.name}</div>
                      <div className="text-xs text-muted mt-0.5">{contractor?.name ?? "—"}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="flex items-center gap-1 text-xs text-navy" style={{ fontFamily: "var(--font-mono)" }}>
                        <Star size={12} className="text-status-pending" /> {driver.rating.toFixed(2)}
                      </span>
                      {currentOrder && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-blue bg-blue-soft" style={{ fontFamily: "var(--font-mono)" }}>
                          On {currentOrder.id}
                        </span>
                      )}
                      <ActiveBadge active={driver.active} />
                    </div>
                  </button>
                  {expanded === driver.id && <DriverDetailPanel driver={driver} onClose={() => setExpanded(null)} />}
                </div>
              );
            })}
          </div>
        ))}

      {tab === "Vehicles" &&
        (filteredVehicles.length === 0 ? (
          <EmptyState icon={Truck} title="No vehicles match your filters" />
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredVehicles.map((vehicle) => {
              const contractor = byId(contractors, vehicle.contractorId);
              const currentOrder = getCurrentOrderForVehicle(orders, vehicle.id);
              return (
                <div key={vehicle.id} className="rounded-[var(--radius-card)] bg-white border border-border p-4">
                  <button onClick={() => setExpanded(expanded === vehicle.id ? null : vehicle.id)} className="w-full flex items-center justify-between gap-4 cursor-pointer text-left">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-navy" style={{ fontFamily: "var(--font-mono)" }}>{vehicle.plateNumber}</div>
                      <div className="text-xs text-muted mt-0.5">{truckTypeLabel(getTruckType(vehicle.truckTypeId))} · {contractor?.name ?? "—"}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {currentOrder && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-blue bg-blue-soft" style={{ fontFamily: "var(--font-mono)" }}>
                          On {currentOrder.id}
                        </span>
                      )}
                      <ActiveBadge active={vehicle.active} />
                    </div>
                  </button>
                  {expanded === vehicle.id && <VehicleDetailPanel vehicle={vehicle} onClose={() => setExpanded(null)} />}
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
}
