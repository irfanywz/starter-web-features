import { IconApps, IconSettings } from "@tabler/icons-react";
import ThemeToggle from "@/features/theme/ThemeToggle";
import { useModalStore } from "@/features/modal/store";
import { env } from "@/lib/env";

const menuButton =
  "rounded-md p-1.5 text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800";

/** Menu bar tipis di atas, seperti title bar aplikasi desktop. */
export default function Navbar() {
  const open = useModalStore((s) => s.open);

  return (
    <header className="flex h-10 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <IconApps size={18} className="text-indigo-600 dark:text-indigo-400" />
        {env.appName}
      </div>
      <div className="flex items-center gap-0.5">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Pengaturan"
          title="Pengaturan"
          className={menuButton}
          onClick={() => open("settings")}
        >
          <IconSettings size={16} />
        </button>
      </div>
    </header>
  );
}
