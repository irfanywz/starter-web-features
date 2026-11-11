/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_API_BASE_URL?: string;
}

/** Diisi otomatis dari versi di package.json lewat vite.config.ts */
declare const __APP_VERSION__: string;
