/**
 * Domain model for the Driver app. A driver only ever sees orders already
 * assigned to them by a contractor, so there's no Pending/Accepted here
 * (those are pre-assignment, Contractor-side states) - the stepper starts at
 * Assigned. No price field anywhere: the spec never shows a driver a trip's
 * commercial value on any screen, on cards or in detail.
 */
export type OrderStatus = "Assigned" | "In Progress" | "Completed" | "Cancelled";
export type TripType = "On Demand" | "Monthly";

export type TruckBaseClass = "Dababa" | "Jumbo" | "Suzuki Van" | "Trailer";
export type TruckConfig = "Box" | "Open" | "Refrigerated" | "Flatbed";

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
  baseClass: TruckBaseClass;
  config: TruckConfig;
  truckTempC?: number;
  truckPlate: string;
  weightKg?: number;
  hours?: number;
  km?: number;
  pickupAt: string;
  waypoints: Waypoint[];
  podRequired: boolean;
  clientName: string;
  clientPhone?: string;
  files: TripFiles;
  statusHistory: StatusHistoryEntry[];
}

export interface DriverProfile {
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseValid: boolean;
  contractorName: string;
}

export type Language = "en" | "ar";
