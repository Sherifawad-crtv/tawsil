import type { Order, OrderStatus } from "./types";

/**
 * What an Analytics tab actually has to work with: a contractor's or a
 * client's own slice of the order book. Everything here is read off orders
 * already on the entity - nothing invented, nothing that needs a field this
 * data model doesn't carry (no on-time/SLA timestamp exists, so there is no
 * on-time rate here).
 */

export interface EntityAnalytics {
  total: number;
  completed: number;
  cancelled: number;
  /** Share of orders that reached Completed, of total - cancelled orders excluded from the base since they never had a chance to complete. */
  completionRate: number;
  statusMix: { status: OrderStatus; count: number }[];
  /** Top 6 cargo types by order count, the rest folded into "Other". */
  cargoMix: { label: string; count: number }[];
  /** Orders raised per month, oldest first. */
  monthly: { label: string; count: number }[];
}

const STATUSES: OrderStatus[] = ["Pending", "Assigned", "In Progress", "Completed", "Cancelled"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CARGO_TOP_N = 6;

export function entityAnalytics(orders: Order[], months = 6, now = new Date()): EntityAnalytics {
  const completed = orders.filter((o) => o.status === "Completed").length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;
  const decided = orders.length - cancelled; // orders that ran their course, win or lose
  const completionRate = decided > 0 ? Math.round((completed / decided) * 100) : 0;

  const statusMix = STATUSES.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));

  const cargoCounts = new Map<string, number>();
  for (const order of orders) {
    for (const cargo of order.cargoTypes) cargoCounts.set(cargo, (cargoCounts.get(cargo) ?? 0) + 1);
  }
  const rankedCargo = [...cargoCounts.entries()].sort((a, b) => b[1] - a[1]);
  const cargoMix = rankedCargo.slice(0, CARGO_TOP_N).map(([label, count]) => ({ label, count }));
  const cargoRest = rankedCargo.slice(CARGO_TOP_N).reduce((sum, [, c]) => sum + c, 0);
  if (cargoRest > 0) cargoMix.push({ label: "Other", count: cargoRest });

  const monthly: { label: string; count: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const count = orders.filter((o) => {
      const c = new Date(o.createdAt);
      return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
    }).length;
    monthly.push({ label: MONTHS[d.getMonth()], count });
  }

  return { total: orders.length, completed, cancelled, completionRate, statusMix, cargoMix, monthly };
}
