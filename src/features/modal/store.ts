import { create } from "zustand";

export type ModalName = "settings";

interface ModalState {
  active: ModalName | null;
  open: (name: ModalName) => void;
  close: () => void;
}

/** Satu store untuk semua modal: hanya satu modal yang terbuka dalam satu waktu. */
export const useModalStore = create<ModalState>((set) => ({
  active: null,
  open: (name) => set({ active: name }),
  close: () => set({ active: null }),
}));
