import { create } from "zustand";

export type LogLevel = "info" | "warn" | "error";
export type LogFilter = "all" | LogLevel;

export interface LogEntry {
  time: string;
  level: LogLevel;
  message: string;
  detail?: string;
}

export const MAX_LOG_ENTRIES = 300;

interface LogState {
  entries: LogEntry[];
  filter: LogFilter;
  add: (entry: LogEntry) => void;
  /** Mengisi dari IndexedDB saat start, hanya jika belum ada log di memori. */
  hydrate: (stored: LogEntry[]) => void;
  clear: () => void;
  setFilter: (filter: LogFilter) => void;
}

/** Daftar log di memori. Komponen yang membaca store ini ikut update secara live. */
export const useLogStore = create<LogState>((set) => ({
  entries: [],
  filter: "all",
  add: (entry) => set((s) => ({ entries: [...s.entries, entry].slice(-MAX_LOG_ENTRIES) })),
  hydrate: (stored) =>
    set((s) => (s.entries.length === 0 ? { entries: stored.slice(-MAX_LOG_ENTRIES) } : s)),
  clear: () => set({ entries: [] }),
  setFilter: (filter) => set({ filter }),
}));
