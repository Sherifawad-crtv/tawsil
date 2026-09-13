import { createContext, useContext, useState, type ReactNode } from "react";
import type { Order, Client, Contractor, Driver, Vehicle, MonthlyOrder, SavedLocation, StatusHistoryEntry, OrderStatus, TruckType } from "./types";
import { ORDERS, MONTHLY_ORDERS } from "./ordersMock";
import { CLIENTS, CONTRACTORS, DRIVERS, VEHICLES, SAVED_LOCATIONS } from "./entities";
import { TRUCK_TYPES } from "./constants";

interface DataStoreValue {
  orders: Order[];
  clients: Client[];
  contractors: Contractor[];
  drivers: Driver[];
  vehicles: Vehicle[];
  monthlyOrders: MonthlyOrder[];
  savedLocations: SavedLocation[];
  /** Settings' own editable rate-card copy. Seeded from the static catalog; other
   * sections still read the static TRUCK_TYPES baseline until this is wired to
   * the real backend, so a type added here isn't yet selectable elsewhere. */
  truckTypes: TruckType[];

  addOrder: (order: Order) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  appendStatusHistory: (orderId: string, entry: Omit<StatusHistoryEntry, "id">, newStatus: OrderStatus) => void;
  assignDriver: (orderId: string, contractorId: string, driverId: string, vehicleId: string, note?: string) => void;

  addClient: (client: Client) => void;
  addContractor: (contractor: Contractor) => void;
  addDriver: (driver: Driver) => void;
  addVehicle: (vehicle: Vehicle) => void;
  addSavedLocation: (location: SavedLocation) => void;
  addMonthlyOrder: (contract: MonthlyOrder, spawnedOrders: Order[]) => void;

  toggleClientActive: (id: string) => void;
  toggleContractorActive: (id: string) => void;
  toggleDriverActive: (id: string) => void;
  toggleVehicleActive: (id: string) => void;

  addTruckType: (truckType: TruckType) => void;
  updateTruckType: (id: string, patch: Partial<TruckType>) => void;
}

const DataStoreContext = createContext<DataStoreValue | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [contractors, setContractors] = useState<Contractor[]>(CONTRACTORS);
  const [drivers, setDrivers] = useState<Driver[]>(DRIVERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES);
  const [monthlyOrders, setMonthlyOrders] = useState<MonthlyOrder[]>(MONTHLY_ORDERS);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(SAVED_LOCATIONS);
  const [truckTypes, setTruckTypes] = useState<TruckType[]>(TRUCK_TYPES);

  const value: DataStoreValue = {
    orders,
    clients,
    contractors,
    drivers,
    vehicles,
    monthlyOrders,
    savedLocations,
    truckTypes,

    addOrder: (order) => setOrders((cur) => [order, ...cur]),
    updateOrder: (id, patch) => setOrders((cur) => cur.map((o) => (o.id === id ? { ...o, ...patch } : o))),

    appendStatusHistory: (orderId, entry, newStatus) =>
      setOrders((cur) =>
        cur.map((o) =>
          o.id === orderId
            ? { ...o, status: newStatus, statusHistory: [...o.statusHistory, { ...entry, id: `h-${Date.now()}` }] }
            : o
        )
      ),

    assignDriver: (orderId, contractorId, driverId, vehicleId, note) =>
      setOrders((cur) =>
        cur.map((o) =>
          o.id === orderId
            ? {
                ...o,
                contractorId,
                driverId,
                vehicleId,
                status: "Assigned",
                statusHistory: [
                  ...o.statusHistory,
                  {
                    id: `h-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    fromStatus: o.status,
                    toStatus: "Assigned" as OrderStatus,
                    note: note || "Driver and vehicle allocated",
                    actor: "Supply",
                  },
                ],
              }
            : o
        )
      ),

    addClient: (client) => setClients((cur) => [client, ...cur]),
    addContractor: (contractor) => setContractors((cur) => [contractor, ...cur]),
    addDriver: (driver) => setDrivers((cur) => [driver, ...cur]),
    addVehicle: (vehicle) => setVehicles((cur) => [vehicle, ...cur]),
    addSavedLocation: (location) => setSavedLocations((cur) => [location, ...cur]),
    addMonthlyOrder: (contract, spawnedOrders) => {
      setMonthlyOrders((cur) => [contract, ...cur]);
      setOrders((cur) => [...spawnedOrders, ...cur]);
    },

    toggleClientActive: (id) => setClients((cur) => cur.map((c) => (c.id === id ? { ...c, active: !c.active } : c))),
    toggleContractorActive: (id) => setContractors((cur) => cur.map((c) => (c.id === id ? { ...c, active: !c.active } : c))),
    toggleDriverActive: (id) => setDrivers((cur) => cur.map((d) => (d.id === id ? { ...d, active: !d.active } : d))),
    toggleVehicleActive: (id) => setVehicles((cur) => cur.map((v) => (v.id === id ? { ...v, active: !v.active } : v))),

    addTruckType: (truckType) => setTruckTypes((cur) => [...cur, truckType]),
    updateTruckType: (id, patch) => setTruckTypes((cur) => cur.map((t) => (t.id === id ? { ...t, ...patch } : t))),
  };

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>;
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used within DataStoreProvider");
  return ctx;
}
