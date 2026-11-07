import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("menggabungkan class", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("mengabaikan nilai falsy", () => {
    expect(cn("a", false, undefined, "c")).toBe("a c");
  });
});
