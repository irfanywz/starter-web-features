import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SegmentedControl from "@/components/ui/SegmentedControl";

describe("SegmentedControl", () => {
  it("menandai opsi aktif dan memanggil onChange saat opsi lain diklik", () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="Tema"
        value="system"
        onChange={onChange}
        options={[
          { value: "system", label: "Sistem" },
          { value: "dark", label: "Gelap" },
        ]}
      />
    );

    expect(screen.getByRole("radio", { name: "Sistem" })).toHaveAttribute("aria-checked", "true");

    fireEvent.click(screen.getByRole("radio", { name: "Gelap" }));

    expect(onChange).toHaveBeenCalledWith("dark");
  });
});
