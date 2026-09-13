import { Routes, Route } from "react-router";
import AppShell from "./layout/AppShell";
import { RoleProvider } from "./lib/RoleContext";
import Home from "./pages/Home";
import Placeholder from "./pages/Placeholder";

export default function App() {
  return (
    <RoleProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="orders" element={<Placeholder title="Orders" section="Section 2" />} />
          <Route path="contractors" element={<Placeholder title="Contractors" section="Section 3" />} />
          <Route path="clients" element={<Placeholder title="Clients" section="Section 4" />} />
          <Route path="resources" element={<Placeholder title="Resources" section="Section 5" />} />
          <Route path="monthly-orders" element={<Placeholder title="Monthly Orders" section="Section 6" />} />
          <Route path="settings" element={<Placeholder title="Settings" section="Section 7" />} />
        </Route>
      </Routes>
    </RoleProvider>
  );
}
