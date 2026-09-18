import type { Order, Truck, Driver } from "./types";

export const ACTIVE_STATUSES = ["Accepted", "Assigned", "In Progress"] as const;

export function byId<T extends { id: string }>(list: T[], id: string | undefined) {
  return id ? list.find((x) => x.id === id) : undefined;
}

export function getAvailableOrders(orders: Order[]) {
  return orders.filter((o) => o.status === "Pending");
}

export function getActiveOrders(orders: Order[]) {
  return orders.filter((o) => (ACTIVE_STATUSES as readonly string[]).includes(o.status));
}

export function getHistoryOrders(orders: Order[]) {
  return orders.filter((o) => o.status === "Completed" || o.status === "Cancelled");
}

export function activeTrucks(trucks: Truck[]) {
  return trucks.filter((t) => t.active);
}

export function activeDrivers(drivers: Driver[]) {
  return drivers.filter((d) => d.active);
}
