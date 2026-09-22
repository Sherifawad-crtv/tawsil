import type { Order, OrderStatus, StatusHistoryEntry, Truck, Driver, TripType, TruckBaseClass, TruckConfig, Waypoint, ContractorProfile } from "./types";

export const CONTRACTOR_PROFILE: ContractorProfile = {
  fullName: "Ahmed Khan",
  nationalId: "29001011234567",
  phone: "+20 100 123 4567",
  // Left blank deliberately: demonstrates the "hide the copy icon on an
  // empty field" fix (Section 5, point 2) alongside the populated fields.
  username: "",
  email: "ahmed.khan@tawsil.com",
};

export const TRUCKS: Truck[] = [
  { id: "trk-01", plateNumber: "ABC-1234", baseClass: "Dababa", config: "Box", licenseExpiry: "2027-03-01", active: true },
  { id: "trk-02", plateNumber: "ABC-5678", baseClass: "Dababa", config: "Open", licenseExpiry: "2027-05-12", active: true },
  { id: "trk-03", plateNumber: "ABC-9012", baseClass: "Dababa", config: "Refrigerated", licenseExpiry: "2025-11-01", active: true },
  { id: "trk-04", plateNumber: "XYZ-3344", baseClass: "Jumbo", config: "Box", licenseExpiry: "2027-01-20", active: true },
  { id: "trk-05", plateNumber: "XYZ-7788", baseClass: "Jumbo", config: "Refrigerated", licenseExpiry: "2026-08-15", active: true },
  { id: "trk-06", plateNumber: "LMN-1122", baseClass: "Suzuki Van", config: "Box", licenseExpiry: "2027-06-30", active: true },
  { id: "trk-07", plateNumber: "LMN-4455", baseClass: "Suzuki Van", config: "Open", licenseExpiry: "2027-09-01", active: true },
  { id: "trk-08", plateNumber: "TRL-2001", baseClass: "Trailer", config: "Box", licenseExpiry: "2027-04-18", active: true },
  { id: "trk-09", plateNumber: "TRL-2002", baseClass: "Trailer", config: "Flatbed", licenseExpiry: "2027-07-22", active: true },
  { id: "trk-10", plateNumber: "OLD-0099", baseClass: "Dababa", config: "Box", licenseExpiry: "2025-01-01", active: false },
  { id: "trk-11", plateNumber: "OLD-0088", baseClass: "Jumbo", config: "Open", licenseExpiry: "2025-06-01", active: false },
  { id: "trk-12", plateNumber: "QRS-6601", baseClass: "Dababa", config: "Box", licenseExpiry: "2027-10-15", active: true },
  { id: "trk-13", plateNumber: "QRS-6602", baseClass: "Suzuki Van", config: "Box", licenseExpiry: "2027-05-08", active: true },
  { id: "trk-14", plateNumber: "QRS-6603", baseClass: "Jumbo", config: "Box", licenseExpiry: "2027-02-28", active: true },
];

export const DRIVERS: Driver[] = [
  {
    id: "drv-01",
    name: "Ahmed Khan",
    email: "ahmed.khan@tawsil.com",
    phone: "+20 100 123 4567",
    licenseNumber: "DL-88213",
    licenseExpiry: "2027-08-01",
    active: true,
  },
  {
    id: "drv-02",
    name: "Mostafa Nabil",
    email: "mostafa.nabil@tawsil.com",
    phone: "+20 101 987 6543",
    licenseNumber: "DL-44120",
    licenseExpiry: "2026-02-14",
    active: false,
    deactivatedAt: "2026-09-02T14:32:00.000Z",
  },
  {
    id: "drv-03",
    name: "Youssef Adel",
    email: "youssef.adel@tawsil.com",
    phone: "+20 102 345 6789",
    licenseNumber: "DL-51309",
    licenseExpiry: "2027-04-22",
    active: true,
  },
  {
    id: "drv-04",
    name: "Karim Hassan",
    email: "karim.hassan@tawsil.com",
    phone: "+20 111 234 5678",
    licenseNumber: "DL-62841",
    licenseExpiry: "2027-01-10",
    active: true,
  },
  {
    id: "drv-05",
    name: "Sameh Fathy",
    email: "sameh.fathy@tawsil.com",
    phone: "+20 122 876 5432",
    licenseNumber: "DL-73956",
    licenseExpiry: "2026-11-05",
    active: true,
  },
];

