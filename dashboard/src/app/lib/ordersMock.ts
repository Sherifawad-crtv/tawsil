import type { Order, OrderStatus, StatusHistoryEntry, Waypoint, MonthlyOrder } from "./types";
import { CLIENTS, CONTRACTORS, DRIVERS, VEHICLES, SAVED_LOCATIONS } from "./entities";
import { TRUCK_TYPES } from "./constants";
import { mulberry32, pick, pickN, intBetween } from "./rng";

const rng = mulberry32(20260913);

function isoDaysAgo(days: number, hoursOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hoursOffset, 0, 0, 0);
  return d.toISOString();
}

function fallbackWaypoints(clientName: string): Waypoint[] {
  return [
    { id: "wp-p", name: `${clientName} Pickup Point`, type: "Pickup", address: "Cairo, Egypt", lat: 30.0444, lng: 31.2357 },
    { id: "wp-d", name: `${clientName} Dropoff Point`, type: "Dropoff", address: "Giza, Egypt", lat: 30.0131, lng: 31.2089 },
  ];
}

function waypointsForClient(clientId: string, clientName: string): Waypoint[] {
  const locs = SAVED_LOCATIONS.filter((l) => l.clientId === clientId);
  if (locs.length === 0) return fallbackWaypoints(clientName);
  const pickupLoc = locs[0];
  const dropoffLocs = locs.length > 1 ? pickN(rng, locs.slice(1), Math.min(2, locs.length - 1)) : [];
  const dropoffs: Waypoint[] =
    dropoffLocs.length > 0
      ? dropoffLocs.map((l, i) => ({
          id: `wp-d${i}-${l.id}`,
          name: l.name,
          type: "Dropoff" as const,
          address: l.address,
          lat: l.lat,
          lng: l.lng,
          contactName: l.contactName,
          contactPhone: l.contactPhone,
        }))
      : [fallbackWaypoints(clientName)[1]];
  return [
    { id: `wp-p-${pickupLoc.id}`, name: pickupLoc.name, type: "Pickup", address: pickupLoc.address, lat: pickupLoc.lat, lng: pickupLoc.lng, contactName: pickupLoc.contactName, contactPhone: pickupLoc.contactPhone },
    ...dropoffs,
  ];
}

function buildStatusHistory(status: OrderStatus, createdAt: string): StatusHistoryEntry[] {
  const history: StatusHistoryEntry[] = [
    { id: "h0", timestamp: createdAt, fromStatus: null, toStatus: "Pending", actor: "System" },
  ];
  const base = new Date(createdAt).getTime();
  const at = (hoursLater: number) => new Date(base + hoursLater * 3600_000).toISOString();

  if (status === "Cancelled") {
    history.push({ id: "h1", timestamp: at(1), fromStatus: "Pending", toStatus: "Cancelled", note: "Cancelled by client request", actor: "Sales" });
    return history;
  }
  if (status === "Pending") return history;

  history.push({ id: "h1", timestamp: at(2), fromStatus: "Pending", toStatus: "Assigned", note: "Driver and vehicle allocated", actor: "Supply" });
  if (status === "Assigned") return history;

  history.push({ id: "h2", timestamp: at(3), fromStatus: "Assigned", toStatus: "In Progress", note: "Pickup confirmed", actor: "Operations" });
  if (status === "In Progress") return history;

  history.push({ id: "h3", timestamp: at(9), fromStatus: "In Progress", toStatus: "Completed", note: "Delivery confirmed", actor: "Operations" });
  return history;
}

interface GenOptions {
  status: OrderStatus;
  daysAgo: number;
  hoursOffset?: number;
  index: number;
  monthlyOrderId?: string;
  dayLabel?: string;
  forceClientId?: string;
  forcePodOverdue?: boolean;
}

