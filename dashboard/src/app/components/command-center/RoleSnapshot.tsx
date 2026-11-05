import { Suspense, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ApartmentIcon, DomainIcon, ArrowDownwardIcon, ArrowUpwardIcon, SavingsIcon } from "../icons";
import InsightCard from "../InsightCard";
import { Select } from "../Select";
import FinancialCard from "../financials/FinancialCard";
import RollupTable, { type RollupColumn } from "../financials/RollupTable";
import { Field, Money, OrdersGlobe, GLOBE_PX, BAND_MIN_PX } from "./shared";
import { useDataStore } from "../../lib/store";
import { useRole } from "../../lib/RoleContext";
import { useMediaQuery } from "../../lib/useMediaQuery";
import { getActiveTeamMemberForRole } from "../../lib/selectors";
import { formatAmount } from "../../lib/format";
import { coverageByArea, coveragePoints } from "../../lib/coverage";
import {
  MONEY_COLORS,
  MONTH_OPTIONS,
  availableYears,
  filterForFinancials,
  monthLabel,
  rollUpByClient,
  rollUpByContractor,
  sumMoney,
  type ClientRow,
  type ContractorRow,
  type FinancialFilters,
} from "../../lib/financials";

/**
 * The Command Center is Executive/Admin only. Sales, Supply and Operations
 * get their own slice of it here instead, shown at the top of their Home:
 * Sales sees its own open accounts' revenue and target, Supply sees
 * contractor payables only (never receivables), Operations sees the
 * coverage heatmap with a zones-covered count in place of any money.
 * Renders nothing for the other roles.
 */
