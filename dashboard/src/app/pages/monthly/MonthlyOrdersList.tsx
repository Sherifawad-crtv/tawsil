import { useState } from "react";
import { useNavigate } from "react-router";
import { AddIcon, CalendarMarkIcon } from "@solar-icons/react/bold-duotone";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import MonthlyOrderFormModal from "../../components/monthly/MonthlyOrderFormModal";
import { Button } from "../../components/Button";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "../../components/Table";
import { ProgressBar } from "../../components/boardui/ProgressBar";
import { useDataStore } from "../../lib/store";
import { byId } from "../../lib/selectors";

export default function MonthlyOrdersList() {
  const { monthlyOrders, clients, contractors } = useDataStore();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Monthly Orders"
        subtitle={`${monthlyOrders.length} contracts`}
        action={
          <Button leadingIcon={AddIcon} onClick={() => setShowCreate(true)}>
            New Monthly Order
          </Button>
        }
      />

      <Table aria-label="Monthly contracts" onRowAction={(key) => navigate(`/monthly-orders/${key}`)}>
        <TableHeader>
          <TableColumn isRowHeader>Contract</TableColumn>
          <TableColumn>Client</TableColumn>
          <TableColumn>Contractor</TableColumn>
          <TableColumn>Progress</TableColumn>
          <TableColumn>Days</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody renderEmptyState={() => <EmptyState icon={CalendarMarkIcon} title="No monthly contracts yet" />}>
          {monthlyOrders.map((contract) => {
            const client = byId(clients, contract.clientId);
            const contractor = byId(contractors, contract.contractorId);
            const executed = contract.executedDates.length;
            const total = contract.dates.length;
            const pct = total > 0 ? Math.round((executed / total) * 100) : 0;
            return (
              <TableRow key={contract.id} id={contract.id}>
                <TableCell>
                  <span className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-mono)" }}>{contract.id}</span>
                </TableCell>
                <TableCell>{client?.name ?? "—"}</TableCell>
                <TableCell className="text-muted">{contractor?.name ?? "Unassigned"}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <ProgressBar value={pct} size="sm" className="w-24" />
                    <span className="text-muted" style={{ fontFamily: "var(--font-mono)" }}>{pct}%</span>
                  </span>
                </TableCell>
                <TableCell className="text-muted whitespace-nowrap" style={{ fontFamily: "var(--font-mono)" }}>
                  {executed} / {total}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-0.5 rounded-md text-caption-2-semibold uppercase inline-block ${
                      contract.status === "Active" ? "bg-blue-soft text-blue" : contract.status === "Draft" ? "bg-grey-light text-muted" : "bg-[#E7F6EC] text-status-completed"
                    }`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {contract.status}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {showCreate && <MonthlyOrderFormModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
