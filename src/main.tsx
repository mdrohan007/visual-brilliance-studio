import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const isInIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();
const isPreviewHost = /lovableproject\.com$|\.lovable\.app$|^localhost$/.test(window.location.hostname) && (window.location.hostname.includes("id-preview--") || window.location.hostname.endsWith("lovableproject.com"));

if (!isInIframe && !isPreviewHost && "serviceWorker" in navigator) {
  // Production registration only (vite-plugin-pwa virtual module)
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  }).catch(() => {});
} else if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
}

createRoot(document.getElementById("root")!).render(<App />);
