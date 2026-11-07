import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/ui/Button";

describe("Button", () => {
  it("memanggil onClick saat diklik", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Simpan</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Simpan" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("menerapkan style variant danger", () => {
    render(<Button variant="danger">Hapus</Button>);

    expect(screen.getByRole("button")).toHaveClass("bg-red-600");
  });
});
