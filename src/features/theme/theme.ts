import { useThemeStore, type ThemeMode } from "@/features/theme/store";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "light" || mode === "dark") return mode;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

export function applyTheme(mode: ThemeMode) {
  const dark = resolveTheme(mode) === "dark";
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

/** Dipanggil sekali saat app start. Mengembalikan fungsi cleanup. */
export function initTheme(): () => void {
  applyTheme(useThemeStore.getState().mode);

  const unsubscribe = useThemeStore.subscribe((state) => applyTheme(state.mode));

  const media = window.matchMedia(DARK_QUERY);
  const onSystemChange = () => applyTheme(useThemeStore.getState().mode);
  media.addEventListener("change", onSystemChange);

  return () => {
    unsubscribe();
    media.removeEventListener("change", onSystemChange);
  };
}
