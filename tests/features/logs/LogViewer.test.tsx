import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import LogViewer from "@/features/logs/LogViewer";
import { useLogStore } from "@/features/logs/store";

describe("LogViewer", () => {
  beforeEach(() => {
    useLogStore.setState({ entries: [], filter: "all" });
  });

  it("menampilkan log baru secara live", () => {
    render(<LogViewer />);
    expect(screen.getByText("Belum ada log.")).toBeInTheDocument();

    act(() => {
      useLogStore.getState().add({ time: new Date().toISOString(), level: "info", message: "Halo dunia" });
    });

    expect(screen.getByText("Halo dunia")).toBeInTheDocument();
  });

  it("filter Error hanya menampilkan entri error", () => {
    useLogStore.setState({
      entries: [
        { time: new Date().toISOString(), level: "info", message: "info-msg" },
        { time: new Date().toISOString(), level: "error", message: "error-msg" },
      ],
    });
    render(<LogViewer />);

    fireEvent.click(screen.getByRole("button", { name: "Error" }));

    expect(screen.getByText("error-msg")).toBeInTheDocument();
    expect(screen.queryByText("info-msg")).not.toBeInTheDocument();
  });
});
