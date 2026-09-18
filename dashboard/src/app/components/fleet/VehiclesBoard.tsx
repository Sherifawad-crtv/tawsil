import { useMemo, useState } from "react";
import { BusIcon } from "@solar-icons/react/linear";
import Tabs from "../Tabs";
import EmptyState from "../EmptyState";
import VehicleCard from "./VehicleCard";
import VehicleInspector from "./VehicleInspector";
import { useDataStore } from "../../lib/store";
import { VEHICLE_STATUSES, vehicleStatus, type VehicleStatus } from "../../lib/fleet";
import type { Vehicle } from "../../lib/types";

type Tab = "All" | VehicleStatus;
const TABS: Tab[] = ["All", ...VEHICLE_STATUSES];

/**
 * The fleet as a card grid with a status strip above it and an inspector
 * beside it. `vehicles` arrives already narrowed by the page's search and
 * contractor filter; the status tabs narrow it further here, so their
 * counts always describe what the other filters left.
 */
export default function VehiclesBoard({
  vehicles,
  showContractor = true,
}: {
  vehicles: Vehicle[];
  /** Off on a contractor's own Vehicles tab - every card there is already theirs. */
  showContractor?: boolean;
}) {
  const { orders } = useDataStore();
  const [tab, setTab] = useState<Tab>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const withStatus = useMemo(
    () => vehicles.map((v) => ({ vehicle: v, status: vehicleStatus(v, orders) })),
    [vehicles, orders]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: withStatus.length };
    for (const s of VEHICLE_STATUSES) c[s] = 0;
    for (const { status } of withStatus) c[status] += 1;
    return c;
  }, [withStatus]);

  const shown = tab === "All" ? withStatus : withStatus.filter((v) => v.status === tab);
  // The inspector follows the list: filter the vehicle out and it closes.
  const selected = shown.find((v) => v.vehicle.id === selectedId)?.vehicle ?? null;

  return (
    <div className="flex flex-col gap-4">
      <Tabs tabs={TABS} active={tab} onChange={(t) => setTab(t as Tab)} counts={counts} />

      {shown.length === 0 ? (
        <EmptyState icon={BusIcon} title="No vehicles match your filters" />
      ) : (
        <div className={`grid gap-4 items-start ${selected ? "xl:grid-cols-[minmax(0,1fr)_420px]" : ""}`}>
          <div className={`grid gap-3 ${selected ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
            {shown.map(({ vehicle }) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                selected={vehicle.id === selectedId}
                onSelect={() => setSelectedId(vehicle.id === selectedId ? null : vehicle.id)}
                showContractor={showContractor}
              />
            ))}
          </div>

          {selected && (
            <div className="xl:sticky xl:top-4">
              <VehicleInspector vehicle={selected} onClose={() => setSelectedId(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
