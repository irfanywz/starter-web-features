import { describe, it, expect, vi } from "vitest";
import { createBackup, parseBackup, restoreBackup, type BackupSource } from "@/lib/backup";

describe("backup", () => {
  it("menyimpan lalu memulihkan data dengan benar", () => {
    const restore = vi.fn();
    const sources: BackupSource[] = [{ key: "contoh", collect: () => ({ nilai: 1 }), restore }];

    const file = createBackup(sources, "0.8.0");
    const parsed = parseBackup(JSON.stringify(file));

    expect(parsed.sources).toEqual({ contoh: { nilai: 1 } });
    expect(restoreBackup(parsed, sources)).toEqual(["contoh"]);
    expect(restore).toHaveBeenCalledWith({ nilai: 1 });
  });

  it("menolak file yang bukan backup aplikasi", () => {
    expect(() => parseBackup('{"foo":1}')).toThrow("bukan backup");
  });

  it("menolak JSON yang rusak", () => {
    expect(() => parseBackup("{")).toThrow("JSON");
  });
});
