import { useState } from "react";
import { Link } from "react-router";
import { AddIcon, Buildings2Icon } from "@solar-icons/react/linear";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import ActiveBadge from "../../components/ActiveBadge";
import AddClientModal from "../../components/AddClientModal";
import { Button } from "../../components/Button";
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
          <Button leadingIcon={AddIcon} onClick={() => setShowAdd(true)}>
            Add Client
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search clients…" />

      {filtered.length === 0 ? (
        <EmptyState icon={Buildings2Icon} title="No clients match your search" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => {
            const orderCount = orders.filter((o) => o.clientId === client.id).length;
            return (
              <Link
                key={client.id}
                to={`/clients/${client.id}`}
                className="rounded-2xl bg-tile p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>{client.name}</h3>
                  <ActiveBadge active={client.active} />
                </div>
                <div className="text-caption-1-regular text-muted" style={{ fontFamily: "var(--font-mono)" }}>{orderCount} orders</div>
              </Link>
            );
          })}
        </div>
      )}

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
