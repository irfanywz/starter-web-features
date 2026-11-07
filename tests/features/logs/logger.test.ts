import { describe, it, expect, beforeEach } from "vitest";
import { clearLogs, flushLogs, formatLogs, getLogs, logger } from "@/features/logs/logger";

describe("logger", () => {
  beforeEach(async () => {
    await clearLogs();
  });

  it("menyimpan log dengan level dan pesan", async () => {
    logger.error("Gagal memuat", "stack trace");
    await flushLogs();

    const [entry] = await getLogs();
    expect(entry).toMatchObject({ level: "error", message: "Gagal memuat", detail: "stack trace" });
  });

  it("hanya menyimpan 300 entri terakhir", async () => {
    for (let i = 0; i < 302; i++) logger.info(`pesan ${i}`);
    await flushLogs();

    const logs = await getLogs();
    expect(logs).toHaveLength(300);
    expect(logs[0].message).toBe("pesan 2");
  });

  it("formatLogs menghasilkan teks per baris", () => {
    const text = formatLogs([
      { time: "2026-11-07T00:00:00.000Z", level: "warn", message: "Perhatian" },
    ]);
    expect(text).toBe("[2026-11-07T00:00:00.000Z] WARN Perhatian");
  });
});
