import { describe, it, expect, vi } from "vitest";
import { ensurePermission, listEntries } from "@/features/workspace/fsAccess";

function fakeDir(
  entries: { name: string; kind: "file" | "directory" }[],
  permission: "granted" | "prompt" = "granted"
) {
  return {
    name: "proyek",
    kind: "directory",
    queryPermission: vi.fn().mockResolvedValue(permission),
    requestPermission: vi.fn().mockResolvedValue("granted"),
    async *values() {
      for (const entry of entries) yield entry;
    },
  } as unknown as FileSystemDirectoryHandle;
}

describe("listEntries", () => {
  it("menampilkan folder dulu lalu urut nama", async () => {
    const dir = fakeDir([
      { name: "b.txt", kind: "file" },
      { name: "zeta", kind: "directory" },
      { name: "a.txt", kind: "file" },
      { name: "alpha", kind: "directory" },
    ]);

    const result = await listEntries(dir);

    expect(result.map((e) => e.name)).toEqual(["alpha", "zeta", "a.txt", "b.txt"]);
  });
});

describe("ensurePermission", () => {
  it("tidak meminta izin lagi jika sudah granted", async () => {
    const dir = fakeDir([], "granted");

    expect(await ensurePermission(dir)).toBe(true);
    expect(dir.requestPermission).not.toHaveBeenCalled();
  });

  it("meminta izin jika status masih prompt", async () => {
    const dir = fakeDir([], "prompt");

    expect(await ensurePermission(dir)).toBe(true);
    expect(dir.requestPermission).toHaveBeenCalledTimes(1);
  });
});
