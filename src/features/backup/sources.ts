import type { BackupSource } from "@/lib/backup";
import { useThemeStore, type ThemeMode } from "@/features/theme/store";

const themeModes: string[] = ["system", "light", "dark"];

/**
 * Daftar data yang ikut di backup.
 * Fitur baru yang punya data penting cukup menambah satu entri di sini.
 */
export const backupSources: BackupSource[] = [
  {
    key: "theme",
    collect: () => ({ mode: useThemeStore.getState().mode }),
    restore: (data) => {
      const mode = (data as { mode?: unknown } | null)?.mode;
      if (typeof mode === "string" && themeModes.includes(mode)) {
        useThemeStore.getState().setMode(mode as ThemeMode);
      }
    },
  },
];