const CLIENTS: { name: string; phone: string }[] = [
  { name: "Cairo Poultry Company", phone: "+20 2 2690 1234" },
  { name: "Juhayna Food Industries", phone: "+20 2 3846 5566" },
  { name: "Hero Egypt", phone: "+20 2 4571 0091" },
  { name: "Carrefour Egypt", phone: "+20 2 2758 3300" },
  { name: "Americana Group", phone: "+20 2 2690 7788" },
  { name: "B.Tech Electronics", phone: "+20 2 2415 9021" },
  { name: "Domty Cold Storage", phone: "+20 2 3833 4410" },
  { name: "Edita Factory", phone: "+20 2 4820 1156" },
];

const PICKUP_ADDRESSES = [
  "Main Warehouse, 6th of October City",
  "Obour Industrial Zone, Block 12",
  "10th of Ramadan Warehouse, Gate 3",
  "Sadat City Distribution Center",
  "Al Ameriya Cold Storage, Alexandria",
];
const DROPOFF_ADDRESSES = [
  "Carrefour City Stars Hub",
  "Metro Market, Nasr City",
  "B.Tech Warehouse, Maadi",
  "Client Site, New Cairo",
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

let orderSeq = 616;
function nextOrderId() {
  orderSeq += 3;
  return `ORD-2026-${String(orderSeq).padStart(6, "0")}`;
}

const TRUCK_TYPE_CYCLE: { baseClass: TruckBaseClass; config: TruckConfig }[] = [
  { baseClass: "Dababa", config: "Box" },
  { baseClass: "Dababa", config: "Refrigerated" },
  { baseClass: "Jumbo", config: "Box" },
  { baseClass: "Jumbo", config: "Refrigerated" },
  { baseClass: "Suzuki Van", config: "Box" },
  { baseClass: "Trailer", config: "Flatbed" },
];

function baseOrder(seed: number, status: OrderStatus, tripType: TripType): Omit<Order, "id" | "driverId" | "truckId" | "statusHistory" | "files"> {
  const type = TRUCK_TYPE_CYCLE[seed % TRUCK_TYPE_CYCLE.length];
  const client = CLIENTS[seed % CLIENTS.length];
  const daysFromNow = (seed % 10) - 4;
  const pickup = new Date();
  pickup.setDate(pickup.getDate() + daysFromNow);
  pickup.setHours(8 + (seed % 9), (seed * 7) % 60, 0, 0);
  return {
    status,
    tripType,
    isMonthly: tripType === "Monthly",
    baseClass: type.baseClass,
    config: type.config,
    truckTempC: type.config === "Refrigerated" ? -4 + (seed % 5) : undefined,
    priceEGP: 250 + (seed % 12) * 85,
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

// ---- Available orders (Pending, not yet accepted) --------------------------
export const AVAILABLE_ORDERS: Order[] = [
  { id: nextOrderId(), ...baseOrder(1, "Pending", "On Demand"), driverId: undefined, truckId: undefined, statusHistory: history([{ status: "Pending", hoursAgo: 1 }]), files: { additionalImages: [] } },
  { id: nextOrderId(), ...baseOrder(2, "Pending", "On Demand"), driverId: undefined, truckId: undefined, statusHistory: history([{ status: "Pending", hoursAgo: 3 }]), files: { additionalImages: [] } },
  { id: nextOrderId(), ...baseOrder(3, "Pending", "On Demand"), driverId: undefined, truckId: undefined, statusHistory: history([{ status: "Pending", hoursAgo: 5 }]), files: { additionalImages: [] } },
  { id: nextOrderId(), ...baseOrder(4, "Pending", "Monthly"), driverId: undefined, truckId: undefined, statusHistory: history([{ status: "Pending", hoursAgo: 8 }]), files: { additionalImages: [] } },
  { id: nextOrderId(), ...baseOrder(5, "Pending", "Monthly"), driverId: undefined, truckId: undefined, statusHistory: history([{ status: "Pending", hoursAgo: 20 }]), files: { additionalImages: [] } },
];

// ---- Active trips (Accepted / Assigned / In Progress) - 16 total -----------
const activeSeeds: { status: OrderStatus; assigned: boolean }[] = [
  { status: "Accepted", assigned: false },
  { status: "Accepted", assigned: false },
  { status: "Accepted", assigned: false },
  { status: "Accepted", assigned: false },
  { status: "Assigned", assigned: true },
  { status: "Assigned", assigned: true },
  { status: "Assigned", assigned: true },
  { status: "Assigned", assigned: true },
  { status: "Assigned", assigned: true },
  { status: "Assigned", assigned: true },
  { status: "In Progress", assigned: true },
  { status: "In Progress", assigned: true },
  { status: "In Progress", assigned: true },
  { status: "In Progress", assigned: true },
  { status: "In Progress", assigned: true },
  { status: "In Progress", assigned: true },
];

export const ACTIVE_ORDERS: Order[] = activeSeeds.map((s, i) => {
  const seed = 10 + i;
  const truck = TRUCKS[i % 9]; // only assign to active trucks
  const driver = DRIVERS[0];
  const statusSteps: { status: OrderStatus; hoursAgo: number }[] = [{ status: "Pending", hoursAgo: 30 }, { status: "Accepted", hoursAgo: 24 }];
  if (s.status !== "Accepted") statusSteps.push({ status: "Assigned", hoursAgo: 12 });
  if (s.status === "In Progress") statusSteps.push({ status: "In Progress", hoursAgo: 2 });
  return {
    id: nextOrderId(),
    ...baseOrder(seed, s.status, seed % 5 === 0 ? "Monthly" : "On Demand"),
    driverId: s.assigned ? driver.id : undefined,
    truckId: s.assigned ? truck.id : undefined,
    statusHistory: history(statusSteps),
    files: { additionalImages: [] },
  };
});

// ---- History: Completed / Cancelled -----------------------------------------
export const HISTORY_ORDERS: Order[] = [
  {
    id: nextOrderId(),
    ...baseOrder(100, "Completed", "On Demand"),
    driverId: DRIVERS[0].id,
    truckId: TRUCKS[0].id,
    statusHistory: history([
      { status: "Pending", hoursAgo: 96 },
      { status: "Accepted", hoursAgo: 90 },
      { status: "Assigned", hoursAgo: 88 },
      { status: "In Progress", hoursAgo: 72 },
      { status: "Completed", hoursAgo: 68 },
    ]),
    files: {
      odometerBeforeUrl: "odometer-before-1.jpg",
      odometerAfterUrl: "odometer-after-1.jpg",
      additionalImages: ["pod-1.jpg", "pod-2.jpg"],
    },
  },
  {
    id: nextOrderId(),
    ...baseOrder(101, "Completed", "On Demand"),
    driverId: DRIVERS[0].id,
    truckId: TRUCKS[3].id,
    statusHistory: history([
      { status: "Pending", hoursAgo: 150 },
      { status: "Accepted", hoursAgo: 146 },
      { status: "Assigned", hoursAgo: 144 },
      { status: "In Progress", hoursAgo: 130 },
      { status: "Completed", hoursAgo: 126 },
    ]),
    files: { additionalImages: [] },
  },
  {
    id: nextOrderId(),
    ...baseOrder(102, "Completed", "Monthly"),
    driverId: DRIVERS[0].id,
    truckId: TRUCKS[2].id,
    statusHistory: history([
      { status: "Pending", hoursAgo: 200 },
      { status: "Accepted", hoursAgo: 196 },
      { status: "Assigned", hoursAgo: 194 },
      { status: "In Progress", hoursAgo: 180 },
      { status: "Completed", hoursAgo: 175 },
    ]),
    files: {
      odometerBeforeUrl: "odometer-before-3.jpg",
      odometerAfterUrl: "odometer-after-3.jpg",
      additionalImages: [],
    },
  },
  {
    id: nextOrderId(),
    ...baseOrder(103, "Completed", "On Demand"),
    driverId: DRIVERS[0].id,
    truckId: TRUCKS[6].id,
    statusHistory: history([
      { status: "Pending", hoursAgo: 260 },
      { status: "Accepted", hoursAgo: 256 },
      { status: "Assigned", hoursAgo: 254 },
      { status: "In Progress", hoursAgo: 240 },
      { status: "Completed", hoursAgo: 236 },
    ]),
    files: { additionalImages: [] },
  },
  {
    id: nextOrderId(),
    ...baseOrder(104, "Cancelled", "On Demand"),
    driverId: undefined,
    truckId: undefined,
    statusHistory: history([
      { status: "Pending", hoursAgo: 60 },
      { status: "Accepted", hoursAgo: 55 },
      { status: "Cancelled", hoursAgo: 54, note: "Client cancelled - schedule conflict." },
    ]),
    files: { additionalImages: [] },
  },
  {
    id: nextOrderId(),
    ...baseOrder(105, "Cancelled", "On Demand"),
    driverId: DRIVERS[0].id,
    truckId: TRUCKS[4].id,
    statusHistory: history([
      { status: "Pending", hoursAgo: 120 },
      { status: "Accepted", hoursAgo: 115 },
      { status: "Assigned", hoursAgo: 112 },
      { status: "Cancelled", hoursAgo: 108, note: "Truck broke down before pickup." },
    ]),
    files: { additionalImages: [] },
  },
];

export const ALL_ORDERS: Order[] = [...AVAILABLE_ORDERS, ...ACTIVE_ORDERS, ...HISTORY_ORDERS];
