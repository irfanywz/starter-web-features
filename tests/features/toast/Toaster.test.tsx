import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import Toaster from "@/features/toast/Toaster";
import { toast, useToastStore } from "@/features/toast/store";

describe("Toaster", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it("menampilkan toast error dengan role alert", () => {
    render(<Toaster />);

    act(() => {
      toast.error("Koneksi gagal");
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Koneksi gagal");
  });

  it("toast bisa ditutup manual", () => {
    render(<Toaster />);

    act(() => {
      toast.info("Catatan");
    });
    act(() => {
      screen.getByRole("button", { name: "Tutup notifikasi" }).click();
    });

    expect(screen.queryByText("Catatan")).not.toBeInTheDocument();
  });
});
