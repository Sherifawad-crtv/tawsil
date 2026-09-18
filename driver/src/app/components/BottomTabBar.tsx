import { NavLink } from "react-router";
import HomeRounded from "@mui/icons-material/HomeRounded";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import BoxRounded from "@mui/icons-material/Inventory2Rounded";
import BoxOutlined from "@mui/icons-material/Inventory2Outlined";
import PersonRounded from "@mui/icons-material/PersonRounded";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";

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
                <Icon sx={{ fontSize: 23, color: isActive ? "#1253FA" : "#9CA3AF" }} />
                <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: isActive ? 700 : 500, fontSize: "10.5px", color: isActive ? "#1253FA" : "#9CA3AF" }}>
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
