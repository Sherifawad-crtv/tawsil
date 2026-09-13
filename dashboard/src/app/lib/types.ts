export type OrderStatus = "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
export type TripType = "On Demand" | "Daily" | "Monthly";

export type Role = "Sales" | "Supply" | "Operations" | "Admin";

export interface AttentionOrder {
  id: string;
  clientName: string;
  status: OrderStatus;
  /** Minutes spent in the current status */
  minutesInStatus: number;
  reason: "stalled-pending" | "pod-missing" | "monthly-renewal";
  detail: string;
  action: string;
}

export interface HomeMetrics {
  pendingOrders: number;
  activeOrders: number;
  availableDrivers: number;
  completedToday: number;
}
