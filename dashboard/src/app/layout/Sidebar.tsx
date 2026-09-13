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
        className={`fixed md:sticky top-0 md:top-3 left-0 z-40 md:z-0 h-screen md:h-[calc(100vh-24px)] w-64 flex-shrink-0 flex flex-col bg-white md:rounded-3xl border-r md:border border-border md:shadow-sidebar transition-transform duration-300 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between flex-shrink-0 px-4 h-14">
          <h2 className="text-title-3-semibold tracking-tight text-navy" style={{ fontFamily: "var(--font-heading)" }}>
            TAWSIL
          </h2>
          <button
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer active:scale-90 transition-transform bg-tile"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon size={16} className="text-navy" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-1 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, iconOutline: IconOutline, iconFilled: IconFilled, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 p-2 rounded-2lg text-body-medium cursor-pointer transition-colors ${
                  isActive ? "bg-linear-to-b from-blue to-royal shadow-nav-selected text-white" : "text-navy hover:bg-grey-light"
                }`
              }
              style={{ fontFamily: "var(--font-sub)" }}
            >
              {({ isActive }) =>
                isActive ? (
                  <>
                    <IconFilled size={18} color="#ffffff" className="flex-shrink-0" />
                    {label}
                  </>
                ) : (
                  <>
                    <IconOutline size={18} strokeWidth={2} color="#6B7280" className="flex-shrink-0" />
                    {label}
                  </>
                )
              }
            </NavLink>
          ))}
        </nav>

        <div className="flex-shrink-0 px-3 pb-3">
          <div className="h-px bg-border mb-3" />
          <div className="flex items-center gap-2.5 p-2 rounded-2lg hover:bg-grey-light transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-navy">
              <span className="text-white text-caption-1-semibold" style={{ fontFamily: "var(--font-heading)" }}>AK</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-navy text-body-2-semibold" style={{ fontFamily: "var(--font-sub)" }}>Ahmed Khan</p>
              <p className="truncate text-muted text-caption-2-regular" style={{ fontFamily: "var(--font-mono)" }}>ahmed@tawsil.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
