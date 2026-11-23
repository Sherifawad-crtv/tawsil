import "../styles/fonts.css";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import { DataStoreProvider } from "./lib/store";
import { useIsMobileViewport } from "./hooks/useIsMobileViewport";
import MobileOnlyGate from "./components/MobileOnlyGate";
import TabLayout from "./layout/TabLayout";
import IntroWalkthrough from "./components/IntroWalkthrough";
import { INTRO_STEPS } from "./components/introSteps";
import { hasSeenIntro, markIntroSeen } from "./lib/introSeen";

import HomeScreen from "./screens/home/HomeScreen";
import OrdersTab from "./screens/orders/OrdersTab";
import OrderDetails from "./screens/orders/OrderDetails";
import AccountList from "./screens/account/AccountList";
import ProfileSettings from "./screens/account/ProfileSettings";
import LanguageSettings from "./screens/account/LanguageSettings";

export default function App() {
  const isMobileViewport = useIsMobileViewport();
  const [introSeen, setIntroSeen] = useState(hasSeenIntro);

  if (!isMobileViewport) {
    return <MobileOnlyGate />;
  }

  // First launch only: the three-step intro comes before the app itself.
  if (!introSeen) {
    return (
      <IntroWalkthrough
        steps={INTRO_STEPS}
        onDone={() => {
          markIntroSeen();
          setIntroSeen(true);
        }}
      />
    );
  }

  return (
    <DataStoreProvider>
      <Routes>
        {/* 3 tab roots only - Home, Orders, Account (no Trucks/Drivers, no separate History tab). */}
        <Route element={<TabLayout />}>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/orders" element={<OrdersTab />} />
          <Route path="/account" element={<AccountList />} />
        </Route>

        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/account/profile" element={<ProfileSettings />} />
        <Route path="/account/language" element={<LanguageSettings />} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </DataStoreProvider>
  );
}
