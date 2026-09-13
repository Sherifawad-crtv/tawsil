import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Plus, Truck, Users } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import ActiveBadge from "../../components/ActiveBadge";
import AddContractorModal from "../../components/AddContractorModal";
import { useDataStore } from "../../lib/store";
import { getContractorStats } from "../../lib/selectors";

export default function ContractorsList() {
  const { contractors, drivers, vehicles } = useDataStore();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const stats = useMemo(() => getContractorStats(contractors, drivers, vehicles), [contractors, drivers, vehicles]);
  const filtered = stats.filter((s) => s.contractor.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Contractors"
        subtitle={`${contractors.length} contractors`}
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-[var(--radius-control)] bg-blue text-white text-sm font-semibold cursor-pointer hover:brightness-110"
            style={{ fontFamily: "var(--font-sub)" }}
          >
            <Plus size={16} /> Add Contractor
          </button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search contractors…" />

      {filtered.length === 0 ? (
        <EmptyState icon={Truck} title="No contractors match your search" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(({ contractor, driverCount, vehicleCount }) => (
            <Link
              key={contractor.id}
              to={`/contractors/${contractor.id}`}
              className="rounded-[var(--radius-card)] bg-white border border-border p-4 hover:border-blue/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>{contractor.name}</h3>
                <ActiveBadge active={contractor.active} />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5"><Users size={13} /> {driverCount} drivers</span>
                <span className="flex items-center gap-1.5"><Truck size={13} /> {vehicleCount} vehicles</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showAdd && <AddContractorModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
