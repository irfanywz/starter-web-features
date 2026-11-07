import { useEffect, type ReactNode } from "react";
import {
  IconFile,
  IconFolder,
  IconFolderOpen,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/features/workspace/store";

function ToolButton({
  label,
  icon,
  onClick,
  danger,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "rounded-md p-1.5 transition",
        danger
          ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          : "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
      )}
    >
      {icon}
    </button>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
      {children}
    </div>
  );
}

/** Layar utama: toolbar di atas, daftar isi folder mengisi sisa layar. */
export default function WorkspacePage() {
  const status = useWorkspaceStore((s) => s.status);
  const handle = useWorkspaceStore((s) => s.handle);
  const entries = useWorkspaceStore((s) => s.entries);
  const { init, chooseFolder, grantAccess, refresh, forget } = useWorkspaceStore();

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-900/60">
        <h1 className="truncate text-sm font-semibold">
          {status === "ready" && handle ? handle.name : "Workspace"}
        </h1>
        {status === "ready" && (
          <div className="flex items-center gap-0.5">
            <ToolButton label="Muat ulang" icon={<IconRefresh size={16} />} onClick={() => void refresh()} />
            <ToolButton label="Ganti folder" icon={<IconFolderOpen size={16} />} onClick={() => void chooseFolder()} />
            <ToolButton label="Lupakan folder" icon={<IconTrash size={16} />} onClick={() => void forget()} danger />
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        {status === "unsupported" && (
          <Empty>
            Browser ini belum mendukung akses folder. Gunakan Google Chrome atau Microsoft Edge.
          </Empty>
        )}

        {status === "empty" && (
          <Empty>
            <p>Belum ada folder yang dipilih.</p>
            <Button onClick={() => void chooseFolder()} icon={<IconFolderOpen size={16} />}>
              Pilih folder
            </Button>
          </Empty>
        )}

        {status === "needs-permission" && (
          <Empty>
            <p>
              Folder terakhir: <strong className="text-slate-900 dark:text-slate-100">{handle?.name}</strong>
            </p>
            <p>Browser meminta izin ulang setelah aplikasi dibuka kembali.</p>
            <div className="flex gap-2">
              <Button onClick={() => void grantAccess()}>Berikan akses</Button>
              <Button variant="secondary" onClick={() => void forget()}>
                Lupakan folder
              </Button>
            </div>
          </Empty>
        )}

        {status === "ready" && (
          <>
            <div className="grid shrink-0 grid-cols-[1fr_auto] border-b border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <span>Nama</span>
              <span>Jenis</span>
            </div>
            <ul>
              {entries.map((entry) => (
                <li
                  key={entry.name}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-slate-100 px-4 py-1.5 text-sm hover:bg-indigo-50 dark:border-slate-800/60 dark:hover:bg-slate-800"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {entry.kind === "directory" ? (
                      <IconFolder size={16} className="shrink-0 text-amber-500" />
                    ) : (
                      <IconFile size={16} className="shrink-0 text-slate-400" />
                    )}
                    <span className="truncate">{entry.name}</span>
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {entry.kind === "directory" ? "Folder" : "File"}
                  </span>
                </li>
              ))}
            </ul>
            {entries.length === 0 && (
              <p className="p-8 text-center text-sm text-slate-400 dark:text-slate-500">
                Folder kosong.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
