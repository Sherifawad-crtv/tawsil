import { lazy, Suspense, useMemo, useState } from "react";
import { Navigate } from "react-router";
import { ApartmentIcon, DomainIcon, ArrowDownwardIcon, ArrowUpwardIcon, SavingsIcon, ReceiptLongIcon } from "../../components/icons";
import PageHeader from "../../components/PageHeader";
import InsightCard from "../../components/InsightCard";
import { Select } from "../../components/Select";
import FinancialCard from "../../components/financials/FinancialCard";
import MoneySplitBar from "../../components/financials/MoneySplitBar";
import MonthlyTrendChart from "../../components/financials/MonthlyTrendChart";
import CoveragePie from "../../components/financials/CoveragePie";
import RollupTable, { type RollupColumn } from "../../components/financials/RollupTable";
import { useDataStore } from "../../lib/store";
import { useRole } from "../../lib/RoleContext";
import { useMediaQuery } from "../../lib/useMediaQuery";
import { canViewCommandCenter, getActiveTeamMemberForRole } from "../../lib/selectors";
import { formatAmount } from "../../lib/format";
import { coverageByArea, coveragePoints } from "../../lib/coverage";
import {
  MONEY_COLORS,
  MONTH_OPTIONS,
  availableYears,
  filterForFinancials,
  monthlyTrend,
  monthLabel,
  rollUpByClient,
  rollUpByContractor,
  sumMoney,
  type ClientRow,
  type ContractorRow,
  type FinancialFilters,
} from "../../lib/financials";

// three.js is heavy - kept out of the main bundle so every other page loads
// exactly as fast as it did before this view existed.
const OrdersGlobe = lazy(() => import("../../components/globe/OrdersGlobe"));

// Square canvas, centred in the band.
//
// The two numbers below were measured off the rendered page, not derived:
// scanning the gutter column pixel by pixel, the sphere covers ~90% of its
// square canvas at OrdersGlobe's framing, and the drop shadow reaches about
// 34px past its bottom edge. The band is sized from those, so the sphere and
// its shadow always clear the top and bottom - the only side ever cut is
// left/right, where the cards overlap it on purpose.
const GLOBE_PX = 820;
const SPHERE_PX = Math.round(GLOBE_PX * 0.9);
const BAND_MIN_PX = SPHERE_PX + 2 * 68;

// The gap the two card columns leave down the middle for the globe to show
// through, always narrower than the sphere: the cards are meant to overlap
// its edges, not sit politely beside it. It steps down with the viewport so
// a tablet still gets usable card columns - at a flat desktop gutter they
// came out at 173px, which no card survives.
const COLUMNS = [
  "[grid-template-columns:minmax(0,1fr)_80px_minmax(0,1fr)]",
  "lg:[grid-template-columns:minmax(0,1fr)_170px_minmax(0,1fr)]",
  "xl:[grid-template-columns:minmax(0,1fr)_300px_minmax(0,1fr)]",
  "2xl:[grid-template-columns:minmax(0,1fr)_380px_minmax(0,1fr)]",
].join(" ");

