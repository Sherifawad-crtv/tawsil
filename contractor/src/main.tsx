import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./app/App.tsx";
import { StatusBarFade } from "./app/lib/statusBar.tsx";
import "./styles/index.css";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StatusBarFade />
    <App />
  </BrowserRouter>
);
