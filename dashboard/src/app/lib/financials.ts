import { getTruckType } from "./selectors";
import type { Order, Client, Contractor } from "./types";

/**
 * Accrued, invoiceable figures from completed orders.
 *
 * Orders carry no price of their own, so the money is derived from the rate
 * card using the pricing convention this codebase already applies to monthly
 * contracts (see ordersMock): the contractor is paid the truck type's daily
 * rent, the client is billed that rent plus a 28% markup, and VAT is charged
 * at 14% on the client subtotal. Reusing that rule rather than inventing a
 * second one keeps one-off orders and monthly contracts priced the same way.
 *
 * It yields the identity the figures are meant to satisfy:
 *   Receivables = Payables + Earnings + VAT
 */
export const CLIENT_MARKUP = 1.28;
export const VAT_PERCENT = 14;

/** Only completed work is invoiceable - pending and cancelled orders are not revenue. */
export function isInvoiceable(order: Order) {
  return order.status === "Completed";
}

export interface OrderMoney {
  /** Owed out to the contractor. */
  payable: number;
  /** Client charge before VAT. */
  subtotal: number;
  /** What the company keeps: subtotal less the contractor's share. */
  earnings: number;
  /** Collected on behalf of the tax authority - a liability, not income. */
  vat: number;
  /** Billed to the client, VAT included. */
  receivable: number;
}

const EMPTY: OrderMoney = { payable: 0, subtotal: 0, earnings: 0, vat: 0, receivable: 0 };

export function orderMoney(order: Order): OrderMoney {
  const truckType = getTruckType(order.truckTypeId);
  if (!truckType) return EMPTY;

  const payable = truckType.dailyRentEGP;
  const subtotal = payable * CLIENT_MARKUP;
  const vat = subtotal * (VAT_PERCENT / 100);

  return {
    payable,
    subtotal,
    earnings: subtotal - payable,
    vat,
    receivable: subtotal + vat,
  };
}

export function sumMoney(orders: Order[]): OrderMoney & { orderCount: number } {
  const total = orders.reduce<OrderMoney>((acc, order) => {
    const m = orderMoney(order);
    return {
      payable: acc.payable + m.payable,
      subtotal: acc.subtotal + m.subtotal,
      earnings: acc.earnings + m.earnings,
      vat: acc.vat + m.vat,
      receivable: acc.receivable + m.receivable,
    };
  }, EMPTY);

  return { ...total, orderCount: orders.length };
}

// ---- Filtering --------------------------------------------------------------

export interface FinancialFilters {
  year: number;
  /** 1-12, or "all" for the whole year. */
  month: number | "all";
  clientId: string | "all";
  contractorId: string | "all";
}

/** An order counts toward a period by when it was completed, not when it was raised. */
function completedAt(order: Order) {
  const completion = [...order.statusHistory].reverse().find((h) => h.toStatus === "Completed");
  return new Date(completion?.timestamp ?? order.createdAt);
}

export function filterForFinancials(orders: Order[], filters: FinancialFilters) {
  return orders.filter((order) => {
    if (!isInvoiceable(order)) return false;
    if (filters.clientId !== "all" && order.clientId !== filters.clientId) return false;
    if (filters.contractorId !== "all" && order.contractorId !== filters.contractorId) return false;

    const at = completedAt(order);
    if (at.getFullYear() !== filters.year) return false;
    if (filters.month !== "all" && at.getMonth() + 1 !== filters.month) return false;
    return true;
  });
}

// ---- Rollups ----------------------------------------------------------------

export interface ClientRow {
  id: string;
  name: string;
  orders: number;
  subtotal: number;
  vat: number;
  totalDue: number;
}

