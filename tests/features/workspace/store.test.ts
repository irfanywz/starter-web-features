import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { idb } from "@/lib/idb";
import { useWorkspaceStore } from "@/features/workspace/store";

vi.mock("@/lib/idb", () => ({
  idb: { get: vi.fn(), set: vi.fn(), del: vi.fn() },
}));

function setSupported(on: boolean) {
  const g = globalThis as unknown as Record<string, unknown>;
  if (on) g.showDirectoryPicker = vi.fn();
  else delete g.showDirectoryPicker;
}

function fakeDir(permission: "granted" | "prompt") {
  return {
    name: "proyek",
    kind: "directory",
    queryPermission: vi.fn().mockResolvedValue(permission),
    requestPermission: vi.fn().mockResolvedValue("granted"),
    async *values() {
      yield { name: "b.txt", kind: "file" };
      yield { name: "src", kind: "directory" };
    },
  };
}

describe("useWorkspaceStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useWorkspaceStore.setState({ status: "empty", handle: null, entries: [] });
  });

  afterEach(() => {
    setSupported(false);
  });

  it("status unsupported jika browser tidak punya File System Access", async () => {
    setSupported(false);

    await useWorkspaceStore.getState().init();

    expect(useWorkspaceStore.getState().status).toBe("unsupported");
  });

  it("status empty jika belum ada folder tersimpan", async () => {
    setSupported(true);
    vi.mocked(idb.get).mockResolvedValue(undefined);

    await useWorkspaceStore.getState().init();

    expect(useWorkspaceStore.getState().status).toBe("empty");
  });

  it("meminta izin ulang jika handle tersimpan belum granted", async () => {
    setSupported(true);
    vi.mocked(idb.get).mockResolvedValue(fakeDir("prompt") as never);

    await useWorkspaceStore.getState().init();

    expect(useWorkspaceStore.getState().status).toBe("needs-permission");
    expect(useWorkspaceStore.getState().entries).toHaveLength(0);
  });

  it("langsung ready dan memuat isi folder jika izin masih granted", async () => {
    setSupported(true);
    vi.mocked(idb.get).mockResolvedValue(fakeDir("granted") as never);

    await useWorkspaceStore.getState().init();

    const state = useWorkspaceStore.getState();
    expect(state.status).toBe("ready");
    expect(state.entries.map((e) => e.name)).toEqual(["src", "b.txt"]);
  });
});
