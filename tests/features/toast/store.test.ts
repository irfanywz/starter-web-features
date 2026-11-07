import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { toast, useToastStore } from "@/features/toast/store";

describe("useToastStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("menambah toast dengan tipe yang sesuai", () => {
    toast.success("Berhasil disimpan");

    const [t] = useToastStore.getState().toasts;
    expect(t).toMatchObject({ message: "Berhasil disimpan", type: "success" });
  });

  it("toast hilang otomatis setelah 4 detik", () => {
    toast.error("Gagal");
    expect(useToastStore.getState().toasts).toHaveLength(1);

    vi.advanceTimersByTime(4000);

    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("dismiss hanya menghapus toast yang dipilih", () => {
    const idA = useToastStore.getState().show("A");
    useToastStore.getState().show("B");

    useToastStore.getState().dismiss(idA);

    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe("B");
  });
});