export default function RoleSnapshot() {
  const { orders, clients, contractors, teamMembers } = useDataStore();
  const { role } = useRole();
  // The globe is a desktop/tablet set piece - on phones it's swapped for a
  // plain stacked card.
  const showGlobe = useMediaQuery("(min-width: 768px)");

  const years = useMemo(() => availableYears(orders), [orders]);
  const [filters, setFilters] = useState<FinancialFilters>(() => ({
    year: availableYears(orders)[0],
    month: "all",
    clientId: "all",
    contractorId: "all",
  }));

  const periodOrders = useMemo(() => filterForFinancials(orders, filters), [orders, filters]);
  const totals = useMemo(() => sumMoney(periodOrders), [periodOrders]);
  const contractorRows = useMemo(
    () => rollUpByContractor(periodOrders, orders, contractors),
    [periodOrders, orders, contractors]
  );
  const areas = useMemo(() => coverageByArea(periodOrders), [periodOrders]);
  const footprint = useMemo(() => coveragePoints(periodOrders), [periodOrders]);

  // Sales' own slice: no login in this prototype, so "my accounts" stands in
  // for whichever Sales rep is previewed (see getActiveTeamMemberForRole).
  const salesRep = useMemo(() => getActiveTeamMemberForRole(teamMembers, "Sales"), [teamMembers]);
  const ownedClients = useMemo(
    () => clients.filter((c) => c.active && c.salesRepId === salesRep?.id),
    [clients, salesRep]
  );
  const ownedClientIds = useMemo(() => new Set(ownedClients.map((c) => c.id)), [ownedClients]);
  const salesPeriodOrders = useMemo(
    () => periodOrders.filter((o) => ownedClientIds.has(o.clientId)),
    [periodOrders, ownedClientIds]
  );
  const salesTotals = useMemo(() => sumMoney(salesPeriodOrders), [salesPeriodOrders]);
  const salesTarget = salesRep?.monthlyTargetEGP ?? 0;
  const salesTargetProgress = salesTarget > 0 ? Math.min(100, Math.round((salesTotals.receivable / salesTarget) * 100)) : 0;
  const salesAvgOrder = salesTotals.orderCount > 0 ? salesTotals.receivable / salesTotals.orderCount : 0;

  const avgPayablePerContractor = contractorRows.length > 0 ? totals.payable / contractorRows.length : 0;

  if (role !== "Sales" && role !== "Supply" && role !== "Operations") return null;

  const periodTitle = `${monthLabel(filters.month)} ${filters.year}`;

  const clientColumns: RollupColumn<ClientRow>[] = [
    { id: "name", label: "Client", render: (r) => r.name },
    { id: "orders", label: "Orders", align: "right", render: (r) => r.orders },
    { id: "subtotal", label: "Subtotal", align: "right", render: (r) => <Money value={r.subtotal} /> },
    { id: "vat", label: "VAT", align: "right", render: (r) => <Money value={r.vat} muted /> },
    { id: "total", label: "Total due", align: "right", render: (r) => <Money value={r.totalDue} strong /> },
  ];

  const contractorColumns: RollupColumn<ContractorRow>[] = [
    { id: "name", label: "Contractor", render: (r) => r.name },
    { id: "orders", label: "Orders", align: "right", render: (r) => r.orders },
    { id: "earned", label: "Earned this period", align: "right", render: (r) => <Money value={r.earnedThisPeriod} strong /> },
    { id: "allTime", label: "All time (unfiltered)", align: "right", render: (r) => <Money value={r.allTime} muted /> },
  ];

  const periodFilter = (extra?: ReactNode) => (
    <div className="rounded-2xl bg-white border border-border p-4">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Period">
          <div className="flex items-center gap-2">
            <Select
              aria-label="Month"
              value={String(filters.month)}
              onChange={(v) => setFilters((f) => ({ ...f, month: v === "all" ? "all" : Number(v) }))}
              options={MONTH_OPTIONS}
            />
            <Select
              aria-label="Year"
              value={String(filters.year)}
              onChange={(v) => setFilters((f) => ({ ...f, year: Number(v) }))}
              options={years.map((y) => ({ value: String(y), label: String(y) }))}
            />
          </div>
        </Field>
        {extra}
      </div>
    </div>
  );

  const heading = (title: string, subtitle: string) => (
    <div>
      <h2 className="text-title-3-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
        {title}
      </h2>
      <p className="mt-0.5 text-body-2-regular text-muted">{subtitle}</p>
    </div>
  );

  // Sales: its own open accounts' revenue and target only - never the full
  // book.
  if (role === "Sales") {
    return (
      <section className="flex flex-col gap-3">
        {heading(
          "Your accounts",
          salesRep ? `${salesRep.name}'s open accounts, this period.` : "Your open accounts, this period."
        )}

        {periodFilter()}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FinancialCard
            icon={ArrowDownwardIcon}
            iconColor={MONEY_COLORS.receivables}
            label="Revenue generated"
            value={salesTotals.receivable}
            caption={`From ${ownedClients.length} open account${ownedClients.length === 1 ? "" : "s"}`}
            footer={`${salesTotals.orderCount.toLocaleString()} orders · ${formatAmount(salesAvgOrder)} avg`}
          />
          <FinancialCard
            icon={SavingsIcon}
            iconColor={MONEY_COLORS.earnings}
            label="Target"
            value={salesTarget}
            caption={`${periodTitle} goal`}
          />
        </div>

        <InsightCard title="Target progress" subtitle={periodTitle}>
          <div className="w-full h-2 rounded-full bg-grey-light overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${salesTargetProgress}%`, backgroundColor: MONEY_COLORS.receivables }}
            />
          </div>
          <p className="text-caption-1-regular text-muted">
            {formatAmount(salesTotals.receivable)} of {formatAmount(salesTarget)} ({salesTargetProgress}%)
          </p>
        </InsightCard>

        <RollupTable
          icon={ApartmentIcon}
          title={`Your accounts · ${periodTitle}`}
          rows={rollUpByClient(salesPeriodOrders, ownedClients)}
          columns={clientColumns}
          emptyLabel="No invoiceable orders from your accounts in this period."
        />
      </section>
    );
  }

  // Supply: contractor payables only - receivables, earnings and VAT are a
  // Sales/Finance concern, not Supply's.
  if (role === "Supply") {
    return (
      <section className="flex flex-col gap-3">
        {heading("Contractor payables", "Contractor payables for the period.")}

        {periodFilter(
          <Field label="Contractor filter">
            <Select
              aria-label="Contractor filter"
              value={filters.contractorId}
              onChange={(v) => setFilters((f) => ({ ...f, contractorId: v }))}
              options={[
                { value: "all", label: "All contractors" },
                ...contractors.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </Field>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FinancialCard
            icon={ArrowUpwardIcon}
            iconColor={MONEY_COLORS.payables}
            label="Contractor payables"
            value={totals.payable}
            caption="Owed out to contractors"
            footer={`${totals.orderCount.toLocaleString()} orders this period`}
          />
          <FinancialCard
            icon={DomainIcon}
            iconColor={MONEY_COLORS.payables}
            label="Avg payable per contractor"
            value={avgPayablePerContractor}
            caption={`${contractorRows.length} contractor${contractorRows.length === 1 ? "" : "s"} with orders this period`}
          />
        </div>

        <RollupTable
          icon={DomainIcon}
          title={`Contractors · ${periodTitle}`}
          rows={contractorRows}
          columns={contractorColumns}
          emptyLabel="No invoiceable orders in this period."
          footnote="All time (unfiltered): everything this contractor has ever earned — never narrowed by the filters above."
        />
      </section>
    );
  }

  // Operations: the coverage heatmap only, no money figures - "zones
  // covered" stands in for the numbers the other roles see.
  return (
    <section className="flex flex-col gap-3">
      {heading("Coverage", "Where this period's orders went.")}

      {periodFilter()}

      {showGlobe ? (
        <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: `${BAND_MIN_PX}px` }}>
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: `${GLOBE_PX}px`,
              height: `${GLOBE_PX}px`,
            }}
          >
            <Suspense fallback={null}>
              <OrdersGlobe coverage={footprint} className="w-full h-full" />
            </Suspense>
          </div>

          <div className="relative flex justify-center pt-6 pointer-events-none">
            <div className="pointer-events-auto">
              <InsightCard title="Zones covered" subtitle={periodTitle}>
                <p className="text-title-2-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
                  {areas.length}
                </p>
                <p className="text-caption-1-regular text-muted">distinct areas touched by this period's orders</p>
              </InsightCard>
            </div>
          </div>
        </div>
      ) : (
        <InsightCard title="Zones covered" subtitle={periodTitle}>
          <p className="text-title-2-semibold text-navy" style={{ fontFamily: "var(--font-heading)" }}>
            {areas.length}
          </p>
          <p className="text-caption-1-regular text-muted">distinct areas touched by this period's orders</p>
        </InsightCard>
      )}
    </section>
  );
}
