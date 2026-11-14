import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import GroupsRounded from "../../components/icons/GroupsRounded";
import AddRounded from "../../components/icons/AddRounded";
import IconButton from "../../components/IconButton";
import PageTitle from "../../components/PageTitle";
import SearchField from "../../components/SearchField";
import SegmentedControl from "../../components/SegmentedControl";
import DriverCard from "../../components/DriverCard";
import EmptyState from "../../components/EmptyState";
import { useDataStore } from "../../lib/store";

export default function DriversList() {
  const navigate = useNavigate();
  const { drivers } = useDataStore();
  const [tab, setTab] = useState<"active" | "inactive">("active");
  const [query, setQuery] = useState("");

  const activeCount = drivers.filter((d) => d.active).length;
  const inactiveCount = drivers.length - activeCount;
  const bySegment = useMemo(() => drivers.filter((d) => (tab === "active" ? d.active : !d.active)), [drivers, tab]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bySegment;
    return bySegment.filter((d) => d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q));
  }, [bySegment, query]);

  return (
    <div className="w-full max-w-lg mx-auto px-4" style={{ paddingTop: "max(env(safe-area-inset-top, 20px), 20px)" }}>
      <PageTitle
        title="Drivers"
        subtitle="Manage your drivers"
        trailing={
          <IconButton label="Add driver" onClick={() => navigate("/drivers/new")}>
            <AddRounded sx={{ fontSize: 22, color: "#1253FA" }} />
          </IconButton>
        }
      />

      <div className="mb-3">
        <SearchField value={query} onChange={setQuery} placeholder="Search by name or email" />
      </div>
      <div className="mb-4">
        <SegmentedControl
          ariaLabel="Driver status"
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
            icon={<GroupsRounded sx={{ fontSize: 28, color: "#D8D9D4" }} />}
            title={tab === "active" ? "No active drivers" : "No inactive drivers"}
            subtitle={query ? "No drivers match your search." : "Drivers you add will appear here."}
          />
        ) : (
          filtered.map((d) => <DriverCard key={d.id} driver={d} />)
        )}
      </div>
    </div>
  );
}
