import { NavLink } from "react-router";
import {
  LayoutGrid,
  Package,
  Truck,
  Building2,
  Users,
  CalendarClock,
  Settings,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: LayoutGrid, end: true },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/contractors", label: "Contractors", icon: Truck },
  { to: "/clients", label: "Clients", icon: Building2 },
  { to: "/resources", label: "Resources", icon: Users },
  { to: "/monthly-orders", label: "Monthly Orders", icon: CalendarClock },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-navy/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 flex flex-col bg-navy text-white transition-transform duration-300 md:translate-x-0 md:static md:z-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 flex-shrink-0">
          <span
            className="text-lg tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            TAWSIL
          </span>
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-control)] text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 text-xs text-white/40" style={{ fontFamily: "var(--font-mono)" }}>
          Tawsil Dashboard v2
        </div>
      </aside>
    </>
  );
}
