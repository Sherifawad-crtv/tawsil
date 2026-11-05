
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { StatusBarFade } from "./app/lib/statusBar.tsx";
  import { AuthProvider } from "./app/lib/AuthContext.tsx";
  import "./styles/index.css";
  import { registerSW } from "virtual:pwa-register";

  registerSW({ immediate: true });

  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <StatusBarFade />
      <App />
    </AuthProvider>,
  );
