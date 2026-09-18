import { Routes, Route } from "react-router";
import AppShell from "./layout/AppShell";
import { RoleProvider } from "./lib/RoleContext";
import { DataStoreProvider } from "./lib/store";
import Home from "./pages/Home";
import CommandCenter from "./pages/command-center/CommandCenter";
import OrdersList from "./pages/orders/OrdersList";
import OrderDetail from "./pages/orders/OrderDetail";
import ContractorsList from "./pages/contractors/ContractorsList";
import ContractorDetail from "./pages/contractors/ContractorDetail";
import ClientsList from "./pages/clients/ClientsList";
import ClientDetail from "./pages/clients/ClientDetail";
import Resources from "./pages/resources/Resources";
import MonthlyOrdersList from "./pages/monthly/MonthlyOrdersList";
import MonthlyOrderDetail from "./pages/monthly/MonthlyOrderDetail";
import Settings from "./pages/settings/Settings";

export default function App() {
  return (
    <DataStoreProvider>
      <RoleProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="command-center" element={<CommandCenter />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="orders/:orderId" element={<OrderDetail />} />
            <Route path="contractors" element={<ContractorsList />} />
            <Route path="contractors/:contractorId" element={<ContractorDetail />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="clients/:clientId" element={<ClientDetail />} />
            <Route path="resources" element={<Resources />} />
            <Route path="monthly-orders" element={<MonthlyOrdersList />} />
            <Route path="monthly-orders/:contractId" element={<MonthlyOrderDetail />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </RoleProvider>
    </DataStoreProvider>
  );
}
