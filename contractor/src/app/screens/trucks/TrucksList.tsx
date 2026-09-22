import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import LocalShippingRounded from "../../components/icons/LocalShippingRounded";
import InventoryRounded from "../../components/icons/InventoryRounded";
import SearchField from "../../components/SearchField";
import SegmentedControl from "../../components/SegmentedControl";
import TruckCard from "../../components/TruckCard";
import EmptyState from "../../components/EmptyState";
import Fab from "../../components/Fab";
import { useDataStore } from "../../lib/store";
import { truckTypeLabel } from "../../lib/constants";

export default function TrucksList() {
  const navigate = useNavigate();
  const { trucks } = useDataStore();
  const [tab, setTab] = useState<"active" | "inactive">("active");
  const [query, setQuery] = useState("");

  const bySegment = useMemo(() => trucks.filter((t) => (tab === "active" ? t.active : !t.active)), [trucks, tab]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bySegment;
    return bySegment.filter((t) => t.plateNumber.toLowerCase().includes(q) || truckTypeLabel(t).toLowerCase().includes(q));
  }, [bySegment, query]);

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)", paddingBottom: "8px" }}>
      <h1 className="mb-4" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", color: "#040033" }}>
        Trucks
      </h1>

      <div className="mb-3">
        <SearchField value={query} onChange={setQuery} placeholder="Search by plate #" />
      </div>

      {/* Count badge tightly paired with the segmented control it describes, not a separate floating stat. */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
          style={{ backgroundColor: "#FCE7F3", color: "#BE185D", fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "12px" }}
        >
          <LocalShippingRounded sx={{ fontSize: 13 }} />
          {bySegment.length} {bySegment.length === 1 ? "Truck" : "Trucks"}
        </span>
      </div>
      <SegmentedControl
        ariaLabel="Truck status"
        value={tab}
        onChange={setTab}
        options={[
          { value: "active", label: "Active Trucks" },
          { value: "inactive", label: "Inactive Trucks" },
        ]}
      />

      <div className="mt-4 flex flex-col gap-3" style={{ paddingBottom: "96px" }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<InventoryRounded sx={{ fontSize: 24, color: "#9CA3AF" }} />}
            title={tab === "active" ? "No active trucks" : "No inactive trucks"}
            subtitle={query ? "No trucks match your search." : "Trucks you add to your fleet will appear here."}
          />
        ) : (
          filtered.map((t) => <TruckCard key={t.id} truck={t} />)
        )}
      </div>

      <Fab label="Add Truck" onClick={() => navigate("/trucks/new")} />
    </div>
  );
}
