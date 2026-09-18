import { TRUCK_TYPES } from "./constants";
import type { AttentionOrder, Client, Contractor, Driver, HomeMetrics, MonthlyOrder, Order, OrderStatus, Role, Vehicle } from "./types";

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
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const todayKey = today.toDateString();
  const yesterdayKey = yesterday.toDateString();
  const completedOn = (dateKey: string) =>
    orders.filter(
      (o) =>
        o.status === "Completed" &&
        o.statusHistory[o.statusHistory.length - 1] &&
        new Date(o.statusHistory[o.statusHistory.length - 1].timestamp).toDateString() === dateKey
    ).length;

  return {
    pendingOrders: orders.filter((o) => o.status === "Pending").length,
    activeOrders: orders.filter((o) => o.status === "In Progress").length,
    availableDrivers: drivers.filter(
      (d) => d.active && !orders.some((o) => o.driverId === d.id && (o.status === "Assigned" || o.status === "In Progress"))
    ).length,
    completedToday: completedOn(todayKey),
    completedYesterday: completedOn(yesterdayKey),
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

/**
 * Role-based visibility for the order workflow (Sales creates -> Supply
 * allocates the pending queue -> Operations follows up on what's already
 * moving -> Admin sees everything). Applied as a hard scope on top of the
 * ordinary filters, not just a UI suggestion.
 */
export function getOrdersForRole(orders: Order[], role: Role): Order[] {
  switch (role) {
    case "Supply":
      // Supply's job is allocating unassigned orders - by construction a
      // Pending order has no contractor/driver/vehicle yet.
      return orders.filter((o) => o.status === "Pending");
    case "Operations":
      // Operations follows up on orders already in motion, not the intake
      // queue (Supply's job) or the full historical catalog.
      return orders.filter((o) => o.status === "Assigned" || o.status === "In Progress");
    case "Sales":
    case "Admin":
    default:
      return orders;
  }
}

export function getAttentionOrdersForRole(items: AttentionOrder[], role: Role): AttentionOrder[] {
  switch (role) {
    case "Supply":
      return items.filter((i) => i.reason === "stalled-pending");
    case "Operations":
      return items.filter((i) => i.reason === "pod-missing" || i.reason === "monthly-renewal");
    case "Sales":
    case "Admin":
    default:
      // Sales sees the whole picture, like Admin - it just can't assign,
      // which canAssignDrivers already handles.
      return items;
  }
}

export function canCreateOrders(role: Role) {
  return role === "Sales" || role === "Admin";
}

export function canAssignDrivers(role: Role) {
  return role === "Supply" || role === "Admin";
}

/**
 * Whether the role owns the nudges in the attention list (assign, follow up,
 * renew). Sales sees the same list but none of those are its work — it only
 * edits — so it gets an Edit action on those rows instead.
 */
export function canActOnAttention(role: Role) {
  return role !== "Sales";
}

/** Order count per day for the trailing `days` window, oldest first - feeds the Home volume chart. */
export function getOrderVolumeByDay(orders: Order[], days = 14) {
  const buckets: { key: string; label: string; count: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.push({ key: d.toDateString(), label: d.toLocaleDateString("en-US", { day: "numeric", month: "short" }), count: 0 });
  }
  const byKey = new Map(buckets.map((b) => [b.key, b]));
  for (const order of orders) {
    const bucket = byKey.get(new Date(order.createdAt).toDateString());
    if (bucket) bucket.count += 1;
  }
  return buckets;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** This week vs last week, day-aligned - feeds the Home volume chart's current/previous comparison. */
export function getOrderVolumeWeekOverWeek(orders: Order[]) {
  const days = getOrderVolumeByDay(orders, 14);
  const previous = days.slice(0, 7);
  const current = days.slice(7, 14);
  return current.map((d, i) => ({
    label: WEEKDAY_LABELS[new Date(d.key).getDay()],
    current: d.count,
    previous: previous[i].count,
  }));
}

const STATUS_ORDER: OrderStatus[] = ["Pending", "Assigned", "In Progress", "Completed", "Cancelled"];

/** Order count per status - feeds the Home status-breakdown bar. */
export function getOrdersByStatus(orders: Order[]): { status: OrderStatus; count: number }[] {
  return STATUS_ORDER.map((status) => ({ status, count: orders.filter((o) => o.status === status).length }));
}

const PROBLEM_HOUR_BUCKETS = [
  { label: "12–4am", start: 0, end: 4 },
  { label: "4–8am", start: 4, end: 8 },
  { label: "8am–12pm", start: 8, end: 12 },
  { label: "12–4pm", start: 12, end: 16 },
  { label: "4–8pm", start: 16, end: 20 },
  { label: "8pm–12am", start: 20, end: 24 },
];

function isProblemOrder(order: Order): "stalled-pending" | "pod-missing" | null {
  const minutes = minutesInCurrentStatus(order);
  if (order.status === "Pending" && minutes >= PENDING_STALL_THRESHOLD_MIN) return "stalled-pending";
  if (order.status === "In Progress" && order.podRequired && !order.podUploaded && minutes >= POD_OVERDUE_THRESHOLD_MIN) return "pod-missing";
  return null;
}

function isProblemVisibleToRole(reason: "stalled-pending" | "pod-missing", role: Role) {
  if (role === "Supply") return reason === "stalled-pending";
  if (role === "Operations") return reason === "pod-missing";
  return true; // Sales and Admin see every problem
}

/** Buckets open problem orders (stalled-pending / POD overdue) by time-of-day they entered that state - answers "when". */
export function getProblemsByHour(orders: Order[], role: Role) {
  const buckets = PROBLEM_HOUR_BUCKETS.map((b) => ({ ...b, count: 0 }));
  for (const order of orders) {
    const reason = isProblemOrder(order);
    if (!reason || !isProblemVisibleToRole(reason, role)) continue;
    const lastEntry = order.statusHistory[order.statusHistory.length - 1];
    const hour = new Date(lastEntry.timestamp).getHours();
    const bucket = buckets.find((b) => hour >= b.start && hour < b.end);
    if (bucket) bucket.count += 1;
  }
  return buckets;
}

/** Ranks pickup locations by open-problem count - answers "where". */
export function getProblemsByLocation(orders: Order[], role: Role, limit = 6) {
  const counts = new Map<string, number>();
  for (const order of orders) {
    const reason = isProblemOrder(order);
    if (!reason || !isProblemVisibleToRole(reason, role)) continue;
    const pickup = order.waypoints.find((w) => w.type === "Pickup");
    const name = pickup?.name ?? "Unknown location";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
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
