import type { OrderStatus } from "./types";

/** How far along a trip is, by status: the fill of the gradient progress bars. */
export const TRIP_PROGRESS: Partial<Record<OrderStatus, { pct: number; label: string }>> = {
  Pending: { pct: 0, label: "Awaiting acceptance" },
  Accepted: { pct: 0.1, label: "Awaiting driver" },
  Assigned: { pct: 0.2, label: "Driver Assigned" },
  "In Progress": { pct: 0.65, label: "In Transit" },
  Completed: { pct: 1, label: "Delivered" },
  Cancelled: { pct: 0, label: "Cancelled" },
};
