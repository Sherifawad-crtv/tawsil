import { useState } from "react";
import { Outlet } from "react-router";
import { Menu, ChevronDown } from "lucide-react";
import Sidebar from "./Sidebar";
import { useRole, ROLES } from "../lib/RoleContext";

export default function AppShell() {
  const [navOpen, setNavOpen] = useState(false);
  const { role, setRole } = useRole();

  return (
    <div className="min-h-screen flex bg-grey-light">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-11 flex-shrink-0 flex items-center justify-between gap-4 px-3.5 md:px-6 border-b border-border bg-white">
          <button
            className="md:hidden p-1.5 -ml-1.5 rounded-md hover:bg-grey-light cursor-pointer"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} className="text-navy" />
          </button>

          <div className="flex-1" />

          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              className="appearance-none pl-2.5 pr-7 py-1 rounded-[var(--radius-control)] border border-border bg-grey-light text-[12px] font-medium text-navy cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue/30"
              style={{ fontFamily: "var(--font-sub)" }}
              aria-label="Viewing as role"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  Viewing as: {r}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
        </header>

        <main className="flex-1 px-3.5 md:px-6 py-4 md:py-5 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