export function rollUpByClient(orders: Order[], clients: Client[]): ClientRow[] {
  const byId = new Map<string, ClientRow>();

  for (const order of orders) {
    const m = orderMoney(order);
    const row = byId.get(order.clientId);
    if (row) {
      row.orders += 1;
      row.subtotal += m.subtotal;
      row.vat += m.vat;
      row.totalDue += m.receivable;
    } else {
      byId.set(order.clientId, {
        id: order.clientId,
        name: clients.find((c) => c.id === order.clientId)?.name ?? "Unknown client",
        orders: 1,
        subtotal: m.subtotal,
        vat: m.vat,
        totalDue: m.receivable,
      });
    }
  }

  return [...byId.values()].sort((a, b) => b.totalDue - a.totalDue);
}

export interface ContractorRow {
  id: string;
  name: string;
  orders: number;
  earnedThisPeriod: number;
  /** Everything this contractor has ever earned - never narrowed by the filters. */
  allTime: number;
}

export function rollUpByContractor(
  periodOrders: Order[],
  allOrders: Order[],
  contractors: Contractor[]
): ContractorRow[] {
  const allTimeById = new Map<string, number>();
  for (const order of allOrders) {
    if (!isInvoiceable(order) || !order.contractorId) continue;
    allTimeById.set(order.contractorId, (allTimeById.get(order.contractorId) ?? 0) + orderMoney(order).payable);
  }

  const byId = new Map<string, ContractorRow>();
  for (const order of periodOrders) {
    if (!order.contractorId) continue;
    const m = orderMoney(order);
    const row = byId.get(order.contractorId);
    if (row) {
      row.orders += 1;
      row.earnedThisPeriod += m.payable;
    } else {
      byId.set(order.contractorId, {
        id: order.contractorId,
        name: contractors.find((c) => c.id === order.contractorId)?.name ?? "Unknown contractor",
        orders: 1,
        earnedThisPeriod: m.payable,
        allTime: allTimeById.get(order.contractorId) ?? 0,
      });
    }
  }

  return [...byId.values()].sort((a, b) => b.earnedThisPeriod - a.earnedThisPeriod);
}

// ---- Trend ------------------------------------------------------------------

export interface TrendPoint {
  month: string;
  receivables: number;
  payables: number;
  earnings: number;
  vat: number;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Twelve points for the year, ignoring the month filter but honouring client/contractor. */
export function monthlyTrend(orders: Order[], filters: FinancialFilters): TrendPoint[] {
  const points: TrendPoint[] = MONTH_LABELS.map((month) => ({
    month,
    receivables: 0,
    payables: 0,
    earnings: 0,
    vat: 0,
  }));

  const yearOrders = filterForFinancials(orders, { ...filters, month: "all" });
  for (const order of yearOrders) {
    const m = orderMoney(order);
    const point = points[completedAt(order).getMonth()];
    point.receivables += m.receivable;
    point.payables += m.payable;
    point.earnings += m.earnings;
    point.vat += m.vat;
  }

  return points;
}

/** Years present in the completed order book, newest first. */
export function availableYears(orders: Order[]): number[] {
  const years = new Set<number>();
  for (const order of orders) {
    if (isInvoiceable(order)) years.add(completedAt(order).getFullYear());
  }
  if (years.size === 0) years.add(new Date().getFullYear());
  return [...years].sort((a, b) => b - a);
}

const FULL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Options for the period picker, plus a whole-year choice. */
export const MONTH_OPTIONS = [
  { value: "all", label: "Whole year" },
  ...FULL_MONTHS.map((label, i) => ({ value: String(i + 1), label })),
];

export function monthLabel(month: number | "all") {
  return month === "all" ? "Whole year" : FULL_MONTHS[month - 1];
}

// ---- Palette ----------------------------------------------------------------

/**
 * One colour per money series, drawn from the dashboard's own status tokens
 * rather than invented for this page - so the split bar, the trend chart and
 * the headline tiles can't drift apart.
 */
export const MONEY_COLORS = {
  receivables: "#1253fa", // --color-blue
  payables: "#d97706", // --color-status-pending
  earnings: "#16803c", // --color-status-completed
  vat: "#9ca3af", // --color-muted: a liability, deliberately colourless
} as const;
