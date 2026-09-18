import { NavLink } from "react-router";
import HomeRounded from "@mui/icons-material/HomeRounded";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import LocalShippingRounded from "@mui/icons-material/LocalShippingRounded";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import PeopleAltRounded from "@mui/icons-material/PeopleAltRounded";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import AccessTimeFilledRounded from "@mui/icons-material/AccessTimeFilledRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";

const TABS = [
  { to: "/home", label: "Home", filled: HomeRounded, outline: HomeOutlined },
  { to: "/trucks", label: "Trucks", filled: LocalShippingRounded, outline: LocalShippingOutlined },
  { to: "/drivers", label: "Drivers", filled: PeopleAltRounded, outline: PeopleAltOutlined },
  { to: "/history", label: "History", filled: AccessTimeFilledRounded, outline: AccessTimeRounded },
];

/** Fixed, safe-area-aware, never scrolls with content - a real bottom tab bar, not a footer. */
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
        <NavLink
          key={tab.to}
          to={tab.to}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
          style={{ paddingTop: "8px", paddingBottom: "8px" }}
        >
          {({ isActive }) => {
            const Icon = isActive ? tab.filled : tab.outline;
            return (
              <>
                <Icon sx={{ fontSize: 23, color: isActive ? "#1253FA" : "#9CA3AF" }} />
                <span
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "10.5px",
                    color: isActive ? "#1253FA" : "#9CA3AF",
                  }}
                >
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
