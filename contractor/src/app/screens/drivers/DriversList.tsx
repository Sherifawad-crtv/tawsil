import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import PeopleAltRounded from "@mui/icons-material/PeopleAltRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import SearchField from "../../components/SearchField";
import SegmentedControl from "../../components/SegmentedControl";
import DriverCard from "../../components/DriverCard";
import EmptyState from "../../components/EmptyState";
import Fab from "../../components/Fab";
import { useDataStore } from "../../lib/store";

export default function DriversList() {
  const navigate = useNavigate();
  const { drivers } = useDataStore();
  const [tab, setTab] = useState<"active" | "inactive">("active");
  const [query, setQuery] = useState("");

  const bySegment = useMemo(() => drivers.filter((d) => (tab === "active" ? d.active : !d.active)), [drivers, tab]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bySegment;
    return bySegment.filter((d) => d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q));
  }, [bySegment, query]);

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)", paddingBottom: "8px" }}>
      <h1 className="mb-4" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "26px", color: "#040033" }}>
        Drivers
      </h1>

      <div className="mb-3">
        <SearchField value={query} onChange={setQuery} placeholder="Search by name, username" />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
          style={{ backgroundColor: "#FCE7F3", color: "#BE185D", fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "12px" }}
        >
          <PeopleAltRounded sx={{ fontSize: 13 }} />
          {bySegment.length} {bySegment.length === 1 ? "Driver" : "Drivers"}
        </span>
      </div>
      <SegmentedControl
        ariaLabel="Driver status"
        value={tab}
        onChange={setTab}
        options={[
          { value: "active", label: "Active Drivers" },
          { value: "inactive", label: "Inactive Drivers" },
        ]}
      />

      {/* Same FAB bottom-padding fix as Trucks, applied here preemptively before the roster grows past what fits on screen. */}
      <div className="mt-4 flex flex-col gap-3" style={{ paddingBottom: "96px" }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<GroupsRounded sx={{ fontSize: 24, color: "#9CA3AF" }} />}
            title={tab === "active" ? "No active drivers" : "No inactive drivers"}
            subtitle={query ? "No drivers match your search." : "Drivers you add to your fleet will appear here."}
          />
        ) : (
          filtered.map((d) => <DriverCard key={d.id} driver={d} />)
        )}
      </div>

      <Fab label="Add Driver" onClick={() => navigate("/drivers/new")} />
    </div>
  );
}
