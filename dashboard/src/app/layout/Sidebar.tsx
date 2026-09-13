import { NavLink } from "react-router";
import { Widget2Icon } from "@solar-icons/react/linear";
import { BoxIcon } from "@solar-icons/react/linear";
import { BusIcon } from "@solar-icons/react/linear";
import { Buildings2Icon } from "@solar-icons/react/linear";
import { UsersGroupRoundedIcon } from "@solar-icons/react/linear";
import { CalendarMarkIcon } from "@solar-icons/react/linear";
import { SettingsIcon } from "@solar-icons/react/linear";
import { CloseIcon } from "@solar-icons/react/linear";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Widget2Icon, end: true },
  { to: "/orders", label: "Orders", icon: BoxIcon },
  { to: "/contractors", label: "Contractors", icon: BusIcon },
  { to: "/clients", label: "Clients", icon: Buildings2Icon },
  { to: "/resources", label: "Resources", icon: UsersGroupRoundedIcon },
  { to: "/monthly-orders", label: "Monthly Orders", icon: CalendarMarkIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
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
        className={`fixed md:sticky top-0 left-0 z-40 md:z-0 h-screen w-60 md:w-52 flex-shrink-0 flex flex-col bg-nav-bg border-r border-border transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between flex-shrink-0 px-3.5 h-11">
          <h2 className="text-[13px] tracking-tight text-navy" style={{ fontFamily: "var(--font-heading)" }}>
            TAWSIL
          </h2>
          <button
            className="md:hidden w-7 h-7 rounded-md flex items-center justify-center cursor-pointer active:scale-90 transition-transform bg-tile"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon size={14} className="text-navy" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-1.5 flex flex-col gap-px overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-[5px] rounded-[var(--radius-xs)] text-[13px] cursor-pointer transition-colors ${
                  isActive ? "font-semibold text-blue" : "font-medium text-navy"
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? "rgba(18,83,250,0.1)" : "transparent",
                fontFamily: "var(--font-sub)",
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={15} strokeWidth={2} color={isActive ? "#1253FA" : "#6B7280"} className="flex-shrink-0" />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex-shrink-0 px-3.5 pb-3">
          <div className="h-px bg-border mb-2.5" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-navy">
              <span className="text-white text-[10px]" style={{ fontFamily: "var(--font-heading)" }}>AK</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-navy text-[12px] font-semibold" style={{ fontFamily: "var(--font-sub)" }}>Ahmed Khan</p>
              <p className="truncate text-muted text-[10px]" style={{ fontFamily: "var(--font-mono)" }}>ahmed@tawsil.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
