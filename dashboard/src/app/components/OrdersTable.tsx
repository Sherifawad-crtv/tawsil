import { useNavigate } from "react-router";
import { BoxIcon } from "@solar-icons/react/linear";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "./Table";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import { byId, getTruckType } from "../lib/selectors";
import { useDataStore } from "../lib/store";
import { truckTypeLabel } from "../lib/constants";
import { formatDateTime } from "../lib/format";
import type { Order } from "../lib/types";

export default function OrdersTable({ orders, emptyTitle = "No orders yet", emptyNote }: {
  orders: Order[];
  emptyTitle?: string;
  emptyNote?: string;
}) {
  const navigate = useNavigate();
  const { clients, contractors } = useDataStore();

  return (
    <Table
      aria-label="Orders"
      onRowAction={(key) => navigate(`/orders/${key}`)}
    >
      <TableHeader>
        <TableColumn isRowHeader>Order ID</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Client</TableColumn>
        <TableColumn>Contractor</TableColumn>
        <TableColumn>Truck</TableColumn>
        <TableColumn>Pickup</TableColumn>
      </TableHeader>
      <TableBody renderEmptyState={() => <EmptyState icon={BoxIcon} title={emptyTitle} note={emptyNote} />}>
        {orders.map((order) => {
          const client = byId(clients, order.clientId);
          const contractor = byId(contractors, order.contractorId);
          return (
            <TableRow key={order.id} id={order.id}>
              <TableCell>
                <span className="text-body-2-semibold text-navy" style={{ fontFamily: "var(--font-mono)" }}>
                  {order.id}
                </span>
                {order.tripType === "Monthly" && (
                  <span
                    className="ml-2 px-2 py-0.5 rounded-md text-caption-2-semibold text-royal bg-[#EEEAFB] uppercase tracking-wide"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Monthly{order.dayLabel ? ` · ${order.dayLabel}` : ""}
                  </span>
                )}
              </TableCell>
              <TableCell><StatusBadge status={order.status} /></TableCell>
              <TableCell>{client?.name ?? "—"}</TableCell>
              <TableCell className="text-muted">{contractor?.name ?? "Unassigned"}</TableCell>
              <TableCell className="text-muted">{truckTypeLabel(getTruckType(order.truckTypeId))}</TableCell>
              <TableCell className="text-muted whitespace-nowrap" style={{ fontFamily: "var(--font-mono)" }}>
                {formatDateTime(order.pickupAt)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
