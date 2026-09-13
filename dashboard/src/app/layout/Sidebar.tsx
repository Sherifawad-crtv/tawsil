import { NavLink } from "react-router";
import { CloseIcon } from "@solar-icons/react/linear";
import {
  Widget2Icon as Widget2LinearIcon,
  BoxIcon as BoxLinearIcon,
  BusIcon as BusLinearIcon,
  Buildings2Icon as Buildings2LinearIcon,
  UsersGroupRoundedIcon as UsersGroupRoundedLinearIcon,
  CalendarMarkIcon as CalendarMarkLinearIcon,
  SettingsIcon as SettingsLinearIcon,
} from "@solar-icons/react/linear";
import {
  Widget2Icon as Widget2BoldIcon,
  BoxIcon as BoxBoldIcon,
  BusIcon as BusBoldIcon,
  Buildings2Icon as Buildings2BoldIcon,
  UsersGroupRoundedIcon as UsersGroupRoundedBoldIcon,
  CalendarMarkIcon as CalendarMarkBoldIcon,
  SettingsIcon as SettingsBoldIcon,
} from "@solar-icons/react/bold";

const NAV_ITEMS = [
  { to: "/", label: "Home", iconOutline: Widget2LinearIcon, iconFilled: Widget2BoldIcon, end: true },
  { to: "/orders", label: "Orders", iconOutline: BoxLinearIcon, iconFilled: BoxBoldIcon },
  { to: "/contractors", label: "Contractors", iconOutline: BusLinearIcon, iconFilled: BusBoldIcon },
  { to: "/clients", label: "Clients", iconOutline: Buildings2LinearIcon, iconFilled: Buildings2BoldIcon },
  { to: "/resources", label: "Resources", iconOutline: UsersGroupRoundedLinearIcon, iconFilled: UsersGroupRoundedBoldIcon },
  { to: "/monthly-orders", label: "Monthly Orders", iconOutline: CalendarMarkLinearIcon, iconFilled: CalendarMarkBoldIcon },
  { to: "/settings", label: "Settings", iconOutline: SettingsLinearIcon, iconFilled: SettingsBoldIcon },
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
          {NAV_ITEMS.map(({ to, label, iconOutline: IconOutline, iconFilled: IconFilled, end }) => (
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
              {({ isActive }) =>
                isActive ? (
                  <>
                    <IconFilled size={15} color="#1253FA" className="flex-shrink-0" />
                    {label}
                  </>
                ) : (
                  <>
                    <IconOutline size={15} strokeWidth={2} color="#6B7280" className="flex-shrink-0" />
                    {label}
                  </>
                )
              }
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