export default function CommandCenter() {
  const { orders, clients, contractors, teamMembers } = useDataStore();
  const { role } = useRole();
  // The globe is a desktop/tablet set piece - on phones it's swapped for a
  // plain stacked layout, the same shape as Home: no overlap, no absolute
  // positioning, just cards in a column.
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
  const trend = useMemo(() => monthlyTrend(orders, filters), [orders, filters]);
  const clientRows = useMemo(() => rollUpByClient(periodOrders, clients), [periodOrders, clients]);
  const contractorRows = useMemo(
    () => rollUpByContractor(periodOrders, orders, contractors),
    [periodOrders, orders, contractors]
  );
  // Coverage follows the same filters as the money, so the pie and the globe
  // answer "where did this period's work go", not "where have we ever been".
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

  // Supply's own slice: payables only, never receivables (its figures share
  // the same totals/contractorRows the full view computes above).
  const avgPayablePerContractor = contractorRows.length > 0 ? totals.payable / contractorRows.length : 0;

  // The sidebar hides this tab for other roles, but hiding a link isn't
  // gating - without this the page is still reachable by typing the URL.
  if (!canViewCommandCenter(role)) return <Navigate to="/home" replace />;

  const periodTitle = `${monthLabel(filters.month)} ${filters.year}`;
  const marginPercent =
    totals.receivable > 0 ? Math.round((totals.earnings / totals.receivable) * 100) : 0;
  const avgOrder = totals.orderCount > 0 ? totals.receivable / totals.orderCount : 0;

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

  // Sales: its own open accounts' revenue and target only - never the full
  // book the figures below belong to.
  if (role === "Sales") {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Command Center"
          subtitle={salesRep ? `${salesRep.name}'s open accounts, this period.` : "Your open accounts, this period."}
        />

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
          </div>
        </div>

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
      </div>
    );
  }

  // Supply: contractor payables only - receivables, earnings and VAT are a
  // Sales/Finance concern, not Supply's.
  if (role === "Supply") {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Command Center" subtitle="Contractor payables for the period." />

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
          </div>
        </div>

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
      </div>
    );
  }

  // Operations: the coverage heatmap only, no money figures - "zones
  // covered" stands in for the numbers the other roles see.
  if (role === "Operations") {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Command Center" subtitle="Where this period's orders went." />

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
          </div>
        </div>

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
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Command Center" subtitle="Accrued, invoiceable figures from completed orders." />

      {/* Filters run the full width in one row, like every other filter bar here. */}
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

          <Field label="Client filter">
            <Select
              aria-label="Client filter"
              value={filters.clientId}
              onChange={(v) => setFilters((f) => ({ ...f, clientId: v }))}
              options={[
                { value: "all", label: "All clients" },
                ...clients.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </Field>

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
        </div>
      </div>

      {showGlobe ? (
        /*
          The globe sits dead centre, turning, with the coverage footprint
          on it. Money on the left over the trend; the split and the area
          coverage on the right. Tablet and up only - see showGlobe.
        */
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

          {/*
            The grid is a full-width box painted above the globe, so left to
            itself it swallows every pointer event in the gutter and the globe
            can't be dragged. It passes the pointer through; only the two card
            columns take it back.
          */}
          <div className={`relative grid gap-3 items-stretch pointer-events-none ${COLUMNS}`}>
            <div className="flex flex-col gap-3 pointer-events-auto">
              <div className="grid grid-cols-2 gap-3">
                <FinancialCard
                  icon={ArrowDownwardIcon}
                  iconColor={MONEY_COLORS.receivables}
                  label="Client receivables"
                  value={totals.receivable}
                  caption="Billed to clients, VAT included"
                  footer={`${totals.orderCount.toLocaleString()} orders · ${formatAmount(avgOrder)} avg`}
                />
                <FinancialCard
                  icon={ArrowUpwardIcon}
                  iconColor={MONEY_COLORS.payables}
                  label="Contractor payables"
                  value={totals.payable}
                  caption="Owed out to contractors"
                />
                <FinancialCard
                  icon={SavingsIcon}
                  iconColor={MONEY_COLORS.earnings}
                  label="Company earnings"
                  value={totals.earnings}
                  caption={`Kept — ${marginPercent}% of receivables`}
                />
                <FinancialCard
                  icon={ReceiptLongIcon}
                  iconColor={MONEY_COLORS.vat}
                  label="Taxes (VAT)"
                  value={totals.vat}
                  caption="Held for the tax authority"
                />
              </div>

              <MonthlyTrendChart data={trend} year={filters.year} />
            </div>

            {/* The gutter the globe shows through. */}
            <div aria-hidden />

            <div className="flex flex-col gap-3 pointer-events-auto">
              <InsightCard title="Where it splits" subtitle="Every pound billed, accounted for">
                <MoneySplitBar payables={totals.payable} earnings={totals.earnings} vat={totals.vat} />
              </InsightCard>

              {/* Fills the rest of the column so both sides end level. */}
              <InsightCard title="Area coverage" subtitle="Share of orders by area" className="flex-1">
                <CoveragePie data={areas} />
              </InsightCard>
            </div>
          </div>
        </div>
      ) : (
        /*
          Phones: no globe, no overlap - the same plain stacked-card shape
          as Home. Same data, same components, just laid out top to bottom.
        */
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <FinancialCard
              icon={ArrowDownwardIcon}
              iconColor={MONEY_COLORS.receivables}
              label="Client receivables"
              value={totals.receivable}
              caption="Billed to clients, VAT included"
              footer={`${totals.orderCount.toLocaleString()} orders · ${formatAmount(avgOrder)} avg`}
            />
            <FinancialCard
              icon={ArrowUpwardIcon}
              iconColor={MONEY_COLORS.payables}
              label="Contractor payables"
              value={totals.payable}
              caption="Owed out to contractors"
            />
            <FinancialCard
              icon={SavingsIcon}
              iconColor={MONEY_COLORS.earnings}
              label="Company earnings"
              value={totals.earnings}
              caption={`Kept — ${marginPercent}% of receivables`}
            />
            <FinancialCard
              icon={ReceiptLongIcon}
              iconColor={MONEY_COLORS.vat}
              label="Taxes (VAT)"
              value={totals.vat}
              caption="Held for the tax authority"
            />
          </div>

          <MonthlyTrendChart data={trend} year={filters.year} />

          <InsightCard title="Where it splits" subtitle="Every pound billed, accounted for">
            <MoneySplitBar payables={totals.payable} earnings={totals.earnings} vat={totals.vat} />
          </InsightCard>

          <InsightCard title="Area coverage" subtitle="Share of orders by area">
            <CoveragePie data={areas} />
          </InsightCard>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <RollupTable
          icon={ApartmentIcon}
          title={`Clients · ${periodTitle}`}
          rows={clientRows}
          columns={clientColumns}
          emptyLabel="No invoiceable orders in this period."
        />
        <RollupTable
          icon={DomainIcon}
          title={`Contractors · ${periodTitle}`}
          rows={contractorRows}
          columns={contractorColumns}
          emptyLabel="No invoiceable orders in this period."
          footnote="All time (unfiltered): everything this contractor has ever earned — never narrowed by the filters above."
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="text-caption-2-semibold uppercase tracking-wide text-muted"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Money({ value, strong = false, muted = false }: { value: number; strong?: boolean; muted?: boolean }) {
  return (
    <span
      className={
        strong
          ? "text-body-2-semibold text-navy"
          : muted
            ? "text-body-2-regular text-muted"
            : "text-body-2-regular text-navy"
      }
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {formatAmount(value)}
    </span>
  );
}
