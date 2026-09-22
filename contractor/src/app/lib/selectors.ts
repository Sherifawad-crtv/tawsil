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

/** Trucks/drivers already on another order that hasn't finished yet - excluded from dispatch. */
export function dispatchableTrucks(trucks: Truck[], orders: Order[]) {
  const busy = new Set(getActiveOrders(orders).map((o) => o.truckId).filter(Boolean));
  return activeTrucks(trucks).filter((t) => !busy.has(t.id));
}

export function dispatchableDrivers(drivers: Driver[], orders: Order[]) {
  const busy = new Set(getActiveOrders(orders).map((o) => o.driverId).filter(Boolean));
  return activeDrivers(drivers).filter((d) => !busy.has(d.id));
}
