/**
 * Domain model for the Contractor app. Mirrors the vocabulary already
 * established in the ops dashboard (TruckBaseClass/TruckConfig, status
 * colors) so the same order looks the same across every Tawsil app, with
 * one addition: "Accepted" sits between Pending and Assigned here, because
 * from the Contractor's side "I've won/accepted this order but haven't put
 * a driver on it yet" is its own state worth flagging (the amber
 * "No Driver Assigned" warning).
 */
export type OrderStatus = "Pending" | "Accepted" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
export type TripType = "On Demand" | "Monthly";

export type TruckBaseClass = "Dababa" | "Jumbo" | "Suzuki Van" | "Trailer";
export type TruckConfig = "Box" | "Open" | "Refrigerated" | "Flatbed";

export interface Truck {
  id: string;
  plateNumber: string;
  baseClass: TruckBaseClass;
  config: TruckConfig;
  licenseExpiry: string;
  active: boolean;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  active: boolean;
  deactivatedAt?: string;
}

export interface StatusHistoryEntry {
  id: string;
  timestamp: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  note?: string;
}

export interface TripFiles {
  odometerBeforeUrl?: string;
  odometerAfterUrl?: string;
  additionalImages: string[];
}

export interface Waypoint {
  id: string;
  label: string;
  address: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  tripType: TripType;
  isMonthly: boolean;
  baseClass: TruckBaseClass;
  config: TruckConfig;
  truckTempC?: number;
  priceEGP: number;
  weightKg?: number;
  hours?: number;
  km?: number;
  pickupAt: string;
  waypoints: Waypoint[];
  podRequired: boolean;
  driverId?: string;
  truckId?: string;
  clientName: string;
  clientPhone?: string;
  files: TripFiles;
  statusHistory: StatusHistoryEntry[];
}

export interface ContractorProfile {
  fullName: string;
  nationalId: string;
  phone: string;
  username: string;
  email: string;
}

export type Language = "en" | "ar";
