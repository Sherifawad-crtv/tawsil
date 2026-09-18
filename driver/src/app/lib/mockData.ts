import type { Order, OrderStatus, StatusHistoryEntry, TripType, TruckBaseClass, TruckConfig, Waypoint, DriverProfile } from "./types";

export const DRIVER_PROFILE: DriverProfile = {
  fullName: "Karim Fathy",
  email: "karim.fathy@tawsil.com",
  phone: "+20 102 445 8891",
  licenseNumber: "DL-51239",
  licenseExpiry: "2027-11-20",
  licenseValid: true,
  contractorName: "Ahmed Khan",
};

const CLIENTS: { name: string; phone: string }[] = [
  { name: "Cairo Poultry Company", phone: "+20 2 2690 1234" },
  { name: "Juhayna Food Industries", phone: "+20 2 3846 5566" },
  { name: "Hero Egypt", phone: "+20 2 4571 0091" },
  { name: "Carrefour Egypt", phone: "+20 2 2758 3300" },
  { name: "Americana Group", phone: "+20 2 2690 7788" },
  { name: "B.Tech Electronics", phone: "+20 2 2415 9021" },
];

const PICKUP_ADDRESSES = [
  "Main Warehouse, 6th of October City",
  "Obour Industrial Zone, Block 12",
  "10th of Ramadan Warehouse, Gate 3",
  "Sadat City Distribution Center",
];
const DROPOFF_ADDRESSES = [
  "Carrefour City Stars Hub",
  "Metro Market, Nasr City",
  "B.Tech Warehouse, Maadi",
  "Regional DC, Sheikh Zayed",
];

function waypoints(seed: number): Waypoint[] {
  const stops = 1 + (seed % 3);
  const wp: Waypoint[] = [{ id: `wp-${seed}-0`, label: "Pickup", address: PICKUP_ADDRESSES[seed % PICKUP_ADDRESSES.length] }];
  for (let i = 0; i < stops; i++) {
    wp.push({ id: `wp-${seed}-${i + 1}`, label: "Dropoff", address: DROPOFF_ADDRESSES[(seed + i) % DROPOFF_ADDRESSES.length] });
  }
  return wp;
}

function history(entries: { status: OrderStatus; hoursAgo: number; note?: string }[]): StatusHistoryEntry[] {
  const now = Date.now();
  return entries.map((e, i) => ({
    id: `h-${i}`,
    timestamp: new Date(now - e.hoursAgo * 3600_000).toISOString(),
    fromStatus: i === 0 ? null : entries[i - 1].status,
    toStatus: e.status,
    note: e.note,
  }));
}

let orderSeq = 682;
function nextOrderId() {
  orderSeq += 3;
  return `ORD-2026-${String(orderSeq).padStart(6, "0")}`;
}

const TRUCK_TYPE_CYCLE: { baseClass: TruckBaseClass; config: TruckConfig }[] = [
  { baseClass: "Dababa", config: "Box" },
  { baseClass: "Jumbo", config: "Refrigerated" },
  { baseClass: "Suzuki Van", config: "Box" },
  { baseClass: "Trailer", config: "Flatbed" },
];
const PLATES = ["ABC-1234", "XYZ-3344", "LMN-1122", "TRL-2001"];

function baseOrder(seed: number, tripType: TripType, hoursFromNow: number): Omit<Order, "id" | "status" | "statusHistory" | "files"> {
  const type = TRUCK_TYPE_CYCLE[seed % TRUCK_TYPE_CYCLE.length];
  const client = CLIENTS[seed % CLIENTS.length];
  const pickup = new Date();
  pickup.setHours(pickup.getHours() + hoursFromNow, (seed * 7) % 60, 0, 0);
  return {
    tripType,
    baseClass: type.baseClass,
    config: type.config,
    truckTempC: type.config === "Refrigerated" ? -4 + (seed % 5) : undefined,
    truckPlate: PLATES[seed % PLATES.length],
    weightKg: 400 + (seed % 8) * 250,
    hours: 2 + (seed % 6),
    km: 12 + (seed % 15) * 4,
    pickupAt: pickup.toISOString(),
    waypoints: waypoints(seed),
    podRequired: seed % 3 !== 0,
    clientName: client.name,
    clientPhone: client.phone,
  };
}

// ---- Pending (Assigned, not yet started) - oldest-assigned first ----------
export const PENDING_ORDERS: Order[] = [
  {
    id: nextOrderId(),
    ...baseOrder(1, "On Demand", 2),
    status: "Assigned",
    statusHistory: history([{ status: "Assigned", hoursAgo: 26 }]),
    files: { additionalImages: [] },
  },
  {
    id: nextOrderId(),
    ...baseOrder(2, "On Demand", 5),
    status: "Assigned",
    statusHistory: history([{ status: "Assigned", hoursAgo: 14 }]),
    files: { additionalImages: [] },
  },
  {
    id: nextOrderId(),
    ...baseOrder(3, "Monthly", 8),
    status: "Assigned",
    statusHistory: history([{ status: "Assigned", hoursAgo: 6 }]),
    files: { additionalImages: [] },
  },
  {
    id: nextOrderId(),
    ...baseOrder(4, "On Demand", 20),
    status: "Assigned",
    statusHistory: history([{ status: "Assigned", hoursAgo: 1 }]),
    files: { additionalImages: [] },
  },
];

// ---- Active (In Progress) - soonest pickup / already underway first -------
export const ACTIVE_ORDERS: Order[] = [
  {
    id: nextOrderId(),
    ...baseOrder(5, "On Demand", -1),
    status: "In Progress",
    statusHistory: history([
      { status: "Assigned", hoursAgo: 20 },
      { status: "In Progress", hoursAgo: 1 },
    ]),
    files: { additionalImages: [] },
  },
  {
    id: nextOrderId(),
    ...baseOrder(6, "On Demand", -3),
    status: "In Progress",
    statusHistory: history([
      { status: "Assigned", hoursAgo: 30 },
      { status: "In Progress", hoursAgo: 3 },
    ]),
    files: {
      odometerBeforeUrl: "odometer-before-6.jpg",
      additionalImages: [],
    },
  },
  {
    id: nextOrderId(),
    ...baseOrder(7, "Monthly", -5),
    status: "In Progress",
    statusHistory: history([
      { status: "Assigned", hoursAgo: 40 },
      { status: "In Progress", hoursAgo: 5 },
    ]),
    files: { additionalImages: [] },
  },
];

export const ALL_ORDERS: Order[] = [...PENDING_ORDERS, ...ACTIVE_ORDERS];
