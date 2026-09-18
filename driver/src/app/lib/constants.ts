import type { TruckBaseClass, TruckConfig } from "./types";

export function truckTypeLabel(t: { baseClass: TruckBaseClass; config: TruckConfig }) {
  return `${t.baseClass} ${t.config}`;
}
