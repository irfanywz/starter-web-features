import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "@/App";
import { useModalStore } from "@/features/modal/store";

describe("App", () => {
  beforeEach(() => {
    useModalStore.setState({ active: null });
  });

  it("menampilkan halaman workspace di layar utama", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Workspace" })).toBeInTheDocument();
  });

  it("membuka Pengaturan dan menutupnya dengan Escape", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Pengaturan" }));
    expect(await screen.findByRole("dialog", { name: "Pengaturan" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("menampilkan info aplikasi lewat tab Tentang di Pengaturan", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Pengaturan" }));
    fireEvent.click(await screen.findByRole("button", { name: "Tentang" }));

    expect(screen.getByText(/Versi/)).toBeInTheDocument();
  });
});
