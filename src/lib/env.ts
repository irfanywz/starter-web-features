/**
 * Satu-satunya tempat membaca environment variable dan metadata aplikasi.
 * Komponen dan lib lain cukup import `env` dari sini.
 */
export const env = {
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  appName: import.meta.env.VITE_APP_NAME || "Web Starter",
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, ""),
  version: __APP_VERSION__,
} as const;
