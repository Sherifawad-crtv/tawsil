import { useState } from "react";
import { BusIcon } from "@solar-icons/react/linear";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "./Table";
import ActiveBadge from "./ActiveBadge";
import EmptyState from "./EmptyState";
import VehicleDetailPanel from "./VehicleDetailPanel";
import { byId, getCurrentOrderForVehicle, getTruckType } from "../lib/selectors";
import { truckTypeLabel } from "../lib/constants";
import { useDataStore } from "../lib/store";
import type { Vehicle } from "../lib/types";

const DETAIL_SUFFIX = "-detail";

/** Shared vehicle list — Resources and each contractor's Vehicles tab. */
export default function VehiclesTable({
  vehicles,
  showContractor = true,
  emptyTitle = "No vehicles yet",
}: {
  vehicles: Vehicle[];
  showContractor?: boolean;
  emptyTitle?: string;
}) {
  const { contractors, orders } = useDataStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const columnCount = showContractor ? 5 : 4;

  return (
    <Table
      aria-label="Vehicles"
      onRowAction={(key) => {
        const id = String(key);
        if (id.endsWith(DETAIL_SUFFIX)) return;
        setExpanded(expanded === id ? null : id);
      }}
    >
      <TableHeader>
        <TableColumn isRowHeader>Plate</TableColumn>
        <TableColumn>Truck Type</TableColumn>
        {showContractor && <TableColumn>Contractor</TableColumn>}
        <TableColumn>On Order</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHeader>
      <TableBody renderEmptyState={() => <EmptyState icon={BusIcon} title={emptyTitle} />}>
        {vehicles.flatMap((vehicle) => {
          const contractor = byId(contractors, vehicle.contractorId);
          const currentOrder = getCurrentOrderForVehicle(orders, vehicle.id);
          const rows = [
            <TableRow key={vehicle.id} id={vehicle.id}>
              <TableCell>
                <span className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-mono)" }}>{vehicle.plateNumber}</span>
              </TableCell>
              <TableCell className="text-muted">{truckTypeLabel(getTruckType(vehicle.truckTypeId))}</TableCell>
              {showContractor ? <TableCell className="text-muted">{contractor?.name ?? "—"}</TableCell> : null}
              <TableCell>
                {currentOrder ? (
                  <span className="px-2 py-0.5 rounded-md text-caption-2-semibold text-blue bg-blue-soft" style={{ fontFamily: "var(--font-mono)" }}>
                    {currentOrder.id}
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </TableCell>
              <TableCell><ActiveBadge active={vehicle.active} /></TableCell>
            </TableRow>,
          ];
          if (expanded === vehicle.id) {
            rows.push(
              <TableRow key={vehicle.id + DETAIL_SUFFIX} id={vehicle.id + DETAIL_SUFFIX}>
                <TableCell colSpan={columnCount} className="p-0">
                  <VehicleDetailPanel vehicle={vehicle} onClose={() => setExpanded(null)} />
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
