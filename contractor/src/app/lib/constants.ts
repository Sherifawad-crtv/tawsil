import type { Truck, TruckBaseClass, TruckConfig } from "./types";

/** Valid base-class + config combinations, same vocabulary as the ops dashboard's rate card. */
export const TRUCK_TYPE_OPTIONS: { baseClass: TruckBaseClass; config: TruckConfig }[] = [
  { baseClass: "Dababa", config: "Box" },
  { baseClass: "Dababa", config: "Open" },
  { baseClass: "Dababa", config: "Refrigerated" },
  { baseClass: "Jumbo", config: "Box" },
  { baseClass: "Jumbo", config: "Open" },
  { baseClass: "Jumbo", config: "Refrigerated" },
  { baseClass: "Suzuki Van", config: "Box" },
  { baseClass: "Suzuki Van", config: "Open" },
  { baseClass: "Suzuki Van", config: "Refrigerated" },
  { baseClass: "Trailer", config: "Box" },
  { baseClass: "Trailer", config: "Flatbed" },
  { baseClass: "Trailer", config: "Refrigerated" },
];

export function truckTypeLabel(t: { baseClass: TruckBaseClass; config: TruckConfig }) {
  return `${t.baseClass} ${t.config}`;
}

export function requiresTempControl(t: Truck | { config: TruckConfig }) {
  return t.config === "Refrigerated";
}
