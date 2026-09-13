import { useNavigate } from "react-router";
import { Package } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { byId, getTruckType } from "../lib/selectors";
import { useDataStore } from "../lib/store";
import { truckTypeLabel } from "../lib/constants";
import { formatDateTime } from "../lib/format";
import type { Order } from "../lib/types";

export default function OrderRow({ order }: { order: Order }) {
  const navigate = useNavigate();
  const { clients, contractors } = useDataStore();
  const client = byId(clients, order.clientId);
  const contractor = byId(contractors, order.contractorId);
  const truckType = getTruckType(order.truckTypeId);

  return (
    <div
      onClick={() => navigate(`/orders/${order.id}`)}
      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-grey-light/60 transition-colors"
    >
      <div className="w-9 h-9 rounded-xl bg-blue-soft text-blue flex items-center justify-center flex-shrink-0 hidden sm:flex">
        <Package size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-navy" style={{ fontFamily: "var(--font-mono)" }}>
            {order.id}
          </span>
          <StatusBadge status={order.status} />
          {order.tripType === "Monthly" && (
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-royal bg-[#EEEAFB] uppercase tracking-wide"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Monthly{order.dayLabel ? ` · Day ${order.dayLabel}` : ""}
            </span>
          )}
        </div>
        <div className="mt-1 text-sm text-navy/80 truncate">{client?.name ?? "—"}</div>
        <div className="mt-0.5 text-xs text-muted truncate">
          {contractor?.name ?? "Unassigned"} · {truckTypeLabel(truckType)}
        </div>
      </div>

      <div className="flex-shrink-0 text-left sm:text-right">
        <div className="text-xs text-muted" style={{ fontFamily: "var(--font-mono)" }}>
          {formatDateTime(order.pickupAt)}
        </div>
      </div>
    </div>
  );
}
