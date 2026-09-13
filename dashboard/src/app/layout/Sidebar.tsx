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
          className="fixed inset-0 z-30 md:hidden"
          style={{ backgroundColor: "rgba(4,0,51,0.4)" }}
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 md:z-0 h-screen w-64 flex-shrink-0 flex flex-col bg-nav-bg border-r border-border transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between flex-shrink-0 px-5 pt-5 pb-4">
          <div>
            <h2 className="text-xl text-navy" style={{ fontFamily: "var(--font-heading)" }}>
              TAWSIL
            </h2>
            <p className="mt-0.5 text-[11px] text-muted" style={{ fontFamily: "var(--font-mono)" }}>
              Admin Dashboard
            </p>
          </div>
          <button
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform bg-tile"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} className="text-navy" />
          </button>
        </div>

        <div className="h-px bg-border mx-5" />

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm cursor-pointer transition-all active:scale-[0.97] ${
                  isActive ? "font-bold text-blue" : "font-medium text-navy"
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? "rgba(18,83,250,0.06)" : "transparent",
                fontFamily: "var(--font-sub)",
              })}
            >
              {({ isActive }) => (
                <>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ backgroundColor: isActive ? "rgba(18,83,250,0.1)" : "var(--color-tile)" }}
                  >
                    <Icon size={17} strokeWidth={2} color={isActive ? "#1253FA" : "#6B7280"} />
                  </div>
                  {label}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue flex-shrink-0" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex-shrink-0 px-5 pb-6">
          <div className="h-px bg-border mb-4" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-navy">
              <span className="text-white text-sm" style={{ fontFamily: "var(--font-heading)" }}>AK</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-navy text-[13px] font-semibold" style={{ fontFamily: "var(--font-sub)" }}>Ahmed Khan</p>
              <p className="truncate text-muted text-[11px]" style={{ fontFamily: "var(--font-mono)" }}>ahmed@tawsil.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
