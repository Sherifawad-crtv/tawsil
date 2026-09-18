import { getCurrentOrderForVehicle } from "./selectors";
import type { Driver, Order, Vehicle } from "./types";

/**
 * What the fleet board needs to know about a vehicle beyond its own record:
 * where it stands right now, what it has done, and who drives it. Everything
 * is read off the order book - no field here is invented for the view.
 */

/** Inactive beats everything; otherwise the vehicle's state is its current order's, or it's free. */
export type VehicleStatus = "Available" | "Assigned" | "In Progress" | "Inactive";
export const VEHICLE_STATUSES: VehicleStatus[] = ["Available", "Assigned", "In Progress", "Inactive"];

export function vehicleStatus(vehicle: Vehicle, orders: Order[]): VehicleStatus {
  if (!vehicle.active) return "Inactive";
  const current = getCurrentOrderForVehicle(orders, vehicle.id);
  if (!current) return "Available";
  return current.status === "In Progress" ? "In Progress" : "Assigned";
}

/** Everything this vehicle has ever been put on, newest first. */
export function ordersForVehicle(orders: Order[], vehicleId: string) {
  return orders
    .filter((o) => o.vehicleId === vehicleId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** The driver on the current order, else the last one recorded for this vehicle. */
export function driverForVehicle(vehicleOrders: Order[], drivers: Driver[]): { driver: Driver; current: boolean } | null {
  const current = vehicleOrders.find((o) => o.status === "Assigned" || o.status === "In Progress");
  const source = current ?? vehicleOrders.find((o) => o.driverId);
  const driver = source?.driverId ? drivers.find((d) => d.id === source.driverId) : undefined;
  return driver ? { driver, current: Boolean(current) } : null;
}

export interface MonthCount {
  label: string;
  count: number;
}

export interface VehiclePerformance {
  total: number;
  completed: number;
  cancelled: number;
  lastCompletedAt?: string;
  /** Orders raised per month, oldest first. */
  monthly: MonthCount[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function completedAt(order: Order) {
  return [...order.statusHistory].reverse().find((h) => h.toStatus === "Completed")?.timestamp;
}

export function vehiclePerformance(vehicleOrders: Order[], months = 6, now = new Date()): VehiclePerformance {
  const completedOrders = vehicleOrders.filter((o) => o.status === "Completed");
  const stamps = completedOrders
    .map(completedAt)
    .filter((t): t is string => Boolean(t))
    .sort();
  const lastCompletedAt = stamps[stamps.length - 1];

  const monthly: MonthCount[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const count = vehicleOrders.filter((o) => {
      const c = new Date(o.createdAt);
      return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
    }).length;
    monthly.push({ label: MONTHS[d.getMonth()], count });
  }

  return {
    total: vehicleOrders.length,
    completed: completedOrders.length,
    cancelled: vehicleOrders.filter((o) => o.status === "Cancelled").length,
    lastCompletedAt,
    monthly,
  };
}