function generateOrder(opts: GenOptions): Order {
  const client = opts.forceClientId ? CLIENTS.find((c) => c.id === opts.forceClientId)! : pick(rng, CLIENTS.filter((c) => c.active));
  const truckType = pick(rng, TRUCK_TYPES);
  const createdAt = isoDaysAgo(opts.daysAgo, opts.hoursOffset ?? 0);
  const pickupAt = createdAt;
  const hasContractor = opts.status !== "Pending" || rng() > 0.4;
  const contractor = hasContractor ? pick(rng, CONTRACTORS) : undefined;
  const contractorDrivers = contractor ? DRIVERS.filter((d) => d.contractorId === contractor.id && d.active) : [];
  const contractorVehicles = contractor ? VEHICLES.filter((v) => v.contractorId === contractor.id && v.active) : [];
  const isAssignedOrLater = opts.status === "Assigned" || opts.status === "In Progress" || opts.status === "Completed";
  const driver = isAssignedOrLater && contractorDrivers.length > 0 ? pick(rng, contractorDrivers) : undefined;
  const vehicle = isAssignedOrLater && contractorVehicles.length > 0 ? pick(rng, contractorVehicles) : undefined;

  const podRequired = rng() > 0.3;
  const podOverdue = opts.forcePodOverdue ?? false;
  const podUploaded = podRequired && (opts.status === "Completed" ? rng() > 0.05 : podOverdue ? false : opts.status === "In Progress" ? rng() > 0.5 : false);

  const hasBidding = opts.index % 17 === 0 && opts.status !== "Pending";
  const bidNames = ["Rashid A.", "Mahmoud K.", "Samir D.", "Tariq H.", "Yusuf O.", "Nabil S."];

  return {
    id: opts.monthlyOrderId ? `${opts.monthlyOrderId}-D${(opts.dayLabel ?? "1").padStart(2, "0")}` : `TWL-2026-${String(9500 - opts.index).padStart(6, "0")}`,
    clientId: client.id,
    contractorId: contractor?.id,
    driverId: driver?.id,
    vehicleId: vehicle?.id,
    status: opts.status,
    tripType: opts.monthlyOrderId ? "Monthly" : rng() > 0.75 ? "Daily" : "On Demand",
    truckTypeId: truckType.id,
    pickupAt,
    cargoTypes: pickN(rng, truckType.allowedCargoTypes, intBetween(rng, 1, 2)),
    weightKg: Math.round(intBetween(rng, Math.round(truckType.capacityMinT * 1000), Math.round(truckType.capacityMaxT * 1000)) / 10) * 10,
    hours: intBetween(rng, 2, 10),
    clientNote: rng() > 0.7 ? "Please call 30 minutes before arrival." : undefined,
    supplyNote: rng() > 0.85 ? "Confirmed by phone with contractor dispatcher." : undefined,
    podRequired,
    podUploaded,
    waypoints: waypointsForClient(client.id, client.name),
    statusHistory: buildStatusHistory(opts.status, createdAt),
    createdAt,
    monthlyOrderId: opts.monthlyOrderId,
    dayLabel: opts.dayLabel,
    bidding: hasBidding
      ? {
          totalBids: 3,
          deadline: isoDaysAgo(opts.daysAgo, (opts.hoursOffset ?? 0) - 2),
          winningBid: opts.status === "Completed" || opts.status === "In Progress" || opts.status === "Assigned" ? 310 : undefined,
          bids: [0, 1, 2].map((i) => ({
            id: `bid-${opts.index}-${i}`,
            driverName: bidNames[(opts.index + i) % bidNames.length],
            amountEGP: 280 + i * 25 + (opts.index % 15),
            submittedAt: isoDaysAgo(opts.daysAgo, (opts.hoursOffset ?? 0) + i),
          })),
        }
      : undefined,
  };
}

function generatePlatformOrders(): Order[] {
  const orders: Order[] = [];
  let idx = 0;

  // Curated, currently-stalled orders that also feed the Home "Needs Attention" list.
  orders.push(generateOrder({ status: "Pending", daysAgo: 0, hoursOffset: 3, index: idx++, forceClientId: "cli-01" }));
  orders.push(generateOrder({ status: "Pending", daysAgo: 0, hoursOffset: 2, index: idx++, forceClientId: "cli-02" }));
  orders.push(generateOrder({ status: "In Progress", daysAgo: 0, hoursOffset: 1, index: idx++, forceClientId: "cli-03", forcePodOverdue: true }));
  orders.push(generateOrder({ status: "In Progress", daysAgo: 0, hoursOffset: 3, index: idx++, forceClientId: "cli-04", forcePodOverdue: true }));
  orders.push(generateOrder({ status: "Pending", daysAgo: 0, hoursOffset: 1, index: idx++, forceClientId: "cli-06" }));

  // Remaining recent "active" orders (pending / assigned / in progress / cancelled).
  const activeStatuses: OrderStatus[] = ["Pending", "Assigned", "In Progress", "Cancelled"];
  for (let i = 0; i < 32; i++) {
    orders.push(
      generateOrder({
        status: pick(rng, activeStatuses),
        daysAgo: intBetween(rng, 0, 2),
        hoursOffset: intBetween(rng, 0, 20),
        index: idx++,
      })
    );
  }

  // Historical completed orders spread over the last ~12 months.
  const remaining = 725 - orders.length - 232; // 232 reserved for the Nestlé monthly contract below
  for (let i = 0; i < remaining; i++) {
    orders.push(generateOrder({ status: "Completed", daysAgo: intBetween(rng, 3, 360), index: idx++ }));
  }

  return orders;
}

