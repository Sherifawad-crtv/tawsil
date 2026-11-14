import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import InventoryRounded from "../../components/icons/InventoryRounded";
import AddRounded from "../../components/icons/AddRounded";
import IconButton from "../../components/IconButton";
import PageTitle from "../../components/PageTitle";
import SearchField from "../../components/SearchField";
import SegmentedControl from "../../components/SegmentedControl";
import TruckCard from "../../components/TruckCard";
import EmptyState from "../../components/EmptyState";
import { useDataStore } from "../../lib/store";
import { truckTypeLabel } from "../../lib/constants";

export default function TrucksList() {
  const navigate = useNavigate();
  const { trucks } = useDataStore();
  const [tab, setTab] = useState<"active" | "inactive">("active");
  const [query, setQuery] = useState("");

  const activeCount = trucks.filter((t) => t.active).length;
  const inactiveCount = trucks.length - activeCount;
  const bySegment = useMemo(() => trucks.filter((t) => (tab === "active" ? t.active : !t.active)), [trucks, tab]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bySegment;
    return bySegment.filter((t) => t.plateNumber.toLowerCase().includes(q) || truckTypeLabel(t).toLowerCase().includes(q));
  }, [bySegment, query]);

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 20px), 20px)" }}>
      <PageTitle
        title="Trucks"
        subtitle="Manage your fleet"
        trailing={
          <IconButton label="Add truck" onClick={() => navigate("/trucks/new")}>
            <AddRounded sx={{ fontSize: 22, color: "#1253FA" }} />
          </IconButton>
        }
      />

      <div className="mb-3">
        <SearchField value={query} onChange={setQuery} placeholder="Search by plate #" />
      </div>
      <div className="mb-4">
        <SegmentedControl
          ariaLabel="Truck status"
          value={tab}
          onChange={setTab}
          options={[
            { value: "active", label: "Active", count: activeCount },
            { value: "inactive", label: "Inactive", count: inactiveCount },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<InventoryRounded sx={{ fontSize: 28, color: "#D8D9D4" }} />}
            title={tab === "active" ? "No active trucks" : "No inactive trucks"}
            subtitle={query ? "No trucks match your search." : "Trucks you add to your fleet will appear here."}
          />
        ) : (
          filtered.map((t) => <TruckCard key={t.id} truck={t} />)
        )}
      </div>
    </div>
  );
}
