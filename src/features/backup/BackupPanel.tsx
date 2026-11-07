import { useRef, type ChangeEvent } from "react";
import { IconDownload, IconUpload } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import { env } from "@/lib/env";
import { downloadText } from "@/lib/download";
import { createBackup, parseBackup, restoreBackup } from "@/lib/backup";
import { backupSources } from "@/features/backup/sources";
import { toast } from "@/features/toast/store";

/** Ekspor dan impor data aplikasi sebagai file JSON. */
export default function BackupPanel() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const backup = createBackup(backupSources, env.version);
    const slug = env.appName.toLowerCase().replace(/\s+/g, "-");
    const date = new Date().toISOString().slice(0, 10);
    downloadText(`${slug}-backup-${date}.json`, JSON.stringify(backup, null, 2), "application/json");
    toast.success("Backup diunduh");
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const backup = parseBackup(await file.text());
      if (!window.confirm("Pengaturan saat ini akan ditimpa dengan isi backup. Lanjutkan?")) return;
      const restored = restoreBackup(backup, backupSources);
      toast.success(`Backup dipulihkan (${restored.length} bagian)`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memulihkan backup");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">Data</h3>
      <p className="text-slate-500 dark:text-slate-400">
        Simpan pengaturan ke file JSON, lalu pulihkan di mesin atau browser lain.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button icon={<IconDownload size={16} />} onClick={handleExport}>
          Ekspor backup
        </Button>
        <Button
          variant="secondary"
          icon={<IconUpload size={16} />}
          onClick={() => inputRef.current?.click()}
        >
          Impor backup
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => void handleImport(e)}
        />
      </div>
    </div>
  );
}
