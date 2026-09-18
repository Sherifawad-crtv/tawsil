import { lazy, Suspense, useMemo, useState } from "react";
import { Navigate } from "react-router";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  SafeSquareIcon,
  BillListIcon,
  Buildings2Icon,
  UsersGroupRoundedIcon,
} from "@solar-icons/react/linear";
import PageHeader from "../../components/PageHeader";
import InsightCard from "../../components/InsightCard";
import { Select } from "../../components/Select";
import FinancialCard from "../../components/financials/FinancialCard";
import SolidMoneyStat from "../../components/financials/SolidMoneyStat";
import MoneySplitBar from "../../components/financials/MoneySplitBar";
import MonthlyTrendChart from "../../components/financials/MonthlyTrendChart";
import RollupTable, { type RollupColumn } from "../../components/financials/RollupTable";
import { useDataStore } from "../../lib/store";
import { useRole } from "../../lib/RoleContext";
import { canViewCommandCenter } from "../../lib/selectors";
import { formatAmount } from "../../lib/format";
import {
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

// The globe's canvas is square and the sphere covers ~82% of it at the
// framing OrdersGlobe uses, so this is also the band's height: the sphere
// then has real margin above and below and is only ever cut on the right,
// where it deliberately runs off the panel.
const GLOBE_PX = 900;

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

      {/*
        The globe is the backdrop, oversized and running off the right edge -
        overflow-hidden is what cuts that side, and only that side. The card
        column sits over it on the left, in this dashboard's own grid: two
        solid brand tiles carry the figures an exec reads first, everything
        else stays on white so those keep their weight.
      */}
      <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: `${GLOBE_PX}px` }}>
        {/*
          Centred vertically rather than pinned to the top: the card column
          runs taller than the globe, and pinning left a dead gap on the
          right below it. The band is never shorter than the globe (that's
          what minHeight is for), so centring can't clip it either.
        */}
        <div
          className="absolute hidden lg:block"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            right: "-220px",
            width: `${GLOBE_PX}px`,
            height: `${GLOBE_PX}px`,
          }}
        >
          <Suspense fallback={null}>
            <OrdersGlobe className="w-full h-full" />
          </Suspense>
        </div>

        <div className="relative w-full lg:w-[62%] flex flex-col gap-3 p-1">
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

              <Field label="Client">
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

              <Field label="Contractor">
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

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-7 flex flex-col gap-3">
              <SolidMoneyStat
                icon={ArrowDownIcon}
                background="#1253fa"
                label="Client receivables"
                value={totals.receivable}
                caption="Billed to clients, VAT included"
                footer={`${totals.orderCount.toLocaleString()} completed orders · ${formatAmount(avgOrder)} EGP average`}
              />
              <SolidMoneyStat
                icon={SafeSquareIcon}
                background="#0a0070"
                label="Company earnings"
                value={totals.earnings}
                caption={`What the company keeps — ${marginPercent}% of receivables`}
              />
            </div>

            <div className="col-span-12 sm:col-span-5">
              <InsightCard title="Where it splits" subtitle="Every pound billed, accounted for">
                <MoneySplitBar payables={totals.payable} earnings={totals.earnings} vat={totals.vat} />
              </InsightCard>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-6">
              <FinancialCard
                icon={ArrowUpIcon}
                tone="amber"
                label="Contractor payables"
                value={formatAmount(totals.payable)}
                caption="Owed out to contractors"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FinancialCard
                icon={BillListIcon}
                tone="navy"
                liability
                label="Taxes (VAT)"
                value={formatAmount(totals.vat)}
                caption="Held for the tax authority — not income"
              />
            </div>
          </div>

          <MonthlyTrendChart data={trend} year={filters.year} />
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
