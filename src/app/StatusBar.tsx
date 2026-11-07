import { useWorkspaceStore, type WorkspaceStatus } from "@/features/workspace/store";
import { useLogStore } from "@/features/logs/store";
import { env } from "@/lib/env";

const statusText: Record<WorkspaceStatus, string> = {
  unsupported: "Browser tidak mendukung akses folder",
  empty: "Belum ada folder",
  "needs-permission": "Perlu izin untuk membuka folder",
  ready: "",
};

/** Status bar di bawah: kondisi folder, jumlah error terbaru, dan versi. */
export default function StatusBar() {
  const status = useWorkspaceStore((s) => s.status);
  const name = useWorkspaceStore((s) => s.handle?.name);
  const count = useWorkspaceStore((s) => s.entries.length);
  const errors = useLogStore((s) => s.entries.filter((e) => e.level === "error").length);

  const text = status === "ready" ? `${name ?? "Folder"} · ${count} item` : statusText[status];

  return (
    <footer className="flex h-6 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <span className="truncate">{text}</span>
      <div className="flex items-center gap-3">
        {errors > 0 && (
          <span className="text-red-600 dark:text-red-400">{errors} error</span>
        )}
        <span>v{env.version}</span>
      </div>
    </footer>
  );
}
