import type { OrderStatus } from "./types";

/** How far along a trip is, by status: the fill of the gradient progress bars. */
export const TRIP_PROGRESS: Partial<Record<OrderStatus, { pct: number; label: string }>> = {
  Assigned: { pct: 0.2, label: "Driver Assigned" },
  "In Progress": { pct: 0.65, label: "In Transit" },
  Completed: { pct: 1, label: "Delivered" },
};
