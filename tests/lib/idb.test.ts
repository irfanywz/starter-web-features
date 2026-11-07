import { describe, it, expect } from "vitest";
import { idb } from "@/lib/idb";

describe("idb", () => {
  it("menyimpan, membaca, dan menghapus nilai", async () => {
    await idb.set("nama", { kota: "Jakarta" });
    expect(await idb.get<{ kota: string }>("nama")).toEqual({ kota: "Jakarta" });

    await idb.del("nama");
    expect(await idb.get("nama")).toBeUndefined();
  });
});
