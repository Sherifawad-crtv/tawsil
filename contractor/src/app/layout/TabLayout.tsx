import { Outlet } from "react-router";
import BottomTabBar from "../components/BottomTabBar";

/** Shell for the 4 tab-root screens only (Home, Trucks, Drivers, History) - the tab bar stays visible here and nowhere else, so it never competes with a pushed screen's own header/bottom sheet/FAB. */
export default function TabLayout() {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <div style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 16px) + 96px)" }}>
        <Outlet />
      </div>
      <BottomTabBar />
    </div>
  );
}
