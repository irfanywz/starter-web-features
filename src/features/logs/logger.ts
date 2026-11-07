import { idb } from "@/lib/idb";
import { useLogStore, MAX_LOG_ENTRIES, type LogEntry, type LogLevel } from "@/features/logs/store";

export type { LogEntry, LogLevel } from "@/features/logs/store";

/**
 * Log dicatat ke dua tempat:
 * - store di memori (useLogStore), supaya UI bisa menampilkan live
 * - IndexedDB, supaya log tetap ada setelah aplikasi ditutup
 */
const LOG_KEY = "app-logs";

// Antrean tulis supaya beberapa log yang datang bersamaan tidak saling menimpa
let pending: Promise<void> = Promise.resolve();

function persist(entry: LogEntry) {
  pending = pending
    .then(async () => {
      const logs = (await idb.get<LogEntry[]>(LOG_KEY)) ?? [];
      logs.push(entry);
      await idb.set(LOG_KEY, logs.slice(-MAX_LOG_ENTRIES));
    })
    .catch((err) => console.error("Gagal menulis log:", err));
}

function record(level: LogLevel, message: string, detail?: string) {
  const entry: LogEntry = { time: new Date().toISOString(), level, message, detail };
  useLogStore.getState().add(entry);
  persist(entry);
}

export const logger = {
  info: (message: string, detail?: string) => record("info", message, detail),
  warn: (message: string, detail?: string) => record("warn", message, detail),
  error: (message: string, detail?: string) => record("error", message, detail),
};

/** Menunggu semua log yang sedang antre selesai ditulis. */
export function flushLogs(): Promise<void> {
  return pending;
}

export async function getLogs(): Promise<LogEntry[]> {
  await pending;
  return (await idb.get<LogEntry[]>(LOG_KEY)) ?? [];
}

/** Memuat log tersimpan ke store saat aplikasi start. */
export async function hydrateLogs(): Promise<void> {
  useLogStore.getState().hydrate(await getLogs());
}

export async function clearLogs(): Promise<void> {
  await pending;
  await idb.del(LOG_KEY);
  useLogStore.getState().clear();
}

export function formatLogs(logs: LogEntry[]): string {
  return logs
    .map((l) => `[${l.time}] ${l.level.toUpperCase()} ${l.message}${l.detail ? `\n${l.detail}` : ""}`)
    .join("\n");
}

/** Mencatat error yang tidak ditangkap oleh komponen mana pun. */
export function installGlobalErrorHandlers() {
  window.addEventListener("error", (event) => {
    logger.error("Uncaught error", event.error?.stack ?? event.message);
  });
  window.addEventListener("unhandledrejection", (event) => {
    logger.error("Unhandled rejection", String(event.reason?.stack ?? event.reason));
  });
}
