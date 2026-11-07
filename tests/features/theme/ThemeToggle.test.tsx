import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "@/features/theme/ThemeToggle";
import { useThemeStore } from "@/features/theme/store";

describe("ThemeToggle", () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: "system" });
  });

  it("menyiklus tema dari sistem ke terang ke gelap lalu kembali", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Tema: Ikuti sistem" });

    fireEvent.click(button);
    expect(useThemeStore.getState().mode).toBe("light");

    fireEvent.click(button);
    expect(useThemeStore.getState().mode).toBe("dark");

    fireEvent.click(button);
    expect(useThemeStore.getState().mode).toBe("system");
  });
});
