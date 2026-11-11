import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import ErrorBoundary from "@/app/ErrorBoundary";
import { env } from "@/lib/env";
import { hydrateLogs, installGlobalErrorHandlers, logger } from "@/features/logs/logger";
import { requestPersistentStorage } from "@/lib/storage";
import { initTheme } from "@/features/theme/theme";
import "@/index.css";

initTheme();
installGlobalErrorHandlers();
void hydrateLogs();
document.title = env.appName;

void requestPersistentStorage().then((ok) => {
  logger.info(ok ? "Penyimpanan persisten aktif" : "Penyimpanan persisten belum aktif");
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
