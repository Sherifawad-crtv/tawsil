import type { TruckType } from "./types";

export const CARGO_TYPES: string[] = [
  "FMCG", "Consumer Goods", "Pharmaceuticals", "Accessories", "Cosmetics",
  "Home Appliances", "Parcels", "Electronics", "Fashion", "Small Cargo",
  "Cartons", "Light Construction Material", "General Cargo", "Dairy",
  "Chilled Meats", "Fresh Produce", "Frozen Goods", "Raw Materials", "Wood",
  "Steel", "Pallet Cargo", "All Chilled Cargo", "Frozen Cargo",
  "Bulk Food Shipment", "Small Equipment", "Palletized Cans", "Garments",
  "Dry Pharma", "Light-sensitive Items", "Chilled Chocolates & Dairy",
  "Frozen Chicken", "Large Dry Cargo", "Corporate Cargo", "Containers",
  "Heavy Machinery", "Construction Materials", "Poultry & Meat", "Produce",
  "Pharma Cold Chain",
];

const DRY_CARGO = [
  "FMCG", "Consumer Goods", "Accessories", "Cosmetics", "Home Appliances",
  "Parcels", "Electronics", "Fashion", "Small Cargo", "Cartons",
  "General Cargo", "Corporate Cargo", "Garments", "Pallet Cargo",
];
const OPEN_CARGO = [
  "Light Construction Material", "Raw Materials", "Wood", "Steel",
  "Construction Materials", "Heavy Machinery", "Large Dry Cargo", "Containers",
];
const CHILLED_FROZEN_CARGO = [
  "Dairy", "Chilled Meats", "Fresh Produce", "Frozen Goods", "All Chilled Cargo",
  "Frozen Cargo", "Bulk Food Shipment", "Palletized Cans", "Dry Pharma",
  "Light-sensitive Items", "Chilled Chocolates & Dairy", "Frozen Chicken",
  "Poultry & Meat", "Produce", "Pharma Cold Chain", "Pharmaceuticals",
  "Small Equipment",
];

export const TRUCK_TYPES: TruckType[] = [
  { id: "dababa-box", baseClass: "Dababa", config: "Box", requiresTempControl: false, capacityMinT: 1.2, capacityMaxT: 1.5, allowedCargoTypes: DRY_CARGO, dailyRentEGP: 1400.0, pricePerKmEGP: 13.0 },
  { id: "dababa-open", baseClass: "Dababa", config: "Open", requiresTempControl: false, capacityMinT: 1.2, capacityMaxT: 1.5, allowedCargoTypes: OPEN_CARGO, dailyRentEGP: 1300.0, pricePerKmEGP: 13.0 },
  { id: "dababa-ref", baseClass: "Dababa", config: "Refrigerated", requiresTempControl: true, capacityMinT: 1.2, capacityMaxT: 1.5, allowedCargoTypes: CHILLED_FROZEN_CARGO, dailyRentEGP: 1550.0, pricePerKmEGP: 13.0 },
  { id: "jumbo-box", baseClass: "Jumbo", config: "Box", requiresTempControl: false, capacityMinT: 4.0, capacityMaxT: 6.0, allowedCargoTypes: DRY_CARGO, dailyRentEGP: 3050.0, pricePerKmEGP: 13.0 },
  { id: "jumbo-open", baseClass: "Jumbo", config: "Open", requiresTempControl: false, capacityMinT: 4.0, capacityMaxT: 6.0, allowedCargoTypes: OPEN_CARGO, dailyRentEGP: 2750.0, pricePerKmEGP: 13.0 },
  { id: "jumbo-ref", baseClass: "Jumbo", config: "Refrigerated", requiresTempControl: true, capacityMinT: 4.0, capacityMaxT: 6.0, allowedCargoTypes: CHILLED_FROZEN_CARGO, dailyRentEGP: 3300.0, pricePerKmEGP: 13.0 },
  { id: "suzuki-box", baseClass: "Suzuki Van", config: "Box", requiresTempControl: false, capacityMinT: 0.5, capacityMaxT: 0.75, allowedCargoTypes: DRY_CARGO, dailyRentEGP: 1200.0, pricePerKmEGP: 12.0 },
  { id: "suzuki-open", baseClass: "Suzuki Van", config: "Open", requiresTempControl: false, capacityMinT: 0.5, capacityMaxT: 0.75, allowedCargoTypes: OPEN_CARGO, dailyRentEGP: 1200.0, pricePerKmEGP: 12.0 },
  {
    id: "suzuki-ref", baseClass: "Suzuki Van", config: "Refrigerated", requiresTempControl: true, capacityMinT: 0.5, capacityMaxT: 0.75, allowedCargoTypes: CHILLED_FROZEN_CARGO, dailyRentEGP: 500.0, pricePerKmEGP: 1.8,
    flagged: true,
    flagNote: "Rate breaks the pattern every other class follows (refrigerated normally costs more than Box/Open of the same class) — likely a data-entry error in the live system. Flagged for review, not auto-corrected.",
  },
  { id: "trailer-box", baseClass: "Trailer", config: "Box", requiresTempControl: false, capacityMinT: 25.0, capacityMaxT: 35.0, allowedCargoTypes: DRY_CARGO, dailyRentEGP: 4950.0, pricePerKmEGP: 22.0 },
  { id: "trailer-flatbed", baseClass: "Trailer", config: "Flatbed", requiresTempControl: false, capacityMinT: 25.0, capacityMaxT: 35.0, allowedCargoTypes: OPEN_CARGO, dailyRentEGP: 4500.0, pricePerKmEGP: 22.0 },
  { id: "trailer-ref", baseClass: "Trailer", config: "Refrigerated", requiresTempControl: true, capacityMinT: 25.0, capacityMaxT: 35.0, allowedCargoTypes: CHILLED_FROZEN_CARGO, dailyRentEGP: 5450.0, pricePerKmEGP: 22.0 },
];

export function truckTypeLabel(t: TruckType) {
  return `${t.baseClass} · ${t.config}`;
}
