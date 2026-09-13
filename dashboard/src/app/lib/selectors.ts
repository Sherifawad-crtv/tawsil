import { TRUCK_TYPES } from "./constants";
import type { AttentionOrder, Client, Contractor, Driver, HomeMetrics, MonthlyOrder, Order, Vehicle } from "./types";

export function getTruckType(id: string) {
  return TRUCK_TYPES.find((t) => t.id === id)!;
}

export function byId<T extends { id: string }>(list: T[], id?: string): T | undefined {
  return id ? list.find((item) => item.id === id) : undefined;
}

export function minutesSince(iso: string) {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

function minutesInCurrentStatus(order: Order) {
  const lastEntry = order.statusHistory[order.statusHistory.length - 1];
  return minutesSince(lastEntry.timestamp);
}

export function getHomeMetrics(orders: Order[], drivers: Driver[]): HomeMetrics {
  const today = new Date().toDateString();
  return {
    pendingOrders: orders.filter((o) => o.status === "Pending").length,
    activeOrders: orders.filter((o) => o.status === "In Progress").length,
    availableDrivers: drivers.filter(
      (d) => d.active && !orders.some((o) => o.driverId === d.id && (o.status === "Assigned" || o.status === "In Progress"))
    ).length,
    completedToday: orders.filter(
      (o) =>
        o.status === "Completed" &&
        o.statusHistory[o.statusHistory.length - 1] &&
        new Date(o.statusHistory[o.statusHistory.length - 1].timestamp).toDateString() === today
    ).length,
  };
}

const PENDING_STALL_THRESHOLD_MIN = 90;
const POD_OVERDUE_THRESHOLD_MIN = 60;

export function getAttentionOrders(orders: Order[], monthlyOrders: MonthlyOrder[], clients: Client[]): AttentionOrder[] {
  const items: AttentionOrder[] = [];
  const clientById = new Map(clients.map((c) => [c.id, c]));

  for (const order of orders) {
    const client = clientById.get(order.clientId);
    if (!client) continue;
    const minutes = minutesInCurrentStatus(order);

    if (order.status === "Pending" && minutes >= PENDING_STALL_THRESHOLD_MIN) {
      items.push({ id: order.id, clientName: client.name, status: order.status, minutesInStatus: minutes, reason: "stalled-pending", detail: "Awaiting Supply allocation", action: "Assign" });
    }

    if (order.status === "In Progress" && order.podRequired && !order.podUploaded && minutes >= POD_OVERDUE_THRESHOLD_MIN) {
      const overdueMin = minutes - POD_OVERDUE_THRESHOLD_MIN;
      items.push({
        id: order.id,
        clientName: client.name,
        status: order.status,
        minutesInStatus: minutes,
        reason: "pod-missing",
        detail: `Proof of Delivery overdue by ${Math.floor(overdueMin / 60)}h ${overdueMin % 60}m`,
        action: "Follow up",
      });
    }
  }

  for (const contract of monthlyOrders) {
    const remaining = contract.dates.length - contract.executedDates.length;
    if (contract.status === "Active" && remaining > 0 && remaining <= 2) {
      const client = clientById.get(contract.clientId);
      if (!client) continue;
      items.push({
        id: contract.id,
        clientName: client.name,
        status: "In Progress",
        minutesInStatus: 0,
        reason: "monthly-renewal",
        detail: `Monthly contract — ${remaining} scheduled day${remaining === 1 ? "" : "s"} remaining`,
        action: "Renew",
      });
    }
  }

  return items.sort((a, b) => b.minutesInStatus - a.minutesInStatus).slice(0, 8);
}

export function getOrdersForClient(orders: Order[], clientId: string) {
  return orders.filter((o) => o.clientId === clientId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOrdersForContractor(orders: Order[], contractorId: string) {
  return orders.filter((o) => o.contractorId === contractorId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getDriversForContractor(drivers: Driver[], contractorId: string) {
  return drivers.filter((d) => d.contractorId === contractorId);
}

export function getVehiclesForContractor(vehicles: Vehicle[], contractorId: string) {
  return vehicles.filter((v) => v.contractorId === contractorId);
}

export function getActiveOrderCountForDriver(orders: Order[], driverId: string) {
  return orders.filter((o) => o.driverId === driverId && (o.status === "Assigned" || o.status === "In Progress")).length;
}

export function getCurrentOrderForDriver(orders: Order[], driverId: string) {
  return orders.find((o) => o.driverId === driverId && (o.status === "Assigned" || o.status === "In Progress"));
}

export function getCurrentOrderForVehicle(orders: Order[], vehicleId: string) {
  return orders.find((o) => o.vehicleId === vehicleId && (o.status === "Assigned" || o.status === "In Progress"));
}

export function waypointAnalytics(orders: Order[]) {
  const map = new Map<string, { location: string; type: string; visits: number; lastVisited: string }>();
  for (const order of orders) {
    for (const wp of order.waypoints) {
      const existing = map.get(wp.name);
      if (existing) {
        existing.visits += 1;
        if (order.createdAt > existing.lastVisited) existing.lastVisited = order.createdAt;
      } else {
        map.set(wp.name, { location: wp.name, type: wp.type, visits: 1, lastVisited: order.createdAt });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.visits - a.visits);
}

export function getContractorStats(contractors: Contractor[], drivers: Driver[], vehicles: Vehicle[]) {
  return contractors.map((c) => ({
    contractor: c,
    driverCount: drivers.filter((d) => d.contractorId === c.id).length,
    vehicleCount: vehicles.filter((v) => v.contractorId === c.id).length,
  }));
}
