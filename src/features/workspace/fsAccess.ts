/**
 * Helper untuk File System Access API.
 * Hanya tersedia di browser berbasis Chromium (Chrome, Edge).
 */
export const HANDLE_KEY = "workspace-dir";

export interface FileEntry {
  name: string;
  kind: "file" | "directory";
}

export function isFsAccessSupported(): boolean {
  return "showDirectoryPicker" in globalThis;
}

/** Membuka dialog pilih folder. Melempar AbortError kalau user membatalkan. */
export function pickDirectory(): Promise<FileSystemDirectoryHandle> {
  return showDirectoryPicker({ mode: "readwrite" });
}

/**
 * Memastikan izin baca-tulis ke folder.
 * Jika belum diberikan, akan memunculkan prompt. Harus dipanggil dari klik user.
 */
export async function ensurePermission(handle: FileSystemDirectoryHandle): Promise<boolean> {
  const options: FileSystemHandlePermissionDescriptor = { mode: "readwrite" };
  if ((await handle.queryPermission(options)) === "granted") return true;
  return (await handle.requestPermission(options)) === "granted";
}

/** Daftar isi folder, folder ditampilkan lebih dulu, lalu urut nama. */
export async function listEntries(dir: FileSystemDirectoryHandle): Promise<FileEntry[]> {
  const entries: FileEntry[] = [];
  for await (const entry of dir.values()) {
    entries.push({ name: entry.name, kind: entry.kind });
  }
  return entries.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
