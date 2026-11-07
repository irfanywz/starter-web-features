import { create } from "zustand";
import { idb } from "@/lib/idb";
import {
  HANDLE_KEY,
  ensurePermission,
  isFsAccessSupported,
  listEntries,
  pickDirectory,
  type FileEntry,
} from "@/features/workspace/fsAccess";
import { toast } from "@/features/toast/store";

export type WorkspaceStatus = "unsupported" | "empty" | "needs-permission" | "ready";

interface WorkspaceState {
  status: WorkspaceStatus;
  handle: FileSystemDirectoryHandle | null;
  entries: FileEntry[];
  init: () => Promise<void>;
  chooseFolder: () => Promise<void>;
  grantAccess: () => Promise<void>;
  refresh: () => Promise<void>;
  forget: () => Promise<void>;
}

/**
 * State folder kerja. Handle disimpan di IndexedDB supaya tetap ingat
 * folder terakhir walaupun aplikasi ditutup.
 */
export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  status: "empty",
  handle: null,
  entries: [],

  init: async () => {
    if (!isFsAccessSupported()) {
      set({ status: "unsupported" });
      return;
    }

    const saved = await idb.get<FileSystemDirectoryHandle>(HANDLE_KEY);
    if (!saved) {
      set({ status: "empty", handle: null });
      return;
    }

    const permission = await saved.queryPermission({ mode: "readwrite" });
    if (permission === "granted") {
      set({ handle: saved, status: "ready" });
      await get().refresh();
    } else {
      set({ handle: saved, status: "needs-permission" });
    }
  },

  chooseFolder: async () => {
    try {
      const handle = await pickDirectory();
      await idb.set(HANDLE_KEY, handle);
      set({ handle, status: "ready" });
      await get().refresh();
      toast.success(`Folder "${handle.name}" dipilih`);
    } catch (err) {
      // User menutup dialog, bukan error
      if (err instanceof DOMException && err.name === "AbortError") return;
      toast.error("Gagal memilih folder");
    }
  },

  grantAccess: async () => {
    const { handle } = get();
    if (!handle) return;

    const granted = await ensurePermission(handle);
    if (!granted) {
      toast.warning("Akses folder ditolak");
      return;
    }

    set({ status: "ready" });
    await get().refresh();
  },

  refresh: async () => {
    const { handle } = get();
    if (!handle) return;

    try {
      set({ entries: await listEntries(handle) });
    } catch {
      toast.error("Folder tidak bisa dibaca. Mungkin sudah dipindah atau dihapus.");
    }
  },

  forget: async () => {
    await idb.del(HANDLE_KEY);
    set({ handle: null, entries: [], status: "empty" });
    toast.info("Folder dilupakan");
  },
}));