function generateMonthlyOrders(): { contracts: MonthlyOrder[]; spawnedOrders: Order[] } {
  const contracts: MonthlyOrder[] = [];
  const spawnedOrders: Order[] = [];

  function buildContract(opts: {
    id: string;
    clientId: string;
    contractorId?: string;
    totalDays: number;
    remainingDays: number;
    truckTypeId: string;
    createdDaysAgo: number;
  }) {
    const client = CLIENTS.find((c) => c.id === opts.clientId)!;
    const truckType = TRUCK_TYPES.find((t) => t.id === opts.truckTypeId)!;
    const dates: string[] = [];
    for (let d = 0; d < opts.totalDays; d++) {
      dates.push(isoDaysAgo(opts.createdDaysAgo - d).slice(0, 10));
    }
    const executedCount = opts.totalDays - opts.remainingDays;
    const executedDates = dates.slice(0, executedCount);

    const contract: MonthlyOrder = {
      id: opts.id,
      clientId: opts.clientId,
      contractorId: opts.contractorId,
      truckTypeId: opts.truckTypeId,
      dailyPickupTime: "07:00",
      dates,
      executedDates,
      cargoTypes: pickN(rng, truckType.allowedCargoTypes, 2),
      weightKg: Math.round(truckType.capacityMaxT * 1000 * 0.85),
      hours: 6,
      distanceKm: intBetween(rng, 25, 120),
      waypoints: waypointsForClient(opts.clientId, client.name),
      clientPricePerDayEGP: Math.round(truckType.dailyRentEGP * 1.28),
      contractorPricePerDayEGP: truckType.dailyRentEGP,
      vatPercent: 14,
      status: opts.remainingDays > 0 ? "Active" : "Completed",
      createdAt: isoDaysAgo(opts.createdDaysAgo),
    };
    contracts.push(contract);

    for (let i = 0; i < executedCount; i++) {
      spawnedOrders.push(
        generateOrder({
          status: "Completed",
          daysAgo: opts.createdDaysAgo - i,
          index: 9000 + i,
          monthlyOrderId: contract.id,
          dayLabel: String(i + 1),
          forceClientId: opts.clientId,
        })
      );
    }
  }

  buildContract({ id: "MOT-2026-000088", clientId: "cli-05", contractorId: "con-01", totalDays: 232, remainingDays: 2, truckTypeId: "jumbo-box", createdDaysAgo: 300 });
  buildContract({ id: "MOT-2026-000112", clientId: "cli-02", contractorId: "con-02", totalDays: 60, remainingDays: 14, truckTypeId: "dababa-box", createdDaysAgo: 46 });
  buildContract({ id: "MOT-2026-000098", clientId: "cli-09", contractorId: "con-03", totalDays: 90, remainingDays: 0, truckTypeId: "dababa-ref", createdDaysAgo: 92 });
  buildContract({ id: "MOT-2026-000104", clientId: "cli-12", contractorId: "con-06", totalDays: 45, remainingDays: 30, truckTypeId: "trailer-ref", createdDaysAgo: 15 });

  return { contracts, spawnedOrders };
}

const { contracts: monthlyContracts, spawnedOrders } = generateMonthlyOrders();
export const MONTHLY_ORDERS: MonthlyOrder[] = monthlyContracts;
export const ORDERS: Order[] = [...generatePlatformOrders(), ...spawnedOrders];
