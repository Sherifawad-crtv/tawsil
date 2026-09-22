import "../styles/fonts.css";
import { Routes, Route, Navigate } from "react-router";
import { DataStoreProvider } from "./lib/store";
import { useIsMobileViewport } from "./hooks/useIsMobileViewport";
import MobileOnlyGate from "./components/MobileOnlyGate";
import TabLayout from "./layout/TabLayout";

import HomeScreen from "./screens/home/HomeScreen";
import OrdersTab from "./screens/orders/OrdersTab";
import OrderDetails from "./screens/orders/OrderDetails";
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
        {/* Home is map-first and owns its own chrome (top bar + drawer, no bottom tab bar) - it sits outside TabLayout for exactly that reason. */}
        <Route path="/home" element={<HomeScreen />} />

        <Route element={<TabLayout />}>
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
