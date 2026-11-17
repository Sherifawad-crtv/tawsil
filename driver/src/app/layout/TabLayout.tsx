import { Outlet } from "react-router";
import BottomTabBar from "../components/BottomTabBar";

/** Shell for the 3 tab-root screens only (Home, Orders, Account). */
export default function TabLayout() {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <div style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 96px)" }}>
        <Outlet />
      </div>
      <BottomTabBar />
    </div>
  );
}
