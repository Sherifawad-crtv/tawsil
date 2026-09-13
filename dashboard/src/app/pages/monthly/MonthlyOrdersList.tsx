import { useState } from "react";
import { Link } from "react-router";
import { AddIcon, CalendarMarkIcon } from "@solar-icons/react/linear";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import MonthlyOrderFormModal from "../../components/monthly/MonthlyOrderFormModal";
import { Button } from "../../components/Button";
import { useDataStore } from "../../lib/store";
import { byId } from "../../lib/selectors";

export default function MonthlyOrdersList() {
  const { monthlyOrders, clients, contractors } = useDataStore();
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

      {monthlyOrders.length === 0 ? (
        <EmptyState icon={CalendarMarkIcon} title="No monthly contracts yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {monthlyOrders.map((contract) => {
            const client = byId(clients, contract.clientId);
            const contractor = byId(contractors, contract.contractorId);
            const executed = contract.executedDates.length;
            const total = contract.dates.length;
            const pct = total > 0 ? Math.round((executed / total) * 100) : 0;
            return (
              <Link
                key={contract.id}
                to={`/monthly-orders/${contract.id}`}
                className="rounded-2xl bg-white border border-border p-4 hover:border-blue/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-mono)" }}>{contract.id}</div>
                    <div className="text-body-regular text-navy/80 mt-1">{client?.name ?? "—"}</div>
                    <div className="text-caption-1-regular text-muted mt-0.5">{contractor?.name ?? "Unassigned"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-caption-1-regular text-muted uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
                      {executed} / {total} days
                    </div>
                    <div
                      className={`mt-1 px-2 py-0.5 rounded-md text-caption-2-semibold uppercase inline-block ${
                        contract.status === "Active" ? "bg-blue-soft text-blue" : contract.status === "Draft" ? "bg-grey-light text-muted" : "bg-[#E7F6EC] text-status-completed"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {contract.status}
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-grey-light overflow-hidden">
                  <div className="h-full bg-blue rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {showCreate && <MonthlyOrderFormModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
