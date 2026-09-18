import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { TRUCKS, DRIVERS, ALL_ORDERS, CONTRACTOR_PROFILE } from "./mockData";
import type { Truck, Driver, Order, ContractorProfile, Language } from "./types";

interface DataStoreValue {
  trucks: Truck[];
  drivers: Driver[];
  orders: Order[];
  profile: ContractorProfile;
  language: Language;
  setLanguage: (l: Language) => void;
  addTruck: (t: Truck) => void;
  updateTruck: (id: string, patch: Partial<Truck>) => void;
  toggleTruckActive: (id: string) => void;
  addDriver: (d: Driver) => void;
  updateDriver: (id: string, patch: Partial<Driver>) => void;
  toggleDriverActive: (id: string) => void;
}

const DataStoreContext = createContext<DataStoreValue | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [trucks, setTrucks] = useState<Truck[]>(TRUCKS);
  const [drivers, setDrivers] = useState<Driver[]>(DRIVERS);
  const [orders] = useState<Order[]>(ALL_ORDERS);
  const [language, setLanguage] = useState<Language>("en");

  const value = useMemo<DataStoreValue>(
    () => ({
      trucks,
      drivers,
      orders,
      profile: CONTRACTOR_PROFILE,
      language,
      setLanguage,
      addTruck: (t) => setTrucks((cur) => [t, ...cur]),
      updateTruck: (id, patch) => setTrucks((cur) => cur.map((t) => (t.id === id ? { ...t, ...patch } : t))),
      toggleTruckActive: (id) => setTrucks((cur) => cur.map((t) => (t.id === id ? { ...t, active: !t.active } : t))),
      addDriver: (d) => setDrivers((cur) => [d, ...cur]),
      updateDriver: (id, patch) => setDrivers((cur) => cur.map((d) => (d.id === id ? { ...d, ...patch } : d))),
      toggleDriverActive: (id) =>
        setDrivers((cur) =>
          cur.map((d) =>
            d.id === id ? { ...d, active: !d.active, deactivatedAt: d.active ? new Date().toISOString() : undefined } : d
          )
        ),
    }),
    [trucks, drivers, orders, language]
  );

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>;
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used within DataStoreProvider");
  return ctx;
}
