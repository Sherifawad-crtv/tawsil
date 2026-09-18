import { NavLink } from "react-router";
import { CloseIcon } from "@solar-icons/react/linear";
import {
  Widget2Icon as Widget2LinearIcon,
  BoxIcon as BoxLinearIcon,
  BuildingsIcon as BuildingsLinearIcon,
  Buildings2Icon as Buildings2LinearIcon,
  UsersGroupRoundedIcon as UsersGroupRoundedLinearIcon,
  CalendarMarkIcon as CalendarMarkLinearIcon,
  SettingsIcon as SettingsLinearIcon,
  GlobalIcon as GlobalLinearIcon,
} from "@solar-icons/react/linear";
import {
  Widget2Icon as Widget2BoldIcon,
  BoxIcon as BoxBoldIcon,
  BuildingsIcon as BuildingsBoldIcon,
  Buildings2Icon as Buildings2BoldIcon,
  UsersGroupRoundedIcon as UsersGroupRoundedBoldIcon,
  CalendarMarkIcon as CalendarMarkBoldIcon,
  SettingsIcon as SettingsBoldIcon,
  GlobalIcon as GlobalBoldIcon,
} from "@solar-icons/react/bold";
import { cx } from "../lib/cx";
import { useDataStore } from "../lib/store";
import { useRole } from "../lib/RoleContext";
import { getOrdersForRole, canViewCommandCenter } from "../lib/selectors";
import { initials } from "../lib/format";

const NAV_ITEMS = [
  // Executive view, first in the list and hidden from everyone but
  // leadership - see canViewCommandCenter.
  { to: "/command-center", label: "Command Center", iconOutline: GlobalLinearIcon, iconFilled: GlobalBoldIcon, execOnly: true },
  { to: "/", label: "Home", iconOutline: Widget2LinearIcon, iconFilled: Widget2BoldIcon, end: true },
  { to: "/orders", label: "Orders", iconOutline: BoxLinearIcon, iconFilled: BoxBoldIcon, showOrderCount: true },
  { to: "/contractors", label: "Contractors", iconOutline: BuildingsLinearIcon, iconFilled: BuildingsBoldIcon },
  { to: "/clients", label: "Clients", iconOutline: Buildings2LinearIcon, iconFilled: Buildings2BoldIcon },
  { to: "/resources", label: "Resources", iconOutline: UsersGroupRoundedLinearIcon, iconFilled: UsersGroupRoundedBoldIcon },
  { to: "/monthly-orders", label: "Monthly Orders", iconOutline: CalendarMarkLinearIcon, iconFilled: CalendarMarkBoldIcon },
  { to: "/settings", label: "Settings", iconOutline: SettingsLinearIcon, iconFilled: SettingsBoldIcon },
];

/** Always expanded. On phones it slides in as a drawer over the content. */
export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { orders, currentUser } = useDataStore();
  const { role } = useRole();
  const orderCount = getOrdersForRole(orders, role).length;
  const navItems = NAV_ITEMS.filter((item) => !item.execOnly || canViewCommandCenter(role));

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
        className={cx(
          "fixed md:sticky top-0 md:top-3 left-0 z-40 md:z-0 h-screen md:h-[calc(100vh-24px)] w-64 flex-shrink-0 flex flex-col bg-white md:rounded-3xl border-r md:border border-border p-3",
          "transition-transform duration-300 ease-in-out md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-1 flex-shrink-0 mb-3">
          <h2 className="text-title-3-semibold tracking-tight text-navy pl-1" style={{ fontFamily: "var(--font-heading)" }}>
            TAWSIL
          </h2>
          <button
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer active:scale-90 transition-transform bg-grey-light flex-shrink-0"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon size={16} className="text-navy" />
          </button>
        </div>

        <nav className="flex-1 px-0.5 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ to, label, iconOutline: IconOutline, iconFilled: IconFilled, end, showOrderCount }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cx(
                  "flex items-center justify-between rounded-2lg p-2 text-body-medium cursor-pointer transition-colors overflow-hidden w-full",
                  isActive ? "bg-linear-to-b from-blue to-royal shadow-nav-selected text-white" : "text-navy hover:bg-grey-light",
                )
              }
              style={{ fontFamily: "var(--font-sub)" }}
            >
              {({ isActive }) => (
                <>
                  <span className="flex min-w-0 items-center gap-2">
                    {isActive ? (
                      <IconFilled size={20} color="#ffffff" className="flex-shrink-0" />
                    ) : (
                      <IconOutline size={20} strokeWidth={2} color="#6B7280" className="flex-shrink-0" />
                    )}
                    <span className="whitespace-nowrap">{label}</span>
                  </span>
                  {showOrderCount && orderCount > 0 && (
                    <span
                      className={cx(
                        "inline-flex items-center justify-center rounded-sm px-1 py-px text-caption-1-semibold",
                        isActive ? "bg-white/25 text-white" : "bg-grey-light text-muted",
                      )}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {orderCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex-shrink-0 pt-3">
          <div className="h-px bg-border mb-3" />
          <div className="flex items-center gap-2.5 p-2 rounded-2lg hover:bg-grey-light transition-colors w-full">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-navy">
              <span className="text-white text-headline-semibold" style={{ fontFamily: "var(--font-heading)" }}>{initials(currentUser.name)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-navy text-body-2-semibold" style={{ fontFamily: "var(--font-sub)" }}>{currentUser.name}</p>
              <p className="truncate text-muted text-caption-2-regular" style={{ fontFamily: "var(--font-mono)" }}>{currentUser.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
