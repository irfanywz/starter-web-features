/**
 * Backup dan restore data aplikasi dalam format JSON.
 * Tidak tahu apa-apa soal fitur: setiap fitur mendaftarkan sumbernya sendiri
 * lewat `BackupSource` (lihat features/backup/sources.ts).
 */
export const BACKUP_FORMAT = "web-starter-backup";
export const BACKUP_VERSION = 1;

export interface BackupSource {
  /** Nama unik bagian data, misalnya "theme". */
  key: string;
  /** Mengambil data yang akan disimpan. Harus bisa di-JSON-kan. */
  collect: () => unknown;
  /** Menerapkan data dari backup. Wajib memvalidasi isinya sendiri. */
  restore: (data: unknown) => void;
}

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: number;
  createdAt: string;
  appVersion: string;
  sources: Record<string, unknown>;
}

export function createBackup(sources: BackupSource[], appVersion: string): BackupFile {
  const data: Record<string, unknown> = {};
  for (const source of sources) {
    data[source.key] = source.collect();
  }
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    appVersion,
    sources: data,
  };
}

/** Membaca teks backup dan memastikan formatnya benar. Melempar Error dengan pesan Indonesia. */
export function parseBackup(text: string): BackupFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("File bukan JSON yang valid");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("File ini bukan backup aplikasi");
  }

  const file = parsed as Partial<BackupFile>;
  if (file.format !== BACKUP_FORMAT) {
    throw new Error("File ini bukan backup aplikasi");
  }
  if (file.version !== BACKUP_VERSION) {
    throw new Error(`Versi backup tidak didukung: ${String(file.version)}`);
  }
  if (!file.sources || typeof file.sources !== "object") {
    throw new Error("Isi backup rusak");
  }

  return file as BackupFile;
}

/** Menerapkan bagian backup yang cocok dengan sumber yang terdaftar. Mengembalikan daftar key yang dipulihkan. */
export function restoreBackup(file: BackupFile, sources: BackupSource[]): string[] {
  const restored: string[] = [];
  for (const source of sources) {
    if (source.key in file.sources) {
      source.restore(file.sources[source.key]);
      restored.push(source.key);
    }
  }
  return restored;
}
