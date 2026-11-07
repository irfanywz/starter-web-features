import { useEffect, useState, type ReactNode } from "react";
import {
  IconDatabase,
  IconDeviceDesktop,
  IconDownload,
  IconFileText,
  IconInfoCircle,
  IconMoon,
  IconPalette,
  IconShieldCheck,
  IconSun,
  IconTrash,
} from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import SegmentedControl from "@/components/ui/SegmentedControl";
import BackupPanel from "@/features/backup/BackupPanel";
import { env } from "@/lib/env";
import { downloadText } from "@/lib/download";
import { cn } from "@/lib/utils";
import { isStoragePersisted, requestPersistentStorage } from "@/lib/storage";
import { clearLogs, formatLogs, getLogs } from "@/features/logs/logger";
import LogViewer from "@/features/logs/LogViewer";
import { useThemeStore, type ThemeMode } from "@/features/theme/store";
import { useModalStore } from "@/features/modal/store";
import { toast } from "@/features/toast/store";

const tabs = [
  { id: "tampilan", label: "Tampilan", Icon: IconPalette },
  { id: "data", label: "Data", Icon: IconDatabase },
  { id: "penyimpanan", label: "Penyimpanan", Icon: IconShieldCheck },
  { id: "log", label: "Log", Icon: IconFileText },
  { id: "tentang", label: "Tentang", Icon: IconInfoCircle },
] as const;

type TabId = (typeof tabs)[number]["id"];

function Heading({ children }: { children: ReactNode }) {
  return <h3 className="text-base font-semibold">{children}</h3>;
}

/** Jendela preferensi: navigasi kategori di kiri, isi di kanan. */
export default function SettingsModal() {
  const close = useModalStore((s) => s.close);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const [tab, setTab] = useState<TabId>("tampilan");
  const [persisted, setPersisted] = useState<boolean | null>(null);

  useEffect(() => {
    void isStoragePersisted().then(setPersisted);
  }, []);

  const handleRequestPersist = async () => {
    const ok = await requestPersistentStorage();
    setPersisted(ok);
    if (ok) toast.success("Penyimpanan persisten aktif");
    else toast.warning("Browser belum mengizinkan penyimpanan persisten");
  };

  const handleDownloadLogs = async () => {
    const logs = await getLogs();
    if (logs.length === 0) {
      toast.info("Belum ada log");
      return;
    }
    const date = new Date().toISOString().slice(0, 10);
    downloadText(
      `${env.appName.toLowerCase().replace(/\s+/g, "-")}-log-${date}.txt`,
      formatLogs(logs)
    );
  };

  const handleClearLogs = async () => {
    await clearLogs();
    toast.info("Log dihapus");
  };

  return (
    <Modal title="Pengaturan" onClose={close} layout="window">
      <nav className="flex w-48 shrink-0 flex-col gap-1 border-r border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition",
              tab === id
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <section className="flex min-w-0 flex-1 flex-col overflow-y-auto p-6 text-sm">
        {tab === "tampilan" && (
          <div className="space-y-4">
            <Heading>Tampilan</Heading>
            <div className="space-y-2">
              <p className="text-slate-600 dark:text-slate-400">Tema</p>
              <SegmentedControl<ThemeMode>
                label="Tema"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "system", label: "Sistem", icon: <IconDeviceDesktop size={15} /> },
                  { value: "light", label: "Terang", icon: <IconSun size={15} /> },
                  { value: "dark", label: "Gelap", icon: <IconMoon size={15} /> },
                ]}
              />
            </div>
          </div>
        )}

        {tab === "data" && <BackupPanel />}

        {tab === "penyimpanan" && (
          <div className="space-y-4">
            <Heading>Penyimpanan</Heading>
            {persisted === null && <p className="text-slate-500">Memeriksa...</p>}
            {persisted === true && (
              <p className="text-emerald-600 dark:text-emerald-400">
                Aktif. Browser tidak akan menghapus data secara otomatis.
              </p>
            )}
            {persisted === false && (
              <div className="space-y-3">
                <p className="text-amber-600 dark:text-amber-400">
                  Belum aktif. Browser bisa menghapus data saat penyimpanan hampir penuh.
                </p>
                <Button onClick={() => void handleRequestPersist()}>Minta izin penyimpanan</Button>
              </div>
            )}
          </div>
        )}

        {tab === "log" && (
          <div className="flex h-full min-h-0 flex-col gap-3">
            <div className="flex items-center justify-between">
              <Heading>Log aplikasi</Heading>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  icon={<IconDownload size={16} />}
                  onClick={() => void handleDownloadLogs()}
                >
                  Unduh
                </Button>
                <Button
                  variant="danger"
                  icon={<IconTrash size={16} />}
                  onClick={() => void handleClearLogs()}
                >
                  Hapus
                </Button>
              </div>
            </div>
            <LogViewer />
          </div>
        )}

        {tab === "tentang" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
              <IconInfoCircle size={32} />
            </div>
            <h2 className="text-xl font-bold">{env.appName}</h2>
            <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium dark:bg-slate-800">
              Versi {env.version}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">Mode {env.mode}</p>
          </div>
        )}
      </section>
    </Modal>
  );
}
