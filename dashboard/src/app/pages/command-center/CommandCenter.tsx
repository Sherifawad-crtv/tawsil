import { lazy, Suspense, useMemo, useState } from "react";
import { Navigate } from "react-router";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  SafeSquareIcon,
  BillListIcon,
  Buildings2Icon,
  UsersGroupRoundedIcon,
  InfoCircleIcon,
} from "@solar-icons/react/linear";
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
import { canViewCommandCenter } from "../../lib/selectors";
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
  const { orders, clients, contractors } = useDataStore();
  const { role } = useRole();

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

  // The sidebar hides this tab for other roles, but hiding a link isn't
  // gating - without this the page is still reachable by typing the URL.
  if (!canViewCommandCenter(role)) return <Navigate to="/" replace />;

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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Command Center" subtitle="Accrued, invoiceable figures from completed orders." />

      {/* Filters run the full width in one row, like every other filter bar here. */}
      <div className="rounded-2xl bg-white border border-border p-4 flex flex-col gap-3">
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

        <p className="flex items-center gap-1.5 text-caption-1-regular text-muted">
          <InfoCircleIcon size={14} className="flex-shrink-0" />
          Receivables = Payables + Earnings + VAT
        </p>
      </div>

      {/*
        The globe sits dead centre, turning, with the coverage footprint on
        it. Money on the left over the trend; the split and the area
        coverage on the right. Desktop and tablet only by request - there
        is deliberately no stacked phone layout.
      */}
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

        <div className={`relative grid gap-3 items-start ${COLUMNS}`}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <FinancialCard
                icon={ArrowDownIcon}
                iconColor={MONEY_COLORS.receivables}
                label="Client receivables"
                value={totals.receivable}
                caption="Billed to clients, VAT included"
                footer={`${totals.orderCount.toLocaleString()} orders · ${formatAmount(avgOrder)} avg`}
              />
              <FinancialCard
                icon={ArrowUpIcon}
                iconColor={MONEY_COLORS.payables}
                label="Contractor payables"
                value={totals.payable}
                caption="Owed out to contractors"
              />
              <FinancialCard
                icon={SafeSquareIcon}
                iconColor={MONEY_COLORS.earnings}
                label="Company earnings"
                value={totals.earnings}
                caption={`Kept — ${marginPercent}% of receivables`}
              />
              <FinancialCard
                icon={BillListIcon}
                iconColor={MONEY_COLORS.vat}
                liability
                label="Taxes (VAT)"
                value={totals.vat}
                caption="Held for the tax authority"
              />
            </div>

            <MonthlyTrendChart data={trend} year={filters.year} />
          </div>

          {/* The gutter the globe shows through. */}
          <div aria-hidden />

          <div className="flex flex-col gap-3">
            <InsightCard title="Where it splits" subtitle="Every pound billed, accounted for">
              <MoneySplitBar payables={totals.payable} earnings={totals.earnings} vat={totals.vat} />
            </InsightCard>

            <InsightCard title="Area coverage" subtitle="Share of orders by area">
              <CoveragePie data={areas} />
            </InsightCard>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <RollupTable
          icon={Buildings2Icon}
          title={`Clients · ${periodTitle}`}
          rows={clientRows}
          columns={clientColumns}
          emptyLabel="No invoiceable orders in this period."
        />
        <RollupTable
          icon={UsersGroupRoundedIcon}
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
