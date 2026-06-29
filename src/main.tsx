import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./i18n/i18n.ts";
import "./index.css";

// Désactive le clic droit sur les images
document.addEventListener("contextmenu", (e) => {
  if ((e.target as HTMLElement).tagName === "IMG") {
    e.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
