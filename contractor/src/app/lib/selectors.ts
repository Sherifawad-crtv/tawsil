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

/** Dispatched trips: active orders that already have a driver. */
export function getInProgressOrders(orders: Order[]) {
  return getActiveOrders(orders).filter((o) => !(o.status === "Accepted" && !o.driverId));
}

/** Accepted but no driver on it yet. */
export function getUnassignedOrders(orders: Order[]) {
  return orders.filter((o) => o.status === "Accepted" && !o.driverId);
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

export interface RevenueSummary {
  /** Everything earned on completed trips. */
  total: number;
  /** Completed in the current calendar month. */
  thisMonth: number;
  /** Value of trips accepted, assigned or on the road but not yet completed. */
  upcoming: number;
  tripsDone: number;
  averagePerTrip: number;
}

export function revenueSummary(orders: Order[], now = new Date()): RevenueSummary {
  const done = orders.filter((o) => o.status === "Completed");
  const completedAt = (o: Order) => {
    const entry = [...o.statusHistory].reverse().find((h) => h.toStatus === "Completed");
    return new Date(entry?.timestamp ?? o.pickupAt);
  };
  const total = done.reduce((sum, o) => sum + o.priceEGP, 0);
  const thisMonth = done
    .filter((o) => {
      const d = completedAt(o);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, o) => sum + o.priceEGP, 0);
  const upcoming = orders.filter((o) => (ACTIVE_STATUSES as readonly string[]).includes(o.status)).reduce((sum, o) => sum + o.priceEGP, 0);
  return { total, thisMonth, upcoming, tripsDone: done.length, averagePerTrip: done.length ? total / done.length : 0 };
}
