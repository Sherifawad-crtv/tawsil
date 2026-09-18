import { createContext, useContext, useState, type ReactNode } from "react";
import type { Role } from "./types";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

const ROLES: Role[] = ["Sales", "Supply", "Operations", "Admin", "Executive"];

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Sales");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}

export { ROLES };
