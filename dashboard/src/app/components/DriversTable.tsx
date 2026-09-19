import { useState } from "react";
import { StarIcon, UsersGroupRoundedIcon } from "@solar-icons/react/line-duotone";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "./Table";
import ActiveBadge from "./ActiveBadge";
import EmptyState from "./EmptyState";
import DriverDetailPanel from "./DriverDetailPanel";
import { byId, getCurrentOrderForDriver } from "../lib/selectors";
import { useDataStore } from "../lib/store";
import type { Driver } from "../lib/types";

const DETAIL_SUFFIX = "-detail";

/** Shared driver list — Resources and each contractor's Drivers tab. */
export default function DriversTable({
  drivers,
  showContractor = true,
  emptyTitle = "No drivers yet",
}: {
  drivers: Driver[];
  showContractor?: boolean;
  emptyTitle?: string;
}) {
  const { contractors, orders } = useDataStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const columnCount = showContractor ? 6 : 5;

  return (
    <Table
      aria-label="Drivers"
      onRowAction={(key) => {
        const id = String(key);
        // The expanded panel is its own row; clicks inside it must not collapse it.
        if (id.endsWith(DETAIL_SUFFIX)) return;
        setExpanded(expanded === id ? null : id);
      }}
    >
      <TableHeader>
        <TableColumn isRowHeader>Driver</TableColumn>
        {showContractor && <TableColumn>Contractor</TableColumn>}
        <TableColumn>Contact</TableColumn>
        <TableColumn>Rating</TableColumn>
        <TableColumn>On Order</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHeader>
      <TableBody renderEmptyState={() => <EmptyState icon={UsersGroupRoundedIcon} title={emptyTitle} />}>
        {drivers.flatMap((driver) => {
          const contractor = byId(contractors, driver.contractorId);
          const currentOrder = getCurrentOrderForDriver(orders, driver.id);
          const rows = [
            <TableRow key={driver.id} id={driver.id}>
              <TableCell><span className="text-body-semibold text-navy">{driver.name}</span></TableCell>
              {showContractor ? <TableCell className="text-muted">{contractor?.name ?? "—"}</TableCell> : null}
              <TableCell className="text-muted">{driver.phone}</TableCell>
              <TableCell>
                <span className="flex items-center gap-1 text-navy" style={{ fontFamily: "var(--font-mono)" }}>
                  <StarIcon size={12} className="text-status-pending" /> {driver.rating.toFixed(2)}
                </span>
              </TableCell>
              <TableCell>
                {currentOrder ? (
                  <span className="px-2 py-0.5 rounded-md text-caption-2-semibold text-blue bg-blue-soft" style={{ fontFamily: "var(--font-mono)" }}>
                    {currentOrder.id}
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </TableCell>
              <TableCell><ActiveBadge active={driver.active} /></TableCell>
            </TableRow>,
          ];
          if (expanded === driver.id) {
            rows.push(
              <TableRow key={driver.id + DETAIL_SUFFIX} id={driver.id + DETAIL_SUFFIX}>
                <TableCell colSpan={columnCount} className="p-0">
                  <DriverDetailPanel driver={driver} onClose={() => setExpanded(null)} />
                </TableCell>
              </TableRow>,
            );
          }
          return rows;
        })}
      </TableBody>
    </Table>
  );
}
