import { useState } from "react";
import { Outlet } from "react-router";
import { HamburgerMenuIcon, AltArrowDownIcon } from "@solar-icons/react/linear";
import Sidebar from "./Sidebar";
import { useRole, ROLES } from "../lib/RoleContext";

export default function AppShell() {
  const [navOpen, setNavOpen] = useState(false);
  const { role, setRole } = useRole();

  return (
    <div className="min-h-screen flex md:gap-3 md:p-3 bg-grey-light">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 md:h-auto flex-shrink-0 flex items-center justify-between gap-4 px-3.5 md:px-0 border-b md:border-b-0 border-border bg-white md:bg-transparent md:pb-3">
          <button
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-grey-light cursor-pointer"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
          >
            <HamburgerMenuIcon size={20} className="text-navy" />
          </button>

          <div className="flex-1" />

          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              className="appearance-none h-9 pl-3 pr-8 rounded-2lg bg-tile text-body-2-medium text-navy cursor-pointer ring-2 ring-inset ring-transparent focus:outline-none focus:ring-blue transition-shadow"
              style={{ fontFamily: "var(--font-sub)" }}
              aria-label="Viewing as role"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  Viewing as: {r}
                </option>
              ))}
            </select>
            <AltArrowDownIcon
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
        </header>

        <main className="flex-1 px-3.5 md:px-0 py-4 md:py-0 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
