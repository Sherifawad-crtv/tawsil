import { useMemo, useState } from "react";
import PageHeader from "../../components/PageHeader";
import Tabs from "../../components/Tabs";
import DriversTable from "../../components/DriversTable";
import VehiclesTable from "../../components/VehiclesTable";
import { useDataStore } from "../../lib/store";
import { Select } from "../../components/Select";

const TABS = ["Drivers", "Vehicles"];
type StatusFilter = "All" | "Active" | "Inactive";

export default function Resources() {
  const { drivers, vehicles, contractors } = useDataStore();
  const [tab, setTab] = useState("Drivers");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [contractorFilter, setContractorFilter] = useState("All");

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

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="flex items-center gap-3 flex-wrap">
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
        <Select
          aria-label="Filter by contractor"
          value={contractorFilter}
          onChange={setContractorFilter}
          options={[{ value: "All", label: "All Contractors" }, ...contractors.map((c) => ({ value: c.id, label: c.name }))]}
        />
      </div>

      {tab === "Drivers" && <DriversTable drivers={filteredDrivers} emptyTitle="No drivers match your filters" />}

      {tab === "Vehicles" && <VehiclesTable vehicles={filteredVehicles} emptyTitle="No vehicles match your filters" />}

    </div>
  );
}
