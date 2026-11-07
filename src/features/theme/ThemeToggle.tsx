import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";
import { useThemeStore, type ThemeMode } from "@/features/theme/store";

const nextMode: Record<ThemeMode, ThemeMode> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const modeMeta: Record<ThemeMode, { label: string; Icon: typeof IconSun }> = {
  system: { label: "Ikuti sistem", Icon: IconDeviceDesktop },
  light: { label: "Terang", Icon: IconSun },
  dark: { label: "Gelap", Icon: IconMoon },
};

/** Tombol untuk siklus tema: sistem → terang → gelap → sistem. */
export default function ThemeToggle() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const { label, Icon } = modeMeta[mode];

  return (
    <button
      type="button"
      onClick={() => setMode(nextMode[mode])}
      aria-label={`Tema: ${label}`}
      title={`Tema: ${label}`}
      className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      <Icon size={18} />
    </button>
  );
}
