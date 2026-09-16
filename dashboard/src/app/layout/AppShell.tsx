import { useState } from "react";
import { Outlet } from "react-router";
import { HamburgerMenuIcon } from "@solar-icons/react/linear";
import Sidebar from "./Sidebar";
import { Select } from "../components/Select";
import { useRole, ROLES } from "../lib/RoleContext";

/**
 * Two floating panels on the page ground: the sidebar and the content, both
 * white with the same radius, border and shadow. The shell itself doesn't
 * scroll — the content panel scrolls inside its own frame (BoardUI's app-shell
 * does the same), so the sidebar stays put and the panel keeps its edges.
 */
export default function AppShell() {
  const [navOpen, setNavOpen] = useState(false);
  const { role, setRole } = useRole();

  return (
    <div className="h-dvh flex md:gap-3 md:p-3 bg-grey-light overflow-hidden">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-white md:rounded-3xl md:border border-border md:shadow-sidebar">
        <header className="h-14 flex-shrink-0 flex items-center justify-between gap-4 px-3.5 md:px-6 border-b border-border">
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

        <main className="flex-1 overflow-y-auto px-3.5 md:px-6 py-4 md:py-6">
          <div className="max-w-[1400px] w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
