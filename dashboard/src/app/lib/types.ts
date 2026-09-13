export type OrderStatus = "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
export type TripType = "On Demand" | "Daily" | "Monthly";
export type Role = "Sales" | "Supply" | "Operations" | "Admin";

export type TruckBaseClass = "Dababa" | "Jumbo" | "Suzuki Van" | "Trailer";
export type TruckConfig = "Box" | "Open" | "Refrigerated" | "Flatbed";

export interface TruckType {
  id: string;
  baseClass: TruckBaseClass;
  config: TruckConfig;
  requiresTempControl: boolean;
  capacityMinT: number;
  capacityMaxT: number;
  allowedCargoTypes: string[];
  dailyRentEGP: number;
  pricePerKmEGP: number;
  flagged?: boolean;
  flagNote?: string;
}

export interface Waypoint {
  id: string;
  name: string;
  type: "Pickup" | "Dropoff";
  address: string;
  lat: number;
  lng: number;
  contactName?: string;
  contactPhone?: string;
  specialInstructions?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  taxNumber: string;
  registrationNumber: string;
  active: boolean;
  createdAt: string;
}

export interface SavedLocation {
  id: string;
  clientId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  tags: string[];
  contactName?: string;
  contactPhone?: string;
}

export interface Contractor {
  id: string;
  name: string;
  nationalId: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  active: boolean;
}

export interface Driver {
  id: string;
  contractorId: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  rating: number;
  totalTrips: number;
  active: boolean;
}

export interface VehicleSpecs {
  maxWeightT?: number;
  year?: number;
  lengthM?: number;
  widthM?: number;
}

export interface Vehicle {
  id: string;
  contractorId: string;
  truckTypeId: string;
  plateNumber: string;
  licenseExpiry: string;
  active: boolean;
  specs: VehicleSpecs;
}

export interface StatusHistoryEntry {
  id: string;
  timestamp: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  note?: string;
  actor: string;
}

export interface Bid {
  id: string;
  driverName: string;
  amountEGP: number;
  submittedAt: string;
}

export interface BiddingInfo {
  totalBids: number;
  deadline: string;
  winningBid?: number;
  bids: Bid[];
}

export interface Order {
  id: string;
  clientId: string;
  contractorId?: string;
  driverId?: string;
  vehicleId?: string;
  status: OrderStatus;
  tripType: TripType;
  truckTypeId: string;
  pickupAt: string;
  cargoTypes: string[];
  weightKg?: number;
  hours?: number;
  clientNote?: string;
  supplyNote?: string;
  podRequired: boolean;
  podUploaded: boolean;
  waypoints: Waypoint[];
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  monthlyOrderId?: string;
  dayLabel?: string;
  bidding?: BiddingInfo;
}

export interface MonthlyOrder {
  id: string;
  clientId: string;
  contractorId?: string;
  truckTypeId: string;
  dailyPickupTime: string;
  dates: string[];
  executedDates: string[];
  cargoTypes: string[];
  weightKg?: number;
  hours?: number;
  distanceKm: number;
  waypoints: Waypoint[];
  clientPricePerDayEGP: number;
  contractorPricePerDayEGP: number;
  vatPercent: number;
  status: "Draft" | "Active" | "Completed";
  createdAt: string;
}

export interface AttentionOrder {
  id: string;
  clientName: string;
  status: OrderStatus;
  minutesInStatus: number;
  reason: "stalled-pending" | "pod-missing" | "monthly-renewal";
  detail: string;
  action: string;
}

export interface HomeMetrics {
  pendingOrders: number;
  activeOrders: number;
  availableDrivers: number;
  completedToday: number;
}
