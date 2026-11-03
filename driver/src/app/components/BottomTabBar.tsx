import { NavLink } from "react-router";
import HomeRounded from "./icons/HomeRounded";
import HomeOutlined from "./icons/HomeOutlined";
import BoxRounded from "./icons/Inventory2Rounded";
import BoxOutlined from "./icons/Inventory2Outlined";
import PersonRounded from "./icons/PersonRounded";
import PersonOutlineRounded from "./icons/PersonOutlineRounded";

// 3 tabs only - Driver has no fleet to manage, so no Trucks/Drivers tabs like Contractor's 4-tab bar.
const TABS = [
  { to: "/home", label: "Home", filled: HomeRounded, outline: HomeOutlined },
  { to: "/orders", label: "Orders", filled: BoxRounded, outline: BoxOutlined },
  { to: "/account", label: "Account", filled: PersonRounded, outline: PersonOutlineRounded },
];

/** Fixed, safe-area-aware, never scrolls with content - and rendered exactly once, only here, so its active-state pill can never bleed into page content. */
export default function BottomTabBar() {
  return (
    <nav
      className="fixed left-0 right-0 bottom-0 z-40 flex items-stretch"
      style={{
        backgroundColor: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid #E8E8E5",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {TABS.map((tab) => (
        <NavLink key={tab.to} to={tab.to} className="flex-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer" style={{ paddingTop: "8px", paddingBottom: "8px", minHeight: "48px" }}>
          {({ isActive }) => {
            const Icon = isActive ? tab.filled : tab.outline;
            return (
              <>
                <Icon sx={{ fontSize: 23, color: isActive ? "#1253FA" : "#626A76" }} />
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: isActive ? 700 : 500, fontSize: "var(--type-caption)", color: isActive ? "#1253FA" : "#626A76" }}>
                  {tab.label}
                </span>
              </>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
}
