import type { AttentionOrder, HomeMetrics } from "./types";

// Realistic scale for the live system: ~725 orders, 6 contractors, 12 clients,
// 33 drivers, 42 vehicles. Most orders are Completed at any point in time.
export const PLATFORM_TOTALS = {
  totalOrders: 725,
  contractors: 6,
  clients: 12,
  drivers: 33,
  vehicles: 42,
};

export const HOME_METRICS: HomeMetrics = {
  pendingOrders: 12,
  activeOrders: 22,
  availableDrivers: 21,
  completedToday: 14,
};

export const ATTENTION_ORDERS: AttentionOrder[] = [
  {
    id: "TWL-2026-004821",
    clientName: "Juhayna Food Industries",
    status: "Pending",
    minutesInStatus: 187,
    reason: "stalled-pending",
    detail: "Awaiting Supply allocation",
    action: "Assign",
  },
  {
    id: "TWL-2026-004798",
    clientName: "Carrefour Egypt",
    status: "Pending",
    minutesInStatus: 142,
    reason: "stalled-pending",
    detail: "Awaiting Supply allocation",
    action: "Assign",
  },
  {
    id: "TWL-2026-004766",
    clientName: "Edita Food Industries",
    status: "In Progress",
    minutesInStatus: 96,
    reason: "pod-missing",
    detail: "Proof of Delivery overdue by 1h 36m",
    action: "Follow up",
  },
  {
    id: "TWL-2026-004752",
    clientName: "Al Ahram Beverages",
    status: "In Progress",
    minutesInStatus: 211,
    reason: "pod-missing",
    detail: "Proof of Delivery overdue by 3h 31m",
    action: "Follow up",
  },
  {
    id: "MOT-2026-000088",
    clientName: "Nestlé Egypt",
    status: "In Progress",
    minutesInStatus: 0,
    reason: "monthly-renewal",
    detail: "Monthly contract — 2 scheduled days remaining",
    action: "Renew",
  },
  {
    id: "TWL-2026-004811",
    clientName: "Domty Dairy",
    status: "Pending",
    minutesInStatus: 68,
    reason: "stalled-pending",
    detail: "Awaiting Supply allocation",
    action: "Assign",
  },
];
