import { describe, it, expect, beforeEach } from "vitest";
import { MAX_LOG_ENTRIES, useLogStore, type LogEntry } from "@/features/logs/store";

function entry(message: string, level: LogEntry["level"] = "info"): LogEntry {
  return { time: "2026-11-07T00:00:00.000Z", level, message };
}

describe("useLogStore", () => {
  beforeEach(() => {
    useLogStore.setState({ entries: [], filter: "all" });
  });

  it("membatasi jumlah entri di memori", () => {
    for (let i = 0; i < MAX_LOG_ENTRIES + 5; i++) {
      useLogStore.getState().add(entry(`pesan ${i}`));
    }

    expect(useLogStore.getState().entries).toHaveLength(MAX_LOG_ENTRIES);
  });

  it("hydrate hanya mengisi jika store masih kosong", () => {
    useLogStore.getState().hydrate([entry("lama")]);
    useLogStore.getState().hydrate([entry("lain")]);

    expect(useLogStore.getState().entries.map((e) => e.message)).toEqual(["lama"]);
  });
});
