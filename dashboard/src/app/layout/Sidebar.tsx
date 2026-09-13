import { useEffect, useRef, useState, type ReactNode } from "react";
import { NavLink } from "react-router";
import { CloseIcon, MagnifierIcon, SidebarMinimalisticIcon } from "@solar-icons/react/linear";
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
import { cx } from "../lib/cx";
import { useDataStore } from "../lib/store";
import { useRole } from "../lib/RoleContext";
import { getOrdersForRole } from "../lib/selectors";

const NAV_ITEMS = [
  { to: "/", label: "Home", iconOutline: Widget2LinearIcon, iconFilled: Widget2BoldIcon, end: true },
  { to: "/orders", label: "Orders", iconOutline: BoxLinearIcon, iconFilled: BoxBoldIcon, showOrderCount: true },
  { to: "/contractors", label: "Contractors", iconOutline: BusLinearIcon, iconFilled: BusBoldIcon },
  { to: "/clients", label: "Clients", iconOutline: Buildings2LinearIcon, iconFilled: Buildings2BoldIcon },
  { to: "/resources", label: "Resources", iconOutline: UsersGroupRoundedLinearIcon, iconFilled: UsersGroupRoundedBoldIcon },
  { to: "/monthly-orders", label: "Monthly Orders", iconOutline: CalendarMarkLinearIcon, iconFilled: CalendarMarkBoldIcon },
  { to: "/settings", label: "Settings", iconOutline: SettingsLinearIcon, iconFilled: SettingsBoldIcon },
];

/**
 * Collapsible text slot: shrinks + fades away when the desktop rail
 * collapses. Scoped to `md:` so the mobile drawer (always expanded,
 * per BoardUI's own rule) never hides its labels regardless of the
 * collapsed state left over from a prior desktop session.
 */
function Collapsible({ collapsed, children, className }: { collapsed: boolean; children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "flex min-w-0 items-center overflow-hidden whitespace-nowrap transition-[max-width,opacity,filter] duration-300 ease-in-out",
        "max-w-full opacity-100 blur-0",
        collapsed && "md:max-w-0 md:opacity-0 md:blur-[3px]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { orders } = useDataStore();
  const { role } = useRole();
  const orderCount = getOrdersForRole(orders, role).length;

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredItems = normalizedQuery
    ? NAV_ITEMS.filter((item) => item.label.toLocaleLowerCase().includes(normalizedQuery))
    : NAV_ITEMS;

  const activateSearch = () => {
    setCollapsed(false);
    setSearchActive(true);
  };

  const deactivateSearch = () => {
    setSearchActive(false);
    setQuery("");
  };

  useEffect(() => {
    if (!searchActive) return;
    const frame = window.requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [searchActive]);

  useEffect(() => {
    if (!searchActive) return;
    const onOutsideClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node && searchRef.current?.contains(target)) return;
      deactivateSearch();
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [searchActive]);

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
          "fixed md:sticky top-0 md:top-3 left-0 z-40 md:z-0 h-screen md:h-[calc(100vh-24px)] w-64 flex-shrink-0 flex flex-col bg-white md:rounded-3xl border-r md:border border-border md:shadow-sidebar p-3",
          "transition-[transform,width,padding] duration-300 ease-in-out md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          collapsed && "md:w-[60px] md:px-[11px] md:py-3",
        )}
      >
        <div className="flex items-center justify-between gap-1 flex-shrink-0 mb-3">
          <Collapsible collapsed={collapsed} className="pl-1">
            <h2 className="text-title-3-semibold tracking-tight text-navy" style={{ fontFamily: "var(--font-heading)" }}>
              TAWSIL
            </h2>
          </Collapsible>
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => {
              if (collapsed) deactivateSearch();
              setCollapsed((c) => !c);
            }}
            className={cx(
              "hidden md:flex w-8 h-8 rounded-lg items-center justify-center cursor-pointer text-muted hover:bg-grey-light transition-colors flex-shrink-0",
              collapsed && "md:mx-auto",
            )}
          >
            <SidebarMinimalisticIcon size={18} className={cx("transition-transform duration-300 ease-in-out", !collapsed && "-scale-x-100")} />
          </button>
          <button
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer active:scale-90 transition-transform bg-tile flex-shrink-0"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon size={16} className="text-navy" />
          </button>
        </div>

        {/* Quick search */}
        <div className="flex-shrink-0 mb-3" ref={searchRef}>
          {searchActive ? (
            <div className="flex items-center gap-2 h-9 rounded-full bg-grey-light px-3 ring-2 ring-inset ring-blue transition-shadow">
              <MagnifierIcon size={16} className="text-muted flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="search"
                aria-label="Filter navigation"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && deactivateSearch()}
                placeholder="Search navigation…"
                className="min-w-0 flex-1 bg-transparent text-body-2-regular text-navy outline-none placeholder:text-muted"
                style={{ fontFamily: "var(--font-sub)" }}
              />
            </div>
          ) : (
            <button
              type="button"
              aria-label="Quick Search"
              title={collapsed ? "Quick Search" : undefined}
              onClick={activateSearch}
              className={cx(
                "flex items-center gap-2 h-9 rounded-full bg-grey-light hover:bg-border/60 cursor-pointer transition-colors px-3 w-full",
                collapsed && "md:w-9 md:px-0 md:justify-center",
              )}
            >
              <MagnifierIcon size={16} className="text-muted flex-shrink-0" />
              <Collapsible collapsed={collapsed}>
                <span className="text-body-2-regular text-muted" style={{ fontFamily: "var(--font-sub)" }}>
                  Quick Search
                </span>
              </Collapsible>
            </button>
          )}
        </div>

        <nav className="flex-1 px-0.5 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
          {filteredItems.length === 0 ? (
            <p className="px-2 py-3 text-body-2-regular text-muted">No results</p>
          ) : (
            filteredItems.map(({ to, label, iconOutline: IconOutline, iconFilled: IconFilled, end, showOrderCount }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  cx(
                    "flex items-center justify-between rounded-2lg p-2 text-body-medium cursor-pointer transition-colors overflow-hidden w-full",
                    collapsed && "md:w-9",
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
                      <Collapsible collapsed={collapsed}>{label}</Collapsible>
                    </span>
                    {showOrderCount && orderCount > 0 && (
                      <Collapsible collapsed={collapsed}>
                        <span
                          className={cx(
                            "inline-flex items-center justify-center rounded-sm px-1 py-px text-caption-1-semibold",
                            isActive ? "bg-white/25 text-white" : "bg-grey-light text-muted",
                          )}
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {orderCount}
                        </span>
                      </Collapsible>
                    )}
                  </>
                )}
              </NavLink>
            ))
          )}
        </nav>

        <div className="flex-shrink-0 pt-3">
          <div className="h-px bg-border mb-3" />
          <div
            className={cx(
              "flex items-center gap-2.5 p-2 rounded-2lg hover:bg-grey-light transition-colors w-full",
              collapsed && "md:w-9 md:h-9 md:p-0 md:justify-center",
            )}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-navy">
              <span className="text-white text-headline-semibold" style={{ fontFamily: "var(--font-heading)" }}>AK</span>
            </div>
            <Collapsible collapsed={collapsed} className="flex-1">
              <div className="min-w-0">
                <p className="truncate text-navy text-body-2-semibold" style={{ fontFamily: "var(--font-sub)" }}>Ahmed Khan</p>
                <p className="truncate text-muted text-caption-2-regular" style={{ fontFamily: "var(--font-mono)" }}>ahmed@tawsil.com</p>
              </div>
            </Collapsible>
          </div>
        </div>
      </aside>
    </>
  );
}
