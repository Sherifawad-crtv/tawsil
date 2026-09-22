import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { ALL_ORDERS, DRIVER_PROFILE } from "./mockData";
import type { Order, DriverProfile, Language } from "./types";

interface DataStoreValue {
  orders: Order[];
  profile: DriverProfile;
  language: Language;
  setLanguage: (l: Language) => void;
  /** Marks a trip file slot as captured - the Driver app owns submitting these (Contractor's Order Details is read-only for exactly this reason). */
  captureFile: (orderId: string, slot: "odometerBeforeUrl" | "odometerAfterUrl" | "additionalImage") => void;
  /** Slide-to-accept on an Assigned order - moves it to In Progress. */
  acceptOrder: (orderId: string) => void;
}

const DataStoreContext = createContext<DataStoreValue | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(ALL_ORDERS);
  const [language, setLanguage] = useState<Language>("en");

  const value = useMemo<DataStoreValue>(
    () => ({
      orders,
      profile: DRIVER_PROFILE,
      language,
      setLanguage,
      captureFile: (orderId, slot) =>
        setOrders((cur) =>
          cur.map((o) => {
            if (o.id !== orderId) return o;
            if (slot === "additionalImage") {
              return { ...o, files: { ...o.files, additionalImages: [...o.files.additionalImages, `capture-${Date.now()}.jpg`] } };
            }
            return { ...o, files: { ...o.files, [slot]: `capture-${Date.now()}.jpg` } };
          })
        ),
      acceptOrder: (orderId) =>
        setOrders((cur) =>
          cur.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: "In Progress",
                  statusHistory: [
                    ...o.statusHistory,
                    { id: `h-${o.statusHistory.length}`, timestamp: new Date().toISOString(), fromStatus: o.status, toStatus: "In Progress" },
                  ],
                }
              : o
          )
        ),
    }),
    [orders, language]
  );

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>;
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used within DataStoreProvider");
  return ctx;
}
