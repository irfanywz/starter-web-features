import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "@/components/ui/Modal";

describe("Modal", () => {
  it("menampilkan judul dan isi", () => {
    render(
      <Modal title="Judul" onClose={() => {}}>
        <p>Isi dialog</p>
      </Modal>
    );

    expect(screen.getByRole("dialog", { name: "Judul" })).toBeInTheDocument();
    expect(screen.getByText("Isi dialog")).toBeInTheDocument();
  });

  it("memanggil onClose saat Escape ditekan", () => {
    const onClose = vi.fn();
    render(
      <Modal title="Judul" onClose={onClose}>
        <p>Isi</p>
      </Modal>
    );

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
