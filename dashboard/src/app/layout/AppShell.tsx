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
        <header className="h-16 flex-shrink-0 flex items-center justify-between gap-4 px-4 md:px-8 border-b border-border bg-white">
          <button
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-grey-light cursor-pointer"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} className="text-navy" />
          </button>

          <div className="flex-1" />

          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              className="appearance-none pl-3 pr-8 py-2 rounded-[var(--radius-control)] border border-border bg-grey-light text-sm font-medium text-navy cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue/30"
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
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
