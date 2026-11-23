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
import ActiveTripsList from "./screens/home/ActiveTripsList";
import NeedsDispatchList from "./screens/home/NeedsDispatchList";
import OrderDetails from "./screens/orders/OrderDetails";
import OrdersList from "./screens/orders/OrdersList";
import TrucksList from "./screens/trucks/TrucksList";
import TruckForm from "./screens/trucks/TruckForm";
import DriversList from "./screens/drivers/DriversList";
import DriverForm from "./screens/drivers/DriverForm";
import HistoryList from "./screens/history/HistoryList";
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
        <Route element={<TabLayout />}>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/trucks" element={<TrucksList />} />
          <Route path="/drivers" element={<DriversList />} />
          <Route path="/history" element={<HistoryList />} />
        </Route>

        <Route path="/home/active" element={<ActiveTripsList />} />
        <Route path="/home/dispatch" element={<NeedsDispatchList />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />

        <Route path="/trucks/new" element={<TruckForm mode="create" />} />
        <Route path="/trucks/:truckId" element={<TruckForm mode="edit" />} />

        <Route path="/drivers/new" element={<DriverForm mode="create" />} />
        <Route path="/drivers/:driverId" element={<DriverForm mode="edit" />} />

        <Route path="/account" element={<AccountList />} />
        <Route path="/account/profile" element={<ProfileSettings />} />
        <Route path="/account/language" element={<LanguageSettings />} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </DataStoreProvider>
  );
}
