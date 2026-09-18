import "../styles/fonts.css";
import { Routes, Route, Navigate } from "react-router";
import { DataStoreProvider } from "./lib/store";
import { useIsMobileViewport } from "./hooks/useIsMobileViewport";
import MobileOnlyGate from "./components/MobileOnlyGate";
import TabLayout from "./layout/TabLayout";

import HomeScreen from "./screens/home/HomeScreen";
import AvailableOrdersList from "./screens/home/AvailableOrdersList";
import ActiveTripsList from "./screens/home/ActiveTripsList";
import OrderDetails from "./screens/orders/OrderDetails";
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

  if (!isMobileViewport) {
    return <MobileOnlyGate />;
  }

  return (
    <DataStoreProvider>
      <Routes>
        <Route element={<TabLayout />}>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/trucks" element={<TrucksList />} />
          <Route path="/drivers" element={<DriversList />} />
          <Route path="/history" element={<HistoryList />} />
        </Route>

        <Route path="/home/available" element={<AvailableOrdersList />} />
        <Route path="/home/active" element={<ActiveTripsList />} />
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
