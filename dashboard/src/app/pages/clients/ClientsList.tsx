import { useState } from "react";
import { useNavigate } from "react-router";
import { AddIcon, Buildings2Icon } from "@solar-icons/react/line-duotone";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import ActiveBadge from "../../components/ActiveBadge";
import AddClientModal from "../../components/AddClientModal";
import { Button } from "../../components/Button";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "../../components/Table";
import { useDataStore } from "../../lib/store";

export default function ClientsList() {
  const { clients, orders } = useDataStore();
  const navigate = useNavigate();
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

      <Table aria-label="Clients" onRowAction={(key) => navigate(`/clients/${key}`)}>
        <TableHeader>
          <TableColumn isRowHeader>Client</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Phone</TableColumn>
          <TableColumn>Orders</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody renderEmptyState={() => <EmptyState icon={Buildings2Icon} title="No clients match your search" />}>
          {filtered.map((client) => (
            <TableRow key={client.id} id={client.id}>
              <TableCell><span className="text-body-semibold text-navy">{client.name}</span></TableCell>
              <TableCell className="text-muted">{client.email}</TableCell>
              <TableCell className="text-muted">{client.phone}</TableCell>
              <TableCell style={{ fontFamily: "var(--font-mono)" }}>
                {orders.filter((o) => o.clientId === client.id).length}
              </TableCell>
              <TableCell><ActiveBadge active={client.active} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
