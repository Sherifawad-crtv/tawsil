import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AddIcon, BuildingsIcon } from "@solar-icons/react/linear";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import ActiveBadge from "../../components/ActiveBadge";
import AddContractorModal from "../../components/AddContractorModal";
import { Button } from "../../components/Button";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "../../components/Table";
import { useDataStore } from "../../lib/store";
import { getContractorStats } from "../../lib/selectors";

export default function ContractorsList() {
  const { contractors, drivers, vehicles } = useDataStore();
  const navigate = useNavigate();
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
          <Button leadingIcon={AddIcon} onClick={() => setShowAdd(true)}>
            Add Contractor
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search contractors…" />

      <Table aria-label="Contractors" onRowAction={(key) => navigate(`/contractors/${key}`)}>
        <TableHeader>
          <TableColumn isRowHeader>Contractor</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Phone</TableColumn>
          <TableColumn>Drivers</TableColumn>
          <TableColumn>Vehicles</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody renderEmptyState={() => <EmptyState icon={BuildingsIcon} title="No contractors match your search" />}>
          {filtered.map(({ contractor, driverCount, vehicleCount }) => (
            <TableRow key={contractor.id} id={contractor.id}>
              <TableCell><span className="text-body-semibold text-navy">{contractor.name}</span></TableCell>
              <TableCell className="text-muted">{contractor.email}</TableCell>
              <TableCell className="text-muted">{contractor.phone}</TableCell>
              <TableCell style={{ fontFamily: "var(--font-mono)" }}>{driverCount}</TableCell>
              <TableCell style={{ fontFamily: "var(--font-mono)" }}>{vehicleCount}</TableCell>
              <TableCell><ActiveBadge active={contractor.active} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showAdd && <AddContractorModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
