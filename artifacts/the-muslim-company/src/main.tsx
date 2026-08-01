import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

// After a new deploy, every JS chunk gets a new content-hash filename and
// the old ones are gone from the server. A browser tab that's had the app
// open since before that deploy (or a crawler with a stale cached HTML)
// will try to lazy-load an old, now-404ing chunk when navigating to a page
// it hasn't visited yet — leaving a blank page / thrown error instead of
// just picking up the current version. Reload once (not in a loop) to fix
// this transparently instead of leaving the user stuck.
function reloadOnce(reason: string) {
  const key = "tmc:chunk-reload";
  if (sessionStorage.getItem(key)) return; // already tried once this session — avoid a loop
  sessionStorage.setItem(key, "1");
  console.warn(`[tmc] Reloading due to stale build asset (${reason})`);
  window.location.reload();
}

window.addEventListener("vite:preloadError", () => reloadOnce("vite:preloadError"));
window.addEventListener("error", (e) => {
  if (/Failed to fetch dynamically imported module|Loading chunk .* failed/i.test(e.message || "")) {
    reloadOnce("window error");
  }
});
window.addEventListener("unhandledrejection", (e) => {
  const msg = String(e.reason?.message || e.reason || "");
  if (/Failed to fetch dynamically imported module|Loading chunk .* failed|dynamically imported module/i.test(msg)) {
    reloadOnce("unhandled rejection");
  }
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
