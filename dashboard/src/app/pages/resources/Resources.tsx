import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import Tabs from "../../components/Tabs";
import SearchInput from "../../components/SearchInput";
import DriversTable from "../../components/DriversTable";
import VehiclesBoard from "../../components/fleet/VehiclesBoard";
import { useDataStore } from "../../lib/store";
import { Select } from "../../components/Select";
import { byId, getTruckType } from "../../lib/selectors";
import { truckTypeLabel } from "../../lib/constants";

const TABS = ["Drivers", "Vehicles"];
type StatusFilter = "All" | "Active" | "Inactive";

export default function Resources() {
  const { drivers, vehicles, contractors } = useDataStore();
  const [tab, setTab] = useState("Drivers");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [contractorFilter, setContractorFilter] = useState("All");
  const [search, setSearch] = useState("");

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

  // Vehicles get search and contractor here; their status lives on the
  // board's own tab strip, which is why the Active/Inactive select is a
  // drivers-only control.
  const filteredVehicles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (contractorFilter !== "All" && v.contractorId !== contractorFilter) return false;
      if (q) {
        const haystack = `${v.plateNumber} ${truckTypeLabel(getTruckType(v.truckTypeId))} ${byId(contractors, v.contractorId)?.name ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [vehicles, contractors, contractorFilter, search]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Resources" subtitle={`${drivers.length} drivers · ${vehicles.length} vehicles fleet-wide`} />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="flex items-center gap-3 flex-wrap">
        {tab === "Vehicles" && (
          <SearchInput value={search} onChange={setSearch} placeholder="Search by plate, truck type or contractor…" />
        )}
        {tab === "Drivers" && (
          <Select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as StatusFilter)}
            options={[
              { value: "All", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
        )}
        <Select
          aria-label="Filter by contractor"
          value={contractorFilter}
          onChange={setContractorFilter}
          options={[{ value: "All", label: "All Contractors" }, ...contractors.map((c) => ({ value: c.id, label: c.name }))]}
        />
      </div>

      {tab === "Drivers" && <DriversTable drivers={filteredDrivers} emptyTitle="No drivers match your filters" />}

      {tab === "Vehicles" && <VehiclesBoard vehicles={filteredVehicles} />}
    </div>
  );
}
