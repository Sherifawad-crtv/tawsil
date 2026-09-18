import type { Order } from "./types";

export function byId<T extends { id: string }>(list: T[], id: string | undefined) {
  return id ? list.find((x) => x.id === id) : undefined;
}

function assignedAt(order: Order) {
  const entry = order.statusHistory.find((h) => h.toStatus === "Assigned");
  return entry ? new Date(entry.timestamp).getTime() : 0;
}

/** Oldest-waiting first - a request that's sat the longest is the most time-sensitive one to act on. */
export function getPendingOrders(orders: Order[]) {
  return orders.filter((o) => o.status === "Assigned").sort((a, b) => assignedAt(a) - assignedAt(b));
}

/** Earliest pickup first - the trip that's been underway longest surfaces first. */
export function getActiveOrders(orders: Order[]) {
  return orders
    .filter((o) => o.status === "In Progress")
    .sort((a, b) => new Date(a.pickupAt).getTime() - new Date(b.pickupAt).getTime());
}
