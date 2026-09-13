import { useState } from "react";
import { Link } from "react-router";
import { Plus, Building2 } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import ActiveBadge from "../../components/ActiveBadge";
import AddClientModal from "../../components/AddClientModal";
import { useDataStore } from "../../lib/store";

export default function ClientsList() {
  const { clients, orders } = useDataStore();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} clients`}
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-[var(--radius-control)] bg-blue text-white text-sm font-semibold cursor-pointer hover:brightness-110"
            style={{ fontFamily: "var(--font-sub)" }}
          >
            <Plus size={16} /> Add Client
          </button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search clients…" />

      {filtered.length === 0 ? (
        <EmptyState icon={Building2} title="No clients match your search" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => {
            const orderCount = orders.filter((o) => o.clientId === client.id).length;
            return (
              <Link
                key={client.id}
                to={`/clients/${client.id}`}
                className="rounded-[var(--radius-card)] bg-white border border-border p-4 hover:border-blue/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-base font-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>{client.name}</h3>
                  <ActiveBadge active={client.active} />
                </div>
                <div className="text-xs text-muted" style={{ fontFamily: "var(--font-mono)" }}>{orderCount} orders</div>
              </Link>
            );
          })}
        </div>
      )}

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
