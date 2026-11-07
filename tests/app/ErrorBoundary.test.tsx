import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "@/app/ErrorBoundary";

function Bomb(): never {
  throw new Error("Boom");
}

describe("ErrorBoundary", () => {
  it("menampilkan children jika tidak ada error", () => {
    render(
      <ErrorBoundary>
        <p>Aman</p>
      </ErrorBoundary>
    );

    expect(screen.getByText("Aman")).toBeInTheDocument();
  });

  it("menampilkan fallback saat child melempar error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Boom");
    spy.mockRestore();
  });
});
