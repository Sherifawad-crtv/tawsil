import { useState } from "react";
import { Outlet } from "react-router";
import { HamburgerMenuIcon } from "@solar-icons/react/linear";
import Sidebar from "./Sidebar";
import { Select } from "../components/Select";
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

          <Select
            aria-label="Viewing as role"
            value={role}
            onChange={(v) => setRole(v as typeof role)}
            options={ROLES.map((r) => ({ value: r, label: `Viewing as: ${r}` }))}
          />
        </header>

        <main className="flex-1 px-3.5 md:px-0 py-4 md:py-0 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
