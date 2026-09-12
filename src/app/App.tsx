import "../styles/fonts.css";
import { useState } from "react";
import { TruckSelectorMap } from "./components/TruckSelectorMap";
import SideNav, { MenuButton } from "./components/SideNav";
import type { NavScreen } from "./components/SideNav";
import HomeScreen from "./components/HomeScreen";
import ActivityScreen from "./components/ActivityScreen";
import InsightsScreen from "./components/InsightsScreen";
import ProfileScreen from "./components/ProfileScreen";
import OrderDetailsScreen from "./components/OrderDetailsScreen";
import MobileOnlyGate from "./components/MobileOnlyGate";
import { useIsMobileViewport } from "./hooks/useIsMobileViewport";

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [screen, setScreen] = useState<NavScreen | "booking" | "order-details">("booking");
  const isMobileViewport = useIsMobileViewport();

  const handleStartBooking = () => setScreen("booking");
  const handleNavigate = (s: NavScreen) => setScreen(s);

  if (!isMobileViewport) {
    return <MobileOnlyGate />;
  }

  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: "#F5F5F3" }}>
      {/* Side Nav */}
      <SideNav
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        activeScreen={screen === "booking" || screen === "order-details" ? "home" : screen}
        onNavigate={handleNavigate}
      />

      {/* Menu button - hidden during booking flow */}
      {screen !== "booking" && (
        <MenuButton onClick={() => setNavOpen(true)} />
      )}

      {/* Screens */}
      {screen === "home" && (
        <HomeScreen
          onStartBooking={handleStartBooking}
          onViewActivity={() => setScreen("activity")}
          onOpenOrder={() => setScreen("order-details")}
        />
      )}
      {screen === "order-details" && (
        <OrderDetailsScreen onBack={() => setScreen("home")} />
      )}
      {screen === "activity" && <ActivityScreen />}
      {screen === "insights" && <InsightsScreen />}
      {screen === "profile" && <ProfileScreen />}
      {screen === "booking" && (
        <TruckSelectorMap onBack={() => setScreen("home")} />
      )}
    </div>
  );
}