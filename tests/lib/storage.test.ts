import { describe, it, expect, vi, afterEach } from "vitest";
import { isStoragePersisted, requestPersistentStorage } from "@/lib/storage";

function mockStorage(persisted: boolean, persistResult: boolean) {
  Object.defineProperty(navigator, "storage", {
    configurable: true,
    value: {
      persisted: vi.fn().mockResolvedValue(persisted),
      persist: vi.fn().mockResolvedValue(persistResult),
    },
  });
}

describe("storage", () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, "storage");
  });

  it("mengembalikan false jika browser tidak mendukung navigator.storage", async () => {
    expect(await isStoragePersisted()).toBe(false);
    expect(await requestPersistentStorage()).toBe(false);
  });

  it("tidak meminta ulang jika sudah persisten", async () => {
    mockStorage(true, true);

    expect(await requestPersistentStorage()).toBe(true);
    expect(navigator.storage.persist).not.toHaveBeenCalled();
  });

  it("meminta persisten jika belum aktif", async () => {
    mockStorage(false, true);

    expect(await requestPersistentStorage()).toBe(true);
    expect(navigator.storage.persist).toHaveBeenCalledTimes(1);
  });
});
