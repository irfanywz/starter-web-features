import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { applyTheme, resolveTheme } from "@/features/theme/theme";

function mockSystemDark(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as typeof window.matchMedia;
}

describe("theme", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mode light dan dark langsung dipakai", () => {
    mockSystemDark(true);
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("mode system mengikuti preferensi OS", () => {
    mockSystemDark(true);
    expect(resolveTheme("system")).toBe("dark");

    mockSystemDark(false);
    expect(resolveTheme("system")).toBe("light");
  });

  it("applyTheme menambah class dark di <html>", () => {
    applyTheme("dark");
    expect(document.documentElement).toHaveClass("dark");

    applyTheme("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });
});
